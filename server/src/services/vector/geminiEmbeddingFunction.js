import { generateEmbedding } from "../ai/embeddingService.js";

export class GeminiEmbeddingFunction {

    async generate(texts) {
        const embeddings = [];

        for (const text of texts) {
            const embedding = await generateEmbedding(text);
            embeddings.push(embedding);
        }

        return embeddings;
    }

    async generateForQueries(texts) {
        const embeddings = [];

        for (const text of texts) {
            const embedding = await generateEmbedding(text);
            embeddings.push(embedding);
        }

        return embeddings;
    }
}