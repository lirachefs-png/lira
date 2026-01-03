'use client';

import Link from "next/link";
import { Globe, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRegion } from "@/contexts/RegionContext";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const { language, currency, setLanguage, setCurrency, labels } = useRegion();
    const [showRegionMenu, setShowRegionMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <header
                className="fixed top-0 w-full z-[200] h-20 transition-all duration-300 border-b border-white/5 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md shadow-sm"
            >
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* LEFT: Logo */}
                    <Link href="/" className="flex items-center gap-[10px] group">
                        <div className="relative h-[58px] w-auto">
                            <img
                                src="/logo-new.png"
                                alt="AllTrip"
                                className="h-full w-auto object-contain group-hover:opacity-80 transition-opacity"
                            />
                        </div>
                        <span className="text-[24px] font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700] group-hover:opacity-80 transition-opacity">
                            All Trip
                        </span>
                    </Link>

                    {/* CENTER: Pill Navigation */}
                    <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                        <Link href="/" className="w-[120px] text-center py-2 rounded-full text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-white/50 dark:hover:bg-white/5">
                            {labels.flights}
                        </Link>
                        <Link href="/guide" className="w-[120px] text-center py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:opacity-90 transition-all">
                            Guia
                        </Link>
                        <Link href="/guide" className="w-[120px] text-center py-2 rounded-full text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-white/50 dark:hover:bg-white/5">
                            {labels.experiences}
                        </Link>
                    </nav>

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`p-2 rounded-full transition-all ${scrolled ? 'text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700 dark:text-white" />}
                            </button>
                        )}

                        {/* Language/Currency */}
                        <div className="relative">
                            <button
                                onClick={() => setShowRegionMenu(!showRegionMenu)}
                                className={`hidden sm:flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-bold transition-all ${scrolled ? 'bg-transparent border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white' : 'bg-black/40 border-white/10 text-white hover:bg-black/60 backdrop-blur-md'}`}
                            >
                                <Globe className="w-3.5 h-3.5" /> {language.toUpperCase()} | {currency}
                            </button>

                            {showRegionMenu && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[10001]">
                                    <div className="p-2 space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 px-2 py-1">IDIOMA</p>
                                        {['pt', 'en', 'es'].map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => { setLanguage(lang as any); setShowRegionMenu(false); }}
                                                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${language === lang ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300'}`}
                                            >
                                                {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                                            </button>
                                        ))}

                                        <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />

                                        <p className="text-[10px] font-bold text-slate-400 px-2 py-1">MOEDA</p>
                                        {['EUR', 'USD', 'BRL'].map((curr) => (
                                            <button
                                                key={curr}
                                                onClick={() => { setCurrency(curr as any); setShowRegionMenu(false); }}
                                                className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${currency === curr ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300'}`}
                                            >
                                                {curr}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-900 dark:text-white"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {
                mobileMenuOpen && (
                    <div className="fixed inset-0 z-[10002] bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <div className="absolute right-0 top-0 bottom-0 w-[70%] max-w-xs bg-white dark:bg-[#151926] p-6 shadow-2xl flex flex-col gap-6" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end">
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 dark:text-white">✕</button>
                            </div>

                            <nav className="flex flex-col gap-4">
                                <Link href="/" className="text-xl font-bold text-slate-900 dark:text-white" onClick={() => setMobileMenuOpen(false)}>
                                    {labels.flights}
                                </Link>
                                <Link href="/guide" className="text-xl font-bold text-slate-500 dark:text-gray-400" onClick={() => setMobileMenuOpen(false)}>
                                    {labels.experiences}
                                </Link>
                                <Link href="/guide" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                    <span>🌍</span> Guia de Viagens
                                </Link>
                            </nav>

                            <div className="h-px bg-slate-200 dark:bg-white/10" />

                            {/* Language & Currency Selector for Mobile */}
                            <div className="flex flex-col gap-3">
                                <p className="text-xs font-bold text-slate-400 dark:text-gray-500 flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> IDIOMA & MOEDA
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {['pt', 'en', 'es'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang as any)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${language === lang ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300'}`}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {['EUR', 'USD', 'BRL'].map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => setCurrency(curr as any)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currency === curr ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300'}`}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
