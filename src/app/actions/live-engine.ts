'use server';

import { duffel } from "@/lib/duffel";
import { addMonths, format } from "date-fns";

// A curated list of "Engine" worthy destinations
const DISCOVERY_DESTINATIONS = [
    { iata: 'LHR', name: 'London', region: 'Europe' },
    { iata: 'CDG', name: 'Paris', region: 'Europe' },
    { iata: 'FCO', name: 'Rome', region: 'Europe' },
    { iata: 'DXB', name: 'Dubai', region: 'Middle East' },
    { iata: 'JFK', name: 'New York', region: 'Americas' },
    { iata: 'HND', name: 'Tokyo', region: 'Asia' },
    { iata: 'SIN', name: 'Singapore', region: 'Asia' },
    { iata: 'GRU', name: 'São Paulo', region: 'Americas' },
    { iata: 'RAK', name: 'Marrakesh', region: 'Africa' },
    { iata: 'KEF', name: 'Reykjavik', region: 'Europe' }
];

export interface DiscoveryResult {
    iata: string;
    name: string;
    price: number;
    currency: string;
    imageUrl?: string; // Could be added later
}

// "Where can I go for X budget?"
export async function searchByBudget(origin: string, maxBudget: number, currency: string = 'EUR'): Promise<DiscoveryResult[]> {
    const searchDate = format(addMonths(new Date(), 2), 'yyyy-MM-dd'); // Look 2 months ahead for decent prices
    const results: DiscoveryResult[] = [];

    // Optimization: Run searches in parallel but limited batch to avoid rate limits
    // Batch of 5
    const batchSize = 5;

    for (let i = 0; i < DISCOVERY_DESTINATIONS.length; i += batchSize) {
        const batch = DISCOVERY_DESTINATIONS.slice(i, i + batchSize);

        const promises = batch.map(async (dest) => {
            try {
                // Duffel Search
                const offerRequest = await duffel.offerRequests.create({
                    slices: [{
                        origin: origin,
                        destination: dest.iata,
                        departure_date: searchDate,
                    } as any],
                    passengers: [{ type: "adult" }],
                    cabin_class: "economy",
                });

                const offers = await duffel.offers.list({
                    offer_request_id: offerRequest.data.id,
                    sort: "total_amount",
                    limit: 1,
                });

                const cheapest = offers.data[0];
                if (cheapest) {
                    const price = parseFloat(cheapest.total_amount);
                    // Filter by budget (handling currency crudely 1:1 for sandbox, or assuming EUR input matches EUR output)
                    // In real app, we'd convert. Here we assume origin EUR -> output EUR.

                    if (price <= maxBudget) {
                        return {
                            iata: dest.iata,
                            name: dest.name,
                            price: price,
                            currency: cheapest.total_currency
                        };
                    }
                }
            } catch (error) {
                // Ignore failure, just don't recommend it
                console.error(`Live Engine: Failed to check ${dest.name}`, error);
            }
            return null;
        });

        const batchResults = await Promise.all(promises);
        results.push(...(batchResults.filter(r => r !== null) as DiscoveryResult[]));
    }

    // Sort by price (cheapest first/best value)
    return results.sort((a, b) => a.price - b.price);
}
