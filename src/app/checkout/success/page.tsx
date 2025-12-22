'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader2, ShieldCheck, Mail, Clock } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import MayaChat from '@/components/MayaChat';
import { HoldCountdown } from '@/components/checkout/HoldCountdown';

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const offerId = searchParams.get('offer_id'); // From Stripe flow
    const bookingRef = searchParams.get('booking_ref');
    const mode = searchParams.get('mode'); // 'hold' or undefined
    const expiresAt = searchParams.get('expires'); // For hold mode

    const [status, setStatus] = useState<'loading' | 'processing' | 'confirmed' | 'error' | 'timeout' | 'hold_confirmed'>('loading');
    const [bookingDetails, setBookingDetails] = useState<{ orderId?: string, ref?: string }>({});

    useEffect(() => {
        // --- HOLD MODE LOGIC ---
        if (mode === 'hold') {
            setStatus('hold_confirmed');
            setBookingDetails({ ref: bookingRef || 'PENDING' });
            return;
        }

        // --- STRIPE FLOW LOGIC ---
        if (!sessionId) return;

        const startTime = Date.now();
        const timeoutMs = 60000; // 60s timeout

        const checkStatus = async () => {
            try {
                // Use verify endpoint which has fallback logic for localhost
                const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`, { cache: "no-store" });
                const data = await res.json();

                if (data.state === 'confirmed') {
                    setStatus('confirmed');
                    setBookingDetails({ orderId: data.offerId, ref: data.bookingReference });
                    return true; // stop polling
                } else if (data.state === 'failed') {
                    setStatus('error');
                    return true; // stop polling
                }
                return false; // continue polling
            } catch (e) {
                console.error(e);
                // Don't stop polling on network error immediately, unless timeout
                return false;
            }
        };

        const interval = setInterval(async () => {
            if (Date.now() - startTime > timeoutMs) {
                setStatus('timeout');
                clearInterval(interval);
                return;
            }

            const stopped = await checkStatus();
            if (stopped) {
                clearInterval(interval);
            }
        }, 1500); // Poll every 1.5s

        // Initial check
        checkStatus();

        return () => clearInterval(interval);
    }, [sessionId, mode, bookingRef]);

    if (!sessionId && mode !== 'hold') {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
                <p>Invalid Session.</p>
            </div>
        );
    }

    const isHold = status === 'hold_confirmed';
    const mayaContext = isHold
        ? `Consegui! O teu lugar no voo da American Airlines está reservado. Tens até às ${new Date(expiresAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} para garantir este preço antes que a companhia o liberte novamente.`
        : "Parabéns! Sua viagem está confirmada. Deseje uma ótima viagem ao cliente.";

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

            {/* Maya Context */}
            <MayaChat isCollapsed={true} contextPrompt={mayaContext} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#151926] p-8 rounded-2xl border border-white/10 max-w-lg w-full text-center space-y-6 shadow-2xl relative z-10"
            >
                <div className="flex justify-center">
                    {status === 'confirmed' || status === 'hold_confirmed' ? (
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] ${isHold ? 'bg-orange-500/20 shadow-orange-500/20' : 'bg-emerald-500/20'}`}>
                            {isHold ? <ShieldCheck className="w-10 h-10 text-orange-500" /> : <CheckCircle className="w-10 h-10 text-emerald-500" />}
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        {status === 'confirmed' ? 'Booking Confirmed!' :
                            status === 'hold_confirmed' ? 'Price Held Successfully!' :
                                status === 'error' ? 'Booking Failed' :
                                    status === 'timeout' ? 'Processing Delay' :
                                        'Finalizing Booking...'}
                    </h1>
                    <p className="text-white/40 text-sm">
                        {status === 'confirmed' ? 'Your flight has been securely booked and ticketed.' :
                            status === 'hold_confirmed' ? 'Your seat is reserved. Complete payment to finalize.' :
                                status === 'error' ? 'There was an issue creating your ticket. Please contact support.' :
                                    status === 'timeout' ? 'Your payment was received but ticketing is taking longer than usual.' :
                                        'Wait a moment while we confirm with the airline.'}
                    </p>
                </div>

                {/* HOLD COUNTDOWN */}
                {isHold && expiresAt && (
                    <HoldCountdown expiryDate={expiresAt} offerId={sessionId || bookingRef || undefined} />
                )}

                {/* INSTRUCTIONS FOR HOLD */}
                {isHold && (
                    <div className="text-left space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="font-bold text-sm text-gray-200">1. Check your email</p>
                                <p className="text-xs text-gray-500">Includes booking reference and payment link.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="font-bold text-sm text-gray-200">2. Price Locked</p>
                                <p className="text-xs text-gray-500">The total amount is guaranteed until expiration.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-1" />
                            <div>
                                <p className="font-bold text-sm text-gray-200">3. Complete Payment</p>
                                <p className="text-xs text-gray-500">Pay before timer hits zero to issue ticket.</p>
                            </div>
                        </div>
                    </div>
                )}


                <div className="bg-[#0B0F19] rounded-xl p-4 border border-white/5 space-y-4 text-left">
                    {(status === 'confirmed' || status === 'hold_confirmed') && (
                        <div>
                            <p className={`text-xs font-bold tracking-wider mb-1 ${isHold ? 'text-orange-500' : 'text-emerald-500'}`}>BOOKING REFERENCE</p>
                            <p className={`font-mono text-lg ${isHold ? 'text-orange-400' : 'text-emerald-400'}`}>{bookingDetails.ref || bookingRef || 'Generating...'}</p>
                        </div>
                    )}

                    {sessionId && (
                        <div>
                            <p className="text-xs text-white/30 font-bold tracking-wider mb-1">TRANSACTION ID</p>
                            <p className="font-mono text-xs text-white/60 break-all">{sessionId}</p>
                        </div>
                    )}

                    {status === 'confirmed' && (
                        <div>
                            <p className="text-xs text-white/30 font-bold tracking-wider mb-1">DUFFEL ORDER ID</p>
                            <p className="font-mono text-xs text-white/60 break-all">{bookingDetails.orderId}</p>
                        </div>
                    )}
                </div>

                <Link
                    href="/"
                    className={`block w-full py-4 rounded-xl font-bold transition-all ${status === 'confirmed' || status === 'hold_confirmed'
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                >
                    {status === 'confirmed' || status === 'hold_confirmed' ? 'Find Another Deal →' : 'Processing...'}
                </Link>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
