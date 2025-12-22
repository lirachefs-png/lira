'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import { Loader2, Plane, Calendar, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import { getUnsplashImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';
import SearchFilters from '@/components/search/SearchFilters';
import OfferConditions from '@/components/search/OfferConditions';
import AirlineLogo from '@/components/ui/AirlineLogo';
import { useRegion } from '@/contexts/RegionContext';

export default function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { labels, language } = useRegion();
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter State
    const [filters, setFilters] = useState({
        stops: [] as string[],
        airlines: [] as string[],
        time: [] as string[],
        priceRange: [0, 10000] as [number, number], // [min, max]
    });

    // Dynamic Background State
    const [bgImage, setBgImage] = useState<string | null>(null);

    const origin = searchParams.get('origin') || 'LIS';
    const destination = searchParams.get('destination') || 'LHR';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const returnDate = searchParams.get('returnDate');

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError('');
            try {
                const params: Record<string, string> = {
                    origin,
                    destination,
                    date,
                    adults: searchParams.get('adults') || '1',
                    children: searchParams.get('children') || '0',
                    infants: searchParams.get('infants') || '0',
                    cabin: searchParams.get('cabin') || 'economy'
                };
                if (returnDate) params.returnDate = returnDate;

                // Advanced Params (Private Fares, etc.)
                const fareType = searchParams.get('fare_type');
                const privateFares = searchParams.get('private_fares');
                if (fareType) params.fare_type = fareType;
                if (privateFares) params.private_fares = privateFares;

                const query = new URLSearchParams(params);
                const res = await fetch(`/api/search?${query.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to search');

                const fetchedOffers = data.data || [];
                setOffers(fetchedOffers);

                // Set initial price range
                if (fetchedOffers.length > 0) {
                    const prices = fetchedOffers.map((o: any) => parseFloat(o.total_amount));
                    const min = Math.floor(Math.min(...prices));
                    const max = Math.ceil(Math.max(...prices));
                    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (origin && destination && date) {
            fetchFlights();
        }
    }, [origin, destination, date, returnDate]);

    // Dynamic Background Effect
    useEffect(() => {
        if (destination) {
            getUnsplashImage(`${destination} tropical beach paradise travel`).then(url => {
                if (url) setBgImage(url);
            });
        }
    }, [destination]);

    // Calculate Min/Max Price for Slider Bounds
    const { minPrice, maxPrice } = useMemo(() => {
        if (offers.length === 0) return { minPrice: 0, maxPrice: 1000 };
        const prices = offers.map(o => parseFloat(o.total_amount));
        return {
            minPrice: Math.floor(Math.min(...prices)),
            maxPrice: Math.ceil(Math.max(...prices))
        };
    }, [offers]);

    // Filter Logic (Memoized)
    const filteredOffers = useMemo(() => {
        return offers.filter(offer => {
            // Price Filter
            const price = parseFloat(offer.total_amount);
            if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

            // Stops Filter
            if (filters.stops.length > 0) {
                const segments = offer.slices[0].segments.length;
                const isDirect = segments === 1;
                const isOneStop = segments === 2;
                const isMultiStop = segments > 2;

                const matchDirect = filters.stops.includes('direct') && isDirect;
                const matchOne = filters.stops.includes('1') && isOneStop;
                const matchMulti = filters.stops.includes('2+') && isMultiStop;

                if (!matchDirect && !matchOne && !matchMulti) return false;
            }

            // Airline Filter
            if (filters.airlines.length > 0) {
                if (!filters.airlines.includes(offer.owner.name)) return false;
            }

            // Time Filter (Departure)
            if (filters.time.length > 0) {
                const depHour = parseInt(offer.slices[0].segments[0].departing_at.split('T')[1].split(':')[0], 10);

                const isMorning = depHour >= 5 && depHour < 12;
                const isAfternoon = depHour >= 12 && depHour < 18;
                const isNight = depHour >= 18 || depHour < 5;

                const matchMorning = filters.time.includes('morning') && isMorning;
                const matchAfternoon = filters.time.includes('afternoon') && isAfternoon;
                const matchNight = filters.time.includes('night') && isNight;

                if (!matchMorning && !matchAfternoon && !matchNight) return false;
            }

            return true;
        });
    }, [offers, filters]);

    // Helper: Format Duration
    const formatDuration = (isoDuration: string) => {
        return isoDuration.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase();
    };

    // Helper: Format Currency
    const formatCurrency = (amount: string, currency: string) => {
        const locale = language === 'pt' ? 'pt-BR' : (language === 'es' ? 'es-ES' : 'en-US');
        return Number(amount).toLocaleString(locale, { style: 'currency', currency: currency, maximumFractionDigits: 0 });
    };

    // Loading Skeleton
    if (loading) {
        return (
            <main className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative selection:bg-rose-500/30">
                <BackgroundGradients />
                <Header />

                <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
                    <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-pulse">
                        <div className="h-8 w-64 bg-white/10 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-white/10 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <div className="h-96 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-pulse"></div>
                        </div>
                        <div className="lg:col-span-3 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#000000] text-white overflow-hidden relative selection:bg-rose-500/30">
            {/* Backgrounds */}
            {bgImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-cover bg-center z-0 fixed"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black z-0 pointer-events-none fixed"></div>
            <BackgroundGradients />
            <Header />

            {/* Header & Title */}
            <div className="relative z-10 pt-32 pb-8 px-4">
                <div className="max-w-7xl mx-auto mb-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-rose-500 mb-2 uppercase tracking-wider">
                        <span className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">{labels.search_results.round_trip}</span>
                        <span className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">{labels.search_results.passenger}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        {origin} <ArrowRight className="text-gray-600" /> {destination}
                    </h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2 font-medium">
                        <Calendar className="w-4 h-4 text-rose-500" /> {date} • {labels.common.economy}
                    </p>
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Error State */}
                    {error && (
                        <div className="max-w-2xl mx-auto p-8 bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-3xl flex flex-col items-center text-center gap-4 mb-8">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <h3 className="text-xl font-bold text-white">{labels.search_results.error_title}</h3>
                            <p className="text-red-200">{error}</p>
                            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all">{labels.search_results.try_again}</button>
                        </div>
                    )}

                    {/* Layout Grid: Filters + Results */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Sidebar Filters */}
                        {!error && offers.length > 0 && (
                            <div className="lg:col-span-1">
                                <SearchFilters
                                    offers={offers}
                                    filters={filters}
                                    setFilters={setFilters}
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                />
                            </div>
                        )}

                        {/* Results List */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Empty State after Filter */}
                            {!error && offers.length > 0 && filteredOffers.length === 0 && (
                                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white mb-2">No flights match your filters</h3>
                                    <button onClick={() => setFilters(prev => ({ ...prev, stops: [], airlines: [], time: [], priceRange: [minPrice, maxPrice] }))} className="text-rose-500 hover:underline">{labels.search_results.reset_filters}</button>
                                </div>
                            )}

                            {/* No Results Original */}
                            {!error && offers.length === 0 && (
                                <div className="max-w-md mx-auto py-20 text-center col-span-full">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                                        <Plane className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{labels.search_results.no_flights}</h3>
                                    <p className="text-gray-400">{labels.search_results.no_flights_desc}</p>
                                </div>
                            )}

                            {filteredOffers.map((offer) => (
                                <div key={offer.id} className="group relative bg-[#151926]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row justify-between gap-8 md:items-center relative z-10">
                                        {/* Flight Route Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-6">
                                                {/* Airline Logo - Using Duffel CDN */}
                                                <div className="h-12 px-3 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                    <AirlineLogo
                                                        iataCode={offer.owner.iata_code}
                                                        name={offer.owner.name}
                                                        size="md"
                                                        variant="lockup"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{offer.owner.name}</h4>
                                                    <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Flight {offer.slices[0].segments[0].operating_carrier_flight_number}</span>
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="flex items-center gap-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-black text-white">{offer.slices[0].segments[0].departing_at.split('T')[1].slice(0, 5)}</div>
                                                    <div className="text-sm font-bold text-gray-500">{offer.slices[0].origin.iata_code}</div>
                                                </div>

                                                <div className="flex-1 flex flex-col items-center px-4">
                                                    <div className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDuration(offer.slices[0].duration)}
                                                    </div>
                                                    <div className="w-full h-[2px] bg-white/20 relative">
                                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500"></div>
                                                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20"></div>
                                                        {/* Visual dots for stops could be added here in future */}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        {(() => {
                                                            const layovers = offer.slices[0].segments.length - 1;
                                                            const technicalStops = offer.slices[0].segments.reduce((acc: number, seg: any) => acc + (seg.stops?.length || 0), 0);
                                                            const totalStops = layovers + technicalStops;

                                                            if (totalStops === 0) return labels.search_results.direct;
                                                            return `${totalStops} ${labels.search_results.stops} ${technicalStops > 0 && layovers === 0 ? '(Tech)' : ''}`;
                                                        })()}
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-2xl font-black text-white">{offer.slices[0].segments[offer.slices[0].segments.length - 1].arriving_at.split('T')[1].slice(0, 5)}</div>
                                                    <div className="text-sm font-bold text-gray-500">{offer.slices[0].destination.iata_code}</div>
                                                </div>
                                            </div>
                                            {/* Offer conditions (Refunds/Changes) */}
                                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-center md:justify-start">
                                                <OfferConditions conditions={offer.conditions} />
                                            </div>
                                        </div>

                                        {/* Vertical Divider (Desktop) */}
                                        <div className="hidden md:block w-[1px] h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                                        {/* Price & CTA */}
                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 min-w-[140px]">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-medium mb-1">{labels.search_results.total_price}</p>
                                                <h3 className="text-3xl font-black text-white tracking-tight">
                                                    {formatCurrency(offer.total_amount, offer.total_currency)}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    localStorage.setItem('selectedOffer', JSON.stringify(offer));
                                                    router.push(`/checkout?offerId=${offer.id}&price=${encodeURIComponent(formatCurrency(offer.total_amount, offer.total_currency))}&destination=${destination}`);
                                                }}
                                                className="bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 w-full md:w-auto"
                                            >
                                                {labels.search_results.select}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function BackgroundGradients() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
            <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        </div>
    );
}
