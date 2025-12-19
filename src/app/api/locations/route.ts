import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ data: [] });
    }

    try {
        const response = await duffel.suggestions.list({
            query,
        });

        // Map to the requested simplified format
        const suggestions = response.data.map((place: any) => ({
            id: place.id,
            iata_code: place.iata_code,
            name: place.name,
            type: place.type,
            city_name: place.city_name,
            country_name: place.country ? place.country.name : undefined
        }));

        return NextResponse.json({ data: suggestions });
    } catch (error) {
        console.error('Duffel Autocomplete Error:', error);
        return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
