import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { getCityBySlug, GUIDE_CITIES } from '@/lib/guide-cities';
import { generateCityGuide } from '@/app/actions/generate-guide';
import { Star, ArrowLeft, MapPin, Plane } from 'lucide-react';

interface PageProps {
    params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
    return GUIDE_CITIES.map((city) => ({
        city: city.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: slug } = await params;
    const city = getCityBySlug(slug);

    if (!city) {
        return { title: 'Cidade não encontrada' };
    }

    return {
        title: `${city.name} - AllTrip Guide`,
        description: city.tagline,
    };
}

export default async function CityGuidePage({ params }: PageProps) {
    const { city: slug } = await params;
    const city = getCityBySlug(slug);

    if (!city) {
        notFound();
    }

    // Gerar conteúdo com IA
    const guideContent = await generateCityGuide(city.name, city.country);

    return (
        <main className="min-h-screen bg-[#0B0F19]">
            <Header />

            {/* Hero */}
            <section className="relative h-[60vh] min-h-[400px]">
                <Image
                    src={city.heroImage}
                    alt={city.name}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Stronger gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-black/40" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Button - aligned with content */}
                        <Link
                            href="/guide"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm hover:bg-white/20 transition-colors border border-white/10 mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar ao Guide
                        </Link>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full mb-4 ml-4">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-amber-400 text-xs font-bold tracking-wider">ALLTRIP GUIDE</span>
                            <div className="flex gap-0.5">
                                {Array.from({ length: city.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                            <MapPin className="w-4 h-4" />
                            {city.country}
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                            {city.name}
                        </h1>

                        <p className="text-xl text-gray-300 max-w-2xl mb-6">
                            {guideContent.description}
                        </p>

                        <Link
                            href={`/search?origin=&destination=${city.iataCode}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                        >
                            <Plane className="w-5 h-5" />
                            Pesquisar voos
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {guideContent.categories.map((category, idx) => (
                        <div key={category.name} className="mb-16">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="text-3xl">{category.icon}</span>
                                <h2 className="text-3xl font-bold text-white">{category.name}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {category.places.map((place, placeIdx) => (
                                    <div
                                        key={placeIdx}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                                    >
                                        {/* Rating */}
                                        <div className="flex gap-0.5 mb-3">
                                            {Array.from({ length: place.rating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            ))}
                                            {Array.from({ length: 3 - place.rating }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-gray-600" />
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{place.description}</p>

                                        {/* Tip */}
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                                            <span className="text-amber-400 text-xs font-bold">💡 DICA:</span>
                                            <p className="text-amber-200/80 text-sm mt-1">{place.tip}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
