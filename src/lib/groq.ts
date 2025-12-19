import Groq from "groq-sdk";

export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "gsk_DUMMY_KEY_FOR_BUILD_PROCESS", // Prevent build failure if env missing
});
