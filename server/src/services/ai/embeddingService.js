import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateEmbedding = async (text) => {
    try {
        const result = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: text
        });

        return result.embeddings[0].values;

    } catch (error) {
        console.error(
            "Embedding generation failed:",
            error.message
        );

        throw error;
    }
};
