'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Plane,
    Calendar,
    Clock,
    MapPin,
    ArrowLeft,
    Cloud,
    Sun,
    CloudRain,
    Snowflake,
    Thermometer,
    Droplets,
    Shirt,
    Sparkles,
    FileText,
    Smartphone,
    Bath,
    CheckCircle2,
    Loader2,
    Globe,
    Wallet
} from 'lucide-react';

interface TripDetails {
    booking: {
        id: string;
        bookingReference: string;
        status: string;
        origin: string;
        destination: string;
        airline: string;
        departureDate: string;
        amount: number;
        currency: string;
        passengers: any[];
        createdAt: string;
    };
    weather: {
        avgTemp: number;
        minTemp: number;
        maxTemp: number;
        rainProbability: number;
        description: string;
    } | null;
    packingList: {
        clothing: string[];
        toiletries: string[];
        gadgets: string[];
        documents: string[];
        mayaTip: string;
    } | null;
    destinationInfo: {
        name: string;
        country: string;
        timezone?: string;
    } | null;
}

function getWeatherIcon(description: string) {
    if (description.includes('Thunder')) return <CloudRain className="w-8 h-8 text-purple-400" />;
    if (description.includes('Snow')) return <Snowflake className="w-8 h-8 text-blue-300" />;
    if (description.includes('Rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (description.includes('Cloud')) return <Cloud className="w-8 h-8 text-gray-400" />;
    return <Sun className="w-8 h-8 text-yellow-400" />;
}

export default function TripDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.bookingId as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchDetails() {
            try {
                // Detect user language from browser
                const browserLang = navigator.language?.split('-')[0] || 'pt';
                const lang = ['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'pt';

                const res = await fetch(`/api/trip-details?bookingId=${bookingId}&lang=${lang}`);
                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setTripDetails(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (bookingId) {
            fetchDetails();
        }
    }, [bookingId]);

    const toggleItem = (item: string) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(item)) {
            newChecked.delete(item);
        } else {
            newChecked.add(item);
        }
        setCheckedItems(newChecked);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto" />
                    <p className="text-gray-400">A carregar detalhes da viagem...</p>
                </div>
            </div>
        );
    }

    if (error || !tripDetails) {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-400">Erro: {error || 'Viagem não encontrada'}</p>
                    <Link href="/my-trips" className="text-indigo-400 hover:underline">
                        ← Voltar para Minhas Viagens
                    </Link>
                </div>
            </div>
        );
    }

    const { booking, weather, packingList, destinationInfo } = tripDetails;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#0D1225] to-[#0B0F19] text-white pb-20 pt-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Link
                        href="/my-trips"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para Minhas Viagens
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Plane className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">
                                    {booking.origin} → {booking.destination}
                                </h1>
                                <p className="text-gray-400">{booking.airline}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${booking.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {booking.status === 'confirmed' ? '✓ Confirmada' : 'Processando'}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

                {/* Flight Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#151926] rounded-2xl border border-white/5 p-6 shadow-xl"
                >
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        Detalhes da Reserva
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Referência</p>
                            <p className="text-xl font-mono font-bold text-emerald-400">{booking.bookingReference}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Data de Partida</p>
                            <p className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(booking.departureDate).toLocaleDateString('pt-PT')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Passageiros</p>
                            <p className="text-lg font-semibold">{booking.passengers.length || 1}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Pago</p>
                            <p className="text-xl font-bold text-emerald-400">
                                {booking.currency} {booking.amount.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {destinationInfo && (
                        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-rose-400" />
                                <div>
                                    <p className="text-gray-500 text-xs">Destino</p>
                                    <p className="font-medium">{destinationInfo.name}, {destinationInfo.country}</p>
                                </div>
                            </div>
                            {destinationInfo.timezone && (
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <p className="text-gray-500 text-xs">Fuso Horário</p>
                                        <p className="font-medium">{destinationInfo.timezone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Weather Card */}
                {weather && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-[#151926] to-[#1a2035] rounded-2xl border border-white/5 p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-blue-400" />
                            Previsão do Tempo
                        </h2>

                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center">
                                    {getWeatherIcon(weather.description)}
                                </div>
                                <div>
                                    <p className="text-4xl font-bold">{weather.avgTemp}°C</p>
                                    <p className="text-gray-400">{weather.description}</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <Thermometer className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                                    <p className="text-2xl font-bold">{weather.maxTemp}°</p>
                                    <p className="text-xs text-gray-500">Máxima</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <Thermometer className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                    <p className="text-2xl font-bold">{weather.minTemp}°</p>
                                    <p className="text-xs text-gray-500">Mínima</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                    <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                    <p className="text-2xl font-bold">{weather.rainProbability}%</p>
                                    <p className="text-xs text-gray-500">Chuva</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Smart Packer */}
                {packingList && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#151926] rounded-2xl border border-white/5 p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Smart Packer
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">Sugestões baseadas no clima do destino</p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Clothing */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold mb-3 text-rose-400">
                                    <Shirt className="w-4 h-4" />
                                    Roupa
                                </h3>
                                <ul className="space-y-2">
                                    {packingList.clothing.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => toggleItem(`clothing-${i}`)}
                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${checkedItems.has(`clothing-${i}`)
                                                ? 'bg-emerald-500/10 text-emerald-400 line-through'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <CheckCircle2 className={`w-4 h-4 ${checkedItems.has(`clothing-${i}`) ? 'text-emerald-400' : 'text-gray-600'}`} />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Toiletries */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold mb-3 text-blue-400">
                                    <Bath className="w-4 h-4" />
                                    Higiene
                                </h3>
                                <ul className="space-y-2">
                                    {packingList.toiletries.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => toggleItem(`toiletries-${i}`)}
                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${checkedItems.has(`toiletries-${i}`)
                                                ? 'bg-emerald-500/10 text-emerald-400 line-through'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <CheckCircle2 className={`w-4 h-4 ${checkedItems.has(`toiletries-${i}`) ? 'text-emerald-400' : 'text-gray-600'}`} />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Gadgets */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold mb-3 text-purple-400">
                                    <Smartphone className="w-4 h-4" />
                                    Eletrónicos
                                </h3>
                                <ul className="space-y-2">
                                    {packingList.gadgets.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => toggleItem(`gadgets-${i}`)}
                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${checkedItems.has(`gadgets-${i}`)
                                                ? 'bg-emerald-500/10 text-emerald-400 line-through'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <CheckCircle2 className={`w-4 h-4 ${checkedItems.has(`gadgets-${i}`) ? 'text-emerald-400' : 'text-gray-600'}`} />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Documents */}
                            <div>
                                <h3 className="flex items-center gap-2 font-semibold mb-3 text-amber-400">
                                    <FileText className="w-4 h-4" />
                                    Documentos
                                </h3>
                                <ul className="space-y-2">
                                    {packingList.documents.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => toggleItem(`documents-${i}`)}
                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${checkedItems.has(`documents-${i}`)
                                                ? 'bg-emerald-500/10 text-emerald-400 line-through'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <CheckCircle2 className={`w-4 h-4 ${checkedItems.has(`documents-${i}`) ? 'text-emerald-400' : 'text-gray-600'}`} />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Maya Tip */}
                        <div className="mt-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                                    <Sparkles className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-indigo-400 mb-1">Dica da Maya</p>
                                    <p className="text-gray-300">{packingList.mayaTip}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
