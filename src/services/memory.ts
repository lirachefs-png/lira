
import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

// Cache the pipeline to avoid re-instantiating on every call
let extractor: FeatureExtractionPipeline | null = null;

async function getExtractor(): Promise<FeatureExtractionPipeline> {
    if (!extractor) {
        // @ts-expect-error - Pipeline overload types are too complex for TS
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
}

export interface Memory {
    id: number;
    content: string;
    similarity: number;
    created_at: string;
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
    try {
        const pipe = await getExtractor();
        // Mean pooling is applied automatically for this model
        const output = await pipe(text, { pooling: 'mean', normalize: true });
        // output.data is a Float32Array, convert to regular array
        return Array.from(output.data as Float32Array);
    } catch (error) {
        console.error("Embedding Error:", error);
        return null;
    }
}

export async function storeMemory(userId: string, content: string) {
    try {
        console.log("💾 Mock Store Memory (Auth Removed):", { userId, content });
        // No-op
        return true;
    } catch (error) {
        console.error("Store Memory Error:", error);
        return false;
    }
}

export async function retrieveRelevantMemories(userId: string, query: string, limit = 5): Promise<Memory[]> {
    try {
        console.log("🔍 Mock Retrieve Memory (Auth Removed):", { userId, query });
        return [];
    } catch (error) {
        console.error("Retrieve Memory Error:", error);
        return [];
    }
}
