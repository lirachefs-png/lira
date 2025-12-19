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
    { id: 'mco_fb', iata_code: 'MCO', name: 'Orlando Intl', city_name: 'Orlando', country_name: 'United States', type: 'airport' },
    { id: 'jfk_fb', iata_code: 'JFK', name: 'John F. Kennedy Intl', city_name: 'New York', country_name: 'United States', type: 'airport' },
    { id: 'lhr_fb', iata_code: 'LHR', name: 'Heathrow', city_name: 'London', country_name: 'United Kingdom', type: 'airport' },
    { id: 'cdg_fb', iata_code: 'CDG', name: 'Charles de Gaulle', city_name: 'Paris', country_name: 'France', type: 'airport' },
    { id: 'dxb_fb', iata_code: 'DXB', name: 'Dubai Intl', city_name: 'Dubai', country_name: 'United Arab Emirates', type: 'airport' },
    { id: 'hnd_fb', iata_code: 'HND', name: 'Haneda', city_name: 'Tokyo', country_name: 'Japan', type: 'airport' },
    { id: 'eze_fb', iata_code: 'EZE', name: 'Ezeiza Intl', city_name: 'Buenos Aires', country_name: 'Argentina', type: 'airport' },
    { id: 'scl_fb', iata_code: 'SCL', name: 'Arturo Merino Benítez', city_name: 'Santiago', country_name: 'Chile', type: 'airport' }
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('query') || '').toLowerCase();

    if (!query) return NextResponse.json({ data: [] });

    // Helper for accent-insensitive comparison
    const normalizeText = (text: string) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedQuery = normalizeText(query);

    // 1. Static Fallback (Instant)
    const staticResults = FALLBACK_LOCATIONS.filter(l =>
        normalizeText(l.iata_code).includes(normalizedQuery) ||
        normalizeText(l.city_name).includes(normalizedQuery) ||
        normalizeText(l.name).includes(normalizedQuery)
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

        // Combine: Puts API results FIRST, then Fallbacks if not present
        const combined = [...apiResults];
        const seen = new Set(apiResults.map((r: any) => r.iata_code));

        for (const item of staticResults) {
            if (!seen.has(item.iata_code)) {
                combined.push(item);
                seen.add(item.iata_code);
            }
        }

        console.log(`✅ Found ${apiResults.length} locations from Duffel + ${combined.length - apiResults.length} from fallback`);
        return NextResponse.json({ data: combined });
    } catch (error: any) {
        console.error('❌ Duffel Autocomplete Error:', JSON.stringify(error, null, 2));

        // Debug Token
        const token = process.env.DUFFEL_ACCESS_TOKEN;
        console.log('🔑 Token Check (Locations):', token ? `Exists (${token.substring(0, 5)}...)` : 'MISSING');

        return NextResponse.json({ data: staticResults });
    }
}
