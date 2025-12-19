import { createClient } from "@/lib/supabase/server";
import { getBookingsByUser } from "@/lib/bookingStore";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Plane } from "lucide-react";

export const runtime = "nodejs";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Minhas Viagens",
    description: "Gerencie suas reservas e acompanhe o status dos seus voos.",
};

export default async function MyTripsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        redirect("/");
    }

    const bookings = await getBookingsByUser(user.email);

    return (
        <main className="min-h-screen bg-background text-slate-900 dark:text-white pt-32 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                        Minhas Viagens
                    </h1>
                    <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        ← Voltar para busca
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/5 rounded-2xl p-12 text-center space-y-4 shadow-sm">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plane className="w-8 h-8 text-slate-400 dark:text-white/20" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nenhuma viagem encontrada</h2>
                        <p className="text-slate-600 dark:text-gray-400 max-w-md mx-auto">
                            Você ainda não fez nenhuma reserva. Que tal começar a planejar sua próxima aventura agora?
                        </p>
                        <Link
                            href="/"
                            className="inline-block mt-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-full hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors"
                        >
                            Pesquisar Voos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking: any) => (
                            <div key={booking.id} className="bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-rose-500/30 dark:hover:border-white/10 transition-colors group shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.state === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            booking.state === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            <Plane className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-lg text-slate-900 dark:text-white">
                                                    {booking.passenger_data?.origem || 'LIS'} → {booking.passenger_data?.destino || '???'}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${booking.state === 'confirmed' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                                                    booking.state === 'failed' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                                                        'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                                    }`}>
                                                    {booking.state === 'confirmed' ? 'Confirmada' :
                                                        booking.state === 'failed' ? 'Falhou' : 'Processando'}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(booking.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    Ref: <span className="font-mono text-slate-700 dark:text-white/60">{booking.booking_reference || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {booking.currency} {(booking.amount_total / 100).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-gray-500">Total pago</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
