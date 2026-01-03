'use client';

import Link from "next/link";
import { Globe, Moon, Sun, Plane, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRegion } from "@/contexts/RegionContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const { theme, setTheme } = useTheme();
    const { language, currency, setLanguage, setCurrency, labels } = useRegion();
    const [showRegionMenu, setShowRegionMenu] = useState(false);
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-white/5 text-slate-900 dark:text-white overflow-y-auto transition-all duration-300 scrollbar-none shadow-xl dark:shadow-none",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-8 -right-3 w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-[#0B0F19] hover:bg-rose-500 transition-colors z-[60] shadow-md"
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
                            <img src="/logo-full.png" alt="AllTrip Logo" className="w-full h-full object-contain object-left dark:brightness-100 brightness-0" />
                        </div>
                    )}
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {!isCollapsed && <div className="text-[10px] font-bold text-slate-400 dark:text-gray-500 px-4 mb-4 tracking-widest uppercase transition-opacity duration-300">Menu Principal</div>}

                <Link href="/" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl font-bold border shadow-sm transition-all hover:translate-x-1",
                    "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10",
                    isCollapsed ? "justify-center px-0" : "")}>
                    <Plane className="w-5 h-5 text-rose-500 shrink-0" />
                    {!isCollapsed && <span>{labels.flights}</span>}
                </Link>

                <Link href="/experiences" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:translate-x-1",
                    "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
                    isCollapsed ? "justify-center px-0" : "")}>
                    <Map className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>{labels.experiences}</span>}
                </Link>

                <div className="pt-4">
                    {!isCollapsed && <div className="text-[10px] font-bold text-slate-400 dark:text-gray-500 px-4 mb-4 tracking-widest uppercase transition-opacity duration-300">Ferramentas</div>}
                    <Link href="/guide" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all hover:translate-x-1",
                        "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
                        isCollapsed ? "justify-center px-0" : "")}>
                        <Globe className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span>Guia de Viagens</span>}
                    </Link>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-50 dark:bg-black/20 space-y-4 border-t border-slate-200 dark:border-none">
                {/* Region Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowRegionMenu(!showRegionMenu)}
                        className={cn("w-full flex items-center rounded-lg border transition-colors text-sm font-medium",
                            "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-gray-200",
                            isCollapsed ? "justify-center p-2" : "justify-between px-4 py-2")}
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-400 dark:text-gray-400 shrink-0" />
                            {!isCollapsed && <span>{language.toUpperCase()} / {currency}</span>}
                        </div>
                    </button>
                    {showRegionMenu && (
                        <div className={cn("absolute bottom-full mb-2 border rounded-xl overflow-hidden shadow-2xl p-2 z-50",
                            "bg-white dark:bg-[#1A1F2E] border-slate-200 dark:border-white/10",
                            isCollapsed ? "left-full ml-2 w-40" : "left-0 w-full")}>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500 px-2 py-1 font-bold">MOEDA</p>
                            <div className="flex gap-1 mb-2">
                                {['EUR', 'USD', 'BRL'].map(curr => (
                                    <button key={curr} onClick={() => { setCurrency(curr as any); setShowRegionMenu(false) }}
                                        className={`flex-1 py-1 text-xs rounded transition-colors ${currency === curr ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
                                        {curr}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500 px-2 py-1 font-bold">IDIOMA</p>
                            <div className="space-y-1">
                                {['pt', 'en', 'es'].map(lang => (
                                    <button key={lang} onClick={() => { setLanguage(lang as any); setShowRegionMenu(false) }}
                                        className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${language === lang ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}>
                                        {lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={cn("w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                            "text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5", isCollapsed ? "justify-center" : "")}
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
                        {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                    </button>
                )}
            </div>
        </aside>
    );
}
