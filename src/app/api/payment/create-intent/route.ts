import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const { amount, currency } = await request.json();

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency || 'eur',
            payment_method_types: ['card'], // Explicitly set to card to fix "unknown parameter"
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
