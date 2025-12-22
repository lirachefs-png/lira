'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AirlineLogoProps {
    iataCode: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'symbol' | 'lockup';
}

/**
 * AirlineLogo Component
 * Uses official Duffel CDN for high-quality airline logos
 * Falls back to text if image fails to load
 */
export default function AirlineLogo({
    iataCode,
    name,
    size = 'md',
    variant = 'symbol'
}: AirlineLogoProps) {
    const [hasError, setHasError] = useState(false);

    // Duffel official logo URL pattern
    const logoType = variant === 'lockup' ? 'full-color-lockup' : 'full-color-logo';
    const logoUrl = `https://assets.duffel.com/img/airlines/for-light-background/${logoType}/${iataCode}.svg`;

    // Size classes
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-14 w-14'
    };

    if (hasError) {
        // Fallback to IATA code text
        return (
            <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg font-bold text-xs text-slate-600 dark:text-slate-300`}>
                {iataCode}
            </div>
        );
    }

    return (
        <div className={`relative ${sizeClasses[size]} overflow-hidden rounded-lg bg-white dark:bg-white/10 flex items-center justify-center p-1`}>
            <Image
                src={logoUrl}
                alt={`Logo da ${name}`}
                fill
                className="object-contain p-1"
                sizes={size === 'lg' ? '56px' : size === 'md' ? '40px' : '24px'}
                loading="lazy"
                onError={() => setHasError(true)}
                unoptimized // SVGs don't need optimization
            />
        </div>
    );
}
