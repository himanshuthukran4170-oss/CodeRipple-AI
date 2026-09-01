import { ChromaClient } from "chromadb";
import { GeminiEmbeddingFunction } from "./geminiEmbeddingFunction.js";


// -----------------------------------------
// ChromaDB client
// -----------------------------------------

const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false
});


// -----------------------------------------
// Collection configuration
// -----------------------------------------

const COLLECTION_NAME = "coderipple_code";

const embeddingFunction =
    new GeminiEmbeddingFunction();


// -----------------------------------------
// Get or create collection
// -----------------------------------------

export const getCodeCollection = async () => {

    try {

        const collection =
            await client.getOrCreateCollection({
                name: COLLECTION_NAME,
                embeddingFunction
            });

        return collection;

    } catch (error) {

        console.error(
            "Failed to get ChromaDB collection:",
            error.message
        );

        throw error;
    }
};


// -----------------------------------------
// Store a code chunk
// -----------------------------------------

export const storeCodeChunk = async ({
    id,
    content,
    embedding,
    metadata
}) => {

    try {

        const collection =
            await getCodeCollection();

        await collection.upsert({

            ids: [id],

            documents: [content],

            embeddings: [embedding],

            metadatas: [metadata]

        });

        console.log(
            `Stored chunk: ${id}`
        );

    } catch (error) {

        console.error(
            `Failed to store chunk ${id}:`,
            error.message
        );

        throw error;
    }
};


// -----------------------------------------
// Search similar code
// -----------------------------------------

export const searchCode = async ({
    embedding,
    limit = 5,
    repository
}) => {

    try {

        const collection =
            await getCodeCollection();

        console.log(
            `Searching repository: ${repository}`
        );

        const results =
            await collection.query({

                queryEmbeddings: [embedding],

                nResults: limit,

                where: {
                    repository: repository
                }

            });

        return results;

    } catch (error) {

        console.error(
            "Code search failed:",
            error.message
        );

        throw error;
    }
};