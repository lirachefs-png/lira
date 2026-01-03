'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plane, Mail, ArrowRight, Loader2, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Signup error:', error);
            alert(`Erro ao criar conta: ${error.message}`);
            setIsLoading(false);
        } else {
            alert('Conta criada! Verifique seu email para confirmar.');
            router.push('/auth/signin');
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
                        Crie sua conta
                    </h1>
                    <p className="text-center text-slate-500 dark:text-gray-400 text-sm mb-8">
                        Junte-se a milhares de viajantes economizando hoje
                    </p>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Seu nome"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-500/30 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Criar Conta
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="text-center text-sm text-slate-500 mt-4">
                            Já tem uma conta?{' '}
                            <Link href="/auth/signin" className="text-rose-500 font-bold hover:underline">
                                Fazer Login
                            </Link>
                        </div>
                    </form>
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
