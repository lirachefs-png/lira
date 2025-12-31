'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

export default function Footer() {
    const { labels } = useRegion();

    return (
        <footer className="bg-slate-50 dark:bg-[#151926] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-white/5 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Logo Section */}
                <div className="flex justify-center mb-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <img
                            src="/images/alltrip-logo.png"
                            alt="AllTrip"
                            className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Main Grid: Simplified */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Column 1: Navigation */}
                    <div className="space-y-6">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">{labels.footer.navigation}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.flights}</Link></li>
                            <li><Link href="/experiences" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.experiences}</Link></li>
                            <li><Link href="/my-trips" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.my_trips}</Link></li>
                        </ul>
                    </div>

                    {/* Column 2: Support */}
                    <div className="space-y-6">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">{labels.footer.support}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.help_center}</Link></li>
                            <li><Link href="/help#faq" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.faq}</Link></li>
                            <li><Link href="/contact" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div className="space-y-6">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">{labels.footer.legal}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/legal/privacy" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.privacy}</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.terms}</Link></li>
                            <li><Link href="/legal/cookies" className="hover:text-rose-500 dark:hover:text-white transition-colors">{labels.footer.cookies}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Subscribe Section */}
                <div className="border-t border-slate-200 dark:border-white/5 pt-12 pb-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-2">{labels.footer.subscribe_title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{labels.footer.subscribe_desc}</p>
                        </div>
                        <div className="w-full md:w-auto flex gap-2">
                            <input
                                type="email"
                                placeholder={labels.footer.email_placeholder}
                                className="bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-rose-500 w-full md:w-80 transition-colors"
                            />
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold px-6 py-3 rounded-lg hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white transition-colors shadow-lg">
                                {labels.footer.subscribe_btn}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Apps + Socials */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 dark:border-white/5 pt-12">

                    {/* App Stores */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white mb-2">{labels.footer.app_title}</span>
                            <div className="flex gap-2">
                                <button className="bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-white/5 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-6" />
                                </button>
                                <button className="bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-white/5 transition-colors">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-xs font-bold text-slate-900 dark:text-white mb-2">{labels.footer.connect_title}</span>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400 rounded-full hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400 rounded-full hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400 rounded-full hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400 rounded-full hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-colors"><Youtube className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2 bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-gray-400 rounded-full hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
                        </div>
                    </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="mt-12 border-t border-slate-200 dark:border-white/5 pt-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                            {labels.footer.disclaimer}
                            <Link href="/legal/about" className="text-rose-500 hover:text-rose-600 ml-1 underline underline-offset-2">
                                {labels.footer.learn_more}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-600">
                    <div className="mb-4 flex justify-center gap-4">
                        {/* Links moved to main grid */}
                    </div>
                    <p>{labels.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
