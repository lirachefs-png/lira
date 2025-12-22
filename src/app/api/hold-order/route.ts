import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { offerId, passengers, selectedServices } = body;

        console.log('Creating Hold Order for:', offerId);

        // Map passengers to Duffel format
        const duffelPassengers = passengers.map((p: any) => ({
            id: p.id,
            given_name: p.given_name,
            family_name: p.family_name,
            gender: p.gender,
            title: p.title || 'mr',
            born_on: p.born_on,
            email: p.email,
            phone_number: p.phone_number || "+15550000000"
        }));

        const order = await duffel.orders.create({
            type: 'hold' as any, // Cast to any to avoid strict typing issues with specific SDK versions
            selected_offers: [offerId],
            passengers: duffelPassengers,
            ...(selectedServices?.length > 0 ? {
                services: selectedServices.map((s: any) => ({
                    id: s.id,
                    quantity: 1
                }))
            } : {})
        });

        console.log('Hold Order Created:', order.data.id);

        return NextResponse.json({
            success: true,
            orderId: order.data.id,
            booking_reference: order.data.booking_reference,
            expiresAt: (order.data as any).payment_required_by // Correct property for hold expiration
        });

    } catch (error: any) {
        // Log detailed Duffel error
        console.error('DUFFEL DETAILED ERROR:', JSON.stringify(error.errors || error, null, 2));

        const errorMessage = error.errors?.[0]?.message || error.message || 'Erro desconhecido na reserva';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
}
