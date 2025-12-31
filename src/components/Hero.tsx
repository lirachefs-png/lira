'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ChevronDown, Plus, Trash2, Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getUnsplashImage } from '@/lib/unsplash';
import { format } from 'date-fns';
import LocationSearch from './ui/LocationSearch';
import PassengerSelector from './ui/PassengerSelector';
import DatePicker from './ui/DatePicker';
import { useRegion } from '@/contexts/RegionContext';
import { SITE_CONFIG } from '@/lib/constants';

interface Slice {
    origin: string;
    destination: string;
    date: Date | undefined;
}

export default function Hero() {
    const router = useRouter();
    const { labels } = useRegion();
    const [loading, setLoading] = useState(false);

    // Search Type State
    const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
    const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);

    // Standard Search State
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState<Date | undefined>();
    const [returnDate, setReturnDate] = useState<Date | undefined>();

    // Multi-city State
    const [slices, setSlices] = useState<Slice[]>([
        { origin: '', destination: '', date: undefined },
        { origin: '', destination: '', date: undefined }
    ]);



    // Passenger State
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabin, setCabin] = useState('economy');

    // Advanced Options State
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [flexibleDates, setFlexibleDates] = useState(false);
    const [corporateCode, setCorporateCode] = useState('');
    const [corporateAirline, setCorporateAirline] = useState('');



    // Multi-city Handlers
    const addSlice = () => {
        setSlices([...slices, { origin: '', destination: '', date: undefined }]);
    };

    const removeSlice = (index: number) => {
        if (slices.length > 1) {
            const newSlices = [...slices];
            newSlices.splice(index, 1);
            setSlices(newSlices);
        }
    };

    const updateSlice = (index: number, field: keyof Slice, value: any) => {
        const newSlices = [...slices];
        newSlices[index] = { ...newSlices[index], [field]: value };
        setSlices(newSlices);
    };

    const handleSearch = () => {
        setLoading(true);

        const params = new URLSearchParams({
            adults: passengers.adults.toString(),
            children: passengers.children.toString(),
            infants: passengers.infants.toString(),
            cabin: cabin
        });

        // Add flexible dates option
        if (flexibleDates) {
            params.append('flexible', 'true');
        }

        // Add private fare if provided
        if (corporateCode && corporateAirline) {
            const privateFares = {
                [corporateAirline.toUpperCase()]: [{ corporate_code: corporateCode }]
            };
            params.append('private_fares', JSON.stringify(privateFares));
        }

        if (tripType === 'multicity') {
            // Validate Slices
            const validSlices = slices.filter(s => s.origin && s.destination && s.date);
            if (validSlices.length < slices.length) {
                alert(labels.search_widget.fill_all_fields);
                setLoading(false);
                return;
            }

            const formattedSlices = validSlices.map(s => ({
                origin: s.origin,
                destination: s.destination,
                departure_date: format(s.date!, 'yyyy-MM-dd')
            }));

            params.append('slices', JSON.stringify(formattedSlices));
        } else {
            // Standard Validation
            if (!origin || !destination || !date) {
                alert(labels.search_widget.select_origin_dest_date);
                setLoading(false);
                return;
            }

            params.append('origin', origin);
            params.append('destination', destination);
            params.append('date', format(date, 'yyyy-MM-dd'));

            if (tripType === 'roundtrip' && returnDate) {
                params.append('returnDate', format(returnDate, 'yyyy-MM-dd'));
            }
        }

        router.push(`/search?${params.toString()}`);
    };




    return (
        <div className="relative z-50 pt-20 md:pt-32 pb-10 bg-background transition-colors duration-500">

            {/* Ken Burns Background Slider */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Photo Slides with Ken Burns Effect */}
                <div className="hero-slider absolute inset-0 z-0">
                    {/* 6 High-Quality Unsplash Travel Photos - Verified URLs */}
                    <div
                        className="slide slide-1"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80")' }}
                    />
                    <div
                        className="slide slide-2"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80")' }}
                    />
                    <div
                        className="slide slide-3"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80")' }}
                    />
                    <div
                        className="slide slide-4"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80")' }}
                    />
                    <div
                        className="slide slide-5"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1920&q=80")' }}
                    />
                    <div
                        className="slide slide-6"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1920&q=80")' }}
                    />
                </div>

                {/* Gradient Transition to Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#0B0F19] z-10 transition-colors duration-500" />

                {/* Visual Effects - Subtle Glow */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] z-20"
                />
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[100px] z-20"
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">

                {/* Pulsing Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 backdrop-blur-md mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff0080] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0080]"></span>
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-white tracking-wide">{labels.hero.badge}</span>
                </motion.div>

                {/* Main Headlines */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-2 drop-shadow-lg"
                    style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.7)' }}
                >
                    {labels.hero.headline_1}
                </motion.h1>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-5xl sm:text-7xl font-black tracking-tight mb-8"
                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0080] via-[#ff6600] to-[#ffd000] drop-shadow-2xl" style={{ filter: 'saturate(1.5) brightness(1.1)' }}>
                        {labels.hero.headline_2}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-white max-w-xl mb-12 font-medium drop-shadow-md"
                    style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
                >
                    {labels.hero.subheadline}
                </motion.p>

                {/* SEARCH WIDGET CONTAINER */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                    className="w-full max-w-7xl px-2 sm:px-0"
                >
                    {/* Tabs / Top Options Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 px-2 sm:px-4">
                        {/* Trip Type Selector */}
                        <div
                            className="relative z-[120]"
                            onMouseLeave={() => setIsTripTypeOpen(false)}
                            onMouseEnter={() => setIsTripTypeOpen(true)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsTripTypeOpen(!isTripTypeOpen);
                                }}
                                className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                            >
                                {tripType === 'multicity' ? labels.search_widget.multicity : (tripType === 'roundtrip' ? labels.search_widget.roundtrip : labels.search_widget.oneway)}
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isTripTypeOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isTripTypeOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-0 pt-2 w-48 z-[130]"
                                >
                                    <div className="bg-white dark:bg-[#1A1F2E] dark:border dark:border-white/10 rounded-xl shadow-xl border border-slate-100 p-1 overflow-hidden">
                                        <button
                                            onClick={() => { setTripType('roundtrip'); setIsTripTypeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'roundtrip' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                        >
                                            {labels.search_widget.roundtrip}
                                        </button>
                                        <button
                                            onClick={() => { setTripType('oneway'); setIsTripTypeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'oneway' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                        >
                                            {labels.search_widget.oneway}
                                        </button>
                                        <button
                                            onClick={() => { setTripType('multicity'); setIsTripTypeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'multicity' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                                        >
                                            {labels.search_widget.multicity}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Passenger & Class Selector */}
                        <div className="z-[110]">
                            <PassengerSelector
                                passengers={passengers}
                                setPassengers={setPassengers}
                                cabin={cabin}
                                setCabin={setCabin}
                                minimal={true}
                            />
                        </div>
                    </div>

                    {/* Main Search Inputs - CAIXA BRANCA AJUSTADA */}
                    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-[#1A1F2E] dark:border dark:border-white/10 rounded-3xl shadow-2xl py-4 px-5 h-auto min-h-[100px] relative z-10 flex items-center justify-between gap-4 transition-colors">

                        {tripType === 'multicity' ? (
                            <div className="flex flex-col gap-4 w-full animate-in fade-in zoom-in-95 duration-300">
                                <div className="space-y-3">
                                    {slices.map((slice, index) => (
                                        <div key={index} className="relative group">
                                            <div className="flex flex-col lg:flex-row gap-3 items-end bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 transition-all hover:border-rose-200 dark:hover:border-rose-500/30">
                                                {/* Badge do Trecho */}
                                                <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                                                    {index + 1}
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-3 flex-[3] w-full">
                                                    <div className="flex-1">
                                                        <LocationSearch
                                                            label={index === 0 ? "De onde?" : "De"}
                                                            placeholder="Cidade de origem"
                                                            value={slice.origin}
                                                            onChange={(val) => updateSlice(index, 'origin', val)}
                                                        />
                                                    </div>
                                                    <div className="flex-[0.1] hidden md:flex items-center justify-center pt-6">
                                                        <Plane className="w-4 h-4 text-slate-300 rotate-90" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <LocationSearch
                                                            label={index === 0 ? "Para onde?" : "Para"}
                                                            placeholder="Cidade de destino"
                                                            value={slice.destination}
                                                            onChange={(val) => updateSlice(index, 'destination', val)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 w-full lg:w-auto min-w-[200px]">
                                                    <div className="flex-1">
                                                        <DatePicker
                                                            label={index === 0 ? "Data de Ida" : "Data"}
                                                            date={slice.date}
                                                            setDate={(date) => updateSlice(index, 'date', date)}
                                                        />
                                                    </div>

                                                    {slices.length > 2 && (
                                                        <button
                                                            onClick={() => removeSlice(index)}
                                                            className="flex items-center justify-center w-12 h-[52px] rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-transparent hover:border-red-200 transition-all"
                                                            title="Remover trecho"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 pt-4 border-t border-slate-100 dark:border-white/10">
                                    <button
                                        onClick={addSlice}
                                        className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-5 py-3 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                                            <Plus className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                        </div>
                                        Adicionar outro voo
                                    </button>

                                    <button
                                        onClick={handleSearch}
                                        className="w-full sm:w-auto bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700] text-white rounded-xl px-12 h-14 font-black text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 flex items-center gap-3 justify-center transform hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <Search className="w-5 h-5" strokeWidth={3} />
                                                <span>BUSCAR VOOS</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* MODO NORMAL - TUDO EM UMA LINHA */
                            <div className="flex flex-col lg:flex-row gap-4 items-end">
                                <div className="flex flex-col md:flex-row gap-2 flex-[2] w-full">
                                    <LocationSearch label={labels.search_widget.from} placeholder={labels.search_widget.city} value={origin} onChange={setOrigin} />
                                    <LocationSearch label={labels.search_widget.to} placeholder={labels.search_widget.city} value={destination} onChange={setDestination} />
                                </div>

                                <div className="flex flex-col md:flex-row gap-2 flex-[1.5] w-full">
                                    <DatePicker label={labels.search_widget.departure} date={date} setDate={setDate} />
                                    {tripType === 'roundtrip' && (
                                        <DatePicker label={labels.search_widget.return_date} date={returnDate} setDate={setReturnDate} />
                                    )}
                                </div>

                                {/* BOTÃO AGORA ALINHADO NA BASE */}
                                <div className="flex justify-end w-full lg:w-auto">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-xl px-8 h-12 font-bold text-base shadow-lg transition-all active:scale-95 flex items-center gap-2 justify-center min-w-[150px]"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Search className="w-5 h-5" /> {labels.hero.search}</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Advanced Options Toggle & Panel */}
                    <div className="mt-4 max-w-6xl mx-auto">
                        <button
                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                            className="text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-2 transition-colors mx-auto"
                        >
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
                            {showAdvancedOptions ? labels.search_widget.hide_options : labels.search_widget.advanced_options}
                        </button>

                        <AnimatePresence>
                            {showAdvancedOptions && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 bg-white dark:bg-[#1A1F2E] dark:border dark:border-white/10 rounded-2xl shadow-lg p-5 overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Flexibility Toggle */}
                                        <div className="flex-1">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={flexibleDates}
                                                    onChange={(e) => setFlexibleDates(e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500 accent-rose-500"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{labels.search_widget.flexible_dates}</p>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400">{labels.search_widget.flexible_desc}</p>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Corporate Code */}
                                        <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
                                            <p className="font-bold text-slate-900 dark:text-white text-sm mb-2">{labels.search_widget.corporate_code} / {labels.search_widget.private_fare}</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder={labels.search_widget.airline_placeholder}
                                                    value={corporateAirline}
                                                    onChange={(e) => setCorporateAirline(e.target.value.toUpperCase())}
                                                    className="w-24 px-3 py-2 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-rose-500 uppercase"
                                                    maxLength={2}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder={labels.search_widget.code_placeholder}
                                                    value={corporateCode}
                                                    onChange={(e) => setCorporateCode(e.target.value.toUpperCase())}
                                                    className="flex-1 px-3 py-2 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-rose-500 uppercase"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{labels.search_widget.corporate_desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div >
        </div >
    );
}
