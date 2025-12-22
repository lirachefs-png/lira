'use client';

import Link from "next/link";
import { LogOut, User, Globe, Eye, EyeOff, Sun, Moon, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import MayaChat from "@/components/MayaChat";
import { useRegion } from "@/contexts/RegionContext";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const supabase = createClient();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Auth Modal State - REMOVED (Moved to dedicated pages)
    const { language, currency, setLanguage, setCurrency, labels } = useRegion();
    const [showRegionMenu, setShowRegionMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check Auth using the new SSR-ready client
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

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
                    <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                        <Link href="/" className="px-5 py-2 rounded-full text-sm font-bold bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm transition-all hover:scale-105 active:scale-95">
                            {labels.flights}
                        </Link>

                        {/* Maya AI Chat Widget */}
                        <div className="px-1">
                            <MayaChat />
                        </div>

                        <Link href="/guide" className="px-5 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-white/50 dark:hover:bg-white/5">
                            {labels.experiences}
                        </Link>
                    </nav>

                    {/* RIGHT: User Actions */}
                    <div className="flex items-center gap-4">
                        {/* Admin Tools */}
                        {user?.email === 'lira.chefs@gmail.com' && (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link href="/admin" className="px-3 py-1 bg-rose-100 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/50 text-rose-600 dark:text-rose-500 text-[10px] font-bold tracking-wider rounded-md backdrop-blur-md hover:bg-rose-200 dark:hover:bg-rose-600/30 transition-colors">
                                    ADMIN
                                </Link>
                            </div>
                        )}

                        {/* User Profile Pill */}
                        {user ? (
                            <Link href="/my-trips" className="hidden md:block">
                                <div className={`flex items-center gap-3 border pl-1 pr-4 py-1 rounded-full shadow-sm transition-all cursor-pointer group ${scrolled ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20' : 'bg-black/5 dark:bg-black/40 border-white/20 dark:border-white/10 hover:bg-black/10 dark:hover:bg-black/60 backdrop-blur-md'}`}>
                                    {user.user_metadata.avatar_url ? (
                                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full shadow-inner" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                                            {user.email?.[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white">{labels.myAccount}</span>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className={`hidden md:flex items-center gap-2 border px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer group ${scrolled ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20' : 'bg-black/5 dark:bg-black/40 border-white/20 dark:border-white/10 hover:bg-black/10 dark:hover:bg-black/60 backdrop-blur-md'}`}>
                                <User className="w-4 h-4 text-slate-700 dark:text-white" />
                                <span className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white">{labels.login}</span>
                            </Link>
                        )}

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

                        {/* Logout */}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className={`transition-colors p-2 rounded-full ${scrolled ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        )}
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
                                {user && (
                                    <Link href="/my-trips" className="text-xl font-bold text-slate-500 dark:text-gray-400" onClick={() => setMobileMenuOpen(false)}>
                                        Minhas Viagens
                                    </Link>
                                )}
                            </nav>

                            <div className="h-px bg-slate-200 dark:bg-white/10" />

                            <div className="flex flex-col gap-4">
                                {!user ? (
                                    <Link
                                        href="/auth/signin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-center"
                                    >
                                        {labels.login}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                                        className="w-full py-3 rounded-xl border border-rose-500 text-rose-500 font-bold"
                                    >
                                        Sair
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
