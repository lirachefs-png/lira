'use server';

import { duffel } from "@/lib/duffel";
import { addMonths, format } from "date-fns";

const FEATURED_IATA = ['CMB', 'AUH', 'HKG', 'KNO', 'BKK']; // Colombo, Abu Dhabi, Hong Kong, Medan, Bangkok

export async function getFeaturedPrices(origin: string = 'LIS', currency: string = 'EUR') {
    const prices: Record<string, string> = {};
    const searchDate = format(addMonths(new Date(), 3), 'yyyy-MM-dd');

    try {
        const promises = FEATURED_IATA.map(async (dest) => {
            try {
                const offerRequest = await duffel.offerRequests.create({
                    slices: [
                        {
                            origin: origin,
                            destination: dest,
                            departure_date: searchDate,
                        } as any,
                    ],
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
                    return { iata: dest, price: cheapest.total_amount };
                }
            } catch (error) {
                console.error(`Failed to fetch price for ${dest}`, error);
            }
            return { iata: dest, price: null };
        });

        const results = await Promise.all(promises);

        // Simple exchange rates for display purposes (Base assumes agency default usually EUR or GBP in sandbox)
        // This ensures the user sees the values change when switching currencies.
        const rates: Record<string, number> = { 'EUR': 1, 'USD': 1.05, 'BRL': 6.15 };
        const rate = rates[currency] || 1;

        results.forEach(r => {
            if (r.price) {
                const val = parseFloat(r.price);
                prices[r.iata] = Math.ceil(val * rate).toString();
            }
        });

        return prices;
    } catch (error) {
        console.error("Global price fetch error", error);
        return {};
    }
}
