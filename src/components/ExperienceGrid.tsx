'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChefHat, Moon, Utensils, Music } from 'lucide-react';

export default function ExperienceGrid() {
    return (
        <section className="py-20 bg-white dark:bg-[#0B0F19] relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-rose-500 font-bold tracking-wider text-sm uppercase">Inspiração Sensorial</span>
                    <h2 className="text-3xl md:text-5xl font-black mt-2 text-slate-900 dark:text-white">
                        Muito mais que um voo. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-rose-500">
                            Viva a Experiência.
                        </span>
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-auto md:h-[600px]">

                    {/* Large Left Item: Destination of the Month */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="col-span-1 md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-3xl cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop")' }} // Taj Mahal / Exotic
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-4 border border-white/10">
                                DESTINO DO MÊS
                            </span>
                            <h3 className="text-4xl font-serif text-white mb-2">Índia Mística</h3>
                            <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                                Deixe-se levar pelas cores de Jaipur e pelo silêncio sagrado dos templos. Uma jornada espiritual que começa no momento em que embarca.
                            </p>
                            <button className="flex items-center gap-2 text-white font-bold text-sm tracking-wide group/btn">
                                DESCOBRIR <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Top Right: Culinary Art */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop")' }} // Fine Dining / Food
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute bottom-0 left-0 p-8 z-10 w-full md:w-2/3">
                            <div className="flex items-center gap-2 mb-3 text-rose-400">
                                <Utensils className="w-5 h-5" />
                                <span className="font-bold text-xs tracking-widest uppercase">Gastronomia</span>
                            </div>
                            <h3 className="text-3xl font-serif text-white mb-2">Sabores do Mundo</h3>
                            <p className="text-gray-300 text-sm">
                                Dos aromas das ruas de Bangkok aos chefs Michelin de Paris. Sinta o sabor da sua próxima aventura antes mesmo de chegar.
                            </p>
                        </div>
                    </motion.div>

                    {/* Bottom Right: Nightlife */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="col-span-1 md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-3xl cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1770&auto=format&fit=crop")' }} // Nightlife / Rooftop
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute bottom-0 left-0 p-8 z-10 w-full md:w-2/3">
                            <div className="flex items-center gap-2 mb-3 text-purple-400">
                                <Music className="w-5 h-5" />
                                <span className="font-bold text-xs tracking-widest uppercase">Vida Noturna</span>
                            </div>
                            <h3 className="text-3xl font-serif text-white mb-2">Pulsação Noturna</h3>
                            <p className="text-gray-300 text-sm">
                                Descubra os segredos da noite. Dos rooftops de Nova Iorque às batidas de Ibiza. A noite é apenas o começo da sua história.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
