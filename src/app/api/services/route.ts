import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export const runtime = "nodejs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get('offer_id');

    if (!offerId) {
        return NextResponse.json({ error: 'Missing offer_id' }, { status: 400 });
    }

    try {
        // Fetch offer with return_available_services set to true
        const offer = await duffel.offers.get(offerId, {
            return_available_services: true
        });

        const services = offer.data.available_services || [];

        // Filter for Baggage (type: 'baggage')
        // We can also return all services if strictly needed, but let's categorize
        const bags = services.filter(s => s.type === 'baggage');

        // Some airlines return generic 'seat' services here, but true seat selection needs Seat Maps.
        // We'll return what's available.
        const otherServices = services.filter(s => s.type !== 'baggage');

        return NextResponse.json({
            baggage: bags,
            other: otherServices,
            all: services
        });

    } catch (error: any) {
        console.error("Failed to fetch services:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
