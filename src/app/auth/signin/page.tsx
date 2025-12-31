'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plane, Mail, ArrowRight, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setIsLoading(provider);

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            }
        });

        if (error) {
            console.error('OAuth error:', error);
            setIsLoading(null);
            alert(`Erro ao conectar com ${provider}. Tente novamente.`);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading('email');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Email login error:', error);
            alert('Erro ao fazer login. Verifique suas credenciais.');
            setIsLoading(null);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-[#0B0F19] dark:via-[#0B0F19] dark:to-[#1a1025] flex items-center justify-center p-4">
            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 opacity-10">
                <Plane className="w-32 h-32 text-rose-500 rotate-[-30deg]" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-10">
                <Plane className="w-24 h-24 text-indigo-500 rotate-[30deg]" />
            </div>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="flex items-center justify-center gap-[10px] group">
                        <div className="relative h-[58px] w-auto">
                            <img
                                src="/logo-new.png"
                                alt="AllTrip"
                                className="h-full w-auto object-contain"
                            />
                        </div>
                        <span className="text-[24px] font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700]">
                            All Trip
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-[#151926] rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-white/10 p-8">
                    <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
                        Acesse sua conta
                    </h1>
                    <p className="text-center text-slate-500 dark:text-gray-400 text-sm mb-8">
                        Economize mais com tarifas de membro exclusivas
                    </p>

                    {/* Social Buttons */}
                    <div className="space-y-3 mb-6">
                        {/* Google */}
                        <button
                            onClick={() => handleSocialLogin('google')}
                            disabled={!!isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            {isLoading === 'google' ? (
                                <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="font-medium text-slate-700 dark:text-white">Continuar com Google</span>
                                </>
                            )}
                        </button>

                        {/* Facebook */}
                        <button
                            onClick={() => handleSocialLogin('facebook')}
                            disabled={!!isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading === 'facebook' ? (
                                <Loader2 className="w-5 h-5 animate-spin text-white" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="font-medium">Continuar com Facebook</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                        <span className="text-xs text-slate-400 dark:text-gray-500 uppercase tracking-wider">ou</span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                    </div>

                    {/* Email Option */}
                    {!showEmailForm ? (
                        <>
                            <button
                                onClick={() => setShowEmailForm(true)}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all group mb-6"
                            >
                                <Mail className="w-5 h-5 text-slate-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                                <span className="font-medium text-slate-700 dark:text-white">Continuar com Email</span>
                            </button>

                            <div className="text-center pt-2">
                                <Link href="/auth/signup" className="text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline">
                                    Não tem conta? Cadastrar
                                </Link>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Sua senha"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link href="/auth/reset-password" className="text-xs text-rose-500 hover:text-rose-600 hover:underline">
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={!!isLoading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/30 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading === 'email' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Entrar
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailForm(false)}
                                    className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    Voltar para opções sociais
                                </button>

                                <div className="text-center pt-2">
                                    <Link href="/auth/signup" className="text-sm font-bold text-rose-500 hover:underline">
                                        Criar nova conta
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-6 max-w-xs mx-auto">
                    Ao continuar, você concorda com nossa{' '}
                    <Link href="/privacy" className="text-rose-500 hover:underline">Política de Privacidade</Link>
                    {' '}e{' '}
                    <Link href="/terms" className="text-rose-500 hover:underline">Termos de Uso</Link>.
                </p>
            </div>
        </main>
    );
}
