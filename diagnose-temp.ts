
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Duffel } from '@duffel/api';
import Groq from 'groq-sdk';

async function diagnose() {
    console.log("🔍 Iniciando Varredura de Diagnóstico Local...\n");

    // 1. Check Env File Exists (implied by execution, but printed for clarity)
    console.log("📂 Verificando variáveis de ambiente...");

    // Load from .env.local explicitly if needed, but dotenv typically handles .env
    // Let's assume user is running with `dotenv -e .env.local` or environment is loaded.

    const duffelKey = process.env.DUFFEL_ACCESS_TOKEN;
    const groqKey = process.env.GROQ_API_KEY;

    // Mask keys for display
    const mask = (s?: string) => s ? `${s.substring(0, 4)}...${s.substring(s.length - 4)}` : "MISSING ❌";

    console.log(`   - DUFFEL_ACCESS_TOKEN: ${mask(duffelKey)}`);
    console.log(`   - GROQ_API_KEY:        ${mask(groqKey)}`);

    let hasErrors = false;

    // 2. Test Duffel
    if (duffelKey) {
        console.log("\n✈️  Testando Conexão com Duffel...");
        try {
            const duffel = new Duffel({ token: duffelKey });
            const start = Date.now();
            // Simple list request to validate auth
            await duffel.aircraft.list({ limit: 1 });
            const duration = Date.now() - start;
            console.log(`   ✅ Duffel OK (${duration}ms) - Chave Válida.`);
        } catch (e: any) {
            console.error(`   ❌ ERRO DUFFEL: ${e.message}`);
            if (e.errors) console.error("Detalhes:", JSON.stringify(e.errors, null, 2));
            hasErrors = true;
        }
    } else {
        console.error("   ❌ Pulei teste Duffel (Chave faltando).");
        hasErrors = true;
    }

    // 3. Test Groq
    if (groqKey) {
        console.log("\n🧠 Testando Conexão com Groq AI...");
        try {
            const groq = new Groq({ apiKey: groqKey });
            const start = Date.now();
            await groq.chat.completions.create({
                messages: [{ role: 'user', content: 'ping' }],
                model: 'llama3-8b-8192',
            });
            const duration = Date.now() - start;
            console.log(`   ✅ Groq OK (${duration}ms) - Chave Válida.`);
        } catch (e: any) {
            console.error(`   ❌ ERRO GROQ: ${e.message}`);
            hasErrors = true;
        }
    } else {
        console.error("   ❌ Pulei teste Groq (Chave faltando).");
        hasErrors = true;
    }

    console.log("\n" + "=".repeat(30));
    if (hasErrors) {
        console.log("🚨 DIAGNÓSTICO: ENCONTRADOS ERROS NAS CHAVES/CONEXÃO.");
        console.log("Ação Recomendada: Corrija o arquivo .env.local com as chaves certas.");
    } else {
        console.log("✅ DIAGNÓSTICO: TODAS AS CONEXÕES ESTÃO FUNCIONANDO.");
        console.log("Se ainda falha no site, o erro está na lógica do código (loop infinito ou request mal formatado).");
    }
}

diagnose();
