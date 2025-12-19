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

    // Auth Modal State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
            });
            if (error) throw error;
            alert("Verifique seu e-mail! Enviamos um link para você redefinir sua senha.");
            setIsForgotPassword(false);
            setShowLoginModal(false);
        } catch (error: any) {
            alert(error.message || "Erro ao enviar e-mail de recuperação.");
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                if (password !== confirmPassword) {
                    alert("As senhas não coincidem!");
                    setLoading(false);
                    return;
                }
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de entrar.");
                setIsSignUp(false); // Switch to login view
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Login successful, modal closes via auth state change or manual close
                setShowLoginModal(false);
            }
        } catch (error: any) {
            alert(error.message || "Erro na autenticação. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <>
            <header
                className={`fixed top-0 w-full z-[9999] transition-all duration-500 border-b ${scrolled
                    ? "bg-white/80 dark:bg-black/50 backdrop-blur-md border-slate-200 dark:border-white/10 shadow-sm"
                    : "bg-transparent border-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
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
                    <nav className={`hidden md:flex items-center p-1 rounded-full transition-all duration-500 ${scrolled ? 'bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10' : 'bg-black/5 dark:bg-white/10 border border-white/20 backdrop-blur-md'}`}>
                        <Link href="/" className="px-6 py-2 rounded-full text-sm font-bold bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm transition-all hover:scale-105 active:scale-95">
                            {labels.flights}
                        </Link>

                        {/* Maya AI Chat Widget */}
                        <div className="px-2">
                            <MayaChat />
                        </div>

                        <Link href="/experiences" className="px-6 py-2 rounded-full text-sm font-bold text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-black/5 dark:hover:bg-white/10">
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
                                <Link href="/admin/voice" className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-600/20 border border-violet-200 dark:border-violet-500/50 text-violet-600 dark:text-violet-400 text-[10px] font-bold tracking-wider rounded-full backdrop-blur-md hover:bg-violet-200 dark:hover:bg-violet-600/30 transition-colors">
                                    <Mic className="w-3 h-3" />
                                    VOICE STUDIO
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
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className={`hidden md:flex items-center gap-2 border px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer group ${scrolled ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20' : 'bg-black/5 dark:bg-black/40 border-white/20 dark:border-white/10 hover:bg-black/10 dark:hover:bg-black/60 backdrop-blur-md'}`}>
                                <User className="w-4 h-4 text-slate-700 dark:text-white" />
                                <span className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-slate-900 dark:group-hover:text-white">{labels.login}</span>
                            </button>
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
                                <Link href="/experiences" className="text-xl font-bold text-slate-500 dark:text-gray-400" onClick={() => setMobileMenuOpen(false)}>
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
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); setShowLoginModal(true); }}
                                        className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold"
                                    >
                                        {labels.login}
                                    </button>
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

            {/* Login Modal */}
            {
                showLoginModal && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-[#151926] border border-white/10 p-8 rounded-2xl w-full max-w-sm relative shadow-2xl">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                                {isForgotPassword ? "Recuperar Senha" : (isSignUp ? "Criar Conta" : "Bem-vindo")}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {isForgotPassword
                                    ? "Digite seu e-mail para receber um link de redefinição."
                                    : (isSignUp ? "Preencha seus dados para começar." : "Entre para gerenciar suas viagens.")}
                            </p>

                            {isForgotPassword ? (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                                    </button>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotPassword(false)}
                                            className="text-gray-400 hover:text-white text-sm"
                                        >
                                            Voltar para Login
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Sua senha"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors pr-12"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>

                                    {isSignUp && (
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirmar senha"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors pr-12"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        {!isSignUp && (
                                            <button
                                                type="button"
                                                onClick={() => setIsForgotPassword(true)}
                                                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                            >
                                                Esqueci minha senha
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {loading ? "Processando..." : (isSignUp ? "Cadastrar" : "Entrar")}
                                    </button>
                                </form>
                            )}

                            <div className="mt-4 text-center">
                                {!isForgotPassword && (
                                    <>
                                        <span className="text-gray-400 text-sm">
                                            {isSignUp ? "Já tem conta? " : "Não tem conta? "}
                                        </span>
                                        <button
                                            onClick={() => setIsSignUp(!isSignUp)}
                                            className="text-white font-bold hover:underline text-sm"
                                        >
                                            {isSignUp ? "Entrar" : "Cadastrar"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
