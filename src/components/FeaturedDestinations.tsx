'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LocationSearch from './ui/LocationSearch';
import { CoverFlowDestinations } from './CoverFlowDestinations';

export default function FeaturedDestinations() {
    const [origin, setOrigin] = useState('LIS');
    const router = useRouter();

    const handleViewAll = () => {
        router.push(`/search?origin=${origin}`);
    };

    return (
        <section className="relative z-0 max-w-7xl mx-auto px-4 py-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-8">
                <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-rose-500">Live Deals</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                        Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">Drops.</span>
                    </h2>

                    {/* Dark Mode Input */}
                    <div className="w-full max-w-sm">
                        <LocationSearch
                            label="Departure City"
                            placeholder="Type to change origin..."
                            value={origin}
                            onChange={setOrigin}
                        />
                    </div>
                </div>

                <button
                    onClick={handleViewAll}
                    className="px-8 py-4 rounded-full bg-slate-900 text-white hover:bg-rose-600 dark:bg-white/5 dark:text-white dark:border dark:border-white/10 dark:hover:border-rose-500/50 dark:hover:bg-rose-600/10 backdrop-blur-md transition-all font-bold flex items-center gap-2 shadow-lg hover:shadow-rose-500/25 hover:-translate-y-1"
                >
                    View All Drops <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            {/* NEW COVER FLOW SLIDER */}
            <div className="-mx-4 md:mx-0">
                <CoverFlowDestinations origin={origin} />
            </div>

        </section>
    );
}
