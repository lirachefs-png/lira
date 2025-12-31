import { NextResponse } from 'next/server';

// OpenSky API - Get all live state vectors (aircraft positions)
// This is the main endpoint for real-time flight tracking

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Optional bounding box filter (for performance)
        const lamin = searchParams.get('lamin');
        const lamax = searchParams.get('lamax');
        const lomin = searchParams.get('lomin');
        const lomax = searchParams.get('lomax');

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
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 10 }
        });

        if (!response.ok) {
            if (response.status === 429) {
                return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            }
            throw new Error(`OpenSky error: ${response.status}`);
        }

        const data = await response.json();

        // Transform state vectors
        // [icao24, callsign, origin_country, time_position, last_contact, 
        //  longitude, latitude, baro_altitude, on_ground, velocity, 
        //  true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
        const flights = (data.states || [])
            .filter((s: any[]) => s[5] !== null && s[6] !== null)
            .slice(0, 500)
            .map((s: any[]) => ({
                icao24: s[0],
                callsign: s[1]?.trim() || null,
                country: s[2],
                longitude: s[5],
                latitude: s[6],
                altitude: s[7] || s[13] || 0,
                onGround: s[8],
                velocity: s[9] ? Math.round(s[9] * 3.6) : null,
                heading: s[10],
                verticalRate: s[11],
                squawk: s[14]
            }));

        return NextResponse.json({
            timestamp: data.time,
            count: flights.length,
            flights
        });

    } catch (error: any) {
        console.error('Live States Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
