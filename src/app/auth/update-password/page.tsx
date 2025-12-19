'use client';

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("Link inválido ou expirado. Por favor, solicite uma nova recuperação de senha.");
                router.push("/");
            }
        };
        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            alert("Senha atualizada com sucesso!");
            router.push("/");
        } catch (error: any) {
            alert(error.message || "Erro ao atualizar senha.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4">
            <div className="bg-[#151926] border border-white/10 p-8 rounded-2xl w-full max-w-sm shadow-2xl space-y-6">
                <div className="text-center">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                        <Link className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Nova Senha
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Digite sua nova senha abaixo.
                    </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Nova senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirmar nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#ff0080] via-[#ff4d00] to-[#ffb700] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Atualizando..." : "Salvar Nova Senha"}
                    </button>
                </form>
            </div>
        </main>
    );
}
