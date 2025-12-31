'use client';

import { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Thermometer, Shirt, Sun, CloudRain } from 'lucide-react';

interface WeatherCardProps {
    destinationCode: string;
    destinationName?: string;
}

interface WeatherData {
    location: string;
    temperature: number;
    temperatureMax: number;
    temperatureMin: number;
    weatherDescription: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    suggestion: string;
}

interface ForecastDay {
    date: string;
    tempMax: number;
    tempMin: number;
    emoji: string;
}

export default function WeatherCard({ destinationCode, destinationName }: WeatherCardProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchWeather() {
            try {
                setLoading(true);
                const res = await fetch(`/api/weather?city=${destinationCode}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setWeather(data.current);
                setForecast(data.forecast?.slice(0, 5) || []);
                setError(false);
            } catch (err) {
                console.error('Weather fetch error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        if (destinationCode) {
            fetchWeather();
        }
    }, [destinationCode]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/5 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-slate-200 dark:bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-slate-50 dark:bg-[#151926] border border-slate-200 dark:border-white/5 rounded-2xl p-6 text-center">
                <Cloud className="w-8 h-8 mx-auto text-slate-300 dark:text-white/20 mb-2" />
                <p className="text-sm text-slate-500 dark:text-gray-500">
                    Clima indisponível para {destinationName || destinationCode}
                </p>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    };

    return (
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-sky-500/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-2 right-2 text-6xl opacity-20">
                {weather.weatherDescription.split(' ')[0]}
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Clima em</p>
                        <h3 className="text-lg font-bold">{destinationName || weather.location}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-black">{weather.temperature}°</p>
                        <p className="text-xs text-white/70">
                            {weather.temperatureMax}° / {weather.temperatureMin}°
                        </p>
                    </div>
                </div>

                {/* Current conditions */}
                <p className="text-sm mb-4">{weather.weatherDescription}</p>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-1 text-xs text-white/80">
                        <Droplets className="w-3 h-3" />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/80">
                        <Wind className="w-3 h-3" />
                        <span>{weather.windSpeed} km/h</span>
                    </div>
                    {weather.precipitation > 0 && (
                        <div className="flex items-center gap-1 text-xs text-white/80">
                            <CloudRain className="w-3 h-3" />
                            <span>{weather.precipitation}mm</span>
                        </div>
                    )}
                </div>

                {/* 5-day forecast */}
                {forecast.length > 0 && (
                    <div className="flex gap-2 mb-4 pt-4 border-t border-white/20">
                        {forecast.map((day, i) => (
                            <div key={i} className="flex-1 text-center">
                                <p className="text-[10px] text-white/60 uppercase">{formatDate(day.date)}</p>
                                <p className="text-lg">{day.emoji}</p>
                                <p className="text-xs font-medium">{day.tempMax}°</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Clothing suggestion */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-start gap-2">
                    <Shirt className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs leading-relaxed">{weather.suggestion}</p>
                </div>
            </div>
        </div>
    );
}
