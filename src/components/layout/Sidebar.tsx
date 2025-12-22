'use client';

import Link from "next/link";
import { LogOut, User, Globe, Moon, Sun, Mic, Plane, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import MayaChat from "@/components/MayaChat";
import { useRegion } from "@/contexts/RegionContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils"; // Ensure you have this utility or use template literals

export default function Sidebar() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const supabase = createClient();
    const { theme, setTheme } = useTheme();
    const { language, currency, setLanguage, setCurrency, labels } = useRegion();
    const [showRegionMenu, setShowRegionMenu] = useState(false);

    // Collapse State
    const { isCollapsed, toggleSidebar } = useSidebar();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-[#0B0F19] border-r border-white/5 text-white overflow-y-auto transition-all duration-300 scrollbar-none",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-8 -right-3 w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center text-white border border-[#0B0F19] hover:bg-rose-500 transition-colors z-[60]"
            >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
            </button>

            {/* Logo Area */}
            <div className={cn("p-8 pb-4 flex items-center transition-all", isCollapsed ? "justify-center px-0" : "")}>
                <Link href="/" className="flex items-center gap-3">
                    {isCollapsed ? (
                        <div className="h-10 w-10 relative">
                            <img src="/logo-icon.png" alt="AllTrip Icon" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="h-12 w-48 relative">
                            <img src="/logo-full.png" alt="AllTrip Logo" className="w-full h-full object-contain object-left" />
                        </div>
                    )}
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {!isCollapsed && <div className="text-[10px] font-bold text-gray-500 px-4 mb-4 tracking-widest uppercase transition-opacity duration-300">Menu Principal</div>}

                <Link href="/" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white font-bold border border-white/5 shadow-sm transition-all hover:bg-white/10 hover:translate-x-1", isCollapsed ? "justify-center px-0" : "")}>
                    <Plane className="w-5 h-5 text-rose-500 shrink-0" />
                    {!isCollapsed && <span>{labels.flights}</span>}
                </Link>

                <Link href="/experiences" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 font-medium transition-all hover:text-white hover:bg-white/5 hover:translate-x-1", isCollapsed ? "justify-center px-0" : "")}>
                    <Map className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{labels.experiences}</span>}
                </Link>

                <div className="pt-4">
                    {!isCollapsed && <div className="text-[10px] font-bold text-gray-500 px-4 mb-4 tracking-widest uppercase transition-opacity duration-300">Ferramentas</div>}
                    {/* Maya - Embedded nicely */}
                    <div className={cn("transition-all", isCollapsed ? "flex justify-center" : "px-4")}>
                        <MayaChat isCollapsed={isCollapsed} />
                    </div>
                </div>

                {/* Admin Links */}
                {user?.email === 'lira.chefs@gmail.com' && (
                    <div className="pt-4">
                        {!isCollapsed && <div className="text-[10px] font-bold text-rose-500/50 px-4 mb-2 tracking-widest uppercase">Admin Zone</div>}

                        <Link href="/admin" className={cn("flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 transition-colors", isCollapsed ? "justify-center" : "")}>
                            {!isCollapsed ? "Dashboard" : "D"}
                        </Link>
                    </div>
                )}
            </nav>

            {/* Bottom Actions (User, Settings) */}
            <div className="p-4 bg-black/20 space-y-4">
                {/* Region Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowRegionMenu(!showRegionMenu)}
                        className={cn("w-full flex items-center rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-medium", isCollapsed ? "justify-center p-2" : "justify-between px-4 py-2")}
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                            {!isCollapsed && <span>{language.toUpperCase()} / {currency}</span>}
                        </div>
                    </button>
                    {showRegionMenu && (
                        <div className={cn("absolute bottom-full mb-2 bg-[#1A1F2E] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-2 z-50", isCollapsed ? "left-full ml-2 w-40" : "left-0 w-full")}>
                            <p className="text-[10px] text-gray-500 px-2 py-1 font-bold">MOEDA</p>
                            <div className="flex gap-1 mb-2">
                                {['EUR', 'USD', 'BRL'].map(curr => (
                                    <button key={curr} onClick={() => { setCurrency(curr as any); setShowRegionMenu(false) }} className={`flex-1 py-1 text-xs rounded ${currency === curr ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                        {curr}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 px-2 py-1 font-bold">IDIOMA</p>
                            <div className="space-y-1">
                                {['pt', 'en', 'es'].map(lang => (
                                    <button key={lang} onClick={() => { setLanguage(lang as any); setShowRegionMenu(false) }} className={`w-full text-left px-2 py-1 text-xs rounded ${language === lang ? 'text-rose-400' : 'text-gray-400 hover:text-white'}`}>
                                        {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={cn("w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm", isCollapsed ? "justify-center" : "")}
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
                    {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                {/* User Profile */}
                <div className="pt-4 border-t border-white/5">
                    {user ? (
                        <div className={cn("flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer", isCollapsed ? "justify-center" : "")}>
                            {user.user_metadata.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} className="w-10 h-10 rounded-full border border-white/10 shrink-0" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            )}
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-bold text-white truncate">{user.user_metadata.full_name || 'Viajante'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <button onClick={handleLogout} className="text-gray-500 hover:text-rose-500 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link href="/auth/signin" className={cn("flex items-center justify-center gap-2 w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-900/20", isCollapsed ? "p-0 h-10 w-10" : "")}>
                            <User className="w-4 h-4 shrink-0" /> {!isCollapsed && "Entrar"}
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    );
}
