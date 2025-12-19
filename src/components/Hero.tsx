'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUnsplashImage } from '@/lib/unsplash';
import { format } from 'date-fns';
import LocationSearch from './ui/LocationSearch';
import DatePicker from './ui/DatePicker';
import { useRegion } from '@/contexts/RegionContext';

export default function Hero() {
    const router = useRouter();
    const { labels } = useRegion();
    const [loading, setLoading] = useState(false);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState<Date | undefined>();
    const [returnDate, setReturnDate] = useState<Date | undefined>();
    const [bgImage, setBgImage] = useState<string | null>(null);

    useEffect(() => {
        getUnsplashImage('tropical paradise beach aerial travel').then(url => {
            if (url) setBgImage(url);
        });
    }, []);

    const handleSearch = () => {
        if (!origin || !destination || !date) {
            alert('Por favor, selecione origem, destino e data.');
            return;
        }
        setLoading(true);

        const params = new URLSearchParams({
            origin,
            destination,
            date: format(date, 'yyyy-MM-dd'),
        });

        if (returnDate) {
            params.append('returnDate', format(returnDate, 'yyyy-MM-dd'));
        }

        router.push(`/search?${params.toString()}`);
    };

    const PARTNERS = ['LA', 'AD', 'G3', 'TP', 'AA', 'UA', 'AF']; // Latam, Azul, Gol, TAP, AA, United, AirFrance

    return (
        <div className="relative z-50 pt-32 pb-32 sm:pt-40 sm:pb-40 bg-background transition-colors duration-500 overflow-hidden">

            {/* Background Wrapper */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Dynamic Background Image */}
                {bgImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url(${bgImage})` }}
                    />
                )}

                {/* Theme-Aware Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white dark:from-black/30 dark:via-black/10 dark:to-black z-0 transition-colors duration-500"></div>

                {/* Animated Background Gradients */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
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
                    className="w-full max-w-5xl px-2 sm:px-0"
                >

                    {/* Tabs */}
                    <div className="flex items-center gap-6 mb-4 px-4">
                        <button className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 border-b-2 border-slate-900 dark:border-white pb-1">
                            {labels.hero.roundtrip}
                        </button>
                        <button className="text-slate-500 dark:text-gray-400 font-medium text-sm flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {labels.hero.passenger}
                        </button>
                    </div>

                    {/* Inputs Row */}
                    <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2 relative z-[100]">

                        <LocationSearch
                            label="De onde?"
                            placeholder="Cidade ou Aeroporto"
                            value={origin}
                            onChange={setOrigin}
                        />

                        <LocationSearch
                            label="Para onde?"
                            placeholder="Cidade ou Aeroporto"
                            value={destination}
                            onChange={setDestination}
                        />

                        {/* Dates */}
                        <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full md:w-auto">
                            <DatePicker
                                label="Partida"
                                date={date}
                                setDate={setDate}
                            />

                            <DatePicker
                                label="Volta"
                                date={returnDate}
                                setDate={setReturnDate}
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-xl px-8 py-4 font-bold text-lg shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center gap-2 min-w-[200px] justify-center"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <Search className="w-5 h-5" /> {labels.hero.search}
                                </>
                            )}
                        </button>

                    </div>

                    {/* Airline Partners Trust Signal */}
                    <div className="mt-12 flex flex-col items-center opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[1200ms] fill-mode-forwards">
                        <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-4">Parceiros Oficiais via Duffel</p>
                        <div className="flex items-center justify-center gap-8 flex-wrap grayscale hover:grayscale-0 transition-all duration-500">
                            {PARTNERS.map(code => (
                                <img
                                    key={code}
                                    src={`https://pic.avs.io/al/200/200/${code}.png`}
                                    alt={code}
                                    className="h-8 w-auto opacity-50 hover:opacity-100 transition-opacity"
                                />
                            ))}
                        </div>
                    </div>

                </motion.div>

            </div>
        </div>
    );
}
