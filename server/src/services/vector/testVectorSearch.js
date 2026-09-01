console.log("TEST VECTOR SEARCH FILE STARTED");

import { generateEmbedding } from "../ai/embeddingService.js";
import {
    storeCodeChunk,
    searchCode
} from "./vectorStore.js";

const test = async () => {

    try {

        // 1. Test code
        const code = `
            const loginUser = async (email, password) => {
                const user = await User.findOne({ email });
                return user;
            };
        `;

        console.log("Generating embedding...");

        // 2. Generate embedding
        const embedding =
            await generateEmbedding(code);

        console.log(
            "Embedding generated:",
            embedding.length
        );

        // 3. Store the chunk
        await storeCodeChunk({

            id: "test-login-function-1",

            content: code,

            embedding: embedding,

            metadata: {
                repository: "test-repository",
                filePath: "src/auth.js",
                language: "javascript"
            }

        });

        console.log(
            "Code chunk stored successfully"
        );

        // 4. Create embedding for search query
        const question =
            "Where is the user login function?";

        console.log(
            "Generating search embedding..."
        );

        const queryEmbedding =
            await generateEmbedding(question);

        // 5. Search ChromaDB
        console.log(
            "Searching ChromaDB..."
        );

        const results =
            await searchCode({
                embedding: queryEmbedding,
                limit: 3
            });

        // 6. Show results
        console.log("\nSearch results:");

        console.dir(
            results,
            { depth: null }
        );

    } catch (error) {

        console.error(
            "\nVector search test failed:",
            error
        );

    }
};

test();