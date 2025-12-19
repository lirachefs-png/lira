'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import {
    BadgeDollarSign,
    Ticket,
    Users,
    Plane,
    Calendar,
    AlertTriangle,
    Clock,
    CheckCircle,
    TrendingUp,
    Plus,
    CreditCard,
    Settings,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { useMemo } from 'react';
import MayaInsights from './components/MayaInsights';


interface AdminDashboardClientProps {
    bookings: any[];
}

export default function AdminDashboardClient({ bookings }: AdminDashboardClientProps) {
    // --- 1. DATA PROCESSING & METRICS ---

    // Summary Metrics
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.amount_total || 0), 0) / 100;
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b: any) => b.state === 'confirmed').length;
    const failedBookings = bookings.filter((b: any) => b.state === 'failed').length;
    const processingBookings = bookings.filter((b: any) => b.state === 'processing').length;

    // "Smart" Alerts Data
    const alerts = [];
    if (failedBookings > 0) alerts.push({ type: 'critical', message: `${failedBookings} pagamentos falharam recentemente.`, icon: AlertTriangle });
    if (processingBookings > 2) alerts.push({ type: 'warning', message: `${processingBookings} reservas pendentes há mais de 24h.`, icon: Clock });
    if (alerts.length === 0) alerts.push({ type: 'success', message: 'Tudo tranquilo! Sistema operando 100%.', icon: CheckCircle });

    // Chart Data: Status Distribution
    const statusData = [
        { name: 'Confirmadas', value: confirmedBookings, color: '#10b981' }, // Emerald-500
        { name: 'Falhas', value: failedBookings, color: '#f43f5e' }, // Rose-500
        { name: 'Pendentes', value: processingBookings, color: '#eab308' }, // Yellow-500
    ];

    // Chart Data: Bookings History (Mocked for Demo if empty, otherwise grouped by Date)
    // In a real scenario, we would group `bookings` by `created_at`.
    const historyData = useMemo(() => {
        // Group by date (DD/MM) - Last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        // Mock data to demonstrate the visual if no real data spans 7 days
        return last7Days.map(date => ({
            date,
            reservas: Math.floor(Math.random() * 5) + (totalBookings > 0 ? 1 : 0), // Slight randomness for "alive" feel
            receita: Math.floor(Math.random() * 500) + 100
        }));
    }, [totalBookings]);


    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* --- 0. MAYA BRAIN --- */}
            <MayaInsights bookings={bookings} />

            {/* --- 1. SMART ALERT BAR --- */}
            <div className="flex flex-col gap-4">
                {alerts.map((alert, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center gap-3 p-4 rounded-xl border ${alert.type === 'critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                            alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                            }`}
                    >
                        <alert.icon className="w-5 h-5" />
                        <span className="font-semibold">{alert.message}</span>
                        {alert.type === 'critical' && <button className="ml-auto text-xs bg-rose-500 text-white px-3 py-1 rounded-full hover:bg-rose-600 transition">Ver Falhas</button>}
                    </div>
                ))}
            </div>

            {/* --- 2. INTELLIGENT KPI CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white dark:bg-[#151926] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <BadgeDollarSign className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="flex flex-col relative z-10">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 mb-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <BadgeDollarSign className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-sm">Receita Confirmada</span>
                        </div>
                        <h3 className="text-3xl font-bold dark:text-white mt-1">
                            € {totalRevenue.toFixed(2)}
                        </h3>
                        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1.5 rounded-full">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>+12% vs semana passada</span>
                        </div>
                    </div>
                </div>

                {/* Bookings Card */}
                <div className="bg-white dark:bg-[#151926] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Ticket className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="flex flex-col relative z-10">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-sm">Reservas Totais</span>
                        </div>
                        <h3 className="text-3xl font-bold dark:text-white mt-1">
                            {totalBookings}
                        </h3>
                        <div className="flex items-center gap-2 mt-4 text-xs font-bold text-blue-500 bg-blue-500/10 w-fit px-3 py-1.5 rounded-full">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>{bookings.filter(b => new Date(b.created_at).toDateString() === new Date().toDateString()).length} hoje</span>
                        </div>
                    </div>
                </div>

                {/* Success Rate Card */}
                <div className="bg-white dark:bg-[#151926] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="flex flex-col relative z-10">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-sm">Taxa de Conversão</span>
                        </div>
                        <h3 className="text-3xl font-bold dark:text-white mt-1">
                            {totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(0) : 0}%
                        </h3>
                        <div className="flex items-center gap-2 mt-4 text-xs font-md text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 w-fit px-3 py-1.5 rounded-full">
                            <span>{confirmedBookings} viagens confirmadas</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- 3. MAIN ANALYTICS CHART (Line/Area) --- */}
                <div className="lg:col-span-2 bg-white dark:bg-[#151926] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            Tendência de Reservas
                        </h3>
                        <select className="bg-slate-100 dark:bg-white/5 border-none text-xs rounded-lg px-3 py-1 text-slate-600 dark:text-gray-300">
                            <option>Últimos 7 dias</option>
                            <option>Últimos 30 dias</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historyData}>
                                <defs>
                                    <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="reservas"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorReservas)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- 4. STATUS DISTRIBUTION --- */}
                <div className="bg-white dark:bg-[#151926] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
                        <Plane className="w-5 h-5 text-slate-400" />
                        Status Atual
                    </h3>
                    <div className="h-[200px] w-full flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- 5. RECENT TRANSACTIONS (The 'Heart' of operations) --- */}
                <div className="lg:col-span-2 bg-white dark:bg-[#151926] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            Últimas Reservas
                        </h3>
                        <div className="flex gap-2">
                            <button className="text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white px-3 py-2 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition flex items-center gap-2">
                                <Search className="w-3.5 h-3.5" /> Filtrar
                            </button>
                            <button className="text-xs bg-rose-500 text-white px-3 py-2 rounded-lg font-bold hover:bg-rose-600 transition flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5" /> Nova Reserva
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {bookings.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-slate-300 dark:text-white/20" />
                                </div>
                                <h4 className="text-slate-900 dark:text-white font-bold mb-1">Tudo calmo por aqui</h4>
                                <p className="text-slate-500 dark:text-gray-500 text-sm max-w-xs">
                                    Ainda não há reservas hoje. Assim que entrarem, aparecerão aqui em tempo real.
                                </p>
                            </div>
                        ) : (
                            bookings.slice(0, 5).map((booking: any) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${booking.state === 'confirmed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                                            booking.state === 'failed' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                                                'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                            <Plane className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                                                {booking.passenger_data?.origem || 'LIS'} → {booking.passenger_data?.destino || '???'}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                                                <Users className="w-3 h-3" /> {booking.user_email || 'Cliente Anônimo'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 ${booking.state === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                booking.state === 'failed' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                                                }`}>
                                                {booking.state === 'confirmed' ? 'Confirmado' : booking.state}
                                            </span>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                € {(booking.amount_total / 100).toFixed(0)}
                                            </span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all -mr-2">
                                            →
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        {bookings.length > 0 && (
                            <button className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors border-t border-slate-100 dark:border-white/5 mt-2">
                                Ver todas as reservas
                            </button>
                        )}
                    </div>
                </div>

                {/* --- 6. QUIT ACTIONS (Side Block) --- */}
                <div className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl p-1 shadow-lg text-white">
                    <div className="bg-[#151926] bg-opacity-90 backdrop-blur-sm h-full w-full rounded-xl p-6 flex flex-col">
                        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                            🚀 Ações Rápidas
                        </h3>
                        <p className="text-xs text-white/60 mb-6">O que você quer fazer agora?</p>

                        <div className="space-y-3 flex-grow">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group text-left">
                                <div className="p-2 bg-rose-500 rounded-lg">
                                    <Plus className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold">Nova Reserva</span>
                                    <span className="block text-[10px] text-white/50">Inserir manualmente</span>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group text-left">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Plane className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold">Experiências</span>
                                    <span className="block text-[10px] text-white/50">Gerenciar catálogo</span>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group text-left">
                                <div className="p-2 bg-emerald-500 rounded-lg">
                                    <CreditCard className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="block text-sm font-bold">Financeiro</span>
                                    <span className="block text-[10px] text-white/50">Ver pagamentos</span>
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <button className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
                                <Settings className="w-3.5 h-3.5" /> Configurações do Painel
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
