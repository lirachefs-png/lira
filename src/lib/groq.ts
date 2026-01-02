import Groq from "groq-sdk";

let _groqClient: Groq | null = null;

export function getGroqClient(): Groq {
    if (!_groqClient) {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not configured");
        }

        _groqClient = new Groq({
            apiKey,
        });
    }

    return _groqClient;
}

export const groq = {
    get chat() {
        return getGroqClient().chat;
    },
};
