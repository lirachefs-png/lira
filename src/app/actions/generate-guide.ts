'use server';

import { groq } from "@/lib/groq";

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

    try {
        if (!process.env.GROQ_API_KEY) {
            return getDefaultContent(cityName);
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Você é um curador de viagens premium do AllTrip Guide. Responda APENAS em JSON válido, sem markdown.`
                },
                {
                    role: "user",
                    content: `Crie um guia premium para ${cityName}, ${cityCountry}.

Retorne EXATAMENTE este formato JSON:
{
    "description": "Descrição elegante da cidade (2-3 frases)",
    "categories": [
        {
            "name": "Gastronomia",
            "icon": "🍽️",
            "places": [
                {"name": "Nome do Local", "description": "Breve descrição", "rating": 3, "tip": "Dica exclusiva"}
            ]
        },
        {
            "name": "Vida Noturna",
            "icon": "🌙",
            "places": [...]
        },
        {
            "name": "Lazer",
            "icon": "🏖️",
            "places": [...]
        },
        {
            "name": "Aventura",
            "icon": "🧗",
            "places": [...]
        }
    ]
}

Cada categoria deve ter 3 lugares. Rating de 1 a 3 (como Michelin).`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1500,
        });

        const responseText = completion.choices[0]?.message?.content || '';

        // Extrair JSON da resposta
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in response");
            return getDefaultContent(cityName);
        }

        const parsed = JSON.parse(jsonMatch[0]) as CityGuideContent;

        // Guardar em cache
        cache.set(cacheKey, parsed);

        return parsed;

    } catch (error: any) {
        console.error("Guide generation error:", error?.message || error);
        return getDefaultContent(cityName);
    }
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
