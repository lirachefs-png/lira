'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { CreditCard, Check, User, ShieldCheck, Plane, ArrowRight, Luggage } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';

export default function CheckoutContent() {
    const searchParams = useSearchParams();
    const offerId = searchParams.get('offerId');
    const priceStr = searchParams.get('price');
    const destination = searchParams.get('destination');
    const { labels, language } = useRegion();

    // Parse base price
    const basePrice = parseFloat(priceStr?.replace(/[^0-9.]/g, '') || '0');

    const [loading, setLoading] = useState(false);

    // Helper: Format Currency
    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        const locale = language === 'pt' ? 'pt-BR' : (language === 'es' ? 'es-ES' : 'en-US');
        return amount.toLocaleString(locale, { style: 'currency', currency: currency });
    };

    // Passenger State
    const [passenger, setPassenger] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '', // YYYY-MM-DD
        gender: 'm' // m or f
    });

    // Services State
    const [availableBags, setAvailableBags] = useState<any[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [servicesTotal, setServicesTotal] = useState(0);

    // Seat State
    const [seatMap, setSeatMap] = useState<any>(null);
    const [selectedSeat, setSelectedSeat] = useState<{ id: string, designator: string, price: number } | null>(null);
    const [showSeatMap, setShowSeatMap] = useState(false);

    // Fetch Services & Seats on Load
    useEffect(() => {
        if (!offerId) return;

        const fetchServices = async () => {
            try {
                const res = await fetch(`/api/services?offer_id=${offerId}`);
                const data = await res.json();
                if (data.baggage) setAvailableBags(data.baggage);
            } catch (err) { console.error(err); }
        };

        const fetchSeats = async () => {
            try {
                const res = await fetch(`/api/seats?offer_id=${offerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSeatMap(data);
                }
            } catch (err) { console.error(err); }
        };

        fetchServices();
        fetchSeats();
    }, [offerId]);

    const handleServiceToggle = (serviceId: string, price: number, isSelected: boolean) => {
        if (isSelected) {
            setSelectedServices(prev => [...prev, serviceId]);
            setServicesTotal(prev => prev + price);
        } else {
            setSelectedServices(prev => prev.filter(id => id !== serviceId));
            setServicesTotal(prev => prev - price);
        }
    };

    const handleSeatSelect = (element: any) => {
        // Prepare new seat
        const newSeat = {
            id: element.available_services[0].id,
            designator: element.designator,
            price: parseFloat(element.available_services[0].total_amount)
        };

        // Remove old seat from totals if exists
        let currentTotal = servicesTotal;
        let currentServices = [...selectedServices];

        if (selectedSeat) {
            currentTotal -= selectedSeat.price;
            currentServices = currentServices.filter(id => id !== selectedSeat.id);
        }

        // Add new seat
        currentTotal += newSeat.price;
        currentServices.push(newSeat.id);

        setServicesTotal(currentTotal);
        setSelectedServices(currentServices);
        setSelectedSeat(newSeat);
        setShowSeatMap(false); // Close modal
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPassenger({ ...passenger, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        // Basic Validation
        if (!passenger.firstName || !passenger.lastName || !passenger.email || !passenger.dob) {
            alert("Please fill in all passenger details.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offerId,
                    price: basePrice,
                    servicesTotal, // Send services total separately
                    currency: 'eur',
                    destination,
                    originUrl: window.location.origin,
                    passenger,
                    selectedServices
                })
            });

            const text = await res.text();
            let data: any = {};
            try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }

            if (data?.url) {
                window.location.href = data.url;
            } else {
                alert(`Checkout failed: ${data?.error}`);
                setLoading(false);
            }
        } catch (error: any) {
            setLoading(false);
            alert(`Error: ${error.message}`);
        }
    };

    const finalTotal = basePrice + servicesTotal;

    return (
        <main className="min-h-screen bg-[#0B0F19] text-white relative selection:bg-rose-500/30">
            {/* Seat Map Modal */}
            {showSeatMap && seatMap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#151926] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0F19]">
                            <h3 className="font-bold flex items-center gap-2"><Plane className="w-4 h-4 text-rose-500" /> Select Seat</h3>
                            <button onClick={() => setShowSeatMap(false)} className="text-gray-400 hover:text-white">Close</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-2">
                            <div className="flex flex-col items-center gap-2">
                                {/* Wing/Fuselage visual could go here */}
                                {seatMap.cabins[0].rows.map((row: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        {/* Row Elements */}
                                        {row.sections[0].elements.map((el: any, j: number) => {
                                            if (el.type === 'seat') {
                                                const isAvailable = el.available_services && el.available_services.length > 0;
                                                const isSelected = selectedSeat?.designator === el.designator;

                                                return (
                                                    <button
                                                        key={j}
                                                        disabled={!isAvailable}
                                                        onClick={() => handleSeatSelect(el)}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${isSelected ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' :
                                                            isAvailable ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10' :
                                                                'bg-black/40 text-gray-700 cursor-not-allowed border border-white/5'
                                                            }`}
                                                    >
                                                        {el.designator}
                                                    </button>
                                                );
                                            } else {
                                                // Aisle
                                                return <div key={j} className="w-4"></div>;
                                            }
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-[#0B0F19] text-center text-xs text-gray-500">
                            Front of Aircraft ▲
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-black">{labels.checkout.title}</h1>
                    <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-full flex items-center gap-2 text-gray-300 text-xs font-bold uppercase tracking-wider">
                        {labels.checkout.step}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Fight Summary Card */}
                        <section className="bg-[#151926] border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Plane className="w-40 h-40 text-white transform rotate-12" />
                            </div>

                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6 relative z-10">
                                <Plane className="w-5 h-5 text-rose-500" /> {labels.checkout.flight_details}
                            </h2>

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-black">LIS</div>
                                    <ArrowRight className="text-gray-500" />
                                    <div className="text-2xl font-black">{destination || 'DST'}</div>
                                </div>
                                <p className="text-gray-400 text-sm">{labels.common.one_way} • {labels.common.economy} • {labels.search_results.direct}</p>
                            </div>
                        </section>

                        {/* Passenger Details Form */}
                        <section className="bg-[#151926] border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                                <User className="w-5 h-5 text-rose-500" /> {labels.checkout.passenger_details}
                            </h2>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase">{labels.checkout.first_name}</label>
                                        <input
                                            name="firstName"
                                            value={passenger.firstName}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase">{labels.checkout.last_name}</label>
                                        <input
                                            name="lastName"
                                            value={passenger.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase">{labels.checkout.dob}</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={passenger.dob}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase">{labels.checkout.gender}</label>
                                        <select
                                            name="gender"
                                            value={passenger.gender}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors [&>option]:bg-[#151926]"
                                        >
                                            <option value="m">Male</option>
                                            <option value="f">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">{labels.checkout.email}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={passenger.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase">{labels.checkout.phone}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={passenger.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 555 000 0000"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Extra Services: Baggage & Seats */}
                        <section className="bg-[#151926] border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
                            {/* Seat Selection */}
                            {seatMap ? (
                                <div>
                                    <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                                        <Plane className="w-5 h-5 text-rose-500" /> {labels.checkout.seat_selection}
                                    </h2>
                                    <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-rose-500 font-bold">
                                                {selectedSeat ? selectedSeat.designator : '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{selectedSeat ? `${labels.checkout.seat_selection} ${selectedSeat.designator}` : labels.checkout.no_seat}</p>
                                                <p className="text-xs text-gray-500">{selectedSeat ? labels.common.economy : labels.checkout.select_seat}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowSeatMap(true)}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all"
                                        >
                                            {selectedSeat ? labels.checkout.change_seat : labels.checkout.select_seat}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm p-4 text-center border border-dashed border-white/10 rounded-lg">Seats not available for this flight.</div>
                            )}

                            {/* Baggage */}
                            {availableBags.length > 0 && (
                                <div>
                                    <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                                        <Luggage className="w-5 h-5 text-rose-500" /> {labels.checkout.baggage}
                                    </h2>
                                    <div className="space-y-4">
                                        {availableBags.map((bag) => {
                                            const price = parseFloat(bag.total_amount);
                                            const isSelected = selectedServices.includes(bag.id);
                                            return (
                                                <div key={bag.id}
                                                    onClick={() => handleServiceToggle(bag.id, price, !isSelected)}
                                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                                        ? 'bg-rose-500/10 border-rose-500/50'
                                                        : 'bg-black/20 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-500 border-rose-500' : 'border-white/30'
                                                            }`}>
                                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white">{labels.checkout.checked_bag}</p>
                                                            <p className="text-xs text-gray-400 uppercase tracking-widest">{bag.metadata?.sub_type || '23kg'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="font-mono font-bold text-rose-500">
                                                        +{price} {bag.total_currency}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-[#151926] border border-white/10 rounded-2xl p-6 backdrop-blur-md sticky top-32">
                            <h3 className="text-gray-400 font-medium mb-4 uppercase text-xs tracking-wider">{labels.checkout.total_due}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                    <span>{labels.checkout.flight_fare}</span>
                                    <span>{formatCurrency(basePrice)}</span>
                                </div>
                                {servicesTotal > 0 && (
                                    <div className="flex justify-between items-center text-sm text-rose-400">
                                        <span>{labels.checkout.extras}</span>
                                        <span>+{formatCurrency(servicesTotal)}</span>
                                    </div>
                                )}
                                <div className="w-full h-[1px] bg-white/10 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Total</span>
                                    <span className="text-4xl font-black text-white">{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>


                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full py-4 bg-[#635BFF] hover:bg-[#5851E1] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#635BFF]/20 active:scale-[98%] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? labels.checkout.redirecting : labels.checkout.pay_button} <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="mt-4 flex flex-col items-center justify-center gap-2 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-green-500" />
                                    {labels.checkout.secure_text}
                                </div>
                                <div className="flex gap-2 opacity-50">
                                    {/* Simple CSS-only card visuals or just text icons if no SVGs available */}
                                    <div className="h-4 w-6 bg-white/20 rounded-sm"></div>
                                    <div className="h-4 w-6 bg-white/20 rounded-sm"></div>
                                    <div className="h-4 w-6 bg-white/20 rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
