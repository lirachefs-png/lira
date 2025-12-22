'use client';

import { useState, useEffect } from 'react';
import { DuffelPayments } from '@duffel/components';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-gray-400 text-sm">Preparing secure payment...</p>
            </div>
        );
    }

    if (error && !clientToken) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-red-400 font-medium mb-2">Payment Error</p>
                <p className="text-red-300/70 text-sm">{error}</p>
            </div>
        );
    }

    if (processing) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <p className="text-gray-400 text-sm">Processing your booking...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Duffel Payments Component */}
            {clientToken && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    <DuffelPayments
                        paymentIntentClientToken={clientToken}
                        onSuccessfulPayment={handleSuccessfulPayment}
                        onFailedPayment={handleFailedPayment}
                        styles={{
                            fontFamily: 'inherit',
                            buttonCornerRadius: '8px',
                        }}
                    />
                </div>
            )}

            {/* Test Card Hint (Sandbox) */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-400 text-xs font-bold mb-1">🧪 MODO DE TESTE</p>
                <p className="text-amber-200/80 text-xs">
                    Use o cartão: <strong>4242 4242 4242 4242</strong> | Validade: qualquer futura | CVC: qualquer
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
