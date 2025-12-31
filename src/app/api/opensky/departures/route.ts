import { NextResponse } from 'next/server';

// OpenSky API - Get departures from a specific airport
// Endpoint: /flights/departure?airport=EDDF&begin=1517227200&end=1517230800

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const airport = searchParams.get('airport'); // ICAO code
        const hours = parseInt(searchParams.get('hours') || '24');

        if (!airport) {
            return NextResponse.json({ error: 'Airport ICAO code required' }, { status: 400 });
        }

        const now = Math.floor(Date.now() / 1000);
        const begin = now - (hours * 3600);

        const apiUrl = `https://opensky-network.org/api/flights/departure?airport=${airport.toUpperCase()}&begin=${begin}&end=${now}`;

        const response = await fetch(apiUrl, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 300 }
        });

        if (response.status === 404) {
            return NextResponse.json({ departures: [], count: 0 });
        }

        if (!response.ok) {
            throw new Error(`OpenSky error: ${response.status}`);
        }

        const data = await response.json();

        const departures = (data || []).map((flight: any) => ({
            icao24: flight.icao24,
            callsign: flight.callsign?.trim() || null,
            departureAirport: flight.estDepartureAirport,
            arrivalAirport: flight.estArrivalAirport,
            departureTime: flight.firstSeen ? new Date(flight.firstSeen * 1000).toISOString() : null,
            arrivalTime: flight.lastSeen ? new Date(flight.lastSeen * 1000).toISOString() : null,
        }));

        return NextResponse.json({
            airport: airport.toUpperCase(),
            count: departures.length,
            departures
        });

    } catch (error: any) {
        console.error('Departures API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
