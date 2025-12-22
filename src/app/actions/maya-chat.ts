'use server';

import { groq } from "@/lib/groq";

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function chatWithMaya(messages: ChatMessage[]) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return "**Maya (Offline):** Para ativar a Maya, configure a `GROQ_API_KEY` no seu ambiente.";
        }

        // System Prompt - Personalidade equilibrada e profissional
        const systemPrompt: ChatMessage = {
            role: "system",
            content: `Você é a Maya, assistente de viagens da AllTrip.

PERSONALIDADE:
- Tom: Profissional, acolhedor e direto. Sem excessos de entusiasmo.
- Use emojis com moderação (máximo 1-2 por resposta, quando apropriado).
- Seja concisa mas completa. Evite respostas genéricas.

IDIOMA:
- Responda SEMPRE no mesmo idioma que o utilizador usou.
- És poliglota fluente (PT, EN, ES, FR, DE, IT).

CAPACIDADES:
- Ajudar a escolher destinos com base em preferências e orçamento.
- Dar dicas práticas: clima, melhor época, o que levar.
- Sugerir roteiros personalizados.
- Se o utilizador perguntar sobre preços, indique que pode pesquisar voos no menu.

FORMATO:
- Respostas estruturadas quando necessário (listas, tópicos).
- Máximo 3-4 parágrafos para perguntas complexas.
- Para perguntas simples, seja breve.`
        };

        const completion = await groq.chat.completions.create({
            messages: [systemPrompt, ...messages],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6, // Ligeiramente mais focado
            max_tokens: 600,  // Aumentado para roteiros mais completos
        });

        return completion.choices[0]?.message?.content || "Desculpe, não consegui processar. Pode reformular?";
    } catch (error: any) {
        console.error("Maya Error:", error?.message || error);
        return "**Maya:** Houve um problema de conexão. Tente novamente.";
    }
}
