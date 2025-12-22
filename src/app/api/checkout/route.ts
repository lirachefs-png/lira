import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { duffel } from '@/lib/duffel';

export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Missing STRIPE_SECRET_KEY');
        return NextResponse.json({ error: 'Server Misconfiguration: Missing Stripe Key (Restart Server?)' }, { status: 500 });
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const body = await request.json();
        console.log('Checkout Request:', body);

        const {
            offerId,
            price,
            servicesTotal,
            currency,
            destination,
            originUrl,
            passengers, // Now expecting an array
            selectedServices,
            intent = 'pay' // 'pay' or 'hold'
        } = body;

        // 1. FRESHNESS CHECK
        const offer = await duffel.offers.get(offerId);
        const serverBasePrice = parseFloat(offer.data.total_amount);

        console.log(`🔍 Fresh Price Checked: ${serverBasePrice} ${offer.data.total_currency} (Client sent: ${price})`);

        // Helper: Map frontend passengers to Duffel Format
        const mapPassengersToDuffel = (frontendPassengers: any[]) => {
            return frontendPassengers.map((p) => ({
                id: p.id, // CRITICAL: Must match Duffel Offer Passenger ID
                given_name: p.given_name,
                family_name: p.family_name,
                gender: p.gender,
                title: p.title || 'mr',
                born_on: p.born_on,
                email: p.email, // Only needed for one, but fine to send
                phone_number: p.phone_number || "+15550000000",
                ...(p.loyaltyAirline && p.loyaltyNumber ? {
                    loyalty_programme_accounts: [{
                        airline_iata_code: p.loyaltyAirline,
                        account_number: p.loyaltyNumber
                    }]
                } : {})
            }));
        };

        // Primary Contact Email (First passenger with email)
        const primaryPassenger = passengers.find((p: any) => p.email) || passengers[0];
        const customerEmail = primaryPassenger?.email || 'no-email@provided.com';

        // HOLD ORDER FLOW
        if (intent === 'hold') {
            if (offer.data.payment_requirements.requires_instant_payment) {
                return NextResponse.json({ error: 'This offer requires instant payment and cannot be held.' }, { status: 400 });
            }

            console.log('Creating Hold Order for:', offerId);

            const order = await duffel.orders.create({
                type: 'hold' as any,
                selected_offers: [offerId],
                passengers: mapPassengersToDuffel(passengers),
                ...(selectedServices?.length > 0 ? {
                    services: selectedServices.map((s: any) => ({
                        id: s.id,
                        quantity: 1
                    }))
                } : {})
            });

            console.log('Hold Order Created:', order.data.id);

            return NextResponse.json({
                url: `${originUrl}/checkout/success?session_id=HOLD_${order.data.id}&offer_id=${offerId}&mode=hold&booking_ref=${order.data.booking_reference}`
            });
        }

        // --- PAYMENT FLOW (STRIPE) ---
        const baseAmount = serverBasePrice;
        const extrasAmount = typeof servicesTotal === 'number' ? servicesTotal : 0;
        const totalAmount = baseAmount + extrasAmount;
        const unitAmount = Math.round(totalAmount * 100);

        console.log('Payment Calculation:', { base: baseAmount, extras: extrasAmount, total: totalAmount, cents: unitAmount });

        if (unitAmount < 50) {
            return NextResponse.json({ error: 'Invalid Amount: Price too low' }, { status: 400 });
        }

        // Prepare Metadata (Store limited amount or JSON string)
        // Store essentials. Full list might be too long for Stripe metadata limit (500 chars).
        // Storing a simplified summary.
        const passengerSummary = passengers.map((p: any) => `${p.given_name} ${p.family_name}`).join(', ');
        const servicesMetadata = selectedServices ? JSON.stringify(selectedServices) : null;

        // We will store the FULL passenger data in a different way or rely on Supabase later.
        // For now, passing the full JSON string if it fits, else truncated.
        const passengerMetadata = JSON.stringify(passengers).slice(0, 500);

        // @ts-ignore
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'mb_way', 'multibanco'], // Expanded payment methods
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'eur', // forcing eur as per previous logic
                        product_data: {
                            name: `Flight to ${destination}`,
                            description: `Flight for ${passengers.length} passenger(s) (${passengerSummary}) | Offer ID: ${offerId}`,
                            images: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'],
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${originUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&offer_id=${offerId}`,
            cancel_url: `${originUrl}/checkout?offerId=${offerId}`,
            metadata: {
                offer_id: offerId,
                passenger_count: passengers.length.toString(),
                passenger_summary: passengerSummary, // Readable summary
                // We need to pass the passenger data to the success page handler somehow if we want to create the order THERE. 
                // But typically we create the order in the webhook or success page. 
                // Creating a simplified JSON for metadata.
                passenger_data_json: JSON.stringify(passengers).slice(0, 500), // LIMITATION: Stripe metadata key max 500 chars
                selected_services: servicesMetadata,
                booking_type: 'flight_full_flow'
            },
        } as any);

        console.log('Stripe Session Created:', session.id);

        if (!session.url) {
            throw new Error('Stripe Session created but returned no URL');
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown Error' }, { status: 500 });
    }
}
