import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Remove top level stripe init
// const stripe = new Stripe... 

export async function POST(request: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Missing STRIPE_SECRET_KEY');
        return NextResponse.json({ error: 'Server Misconfiguration: Missing Stripe Key (Restart Server?)' }, { status: 500 });
    }

    try {
        // Initialize Stripe lazily inside the handler to prevent top-level crashes
        // Removed specific apiVersion to use the installed package default
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const body = await request.json();
        console.log('Checkout Request:', body);

        const { offerId, price, currency, destination, originUrl, passenger } = body;

        // Amount comes as string "€709" or similar, need to parse to cents
        const numericPrice = typeof price === 'number' ? price : parseFloat(price?.replace(/[^0-9.]/g, '') || '0');
        const unitAmount = Math.round(numericPrice * 100);

        console.log('Payment Amount:', { original: price, parsed: numericPrice, cents: unitAmount });

        if (unitAmount < 50) { // Stripe minimum is usually around 0.50 currency units
            return NextResponse.json({ error: 'Invalid Amount: Price too low' }, { status: 400 });
        }

        // Serialize passenger data for metadata (Max 500 chars)
        // We persist this so the Webhook can retrieve it later
        const passengerMetadata = passenger ? JSON.stringify(passenger) : null;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: passenger?.email, // Prefill Stripe email
            line_items: [
                {
                    price_data: {
                        currency: currency || 'eur',
                        product_data: {
                            name: `Flight to ${destination}`,
                            description: `Offer ID: ${offerId}`,
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
                passenger_data: passengerMetadata
            },
        });

        console.log('Stripe Session Created:', session);

        if (!session.url) {
            throw new Error('Stripe Session created but returned no URL');
        }

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown Stripe Error' }, { status: 500 });
    }
}
