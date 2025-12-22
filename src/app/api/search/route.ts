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
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    const maxConnections = searchParams.get('max_connections') ? parseInt(searchParams.get('max_connections')!) : undefined;
    const fareType = searchParams.get('fare_type'); // e.g., "student"
    const privateFaresStr = searchParams.get('private_fares'); // JSON string for corporate codes

    try {
        let slices: any[] = [];

        // 1. Try to parse "slices" JSON param (Multi-city)
        const slicesParam = searchParams.get('slices');
        if (slicesParam) {
            try {
                slices = JSON.parse(slicesParam);
            } catch (e) {
                console.error('Invalid slices JSON:', e);
            }
        }

        // 2. Fallback to Legacy Params (One-Way / Round-Trip)
        if (slices.length === 0 && origin && destination && departureDate) {
            slices = [
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
        }

        if (slices.length === 0) {
            return NextResponse.json({ error: 'Missing flight parameters (slices or origin/dest)' }, { status: 400 });
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

        // Build Passenger Payload
        const passengersPayload = [
            ...Array(adults).fill({ type: 'adult', ...(fareType && { fare_type: fareType }) }),
            ...Array(children).fill({ type: 'child' }),
            ...Array(infants).fill({ type: 'infant_without_seat' }) // Assuming lap infant
        ];

        const offerRequest = await duffel.offerRequests.create({
            slices: slices,
            passengers: passengersPayload,
            cabin_class: cabin as any,
            return_offers: true,
            supplier_timeout: parseInt(searchParams.get('supplier_timeout') || '20000'), // 20s Best Practice for maximum results
            ...(maxConnections !== undefined && { max_connections: maxConnections as any }),
            ...(privateFares && { private_fares: privateFares }),
        });

        // Optimization: Server-side sorting for "Best Price"
        const sortedOffers = offerRequest.data.offers.sort((a: any, b: any) => {
            return parseFloat(a.total_amount) - parseFloat(b.total_amount);
        });

        return NextResponse.json({ data: sortedOffers });
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
