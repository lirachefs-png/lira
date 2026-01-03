'use server';

// import { groq } from "@/lib/groq";

export interface GuideCategory {
    name: string;
    icon: string;
    places: GuidePlace[];
}

export interface GuidePlace {
    name: string;
    description: string;
    rating: number; // 1-3 stars
    tip: string;
}

export interface CityGuideContent {
    description: string;
    categories: GuideCategory[];
}

// Cache simples em memória (reset no deploy)
const cache = new Map<string, CityGuideContent>();

export async function generateCityGuide(cityName: string, cityCountry: string): Promise<CityGuideContent> {
    const cacheKey = `${cityName}-${cityCountry}`;

    // Verificar cache
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
    }

    // AI Generation disabled
    // Retornar conteúdo padrão imediatamente
    return getDefaultContent(cityName);
}

function getDefaultContent(cityName: string): CityGuideContent {
    return {
        description: `Descubra ${cityName} com o AllTrip Guide — sua porta de entrada para experiências autênticas e memoráveis.`,
        categories: [
            {
                name: "Gastronomia",
                icon: "🍽️",
                places: [
                    { name: "A descobrir", description: "Conteúdo em carregamento...", rating: 2, tip: "Aguarde" }
                ]
            },
            {
                name: "Vida Noturna",
                icon: "🌙",
                places: [
                    { name: "A descobrir", description: "Conteúdo em carregamento...", rating: 2, tip: "Aguarde" }
                ]
            },
            {
                name: "Lazer",
                icon: "🏖️",
                places: [
                    { name: "A descobrir", description: "Conteúdo em carregamento...", rating: 2, tip: "Aguarde" }
                ]
            },
            {
                name: "Aventura",
                icon: "🧗",
                places: [
                    { name: "A descobrir", description: "Conteúdo em carregamento...", rating: 2, tip: "Aguarde" }
                ]
            }
        ]
    };
}
