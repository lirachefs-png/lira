import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
            price, // This is the BASE flight price
            servicesTotal, // This is the total of add-ons
            currency,
            destination,
            originUrl,
            passenger,
            selectedServices
        } = body;

        // Clean and parse amounts
        const baseAmount = typeof price === 'number' ? price : parseFloat(price?.replace(/[^0-9.]/g, '') || '0');
        const extrasAmount = typeof servicesTotal === 'number' ? servicesTotal : 0;

        // Calculate Final Total
        const totalAmount = baseAmount + extrasAmount;
        const unitAmount = Math.round(totalAmount * 100); // Stripe expects cents

        console.log('Payment Calculation:', {
            base: baseAmount,
            extras: extrasAmount,
            total: totalAmount,
            cents: unitAmount
        });

        if (unitAmount < 50) {
            return NextResponse.json({ error: 'Invalid Amount: Price too low' }, { status: 400 });
        }

        // Prepare Metadata
        const passengerMetadata = passenger ? JSON.stringify(passenger) : null;
        const servicesMetadata = selectedServices ? JSON.stringify(selectedServices) : null;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: passenger?.email,
            line_items: [
                {
                    price_data: {
                        currency: currency || 'eur',
                        product_data: {
                            name: `Flight to ${destination}`,
                            description: `Flight: ${baseAmount} + Services: ${extrasAmount} | Offer ID: ${offerId}`,
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
                passenger_data: passengerMetadata,
                selected_services: servicesMetadata,  // Critical for fulfillment!
                booking_type: 'flight_full_flow'
            },
        });

        console.log('Stripe Session Created:', session.id);

        if (!session.url) {
            throw new Error('Stripe Session created but returned no URL');
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown Stripe Error' }, { status: 500 });
    }
}
