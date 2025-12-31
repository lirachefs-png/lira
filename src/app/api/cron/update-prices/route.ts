import { NextResponse } from 'next/server';
import { duffel } from '@/lib/duffel';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Service Role)
// We need SERVICE_ROLE_KEY to bypass RLS for writing to the cache without a user session.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Fallback to anon key if service key is missing (Local Dev usually works with anon if policy allows)
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const ROUTES = [
    { origin: 'LIS', destination: 'CDG' }, // Paris
    { origin: 'LIS', destination: 'LHR' }, // London
    { origin: 'LIS', destination: 'FCO' }, // Rome
    { origin: 'LIS', destination: 'AMS' }, // Amsterdam
    { origin: 'LIS', destination: 'MAD' }, // Madrid
    { origin: 'LIS', destination: 'BCN' }, // Barcelona
    { origin: 'LIS', destination: 'JFK' }, // New York
    { origin: 'LIS', destination: 'DXB' }, // Dubai
    { origin: 'LIS', destination: 'MIA' }, // Miami
    { origin: 'LIS', destination: 'BER' }, // Berlin
    // 🇧🇷 Brazil - Nordeste
    { origin: 'LIS', destination: 'REC' }, // Recife
    { origin: 'LIS', destination: 'SSA' }, // Salvador
    { origin: 'LIS', destination: 'FOR' }, // Fortaleza
    // 🇧🇷 Brazil - Sul
    { origin: 'LIS', destination: 'FLN' }, // Florianópolis
    { origin: 'LIS', destination: 'POA' }, // Porto Alegre
    // 🇧🇷 Brazil - Rio/SP
    { origin: 'LIS', destination: 'GIG' }, // Rio de Janeiro
    { origin: 'LIS', destination: 'GRU' }, // São Paulo
];

export async function GET(request: Request) {
    console.log('🔄 Cron: Starting Lightning Deal Hunter...');

    const updates = [];
    const errors = [];

    // Search 60 days out for better deals
    const searchDate = new Date();
    searchDate.setDate(searchDate.getDate() + 60);
    const departureDate = searchDate.toISOString().split('T')[0];

    for (const route of ROUTES) {
        try {
            // 1. Get Current Cache to compare
            const { data: currentCache } = await supabase
                .from('flight_cache')
                .select('price')
                .eq('origin', route.origin)
                .eq('destination', route.destination)
                .single();

            const previousPrice = currentCache?.price || 0;

            // 2. Duffel Search
            const offerRequest = await duffel.offerRequests.create({
                slices: [{
                    origin: route.origin,
                    destination: route.destination,
                    departure_date: departureDate,
                } as any],
                passengers: [{ type: 'adult' }],
                cabin_class: 'economy',
            });

            const offers = offerRequest.data.offers;
            if (!offers || offers.length === 0) continue;

            const cheapest = offers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount))[0];
            const newPrice = parseFloat(cheapest.total_amount);
            const currency = cheapest.total_currency;

            // 3. Calculate Drop
            let dropPercentage = 0;
            if (previousPrice > 0 && newPrice < previousPrice) {
                dropPercentage = Math.round(((previousPrice - newPrice) / previousPrice) * 100);
            }

            // 4. Upsert
            const { error } = await supabase
                .from('flight_cache')
                .upsert({
                    origin: route.origin,
                    destination: route.destination,
                    price: newPrice,
                    previous_price: previousPrice > 0 ? previousPrice : null, // Only store if valid
                    drop_percentage: dropPercentage,
                    currency: currency,
                    updated_at: new Date().toISOString(),
                    best_date: departureDate
                }, { onConflict: 'origin, destination' });

            if (error) throw error;

            updates.push({ ...route, newPrice, drop: dropPercentage });
            console.log(`✅ ${route.destination}: ${newPrice} (Drop: ${dropPercentage}%)`);

        } catch (err: any) {
            console.error(`❌ Error ${route.destination}:`, err.message);
            errors.push({ route: route.destination, error: err.message });
        }
    }

    return NextResponse.json({ success: true, updates });
}
