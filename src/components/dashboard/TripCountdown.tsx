'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Clock } from 'lucide-react';

interface TripCountdownProps {
    departureDate: string;
    origin: string;
    destination: string;
}

export default function TripCountdown({ departureDate, origin, destination }: TripCountdownProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const departure = new Date(departureDate).getTime();
            const now = new Date().getTime();
            const difference = departure - now;

            if (difference <= 0) {
                setIsPast(true);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [departureDate]);

    if (isPast) {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Plane className="w-5 h-5" />
                    <span className="font-bold">Boa Viagem!</span>
                </div>
                <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
                    {origin} → {destination}
                </p>
            </div>
        );
    }

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white"
            >
                {value.toString().padStart(2, '0')}
            </motion.div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-gray-500 mt-1">{label}</span>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Próxima Viagem</span>
            </div>

            {/* Route Display */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-xl font-bold text-slate-900 dark:text-white">{origin}</span>
                <div className="flex items-center gap-1 text-rose-500">
                    <div className="w-8 h-px bg-rose-500/50"></div>
                    <Plane className="w-4 h-4 rotate-90" />
                    <div className="w-8 h-px bg-rose-500/50"></div>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{destination}</span>
            </div>

            {/* Countdown Grid */}
            <div className="flex items-center justify-center gap-6 md:gap-8">
                <TimeBlock value={timeLeft.days} label="Dias" />
                <span className="text-2xl text-slate-300 dark:text-white/20 font-light">:</span>
                <TimeBlock value={timeLeft.hours} label="Horas" />
                <span className="text-2xl text-slate-300 dark:text-white/20 font-light">:</span>
                <TimeBlock value={timeLeft.minutes} label="Min" />
                <span className="text-2xl text-slate-300 dark:text-white/20 font-light hidden md:block">:</span>
                <div className="hidden md:block">
                    <TimeBlock value={timeLeft.seconds} label="Seg" />
                </div>
            </div>
        </div>
    );
}
