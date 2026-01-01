
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'MISSING_KEY', details: 'A variável GROQ_API_KEY está vazia.' }, { status: 500 });
        }

        // Mask key for safety return
        const maskedKey = `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`;

        const groq = new Groq({ apiKey });

        try {
            const start = Date.now();
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: 'Say Hello' }],
                model: 'llama-3.1-8b-instant',
                max_tokens: 10
            });
            const duration = Date.now() - start;

            return NextResponse.json({
                status: 'OK',
                model: 'llama-3.1-8b-instant',
                key: maskedKey,
                duration: `${duration}ms`,
                response: completion.choices[0]?.message?.content
            });

        } catch (apiError: any) {
            return NextResponse.json({
                status: 'API_ERROR',
                key: maskedKey,
                message: apiError.message,
                type: apiError.type,
                code: apiError.code
            }, { status: 502 });
        }

    } catch (e: any) {
        return NextResponse.json({ status: 'INTERNAL_ERROR', error: e.message }, { status: 500 });
    }
}
