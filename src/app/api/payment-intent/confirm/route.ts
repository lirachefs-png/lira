import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';
import { sendBookingConfirmation } from '@/lib/booking-email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paymentIntentId, offerId, passengers, selectedServices, flightDetails } = body;

        if (!paymentIntentId || !offerId || !passengers?.length) {
            return NextResponse.json(
                { error: 'paymentIntentId, offerId and passengers are required' },
                { status: 400 }
            );
        }

        console.log('Confirming PaymentIntent:', paymentIntentId);

        // 1. Confirm the PaymentIntent
        const confirmedIntent = await duffel.paymentIntents.confirm(paymentIntentId);
        console.log('PaymentIntent confirmed:', confirmedIntent.data.status);

        if (confirmedIntent.data.status !== 'succeeded') {
            return NextResponse.json(
                { error: 'Payment confirmation failed', status: confirmedIntent.data.status },
                { status: 400 }
            );
        }

        // 2. Map passengers to Duffel format
        const duffelPassengers = passengers.map((p: any) => ({
            id: p.id,
            given_name: p.given_name,
            family_name: p.family_name,
            gender: p.gender,
            title: p.title || 'mr',
            born_on: p.born_on,
            email: p.email,
            phone_number: p.phone_number || '+351000000000',
        }));

        // 3. Create the Order with balance (Duffel Payments)
        console.log('Creating Order with Duffel Payments...');

        const orderPayload: any = {
            type: 'instant',
            selected_offers: [offerId],
            passengers: duffelPassengers,
            payments: [
                {
                    type: 'balance',
                    amount: confirmedIntent.data.amount,
                    currency: confirmedIntent.data.currency,
                }
            ],
        };

        // Add services if selected
        if (selectedServices?.length > 0) {
            orderPayload.services = selectedServices.map((s: any) => ({
                id: s.id,
                quantity: 1,
            }));
        }

        const order = await duffel.orders.create(orderPayload);

        console.log('Order created:', order.data.id, 'Booking ref:', order.data.booking_reference);

        // 4. Send confirmation email
        const primaryPassenger = passengers[0];
        if (primaryPassenger?.email) {
            try {
                // Extract flight details from the order or use passed data
                const slice = order.data.slices?.[0];
                const segment = slice?.segments?.[0];

                await sendBookingConfirmation({
                    to: primaryPassenger.email,
                    passengerName: `${primaryPassenger.given_name} ${primaryPassenger.family_name}`,
                    bookingReference: order.data.booking_reference || 'N/A',
                    orderId: order.data.id,
                    flightDetails: flightDetails || {
                        origin: segment?.origin?.iata_code || 'N/A',
                        destination: segment?.destination?.iata_code || 'N/A',
                        departureDate: segment?.departing_at?.split('T')[0] || 'N/A',
                        departureTime: segment?.departing_at?.split('T')[1]?.substring(0, 5) || 'N/A',
                        airline: order.data.owner?.name || 'Airline',
                    },
                    totalAmount: confirmedIntent.data.amount,
                    currency: confirmedIntent.data.currency,
                });
                console.log('📧 Confirmation email sent to:', primaryPassenger.email);
            } catch (emailError) {
                console.error('Failed to send email (non-blocking):', emailError);
                // Don't fail the order if email fails
            }
        }

        return NextResponse.json({
            success: true,
            orderId: order.data.id,
            bookingReference: order.data.booking_reference,
        });

    } catch (error: any) {
        console.error('Confirm Payment Error:', error);

        // Get detailed error from Duffel API
        const duffelErrors = error?.errors || error?.data?.errors;
        const errorMessage = duffelErrors?.[0]?.message
            || error?.message
            || 'Failed to confirm payment';

        console.error('Duffel Error Details:', JSON.stringify(duffelErrors, null, 2));

        return NextResponse.json(
            { error: errorMessage, details: duffelErrors },
            { status: 500 }
        );
    }
}
