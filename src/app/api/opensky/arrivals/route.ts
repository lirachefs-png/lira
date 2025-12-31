import { NextResponse } from 'next/server';

// OpenSky API - Get arrivals at a specific airport
// Endpoint: /flights/arrival?airport=EDDF&begin=1517227200&end=1517230800

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const airport = searchParams.get('airport'); // ICAO code (e.g., LPPT, SBGR)
        const hours = parseInt(searchParams.get('hours') || '24'); // Last N hours

        if (!airport) {
            return NextResponse.json({ error: 'Airport ICAO code required (e.g., LPPT, SBGR, KJFK)' }, { status: 400 });
        }

        // Calculate time range (OpenSky uses Unix timestamps)
        const now = Math.floor(Date.now() / 1000);
        const begin = now - (hours * 3600);

        const apiUrl = `https://opensky-network.org/api/flights/arrival?airport=${airport.toUpperCase()}&begin=${begin}&end=${now}`;

        const response = await fetch(apiUrl, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 300 } // Cache 5 min
        });

        if (response.status === 404) {
            return NextResponse.json({ arrivals: [], count: 0, message: 'No arrivals found' });
        }

        if (!response.ok) {
            throw new Error(`OpenSky error: ${response.status}`);
        }

        const data = await response.json();

        // Transform data
        const arrivals = (data || []).map((flight: any) => ({
            icao24: flight.icao24,
            callsign: flight.callsign?.trim() || null,
            departureAirport: flight.estDepartureAirport,
            arrivalAirport: flight.estArrivalAirport,
            departureTime: flight.firstSeen ? new Date(flight.firstSeen * 1000).toISOString() : null,
            arrivalTime: flight.lastSeen ? new Date(flight.lastSeen * 1000).toISOString() : null,
        }));

        return NextResponse.json({
            airport: airport.toUpperCase(),
            count: arrivals.length,
            arrivals
        });

    } catch (error: any) {
        console.error('Arrivals API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
