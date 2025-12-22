'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LocationSearch from './ui/LocationSearch';
import { SITE_CONFIG } from '@/lib/constants';

// Enhanced destinations with Unsplash queries
const DESTINATIONS = [
    {
        id: 1,
        country: 'United Arab Emirates',
        city: 'Dubai',
        defaultPrice: 709,
        iata: 'DXB',
        query: 'dubai city skyline sunset',
        defaultImage: 'https://images.unsplash.com/photo-1512453979798-5ea90b798d5c?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        country: 'Singapore',
        city: 'Singapore',
        defaultPrice: 835,
        iata: 'SIN',
        query: 'singapore marina bay sands',
        defaultImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        country: 'Thailand',
        city: 'Bangkok',
        defaultPrice: 845,
        iata: 'BKK',
        query: 'bangkok city street night',
        defaultImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 4,
        country: 'Mauritius',
        city: 'Mauritius',
        defaultPrice: 985,
        iata: 'MRU',
        query: 'mauritius beach tropical',
        defaultImage: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 5,
        country: 'Tanzania',
        city: 'Zanzibar',
        defaultPrice: 989,
        iata: 'ZNZ',
        query: 'zanzibar beach ocean',
        defaultImage: 'https://images.unsplash.com/photo-1582234038166-51f1532439a1?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: 6,
        country: 'Indonesia',
        city: 'Bali',
        defaultPrice: 1055,
        iata: 'DPS',
        query: 'bali temple landscape',
        defaultImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop'
    }
];

export default function FeaturedDestinations() {
    const [origin, setOrigin] = useState('LIS');
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [loadingPrices, setLoadingPrices] = useState(true);
    const router = useRouter();

    // Fetch live prices from Duffel via our API
    useEffect(() => {
        const fetchPrices = async () => {
            setLoadingPrices(true);
            const nextMonth = new Date();
            nextMonth.setDate(nextMonth.getDate() + 30); // Search 30 days out for better availability
            const dateStr = nextMonth.toISOString().split('T')[0];

            const newPrices: Record<string, number | null> = {};

            // We'll fetch in parallel but handle errors gracefully
            await Promise.all(DESTINATIONS.map(async (dest) => {
                try {
                    const params = new URLSearchParams({
                        origin: origin,
                        destination: dest.iata,
                        date: dateStr,
                        adults: '1',
                        cabin: 'economy',
                        supplier_timeout: '7000' // 7s timeout for "starting at" search
                    });

                    const res = await fetch(`/api/search?${params.toString()}`);
                    if (!res.ok) throw new Error('Failed');
                    const data = await res.json();

                    if (data.data && data.data.length > 0) {
                        const lowest = parseFloat(data.data[0].total_amount);
                        newPrices[dest.iata] = lowest;
                    }
                } catch (e) {
                    // Fail silently for price
                }
            }));

            setPrices(newPrices);
            setLoadingPrices(false);
        };

        // Debounce slightly to avoid rapid firing on origin typing (though LocationSearch usually handles that internally)
        const timer = setTimeout(() => {
            if (origin && origin.length === 3) fetchPrices();
        }, 500);

        return () => clearTimeout(timer);
    }, [origin]);


    const handleSearchDestination = (destinationIata: string) => {
        router.push(`/search?origin=${origin}&destination=${destinationIata}&date=${new Date().toISOString().split('T')[0]}`);
    };

    const handleViewAll = () => {
        router.push(`/search?origin=${origin}`);
    };

    return (
        <section className="relative z-0 max-w-7xl mx-auto px-4 py-12 bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <h2 className="text-2xl md:text-3xl text-slate-500 dark:text-slate-300 font-light tracking-tight">
                        Featured destinations from
                    </h2>
                    {/* Integrated Origin Selector */}
                    <div className="w-48">
                        <LocationSearch
                            label=""
                            placeholder="Origin City"
                            value={origin}
                            onChange={setOrigin}
                            variant="dark"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-500 border border-rose-500/50 bg-rose-500/10 px-3 py-1 rounded-full flex items-center gap-2 tracking-wider uppercase">
                        Best Price <span className="text-base">✓</span>
                    </span>
                </div>
            </div>

            {/* GRID LAYOUT - Compact (6 Columns) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {DESTINATIONS.map((dest) => {
                    const price = prices[dest.iata];
                    const displayPrice = price ? Math.round(price) : dest.defaultPrice;
                    const imageKey = dest.city.toLowerCase().trim();
                    const imageToUse = SITE_CONFIG.images.destinations[imageKey] || SITE_CONFIG.images.defaults.destination;

                    return (
                        <div
                            key={dest.id}
                            onClick={() => handleSearchDestination(dest.iata)}
                            className="group card-destino rounded-lg overflow-hidden cursor-pointer flex flex-col hover:scale-[1.02] active:scale-95"
                        >
                            {/* Image Top - Fixed Aspect Ratio */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={imageToUse}
                                    alt={dest.city}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        if (target.src !== SITE_CONFIG.images.defaults.destination) {
                                            target.src = SITE_CONFIG.images.defaults.destination;
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Content Bottom - Compact Padding */}
                            <div className="p-4 text-center flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-[9px] font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase mb-1">
                                        {dest.country}
                                    </h4>
                                    <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 transition-colors">
                                        {dest.city}
                                    </h3>
                                </div>

                                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/10">
                                    <p className="text-[10px] text-slate-500 dark:text-gray-400 mb-0.5">
                                        Economy Return
                                    </p>
                                    <div className="h-6 flex items-center justify-center">
                                        {loadingPrices ? (
                                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                                        ) : (
                                            <div className="text-sm font-medium text-slate-900 dark:text-white animate-in fade-in duration-500">
                                                from <span className="font-bold text-base">€{displayPrice}</span>*
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={handleViewAll}
                    className="group inline-flex items-center gap-2 text-slate-400 hover:text-rose-600 font-medium transition-colors text-xs tracking-widest uppercase border-b border-transparent hover:border-rose-600 pb-0.5"
                >
                    View All Destinations
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

        </section>
    );
}
