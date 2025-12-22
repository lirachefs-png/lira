'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const ads = [
    {
        id: 1,
        title: "Summer in Paris",
        subtitle: "Earn 2x Miles on all flights to France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        link: `/search?origin=GRU&destination=CDG&date=${getFutureDate(30)}`,
        color: "from-rose-500 to-purple-600"
    },
    {
        id: 2,
        title: "Business Class Upgrade",
        subtitle: "Upgrade starting from $199 on selected routes",
        image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80",
        link: `/search?origin=JFK&destination=LHR&date=${getFutureDate(14)}&cabin=business`,
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 3,
        title: "Tokyo Adventure",
        subtitle: "Direct flights now available from major hubs",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
        link: `/search?origin=LAX&destination=HND&date=${getFutureDate(60)}`,
        color: "from-amber-500 to-red-600"
    }
];

export default function FeaturedAds() {
    const router = useRouter();

    return (
        <section className="relative z-20 py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Exclusive Offers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ads.map((ad, index) => (
                    <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => router.push(ad.link)}
                        className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-black/50 border border-white/10"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${ad.image})` }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <div className={`mb-3 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${ad.color} text-white shadow-lg`}>
                                Limited Time
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 leading-tight group-hover:text-rose-300 transition-colors">
                                {ad.title}
                            </h3>
                            <p className="text-sm text-gray-300 font-medium mb-4 opacity-90">
                                {ad.subtitle}
                            </p>

                            <div className="flex items-center gap-2 text-sm font-bold text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                View Offer <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>

                        {/* Glass Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
