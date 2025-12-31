import { NextResponse } from 'next/server';

// OpenSky Network API - Free tier (no auth required for anonymous)
// Docs: https://openskynetwork.github.io/opensky-api/rest.html
// Rate limits: 100 requests/day anonymous, 4000 with free account

interface OpenSkyState {
    icao24: string;           // Unique ICAO 24-bit address
    callsign: string | null;  // Flight number (e.g., "TAP123")
    origin_country: string;   // Country of registration
    time_position: number;    // Unix timestamp of last position update
    last_contact: number;     // Unix timestamp of last message
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;  // Barometric altitude in meters
    on_ground: boolean;
    velocity: number | null;  // Ground speed in m/s
    true_track: number | null; // Heading in degrees (0 = North)
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Optional bounding box filter (for performance)
        const lamin = searchParams.get('lamin'); // min latitude
        const lamax = searchParams.get('lamax'); // max latitude
        const lomin = searchParams.get('lomin'); // min longitude
        const lomax = searchParams.get('lomax'); // max longitude

        // Build API URL
        let apiUrl = 'https://opensky-network.org/api/states/all';
        const params = new URLSearchParams();

        if (lamin && lamax && lomin && lomax) {
            params.append('lamin', lamin);
            params.append('lamax', lamax);
            params.append('lomin', lomin);
            params.append('lomax', lomax);
        }

        if (params.toString()) {
            apiUrl += '?' + params.toString();
        }

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            },
            // Cache for 10 seconds to respect rate limits
            next: { revalidate: 10 }
        });

        if (!response.ok) {
            if (response.status === 429) {
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Try again later.' },
                    { status: 429 }
                );
            }
            throw new Error(`OpenSky API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform raw state vectors to cleaner format
        // OpenSky returns: [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
        const flights = (data.states || [])
            .filter((state: any[]) => state[5] !== null && state[6] !== null) // Must have position
            .slice(0, 500) // Limit to 500 aircraft for performance
            .map((state: any[]) => ({
                icao24: state[0],
                callsign: state[1]?.trim() || null,
                country: state[2],
                longitude: state[5],
                latitude: state[6],
                altitude: state[7] || state[13] || 0, // Baro or geo altitude
                onGround: state[8],
                velocity: state[9] ? Math.round(state[9] * 3.6) : null, // Convert m/s to km/h
                heading: state[10],
                verticalRate: state[11]
            }));

        return NextResponse.json({
            timestamp: data.time,
            count: flights.length,
            flights
        });

    } catch (error: any) {
        console.error('Live Flights Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch live flights' },
            { status: 500 }
        );
    }
}
