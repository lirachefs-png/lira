import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import { GUIDE_CITIES } from '@/lib/guide-cities';
import { Star, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AllTrip Guide - Curadoria Premium de Destinos',
    description: 'Descubra os melhores restaurantes, vida noturna, lazer e aventura nos destinos mais incríveis do mundo.',
};

export default function GuidePage() {
    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-6">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 text-sm font-bold tracking-wider">ALLTRIP GUIDE</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                        Curadoria Premium
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Gastronomia, vida noturna, lazer e aventura — selecionados pelos nossos especialistas.
                    </p>
                </div>
            </section>

            {/* Cities Grid */}
            <section className="pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {GUIDE_CITIES.map((city) => (
                            <Link
                                key={city.slug}
                                href={`/guide/${city.slug}`}
                                className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
                            >
                                {/* Background Image */}
                                <Image
                                    src={city.heroImage}
                                    alt={city.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Rating Badge */}
                                <div className="absolute top-4 right-4 flex items-center gap-0.5 px-2 py-1 bg-black/50 backdrop-blur-md rounded-full border border-amber-500/30">
                                    {Array.from({ length: city.rating }).map((_, i) => (
                                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="text-gray-400 text-sm">{city.country}</span>
                                    <h3 className="text-2xl font-bold text-white mb-1">{city.name}</h3>
                                    <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {city.tagline}
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Explorar <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
