'use server';

import { groq } from "@/lib/groq";

export async function generateAdminInsights(bookings: any[]) {
    // 1. Prepare Data Summary for the AI
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.amount_total || 0), 0) / 100;
    const totalBookings = bookings.length;
    const failures = bookings.filter((b: any) => b.state === 'failed').length;
    const pending = bookings.filter((b: any) => b.state === 'processing').length;

    // Simplistic recent trend (last 5)
    const recent = bookings.slice(0, 5).map((b: any) =>
        `${b.passenger_data?.origem}->${b.passenger_data?.destino} (€${(b.amount_total / 100).toFixed(0)}) [${b.state}]`
    ).join(", ");

    const prompt = `
    You are Maya, the expert AI travel analyst for "All Trip". 
    Analyze the following current sales data and give a SUPER CONCISE, friendly, and professional executive summary (max 3 sentences) in Portuguese (pt-BR).
    
    Data:
    - Total Revenue: €${totalRevenue}
    - Total Bookings: ${totalBookings}
    - Failed Payments: ${failures}
    - Pending Process: ${pending}
    - Recent Transactions: ${recent}

    Tone: Professional, Insightful, Optimistic but realistic.
    Focus on: Revenue health, operational attention points (failures/pending), or celebrating wins.
    If revenue is 0, encourage the team to launch marketing.
    Do NOT use markdown headers. Just plain text or bullet points with emojis.
    `;

    try {
        if (!process.env.GROQ_API_KEY) {
            return "⚠️ **Maya (Simulada):** Olá! Para eu funcionar, adicione a `GROQ_API_KEY` no seu arquivo `.env.local`.";
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // Updated to latest stable model
            temperature: 0.5,
            max_tokens: 200,
        });

        return completion.choices[0]?.message?.content || "Maya ficou sem palavras.";
    } catch (error: any) {
        console.error("❌ Groq AI Error:", error?.message || error);
        if (error?.status === 401) return "❌ **Erro de Autenticação:** Verifique sua GROQ_API_KEY.";
        return "⚠️ **Maya off-line:** Não consegui conectar com o cérebro AI agora. Tente recarregar.";
    }
}
