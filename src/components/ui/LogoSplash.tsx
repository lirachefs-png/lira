'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogoSplash() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3500); // Display for 3.5 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-[#0B0F19] flex items-center justify-center overflow-hidden"
                >
                    {/* Background Grid / Digital Lines */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-rose-500 opacity-20 blur-[100px]"></div>
                    </div>

                    {/* Animated Particles */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute rounded-full blur-sm ${i % 3 === 0 ? 'bg-rose-500' : i % 3 === 1 ? 'bg-orange-500' : 'bg-purple-500'
                                }`}
                            initial={{
                                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                                opacity: 0,
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            animate={{
                                y: -100,
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{
                                duration: Math.random() * 2 + 2, // 2-4s duration
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "linear",
                            }}
                            style={{
                                width: Math.random() * 10 + 4 + 'px',
                                height: Math.random() * 10 + 4 + 'px',
                            }}
                        />
                    ))}

                    {/* Logo Animation */}
                    <motion.div
                        className="relative z-10 flex flex-col items-center"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    >
                        {/* Glow Effect specific to Logo */}
                        <motion.div
                            animate={{
                                opacity: [0.5, 0.8, 0.5],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-rose-500/30 blur-3xl -z-10 rounded-full"
                        />

                        <img
                            src="/images/alltrip-logo-new.png"
                            alt="AllTrip Logo"
                            className="w-48 md:w-64 h-auto drop-shadow-2xl"
                        />

                        {/* Text "Taking Off" effect - simulate motion trail */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
                            className="h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent mt-8 w-full opacity-50 blur-sm"
                        />
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
