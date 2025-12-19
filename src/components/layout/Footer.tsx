'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#151926] text-slate-400 border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Grid: Simplified */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Column 1: Navegação */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg">Navegação</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Voos</Link></li>
                            <li><Link href="/experiences" className="hover:text-white transition-colors">Experiências</Link></li>
                            <li><Link href="/my-trips" className="hover:text-white transition-colors">Minhas Viagens</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Suporte */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg">Suporte</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Fale Conosco</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold text-lg">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Subscribe Section */}
                <div className="border-t border-white/5 pt-12 pb-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-white font-bold text-xl mb-2">Cadastre-se para ofertas especiais</h3>
                            <p className="text-sm">Economize com nossas últimas tarifas e ofertas.</p>
                        </div>
                        <div className="w-full md:w-auto flex gap-2">
                            <input
                                type="email"
                                placeholder="Endereço de e-mail"
                                className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-rose-500 w-full md:w-80"
                            />
                            <button className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                                Inscrever
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Apps + Socials */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-12">

                    {/* App Stores */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white mb-2">AllTrip App</span>
                            <div className="flex gap-2">
                                <button className="bg-black border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6" />
                                </button>
                                <button className="bg-black border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-white/5 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-xs font-bold text-white mb-2">Conecte-se conosco</span>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-rose-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center text-xs text-slate-600">
                    <div className="mb-4 flex justify-center gap-4">
                        {/* Links moved to main grid */}
                    </div>
                    <p>© 2025 AllTrip App. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
