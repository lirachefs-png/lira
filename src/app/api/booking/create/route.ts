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
        // 2. Map form data to Duffel Passenger Input
        const passengers = offer.data.passengers.map((offerPassenger: any) => ({
            id: offerPassenger.id,
            given_name: passengerDetails.firstName,
            family_name: passengerDetails.lastName,
            gender: passengerDetails.gender,
            title: (passengerDetails.gender === 'm' ? 'mr' : 'ms') as any,
            born_on: passengerDetails.dob,
            email: passengerDetails.email,
            phone_number: passengerDetails.phone || '+5511999999999' // Fallback for testing if empty
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
