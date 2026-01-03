'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PromoDeal {
    id: number;
    destination: string;
    origin: string;
    price: number;
    currency: string;
    label: string;
    color: string;
    image: string;
}

// Helper to get a valid future date (30 days from now) to ensure flights exist
const getFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
};

const DEALS: PromoDeal[] = [
    {
        id: 1,
        origin: 'LIS',
        destination: 'CDG',
        price: 91, // Fallback
        currency: '€',
        label: 'Super Oferta',
        color: 'from-rose-500 to-purple-600',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
    },
    {
        id: 2,
        origin: 'LIS',
        destination: 'LHR',
        price: 93, // Fallback
        currency: '€',
        label: 'Imperdível',
        color: 'from-blue-500 to-cyan-500',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 3,
        origin: 'LIS',
        destination: 'FCO',
        price: 90, // Fallback
        currency: '€',
        label: 'Preço Baixo',
        color: 'from-amber-500 to-red-600',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop'
    }
];

export default function PromoPriceCards() {
    const router = useRouter();
    // Use static deals since Supabase is removed
    const [dynamicDeals] = useState(DEALS);

    return (
        <section className="relative z-20 py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 justify-between w-full">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Highlights
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dynamicDeals.map((deal, index) => (
                    <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{ y: -7, scale: 1.02 }}
                        onClick={() => router.push(`/search?origin=${deal.origin}&destination=${deal.destination}&date=${getFutureDate()}&flexible=true`)}
                        className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer 
                            shadow-lg shadow-black/20 dark:shadow-2xl dark:shadow-black/60
                            border border-white/10 dark:border-white/5
                            dark:ring-1 dark:ring-white/10
                            hover:shadow-xl hover:shadow-black/30 dark:hover:shadow-black/70
                            dark:hover:ring-white/20
                            transition-all duration-300"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage: `url(${deal.image})`,
                            }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/50 transition-all" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div className={`mb-3 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${deal.color} text-white shadow-lg`}>
                                {deal.label}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-1 leading-tight group-hover:text-rose-300 transition-colors">
                                {deal.destination === 'CDG' ? 'Paris' : deal.destination === 'LHR' ? 'London' : 'Rome'}
                            </h3>

                            <p className="text-sm text-gray-200 font-medium mb-1 opacity-90">
                                Voos a partir de <span className="text-white font-bold text-lg">{deal.currency}{deal.price}</span>
                            </p>

                            <div className="flex items-center gap-2 text-sm font-bold text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                Ver oferta <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Glass Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
