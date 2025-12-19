'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';

interface Destination {
    name: string;
    country: string;
    price: string;
    miles: string;
    image: string;
    iata: string;
    color: string;
}

const DESTINATIONS: Destination[] = [
    {
        name: 'Colombo',
        country: 'Sri Lanka',
        price: 'R$ 2451',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
        iata: 'CMB',
        color: '#0D9488'
    },
    {
        name: 'Abu Dhabi',
        country: 'Emirados Árabes',
        price: 'R$ 1665',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80',
        iata: 'AUH',
        color: '#7C3AED'
    },
    {
        name: 'Phnom Penh',
        country: 'Camboja',
        price: 'R$ 2831',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1549484807-6b0be6287c1c?auto=format&fit=crop&w=800&q=80',
        iata: 'PNH',
        color: '#EA580C'
    },
    {
        name: 'Hong Kong',
        country: 'China',
        price: 'R$ 2866',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=800&q=80',
        iata: 'HKG',
        color: '#2563EB'
    },
    {
        name: 'Medan',
        country: 'Indonésia',
        price: 'R$ 2917',
        miles: '+50k milhas',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
        iata: 'KNO',
        color: '#E11D48'
    },
    {
        name: 'Bangkok',
        country: 'Tailândia',
        price: 'R$ 3100',
        miles: '+60k milhas',
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
        iata: 'BKK',
        color: '#F59E0B'
    }
];

function Card({ dest, index }: { dest: Destination; index: number }) {
    const router = useRouter();

    return (
        <motion.div
            className="relative flex-shrink-0 w-[300px] md:w-[360px] h-[500px] rounded-3xl overflow-hidden cursor-pointer group snap-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => router.push(`/search?destination=${dest.iata}`)}
        >
            {/* Parallax Image Effect Layer */}
            <div className="absolute inset-0 overflow-hidden">
                <NextImage
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 360px"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
            </div>

            {/* Content Content - Floating Elements */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                {/* Top Badge */}
                <div className="flex justify-between items-start">
                    <span className="backdrop-blur-md bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {dest.country}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-4 h-4 text-white -rotate-45" />
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tight">
                        {dest.name}
                    </h3>

                    <div className="flex items-end justify-between border-t border-white/20 pt-4 mt-2">
                        <div>
                            <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">
                                A partir de
                            </p>
                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                {dest.price}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded">
                                {dest.miles}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function ParallaxDestinations() {
    // For a simple horizontal scroll with snap, we rely on CSS mostly for performance
    // The "Parallax" feel here comes from the premium smooth scroll and image scale on hover

    return (
        <div className="w-full relative group">
            <div
                className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                style={{ scrollBehavior: 'smooth' }}
            >
                {DESTINATIONS.map((dest, i) => (
                    <Card key={dest.iata} dest={dest} index={i} />
                ))}

                {/* Spacer for end of list */}
                <div className="w-4 flex-shrink-0" />
            </div>

            {/* Fade Edges */}
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        </div>
    );
}
