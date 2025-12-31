import React, { useState } from 'react';
import { MapPin, Utensils, Camera, Sun, Moon, ChevronDown, ChevronUp, Calendar, Mail, Check, Loader2, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendItineraryEmail } from '@/app/actions/send-itinerary';

export type Activity = {
    time: string;
    description: string;
    type: 'sightseeing' | 'food' | 'relax' | 'adventure' | 'transit';
    location?: string;
};

export type DayPlan = {
    day: number;
    title: string;
    date?: string;
    weather?: string;
    activities: Activity[];
};

export type ItineraryData = {
    tripTitle: string;
    duration: string;
    totalBudgetEstimate?: string;
    days: DayPlan[];
};

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
    switch (type) {
        case 'food': return <Utensils className="w-4 h-4 text-orange-400" />;
        case 'sightseeing': return <Camera className="w-4 h-4 text-purple-400" />;
        case 'relax': return <Sun className="w-4 h-4 text-yellow-400" />;
        case 'transit': return <MapPin className="w-4 h-4 text-blue-400" />;
        case 'adventure': return <MapPin className="w-4 h-4 text-green-400" />;
        default: return <MapPin className="w-4 h-4 text-gray-400" />;
    }
};

export default function ItineraryBlock({ data }: { data: ItineraryData }) {
    const [expandedDay, setExpandedDay] = useState<number | null>(1);

    // Email State
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSending(true);
        try {
            const result = await sendItineraryEmail(email, data);
            if (result.success) {
                setEmailSent(true);
                setTimeout(() => {
                    setShowEmailInput(false);
                    setEmailSent(false);
                    setEmail('');
                }, 3000);
            } else {
                alert('Erro ao enviar: ' + (result.error || 'Erro desconhecido'));
            }
        } catch (err: any) {
            console.error('Email send error:', err);
            alert('Falha ao enviar email. Tente novamente.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-4 overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl ring-1 ring-white/5">
            {/* Header */}
            <div className="relative p-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-b border-white/10">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200 border border-violet-500/30">
                        ROTEIRO SUGERIDO
                    </span>
                    {data.totalBudgetEstimate && (
                        <span className="text-xs font-medium text-emerald-300">
                            {data.totalBudgetEstimate}
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {data.tripTitle}
                </h3>
                <p className="text-sm text-white/60 ml-6">{data.duration}</p>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl -z-10" />
            </div>

            {/* Days List */}
            <div className="p-2 space-y-2">
                {data.days.map((day) => (
                    <div key={day.day} className="rounded-lg overflow-hidden bg-white/5 border border-white/5">
                        <button
                            onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                            className="w-full flex items-center justify-between p-3 transition-colors hover:bg-white/5"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${expandedDay === day.day ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/10 text-white/70 border-white/10'}`}>
                                    {day.day}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-white">{day.title}</p>
                                    {day.weather && <p className="text-xs text-white/50">{day.weather}</p>}
                                </div>
                            </div>
                            {expandedDay === day.day ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
                        </button>

                        <AnimatePresence>
                            {expandedDay === day.day && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-1 space-y-4 relative">
                                        {/* Timeline Line */}
                                        <div className="absolute left-[27px] top-2 bottom-4 w-0.5 bg-white/10" />

                                        {day.activities.map((act, idx) => (
                                            <div key={idx} className="relative flex gap-4 pl-2">
                                                {/* Bullet */}
                                                <div className="absolute left-[15px] mt-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-black/50" />

                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-mono text-indigo-300">{act.time}</span>
                                                        <ActivityIcon type={act.type} />
                                                    </div>
                                                    <p className="text-sm text-white/90 leading-tight">{act.description}</p>
                                                    {act.location && (
                                                        <p className="text-xs text-white/50 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {act.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/5 flex flex-col gap-2">
                {/* Main Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            // Extract first destination from itinerary title or first day
                            const destination = data.tripTitle.split(' ').slice(-1)[0] || 'destino';
                            window.location.href = `/search?to=${encodeURIComponent(destination)}`;
                        }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                        <Plane className="w-4 h-4" />
                        Buscar Voos
                    </button>
                    <button
                        onClick={() => setShowEmailInput(!showEmailInput)}
                        className={`px-3 py-2 ${showEmailInput ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'} rounded-lg transition-all flex items-center justify-center`}
                        title="Enviar por e-mail"
                    >
                        <Mail className="w-4 h-4" />
                    </button>
                </div>

                {/* Email Input Form */}
                <AnimatePresence>
                    {showEmailInput && (
                        <motion.form
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleSendEmail}
                            className="overflow-hidden"
                        >
                            <div className="pt-2 flex gap-2">
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || emailSent}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center min-w-[80px]
                                        ${emailSent
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'}`}
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : emailSent ? <Check className="w-4 h-4" /> : 'Enviar'}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
