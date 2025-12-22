'use client';

import { useFormContext } from 'react-hook-form';
import { User, Baby, Calendar, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PassengerFormProps {
    passengerIndex: number;
    passengerId: string;
    type: string; // 'adult', 'child', 'infant_without_seat'
}

// Type for individual field error
interface FieldError {
    message?: string;
}

// Type for passenger errors object
interface PassengerFieldErrors {
    given_name?: FieldError;
    family_name?: FieldError;
    born_on?: FieldError;
    email?: FieldError;
    phone_number?: FieldError;
}

export default function PassengerForm({ passengerIndex, passengerId, type }: PassengerFormProps) {
    const { register, formState: { errors } } = useFormContext();
    const [isOpen, setIsOpen] = useState(true);

    const isAdult = type === 'adult';
    const label = isAdult ? `Adult ${passengerIndex + 1}` : (type === 'child' ? `Child ${passengerIndex + 1}` : `Infant ${passengerIndex + 1}`);
    const icon = isAdult ? <User className="w-5 h-5 text-rose-500" /> : <Baby className="w-5 h-5 text-rose-500" />;

    // Access nested errors - properly typed for FieldArray
    const passengersErrors = errors.passengers as Record<number, PassengerFieldErrors> | undefined;
    const passengerErrors = passengersErrors?.[passengerIndex];

    return (
        <div className="bg-[#151926] border border-white/10 rounded-2xl overflow-hidden mb-4 transition-all">
            {/* Header / Toggle */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-bold text-lg">{label}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                        {type.replace(/_/g, ' ')}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            {/* Form Fields */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-6 border-t border-white/10"
                    >
                        <div className="grid gap-4">
                            {/* Hidden ID Field */}
                            <input type="hidden" {...register(`passengers.${passengerIndex}.id`)} value={passengerId} />
                            <input type="hidden" {...register(`passengers.${passengerIndex}.type`)} value={type} />

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Title (Adults Only) */}
                                {isAdult && (
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs text-slate-400 font-bold uppercase">Title</label>
                                        <select
                                            {...register(`passengers.${passengerIndex}.title`)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors [&>option]:bg-[#151926]"
                                        >
                                            <option value="mr">Mr.</option>
                                            <option value="mrs">Mrs.</option>
                                            <option value="ms">Ms.</option>
                                            <option value="dr">Dr.</option>
                                        </select>
                                    </div>
                                )}

                                {/* Gender */}
                                <div className={`space-y-1 ${isAdult ? 'md:col-span-2' : 'md:col-span-3'}`}>
                                    <label className="text-xs text-slate-400 font-bold uppercase">Gender</label>
                                    <select
                                        {...register(`passengers.${passengerIndex}.gender`)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors [&>option]:bg-[#151926]"
                                    >
                                        <option value="m">Male</option>
                                        <option value="f">Female</option>
                                    </select>
                                </div>

                                {/* Names */}
                                <div className={`space-y-1 ${isAdult ? 'md:col-span-4' : 'md:col-span-4'}`}>
                                    <label className="text-xs text-slate-400 font-bold uppercase">First Name</label>
                                    <input
                                        {...register(`passengers.${passengerIndex}.given_name`)}
                                        placeholder="John"
                                        className={`w-full bg-black/20 border rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors ${passengerErrors?.given_name ? 'border-red-500/50' : 'border-white/10'}`}
                                    />
                                    {passengerErrors?.given_name && <p className="text-red-400 text-xs mt-1">{passengerErrors.given_name.message}</p>}
                                </div>

                                <div className={`space-y-1 ${isAdult ? 'md:col-span-4' : 'md:col-span-5'}`}>
                                    <label className="text-xs text-slate-400 font-bold uppercase">Last Name</label>
                                    <input
                                        {...register(`passengers.${passengerIndex}.family_name`)}
                                        placeholder="Doe"
                                        className={`w-full bg-black/20 border rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors ${passengerErrors?.family_name ? 'border-red-500/50' : 'border-white/10'}`}
                                    />
                                    {passengerErrors?.family_name && <p className="text-red-400 text-xs mt-1">{passengerErrors.family_name.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* DOB */}
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        {...register(`passengers.${passengerIndex}.born_on`)}
                                        className={`w-full bg-black/20 border rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors [color-scheme:dark] ${passengerErrors?.born_on ? 'border-red-500/50' : 'border-white/10'}`}
                                    />
                                    {passengerErrors?.born_on && <p className="text-red-400 text-xs mt-1">{passengerErrors.born_on.message}</p>}
                                    {!isAdult && <p className="text-xs text-slate-500 mt-1">Required for children validation</p>}
                                </div>

                                {/* Contact Info (Only strictly needed for first passenger/adults, but good to have fields available) */}
                                {isAdult && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> Email
                                            </label>
                                            <input
                                                type="email"
                                                {...register(`passengers.${passengerIndex}.email`)}
                                                placeholder="john@example.com"
                                                className={`w-full bg-black/20 border rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors ${passengerErrors?.email ? 'border-red-500/50' : 'border-white/10'}`}
                                            />
                                            {passengerErrors?.email && <p className="text-red-400 text-xs mt-1">{passengerErrors.email.message}</p>}
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                {...register(`passengers.${passengerIndex}.phone_number`)}
                                                placeholder="+1 555 0123"
                                                className={`w-full bg-black/20 border rounded-xl p-3 text-white focus:outline-none focus:border-rose-500/50 transition-colors ${passengerErrors?.phone_number ? 'border-red-500/50' : 'border-white/10'}`}
                                            />
                                            {passengerErrors?.phone_number && <p className="text-red-400 text-xs mt-1">{passengerErrors.phone_number.message}</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
