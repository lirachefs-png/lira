import Header from "@/components/layout/Header";
import Hero from "@/components/Hero";
import FeaturedDestinations from "@/components/FeaturedDestinations";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AllTrip - O Segredo dos Voos Baratos",
    description: "Encontre passagens aéreas com descontos incríveis que não aparecem nos buscadores comuns.",
};

export default function Home() {
    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-rose-500/30 transition-colors duration-300">
            <Header />
            <Hero />
            <FeaturedDestinations />
        </main>
    );
}
