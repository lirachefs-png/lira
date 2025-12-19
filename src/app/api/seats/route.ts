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
        // Fetch Seat Maps for the offer
        const seatMaps = await duffel.seatMaps.get({ offer_id: offerId });

        // Return the first map (usually one per segment, but for MVP we take the first)
        const map = seatMaps.data[0];

        if (!map) {
            return NextResponse.json({ error: 'No seat map available' }, { status: 404 });
        }

        return NextResponse.json(map);

    } catch (error: any) {
        console.error("Failed to fetch seat map:", error);
        // If seat map not supported, return 404 gracefully
        if (error.meta?.status === 404) {
            return NextResponse.json({ error: 'Seat selection not available for this flight' }, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
