'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRegion } from '@/contexts/RegionContext';

export default function PremiumExperiences() {
    const { labels } = useRegion();

    const cabinClasses = [
        {
            id: 'first',
            title: labels.premium_experiences.first_class,
            subtitle: labels.premium_experiences.first_subtitle,
            topAirlines: ['Emirates', 'Singapore Airlines', 'Etihad Airways'],
            features: labels.premium_experiences.features.first,
            cta: labels.premium_experiences.cta_first,
            link: '/experiences/first-class',
            image: '/images/cabins/first-class.png',
            accentColor: 'amber',
        },
        {
            id: 'business',
            title: labels.premium_experiences.business_class,
            subtitle: labels.premium_experiences.business_subtitle,
            topAirlines: ['Qatar Airways', 'ANA All Nippon', 'Cathay Pacific'],
            features: labels.premium_experiences.features.business,
            cta: labels.premium_experiences.cta_business,
            link: '/experiences/business-class',
            image: '/images/cabins/business-class.png',
            accentColor: 'blue',
        },
        {
            id: 'premium',
            title: labels.premium_experiences.premium_economy,
            subtitle: labels.premium_experiences.premium_subtitle,
            topAirlines: ['Lufthansa', 'Air France', 'Virgin Atlantic'],
            features: labels.premium_experiences.features.premium,
            cta: labels.premium_experiences.cta_premium,
            link: '/experiences/premium-economy',
            image: '/images/cabins/premium-economy.png',
            accentColor: 'rose',
        },
        {
            id: 'economy',
            title: labels.premium_experiences.economy_class,
            subtitle: labels.premium_experiences.economy_subtitle,
            topAirlines: ['Qatar Airways', 'Emirates', 'Japan Airlines'],
            features: labels.premium_experiences.features.economy,
            cta: labels.premium_experiences.cta_economy,
            link: '/experiences/economy-class',
            image: '/images/cabins/economy-class.png',
            accentColor: 'emerald',
        },
    ];

    const getAccentClasses = (color: string) => {
        const classes = {
            amber: 'border-amber-500/30 hover:border-amber-500/50',
            blue: 'border-blue-600/30 hover:border-blue-600/50',
            rose: 'border-rose-500/30 hover:border-rose-500/50',
            emerald: 'border-emerald-500/30 hover:border-emerald-500/50',
        };
        return classes[color as keyof typeof classes] || classes.amber;
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-4"
                    >
                        {labels.experience.highlights}
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-3"
                    >
                        {labels.premium_experiences.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        {labels.premium_experiences.description}
                    </motion.p>
                </div>

                {/* Cabin Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cabinClasses.map((cabin, index) => (
                        <motion.div
                            key={cabin.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border transition-all duration-300 ${getAccentClasses(cabin.accentColor)} shadow-lg shadow-black/5 dark:shadow-black/20 h-full flex flex-col`}
                        >
                            {/* Image Header */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={cabin.image}
                                    alt={cabin.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-xl font-bold text-white mb-1">{cabin.title}</h3>
                                    <p className="text-xs text-gray-300 font-medium">{cabin.subtitle}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Features List */}
                                <ul className="space-y-3 mb-4">
                                    {cabin.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-${cabin.accentColor}-500`}></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Top Airlines */}
                                <div className="mb-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Top Airlines</p>
                                    <div className="flex flex-wrap gap-1.5 min-h-[52px]">
                                        {cabin.topAirlines.map(airline => (
                                            <span key={airline} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-md text-slate-600 dark:text-slate-300 h-fit">
                                                {airline}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA - Always at bottom */}
                                <Link
                                    href={cabin.link}
                                    className={`mt-auto flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 text-sm font-bold text-slate-900 dark:text-white group-hover:bg-${cabin.accentColor}-50 dark:group-hover:bg-${cabin.accentColor}-900/20 group-hover:text-${cabin.accentColor}-600 dark:group-hover:text-${cabin.accentColor}-400 transition-colors`}
                                >
                                    {cabin.cta}
                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
