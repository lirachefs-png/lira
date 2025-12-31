'use client';

import { motion } from 'framer-motion';
import AirlineLogo from './ui/AirlineLogo';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

const PARTNERS = [
    { name: 'TAP Air Portugal', code: 'TP' },
    { name: 'American Airlines', code: 'AA' },
    { name: 'Lufthansa', code: 'LH' },
    { name: 'British Airways', code: 'BA' },
    { name: 'Turkish Airlines', code: 'TK' },
    { name: 'LATAM Airlines', code: 'LA' },
    { name: 'Air France', code: 'AF' },
    { name: 'KLM', code: 'KL' },
    { name: 'easyJet', code: 'U2' },
    { name: 'Iberia', code: 'IB' },
];

export default function Partners() {
    const { labels } = useRegion();

    return (
        <section className="py-12 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">
                        {labels.partners.title}
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                    {PARTNERS.map((partner, index) => (
                        <motion.div
                            key={partner.code}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-125 cursor-pointer transform scale-[1.2]"
                        >
                            <AirlineLogo
                                iataCode={partner.code}
                                name={partner.name}
                                size="lg"
                                variant="lockup"
                            />
                            <span className="text-xs text-slate-500 dark:text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {partner.name}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Link to Full Partners Page */}
                <div className="flex justify-center mt-8">
                    <Link
                        href="/partners"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                        {labels.partners.view_all}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <p className="text-center text-slate-400 text-[10px] mt-8 opacity-60">
                    {labels.partners.disclaimer}
                </p>
            </div>
        </section>
    );
}
