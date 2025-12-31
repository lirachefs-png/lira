'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

interface FlyingPlaneProps {
    destinations?: string[];
}

export default function FlyingPlane({ destinations = [] }: FlyingPlaneProps) {
    return (
        <div className="relative w-full h-24 overflow-hidden pointer-events-none">
            {/* Flight Path Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                        <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M 0 60 Q 200 20, 400 50 T 800 40 T 1200 55 T 1600 35"
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    className="opacity-30"
                />
            </svg>

            {/* Animated Plane with Trail */}
            <motion.div
                animate={{
                    x: ['0%', '100%'],
                    y: [40, 20, 50, 30, 45, 25],
                }}
                transition={{
                    x: { duration: 12, repeat: Infinity, ease: "linear" },
                    y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute left-0 top-0"
            >
                {/* Trail Effect */}
                <motion.div
                    className="absolute right-full top-1/2 -translate-y-1/2 flex items-center"
                    animate={{ opacity: [0.8, 0.3] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                    <div className="w-32 h-0.5 bg-gradient-to-l from-rose-500/50 to-transparent rounded-full" />
                    <div className="w-16 h-0.5 bg-gradient-to-l from-orange-400/30 to-transparent rounded-full -ml-8" />
                </motion.div>

                {/* Plane Icon */}
                <motion.div
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                    <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-2.5 rounded-full shadow-lg shadow-rose-500/30">
                        <Plane className="w-5 h-5 text-white rotate-45" />
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse" />
                </motion.div>
            </motion.div>

            {/* Destination Markers */}
            {destinations.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-around px-12">
                    {destinations.slice(0, 4).map((dest, idx) => (
                        <motion.div
                            key={dest}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.2 + 0.5 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="w-2 h-2 rounded-full bg-white/50 border border-white/30" />
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                                {dest}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
