import { NextResponse } from 'next/server';

// OpenSky API - Get flight history for a specific aircraft
// Endpoint: /flights/aircraft?icao24=3c675a&begin=1517184000&end=1517270400

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const icao24 = searchParams.get('icao24');
        const days = parseInt(searchParams.get('days') || '7');

        if (!icao24) {
            return NextResponse.json({ error: 'Aircraft ICAO24 code required' }, { status: 400 });
        }

        const now = Math.floor(Date.now() / 1000);
        const begin = now - (days * 24 * 3600);

        const apiUrl = `https://opensky-network.org/api/flights/aircraft?icao24=${icao24.toLowerCase()}&begin=${begin}&end=${now}`;

        const response = await fetch(apiUrl, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 600 }
        });

        if (response.status === 404) {
            return NextResponse.json({ flights: [], count: 0 });
        }

        if (!response.ok) {
            throw new Error(`OpenSky error: ${response.status}`);
        }

        const data = await response.json();

        const flights = (data || []).map((flight: any) => ({
            icao24: flight.icao24,
            callsign: flight.callsign?.trim() || null,
            departureAirport: flight.estDepartureAirport,
            arrivalAirport: flight.estArrivalAirport,
            departureTime: flight.firstSeen ? new Date(flight.firstSeen * 1000).toISOString() : null,
            arrivalTime: flight.lastSeen ? new Date(flight.lastSeen * 1000).toISOString() : null,
            departureHorizontalDistance: flight.estDepartureAirportHorizDistance,
            arrivalHorizontalDistance: flight.estArrivalAirportHorizDistance,
        }));

        return NextResponse.json({
            icao24: icao24.toLowerCase(),
            days,
            count: flights.length,
            flights
        });

    } catch (error: any) {
        console.error('Aircraft Flights API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
