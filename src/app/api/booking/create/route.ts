import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export async function POST(request: Request) {
    try {
        const { offerId, passengerDetails, paymentIntentId } = await request.json();

        if (!offerId) {
            return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
        }

        // 1. Fetch the Offer to get valid Passenger IDs
        const offer = await duffel.offers.get(offerId);

        // 2. Map form data to Duffel Passenger Input
        const passengers = offer.data.passengers.map((offerPassenger: any) => ({
            id: offerPassenger.id,
            given_name: passengerDetails?.given_name || 'Jane',
            family_name: passengerDetails?.family_name || 'Doe',
            gender: 'f' as any, // Mock for MVP
            title: 'ms' as any, // Mock for MVP
            born_on: '1990-01-01', // Mock for MVP
            email: passengerDetails?.email || 'jane@example.com',
            phone_number: '+15555555555'
        }));

        // 3. Create Order
        const order = await duffel.orders.create({
            type: 'instant',
            selected_offers: [offerId],
            passengers: passengers,
            payments: [
                {
                    currency: offer.data.total_currency,
                    amount: offer.data.total_amount,
                    type: 'balance' // Using Balance (Agency) payment since we charged via Stripe ourselves
                }
            ]
        });

        return NextResponse.json({ data: order.data });

    } catch (error: any) {
        console.error('Booking Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
    }
}
