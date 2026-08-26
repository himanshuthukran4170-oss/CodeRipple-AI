/*
    Impact Analysis

    Given a dependency graph and a changed file,
    find all files that directly or indirectly
    depend on that file.
*/


export const analyzeImpact = (
    dependencies,
    changedFile
) => {

    // ----------------------------------------
    // Normalize path
    // ----------------------------------------

    const normalizedChangedFile =
        changedFile.replace(/\\/g, "/");


    // ----------------------------------------
    // Build reverse dependency graph
    //
    // If:
    //
    // A -> B
    //
    // it means:
    //
    // A depends on B
    //
    // For impact analysis we need:
    //
    // B -> A
    //
    // because if B changes,
    // A may be affected.
    // ----------------------------------------

    const reverseGraph = new Map();


    for (const dependency of dependencies) {

        const from =
            dependency.from
                .replace(/\\/g, "/");

        const to =
            dependency.to
                .replace(/\\/g, "/");


        if (!reverseGraph.has(to)) {

            reverseGraph.set(
                to,
                []
            );
        }


        reverseGraph
            .get(to)
            .push(from);
    }


    // ----------------------------------------
    // BFS
    // ----------------------------------------

    const affectedFiles = [];

    const visited = new Set();

    const queue = [];


    // Start from changed file

    queue.push(
        normalizedChangedFile
    );

    visited.add(
        normalizedChangedFile
    );


    while (queue.length > 0) {

        const currentFile =
            queue.shift();


        const dependents =
            reverseGraph.get(
                currentFile
            ) || [];


        for (const dependent of dependents) {

            if (visited.has(dependent)) {
                continue;
            }


            visited.add(dependent);

            affectedFiles.push(
                dependent
            );

            queue.push(
                dependent
            );
        }
    }


    return {
        changedFile:
            normalizedChangedFile,

        affectedFiles,

        totalAffected:
            affectedFiles.length
    };
};