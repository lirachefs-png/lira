'use client';

import { useState } from 'react';
import { MessageCircle, Loader2, Headphones } from 'lucide-react';

interface DuffelAssistantButtonProps {
    userId: string; // Email or Duffel user ID
    userName?: string; // For creating customer user if needed (format: "First Last")
    bookingReference?: string;
    variant?: 'default' | 'compact' | 'floating';
    className?: string;
}

/**
 * Duffel Assistant Button
 * 
 * Opens the Duffel Assistant for trip management and support.
 * If userName is provided, will create a Duffel Customer User on first use.
 */
export default function DuffelAssistantButton({
    userId,
    userName,
    bookingReference,
    variant = 'default',
    className = ''
}: DuffelAssistantButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOpenAssistant = async () => {
        setLoading(true);
        setError(null);

        try {
            let duffelUserId = userId;

            // If userId looks like an email and we have userName, try to get/create Duffel user
            if (userId.includes('@') && userName) {
                const [given_name, ...rest] = userName.split(' ');
                const family_name = rest.join(' ') || given_name;

                // Check if user exists, create if not
                const checkRes = await fetch(`/api/duffel/customer-users?email=${encodeURIComponent(userId)}`);
                const checkData = await checkRes.json();

                if (checkData.found) {
                    duffelUserId = checkData.id;
                } else {
                    // Create new customer user
                    const createRes = await fetch('/api/duffel/customer-users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: userId,
                            given_name,
                            family_name
                        })
                    });
                    const createData = await createRes.json();

                    if (createData.id) {
                        duffelUserId = createData.id;
                    }
                    // If creation fails, fallback to email-based attempt
                }
            }

            // Get ephemeral client key from our API
            const res = await fetch('/api/duffel/assistant-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: duffelUserId }),
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // 2. Open Duffel Assistant with the key
            if (typeof window !== 'undefined' && (window as any).openDuffelAssistant) {
                (window as any).openDuffelAssistant({
                    clientKey: data.clientKey,
                    // Optional: Pass context about the issue
                    context: bookingReference ? {
                        summary: `Booking reference: ${bookingReference}`,
                        issueType: 'general'
                    } : undefined
                });
            } else {
                throw new Error('Duffel Assistant not loaded');
            }

        } catch (err: any) {
            console.error('Failed to open Duffel Assistant:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Floating variant (fixed position)
    if (variant === 'floating') {
        return (
            <button
                onClick={handleOpenAssistant}
                disabled={loading}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
                    bg-gradient-to-br from-orange-500 to-amber-600 
                    hover:from-orange-600 hover:to-amber-700
                    text-white shadow-xl shadow-orange-500/30
                    flex items-center justify-center
                    transition-all hover:scale-105
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}`}
                title="Gerir Viagem / Suporte"
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <Headphones className="w-6 h-6" />
                )}
            </button>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <button
                onClick={handleOpenAssistant}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 
                    bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 
                    border border-orange-200 dark:border-orange-500/30 rounded-xl
                    text-orange-600 dark:text-orange-400 font-medium text-sm
                    transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <MessageCircle className="w-4 h-4" />
                )}
                <span>Suporte</span>
            </button>
        );
    }

    // Default variant - Full button
    return (
        <div className={className}>
            <button
                onClick={handleOpenAssistant}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4
                    bg-gradient-to-r from-orange-500 to-amber-500
                    hover:from-orange-600 hover:to-amber-600
                    text-white font-bold rounded-xl
                    shadow-lg shadow-orange-500/20
                    transition-all hover:shadow-xl hover:shadow-orange-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>A abrir...</span>
                    </>
                ) : (
                    <>
                        <Headphones className="w-5 h-5" />
                        <span>Gerir Viagem / Suporte</span>
                    </>
                )}
            </button>

            {error && (
                <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
            )}
        </div>
    );
}
