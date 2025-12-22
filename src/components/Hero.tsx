'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ChevronDown, Plus, Trash2 } from 'lucide-react';
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

    const [bgImage, setBgImage] = useState<string | null>(null);

    // Passenger State
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [cabin, setCabin] = useState('economy');

    // Corporate Fares State (Hidden but present for logic)
    const [corporateAirline, setCorporateAirline] = useState<string | null>(null);
    const [corporateCode, setCorporateCode] = useState<string | null>(null);

    // Load Background Image
    useEffect(() => {
        const loadBg = async () => {
            const img = await getUnsplashImage('tropical beach travel');
            if (img) setBgImage(img);
        };
        loadBg();
    }, []);

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

        if (tripType === 'multicity') {
            // Validate Slices
            const validSlices = slices.filter(s => s.origin && s.destination && s.date);
            if (validSlices.length < slices.length) {
                alert('Por favor, preencha todos os campos dos trechos.');
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
                alert('Por favor, selecione origem, destino e data.');
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

            {/* Background Wrapper */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {bgImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white dark:from-black/30 dark:via-black/10 dark:to-black z-0 transition-colors duration-500"></div>

                {/* Visual Effects */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[100px]"
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
                    className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-2"
                >
                    {labels.hero.headline_1}
                </motion.h1>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-5xl sm:text-7xl font-black tracking-tight mb-8"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700] drop-shadow-2xl">
                        {labels.hero.headline_2}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-slate-600 dark:text-gray-400 max-w-xl mb-12 font-medium"
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
                                {tripType === 'multicity' ? 'Multitrecho' : (tripType === 'roundtrip' ? labels.hero.roundtrip : 'Só Ida')}
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isTripTypeOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isTripTypeOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-0 pt-2 w-48 z-[130]"
                                >
                                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-1 overflow-hidden">
                                        <button
                                            onClick={() => { setTripType('roundtrip'); setIsTripTypeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'roundtrip' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {labels.hero.roundtrip}
                                        </button>
                                        <button
                                            onClick={() => { setTripType('oneway'); setIsTripTypeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'oneway' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            Só Ida
                                        </button>
                                        <button
                                            onClick={() => { setTripType('multicity'); setIsTripTypeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'multicity' ? 'bg-rose-50 text-rose-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            Multitrecho
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
                    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 h-auto min-h-[120px] relative z-10 flex items-center justify-between gap-4">

                        {tripType === 'multicity' ? (
                            <div className="flex flex-col gap-3">
                                {slices.map((slice, index) => (
                                    <div key={index} className="flex flex-col lg:flex-row gap-2 items-end">
                                        <div className="flex flex-col md:flex-row gap-2 flex-[3] w-full">
                                            <LocationSearch
                                                label={`Origem ${index + 1}`}
                                                placeholder="Cidade"
                                                value={slice.origin}
                                                onChange={(val) => updateSlice(index, 'origin', val)}
                                            />
                                            <LocationSearch
                                                label={`Destino ${index + 1}`}
                                                placeholder="Cidade"
                                                value={slice.destination}
                                                onChange={(val) => updateSlice(index, 'destination', val)}
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
                                            <DatePicker
                                                label="Data"
                                                date={slice.date}
                                                setDate={(date) => updateSlice(index, 'date', date)}
                                            />
                                        </div>
                                        {slices.length > 1 && (
                                            <button
                                                onClick={() => removeSlice(index)}
                                                className="mb-2 p-2 text-slate-400 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={addSlice}
                                        className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Adicionar Trecho
                                    </button>

                                    <button
                                        onClick={handleSearch}
                                        className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-xl px-10 h-14 font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 justify-center"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Search className="w-5 h-5" /> {labels.hero.search}</>}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* MODO NORMAL - TUDO EM UMA LINHA */
                            <div className="flex flex-col lg:flex-row gap-4 items-end">
                                <div className="flex flex-col md:flex-row gap-2 flex-[2] w-full">
                                    <LocationSearch label="De onde?" placeholder="Cidade" value={origin} onChange={setOrigin} />
                                    <LocationSearch label="Para onde?" placeholder="Cidade" value={destination} onChange={setDestination} />
                                </div>

                                <div className="flex flex-col md:flex-row gap-2 flex-[1.5] w-full">
                                    <DatePicker label="Partida" date={date} setDate={setDate} />
                                    {tripType === 'roundtrip' && (
                                        <DatePicker label="Volta" date={returnDate} setDate={setReturnDate} />
                                    )}
                                </div>

                                {/* BOTÃO AGORA ALINHADO NA BASE */}
                                <div className="flex justify-end w-full lg:w-auto">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-xl px-8 h-14 font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2 justify-center min-w-[160px]"
                                    >
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Search className="w-5 h-5" /> {labels.hero.search}</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div >
        </div >
    );
}
