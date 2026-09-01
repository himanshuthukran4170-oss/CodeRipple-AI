import { generateEmbedding } from "../ai/embeddingService.js";

import {
    storeCodeChunk
} from "./vectorStore.js";


// -----------------------------------------
// Generate ID for a code chunk
// -----------------------------------------

const createChunkId = (
    repository,
    chunk,
    index
) => {

    const safePath =
        chunk.filePath.replace(
            /[^a-zA-Z0-9]/g,
            "_"
        );

    const safeName =
        chunk.name.replace(
            /[^a-zA-Z0-9]/g,
            "_"
        );

    return `${repository.id || repository.full_name}_${safePath}_${safeName}_${index}`;
};


// -----------------------------------------
// Embed and store all code chunks
// -----------------------------------------

export const embedAndStoreChunks = async (
    repository,
    chunks
) => {

    console.log(
        `Embedding ${chunks.length} code chunks...`
    );

    let storedCount = 0;


    for (
        let i = 0;
        i < chunks.length;
        i++
    ) {

        const chunk = chunks[i];

        try {

            console.log(
                `[${i + 1}/${chunks.length}] Embedding: ${chunk.filePath}`
            );


            // ---------------------------------
            // Generate embedding
            // ---------------------------------

            const embedding =
                await generateEmbedding(
                    chunk.content
                );


            // ---------------------------------
            // Create unique ID
            // ---------------------------------

            const id =
                createChunkId(
                    repository,
                    chunk,
                    i
                );


            // ---------------------------------
            // Store in ChromaDB
            // ---------------------------------

            await storeCodeChunk({

                id,

                content:
                    chunk.content,

                embedding,

                metadata: {

                    repository:
                        repository.full_name,

                    filePath:
                        chunk.filePath,

                    type:
                        chunk.type,

                    name:
                        chunk.name,

                    startLine:
                        chunk.startLine,

                    endLine:
                        chunk.endLine

                }

            });


            storedCount++;

        } catch (error) {

            console.error(
                `Failed to process chunk ${i + 1}:`,
                error.message
            );

        }
    }


    console.log(
        `Successfully stored ${storedCount}/${chunks.length} chunks`
    );


    return storedCount;
};