'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css'; // Make sure to import styles

interface DateProps {
    label: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export default function DatePicker({ label, date, setDate }: DateProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setIsOpen(false);
    };

    // Custom styles for DayPicker to match Dark theme
    const css = `
        .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #f43f5e; --rdp-background-color: #1a1f2e; margin: 0; }
        .rdp-day_selected:not([disabled]) { background-color: #f43f5e; color: white; }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: rgba(255,255,255,0.1); }
        .rdp-head_cell { color: #9ca3af; }
        .rdp-caption_label { color: white; font-weight: bold; }
        .rdp-nav_button { color: white; }
    `;

    return (
        <div className="flex-1 relative group" ref={wrapperRef}>
            <style>{css}</style>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <CalendarIcon className="w-5 h-5" />
            </div>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-12 py-3 text-left w-full h-full cursor-pointer border border-transparent hover:border-gray-200 relative z-10"
            >
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <span className={`block font-bold truncate ${date ? 'text-gray-900' : 'text-gray-300'} capitalize`}>
                    {date ? format(date, "d 'de' MMM, yyyy", { locale: ptBR }) : 'Selecione a data'}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 p-4 bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl z-[9999] backdrop-blur-3xl"
                    >
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            locale={ptBR}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
