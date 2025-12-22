'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';
type Currency = 'EUR' | 'USD' | 'BRL';

interface RegionContextType {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    labels: {
        flights: string;
        experiences: string;
        myAccount: string;
        login: string;
        hero: {
            badge: string;
            headline_1: string;
            headline_2: string;
            subheadline: string;
            search: string;
            roundtrip: string;
            passenger: string;
        };
        search_results: {
            round_trip: string;
            passenger: string;
            total_price: string;
            select: string;
            direct: string;
            stops: string;
            no_flights: string;
            no_flights_desc: string;
            reset_filters: string;
            error_title: string;
            try_again: string;
        };
        checkout: {
            title: string;
            step: string;
            flight_details: string;
            passenger_details: string;
            first_name: string;
            last_name: string;
            dob: string;
            gender: string;
            male: string;
            female: string;
            email: string;
            phone: string;
            seat_selection: string;
            select_seat: string;
            change_seat: string;
            no_seat: string;
            baggage: string;
            checked_bag: string;
            total_due: string;
            flight_fare: string;
            extras: string;
            pay_button: string;
            redirecting: string;
            secure_text: string;
            pay_now: string;
            hold_price: string;
            instant_desc: string;
            hold_desc: string;
            confirm_reservation: string;
            price_guaranteed: string;
        };
        common: {
            economy: string;
            one_way: string;
        };
    };
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const LABELS = {
    pt: {
        flights: 'Voos',
        experiences: 'Experiências',
        myAccount: 'Minha Conta',
        login: 'Entrar',
        hero: {
            badge: 'Pesquisando em 728+ companhias aéreas',
            headline_1: 'Viaje perto. Viaje longe.',
            headline_2: 'Viaje Barato.',
            subheadline: 'Desbloqueie ofertas secretas que as companhias aéreas não mostram. Encontramos os menores preços em segundos.',
            search: 'BUSCAR',
            roundtrip: 'Ida e volta',
            passenger: '1 Viajante, Econômica'
        },
        search_results: {
            round_trip: 'Ida e volta',
            passenger: '1 Viajante',
            total_price: 'Preço total',
            select: 'Selecionar',
            direct: 'Direto',
            stops: 'Parada(s)',
            no_flights: 'Nenhum voo encontrado',
            no_flights_desc: 'Não encontramos voos para estas datas. Tente outro dia ou aeroporto.',
            reset_filters: 'Limpar Filtros',
            error_title: 'Ops! Algo deu errado.',
            try_again: 'Tentar Novamente'
        },
        checkout: {
            title: 'Revisar e Pagar',
            step: 'Passo 2 de 3',
            flight_details: 'Detalhes do Voo',
            passenger_details: 'Passageiro Principal',
            first_name: 'Nome',
            last_name: 'Sobrenome',
            dob: 'Data de Nascimento',
            gender: 'Gênero',
            male: 'Masculino',
            female: 'Feminino',
            email: 'Email',
            phone: 'Telefone',
            seat_selection: 'Seleção de Assentos',
            select_seat: 'Selecionar Assento',
            change_seat: 'Alterar',
            no_seat: 'Nenhum assento selecionado',
            baggage: 'Bagagem',
            checked_bag: 'Bagagem Despachada',
            total_due: 'Total a Pagar',
            flight_fare: 'Tarifa do Voo',
            extras: 'Extras',
            pay_button: 'Ir para Pagamento',
            redirecting: 'Redirecionando...',
            secure_text: 'Pagamento Seguro via Stripe',
            pay_now: 'Pagar Agora',
            hold_price: 'Reservar Preço',
            instant_desc: 'Confirmação imediata',
            hold_desc: 'Pague depois',
            confirm_reservation: 'Confirmar Reserva',
            price_guaranteed: 'Preço garantido até'
        },
        common: {
            economy: 'Econômica',
            one_way: 'Só ida'
        }
    },
    en: {
        flights: 'Flights',
        experiences: 'Experiences',
        myAccount: 'My Account',
        login: 'Login',
        hero: {
            badge: 'Searching 728+ airlines',
            headline_1: 'Go near. Go far.',
            headline_2: 'Go Cheap.',
            subheadline: "Unlock secret flight deals airlines don't want you to see. We find the cheapest prices in seconds.",
            search: 'SEARCH',
            roundtrip: 'Round trip',
            passenger: '1 Traveler, Economy'
        },
        search_results: {
            round_trip: 'Round Trip',
            passenger: '1 Passenger',
            total_price: 'Total price',
            select: 'Select',
            direct: 'Direct Flight',
            stops: 'Stop(s)',
            no_flights: 'No flights found',
            no_flights_desc: "We couldn't find any flights for these dates. Try searching for a different day or airport.",
            reset_filters: 'Reset Filters',
            error_title: 'Oops! Something went wrong.',
            try_again: 'Try Again'
        },
        checkout: {
            title: 'Review & Pay',
            step: 'Step 2 of 3',
            flight_details: 'Flight Details',
            passenger_details: 'Primary Passenger',
            first_name: 'First Name',
            last_name: 'Last Name',
            dob: 'Date of Birth',
            gender: 'Gender',
            male: 'Male',
            female: 'Female',
            email: 'Email',
            phone: 'Phone',
            seat_selection: 'Seat Selection',
            select_seat: 'Select Seat',
            change_seat: 'Change',
            no_seat: 'No Seat Selected',
            baggage: 'Baggage',
            checked_bag: 'Checked Bag',
            total_due: 'Total Due',
            flight_fare: 'Flight Fare',
            extras: 'Extras',
            pay_button: 'Proceed to Payment',
            redirecting: 'Redirecting...',
            secure_text: 'Secure Checkout via Stripe',
            pay_now: 'Pay Now',
            hold_price: 'Hold Price',
            instant_desc: 'Instant confirmation',
            hold_desc: 'Pay later',
            confirm_reservation: 'Confirm Reservation',
            price_guaranteed: 'Price guaranteed until'
        },
        common: {
            economy: 'Economy',
            one_way: 'One-way'
        }
    },
    es: {
        flights: 'Vuelos',
        experiences: 'Experiencias',
        myAccount: 'Mi Cuenta',
        login: 'Entrar',
        hero: {
            badge: 'Buscando en 728+ aerolíneas',
            headline_1: 'Viaja cerca. Viaja lejos.',
            headline_2: 'Viaja Barato.',
            subheadline: 'Desbloquea ofertas secretas que las aerolíneas no muestran. Encontramos los precios más bajos en segundos.',
            search: 'BUSCAR',
            roundtrip: 'Ida y vuelta',
            passenger: '1 Viajero, Económica'
        },
        search_results: {
            round_trip: 'Ida y vuelta',
            passenger: '1 Viajero',
            total_price: 'Precio total',
            select: 'Seleccionar',
            direct: 'Vuelo Directo',
            stops: 'Escala(s)',
            no_flights: 'No se encontraron vuelos',
            no_flights_desc: 'No encontramos vuelos para estas fechas. Intenta otro día o aeropuerto.',
            reset_filters: 'Restablecer Filtros',
            error_title: '¡Ups! Algo salió mal.',
            try_again: 'Intentar De Nuevo'
        },
        checkout: {
            title: 'Revisar y Pagar',
            step: 'Paso 2 de 3',
            flight_details: 'Detalles del Vuelo',
            passenger_details: 'Pasajero Principal',
            first_name: 'Nombre',
            last_name: 'Apellido',
            dob: 'Fecha de Nacimiento',
            gender: 'Género',
            male: 'Masculino',
            female: 'Femenino',
            email: 'Email',
            phone: 'Teléfono',
            seat_selection: 'Selección de Asiento',
            select_seat: 'Seleccionar Asiento',
            change_seat: 'Cambiar',
            no_seat: 'Ningún asiento seleccionado',
            baggage: 'Equipaje',
            checked_bag: 'Maleta Facturada',
            total_due: 'Total a Pagar',
            flight_fare: 'Tarifa de Vuelo',
            extras: 'Extras',
            pay_button: 'Proceder al Pago',
            redirecting: 'Redirigiendo...',
            secure_text: 'Pago Seguro vía Stripe',
            pay_now: 'Pagar Ahora',
            hold_price: 'Reservar Precio',
            instant_desc: 'Confirmación inmediata',
            hold_desc: 'Pagar después',
            confirm_reservation: 'Confirmar Reserva',
            price_guaranteed: 'Precio garantizado hasta'
        },
        common: {
            economy: 'Económica',
            one_way: 'Solo ida'
        }
    },
};

export function RegionProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('pt');
    const [currency, setCurrencyState] = useState<Currency>('EUR');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Load persistency
        const savedLang = localStorage.getItem('alltrip-lang') as Language;
        const savedCurr = localStorage.getItem('alltrip-curr') as Currency;
        if (savedLang) setLanguageState(savedLang);
        if (savedCurr) setCurrencyState(savedCurr);
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('alltrip-lang', lang);
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('alltrip-curr', curr);
    };

    if (!mounted) {
        // Return null or a loader to avoid mismatch during hydration, 
        // OR just render children with default state for SEO.
        // Let's render children to avoid white flash, assuming 'pt' default is fine.
    }

    return (
        <RegionContext.Provider value={{
            language,
            currency,
            setLanguage,
            setCurrency,
            labels: LABELS[language]
        }}>
            {children}
        </RegionContext.Provider>
    );
}

export function useRegion() {
    const context = useContext(RegionContext);
    if (!context) {
        throw new Error('useRegion must be used within a RegionProvider');
    }
    return context;
}
