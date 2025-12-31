'use client';

import { useState, useEffect } from 'react';
import { DuffelPayments } from '@duffel/components';
import { Loader2, AlertCircle, ShieldCheck, Lock, CreditCard, CheckCircle2, Globe } from 'lucide-react';

interface DuffelPaymentFormProps {
    offerId: string;
    amount: number;
    currency: string;
    passengers: any[];
    selectedServices: string[];
    onSuccess: (bookingReference: string, orderId: string) => void;
    onError: (error: string) => void;
}

export default function DuffelPaymentForm({
    offerId,
    amount,
    currency,
    passengers,
    selectedServices,
    onSuccess,
    onError
}: DuffelPaymentFormProps) {
    const [clientToken, setClientToken] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create PaymentIntent on mount
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch('/api/payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        offerId,
                        amount,
                        currency
                    })
                });

                const data = await res.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setClientToken(data.clientToken);
                setPaymentIntentId(data.id);
                console.log('PaymentIntent ready:', data.id);

            } catch (err: any) {
                console.error('Failed to create PaymentIntent:', err);
                setError(err.message || 'Failed to initialize payment');
            } finally {
                setLoading(false);
            }
        };

        if (amount > 0) {
            createPaymentIntent();
        } else {
            setLoading(false);
            setError('Offer not loaded correctly. Please go back and select a flight again.');
        }
    }, [offerId, amount, currency]);

    // Handle successful payment from Duffel component
    const handleSuccessfulPayment = async () => {
        if (!paymentIntentId) return;

        setProcessing(true);
        try {
            const res = await fetch('/api/payment-intent/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentIntentId,
                    offerId,
                    passengers,
                    selectedServices: selectedServices.map(id => ({ id }))
                })
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            onSuccess(data.bookingReference, data.orderId);

        } catch (err: any) {
            console.error('Failed to confirm payment:', err);
            setError(err.message);
            onError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    // Handle failed payment
    const handleFailedPayment = (failError: any) => {
        console.error('Payment failed:', failError);
        const errorMessage = failError?.message || 'Payment failed';
        setError(errorMessage);
        onError(errorMessage);
    };

    // Loading State
    if (loading) {
        return (
            <div className="space-y-6">
                {/* Transparency Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-600/10 dark:to-indigo-600/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-slate-900 dark:text-white font-bold mb-1">Pagamento Seguro</h4>
                            <p className="text-slate-600 dark:text-blue-200/70 text-sm leading-relaxed">
                                O seu pagamento será processado de forma segura pelo nosso parceiro certificado <strong className="text-blue-600 dark:text-blue-300">Duffel</strong>,
                                uma plataforma PCI-DSS compliant utilizada pelas maiores companhias aéreas do mundo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading Spinner */}
                <div className="flex flex-col items-center justify-center py-16 gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
                        <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <div className="text-center">
                        <p className="text-slate-900 dark:text-white font-medium mb-1">A preparar pagamento seguro...</p>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">Ligação encriptada SSL 256-bit</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error && !clientToken) {
        return (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-2">Erro no Pagamento</p>
                <p className="text-red-600/70 dark:text-red-300/70 text-sm mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 font-medium transition-all"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    // Processing State
    if (processing) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></div>
                    <CheckCircle2 className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">Pagamento Confirmado!</p>
                    <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-2">A emitir o seu bilhete...</p>
                    <Loader2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Transparency Message - Premium Design */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold">Ambiente de Pagamento Seguro</h4>
                        <p className="text-slate-500 dark:text-gray-400 text-xs">Processado via plataforma certificada Duffel</p>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
                    Os seus dados de pagamento são processados diretamente pelo <strong className="text-slate-900 dark:text-white">Duffel</strong>,
                    o nosso parceiro de reservas certificado PCI-DSS Nível 1. A AllTrip nunca tem acesso aos dados do seu cartão.
                </p>

                {/* Security Badges */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">PCI-DSS Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-700 dark:text-blue-400 text-xs font-bold">SSL 256-bit</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-lg">
                        <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-purple-700 dark:text-purple-400 text-xs font-bold">3D Secure</span>
                    </div>
                </div>
            </div>

            {/* Duffel Payments Component - Premium Container */}
            {clientToken && (
                <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-50 dark:opacity-50 opacity-20"></div>

                    {/* Payment Form Container */}
                    <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#0d1117] dark:to-[#161b22] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
                        {/* Header */}
                        <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-indigo-600/20 dark:to-purple-600/20 border-b border-slate-200 dark:border-white/5 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                    <span className="text-slate-900 dark:text-white font-bold">Dados do Cartão</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-5 opacity-60 grayscale hover:grayscale-0 transition-all" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-5 opacity-60 grayscale hover:grayscale-0 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="p-6 bg-white dark:bg-transparent">
                            <DuffelPayments
                                paymentIntentClientToken={clientToken}
                                onSuccessfulPayment={handleSuccessfulPayment}
                                onFailedPayment={handleFailedPayment}
                                styles={{
                                    accentColor: '99, 102, 241',
                                    fontFamily: 'Inter, system-ui, sans-serif',
                                    buttonCornerRadius: '12px',
                                    // Customizing for light/dark might require handling at the provider level if Duffel supports it,
                                    // but usually it mimics system or transparent.
                                    // If Duffel component has internal white bg, we deal with it.
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0" />
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Footer Trust Indicators */}
            <div className="text-center pt-4 border-t border-slate-200 dark:border-white/5">
                <p className="text-slate-500 dark:text-gray-500 text-xs mb-3">Transação processada de forma segura por</p>
                <div className="flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="text-slate-900 dark:text-white font-bold text-sm">Duffel</span>
                        <span className="text-slate-500 dark:text-gray-500 text-xs">Payments</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300 dark:bg-white/10"></div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500 text-xs">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Dados encriptados</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

