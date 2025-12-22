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
            <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center gap-4">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                <p className="text-gray-400">Loading checkout...</p>
            </div>
        );
    }

    return <CheckoutContent />;
}
