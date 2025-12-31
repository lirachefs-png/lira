'use server';

import { getWeatherForecast } from "@/services/weather";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export interface PackingList {
    clothing: string[];
    toiletries: string[];
    gadgets: string[];
    documents: string[];
    mayaTip: string;
}

// Language map for prompt instructions
const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
    'pt': 'Responda APENAS em Português de Portugal. Use termos portugueses (ex: telemóvel, mala, guarda-chuva).',
    'en': 'Respond ONLY in English.',
    'es': 'Responda SOLO en Español.'
};

export async function getSmartPackingList(
    destination: string,
    arrivalDate: string,
    departureDate: string,
    language: string = 'pt' // Default to Portuguese
): Promise<PackingList> {
    try {
        // 1. Get Coordinates via OpenMeteo Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results?.length) {
            throw new Error("Destination not found");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Get Weather
        const weather = await getWeatherForecast(
            latitude,
            longitude,
            new Date(arrivalDate),
            new Date(departureDate)
        );

        // 3. Get language instruction
        const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS['pt'];

        // 4. Generate Packing List with AI
        const prompt = `
        Destination: ${name}, ${country}
        Dates: ${arrivalDate} to ${departureDate}
        Weather Forecast: ${weather.description}, Avg Temp ${weather.avgTemp}°C (Min ${weather.minTemp}°C, Max ${weather.maxTemp}°C), Rain Prob: ${weather.rainProbability}%

        Generate a smart packing list for this trip.
        Be specific based on weather (e.g. if rain > 50%, suggest umbrella/raincoat).
        
        ${langInstruction}
        
        Return ONLY valid JSON with this structure:
        {
            "clothing": ["item1", "item2", "item3", "item4", "item5"],
            "toiletries": ["item1", "item2", "item3"],
            "gadgets": ["item1", "item2", "item3"],
            "documents": ["item1", "item2"],
            "mayaTip": "A witty, practical travel tip specific to ${name}"
        }
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: `You are Maya, an advanced AI travel assistant. You are helpful, practical, and stylish. ${langInstruction} Return JSON only.` },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const jsonStr = completion.choices[0]?.message?.content;
        if (!jsonStr) throw new Error("AI failed to generate list");

        return JSON.parse(jsonStr) as PackingList;

    } catch (error) {
        console.error("Smart Packer Error:", error);
        // Fallback based on language
        const fallbacks: Record<string, PackingList> = {
            'pt': {
                clothing: ["T-shirts", "Calças", "Casaco leve", "Roupa interior", "Calçado confortável"],
                toiletries: ["Escova de dentes", "Protetor solar", "Desodorizante"],
                gadgets: ["Carregador de telemóvel", "Adaptador de tomada"],
                documents: ["Passaporte", "Cartão de embarque"],
                mayaTip: "Leva sempre uma garrafa de água reutilizável!"
            },
            'en': {
                clothing: ["T-shirts", "Pants", "Light jacket", "Underwear", "Comfortable shoes"],
                toiletries: ["Toothbrush", "Sunscreen", "Deodorant"],
                gadgets: ["Phone charger", "Power adapter"],
                documents: ["Passport", "Boarding pass"],
                mayaTip: "Always carry a reusable water bottle!"
            },
            'es': {
                clothing: ["Camisetas", "Pantalones", "Chaqueta ligera", "Ropa interior", "Zapatos cómodos"],
                toiletries: ["Cepillo de dientes", "Protector solar", "Desodorante"],
                gadgets: ["Cargador de móvil", "Adaptador de enchufe"],
                documents: ["Pasaporte", "Tarjeta de embarque"],
                mayaTip: "¡Lleva siempre una botella de agua reutilizable!"
            }
        };
        return fallbacks[language] || fallbacks['pt'];
    }
}

