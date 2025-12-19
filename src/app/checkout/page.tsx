import { Suspense } from 'react';
import CheckoutContent from './CheckoutContent';

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
