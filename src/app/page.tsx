import { Suspense } from "react";
import Hero from "@/components/Hero";
import FeaturedAds from "@/components/FeaturedAds";
import PromoPriceCards from "@/components/PromoPriceCards";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Partners from "@/components/Partners";
import ExperienceGrid from "@/components/ExperienceGrid";
import PremiumExperiences from "@/components/PremiumExperiences";
import CarnivalBanner from "@/components/CarnivalBanner";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AllTrip - O Segredo dos Voos Baratos",
    description: "Encontre passagens aéreas com descontos incríveis que não aparecem nos buscadores comuns.",
};

export default function Home() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-rose-500/30 transition-colors duration-300">
            <Hero />
            {/* <CarnivalBanner /> */}
            <Suspense fallback={<div className="h-96 w-full animate-pulse bg-slate-100 dark:bg-slate-800" />}>
                <ExperienceGrid />
            </Suspense>
            {/* <FeaturedAds /> */}
            <PromoPriceCards />
            <PremiumExperiences />
            <FeaturedDestinations />
            <Partners />
        </main>
    );
}

