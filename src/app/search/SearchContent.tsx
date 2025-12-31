'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

import { Loader2, Plane, Calendar, AlertCircle, ArrowRight, Clock, Shield } from 'lucide-react';
import { getUnsplashImage } from '@/lib/unsplash';
import { motion } from 'framer-motion';
import SearchFilters from '@/components/search/SearchFilters';
import OfferConditions from '@/components/search/OfferConditions';
import AirlineLogo from '@/components/ui/AirlineLogo';
import { useRegion } from '@/contexts/RegionContext';
import { getNDCAirlines } from '@/lib/airlines';

export default function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { labels, language } = useRegion();

    // Helper: Check if airline is NDC partner
    const ndcAirlines = getNDCAirlines();
    const isNDCPartner = (airlineCode: string) => {
        return ndcAirlines.some(airline => airline.code === airlineCode);
    };
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Flexible Dates State
    const [priceCalendar, setPriceCalendar] = useState<any[]>([]);
    const [isFlexibleSearch, setIsFlexibleSearch] = useState(false);
    const [cheapestDate, setCheapestDate] = useState<string | null>(null);

    // Filter State
    const [filters, setFilters] = useState({
        stops: [] as string[],
        airlines: [] as string[],
        time: [] as string[],
        priceRange: [0, 10000] as [number, number],
        ndcOnly: false,
        selectedFlexDate: null as string | null, // Filter by flexible date
    });

    // Dynamic Background State
    const [bgImage, setBgImage] = useState<string | null>(null);

    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const returnDate = searchParams.get('returnDate');
    const slicesParam = searchParams.get('slices');

    // Parse slices for title display
    const parsedSlices = useMemo(() => {
        if (slicesParam) {
            try {
                return JSON.parse(slicesParam);
            } catch (e) {
                return [];
            }
        }
        return [];
    }, [slicesParam]);

    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let pollInterval: NodeJS.Timeout;

        const fetchFlights = async () => {
            setLoading(true);
            setError('');
            setIsPolling(false);

            try {
                const params: Record<string, string> = {
                    date,
                    adults: searchParams.get('adults') || '1',
                    children: searchParams.get('children') || '0',
                    infants: searchParams.get('infants') || '0',
                    cabin: searchParams.get('cabin') || 'economy'
                };

                // If standard search
                if (origin) params.origin = origin;
                if (destination) params.destination = destination;
                if (returnDate) params.returnDate = returnDate;

                // Handle Slices (Multi-city)
                if (slicesParam) params.slices = slicesParam;

                // Advanced Params
                const fareType = searchParams.get('fare_type');
                const privateFares = searchParams.get('private_fares');
                const flexible = searchParams.get('flexible');

                if (fareType) params.fare_type = fareType;
                if (privateFares) params.private_fares = privateFares;

                // FORCE ASYNC for standard searches (non-flexible) to enable progressive loading
                const isFlexible = flexible === 'true';
                if (isFlexible) {
                    params.flexible = 'true';
                } else {
                    params.async = 'true';
                }

                const query = new URLSearchParams(params);
                console.log('🚀 Starting Search:', query.toString());

                const res = await fetch(`/api/search?${query.toString()}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to search');

                // Case 1: Flexible Search (Synchronous)
                if (data.flexible && data.priceCalendar) {
                    setOffers(data.data || []);
                    setIsFlexibleSearch(true);
                    setPriceCalendar(data.priceCalendar);
                    setCheapestDate(data.cheapestDate || null);
                    if (isMounted) setLoading(false);
                    return;
                }

                // Case 2: Async Search Initialized (Polling)
                if (data.async && data.searchId) {
                    console.log('⏳ Async Search Started. ID:', data.searchId);
                    setIsFlexibleSearch(false);
                    setIsPolling(true);

                    // Start Polling
                    const poll = async () => {
                        if (!isMounted) return;
                        try {
                            const pollRes = await fetch(`/api/search?searchId=${data.searchId}`);
                            const pollData = await pollRes.json();

                            if (pollData.data) {
                                console.log(`📦 Polling Update: ${pollData.data.length} offers`);
                                setOffers(pollData.data);

                                // Improve User Experience: Show results as soon as we have ANY
                                if (pollData.data.length > 0 && isMounted) {
                                    setLoading(false);
                                }
                            }

                            if (pollData.complete) {
                                console.log('✅ Search Complete');
                                setIsPolling(false);
                                if (isMounted) setLoading(false);
                                clearInterval(pollInterval);
                            }
                        } catch (e) {
                            console.error('Polling error:', e);
                        }
                    };

                    // Initial Poll immediately, then interval
                    poll();
                    pollInterval = setInterval(poll, 2000);

                    // Timeout safety (45s)
                    setTimeout(() => {
                        if (isMounted && isPolling) {
                            clearInterval(pollInterval);
                            setIsPolling(false);
                            setLoading(false);
                        }
                    }, 45000);

                    return;
                }

                // Case 3: Standard Synchronous Response (Fallback)
                const fetchedOffers = data.data || [];
                setOffers(fetchedOffers);
                setIsFlexibleSearch(false);
                if (isMounted) setLoading(false);

                // Set initial price range
                if (fetchedOffers.length > 0) {
                    const prices = fetchedOffers.map((o: any) => parseFloat(o.total_amount));
                    const min = Math.floor(Math.min(...prices));
                    const max = Math.ceil(Math.max(...prices));
                    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
                }

            } catch (err: any) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        if ((origin && destination) || slicesParam) {
            fetchFlights();
        }

        return () => {
            isMounted = false;
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [origin, destination, date, returnDate, slicesParam]);

    // Dynamic Background Effect
    useEffect(() => {
        const targetDest = destination || (parsedSlices.length > 0 ? parsedSlices[parsedSlices.length - 1].destination : '');
        if (targetDest) {
            getUnsplashImage(`${targetDest} tropical beach paradise travel`).then(url => {
                if (url) setBgImage(url);
            });
        }
    }, [destination, parsedSlices]);

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
                // Check stops for ALL slices (if any slice fails, offer fails?) or total stops?
                // Usually filters apply to the 'worst' leg or any leg. 
                // Let's check the first slice for simplicity or average? 
                // Better: Check if ANY slice matches the criteria? Or ALL? 
                // Standard behavior: Filter out if it doesn't match preference. 
                // If I want direct, ALL legs must be direct.

                const allDirect = offer.slices.every((s: any) => s.segments.length === 1);
                const hasOneStop = offer.slices.some((s: any) => s.segments.length === 2);
                const hasMultiStop = offer.slices.some((s: any) => s.segments.length > 2);

                const matchDirect = filters.stops.includes('direct') && allDirect;
                const matchOne = filters.stops.includes('1') && !allDirect && hasOneStop && !hasMultiStop; // Simplified logic
                // Actually, let's keep it simple: Filter based on the 'primary' or first slice for now, or total stops.
                // Let's iterate:
                const segments = offer.slices[0].segments.length; // Fallback to first slice logic for consistency with previous code
                const isDirect = segments === 1;
                const isOneStop = segments === 2;
                const isMultiStop = segments > 2;

                const matchDirectOld = filters.stops.includes('direct') && isDirect;
                const matchOneOld = filters.stops.includes('1') && isOneStop;
                const matchMultiOld = filters.stops.includes('2+') && isMultiStop;

                if (!matchDirectOld && !matchOneOld && !matchMultiOld) return false;
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

            // NDC Partners Only Filter
            if (filters.ndcOnly && !isNDCPartner(offer.owner.iata_code)) {
                return false;
            }

            // Flexible Date Filter
            if (filters.selectedFlexDate && offer._flexibleDate) {
                if (offer._flexibleDate !== filters.selectedFlexDate) return false;
            }

            return true;
        });
    }, [offers, filters, ndcAirlines]);

    // Find the cheapest offer ID for the "Best Price" badge
    const cheapestOfferId = useMemo(() => {
        if (filteredOffers.length === 0) return null;
        const sorted = [...filteredOffers].sort((a, b) =>
            parseFloat(a.total_amount) - parseFloat(b.total_amount)
        );
        return sorted[0]?.id || null;
    }, [filteredOffers]);

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
            <main className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-white overflow-hidden relative selection:bg-rose-500/30 transition-colors">
                <BackgroundGradients />


                <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
                    <div className="mb-8 p-6 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md animate-pulse">
                        <div className="h-8 w-64 bg-slate-200 dark:bg-white/10 rounded mb-2"></div>
                        <div className="h-4 w-48 bg-slate-200 dark:bg-white/10 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <div className="h-96 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md animate-pulse"></div>
                        </div>
                        <div className="lg:col-span-3 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-[#000000] text-slate-900 dark:text-white overflow-hidden relative selection:bg-rose-500/30 transition-colors">
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
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-black/90 dark:via-black/70 dark:to-black z-0 pointer-events-none fixed transition-colors duration-500"></div>
            <BackgroundGradients />


            {/* Header & Title */}
            <div className="relative z-10 pt-32 pb-8 px-4">
                <div className="max-w-7xl mx-auto mb-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-rose-500 mb-2 uppercase tracking-wider">
                        <span className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                            {parsedSlices.length > 0 ? labels.search_widget.multicity : labels.search_results.round_trip}
                        </span>
                        <span className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">{labels.search_results.passenger}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        {parsedSlices.length > 0 ? (
                            <span className="flex flex-wrap gap-2 items-center">
                                {parsedSlices.map((slice: any, idx: number) => (
                                    <span key={idx} className="flex items-center gap-2">
                                        {slice.origin} <ArrowRight className="w-5 h-5 text-gray-400" /> {slice.destination}
                                        {idx < parsedSlices.length - 1 && <span className="text-gray-300 mx-2">|</span>}
                                    </span>
                                ))}
                            </span>
                        ) : (
                            <>{origin} <ArrowRight className="text-gray-400 dark:text-gray-600" /> {destination}</>
                        )}
                    </h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-2 flex items-center gap-2 font-medium">
                        <Calendar className="w-4 h-4 text-rose-500" /> {date} • {labels.common.economy}
                        {isPolling && (
                            <span className="ml-4 flex items-center gap-2 text-xs font-bold text-indigo-500 animate-pulse bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Buscando mais companhias...
                            </span>
                        )}
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

                    {/* Flexible Dates Price Calendar */}
                    {isFlexibleSearch && priceCalendar.length > 0 && (
                        <div className="mb-8 bg-white/80 dark:bg-[#151926]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-rose-500" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Datas Flexíveis</h3>
                                <span className="text-xs text-slate-500 dark:text-gray-400">• Preços mais baixos por dia</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
                                {priceCalendar.map((dayData) => {
                                    const isSelected = filters.selectedFlexDate === dayData.date || (filters.selectedFlexDate === null && dayData.isSelected);
                                    const isCheapest = cheapestDate === dayData.date;
                                    const displayDate = new Date(dayData.date);
                                    const dayName = displayDate.toLocaleDateString('pt-PT', { weekday: 'short' });
                                    const dayNum = displayDate.getDate();

                                    return (
                                        <button
                                            key={dayData.date}
                                            onClick={() => setFilters(prev => ({
                                                ...prev,
                                                selectedFlexDate: prev.selectedFlexDate === dayData.date ? null : dayData.date
                                            }))}
                                            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 transition-all min-w-[80px] ${isSelected
                                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                                                : isCheapest
                                                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                                                    : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                                }`}
                                        >
                                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">{dayName}</span>
                                            <span className={`text-lg font-black ${isSelected ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{dayNum}</span>
                                            {dayData.cheapestPrice !== null ? (
                                                <span className={`text-xs font-bold mt-1 ${isCheapest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-gray-400'}`}>
                                                    €{Math.round(dayData.cheapestPrice)}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400">--</span>
                                            )}
                                            {isCheapest && (
                                                <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">MELHOR</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            {filters.selectedFlexDate && (
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, selectedFlexDate: null }))}
                                        className="text-xs text-rose-500 hover:underline"
                                    >
                                        Ver todos os dias
                                    </button>
                                </div>
                            )}
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
                                <div className="text-center py-20 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No flights match your filters</h3>
                                    <button onClick={() => setFilters(prev => ({ ...prev, stops: [], airlines: [], time: [], priceRange: [minPrice, maxPrice], ndcOnly: false, selectedFlexDate: null }))} className="text-rose-500 hover:underline">{labels.search_results.reset_filters}</button>
                                </div>
                            )}

                            {/* No Results Original */}
                            {!error && offers.length === 0 && (
                                <div className="max-w-md mx-auto py-20 text-center col-span-full">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-white/10">
                                        <Plane className="w-10 h-10 text-slate-400 dark:text-gray-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{labels.search_results.no_flights}</h3>
                                    <p className="text-slate-500 dark:text-gray-400">{labels.search_results.no_flights_desc}</p>
                                </div>
                            )}

                            {filteredOffers.map((offer) => (
                                <div key={offer.id} className="group relative bg-white dark:bg-[#151926]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 hover:bg-slate-50 dark:hover:bg-white/10 hover:border-rose-200 dark:hover:border-white/20 transition-all duration-300 shadow-sm dark:shadow-none">
                                    <div className="flex flex-col md:flex-row justify-between gap-8 md:items-center relative z-10">
                                        {/* Flight Route Info */}
                                        {/* Flight Route Info - Loops through ALL slices (legs) */}
                                        <div className="flex-1 space-y-6">
                                            {offer.slices.map((slice: any, index: number) => (
                                                <div key={slice.id} className={`${index > 0 ? 'pt-4 border-t border-slate-100 dark:border-white/5' : ''}`}>
                                                    {/* Slice Header (optional, mainly for accessibility or clarity) */}
                                                    {/* <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Flight {index + 1}</div> */}

                                                    <div className="flex items-center gap-4 mb-4">
                                                        {/* Airline Logo - Show for each slice, or just once? Usually once per offer is cleaner, but different legs might be different airlines (interline) */}
                                                        {/* For simplicity/cleanliness, we show the airline next to each leg if it's different, OR just keep the main logo above. 
                                                                Let's keep the main logo layout for the FIRST slice, and smaller textual info for subsequent ones if needed. 
                                                                ACTUALLY, standard travel UI shows each leg clearly. */}

                                                        <div className="flex-1">
                                                            {/* Leg Details */}
                                                            <div className="flex flex-col md:flex-row items-center gap-6">

                                                                {/* Airline Info Small (for multi-leg clarity) */}
                                                                <div className="flex items-center gap-2 min-w-[120px]">
                                                                    <div className="w-8 h-8 relative flex items-center justify-center bg-white rounded-md p-1 shadow-sm border border-slate-100">
                                                                        <AirlineLogo
                                                                            iataCode={slice.segments[0].operating_carrier.iata_code}
                                                                            name={slice.segments[0].operating_carrier.name}
                                                                            size="sm"
                                                                        />
                                                                    </div>
                                                                    <div className="text-xs font-medium text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">
                                                                        {slice.segments[0].operating_carrier.name}
                                                                    </div>
                                                                </div>

                                                                {/* Times & Route */}
                                                                <div className="flex items-center gap-6 flex-1 w-full justify-between md:justify-start">
                                                                    <div className="text-center">
                                                                        <div className="text-xl font-black text-slate-900 dark:text-white">{slice.segments[0].departing_at.split('T')[1].slice(0, 5)}</div>
                                                                        <div className="text-sm font-bold text-slate-500">{slice.origin.iata_code}</div>
                                                                    </div>

                                                                    <div className="flex-1 flex flex-col items-center px-4 min-w-[100px] md:max-w-[150px]">
                                                                        <div className="text-xs font-medium text-slate-400 dark:text-gray-400 mb-2 flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {formatDuration(slice.duration)}
                                                                        </div>
                                                                        <div className="w-full h-[2px] bg-slate-200 dark:bg-white/20 relative">
                                                                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-rose-500"></div>
                                                                            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20"></div>
                                                                        </div>
                                                                        <div className="text-xs text-slate-500 dark:text-gray-500 mt-2 text-center">
                                                                            {(() => {
                                                                                const layovers = slice.segments.length - 1;
                                                                                const technicalStops = slice.segments.reduce((acc: number, seg: any) => acc + (seg.stops?.length || 0), 0);
                                                                                const totalStops = layovers + technicalStops;

                                                                                if (totalStops === 0) return labels.search_results.direct;
                                                                                return `${totalStops} ${labels.search_results.stops}`;
                                                                            })()}
                                                                        </div>
                                                                    </div>

                                                                    <div className="text-center">
                                                                        <div className="text-xl font-black text-slate-900 dark:text-white">{slice.segments[slice.segments.length - 1].arriving_at.split('T')[1].slice(0, 5)}</div>
                                                                        <div className="text-sm font-bold text-slate-500">{slice.destination.iata_code}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Offer conditions (Refunds/Changes) */}
                                            <div className="pt-2 flex justify-center md:justify-start">
                                                <OfferConditions conditions={offer.conditions} />
                                            </div>
                                        </div>

                                        {/* Vertical Divider (Desktop) */}
                                        <div className="hidden md:block w-[1px] h-24 bg-gradient-to-b from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

                                        {/* Price & CTA */}
                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-2 min-w-[160px]">
                                            {/* Best Price Badge - Only on cheapest offer */}
                                            {offer.id === cheapestOfferId && (
                                                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 mb-2">
                                                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Melhor Preço</span>
                                                </div>
                                            )}

                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">{labels.search_results.total_price}</p>
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                                    {formatCurrency(offer.total_amount, offer.total_currency)}
                                                </h3>
                                                <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">via AllTrip • Direto da companhia</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    console.log('💾 Saving offer to localStorage:', offer.id, offer.total_amount, offer.total_currency);
                                                    localStorage.setItem('selectedOffer', JSON.stringify(offer));
                                                    console.log('✅ Offer saved. Navigating to checkout...');
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
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        </div>
    );
}
