import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { paymentIntentId, offerId, passengers, selectedServices } = body;

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

        // 3. Create the Order with duffel_payments
        console.log('Creating Order with Duffel Payments...');

        const orderPayload: any = {
            type: 'instant',
            selected_offers: [offerId],
            passengers: duffelPassengers,
            payments: [
                {
                    type: 'duffel_payments',
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

        return NextResponse.json({
            success: true,
            orderId: order.data.id,
            bookingReference: order.data.booking_reference,
        });

    } catch (error: any) {
        console.error('Confirm Payment Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to confirm payment' },
            { status: 500 }
        );
    }
}
