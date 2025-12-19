'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format, addMonths } from 'date-fns';
import { getFeaturedPrices } from '@/app/actions/get-destination-prices';
import NextImage from 'next/image';
import { useRegion } from '@/contexts/RegionContext';

interface Destination {
    name: string;
    country: string;
    iata: string;
    image: string;
    color: string;
}

const DESTINATIONS: Destination[] = [
    {
        name: 'Colombo',
        country: 'Sri Lanka',
        iata: 'CMB',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        color: 'from-emerald-600 to-teal-800'
    },
    {
        name: 'Abu Dhabi',
        country: 'Emirados Árabes',
        iata: 'AUH',
        image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
        color: 'from-purple-600 to-indigo-900'
    },
    {
        name: 'Phnom Penh',
        country: 'Camboja',
        iata: 'PNH',
        // Changed image ID for reliability
        image: 'https://images.unsplash.com/photo-1549484807-6b0be6287c1c?auto=format&fit=crop&w=800&q=80',
        color: 'from-amber-600 to-orange-900'
    },
    {
        name: 'Hong Kong',
        country: 'China',
        iata: 'HKG',
        image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=800&q=80',
        color: 'from-blue-600 to-cyan-900'
    },
    {
        name: 'Medan',
        country: 'Indonésia',
        iata: 'KNO',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        color: 'from-rose-600 to-pink-900'
    },
];

interface DestinationFanProps {
    origin: string;
}

export default function DestinationFan({ origin }: DestinationFanProps) {
    const { currency } = useRegion();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [prices, setPrices] = useState<Record<string, string>>({});
    const [loadingPrices, setLoadingPrices] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        async function fetchPrices() {
            setLoadingPrices(true);
            try {
                // Fetch real prices from server action with selected currency
                const data = await getFeaturedPrices(origin, currency);
                if (mounted) {
                    setPrices(data);
                }
            } catch (error) {
                console.error("Failed to fetch featured prices", error);
            } finally {
                if (mounted) setLoadingPrices(false);
            }
        }

        fetchPrices();

        return () => { mounted = false; };
    }, [origin, currency]); // Re-fetch when currency changes

    const handleSearch = (destinationIata: string) => {
        const date = format(addMonths(new Date(), 1), 'yyyy-MM-dd');
        router.push(`/search?origin=${origin}&destination=${destinationIata}&date=${date}`);
    };

    return (
        <div className="w-full flex justify-center items-center py-10 overflow-hidden">
            <div className="flex gap-2 md:gap-4 px-4 h-[400px] md:h-[500px] w-full max-w-7xl items-center justify-center">
                {DESTINATIONS.map((dest, index) => {
                    const isHovered = hoveredIndex === index;
                    const isAnyHovered = hoveredIndex !== null;
                    const price = prices[dest.iata];

                    return (
                        <motion.div
                            key={dest.name}
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                            onClick={() => handleSearch(dest.iata)}
                            className="relative h-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl border border-white/10 group bg-slate-900"
                            layout
                            initial={{ width: '18%' }} // Initial evenly distributed width (approx)
                            animate={{
                                width: isHovered ? '50%' : isAnyHovered ? '12%' : '18%', // Expand hovered, shrink others
                                flexGrow: isHovered ? 3 : 1
                            }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <NextImage
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    priority={index < 2}
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 bg-slate-800"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-b ${isHovered ? 'from-black/10 via-transparent to-black/80' : 'from-black/30 via-black/20 to-black/90'} transition-all duration-500`} />
                            </div>

                            {/* Tech/Glass Overlay Badge based on mock (Top Left) */}
                            <div className={`absolute top-4 left-4 z-10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 scale-75'}`}>
                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] md:text-xs text-white border border-white/20 font-medium whitespace-nowrap">
                                    Ida e volta • Econômica
                                </div>
                            </div>

                            {/* Content (Bottom) */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full bg-gradient-to-t from-black/90 via-black/40 to-transparent">

                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 w-full">
                                    {/* Title */}
                                    <h3
                                        className={`font-black text-white leading-tight mb-1 transition-all duration-300 truncate w-full ${isHovered ? 'text-3xl md:text-5xl' : 'text-lg md:text-xl opacity-90'}`}
                                        title={dest.name} // Native tooltip for full name
                                    >
                                        {dest.name}
                                    </h3>

                                    {/* Subtitle / Miles */}
                                    <div className={`text-gray-300 text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
                                        <span className="text-rose-400 font-bold">
                                            {loadingPrices ? (
                                                <span className="inline-block w-12 h-3 bg-white/20 animate-pulse rounded" />
                                            ) : (
                                                <>{currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'R$'} {price || '---'}</>
                                            )}
                                        </span>
                                        <span className="mx-2 opacity-50">|</span>
                                        <span>+50k milhas</span>
                                    </div>


                                    {/* Expanded Content (Only visible on hover) */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 pt-4 border-t border-white/20"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-white/80 text-xs">
                                                        <MapPin className="w-4 h-4" />
                                                        {dest.country}
                                                    </div>
                                                    <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2">
                                                        Ver Oferta <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Vertical Text (Visible when NOT hovered) */}
                            {!isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-0 md:opacity-0 lg:opacity-0">
                                    {/* This is a tricky part. Usually fans hide text when collapsed. 
                                        Let's keep it clean. Or maybe a vertical writing mode if narrow?
                                        For now, keeping it simple as the 'bottom title' does the job.
                                    */}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
