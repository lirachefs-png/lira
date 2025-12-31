'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Euro, TrendingUp } from 'lucide-react';

interface BudgetSliderProps {
    min?: number;
    max?: number;
    defaultValue?: number;
    onChange: (value: number) => void;
}

export default function BudgetSlider({ min = 100, max = 3000, defaultValue = 500, onChange }: BudgetSliderProps) {
    const [value, setValue] = useState(defaultValue);

    // Debounce change to avoid spamming API
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(value);
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [value, onChange]);

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-rose-400">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Max Budget</span>
                    </div>
                    <div className="text-2xl font-black text-white flex items-center">
                        <span className="text-base font-normal text-white/50 mr-1">up to</span>
                        € {value}
                    </div>
                </div>

                <div className="relative h-6 flex items-center">
                    {/* Track Background */}
                    <div className="absolute w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        {/* Fill */}
                        <div
                            className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Thumb */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={50}
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="
                            absolute w-full h-full opacity-0 cursor-pointer z-10
                        "
                    />

                    {/* Custom Thumb Visual */}
                    <div
                        className="absolute h-6 w-6 bg-white rounded-full shadow-lg border-2 border-rose-500 pointer-events-none flex items-center justify-center"
                        style={{ left: `calc(${percentage}% - 12px)` }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                </div>

                <div className="flex justify-between mt-2 text-[10px] text-white/30 font-bold uppercase">
                    <span>Economy</span>
                    <span>Business</span>
                    <span>First Class</span>
                </div>
            </div>
        </motion.div>
    );
}
