'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Minus, Plus, Armchair } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

export interface PassengerState {
    adults: number;
    children: number;
    infants: number;
}

interface PassengerSelectorProps {
    passengers: PassengerState;
    setPassengers: (p: PassengerState) => void;
    cabin: string;
    setCabin: (c: string) => void;
    minimal?: boolean;
}

export default function PassengerSelector({ passengers, setPassengers, cabin, setCabin, minimal = false }: PassengerSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { labels } = useRegion(); // Assuming we might want to use labels later, but hardcoding for now for simplicity/consistency with this component

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updatePassenger = (type: keyof PassengerState, increment: boolean) => {
        setPassengers({
            ...passengers,
            [type]: increment
                ? passengers[type] + 1
                : Math.max(type === 'adults' ? 1 : 0, passengers[type] - 1)
        });
    };

    const totalPassengers = passengers.adults + passengers.children + passengers.infants;

    const getSummary = () => {
        const travelerText = totalPassengers === 1 ? 'Viajante' : 'Viajantes';
        const cabinText = {
            'economy': 'Econômica',
            'premium_economy': 'Premium Econ.',
            'business': 'Executiva',
            'first': 'Primeira'
        }[cabin] || 'Econômica';

        return `${totalPassengers} ${travelerText}, ${cabinText}`;
    };

    const CABIN_OPTIONS = [
        { value: 'economy', label: 'Econômica' },
        { value: 'premium_economy', label: 'Premium Economy' },
        { value: 'business', label: 'Executiva' },
        { value: 'first', label: 'Primeira Classe' }
    ];

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Button */}
            {minimal ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                    {getSummary()}
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex flex-col items-start p-2 hover:bg-slate-50 rounded-lg transition-colors w-full sm:w-auto min-w-[180px]"
                >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                        Passageiros e Classe
                    </span>
                    <div className="flex items-center gap-2 px-1">
                        <User className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-900 font-bold text-lg truncate max-w-[160px]">
                            {getSummary()}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>
            )}

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-[1001] overflow-hidden"
                    >
                        {/* Passenger Counters */}
                        <div className="space-y-4 mb-6">
                            {/* Adults */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900">Adultos</p>
                                    <p className="text-xs text-slate-500">12+ anos</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePassenger('adults', false)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-50 transition-colors"
                                        disabled={passengers.adults <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-4 text-center">{passengers.adults}</span>
                                    <button
                                        onClick={() => updatePassenger('adults', true)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900">Crianças</p>
                                    <p className="text-xs text-slate-500">2-11 anos</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePassenger('children', false)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-50 transition-colors"
                                        disabled={passengers.children <= 0}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-4 text-center">{passengers.children}</span>
                                    <button
                                        onClick={() => updatePassenger('children', true)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Infants */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-900">Bebês</p>
                                    <p className="text-xs text-slate-500">0-2 anos</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePassenger('infants', false)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-50 transition-colors"
                                        disabled={passengers.infants <= 0}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-4 text-center">{passengers.infants}</span>
                                    <button
                                        onClick={() => updatePassenger('infants', true)}
                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 my-4" />

                        {/* Cabin Class Selection */}
                        <div>
                            <p className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Armchair className="w-4 h-4 text-slate-400" /> Classe
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {CABIN_OPTIONS.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setCabin(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-all ${cabin === option.value
                                            ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                                            : 'hover:bg-slate-50 text-slate-600'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
