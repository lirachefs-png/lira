import { NextResponse } from 'next/server';

// OpenSky API - Get track/trajectory for a specific aircraft
// Endpoint: /tracks/all?icao24=3c675a&time=0

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const icao24 = searchParams.get('icao24'); // Aircraft ICAO24 hex address

        if (!icao24) {
            return NextResponse.json({ error: 'Aircraft ICAO24 code required' }, { status: 400 });
        }

        // time=0 means current track
        const apiUrl = `https://opensky-network.org/api/tracks/all?icao24=${icao24.toLowerCase()}&time=0`;

        const response = await fetch(apiUrl, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 60 }
        });

        if (response.status === 404) {
            return NextResponse.json({ error: 'No track found for this aircraft' }, { status: 404 });
        }

        if (!response.ok) {
            throw new Error(`OpenSky error: ${response.status}`);
        }

        const data = await response.json();

        // Transform waypoints
        // Each waypoint: [time, latitude, longitude, baro_altitude, true_track, on_ground]
        const waypoints = (data.path || []).map((wp: any[]) => ({
            time: new Date(wp[0] * 1000).toISOString(),
            latitude: wp[1],
            longitude: wp[2],
            altitude: wp[3],
            heading: wp[4],
            onGround: wp[5]
        }));

        return NextResponse.json({
            icao24: data.icao24,
            callsign: data.callsign?.trim() || null,
            startTime: data.startTime ? new Date(data.startTime * 1000).toISOString() : null,
            endTime: data.endTime ? new Date(data.endTime * 1000).toISOString() : null,
            waypointCount: waypoints.length,
            waypoints
        });

    } catch (error: any) {
        console.error('Track API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
