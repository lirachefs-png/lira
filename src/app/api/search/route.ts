import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

// Helper: Add days to a date
function addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Helper: Search for a single date
async function searchForDate(
    slices: any[],
    passengersPayload: any[],
    cabin: string,
    maxConnections: number | undefined,
    privateFares: Record<string, any[]> | undefined,
    supplierTimeout: number,
    asyncFn: boolean = false
) {
    const offerRequest = await duffel.offerRequests.create({
        slices: slices,
        passengers: passengersPayload,
        cabin_class: cabin as any,
        return_offers: !asyncFn, // If async, don't wait for offers
        supplier_timeout: supplierTimeout,
        ...(maxConnections !== undefined && { max_connections: maxConnections as any }),
        ...(privateFares && { private_fares: privateFares }),
    });

    // If async, return the ID immediately
    if (asyncFn) {
        return { id: offerRequest.data.id, async: true };
    }

    return offerRequest.data.offers;
}

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
    const fareType = searchParams.get('fare_type');
    const privateFaresStr = searchParams.get('private_fares');
    const flexible = searchParams.get('flexible') === 'true';
    const supplierTimeout = parseInt(searchParams.get('supplier_timeout') || '20000');

    try {
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
            ...Array(infants).fill({ type: 'infant_without_seat' })
        ];

        // Handle multi-city slices
        let baseSlices: any[] = [];
        const slicesParam = searchParams.get('slices');
        if (slicesParam) {
            try {
                baseSlices = JSON.parse(slicesParam);
            } catch (e) {
                console.error('Invalid slices JSON:', e);
            }
        }

        // Fallback to simple params
        if (baseSlices.length === 0 && origin && destination && departureDate) {
            baseSlices = [
                { origin, destination, departure_date: departureDate }
            ];
            if (returnDate) {
                baseSlices.push({ origin: destination, destination: origin, departure_date: returnDate });
            }
        }

        if (baseSlices.length === 0) {
            return NextResponse.json({ error: 'Missing flight parameters' }, { status: 400 });
        }

        // === POLLING MODE (Fetch results for existing search) ===
        const searchId = searchParams.get('searchId');
        if (searchId) {
            console.log(`🔄 Polling results for Search ID: ${searchId}`);

            const req = await duffel.offers.list({
                offer_request_id: searchId,
                limit: 100,
                sort: 'total_amount'
            });

            const offers = req.data;
            const complete = offers.length >= 100 || req.meta?.after === null; // Simple heuristic

            return NextResponse.json({
                data: offers,
                meta: req.meta, // Contains 'after' cursor
                complete: complete // Let frontend know if it should stop
            });
        }

        // === FLEXIBLE DATES MODE ===
        if (flexible && departureDate) {
            console.log('🔄 Flexible search: ±3 days from', departureDate);

            // Generate dates: -3, -2, -1, 0, +1, +2, +3
            const dateOffsets = [-3, -2, -1, 0, 1, 2, 3];
            const datesToSearch = dateOffsets.map(offset => addDays(departureDate, offset));

            // Create slices for each date
            const searchPromises = datesToSearch.map(async (searchDate, index) => {
                try {
                    // Clone and update slices for this date
                    const dateSlices = baseSlices.map((slice, sliceIndex) => {
                        if (sliceIndex === 0) {
                            return { ...slice, departure_date: searchDate };
                        }
                        // For return flight, also offset by same amount
                        if (sliceIndex === 1 && returnDate) {
                            return { ...slice, departure_date: addDays(returnDate, dateOffsets[index]) };
                        }
                        return slice;
                    });

                    const offers: any = await searchForDate(
                        dateSlices,
                        passengersPayload,
                        cabin,
                        maxConnections,
                        privateFares,
                        Math.min(supplierTimeout, 15000) // Reduce timeout for parallel searches
                    );

                    return {
                        date: searchDate,
                        offset: dateOffsets[index],
                        offers: offers,
                        cheapestPrice: offers.length > 0
                            ? Math.min(...offers.map((o: any) => parseFloat(o.total_amount)))
                            : null
                    };
                } catch (err) {
                    console.warn(`Search failed for ${searchDate}:`, err);
                    return {
                        date: searchDate,
                        offset: dateOffsets[index],
                        offers: [],
                        cheapestPrice: null,
                        error: true
                    };
                }
            });

            // Execute all searches in parallel
            const results = await Promise.all(searchPromises);

            // Build price calendar
            const priceCalendar = results.map(r => ({
                date: r.date,
                offset: r.offset,
                cheapestPrice: r.cheapestPrice,
                offerCount: r.offers.length,
                isSelected: r.offset === 0
            }));

            // Find the cheapest overall date
            const cheapestDate = priceCalendar
                .filter(d => d.cheapestPrice !== null)
                .sort((a, b) => (a.cheapestPrice || Infinity) - (b.cheapestPrice || Infinity))[0];

            // Combine all offers with date metadata
            const allOffers = results.flatMap(r =>
                r.offers.map((offer: any) => ({
                    ...offer,
                    _flexibleDate: r.date,
                    _flexibleOffset: r.offset,
                    _isCheapestDate: cheapestDate?.date === r.date
                }))
            );

            // Sort by price
            const sortedOffers = allOffers.sort((a, b) =>
                parseFloat(a.total_amount) - parseFloat(b.total_amount)
            );

            console.log(`✅ Flexible search complete: ${sortedOffers.length} offers across ${datesToSearch.length} dates`);

            return NextResponse.json({
                data: sortedOffers,
                flexible: true,
                priceCalendar,
                cheapestDate: cheapestDate?.date,
                searchedDates: datesToSearch
            });
        }

        const isAsync = searchParams.get('async') === 'true';

        // === STANDARD SINGLE DATE SEARCH ===
        console.log('🔍 DEBUG: Duffel API Request Parameters:');
        console.log('  Base Slices:', JSON.stringify(baseSlices, null, 2));
        console.log('  Async Mode:', isAsync);

        const result: any = await searchForDate(
            baseSlices,
            passengersPayload,
            cabin,
            maxConnections,
            privateFares,
            supplierTimeout,
            isAsync
        );

        // If async, return the search ID
        if (isAsync && result.async) {
            return NextResponse.json({ searchId: result.id, async: true });
        }

        const offers = result;
        const sortedOffers = offers.sort((a: any, b: any) =>
            parseFloat(a.total_amount) - parseFloat(b.total_amount)
        );

        return NextResponse.json({ data: sortedOffers });

    } catch (error: any) {
        console.error('❌ Duffel API Error:', JSON.stringify(error, null, 2));

        const token = process.env.DUFFEL_ACCESS_TOKEN;
        console.log('🔑 Token Check:', token ? `Exists (Starts with ${token.substring(0, 5)}...)` : 'MISSING');

        const errorMessage = error.errors?.[0]?.message || error.message || 'Failed to fetch flights';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
