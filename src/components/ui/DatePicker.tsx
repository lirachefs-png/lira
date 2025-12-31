'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';
import { useRegion } from '@/contexts/RegionContext';

interface DateProps {
    label: string;
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export default function DatePicker({ label, date, setDate }: DateProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { language } = useRegion();

    const locales = {
        pt: ptBR,
        en: enUS,
        es: es
    };

    const placeholders = {
        pt: 'Selecione a data',
        en: 'Select date',
        es: 'Seleccionar fecha'
    };

    const currentLocale = locales[language];
    const dateFormat = language === 'en' ? 'MMM d, yyyy' : "d 'de' MMM, yyyy";

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

    // Custom styles for DayPicker to match Theme
    const css = `
        .rdp { 
            --rdp-cell-size: 40px; 
            --rdp-accent-color: #f43f5e; 
            --rdp-background-color: transparent; 
            margin: 0; 
        }
        /* Light Mode Defaults */
        .rdp-day { color: #1f2937; } 
        .rdp-day:hover:not([disabled]) { background-color: #f3f4f6; }
        .rdp-caption_label { color: #1f2937; font-weight: bold; }
        .rdp-nav_button { color: #4b5563; }
        .rdp-head_cell { color: #9ca3af; }

        /* Dark Mode Overrides */
        .dark .rdp-day { color: white; }
        .dark .rdp-day:hover:not([disabled]) { background-color: rgba(255,255,255,0.1); }
        .dark .rdp-caption_label { color: white; }
        .dark .rdp-nav_button { color: white; }

        .rdp-day_selected:not([disabled]) { background-color: #f43f5e; color: white; }
        .rdp-day_selected:hover:not([disabled]) { background-color: #e11d48; }
        
        .rdp-caption_label { text-transform: capitalize; }
    `;

    return (
        <div className="flex-1 relative group" ref={wrapperRef}>
            <style>{css}</style>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <CalendarIcon className="w-5 h-5" />
            </div>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors rounded-xl px-12 py-3 text-left w-full h-full cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/20 relative z-10"
            >
                <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
                <span className={`block font-bold truncate ${date ? 'text-gray-900 dark:text-white' : 'text-gray-300 dark:text-gray-500'} capitalize`}>
                    {date ? format(date, dateFormat, { locale: currentLocale }) : placeholders[language]}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl z-[9999] backdrop-blur-3xl"
                    >
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            locale={currentLocale}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
