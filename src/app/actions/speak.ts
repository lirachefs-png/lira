'use server';

export async function generateSpeech(text: string) {
    try {
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            throw new Error("Missing ELEVENLABS_API_KEY");
        }

        // Voice ID: "Bella" (Very realistic, expressive)
        // Previous: "Rachel" (21m00Tcm4TlvDq8ikWAM)
        const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_multilingual_v2", // Critical for Portuguese
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                }
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("ElevenLabs API Error:", error);
            throw new Error(`ElevenLabs Error: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString('base64');

        return `data:audio/mpeg;base64,${base64Audio}`;

    } catch (error) {
        console.error("Generate Speech Error:", error);
        return null;
    }
}
