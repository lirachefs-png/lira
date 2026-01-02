'use server';

import { generateSpeech } from "./speak";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "gsk_PLACEHOLDER_BUILD"
});

// Mock ambient sounds (In production, serve these from public/sounds or S3)
const AMBIENCE_MAP: Record<string, string> = {
    'city': 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_659021e05a.mp3', // Busy City
    'beach': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_31011d6c8b.mp3', // Ocean
    'nature': 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_1730030588.mp3', // Forest
    'zen': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', // Calm
};

export interface AtmosphereResult {
    audioUrl: string; // Background Vibe
    script: string;
    narratedUrl: string | null; // Maya speaking
    vibe: string;
}

export async function getAtmosphericExperience(destination: string): Promise<AtmosphereResult> {
    try {
        // 1. Determine Vibe using AI
        const prompt = `
        Destination: ${destination}
        Classify the vibe into one of these exact keys: 'city', 'beach', 'nature', 'zen'.
        Then write a 1-sentence CINEMATIC introduction for this place.
        Return JSON: { "vibe": "key", "script": "sentence" }
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a cinematic travel narrator. JSON only." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const jsonStr = completion.choices[0]?.message?.content;
        const data = jsonStr ? JSON.parse(jsonStr) : { vibe: 'city', script: `Welcome to ${destination}.` };

        const vibe = AMBIENCE_MAP[data.vibe] ? data.vibe : 'city';
        const ambientUrl = AMBIENCE_MAP[vibe];

        // 2. Generate Narration Audio
        // We reuse the existing ElevenLabs integration
        const narration = await generateSpeech(data.script);

        return {
            audioUrl: ambientUrl,
            script: data.script,
            narratedUrl: narration,
            vibe: vibe
        };

    } catch (error) {
        console.error("Atmosphere Error:", error);
        return {
            audioUrl: AMBIENCE_MAP['city'],
            script: `Discover the magic of ${destination}`,
            narratedUrl: null,
            vibe: 'city'
        };
    }
}
