'use client';

import { User } from '@supabase/supabase-js';
import { Plane, MapPin, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import MayaInterviewModal from './MayaInterviewModal';
import { useState } from 'react';

interface UserProfileCardProps {
    user: User;
    bookings: any[];
}

export default function UserProfileCard({ user, bookings }: UserProfileCardProps) {
    const confirmedBookings = bookings.filter(b => b.state === 'confirmed');
    const totalSpent = bookings.reduce((acc, b) => acc + (b.amount_total || 0), 0) / 100;
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);

    const persona = user.user_metadata?.persona;
    const isPersonaComplete = !!persona?.last_interview_at;

    // Get unique destinations
    const destinations = new Set(bookings.map(b => b.passenger_data?.destino).filter(Boolean));

    // Determine user level based on bookings
    const getLevel = () => {
        if (confirmedBookings.length >= 10) return { name: 'Expert Traveler', emoji: '🌟', color: 'text-amber-500' };
        if (confirmedBookings.length >= 5) return { name: 'Frequent Flyer', emoji: '✈️', color: 'text-blue-500' };
        if (confirmedBookings.length >= 1) return { name: 'Explorer', emoji: '🧭', color: 'text-emerald-500' };
        return { name: 'New Adventurer', emoji: '🌱', color: 'text-gray-500' };
    };

    const level = getLevel();
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl">✈️</div>
                <div className="absolute bottom-4 left-4 text-4xl">🌍</div>
            </div>

            <div className="relative z-10">
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 mb-6">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                            {userName?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="text-white/70 text-sm">{getGreeting()},</p>
                        <h2 className="text-xl font-bold">{userName}</h2>
                        <div className={`inline-flex items-center gap-1 text-xs font-medium mt-1 px-2 py-0.5 rounded-full bg-white/20`}>
                            <span>{level.emoji}</span>
                            <span>{level.name}</span>
                        </div>
                    </div>

                    {/* Interview Button */}
                    <div className="ml-auto">
                        <button
                            onClick={() => setIsInterviewOpen(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg ${isPersonaComplete
                                ? 'bg-white/10 text-white/90 border border-white/20'
                                : 'bg-white text-indigo-600 shadow-white/20'
                                }`}
                        >
                            <Sparkles className={`w-4 h-4 ${!isPersonaComplete && 'animate-pulse'}`} />
                            {isPersonaComplete ? 'Atualizar Perfil com a Maya' : 'Entrevista com a Maya'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Plane className="w-4 h-4 text-white/70" />
                            <span className="text-xs text-white/70">Viagens</span>
                        </div>
                        <p className="text-2xl font-bold">{bookings.length}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-white/70" />
                            <span className="text-xs text-white/70">Confirmadas</span>
                        </div>
                        <p className="text-2xl font-bold">{confirmedBookings.length}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-white/70" />
                            <span className="text-xs text-white/70">Destinos</span>
                        </div>
                        <p className="text-2xl font-bold">{destinations.size}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-white/70" />
                            <span className="text-xs text-white/70">Investido</span>
                        </div>
                        <p className="text-xl font-bold">€{totalSpent.toFixed(0)}</p>
                    </div>
                </div>
            </div>

            <MayaInterviewModal
                isOpen={isInterviewOpen}
                onClose={() => setIsInterviewOpen(false)}
            />
        </div>
    );
}
