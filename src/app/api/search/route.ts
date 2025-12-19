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
    const maxConnections = searchParams.get('max_connections') ? parseInt(searchParams.get('max_connections')!) : undefined;
    const fareType = searchParams.get('fare_type'); // e.g., "student"
    const privateFaresStr = searchParams.get('private_fares'); // JSON string for corporate codes

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

        // Parse private fares if provided
        let privateFares: Record<string, any[]> | undefined;
        if (privateFaresStr) {
            try {
                privateFares = JSON.parse(privateFaresStr);
            } catch (e) {
                console.error('Invalid private_fares JSON:', e);
            }
        }

        const offerRequest = await duffel.offerRequests.create({
            slices: slices,
            passengers: Array(adults).fill({
                type: 'adult',
                ...(fareType && { fare_type: fareType })
            }),
            cabin_class: cabin as any,
            return_offers: true,
            supplier_timeout: parseInt(searchParams.get('supplier_timeout') || '8000'), // Default 8s for Vercel safety, but overridable
            ...(maxConnections !== undefined && { max_connections: maxConnections as any }),
            ...(privateFares && { private_fares: privateFares }),
        });

        return NextResponse.json({ data: offerRequest.data.offers });
    } catch (error: any) {
        console.error('❌ Duffel API Error:', JSON.stringify(error, null, 2));

        // Debug Token (Safe Log)
        const token = process.env.DUFFEL_ACCESS_TOKEN;
        console.log('🔑 Token Check:', token ? `Exists (Starts with ${token.substring(0, 5)}...)` : 'MISSING');

        // Extract Duffel Message
        const errorMessage = error.errors?.[0]?.message || error.message || 'Failed to fetch flights';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
