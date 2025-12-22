'use client';

import { motion } from 'framer-motion';
import AirlineLogo from './ui/AirlineLogo';

const PARTNERS = [
    { name: 'TAP Air Portugal', code: 'TP' },
    { name: 'American Airlines', code: 'AA' },
    { name: 'Lufthansa', code: 'LH' },
    { name: 'British Airways', code: 'BA' },
    { name: 'Turkish Airlines', code: 'TK' },
    { name: 'LATAM Airlines', code: 'LA' },
    { name: 'Air France', code: 'AF' },
    { name: 'KLM', code: 'KL' },
    { name: 'easyJet', code: 'U2' },
    { name: 'Iberia', code: 'IB' },
];

export default function Partners() {
    return (
        <section className="py-12 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">
                        Parceiros Oficiais
                    </h3>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                    {PARTNERS.map((partner, index) => (
                        <motion.div
                            key={partner.code}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center gap-2 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100 hover:scale-110 cursor-pointer"
                        >
                            <AirlineLogo
                                iataCode={partner.code}
                                name={partner.name}
                                size="lg"
                                variant="lockup"
                            />
                            <span className="text-xs text-slate-500 dark:text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                {partner.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
                <p className="text-center text-slate-400 text-[10px] mt-8 opacity-60">
                    Bilhetes emitidos diretamente nos sistemas oficiais das companhias aéreas
                </p>
            </div>
        </section>
    );
}
