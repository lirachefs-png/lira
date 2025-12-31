import { NextRequest, NextResponse } from 'next/server';
import { getWeatherForCity } from '@/services/weather';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!city && (!lat || !lon)) {
        return NextResponse.json(
            { error: 'City code or coordinates required' },
            { status: 400 }
        );
    }

    // Prioritize city code
    if (city) {
        const data = await getWeatherForCity(city);
        if (data) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { error: 'City not found or weather data unavailable' },
                { status: 404 }
            );
        }
    }

    // TODO: Handle lat/lon directly if needed in future (currently service focuses on city codes)
    // For now, return error if only lat/lon provided as we are migrating to service
    return NextResponse.json(
        { error: 'Lat/Lon search not fully migrated to service yet. Please use city code.' },
        { status: 501 }
    );
}
