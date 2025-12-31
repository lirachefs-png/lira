'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Plane, Music, PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import LocationSearch from './ui/LocationSearch';

const destinations = [
    {
        id: 'rio',
        city: 'Rio de Janeiro',
        code: 'GIG',
        country: 'Brasil',
        tagline: 'Sambodromo & Copacabana',
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
        color: 'from-yellow-400 via-green-500 to-blue-600',
        accent: 'bg-yellow-400',
    },
    {
        id: 'salvador',
        city: 'Salvador',
        code: 'SSA',
        country: 'Brasil',
        tagline: 'Axé & Pelourinho',
        image: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&w=1200&q=80',
        color: 'from-orange-500 via-pink-500 to-purple-600',
        accent: 'bg-orange-500',
    }
];

// Carnaval 2026 dates (13-18 fevereiro 2026)
const carnivalStart = '2026-02-13'; // Sexta-feira de Carnaval
const carnivalEnd = '2026-02-18';   // Quarta de Cinzas

export default function CarnivalBanner() {
    const router = useRouter();
    const [origin, setOrigin] = useState('');

    const handleSearch = (destinationCode: string) => {
        // Build search URL with destination and dates
        const params = new URLSearchParams({
            destination: destinationCode,
            date: carnivalStart,
            returnDate: carnivalEnd,
            adults: '1',
            cabin: 'economy'
        });

        // Add origin if selected
        if (origin) {
            params.set('origin', origin);
        }

        router.push(`/search?${params.toString()}`);
    };

    // Confetti explosion for carnival badge
    const triggerCarnivalConfetti = () => {
        const colors = ['#FFD700', '#10B981', '#3B82F6', '#EC4899', '#F97316']; // Yellow, green, blue, pink, orange

        // Fireworks burst 1
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.3 },
            colors: colors,
            gravity: 1.2,
            scalar: 1.2
        });

        // Fireworks burst 2 (delayed)
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 100,
                origin: { x: 0.3, y: 0.4 },
                colors: colors,
                gravity: 1,
                shapes: ['circle', 'square']
            });
        }, 150);

        // Fireworks burst 3 (delayed more)
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 100,
                origin: { x: 0.7, y: 0.4 },
                colors: colors,
                gravity: 1,
                shapes: ['circle', 'square']
            });
        }, 300);
    };

    return (
        <section className="relative z-20 py-16 px-4 max-w-[1400px] mx-auto overflow-hidden">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                    Descubra sua <span className="bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 bg-clip-text text-transparent">próxima viagem</span>
                </h2>

                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-6">
                    Passagens para o <span className="text-rose-500 font-semibold">Carnaval 2026</span> com tarifas NDC exclusivas via TAP Portugal
                </p>

                {/* Origin Search */}
                <div className="max-w-xs mx-auto mb-4">
                    <LocationSearch
                        label="De onde você vai sair?"
                        value={origin}
                        onChange={setOrigin}
                        placeholder="Lisboa, Paris, Madrid..."
                    />
                </div>

                <motion.div
                    onClick={triggerCarnivalConfetti}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 via-green-500/20 to-blue-500/20 border border-yellow-500/30 mt-4 cursor-pointer hover:from-yellow-500/30 hover:via-green-500/30 hover:to-blue-500/30 transition-all"
                >
                    <PartyPopper className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                        CARNAVAL 2026 • 13-18 FEV
                    </span>
                    <Music className="w-4 h-4 text-green-500" />
                </motion.div>
            </motion.div>

            {/* Destination Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {destinations.map((dest, index) => (
                    <motion.div
                        key={dest.id}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 200, damping: 20 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => handleSearch(dest.code)}
                        className="group relative h-60 md:h-72 rounded-3xl overflow-hidden cursor-pointer shadow-2xl shadow-black/30 border border-white/20"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${dest.image})` }}
                        />

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} opacity-40 mix-blend-overlay`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        {/* TAP Logo Badge - Top Right */}
                        <div className="absolute top-4 right-4 z-10 bg-white backdrop-blur-sm p-2 rounded-xl shadow-xl border border-white/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://assets.duffel.com/logos/airlines/TP.svg"
                                alt="TAP Air Portugal"
                                width={48}
                                height={24}
                                className="object-contain"
                            />
                        </div>

                        {/* Price Badge - Top Left */}
                        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full shadow-xl border border-white/30">
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-semibold text-white">A partir de</span>
                                <span className="text-sm font-black text-white">€450</span>
                            </div>
                        </div>

                        {/* Confetti Animation - using CSS animations instead of random values */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[
                                { color: 'bg-yellow-400', startX: 10, endX: 25, delay: 0, duration: 4 },
                                { color: 'bg-green-400', startX: 30, endX: 45, delay: 0.5, duration: 5 },
                                { color: 'bg-blue-400', startX: 50, endX: 35, delay: 1, duration: 4.5 },
                                { color: 'bg-pink-400', startX: 70, endX: 85, delay: 1.5, duration: 5.5 },
                                { color: 'bg-purple-400', startX: 90, endX: 75, delay: 2, duration: 4 },
                                { color: 'bg-orange-400', startX: 20, endX: 55, delay: 2.5, duration: 5 },
                                { color: 'bg-yellow-400', startX: 60, endX: 40, delay: 0.8, duration: 4.8 },
                                { color: 'bg-green-400', startX: 80, endX: 95, delay: 1.2, duration: 5.2 },
                            ].map((confetti, i) => (
                                <motion.div
                                    key={i}
                                    className={`absolute w-2 h-2 rounded-full ${confetti.color}`}
                                    initial={{ y: -20, x: `${confetti.startX}%`, opacity: 0 }}
                                    animate={{
                                        y: ['0%', '100%'],
                                        x: [`${confetti.startX}%`, `${confetti.endX}%`],
                                        opacity: [0, 1, 1, 0],
                                        rotate: [0, 360]
                                    }}
                                    transition={{
                                        duration: confetti.duration,
                                        repeat: Infinity,
                                        delay: confetti.delay
                                    }}
                                />
                            ))}
                        </div>

                        {/* TAP NDC Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2">
                                <Plane className="w-3.5 h-3.5 text-red-500" />
                                <span className="text-xs font-bold text-white">TAP NDC</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                            {/* Destination Badge */}
                            <div className={`mb-3 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${dest.color} text-white shadow-lg flex items-center gap-1`}>
                                <Sparkles className="w-3 h-3" />
                                {dest.tagline}
                            </div>

                            {/* City Name */}
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-1 leading-tight group-hover:text-yellow-300 transition-colors">
                                {dest.city}
                            </h3>

                            {/* Airport Code */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-sm text-white/80 font-medium">{dest.country}</span>
                                <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold text-white">
                                    {dest.code}
                                </span>
                            </div>

                            {/* CTA */}
                            <motion.div
                                className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full w-fit border border-white/20 group-hover:bg-white/20 transition-all"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span>Buscar voos</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </div>

                        {/* Glass Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* TAP Partnership Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-10 text-center"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-green-600 flex items-center justify-center">
                            <Plane className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">TAP Air Portugal</span>
                    </div>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Tarifas NDC exclusivas via <span className="font-semibold text-rose-500">Duffel</span>
                    </span>
                </div>
            </motion.div>
        </section>
    );
}
