import {
    getRepository,
    getBranch,
    getRepositoryTree
} from "../github/githubService.js";

import {
    embedAndStoreChunks
} from "../vector/chunkEmbeddingService.js";

import {
    filterSourceFiles
} from "./fileFilter.js";

import {
    fetchAndAnalyzeFile
} from "./fileFetcher.js";

import {
    buildDependencyGraph
} from "./dependencyAnalyzer.js";

import {
    createCodeChunks
}from "./codeChunker.js";

export const indexRepository = async (
    installationId,
    owner,
    repo
) => {

    console.log(
        `Indexing ${owner}/${repo}`
    );


    // ========================================
    // 1. Get repository information
    // ========================================

    const repository =
        await getRepository(
            installationId,
            owner,
            repo
        );

    console.log(
        `Repository: ${repository.full_name}`
    );

    console.log(
        `Default branch: ${repository.default_branch}`
    );


    // ========================================
    // 2. Get default branch
    // ========================================

    const branch =
        await getBranch(
            installationId,
            owner,
            repo,
            repository.default_branch
        );


    // ========================================
    // 3. Get Tree SHA
    // ========================================

    const treeSha =
        branch.commit.commit.tree.sha;

    console.log(
        `Tree SHA: ${treeSha}`
    );


    // ========================================
    // 4. Get complete repository tree
    // ========================================

    const tree =
        await getRepositoryTree(
            installationId,
            owner,
            repo,
            treeSha
        );

    console.log(
        `Total tree entries: ${tree.tree.length}`
    );


    // ========================================
    // 5. Filter useful source files
    // ========================================

    const sourceFiles =
        filterSourceFiles(
            tree.tree
        );

    console.log(
        `Useful source files: ${sourceFiles.length}`
    );


    // ========================================
    // 6. Fetch and analyze files
    // ========================================

    const analyzedFiles = [];


    for (const file of sourceFiles) {

        try {

            console.log(
                `Analyzing: ${file.path}`
            );


            const analyzedFile =
                await fetchAndAnalyzeFile(
                    installationId,
                    owner,
                    repo,
                    file.path
                );


            analyzedFiles.push(
                analyzedFile
            );


        } catch (error) {

            console.error(
                `Failed to analyze ${file.path}:`,
                error.message
            );
        }
    }


    // ========================================
    // 7. Build dependency graph
    // ========================================

    const dependencies =
        buildDependencyGraph(
            analyzedFiles
        );


    console.log(
        `Dependencies found: ${dependencies.length}`
    );

    const chunks =
        createCodeChunks(
            analyzedFiles
        );

    console.log(
        `Code chunks created: ${chunks.length}`
    );
    // ========================================
    // 8. Generate embeddings and store chunks
    // ========================================

    const storedChunks =
        await embedAndStoreChunks(
            repository,
            chunks
        );

    console.log(
        `Stored chunks: ${storedChunks}/${chunks.length}`
    );
    // 9. Return complete repository analysis
    return {

        // Repository metadata
        repository,

        // Complete Git tree
        tree,

        // Filtered source files
        sourceFiles,

        // Source files + AST analysis
        analyzedFiles,

        // File-to-file dependencies
        dependencies,
        chunks,
        storedChunks
    };
};