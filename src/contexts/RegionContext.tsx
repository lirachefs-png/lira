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
    };
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const LABELS = {
    pt: { flights: 'Voos', experiences: 'Experiências', myAccount: 'Minha Conta', login: 'Entrar' },
    en: { flights: 'Flights', experiences: 'Experiences', myAccount: 'My Account', login: 'Login' },
    es: { flights: 'Vuelos', experiences: 'Experiencias', myAccount: 'Mi Cuenta', login: 'Entrar' },
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
