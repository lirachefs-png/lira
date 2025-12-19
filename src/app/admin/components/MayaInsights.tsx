'use client';

import { useEffect, useState } from "react";
import { generateAdminInsights } from "@/app/actions/maya";
import { Sparkles, Brain, Loader2 } from "lucide-react";

export default function MayaInsights({ bookings }: { bookings: any[] }) {
    const [insight, setInsight] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchInsight() {
            try {
                const text = await generateAdminInsights(bookings);
                if (mounted) setInsight(text);
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchInsight();

        return () => { mounted = false; };
    }, [bookings]); // Re-analyze if bookings change significantly? Maybe just on mount.

    return (
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-24 h-24 text-indigo-500" />
            </div>

            <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                </div>

                <div className="space-y-2 flex-grow">
                    <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                        Maya Insights
                        <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                            Beta AI
                        </span>
                    </h3>

                    {loading ? (
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analisando milhões de possibilidades...
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-gray-200 leading-relaxed font-medium">
                            {insight}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
