import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('date');
    const returnDate = searchParams.get('returnDate');
    const cabin = searchParams.get('cabin') || 'economy';
    const adults = parseInt(searchParams.get('adults') || '1');

    if (!origin || !destination || !departureDate) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const slices: any[] = [
            {
                origin: origin,
                destination: destination,
                departure_date: departureDate,
            },
        ];

        if (returnDate) {
            slices.push({
                origin: destination,
                destination: origin,
                departure_date: returnDate,
            });
        }

        const offerRequest = await duffel.offerRequests.create({
            slices: slices,
            passengers: Array(adults).fill({ type: 'adult' }),
            cabin_class: cabin as any,
            return_offers: true,
        });

        return NextResponse.json({ data: offerRequest.data.offers });
    } catch (error: any) {
        console.error('Duffel API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch flights' },
            { status: 500 }
        );
    }
}
