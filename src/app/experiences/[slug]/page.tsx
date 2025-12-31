'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Star, Check, X, Plane, Award, Users, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getExperienceBySlug, type AirlineExperience } from '@/lib/experiences-data';
import { use } from 'react';
import { useRegion } from '@/contexts/RegionContext';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function ExperiencePage({ params }: PageProps) {
    const { slug } = use(params);
    const experience = getExperienceBySlug(slug);
    const { labels, language } = useRegion();

    if (!experience) {
        notFound();
    }

    const accentColors = {
        amber: {
            bg: 'bg-amber-500',
            bgLight: 'bg-amber-100 dark:bg-amber-900/30',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-500',
        },
        blue: {
            bg: 'bg-blue-600',
            bgLight: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-600',
        },
        rose: {
            bg: 'bg-rose-500',
            bgLight: 'bg-rose-100 dark:bg-rose-900/30',
            text: 'text-rose-600 dark:text-rose-400',
            border: 'border-rose-500',
        },
        emerald: {
            bg: 'bg-emerald-500',
            bgLight: 'bg-emerald-100 dark:bg-emerald-900/30',
            text: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-500',
        },
    };

    const colors = accentColors[experience.accentColor as keyof typeof accentColors];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
            />
        ));
    };

    const AirlineCard = ({ airline, isTop }: { airline: AirlineExperience; isTop: boolean }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border ${isTop ? 'border-green-500/30' : 'border-red-500/30'}`}
        >
            {/* Immersive Image Section */}
            <div className="relative h-48 overflow-hidden group">
                <img
                    src={airline.image}
                    alt={`${airline.name} cabin`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isTop ? 'from-green-900/60' : 'from-red-900/60'} to-transparent`} />
                <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${isTop ? 'bg-green-500' : 'bg-red-500'} text-white mb-2`}>
                        {isTop ? labels.experience.top_rated : labels.experience.low_rated}
                    </span>
                </div>
            </div>

            {/* Header */}
            <div className={`p-6 ${isTop ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10' : 'bg-gradient-to-r from-red-500/10 to-rose-500/10'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isTop ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            <Plane className={`w-6 h-6 ${isTop ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{airline.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{airline.country[language]}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {renderStars(airline.skytraxRating)}
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{airline.slogan[language]}"</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Highlights */}
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">{labels.experience.highlights}</h4>
                    <div className="space-y-2">
                        {airline.highlights[language].map((highlight, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {isTop ? (
                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                ) : (
                                    <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                )}
                                <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hospitality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${isTop ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Users className={`w-4 h-4 ${isTop ? 'text-green-600' : 'text-red-600'}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{labels.experience.crew}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{airline.hospitality.crew[language]}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${isTop ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <UtensilsCrossed className={`w-4 h-4 ${isTop ? 'text-green-600' : 'text-red-600'}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{labels.experience.dining}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{airline.hospitality.dining[language]}</p>
                    </div>
                </div>

                {/* Why Best/Worst */}
                <div className={`p-4 rounded-lg border-l-4 ${isTop ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'}`}>
                    <h4 className={`text-sm font-bold mb-2 ${isTop ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {isTop ? labels.experience.why_best : labels.experience.why_avoid}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{airline.whyBest[language]}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            {/* Hero */}
            <div className="relative h-[50vh] overflow-hidden">
                <img
                    src={experience.heroImage}
                    alt={experience.title[language]}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">{labels.common.back_to_home}</span>
                </Link>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 ${colors.bg} text-white`}>
                                {experience.title[language]}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
                                {experience.subtitle[language]}
                            </h1>
                            <p className="text-lg text-white/80 max-w-2xl">
                                {experience.description[language]}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Top Airlines Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Award className="w-8 h-8 text-green-500" />
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                                {labels.experience.top_airlines} {experience.title[language]}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {labels.experience.top_airlines_desc}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {experience.topAirlines.map((airline) => (
                            <AirlineCard key={airline.code} airline={airline} isTop={true} />
                        ))}
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-16">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{labels.experience.vs}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                </div>

                {/* Worst Airlines Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <X className="w-8 h-8 text-red-500" />
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
                                {labels.experience.airlines_to_avoid}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {labels.experience.airlines_to_avoid_desc}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {experience.worstAirlines.map((airline) => (
                            <AirlineCard key={airline.code} airline={airline} isTop={false} />
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className={`inline-block p-8 rounded-2xl ${colors.bgLight}`}>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                            {labels.experience.ready_to_experience} {experience.title[language]}?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {labels.experience.search_with_best}
                        </p>
                        <Link
                            href="/"
                            className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white ${colors.bg} hover:opacity-90 transition-opacity`}
                        >
                            <Plane className="w-5 h-5" />
                            {labels.common.search_flights}
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
