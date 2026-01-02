const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ NO GOOGLE_API_KEY FOUND!");
        return;
    }

    console.log("🔑 API Key found (starts with):", apiKey.substring(0, 8) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test gemini-pro
    try {
        console.log("\n🤖 Testing 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("✅ gemini-pro WORKS! Response:", response.text());
    } catch (error) {
        console.error("❌ gemini-pro FAILED!");
        console.error("Error:", error.message);
    }

    // Test gemini-1.5-flash (for comparison)
    try {
        console.log("\n🤖 Testing 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("✅ gemini-1.5-flash WORKS! Response:", response.text());
    } catch (error) {
        console.error("❌ gemini-1.5-flash FAILED!");
        console.error("Error:", error.message);
    }

    // Test with system instruction (as used in eden-brain)
    try {
        console.log("\n🤖 Testing 'gemini-pro' with systemInstruction...");
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            systemInstruction: "You are Maya, a helpful travel assistant."
        });
        const result = await model.generateContent("Who are you?");
        const response = await result.response;
        console.log("✅ gemini-pro with systemInstruction WORKS! Response:", response.text());
    } catch (error) {
        console.error("❌ gemini-pro with systemInstruction FAILED!");
        console.error("Error:", error.message);
    }
}

diagnose();
