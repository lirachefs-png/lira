import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { offerId, amount, currency = 'EUR' } = body;

        if (!offerId || !amount) {
            return NextResponse.json(
                { error: 'offerId and amount are required' },
                { status: 400 }
            );
        }

        console.log('Creating PaymentIntent for offer:', offerId, 'Amount:', amount, currency);

        // Create PaymentIntent via Duffel API
        const paymentIntent = await duffel.paymentIntents.create({
            amount: amount.toString(),
            currency: currency.toUpperCase(),
        });

        console.log('PaymentIntent created:', paymentIntent.data.id);

        return NextResponse.json({
            id: paymentIntent.data.id,
            clientToken: paymentIntent.data.client_token,
            amount: paymentIntent.data.amount,
            currency: paymentIntent.data.currency,
            status: paymentIntent.data.status,
        });
    } catch (error: any) {
        console.error('PaymentIntent Error:', error);

        // Get detailed error from Duffel API
        const duffelErrors = error?.errors || error?.data?.errors;
        const errorMessage = duffelErrors?.[0]?.message
            || error?.message
            || 'Failed to create payment intent';

        console.error('Duffel Error Details:', JSON.stringify(duffelErrors, null, 2));

        return NextResponse.json(
            { error: errorMessage, details: duffelErrors },
            { status: 500 }
        );
    }
}
