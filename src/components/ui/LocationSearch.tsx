'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationSearchProps {
    label: string;
    placeholder: string;
    value: string; // The selected IATA code or display name
    onChange: (value: string) => void;
    variant?: 'light' | 'dark';
}

export default function LocationSearch({ label, placeholder, value, onChange, variant = 'light' }: LocationSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Initial value handling
    useEffect(() => {
        if (value && !query) {
            // In a real app, we'd lookup the name from the Code, but for now let's just show what's passed
            // or keep it blank if it's just a code and we want the user to type.
            // Simplifying: User types city name to search.
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/locations?query=${query}`);
                const data = await res.json();
                setResults(data.data || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error', error);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (iataCode: string, name: string) => {
        onChange(iataCode);
        setQuery(`${name} (${iataCode})`);
        setIsOpen(false);
    };

    const styles = variant === 'dark' ? {
        container: "bg-white/5 hover:bg-white/10 border-white/10 text-white",
        label: "text-gray-400",
        input: "text-white placeholder:text-gray-500",
        icon: "text-rose-500"
    } : {
        container: "bg-gray-50 hover:bg-gray-100 border-transparent text-gray-900",
        label: "text-gray-400",
        input: "text-gray-900 placeholder:text-gray-300",
        icon: "text-gray-400"
    };

    return (
        <div className="flex-1 relative group" ref={wrapperRef}>
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${styles.icon}`}>
                <MapPin className="w-5 h-5" />
            </div>
            <div className={`${styles.container} transition-colors rounded-xl px-12 py-3 text-left w-full h-full cursor-pointer border hover:border-gray-200 relative z-10`}>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${styles.label}`}>{label}</span>
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`bg-transparent w-full font-bold focus:outline-none ${styles.input}`}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="p-2 bg-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-colors cursor-pointer" onClick={() => setIsOpen(true)}>
                        <MapPin className="w-4 h-4 text-rose-500 hover:text-white" />
                    </div>
                </div>
            </div>

            {/* Absolute Dropdown positioned incorrectly? No, needs to be outside the overflow-hidden container if possible, 
                but Hero usually has overflow-visible unless specific. 
                Let's use absolute positioning relative to the wrapper. */}
            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#0B0F19] border border-white/10 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto backdrop-blur-3xl text-left"
                    >
                        {results.map((result: any) => (
                            <div
                                key={result.id}
                                onClick={() => handleSelect(result.iata_code, result.city_name || result.name)}
                                className="px-4 py-3 hover:bg-white/10 cursor-pointer flex items-center justify-between group/item"
                            >
                                <div>
                                    <div className="font-bold text-white text-sm">
                                        {result.city_name || result.name}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {result.name}
                                    </div>
                                </div>
                                <span className="text-rose-500 font-black text-sm bg-rose-500/10 px-2 py-1 rounded">
                                    {result.iata_code}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
