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
                // Direct call to Duffel API (SDK lacks this method)
                const DUFFEL_API = 'https://api.duffel.com';
                const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN || "";

                // 1. Check if user already exists
                /* (Simplified for checkout speed: just try to create, if fails, ignore) 
                   Refinement: Actually, to be safe and fast, we should just fire the create.
                   If it fails because it exists, we ideally want that ID. But for now, let's keep it simple.
                */

                const response = await fetch(`${DUFFEL_API}/identity/customer_users`, {
                    method: 'POST',
                    headers: {
                        'Duffel-Version': 'v2',
                        'Authorization': `Bearer ${DUFFEL_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            email: passenger.email,
                            given_name: passenger.given_name,
                            family_name: passenger.family_name,
                            ...(passenger.phone_number && { phone_number: passenger.phone_number })
                        }
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // If already exists, we could try to look it up, but for checkout speed we might skip linking
                    // Or ideally, we catch 'email_already_exists' and search.
                    if (data.errors?.[0]?.code === 'email_already_exists') {
                        console.log('Customer already exists, skipping link for speed (or implement lookup if critical)');
                    }
                    return null;
                }

                return data.data.id;
            } catch (err) {
                console.warn('Could not create customer user (Direct Fetch):', err);
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
            identity_documents: p.identity_documents,
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

        // --- SAVE TO DATABASE (MOCK/REMOVED) ---
        // Previously saved to Supabase. Now just logging.
        try {
            console.log("📝 Booking created (DB save skipped as Supabase is removed):", order.data.booking_reference);
        } catch (dbError) {
            console.error("⚠️ Mock DB Error:", dbError);
        }
        // ------------------------------

        // 4. Send confirmation email
        console.log('📧 Primary passenger for email:', {
            email: primaryPassenger?.email,
            name: primaryPassenger?.given_name,
            hasEmail: !!primaryPassenger?.email
        });

        if (primaryPassenger?.email) {
            // FIRE AND FORGET - Do not await to prevent blocking the checkout response
            const emailPromise = async () => {
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
                    console.error('Failed to send email (background):', emailError);
                }
            };

            // Execute without awaiting
            emailPromise().catch(err => console.error("Email promise failed:", err));
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
