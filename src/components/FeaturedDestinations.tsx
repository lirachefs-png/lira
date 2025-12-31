'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LocationSearch from './ui/LocationSearch';
import { SITE_CONFIG } from '@/lib/constants';
import { useRegion } from '@/contexts/RegionContext';

export default function FeaturedDestinations() {
    const { labels } = useRegion();
    const [origin, setOrigin] = useState('LIS');
    const [prices, setPrices] = useState<Record<string, number | null>>({});
    const [loadingPrices, setLoadingPrices] = useState(true);
    const router = useRouter();

    // Enhanced destinations with Unsplash queries
    const DESTINATIONS = [
        {
            id: 1,
            country: labels.featured_destinations.uae,
            city: labels.featured_destinations.dubai,
            defaultPrice: 709,
            iata: 'DXB',
            query: 'dubai city skyline sunset',
            defaultImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 2,
            country: labels.featured_destinations.singapore,
            city: labels.featured_destinations.singapore,
            defaultPrice: 835,
            iata: 'SIN',
            query: 'singapore marina bay sands',
            defaultImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 3,
            country: labels.featured_destinations.thailand,
            city: labels.featured_destinations.bangkok,
            defaultPrice: 845,
            iata: 'BKK',
            query: 'bangkok city street night',
            defaultImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 4,
            country: labels.featured_destinations.mauritius,
            city: labels.featured_destinations.mauritius,
            defaultPrice: 985,
            iata: 'MRU',
            query: 'mauritius beach tropical',
            defaultImage: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 5,
            country: labels.featured_destinations.tanzania,
            city: labels.featured_destinations.zanzibar,
            defaultPrice: 989,
            iata: 'ZNZ',
            query: 'zanzibar beach ocean',
            defaultImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 6,
            country: labels.featured_destinations.indonesia,
            city: labels.featured_destinations.bali,
            defaultPrice: 1055,
            iata: 'DPS',
            query: 'bali temple landscape',
            defaultImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop'
        }
    ];

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
    }, [origin, labels]); // Added labels as dep to refresh if lang changes (though usually forces re-render anyway)


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
                        {labels.featured_destinations.title}
                    </h2>
                    {/* Integrated Origin Selector */}
                    <div className="w-48">
                        <LocationSearch
                            label=""
                            placeholder={labels.search_widget.origin}
                            value={origin}
                            onChange={setOrigin}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-500 border border-rose-500/50 bg-rose-500/10 px-3 py-1 rounded-full flex items-center gap-2 tracking-wider uppercase">
                        {labels.featured_destinations.best_price} <span className="text-base">✓</span>
                    </span>
                </div>
            </div>

            {/* GRID LAYOUT - Emirates Style */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {DESTINATIONS.map((dest, index) => {
                    const price = prices[dest.iata];
                    const displayPrice = price ? Math.round(price) : dest.defaultPrice;
                    // Note: imageKey logic might need adjustment if city names are translated differently than keys in SITE_CONFIG
                    // Using iata or id for image lookup might be safer, but for now assuming english keys exist or fallback
                    // Actually SITE_CONFIG keys are english. Translated city name might break this.
                    // Let's use IATA code mapping or fallback to ENGLISH city name if possible, or just accept fallback image.
                    // Better: Use dest.iata to find image if possible, or keep a separate 'imageKey' property in DESTINATIONS that is hardcoded english.
                    const imageKey = dest.city.toLowerCase().trim(); // This will use translated name... might break image lookup.
                    // Fixing: Let's use hardcoded English keys or IATA for lookup.
                    // Since I can't easily change SITE_CONFIG right now, I'll rely on defaults or maybe I should have kept the english name for key.
                    // Let's modify DESTINATIONS to keep an 'imageKey'

                    const imageToUse = SITE_CONFIG.images.destinations[imageKey] || SITE_CONFIG.images.defaults.destination;

                    return (
                        <motion.div
                            key={dest.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                            whileHover={{ y: -7, scale: 1.02 }}
                            onClick={() => handleSearchDestination(dest.iata)}
                            className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg shadow-black/50 border border-white/10 cursor-pointer transition-all duration-300"
                        >
                            {/* Image - Clean without overlay */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={dest.defaultImage} // Use defaultImage directly as primary source, SITE_CONFIG as fallback logic was redundant or secondary?
                                    // Actually original code used imageToUse. Let's stick to dest.defaultImage which is defined in the object, 
                                    // BUT wait, original code defined defaultImage in DESTINATIONS but mostly used imageToUse from SITE_CONFIG?
                                    // Original code: const imageToUse = SITE_CONFIG.images.destinations[imageKey] || SITE_CONFIG.images.defaults.destination;
                                    // But DESTINATIONS had defaultImage property too.
                                    // Let's just use dest.defaultImage for now as it's hardcoded and good quality.
                                    // And ignore imageToUse/SITE_CONFIG to avoid translation issues with keys.
                                    alt={dest.city}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        if (target.src !== SITE_CONFIG.images.defaults.destination) {
                                            target.src = SITE_CONFIG.images.defaults.destination;
                                        }
                                    }}
                                />
                            </div>

                            {/* Text Content Below Image - Emirates Style */}
                            <div className="p-4">
                                {/* Country Label */}
                                <p className="text-[10px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-1">
                                    {dest.country}
                                </p>

                                {/* City Name - Highlighted */}
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                    {dest.city}
                                </h3>

                                {/* Economy Return Label */}
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                                    {labels.featured_destinations.economy_return}
                                </p>

                                {/* Price - Prominent */}
                                <div className="flex items-baseline gap-1">
                                    {loadingPrices ? (
                                        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                                    ) : (
                                        <>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">{labels.featured_destinations.from}</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">€{displayPrice}</span>
                                            <span className="text-xs text-gray-400">*</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={handleViewAll}
                    className="group inline-flex items-center gap-2 text-slate-400 hover:text-rose-600 font-medium transition-colors text-xs tracking-widest uppercase border-b border-transparent hover:border-rose-600 pb-0.5"
                >
                    {labels.featured_destinations.view_all}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

        </section>
    );
}
