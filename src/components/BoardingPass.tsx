'use client';

import { motion } from 'framer-motion';
import { Plane, Calendar, Clock, MapPin, User, QrCode } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

interface BoardingPassProps {
    booking: {
        id: string;
        booking_reference: string;
        passenger_data?: {
            origem?: string;
            destino?: string;
            firstName?: string;
            lastName?: string;
        };
        created_at: string;
        amount_total: number;
        currency: string;
        state: string;
    };
    index: number;
}

import { useState } from 'react';
import SmartPackerModal from './SmartPackerModal';

export default function BoardingPass({ booking, index }: BoardingPassProps) {
    const [isSmartPackerOpen, setIsSmartPackerOpen] = useState(false);
    const { labels, language } = useRegion();

    const origin = booking.passenger_data?.origem || 'LIS';
    const destination = booking.passenger_data?.destino || '???';
    const passengerName = booking.passenger_data?.firstName
        ? `${booking.passenger_data.firstName} ${booking.passenger_data.lastName || ''}`.toUpperCase()
        : 'PASSENGER';
    const bookingRef = booking.booking_reference || 'N/A';
    const date = new Date(booking.created_at);

    const dateLocale = language === 'pt' ? 'pt-PT' : language === 'es' ? 'es-ES' : 'en-GB';
    const formattedDate = date.toLocaleDateString(dateLocale, { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const formattedTime = date.toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' });

    const isConfirmed = booking.state === 'confirmed';
    const isFailed = booking.state === 'failed';

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 30, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group cursor-pointer"
            >
                {/* Flying Plane Animation on Hover */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    whileHover={{ x: 400, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute top-4 left-0 z-20 pointer-events-none"
                >
                    <Plane className="w-6 h-6 text-rose-500 rotate-0 fill-rose-500" />
                </motion.div>

                {/* Main Boarding Pass Container */}
                <div className="relative overflow-hidden">
                    {/* Ticket Body */}
                    <div className={`
                        relative flex flex-col md:flex-row
                        bg-white dark:bg-[#1a1f2e] 
                        rounded-2xl overflow-hidden
                        border-2 ${isConfirmed ? 'border-emerald-500/30' : isFailed ? 'border-rose-500/30' : 'border-amber-500/30'}
                        shadow-xl hover:shadow-2xl transition-shadow duration-300
                    `}>

                        {/* Left Section - Main Info */}
                        <div className="flex-1 p-6 md:p-8 relative">
                            {/* Airline Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-xl flex items-center justify-center
                                        ${isConfirmed ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                                            isFailed ? 'bg-gradient-to-br from-rose-500 to-red-600' :
                                                'bg-gradient-to-br from-amber-500 to-orange-600'}
                                        shadow-lg
                                    `}>
                                        <Plane className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">AllTrip Airways</p>
                                        <p className="text-[10px] text-slate-400 dark:text-gray-600">{labels.boarding_pass.electronic_ticket}</p>
                                    </div>
                                </div>
                                <div className={`
                                    text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider
                                    ${isConfirmed ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                        isFailed ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                                            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}
                                `}>
                                    {isConfirmed ? labels.boarding_pass.confirmed : isFailed ? labels.boarding_pass.cancelled : labels.boarding_pass.processing}
                                </div>
                            </div>

                            {/* Route Display */}
                            <div className="flex items-center justify-between mb-8">
                                {/* Origin */}
                                <div className="text-center">
                                    <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{origin}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">{labels.boarding_pass.origin}</p>
                                </div>

                                {/* Flight Path */}
                                <div className="flex-1 mx-4 md:mx-8 relative">
                                    <div className="border-t-2 border-dashed border-slate-200 dark:border-white/10 relative">
                                        <motion.div
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                        >
                                            <div className="bg-white dark:bg-[#1a1f2e] p-2 rounded-full">
                                                <Plane className="w-5 h-5 text-rose-500 rotate-90" />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Destination */}
                                <div className="text-center">
                                    <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{destination}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">{labels.boarding_pass.destination}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <User className="w-3 h-3" /> {labels.boarding_pass.passenger}
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{passengerName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {labels.boarding_pass.date}
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formattedDate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {labels.boarding_pass.time}
                                    </p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formattedTime}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {labels.boarding_pass.booking_ref}
                                    </p>
                                    <p className="text-sm font-bold font-mono text-rose-500">{bookingRef}</p>
                                </div>
                            </div>
                        </div>

                        {/* Perforated Divider */}
                        <div className="hidden md:flex flex-col items-center justify-center w-8 relative">
                            <div className="absolute top-0 w-8 h-8 bg-slate-50 dark:bg-[#0B0F19] rounded-full -translate-y-1/2"></div>
                            <div className="h-full border-l-2 border-dashed border-slate-200 dark:border-white/10"></div>
                            <div className="absolute bottom-0 w-8 h-8 bg-slate-50 dark:bg-[#0B0F19] rounded-full translate-y-1/2"></div>
                        </div>

                        {/* Right Section - QR Code & Price */}
                        <div className="md:w-48 p-6 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center gap-4">
                            {/* QR Code Placeholder */}
                            <div className="w-24 h-24 bg-white dark:bg-[#1a1f2e] rounded-xl p-2 shadow-inner flex items-center justify-center">
                                <div className="w-full h-full bg-[repeating-linear-gradient(0deg,#000,#000_2px,#fff_2px,#fff_4px)] opacity-80 rounded"></div>
                            </div>

                            {/* Price */}
                            <div className="text-center">
                                <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    {booking.currency || 'EUR'} {(booking.amount_total / 100).toFixed(0)}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-wider">{labels.boarding_pass.total_paid}</p>
                            </div>

                            {/* Smart Packer Button (New) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsSmartPackerOpen(true);
                                }}
                                className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold shadow-lg hover:shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1"
                            >
                                {labels.boarding_pass.smart_packer}
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 opacity-80"></div>
                </div>
            </motion.div>

            {/* Smart Packer Modal */}
            <SmartPackerModal
                isOpen={isSmartPackerOpen}
                onClose={() => setIsSmartPackerOpen(false)}
                destination={destination}
                origem={origin}
                date={booking.created_at}
            />
        </>
    );
}
