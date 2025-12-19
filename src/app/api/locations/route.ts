import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';

const FALLBACK_LOCATIONS = [
    { id: 'jpa_fb', iata_code: 'JPA', name: 'Presidente Castro Pinto Intl', city_name: 'João Pessoa', country_name: 'Brazil', type: 'airport' },
    { id: 'gru_fb', iata_code: 'GRU', name: 'Guarulhos Intl', city_name: 'São Paulo', country_name: 'Brazil', type: 'airport' },
    { id: 'gig_fb', iata_code: 'GIG', name: 'Galeão Intl', city_name: 'Rio de Janeiro', country_name: 'Brazil', type: 'airport' },
    { id: 'bsb_fb', iata_code: 'BSB', name: 'Brasília Intl', city_name: 'Brasília', country_name: 'Brazil', type: 'airport' },
    { id: 'lis_fb', iata_code: 'LIS', name: 'Humberto Delgado', city_name: 'Lisbon', country_name: 'Portugal', type: 'airport' },
    { id: 'opo_fb', iata_code: 'OPO', name: 'Francisco Sá Carneiro', city_name: 'Porto', country_name: 'Portugal', type: 'airport' },
    { id: 'mia_fb', iata_code: 'MIA', name: 'Miami Intl', city_name: 'Miami', country_name: 'United States', type: 'airport' },
    { id: 'mco_fb', iata_code: 'MCO', name: 'Orlando Intl', city_name: 'Orlando', country_name: 'United States', type: 'airport' }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('query') || '').toLowerCase();

    if (!query) return NextResponse.json({ data: [] });

    // 1. Static Fallback (Instant)
    const staticResults = FALLBACK_LOCATIONS.filter(l =>
        l.iata_code.toLowerCase().includes(query) ||
        l.city_name.toLowerCase().includes(query) ||
        l.name.toLowerCase().includes(query)
    );

    try {
        // 2. Duffel API
        const response = await duffel.suggestions.list({ query });
        const apiResults = response.data.map((place: any) => ({
            id: place.id,
            iata_code: place.iata_code,
            name: place.name,
            type: place.type,
            city_name: place.city_name,
            country_name: place.country?.name
        }));

        // Combine: Static first, then API (deduplicated by IATA)
        const combined = [...staticResults];
        const seen = new Set(staticResults.map(r => r.iata_code));

        for (const item of apiResults) {
            if (!seen.has(item.iata_code)) {
                combined.push(item);
                seen.add(item.iata_code);
            }
        }

        return NextResponse.json({ data: combined });
    } catch (error) {
        console.error('Duffel Autocomplete Error, using fallback only:', error);
        return NextResponse.json({ data: staticResults });
    }
}
