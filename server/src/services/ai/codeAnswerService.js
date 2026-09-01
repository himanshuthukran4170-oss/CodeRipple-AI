import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateCodeAnswer = async ({
    question,
    searchResults
}) => {

    try {

        const documents = searchResults.documents?.[0] || [];
        const metadatas = searchResults.metadatas?.[0] || [];

        if (documents.length === 0) {
            return "I could not find relevant code in this repository.";
        }

        // Build context from retrieved code
        const context = documents
            .map((code, index) => {

                const metadata = metadatas[index] || {};

                return `
--- Code Chunk ${index + 1} ---

File: ${metadata.filePath || "unknown"}

Function: ${metadata.name || "unknown"}

Type: ${metadata.type || "unknown"}

Lines: ${metadata.startLine || "?"}-${metadata.endLine || "?"}

Code:
${code}
`;
            })
            .join("\n");


        const prompt = `
You are CodeRipple, an AI assistant that explains source code.

Answer the user's question using ONLY the repository context provided below.

User question:
${question}

Repository context:
${context}

Instructions:

1. Explain the code clearly and simply.
2. Mention relevant file names.
3. Mention function names when useful.
4. Explain how the different pieces work together.
5. Do not invent code that is not present in the context.
6. If the context does not contain enough information, say so.
7. Do not include unnecessary information.

Give a concise but useful answer.
`;


        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });


        return response.text;

    } catch (error) {

        console.error(
            "Code answer generation failed:",
            error.message
        );

        throw error;
    }
};