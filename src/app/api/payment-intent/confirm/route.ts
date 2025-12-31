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

        // 2. Create/Get Duffel Customer Users for passengers
        console.log('Creating/Getting Duffel Customer Users...');

        const createCustomerUser = async (passenger: any) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/duffel/customer-users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: passenger.email,
                        given_name: passenger.given_name,
                        family_name: passenger.family_name,
                        phone_number: passenger.phone_number
                    })
                });
                const data = await res.json();
                return data.id || null;
            } catch (err) {
                console.warn('Could not create customer user:', err);
                return null;
            }
        };

        // Create customer users for all passengers
        const customerUserIds = await Promise.all(
            passengers.map((p: any) => createCustomerUser(p))
        );

        // 3. Map passengers to Duffel format with customer_user_id
        const duffelPassengers = passengers.map((p: any, index: number) => ({
            id: p.id,
            given_name: p.given_name,
            family_name: p.family_name,
            gender: p.gender,
            title: p.title || 'mr',
            born_on: p.born_on,
            email: p.email,
            phone_number: p.phone_number || '+351000000000',
            // Link to Duffel Customer User for Assistant support
            ...(customerUserIds[index] && { customer_user_id: customerUserIds[index] })
        }));

        // 4. Create the Order with balance (Duffel Payments)
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

        // Define primary passenger early for use in DB and Email
        const primaryPassenger = passengers[0];

        // --- SAVE TO SUPABASE ---
        try {
            const { createBooking, updateBooking } = await import('@/lib/bookingStore');
            const { createClient } = await import('@/lib/supabase/server');

            // Get the logged-in user's email from Supabase session (more reliable than form email)
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            const loggedInUserEmail = user?.email || primaryPassenger?.email || undefined;

            console.log("🔍 DEBUG - Booking Email Resolution:", {
                loggedInUser: user?.email,
                primaryPassengerEmail: primaryPassenger?.email,
                finalEmail: loggedInUserEmail
            });

            // Stripe session.amount_total is integer cents. Duffel amount is string "100.00".
            // Store as integer cents to be consistent with system.
            const amountCents = Math.round(parseFloat(confirmedIntent.data.amount) * 100);

            // Extract flight details from Duffel Order for My Trips display
            const firstSlice = order.data.slices?.[0];
            const firstSegment = firstSlice?.segments?.[0];
            const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1];

            const flightDetails = {
                origem: firstSegment?.origin?.iata_code || 'N/A',
                destino: lastSegment?.destination?.iata_code || 'N/A',
                airline: order.data.owner?.name || 'Airline',
                departureDate: firstSegment?.departing_at?.split('T')[0] || 'N/A',
            };

            // Merge flight details with passenger data for storage
            const enrichedPassengerData = {
                ...flightDetails,
                passengers: passengers
            };

            // 1. Create Initial Record with all data including booking_reference
            await createBooking(
                paymentIntentId, // Use PaymentIntent ID as the session/transaction ID
                "confirmed",
                loggedInUserEmail, // Use logged-in user email for "My Trips" matching
                amountCents,
                confirmedIntent.data.currency,
                enrichedPassengerData, // Now includes origem, destino, airline
                order.data.booking_reference // Pass booking reference directly
            );

            // Update is now optional but kept for backward compatibility
            await updateBooking(paymentIntentId, {
                state: "confirmed",
                offerId: offerId,
                bookingReference: order.data.booking_reference,
                orderId: order.data.id
            });

            console.log("✅ Booking saved to Supabase (My Trips) for email:", loggedInUserEmail);

        } catch (dbError) {
            console.error("⚠️ Failed to save booking to Supabase:", dbError);
            // Non-blocking
        }
        // ------------------------------

        // 4. Send confirmation email
        console.log('📧 Primary passenger for email:', {
            email: primaryPassenger?.email,
            name: primaryPassenger?.given_name,
            hasEmail: !!primaryPassenger?.email
        });

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
