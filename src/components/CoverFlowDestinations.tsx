'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, TrendingDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { getFeaturedPrices } from '@/app/actions/get-destination-prices';
import { useRegion } from '@/contexts/RegionContext';

interface Destination {
    name: string;
    country: string;
    price: string;
    miles: string;
    image: string;
    iata: string;
    color: string;
}

const DESTINATIONS: Destination[] = [
    {
        name: 'Colombo',
        country: 'Sri Lanka',
        price: 'R$ 2451',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        iata: 'CMB',
        color: '#0D9488'
    },
    {
        name: 'Abu Dhabi',
        country: 'Emirados Árabes',
        price: 'R$ 1665',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
        iata: 'AUH',
        color: '#7C3AED'
    },

    {
        name: 'Hong Kong',
        country: 'China',
        price: 'R$ 2866',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=800&q=80',
        iata: 'HKG',
        color: '#2563EB'
    },
    {
        name: 'Medan',
        country: 'Indonésia',
        price: 'R$ 2917',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        iata: 'KNO',
        color: '#E11D48'
    },
    {
        name: 'Bangkok',
        country: 'Tailândia',
        price: 'R$ 3100',
        miles: '+60k milhas',
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
        iata: 'BKK',
        color: '#F59E0B'
    }
];

export function CoverFlowDestinations({ origin }: { origin?: string }) {
    const [activeIndex, setActiveIndex] = useState(1);
    const router = useRouter();
    const { currency } = useRegion();

    // State for prices and loading
    const [prices, setPrices] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function loadPrices() {
            setLoading(true);
            try {
                const activeOrigin = origin || 'LIS';
                const data = await getFeaturedPrices(activeOrigin, currency);
                if (mounted) setPrices(data || {});
            } catch (error) {
                console.error("Prices error", error);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadPrices();
        return () => { mounted = false; };
    }, [currency, origin]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % DESTINATIONS.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length);
    };

    // Responsive check
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate nice visible range
    const getCardStyle = (index: number) => {
        const visualDiff = index - activeIndex;
        const isActive = visualDiff === 0;

        // Dynamic spacing based on screen size
        const spacing = isMobile ? 160 : 220;
        const xOffset = visualDiff * spacing;

        const scale = isActive ? 1.1 : 0.8;
        const rotateY = isActive ? 0 : visualDiff > 0 ? -45 : 45;
        const zIndex = 100 - Math.abs(visualDiff);
        const opacity = isActive ? 1 : 0.5 - (Math.abs(visualDiff) * 0.1);
        const blur = isActive ? 0 : 2;

        return {
            x: xOffset,
            scale: isMobile && isActive ? 1 : scale, // Reduce zoom slightly on mobile
            rotateY,
            zIndex,
            opacity: Math.max(0, opacity),
            filter: `blur(${blur}px)`,
            cursor: isActive ? 'auto' : 'pointer'
        };
    };

    const handleCardClick = (index: number) => {
        if (index === activeIndex) {
            router.push(`/search?destination=${DESTINATIONS[index].iata}`);
        } else {
            setActiveIndex(index);
        }
    };

    return (
        <div className="w-full relative py-10 md:py-20 flex flex-col items-center justify-center overflow-hidden h-[500px] md:h-[600px]">

            {/* 3D Container */}
            <div className="relative w-full max-w-[1000px] h-[350px] md:h-[450px] flex items-center justify-center perspective-[1000px]">
                {DESTINATIONS.map((dest, index) => {
                    const style = getCardStyle(index);

                    // Only render cards reasonably close to center to avoid clutter / overlapping issues if list is huge
                    if (Math.abs(index - activeIndex) > 2) return null;

                    return (
                        <motion.div
                            key={dest.iata}
                            className="absolute w-[260px] h-[380px] md:w-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/10"
                            initial={false}
                            animate={{
                                x: style.x,
                                scale: style.scale,
                                rotateY: style.rotateY,
                                zIndex: style.zIndex,
                                opacity: style.opacity,
                                filter: style.filter
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            onClick={() => handleCardClick(index)}
                        >
                            {/* Image */}
                            <div className="absolute inset-0">
                                <NextImage
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            </div>

                            {/* Content (Only visible clearly on active) */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <h3 className="text-3xl font-black text-white mb-2 drop-shadow-md">
                                    {dest.name}
                                </h3>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-wider text-white/80">{dest.country}</span>
                                        {/* Dynamic Price */}
                                        <div className="flex flex-col items-end">
                                            {loading ? (
                                                <div className="h-6 w-20 bg-white/20 animate-pulse rounded" />
                                            ) : (
                                                <>
                                                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                                        <TrendingDown className="w-3 h-3" /> MENOR PREÇO
                                                    </span>
                                                    <span className="text-white font-bold text-xl">
                                                        {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'R$'} {prices[dest.iata] || '---'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/20 h-px my-2" />
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                        <MapPin className="w-3 h-3" /> {dest.miles}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-full py-2 bg-white text-black font-bold rounded-full text-xs hover:bg-rose-500 hover:text-white transition-colors">
                                        EXPLORAR
                                    </button>
                                </div>
                            </div>

                            {/* Reflection Gradient (Simple visual trick) */}
                            {/* <div className="absolute -bottom-full left-0 right-0 h-full bg-gradient-to-b from-white/10 to-transparent opacity-30 transform rotate-180" /> */}
                        </motion.div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mt-20 z-50 relative">
                <button
                    onClick={prevSlide}
                    disabled={activeIndex === 0}
                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {DESTINATIONS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'w-8 bg-rose-500' : 'bg-white/20 hover:bg-white/40'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={activeIndex === DESTINATIONS.length - 1}
                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
