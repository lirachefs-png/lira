'use client';

import { motion } from 'framer-motion';
import BoardingPass from '@/components/BoardingPass';
import FlyingPlane from '@/components/FlyingPlane';
import { useRegion } from '@/contexts/RegionContext';
import {
    Ticket,
    Globe,
    CheckCircle,
    Search,
    Sparkles,
    TrendingUp,
    Plane
} from 'lucide-react';
import Link from 'next/link';

interface MyTripsClientProps {
    bookings: any[];
    userName: string;
}

export default function MyTripsClient({ bookings, userName }: MyTripsClientProps) {
    const { labels } = useRegion();

    // Calculate stats
    const totalTrips = bookings.length;
    const confirmedTrips = bookings.filter((b: any) => b.state === 'confirmed').length;
    const totalSpent = bookings.reduce((acc: number, b: any) => acc + (b.amount_total || 0), 0) / 100;
    const destinations = [...new Set(bookings.map((b: any) => b.passenger_data?.destino).filter(Boolean))];

    // Time-based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12
        ? labels.dashboard.greeting_morning
        : hour < 18
            ? labels.dashboard.greeting_afternoon
            : labels.dashboard.greeting_evening;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-[#0B0F19] text-white transition-colors duration-300">

            {/* Immersive Header with Flying Plane */}
            <div className="relative pt-20 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-rose-500/20 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl translate-y-1/2" />

                    {/* Stars/Dots Background */}
                    <div className="absolute inset-0 opacity-30">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Flying Plane Animation */}
                <FlyingPlane destinations={destinations as string[]} />

                <div className="max-w-6xl mx-auto px-4 relative z-10 pb-8">
                    {/* Greeting Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-10"
                    >
                        <p className="text-slate-400 text-sm mb-2">{greeting},</p>
                        <h1 className="text-4xl md:text-6xl font-black mb-4">
                            <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                {userName}!
                            </span>
                        </h1>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {/* Total Trips */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-rose-500/20 rounded-xl text-rose-400">
                                    <Ticket className="w-5 h-5" />
                                </div>
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <p className="text-3xl font-black">{totalTrips}</p>
                            <p className="text-xs text-slate-500 mt-1">{labels.dashboard.total_trips}</p>
                        </motion.div>

                        {/* Confirmed */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <Sparkles className="w-4 h-4 text-amber-400" />
                            </div>
                            <p className="text-3xl font-black">{confirmedTrips}</p>
                            <p className="text-xs text-slate-500 mt-1">{labels.dashboard.confirmed}</p>
                        </motion.div>

                        {/* Destinations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black">{destinations.length}</p>
                            <p className="text-xs text-slate-500 mt-1">{labels.dashboard.unique_destinations}</p>
                        </motion.div>

                        {/* Total Spent */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                                    <Plane className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-3xl font-black">€{totalSpent.toFixed(0)}</p>
                            <p className="text-xs text-slate-500 mt-1">{labels.dashboard.total_invested}</p>
                        </motion.div>
                    </div>

                    {/* New Search Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all hover:scale-105 active:scale-95"
                        >
                            <Search className="w-5 h-5" />
                            {labels.nav.new_search}
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Boarding Passes Section */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xl font-bold mb-8 flex items-center gap-2"
                >
                    <Ticket className="w-5 h-5 text-rose-500" />
                    {labels.dashboard.your_boarding_passes}
                </motion.h2>

                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plane className="w-10 h-10 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">{labels.dashboard.journey_starts_here}</h2>
                        <p className="text-slate-400 max-w-md mx-auto mb-8">
                            {labels.dashboard.no_trips_yet}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold px-8 py-4 rounded-full hover:shadow-lg hover:shadow-rose-500/25 transition-all hover:scale-105"
                        >
                            <Search className="w-5 h-5" />
                            {labels.dashboard.search_flights}
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking: any, index: number) => (
                            <BoardingPass
                                key={booking.id}
                                booking={booking}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Help Section */}
                {bookings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10"
                    >
                        <div>
                            <h3 className="text-xl font-bold mb-2">{labels.dashboard.need_help}</h3>
                            <p className="text-slate-400 text-sm">{labels.dashboard.help_description}</p>
                        </div>
                        <a
                            href="mailto:contato@alltripapp.com"
                            className="bg-white text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-slate-100 transition-colors shrink-0"
                        >
                            {labels.dashboard.talk_to_support}
                        </a>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
