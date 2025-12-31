'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

export default function ExperienceGrid() {
    const { labels } = useRegion();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeIndex, setActiveIndex] = useState(0);

    const DESTINATIONS = [
        {
            id: 'byron',
            location: labels.destinations.australia,
            name: 'Byron Bay',
            tagline: labels.experience_grid.byron.tagline,
            description: labels.experience_grid.byron.description,
            mainImage: '/images/destinations/byron-1.png',

            experiences: [
                {
                    id: 'gastronomy',
                    category: labels.destinations.gastronomy,
                    title: labels.experience_grid.byron.farm_title,
                    description: labels.experience_grid.byron.farm_desc,
                    image: '/images/destinations/byron-2.png',
                },
                {
                    id: 'nightlife',
                    category: labels.destinations.nightlife,
                    title: labels.experience_grid.byron.nightlife_title,
                    description: labels.experience_grid.byron.nightlife_desc,
                    image: '/images/destinations/byron-3.png',
                },
                {
                    id: 'culture',
                    category: labels.destinations.culture,
                    title: labels.experience_grid.byron.culture_title,
                    description: labels.experience_grid.byron.culture_desc,
                    image: '/images/destinations/byron-culture.png',
                },
                {
                    id: 'accommodation',
                    category: labels.destinations.accommodation,
                    title: labels.experience_grid.byron.accommodation_title,
                    description: labels.experience_grid.byron.accommodation_desc,
                    image: '/images/destinations/byron-4.png',
                },
            ],
        },
        {
            id: 'pipa',
            location: labels.destinations.brazil,
            name: 'Pipa',
            tagline: labels.experience_grid.pipa.tagline,
            description: labels.experience_grid.pipa.description,
            mainImage: '/images/destinations/pipa-2.png?v=2',

            experiences: [
                {
                    id: 'gastronomy',
                    category: labels.destinations.gastronomy,
                    title: labels.experience_grid.pipa.gastro_title,
                    description: labels.experience_grid.pipa.gastro_desc,
                    image: '/images/destinations/pipa-1.png?v=2',
                },
                {
                    id: 'nightlife',
                    category: labels.destinations.nightlife,
                    title: labels.experience_grid.pipa.nightlife_title,
                    description: labels.experience_grid.pipa.nightlife_desc,
                    image: '/images/destinations/pipa-lets-pipa.png',
                },
                {
                    id: 'culture',
                    category: labels.destinations.culture,
                    title: labels.experience_grid.pipa.culture_title,
                    description: labels.experience_grid.pipa.culture_desc,
                    image: '/images/destinations/pipa-3.png?v=2',
                },
                {
                    id: 'accommodation',
                    category: labels.destinations.accommodation,
                    title: labels.experience_grid.pipa.accommodation_title,
                    description: labels.experience_grid.pipa.accommodation_desc,
                    image: '/images/destinations/pipa-praia-amor.png',
                },
            ],
        },
        {
            id: 'phiphi',
            location: labels.destinations.thailand,
            name: 'Koh Phi Phi',
            tagline: labels.experience_grid.phiphi.tagline,
            description: labels.experience_grid.phiphi.description,
            mainImage: '/images/destinations/phiphi-1.png',

            experiences: [
                {
                    id: 'gastronomy',
                    category: labels.destinations.gastronomy,
                    title: labels.experience_grid.phiphi.gastro_title,
                    description: labels.experience_grid.phiphi.gastro_desc,
                    image: '/images/destinations/phiphi-2.png',
                },
                {
                    id: 'nightlife',
                    category: labels.destinations.nightlife,
                    title: labels.experience_grid.phiphi.nightlife_title,
                    description: labels.experience_grid.phiphi.nightlife_desc,
                    image: '/images/destinations/phiphi-4.png',
                },
                {
                    id: 'culture',
                    category: labels.destinations.culture,
                    title: labels.experience_grid.phiphi.culture_title,
                    description: labels.experience_grid.phiphi.culture_desc,
                    image: '/images/destinations/phiphi-3.png',
                },
                {
                    id: 'accommodation',
                    category: labels.destinations.accommodation,
                    title: labels.experience_grid.phiphi.accommodation_title,
                    description: labels.experience_grid.phiphi.accommodation_desc,
                    image: '/images/destinations/phiphi-5.png',
                },
            ],
        },
    ];

    // Load active slide from URL on mount
    useEffect(() => {
        const slideId = searchParams.get('slide');
        if (slideId) {
            const index = DESTINATIONS.findIndex(d => d.id === slideId);
            if (index !== -1) {
                setActiveIndex(index);
            }
        }
    }, []); // Run once on mount

    const updateActiveIndex = (index: number) => {
        setActiveIndex(index);
        // Update URL without reload to persist state
        const destId = DESTINATIONS[index].id;
        const url = new URL(window.location.href);
        url.searchParams.set('slide', destId);
        window.history.replaceState({}, '', url);
    };

    const destination = DESTINATIONS[activeIndex];

    const goToPrev = () => updateActiveIndex((activeIndex - 1 + DESTINATIONS.length) % DESTINATIONS.length);
    const goToNext = () => updateActiveIndex((activeIndex + 1) % DESTINATIONS.length);

    return (
        <section className="py-12 bg-gray-50 dark:bg-[#0B0F19] relative z-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Destination Navigation */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                        onClick={goToPrev}
                        className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-700 text-slate-700 dark:text-white transition-all hover:shadow-md"
                        aria-label="Previous destination"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {DESTINATIONS.map((dest, i) => (
                            <button
                                key={dest.id}
                                onClick={() => updateActiveIndex(i)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${i === activeIndex
                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105'
                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-700'
                                    }`}
                            >
                                {dest.name}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={goToNext}
                        className="p-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-700 text-slate-700 dark:text-white transition-all hover:shadow-md"
                        aria-label="Next destination"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Emirates-Style Grid: 1 Large + 4 Small */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={destination.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >

                        {/* LARGE CARD - Discover Destination */}
                        <motion.div
                            initial={{ opacity: 1, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ y: -7, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            onClick={() => router.push(`/destinations/${destination.id}`)}
                            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg shadow-black/50 border border-white/10 transition-all duration-500 flex flex-col cursor-pointer"
                        >
                            {/* Text Section */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="text-[9px] font-semibold tracking-[0.35em] text-gray-400 dark:text-gray-500 uppercase mb-3">
                                        {destination.location}
                                    </p>

                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                                        {labels.destinations.discover} {destination.name}
                                    </h2>

                                    <div className="w-8 h-0.5 bg-gradient-to-r from-rose-500 to-amber-500 mb-4"></div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed font-light">
                                        {destination.description}
                                    </p>
                                </div>

                                <button className="inline-flex items-center gap-2 text-slate-800 dark:text-white font-semibold text-xs tracking-wide hover:text-rose-600 dark:hover:text-rose-400 transition-colors group uppercase">
                                    {labels.destinations.discover}
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Image Section */}
                            <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={destination.mainImage}
                                    alt=""
                                    loading={activeIndex === 0 ? 'eager' : 'lazy'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </motion.div>

                        {/* SMALL CARDS GRID - 2x2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {destination.experiences.map((exp, index) => {
                                // Map grid categories to destination page tabs
                                const tabMap: Record<string, string> = {
                                    gastronomy: 'gastronomy',
                                    nightlife: 'nightlife',
                                    culture: 'culture',
                                    accommodation: 'accommodation'
                                };
                                const tabId = tabMap[exp.id] || 'overview';

                                return (
                                    <motion.div
                                        key={exp.id}
                                        initial={{ opacity: 1, y: 0 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -7, scale: 1.02 }}
                                        onClick={() => router.push(`/destinations/${destination.id}?tab=${tabId}`)}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg shadow-black/50 border border-white/10 transition-all duration-500 cursor-pointer min-h-[160px] flex items-end"
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                                            <img
                                                src={exp.image}
                                                alt=""
                                                loading={activeIndex === 0 ? 'eager' : 'lazy'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-0 transition-opacity duration-500"
                                                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                            />
                                            {/* Premium Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all"></div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="relative z-10 p-5 w-full">
                                            <p className="text-[7px] font-bold tracking-[0.4em] text-rose-400 dark:text-rose-500 uppercase mb-2 drop-shadow-md">
                                                {exp.category}
                                            </p>

                                            <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight drop-shadow-lg">
                                                {exp.title}
                                            </h3>

                                            <p className="text-[11px] text-gray-100/90 leading-relaxed mb-4 font-light opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                {exp.description}
                                            </p>

                                            <button className="inline-flex items-center gap-1 text-white text-[10px] font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase">
                                                {labels.destinations.discover}
                                                <ArrowRight className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </section>
    );
}
