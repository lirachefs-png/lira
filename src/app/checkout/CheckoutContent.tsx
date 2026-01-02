'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { CreditCard, Check, User, ShieldCheck, Plane, ArrowRight, Luggage, Wallet } from 'lucide-react';
import { useRegion } from '@/contexts/RegionContext';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PassengerForm from '@/components/checkout/PassengerForm';
import DuffelPaymentForm from '@/components/checkout/DuffelPaymentForm';
import { AIRLINE_CABIN_IMAGES } from '@/lib/airlineImages';

// --- Validation Schema ---
const identityDocumentSchema = z.object({
    type: z.enum(['passport', 'national_identity_card', 'tax_id']),
    unique_identifier: z.string().min(3, "Document number required"),
    issuing_country_code: z.string().length(2, "Country code required"),
    expires_on: z.string().refine((date) => {
        if (!date) return true; // RG doesn't require expiry
        const d = new Date(date);
        return !isNaN(d.getTime()) && d > new Date();
    }, { message: "Document must not be expired" }).optional()
});

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
        return /^\+[1-9]\d{1,14}$/.test(val);
    }, { message: "Phone must start with + (e.g., +351...)" }).or(z.literal('')),
    identity_documents: z.array(identityDocumentSchema).optional()
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

    // Payment Step
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [validatedPassengers, setValidatedPassengers] = useState<any[]>([]);

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
        console.log('🔍 Checkout: Looking for offer in localStorage...', { offerIdParam, hasSaved: !!saved });

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                console.log('✅ Found stored offer:', parsed.id, 'URL expects:', offerIdParam);

                // Use the stored offer - it's what the user actually selected
                // The URL param might be stale or different, trust localStorage
                setSelectedOffer(parsed);

                // Warn if there's a mismatch but don't reject the offer
                if (offerIdParam && parsed.id !== offerIdParam) {
                    console.warn('⚠️ Offer ID mismatch - using stored offer anyway. Stored:', parsed.id, 'URL:', offerIdParam);
                }
            } catch (e) {
                console.error('❌ Error parsing stored offer', e);
                localStorage.removeItem('selectedOffer');
            }
        } else {
            console.warn('⚠️ No offer in localStorage');
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

            // --- PAY NOW FLOW (Duffel Payments) ---
            // Instead of redirecting to Stripe, show inline payment form
            setValidatedPassengers(data.passengers);
            setShowPaymentForm(true);
            setLoading(false);

        } catch (error: any) {
            setLoading(false);
            alert(`Error: ${error.message}`);
        }
    };

    // Handle successful Duffel payment
    const handlePaymentSuccess = (bookingReference: string, orderId: string) => {
        router.push(`/checkout/success?booking_ref=${bookingReference}&order_id=${orderId}&mode=paid`);
    };

    // Handle payment error
    const handlePaymentError = (error: string) => {
        setShowPaymentForm(false);
        alert(`Payment failed: ${error}`);
    };

    // --- Derived UI Data ---
    // If no offer loaded yet, show loading (useEffect will load from localStorage)
    if (!selectedOffer) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-white flex flex-col items-center justify-center gap-4 transition-colors">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                <p className="text-slate-500 dark:text-gray-400">{labels.checkout.loading_offer}</p>
                <p className="text-xs text-slate-500 dark:text-gray-600 max-w-xs text-center">
                    {labels.checkout.offer_expired} <a href="/search" className="text-rose-500 underline">{labels.checkout.search_again}</a>
                </p>
            </div>
        );
    }

    const airlineName = selectedOffer?.owner?.name || 'Airline';
    const airlineCode = selectedOffer?.owner?.iata_code || 'XX';
    const airlineLogo = selectedOffer?.owner?.logo_symbol_url || selectedOffer?.owner?.logo_lockup_url || null;

    // Flight Details - Global Info (used for fallback or general info)
    const segment = selectedOffer?.slices[0]?.segments[0];
    const originCode = segment?.origin?.iata_code || 'ORG';
    // Get final destination from the last segment of the last slice
    const lastSlice = selectedOffer?.slices[selectedOffer.slices.length - 1];
    const lastSegment = lastSlice?.segments[lastSlice.segments.length - 1];
    const destinationCode = lastSegment?.destination?.iata_code || 'DST';

    // Unused variables removed as they are now calculated per slice in the map loop below
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
    const baseFare = selectedOffer?.base_amount ? parseFloat(selectedOffer.base_amount) : basePrice * 0.7;
    const taxes = basePrice - baseFare;
    const finalTotal = basePrice + servicesTotal;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white relative selection:bg-rose-500/30 transition-colors">

            {/* Seat Map Modal */}
            {showSeatMap && seatMap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    {/* ... (Seat Map Content - Unchanged) ... */}
                    <div className="bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#0B0F19]">
                            <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Plane className="w-4 h-4 text-rose-500" /> {labels.checkout.select_seat_modal_title}</h3>
                            <button onClick={() => setShowSeatMap(false)} className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">{labels.checkout.close}</button>
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
                                                            isAvailable ? 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-slate-300 dark:border-white/10' :
                                                                'bg-slate-100 dark:bg-black/40 text-slate-300 dark:text-gray-700 cursor-not-allowed border border-slate-200 dark:border-white/5'
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
                        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0B0F19] text-center text-xs text-slate-500 dark:text-gray-500">{labels.checkout.front_aircraft}</div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>


            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">{labels.checkout.title}</h1>
                    <div className="px-3 py-1 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-full flex items-center gap-2 text-slate-500 dark:text-gray-300 text-xs font-bold uppercase tracking-wider">{labels.checkout.step}</div>
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Flight Summary - RICH CARD - Kept Dark for visual consistency with image background */}
                            <section
                                className="bg-slate-900 dark:bg-[#151926] border border-slate-200 dark:border-white/10 rounded-2xl p-0 backdrop-blur-md relative overflow-hidden group min-h-[200px] flex flex-col justify-end shadow-2xl"
                                style={{
                                    backgroundImage: `url(${flightImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* ... (Flight Summary Content - Unchanged) ... */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>
                                {selectedOffer?.slices.map((slice: any, index: number) => {
                                    const segment = slice.segments[0];
                                    const lastSegment = slice.segments[slice.segments.length - 1];

                                    // Slice specific details
                                    const sliceOrigin = segment.origin.iata_code;
                                    const sliceDest = lastSegment.destination.iata_code;
                                    const sliceDepTime = new Date(segment.departing_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    const sliceArrTime = new Date(lastSegment.arriving_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    const sliceDate = new Date(segment.departing_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                    const sliceDuration = slice.duration ? slice.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase() : '';
                                    const sliceAirline = segment.operating_carrier.name;
                                    const sliceFlightNum = segment.operating_carrier_flight_number;

                                    return (
                                        <div key={slice.id} className={`relative z-10 p-6 ${index > 0 ? 'border-t border-white/10' : ''}`}>
                                            <div className="flex items-center justify-between text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Plane className="w-4 h-4 text-rose-500" /> {sliceAirline} {sliceFlightNum} • {cabinClass}
                                                </div>
                                                <span className="text-rose-400">{sliceDate}</span>
                                            </div>

                                            {/* ROUTE WITH TIMES */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-rose-400">{sliceDepTime}</div>
                                                    <div className="text-4xl font-black text-white drop-shadow-lg">{sliceOrigin}</div>
                                                </div>

                                                <div className="flex-1 mx-4 flex flex-col items-center">
                                                    <span className="text-xs text-gray-400 mb-1">{sliceDuration}</span>
                                                    {/* Simple visual separator like search results, but keeping clean checkout style */}
                                                    <div className="w-full border-b-2 border-white/20 border-dashed relative">
                                                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#151926] px-2">
                                                            <ArrowRight className="w-4 h-4 text-rose-500" />
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500 mt-1">
                                                        {slice.segments.length > 1 ? `${slice.segments.length - 1} parada(s)` : 'Direto'}
                                                    </span>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-emerald-400">{sliceArrTime}</div>
                                                    <div className="text-4xl font-black text-white drop-shadow-lg">{sliceDest}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Footer with Airline Logo (Global for offer or per slice? Use main carrier) */}
                                <div className="relative z-10 px-6 pb-6 pt-0 flex justify-between items-end">
                                    <div>
                                        <p className="text-gray-300 text-sm font-medium">{selectedOffer?.slices.length > 1 ? 'Múltiplos Trechos' : labels.search_results.direct}</p>
                                        <p className="text-rose-400 text-xs mt-1 font-bold">{labels.checkout.fly_modern} {aircraftName}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-90 overflow-hidden p-1">
                                        {airlineLogo ? (
                                            <img src={airlineLogo} alt={airlineCode} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-black font-black text-xs">{airlineCode}</span>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Dynamic Passenger Forms */}
                            <section>
                                <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-slate-900 dark:text-white">
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
                            <section className="bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6 shadow-sm">
                                {/* Seat Selection */}
                                {seatMap ? (
                                    <div>
                                        <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-900 dark:text-white">
                                            <Plane className="w-5 h-5 text-rose-500" /> {labels.checkout.seat_selection}
                                        </h2>
                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-200 dark:bg-white/5 rounded-lg flex items-center justify-center text-rose-500 font-bold">
                                                    {selectedSeat ? selectedSeat.designator : '?'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{selectedSeat ? `${labels.checkout.seat_selection} ${selectedSeat.designator}` : labels.checkout.no_seat}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => setShowSeatMap(true)} className="px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-lg text-sm font-bold text-slate-800 dark:text-white transition-all">
                                                {selectedSeat ? labels.checkout.change_seat : labels.checkout.select_seat}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-slate-500 dark:text-gray-500 text-sm p-4 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-lg">{labels.checkout.seats_not_available}</div>
                                )}

                                {/* Baggage */}
                                {availableBags.length > 0 && (
                                    <div>
                                        <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-slate-900 dark:text-white">
                                            <Luggage className="w-5 h-5 text-rose-500" /> {labels.checkout.baggage}
                                        </h2>
                                        <div className="space-y-4">
                                            {availableBags.map((bag) => {
                                                const price = parseFloat(bag.total_amount);
                                                const isSelected = selectedServices.includes(bag.id);
                                                return (
                                                    <div key={bag.id}
                                                        onClick={() => handleServiceToggle(bag.id, price, !isSelected)}
                                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 dark:border-rose-500/50' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-rose-500 border-rose-500' : 'border-slate-300 dark:border-white/30'}`}>
                                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">{labels.checkout.checked_bag}</p>
                                                                <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest">{bag.metadata?.sub_type || '23kg'}</p>
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
                            <div className="bg-white dark:bg-[#151926] border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md sticky top-32 shadow-sm transition-colors">
                                <h3 className="text-slate-500 dark:text-gray-400 font-medium mb-4 uppercase text-xs tracking-wider">{labels.checkout.total_due}</h3>

                                {/* PRICE BREAKDOWN */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-gray-400">
                                        <span>{labels.checkout.base_fare}</span>
                                        <span>{formatCurrency(baseFare)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-gray-400">
                                        <span>{labels.checkout.taxes_fees}</span>
                                        <span>{formatCurrency(taxes)}</span>
                                    </div>
                                    {servicesTotal > 0 && (
                                        <div className="flex justify-between items-center text-sm text-rose-500 dark:text-rose-400">
                                            <span>{labels.checkout.extras}</span>
                                            <span>+{formatCurrency(servicesTotal)}</span>
                                        </div>
                                    )}
                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/20 to-transparent my-3"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 dark:text-gray-300">{labels.checkout.total}</span>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">{formatCurrency(finalTotal)}</span>
                                    </div>
                                </div>

                                {/* SECURITY TRUST BAR */}
                                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                                    <div className="flex items-center justify-center gap-3 text-xs text-green-600 dark:text-green-400">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="font-medium">SSL 256-bit</span>
                                        <span className="text-green-500/50">•</span>
                                        <span className="font-medium">PCI-DSS</span>
                                        <span className="text-green-500/50">•</span>
                                        <span className="text-green-600/70 dark:text-green-300/70">{labels.checkout.data_protected}</span>
                                    </div>
                                </div>

                                {/* PAYMENT METHOD TOGGLE */}
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                                    <h4 className="font-bold text-sm text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {labels.checkout.payment_options}</h4>
                                    <div className="flex flex-col gap-2">
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentIntent === 'pay' ? 'bg-blue-100 dark:bg-blue-600/20 border-blue-500' : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                                            <input type="radio" name="intent" value="pay" checked={paymentIntent === 'pay'} onChange={() => setPaymentIntent('pay')} className="accent-blue-500" />
                                            <div className="flex-1"><span className="block font-bold text-sm text-slate-900 dark:text-white">{labels.checkout.pay_now}</span><span className="block text-xs text-blue-600/70 dark:text-blue-200/70">{labels.checkout.instant_desc}</span></div>
                                            <CreditCard className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                        </label>

                                        <div className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all ${!canHold ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5' : (paymentIntent === 'hold' ? 'bg-emerald-100 dark:bg-emerald-600/20 border-emerald-500 cursor-pointer' : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer')}`}>
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
                                                <span className="block font-bold text-sm text-emerald-600 dark:text-emerald-400">{labels.checkout.hold_price}</span>
                                                <span className="block text-xs text-emerald-600/70 dark:text-emerald-200/70">{labels.checkout.hold_desc}</span>
                                                {!canHold && <span className="block text-[10px] text-orange-500 dark:text-orange-400 mt-1">{labels.checkout.promotional_fare_warning}</span>}
                                            </div>
                                            <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                    {paymentIntent === 'hold' && holdExpiresAt && (<p className="mt-2 text-[10px] text-emerald-600/80 dark:text-emerald-400/80 text-center">{labels.checkout.price_guaranteed} {new Date(holdExpiresAt).toLocaleTimeString()}</p>)}
                                </div>

                                {/* Submit Button - only when not in payment mode */}
                                {!showPaymentForm && (
                                    <>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl active:scale-[98%] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${paymentIntent === 'hold' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-[#635BFF] hover:bg-[#5851E1] text-white'}`}
                                        >
                                            {loading ? <span className="animate-spin">⏳</span> : <>{paymentIntent === 'hold' ? labels.checkout.confirm_reservation : labels.checkout.pay_now} <ArrowRight className="w-4 h-4" /></>}
                                        </button>
                                        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-xs text-slate-500 dark:text-gray-500">
                                            <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-green-500" />{labels.checkout.secure_text}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                </FormProvider>

                {/* Payment Form - OUTSIDE the main form to avoid nested form error */}
                {showPaymentForm && paymentIntent === 'pay' && (
                    <div className="mt-8">
                        {/* Premium Payment Section Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{labels.checkout.finalize_payment}</h3>
                                <p className="text-slate-500 dark:text-gray-400 text-sm">{labels.checkout.secure_environment} • {labels.checkout.data_encrypted}</p>
                            </div>
                        </div>

                        {/* Duffel Payment Form */}
                        <DuffelPaymentForm
                            offerId={selectedOffer?.id || ''}
                            amount={finalTotal}
                            currency={selectedOffer?.total_currency || 'EUR'}
                            passengers={validatedPassengers}
                            selectedServices={selectedServices}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
