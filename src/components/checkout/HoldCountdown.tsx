'use client';
import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const HoldCountdown = ({ expiryDate, offerId }: { expiryDate: string, offerId?: string }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(expiryDate).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('EXPIRADO');
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    return (
        <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Timer className="text-orange-500 animate-pulse w-6 h-6" />
                <div>
                    <p className="text-xs text-orange-500 uppercase font-bold tracking-wider">O seu preço está garantido por:</p>
                    <p className="text-2xl font-mono font-black text-orange-600">{timeLeft}</p>
                </div>
            </div>
            {offerId && (
                <button
                    onClick={() => router.push(`/checkout?offerId=${offerId}`)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-orange-600/20"
                >
                    Pagar Agora
                </button>
            )}
        </div>
    );
};
