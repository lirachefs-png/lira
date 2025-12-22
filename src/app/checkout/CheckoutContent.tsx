'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { CreditCard, Check, User, ShieldCheck, Plane, ArrowRight, Luggage, Wallet } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PassengerForm from '@/components/checkout/PassengerForm';
import MayaChat from '@/components/MayaChat';
import { AIRLINE_CABIN_IMAGES } from '@/lib/airlineImages';

// --- Validation Schema ---
const passengerSchema = z.object({
    id: z.string(),
    type: z.string(),
    title: z.string().optional(),
    given_name: z.string().min(2, "Name required"),
    family_name: z.string().min(2, "Last name required"),
    gender: z.string(),
    born_on: z.string().refine((date) => {
        const d = new Date(date);
        return !isNaN(d.getTime()) && d <= new Date();
    }, { message: "Date must be in the past" }),
    email: z.string().optional().or(z.literal('')),
    phone_number: z.string().optional().refine((val) => {
        if (!val) return true;
        // Basic E.164 check: starts with +, followed by digits
        return /^\+[1-9]\d{1,14}$/.test(val);
    }, { message: "Phone must start with + (e.g., +351...)" }).or(z.literal(''))
}).superRefine((data, ctx) => {
    if (data.type === 'adult') {
        if (!data.email || !z.string().email().safeParse(data.email).success) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Email is required for adults",
                path: ["email"]
            });
        }
        if (!data.phone_number) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phone required for primary passenger",
                path: ["phone_number"]
            });
        }
    }
});

const checkoutSchema = z.object({
    passengers: z.array(passengerSchema),
    services: z.array(z.string()).optional() // selected service IDs
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const offerIdParam = searchParams.get('offerId');
    const { labels, language } = useRegion();

    // Dynamic Offer State
    const [selectedOffer, setSelectedOffer] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // --- Data Handlers ---
    const formatCurrency = (amount: number, currency: string = 'EUR') => {
        const locale = language === 'pt' ? 'pt-BR' : (language === 'es' ? 'es-ES' : 'en-US');
        return amount.toLocaleString(locale, { style: 'currency', currency: currency });
    };

    // Services & Offer Data
    const [offerPassengers, setOfferPassengers] = useState<any[]>([]);
    const [availableBags, setAvailableBags] = useState<any[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [servicesTotal, setServicesTotal] = useState(0);

    // Hold Order
    const [canHold, setCanHold] = useState(false);
    const [paymentIntent, setPaymentIntent] = useState<'pay' | 'hold'>('pay');
    const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);

    // Seats
    const [seatMap, setSeatMap] = useState<any>(null);
    const [selectedSeat, setSelectedSeat] = useState<{ id: string, designator: string, price: number } | null>(null);
    const [showSeatMap, setShowSeatMap] = useState(false);

    // --- Form Setup ---
    const methods = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            passengers: []
        }
    });

    const { control, handleSubmit, reset } = methods;
    const { fields } = useFieldArray({
        control,
        name: "passengers"
    });

    // --- 1. Load Offer from localStorage ---
    useEffect(() => {
        const saved = localStorage.getItem('selectedOffer');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure the stored offer matches the current URL offerId
                if (offerIdParam && parsed.id === offerIdParam) {
                    setSelectedOffer(parsed);
                } else {
                    console.warn("Stored offer ID mismatch. Clearing legacy data.");
                    localStorage.removeItem('selectedOffer');
                    setSelectedOffer(null);
                }
            } catch (e) {
                console.error("Error parsing stored offer", e);
                localStorage.removeItem('selectedOffer');
            }
        }
    }, [offerIdParam]);

    // --- 2. Fetch Services & Metadata ---
    useEffect(() => {
        if (!offerIdParam) return;

        const fetchData = async () => {
            try {
                // Get Services & Offer Details
                const res = await fetch(`/api/services?offer_id=${offerIdParam}`);
                const data = await res.json();

                if (data.baggage) setAvailableBags(data.baggage);
                if (data.passengers) {
                    setOfferPassengers(data.passengers);

                    const initialPassengers = data.passengers.map((p: any) => ({
                        id: p.id,
                        type: p.type,
                        title: 'mr',
                        given_name: '',
                        family_name: '',
                        gender: 'm',
                        born_on: '',
                        email: '',
                        phone_number: ''
                    }));
                    reset({ passengers: initialPassengers });
                }

                if (data.payment_requirements) {
                    const requiresInstant = data.payment_requirements.requires_instant_payment;
                    setCanHold(!requiresInstant);

                    if (data.payment_requirements.price_guarantee_expires_at) {
                        setHoldExpiresAt(data.payment_requirements.price_guarantee_expires_at);
                    }

                    // Force pay if hold not allowed
                    if (requiresInstant) {
                        setPaymentIntent('pay');
                    }
                }

                // Get Seats
                const resSeats = await fetch(`/api/seats?offer_id=${offerIdParam}`);
                if (resSeats.ok) {
                    const seatData = await resSeats.json();
                    setSeatMap(seatData);
                }

            } catch (err) { console.error(err); }
        };

        fetchData();
    }, [offerIdParam, reset]);


    // --- Handlers ---
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
        const newSeat = {
            id: element.available_services[0].id,
            designator: element.designator,
            price: parseFloat(element.available_services[0].total_amount)
        };

        let currentTotal = servicesTotal;
        let currentServices = [...selectedServices];

        if (selectedSeat) {
            currentTotal -= selectedSeat.price;
            currentServices = currentServices.filter(id => id !== selectedSeat.id);
        }

        currentTotal += newSeat.price;
        currentServices.push(newSeat.id);

        setServicesTotal(currentTotal);
        setSelectedServices(currentServices);
        setSelectedSeat(newSeat);
        setShowSeatMap(false);
    };

    const onSubmit = async (data: CheckoutFormValues) => {
        setLoading(true);

        try {
            if (!offerIdParam) throw new Error('Offer ID missing');

            // --- HOLD PRICE FLOW ---
            if (paymentIntent === 'hold') {
                if (!canHold) {
                    alert('Hold Price is not available for this flight.');
                    setLoading(false);
                    return;
                }
                const res = await fetch('/api/hold-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        offerId: offerIdParam,
                        passengers: data.passengers,
                        selectedServices: selectedServices.map(id => ({ id }))
                    })
                });

                const resData = await res.json();
                if (resData.success) {
                    router.push(`/checkout/success?booking_ref=${resData.booking_reference}&mode=hold&expires=${encodeURIComponent(resData.expiresAt)}`);
                } else {
                    alert(`Não foi possível reservar: ${resData.error}`);
                    setLoading(false);
                }
                return;
            }

            // --- PAY NOW FLOW (Stripe) ---
            const baseAmount = selectedOffer ? parseFloat(selectedOffer.total_amount) : 0;
            const payload = {
                offerId: offerIdParam,
                price: baseAmount,
                servicesTotal,
                currency: selectedOffer?.total_currency || 'EUR',
                destination: selectedOffer?.slices[0].destination.iata_code,
                originUrl: window.location.origin,
                passengers: data.passengers,
                selectedServices: selectedServices.map(id => ({ id })),
                intent: 'pay'
            };

            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await res.text();
            let resData: any = {};
            try { resData = text ? JSON.parse(text) : {}; } catch { resData = { error: text }; }

            if (resData?.url) {
                window.location.href = resData.url;
            } else {
                alert(`Checkout failed: ${resData?.error || 'Unknown error'}`);
                setLoading(false);
            }
        } catch (error: any) {
            setLoading(false);
            alert(`Error: ${error.message}`);
        }
    };

    // --- Derived UI Data ---
    if (!selectedOffer && !offerIdParam) return <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">Loading Offer...</div>;

    const airlineName = selectedOffer?.owner?.name || 'Airline';
    const airlineCode = selectedOffer?.owner?.iata_code || 'XX';
    const airlineLogo = selectedOffer?.owner?.logo_symbol_url || selectedOffer?.owner?.logo_lockup_url || null;

    // Flight Details
    const segment = selectedOffer?.slices[0]?.segments[0];
    const originCode = segment?.origin?.iata_code || 'ORG';
    const destinationCode = segment?.destination?.iata_code || 'DST';
    const aircraftName = segment?.aircraft?.name || 'Aeronave Moderna';
    const cabinClass = selectedOffer?.slices[0]?.fare_brand_name || (offerPassengers[0]?.cabin_class || 'economy');

    // Image logic
    const getFlightImage = () => {
        if (!selectedOffer) return AIRLINE_CABIN_IMAGES['economy_generic'];
        const type = offerPassengers[0]?.type || 'adult';
        return AIRLINE_CABIN_IMAGES[`${airlineCode}_${cabinClass}`] || AIRLINE_CABIN_IMAGES['economy_generic'];
    };
    const flightImage = getFlightImage();

    const basePrice = selectedOffer ? parseFloat(selectedOffer.total_amount) : 0;
    const finalTotal = basePrice + servicesTotal;

    // Maya Context
    const mayaContext = `O cliente está no checkout voando com a ${airlineName} (${aircraftName}) de ${originCode} para ${destinationCode}. Classe: ${cabinClass}. Valor total: ${formatCurrency(finalTotal)}. Dê uma dica curta e luxuosa. Se ele demorar, sugira o 'Hold Price' para garantir o valor.`;

    return (
        <main className="min-h-screen bg-[#0B0F19] text-white relative selection:bg-rose-500/30">
            {/* Proactive Maya */}
            <MayaChat isCollapsed={true} contextPrompt={mayaContext} />

            {/* Seat Map Modal */}
            {showSeatMap && seatMap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    {/* ... (Seat Map Content - Unchanged) ... */}
                    <div className="bg-[#151926] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0B0F19]">
                            <h3 className="font-bold flex items-center gap-2"><Plane className="w-4 h-4 text-rose-500" /> Select Seat</h3>
                            <button onClick={() => setShowSeatMap(false)} className="text-gray-400 hover:text-white">Close</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-2">
                            <div className="flex flex-col items-center gap-2">
                                {seatMap.cabins[0].rows.map((row: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-center">
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
                                            } else { return <div key={j} className="w-4"></div>; }
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-[#0B0F19] text-center text-xs text-gray-500">Front of Aircraft ▲</div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-black">{labels.checkout.title}</h1>
                    <div className="px-3 py-1 bg-white/10 border border-white/20 rounded-full flex items-center gap-2 text-gray-300 text-xs font-bold uppercase tracking-wider">{labels.checkout.step}</div>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Flight Summary - RICH CARD */}
                            <section
                                className="bg-[#151926] border border-white/10 rounded-2xl p-0 backdrop-blur-md relative overflow-hidden group min-h-[200px] flex flex-col justify-end shadow-2xl"
                                style={{
                                    backgroundImage: `url(${flightImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* ... (Flight Summary Content - Unchanged) ... */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>
                                <div className="relative z-10 p-6">
                                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                                        <Plane className="w-4 h-4 text-rose-500" /> {airlineName} • {cabinClass}
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-4xl font-black text-white drop-shadow-lg">{originCode}</div>
                                        <div className="flex-1 border-b-2 border-white/20 mx-4 relative top-1 border-dashed"></div>
                                        <div className="text-4xl font-black text-white drop-shadow-lg">{destinationCode}</div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-gray-300 text-sm font-medium">{labels.search_results.direct}</p>
                                            <p className="text-rose-400 text-xs mt-1 font-bold">Voe no moderno {aircraftName}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-90 overflow-hidden p-1">
                                            {airlineLogo ? (
                                                <img src={airlineLogo} alt={airlineCode} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-black font-black text-xs">{airlineCode}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Dynamic Passenger Forms */}
                            <section>
                                <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
                                    <User className="w-5 h-5 text-rose-500" /> {labels.checkout.passenger_details}
                                </h2>

                                {/* Dynamic Fields */}
                                {fields.map((field, index) => (
                                    <PassengerForm
                                        key={field.id}
                                        passengerIndex={index}
                                        passengerId={offerPassengers[index]?.id}
                                        type={offerPassengers[index]?.type || 'adult'}
                                    />
                                ))}
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
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => setShowSeatMap(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all">
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
                                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-rose-500/10 border-rose-500/50' : 'bg-black/20 border-white/10 hover:border-white/20'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-500 border-rose-500' : 'border-white/30'}`}>
                                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white">{labels.checkout.checked_bag}</p>
                                                                <p className="text-xs text-gray-400 uppercase tracking-widest">{bag.metadata?.sub_type || '23kg'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="font-mono font-bold text-rose-500">+{formatCurrency(price)}</div>
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
                                    <div className="flex justify-between items-center text-sm text-gray-400"><span>{labels.checkout.flight_fare}</span><span>{formatCurrency(basePrice)}</span></div>
                                    {servicesTotal > 0 && (<div className="flex justify-between items-center text-sm text-rose-400"><span>{labels.checkout.extras}</span><span>+{formatCurrency(servicesTotal)}</span></div>)}
                                    <div className="w-full h-[1px] bg-white/10 my-2"></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-300">Total</span><span className="text-4xl font-black text-white">{formatCurrency(finalTotal)}</span></div>
                                </div>

                                {/* PAYMENT METHOD TOGGLE */}
                                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <h4 className="font-bold text-sm text-blue-200 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Payment Options</h4>
                                    <div className="flex flex-col gap-2">
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentIntent === 'pay' ? 'bg-blue-600/20 border-blue-500' : 'border-white/10 hover:bg-white/5'}`}>
                                            <input type="radio" name="intent" value="pay" checked={paymentIntent === 'pay'} onChange={() => setPaymentIntent('pay')} className="accent-blue-500" />
                                            <div className="flex-1"><span className="block font-bold text-sm text-white">{labels.checkout.pay_now}</span><span className="block text-xs text-blue-200/70">{labels.checkout.instant_desc}</span></div>
                                            <CreditCard className="w-4 h-4 text-blue-400" />
                                        </label>

                                        <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${!canHold ? 'opacity-50 cursor-not-allowed border-white/5 bg-white/5' : (paymentIntent === 'hold' ? 'bg-emerald-600/20 border-emerald-500 cursor-pointer' : 'border-white/10 hover:bg-white/5 cursor-pointer')}`}>
                                            <input
                                                type="radio"
                                                name="intent"
                                                value="hold"
                                                checked={paymentIntent === 'hold'}
                                                onChange={() => canHold && setPaymentIntent('hold')}
                                                disabled={!canHold}
                                                className="accent-emerald-500"
                                            />
                                            <div className="flex-1">
                                                <span className="block font-bold text-sm text-emerald-400">{labels.checkout.hold_price}</span>
                                                <span className="block text-xs text-emerald-200/70">{labels.checkout.hold_desc}</span>
                                                {!canHold && <span className="block text-[10px] text-orange-400 mt-1">⚠️ Esta tarifa promocional exige pagamento imediato</span>}
                                            </div>
                                            <Wallet className="w-4 h-4 text-emerald-400" />
                                        </div>
                                    </div>
                                    {paymentIntent === 'hold' && holdExpiresAt && (<p className="mt-2 text-[10px] text-emerald-400/80 text-center">{labels.checkout.price_guaranteed} {new Date(holdExpiresAt).toLocaleTimeString()}</p>)}
                                </div>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl active:scale-[98%] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${paymentIntent === 'hold' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-[#635BFF] hover:bg-[#5851E1]'}`}
                                >
                                    {loading ? <span className="animate-spin">⏳</span> : <>{paymentIntent === 'hold' ? labels.checkout.confirm_reservation : labels.checkout.pay_now} <ArrowRight className="w-4 h-4" /></>}
                                </button>
                                <div className="mt-4 flex flex-col items-center justify-center gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500" />{labels.checkout.secure_text}</div>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </main>
    );
}
