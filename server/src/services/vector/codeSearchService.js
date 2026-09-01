import { generateEmbedding }
    from "../ai/embeddingService.js";

import { searchCode }
    from "./vectorStore.js";


// -----------------------------------------
// Search relevant code
// -----------------------------------------

export const searchRelevantCode = async (
    query,
    repository,
    limit = 5
) => {

    try {

        console.log(
            `Searching code for: "${query}"`
        );

        console.log(
            `Repository: ${repository}`
        );


        // ---------------------------------
        // 1. Generate query embedding
        // ---------------------------------

        const embedding =
            await generateEmbedding(query);

        console.log(
            `Query embedding generated: ${embedding.length}`
        );


        // ---------------------------------
        // 2. Search ChromaDB
        // ---------------------------------

        const results =
            await searchCode({

                embedding,

                limit,

                repository

            });


        // ---------------------------------
        // 3. Log result count
        // ---------------------------------

        const resultCount =
            results.ids?.[0]?.length || 0;

        console.log(
            `Found ${resultCount} results`
        );


        return results;

    } catch (error) {

        console.error(
            "Code retrieval failed:",
            error.message
        );

        throw error;
    }
};