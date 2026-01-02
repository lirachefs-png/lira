const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("❌ NO GOOGLE_API_KEY FOUND!");
        return;
    }

    console.log("🔑 API Key:", apiKey.substring(0, 10) + "...");

    // Use direct API call to list models
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        console.log("\n📋 Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods?.includes('generateContent')) {
                    console.log(`  ✅ ${m.name} - ${m.displayName}`);
                }
            });
        } else {
            console.log("No models found or unexpected response:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
}

listModels();
