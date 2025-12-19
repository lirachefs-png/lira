'use server';

import { groq } from "@/lib/groq";

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function chatWithMaya(messages: ChatMessage[]) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return "⚠️ **Maya (Simulada):** Olá! Para eu funcionar, adicione a `GROQ_API_KEY` no seu arquivo `.env.local`.";
        }

        // Add System Prompt if not present (or reinforce it)
        const systemPrompt: ChatMessage = {
            role: "system",
            content: `Você é a Maya, a assistente de viagens ultra-inteligente e animada da AllTrip.
            
            SUA PERSONALIDADE:
            - Você ama viajar, usa emojis 🌍✈️🌴 e é muito simpática.
            - Você é poliglota fluente.
            - IMPORTANTE: Responda SEMPRE no mesmo idioma que o usuário usou na pergunta (Se ele falar Inglês, responda em Inglês. Se falar Espanhol, responda em Espanhol).
            - Suas respostas devem ser curtas, diretas e úteis (máximo de 3 parágrafos).
            - Se o usuário perguntar sobre preços, lembre que você pode buscar "Voos" e "Experiências" no menu acima.
            
            SEU OBJETIVO:
            - Ajudar o usuário a escolher o próximo destino.
            - Dar dicas de roteiros, clima e o que levar na mala.
            - Se o usuário estiver indeciso, sugira lugares exóticos.`
        };

        const completion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 400,
        });

        return completion.choices[0]?.message?.content || "Maya ficou sem palavras por um momento.";
    } catch (error: any) {
        console.error("❌ Groq Chat Error:", error?.message || error);
        return "⚠️ **Maya cochilou:** Tive um problema de conexão. Tente perguntar de novo!";
    }
}
