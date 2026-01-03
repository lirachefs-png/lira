'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cloud, Sun, Umbrella, Thermometer, Battery, Shirt, Briefcase, FileText, Sparkles, Check, Loader2, Info } from 'lucide-react';
// import { getSmartPackingList, PackingList } from '@/app/actions/smart-packer';
import { useRegion } from '@/contexts/RegionContext';
// Mock types for UI stability
interface PackingList {
    clothing: string[];
    toiletries: string[];
    gadgets: string[];
    documents: string[];
    mayaTip: string;
}

interface SmartPackerModalProps {
    isOpen: boolean;
    onClose: () => void;
    destination: string;
    origem: string;
    date: string; // ISO string
}

export default function SmartPackerModal({ isOpen, onClose, destination, origem, date }: SmartPackerModalProps) {
    const { labels } = useRegion();
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<PackingList | null>(null);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    // Fetch data when modal opens
    useEffect(() => {
        if (isOpen) {
            // Smart Packer Service is currently disabled
            setLoading(false);
            setList(null);
        }
    }, [isOpen]);

    const toggleItem = (item: string) => {
        setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
    };

    const categories = [
        { id: 'clothing', label: labels.smart_packer.clothing, icon: Shirt, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        { id: 'gadgets', label: labels.smart_packer.gadgets, icon: Battery, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { id: 'toiletries', label: labels.smart_packer.toiletries, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { id: 'documents', label: labels.smart_packer.documents, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0B0F19]/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col max-h-[85vh]"
                    >
                        {/* Header Image / Gradient */}
                        <div className="relative h-32 bg-gradient-to-r from-rose-600 to-orange-600 flex items-center justify-between px-8">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white mb-2 backdrop-blur-md border border-white/10">
                                    <Sparkles className="w-3 h-3" /> Maya Smart Packer
                                </span>
                                <h2 className="text-3xl font-black text-white">{labels.smart_packer.title} {destination}</h2>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="relative z-10 w-10 h-10 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center">
                                    <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                                    <p className="text-lg font-bold text-white">{labels.smart_packer.loading} {destination}...</p>
                                    <p className="text-sm text-slate-400">{labels.smart_packer.loading_desc}</p>
                                </div>
                            ) : list ? (
                                <div className="space-y-6">
                                    {/* Weather Summary (Mocked visually based on Maya Tip or Data) */}
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                                                <Cloud className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-blue-100">{labels.smart_packer.weather_forecast}</h3>
                                                <p className="text-sm text-blue-200/70 mt-1">
                                                    {labels.smart_packer.weather_desc}
                                                    {/* In a real integrated UI, we'd pass the weather object here too */}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                                                <Info className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-amber-100">{labels.smart_packer.maya_tip}</h3>
                                                <p className="text-sm text-amber-200/70 mt-1 italic">
                                                    "{list.mayaTip}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {categories.map((cat) => (
                                            <div key={cat.id} className="space-y-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <cat.icon className={`w-4 h-4 ${cat.color}`} />
                                                    <h3 className={`font-bold uppercase text-xs tracking-wider ${cat.color}`}>{cat.label}</h3>
                                                </div>

                                                <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                                    {(list as any)[cat.id]?.map((item: string, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => toggleItem(item)}
                                                            className={`
                                                                flex items-center gap-3 p-3 cursor-pointer transition-all border-b border-white/5 last:border-0 hover:bg-white/5
                                                                ${checkedItems[item] ? 'opacity-50' : 'opacity-100'}
                                                            `}
                                                        >
                                                            <div className={`
                                                                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                                                                ${checkedItems[item]
                                                                    ? 'bg-emerald-500 border-emerald-500'
                                                                    : 'border-slate-500 group-hover:border-slate-400'}
                                                            `}>
                                                                {checkedItems[item] && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <span className={`text-sm ${checkedItems[item] ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                                                {item}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                                        <X className="w-8 h-8 text-rose-400" />
                                    </div>
                                    <p className="text-lg font-bold text-white mb-2">{labels.smart_packer.failed}</p>
                                    <p className="text-sm text-slate-400 mb-4">Não foi possível gerar a lista de bagagem. Verifique sua conexão e tente novamente.</p>
                                    <button
                                        onClick={() => {
                                            // Service disabled
                                            setLoading(false);
                                        }}
                                        className="px-6 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-colors"
                                    >
                                        Tentar Novamente
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-between items-center backdrop-blur-md">
                            <p className="text-xs text-slate-500">
                                {Object.values(checkedItems).filter(Boolean).length} {labels.smart_packer.items_packed}
                            </p>
                            <button className="px-6 py-2 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors">
                                {labels.smart_packer.save_list}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
