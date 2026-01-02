import Groq from "groq-sdk";

// Lazy initialization - only creates client when actually used (runtime, not build time)
let _groqClient: Groq | null = null;

export function getGroqClient(): Groq {
    if (!_groqClient) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not configured");
        }
        _groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    return _groqClient;
}

// For backward compatibility - use getGroqClient() for new code
export const groq = {
    get chat() {
        return getGroqClient().chat;
    }
};
