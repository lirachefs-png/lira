'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronDown, ChevronUp, Filter, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNDCAnalytics } from '@/lib/ndcAnalytics';

interface SearchFiltersProps {
    offers: any[];
    filters: {
        stops: string[];
        airlines: string[];
        time: string[];
        priceRange: [number, number];
        ndcOnly: boolean;
        selectedFlexDate: string | null;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        stops: string[];
        airlines: string[];
        time: string[];
        priceRange: [number, number];
        ndcOnly: boolean;
        selectedFlexDate: string | null;
    }>>;
    minPrice: number;
    maxPrice: number;
}

export default function SearchFilters({ offers, filters, setFilters, minPrice, maxPrice }: SearchFiltersProps) {
    const { trackFilterToggle } = useNDCAnalytics();

    // Accordion States
    const [openSections, setOpenSections] = useState({
        stops: true,
        times: true,
        airlines: true,
        price: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Calculate Counts (Memoized for performance)
    const counts = useMemo(() => {
        const c = {
            direct: 0, oneStop: 0, multiStop: 0,
            morning: 0, afternoon: 0, night: 0,
            airlines: {} as Record<string, number>
        };

        offers.forEach(offer => {
            // Stops
            const segments = offer.slices[0].segments.length;
            if (segments === 1) c.direct++;
            else if (segments === 2) c.oneStop++;
            else c.multiStop++;

            // Times
            const depHour = parseInt(offer.slices[0].segments[0].departing_at.split('T')[1].split(':')[0], 10);
            if (depHour >= 5 && depHour < 12) c.morning++;
            else if (depHour >= 12 && depHour < 18) c.afternoon++;
            else c.night++;

            // Airlines
            const airline = offer.owner.name;
            c.airlines[airline] = (c.airlines[airline] || 0) + 1;
        });

        return c;
    }, [offers]);

    const uniqueAirlines = Object.keys(counts.airlines).sort();

    const handleCheckbox = (category: 'stops' | 'airlines' | 'time', value: string) => {
        setFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    const resetFilters = () => {
        setFilters({ stops: [], airlines: [], time: [], priceRange: [minPrice, maxPrice], ndcOnly: false, selectedFlexDate: null });
    };

    return (
        <aside className="space-y-6 h-fit">
            <div className="bg-white/80 dark:bg-[#151926]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 sticky top-32 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                        <Filter className="w-5 h-5 text-rose-500" /> Filters
                    </h3>
                    {(filters.stops.length > 0 || filters.airlines.length > 0 || filters.time.length > 0 || filters.priceRange[1] < maxPrice || filters.ndcOnly) && (
                        <button
                            onClick={resetFilters}
                            className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-white transition-colors flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> Reset
                        </button>
                    )}
                </div>

                {/* NDC Partners Only Toggle */}
                <div className="pb-4 border-b border-slate-200 dark:border-white/10">
                    <label className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl cursor-pointer hover:from-blue-100 dark:hover:from-blue-500/20 transition-all">
                        <input
                            type="checkbox"
                            checked={filters.ndcOnly}
                            onChange={(e) => {
                                const enabled = e.target.checked;
                                setFilters(prev => ({ ...prev, ndcOnly: enabled }));
                                trackFilterToggle(enabled);
                            }}
                            className="w-4 h-4 accent-blue-500"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-blue-900 dark:text-blue-200">NDC Partners Only</span>
                            </div>
                            <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-0.5">Direct connection, best prices</p>
                        </div>
                    </label>
                </div>

                {/* Price Filter */}
                <div className="space-y-3">
                    <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider hover:text-slate-900 dark:hover:text-white">
                        Price Range
                        {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.price && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2 pb-4 px-1">
                                    <div className="flex justify-between text-sm text-slate-900 dark:text-white font-mono mb-2">
                                        <span>€{filters.priceRange[0]}</span>
                                        <span>€{filters.priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={minPrice}
                                        max={maxPrice}
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                                        className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5"></div>

                {/* Stops Filter */}
                <div className="space-y-3">
                    <button onClick={() => toggleSection('stops')} className="w-full flex items-center justify-between text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider hover:text-slate-900 dark:hover:text-white">
                        Stops
                        {openSections.stops ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.stops && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {[
                                    { id: 'direct', label: 'Direct', count: counts.direct },
                                    { id: '1', label: '1 Stop', count: counts.oneStop },
                                    { id: '2+', label: '2+ Stops', count: counts.multiStop }
                                ].map(opt => (
                                    <label key={opt.id} className={`flex items-center justify-between cursor-pointer group p-2 rounded-lg transition-colors ${filters.stops.includes(opt.id) ? 'bg-slate-100 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${filters.stops.includes(opt.id) ? 'bg-rose-500 border-rose-500' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 group-hover:border-rose-300 dark:group-hover:border-white/30'}`}>
                                                {filters.stops.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={filters.stops.includes(opt.id)} onChange={() => handleCheckbox('stops', opt.id)} />
                                            <span className={`text-sm ${filters.stops.includes(opt.id) ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-400'}`}>{opt.label}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-gray-600 bg-slate-200 dark:bg-black/20 px-2 py-0.5 rounded-full">{opt.count}</span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5"></div>

                {/* Time Filter */}
                <div className="space-y-3">
                    <button onClick={() => toggleSection('times')} className="w-full flex items-center justify-between text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider hover:text-slate-900 dark:hover:text-white">
                        Times
                        {openSections.times ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.times && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {[
                                    { id: 'morning', label: 'Morning', sub: '05:00 - 12:00', count: counts.morning },
                                    { id: 'afternoon', label: 'Afternoon', sub: '12:00 - 18:00', count: counts.afternoon },
                                    { id: 'night', label: 'Evening', sub: '18:00 - 05:00', count: counts.night }
                                ].map(opt => (
                                    <label key={opt.id} className={`flex items-center justify-between cursor-pointer group p-2 rounded-lg transition-colors ${filters.time.includes(opt.id) ? 'bg-slate-100 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${filters.time.includes(opt.id) ? 'bg-rose-500 border-rose-500' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 group-hover:border-rose-300 dark:group-hover:border-white/30'}`}>
                                                {filters.time.includes(opt.id) && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={filters.time.includes(opt.id)} onChange={() => handleCheckbox('time', opt.id)} />
                                            <div>
                                                <span className={`block text-sm ${filters.time.includes(opt.id) ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-400'}`}>{opt.label}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-gray-600 uppercase">{opt.sub}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-gray-600 bg-slate-200 dark:bg-black/20 px-2 py-0.5 rounded-full">{opt.count}</span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full h-[1px] bg-slate-200 dark:bg-white/5"></div>

                {/* Airlines Filter */}
                <div className="space-y-3">
                    <button onClick={() => toggleSection('airlines')} className="w-full flex items-center justify-between text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider hover:text-slate-900 dark:hover:text-white">
                        Airlines
                        {openSections.airlines ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.airlines && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="space-y-1 overflow-y-auto max-h-60 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10"
                            >
                                {uniqueAirlines.map(airline => (
                                    <label key={airline} className={`flex items-center justify-between cursor-pointer group p-2 rounded-lg transition-colors ${filters.airlines.includes(airline) ? 'bg-slate-100 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${filters.airlines.includes(airline) ? 'bg-rose-500 border-rose-500' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 group-hover:border-rose-300 dark:group-hover:border-white/30'}`}>
                                                {filters.airlines.includes(airline) && <Check className="w-2 h-2 text-white" />}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={filters.airlines.includes(airline)} onChange={() => handleCheckbox('airlines', airline)} />
                                            <span className={`text-sm truncate max-w-[120px] ${filters.airlines.includes(airline) ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-400'}`}>{airline}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-gray-600 bg-slate-200 dark:bg-black/20 px-2 py-0.5 rounded-full">{counts.airlines[airline]}</span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </aside>
    );
}
