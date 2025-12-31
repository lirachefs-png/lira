'use client';

import { useState, useEffect } from 'react';
import CheckoutContent from './CheckoutContent';

export default function CheckoutPage() {
    const [hasMounted, setHasMounted] = useState(false);

    // Ensure component only renders on client after mount
    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col items-center justify-center gap-4 transition-colors">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                <p className="text-slate-500 dark:text-gray-400">Loading checkout...</p>
            </div>
        );
    }

    return <CheckoutContent />;
}
