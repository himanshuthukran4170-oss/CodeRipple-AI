import { generateEmbedding } from "../ai/embeddingService.js";
import { storeCodeChunk } from "./vectorStore.js";

const test = async () => {

    try {

        const code = `
            const loginUser = async (email, password) => {
                const user = await User.findOne({ email });
                return user;
            };
        `;

        console.log("Generating embedding...");

        const embedding =
            await generateEmbedding(code);

        console.log(
            "Embedding generated:",
            embedding.length
        );


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

    } catch (error) {

        console.error(
            "Vector store test failed:",
            error.message
        );
    }
};

test();