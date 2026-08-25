import path from "path";


// Extensions that we support
const extensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs"
];


// ----------------------------------------
// Normalize repository paths
// ----------------------------------------

const normalizeRepoPath = (filePath) => {
    return filePath
        .replace(/\\/g, "/")
        .replace(/^\.\/+/, "");
};


// ----------------------------------------
// Resolve an import
// ----------------------------------------

const resolveImport = (
    currentFile,
    importPath,
    allFiles
) => {

    // Ignore external packages
    //
    // react
    // axios
    // express
    // mongoose
    //
    // These are NOT internal files.
    if (!importPath.startsWith(".")) {
        return null;
    }


    // Normalize everything to POSIX-style paths
    const normalizedCurrentFile =
        normalizeRepoPath(currentFile);

    const normalizedImportPath =
        normalizeRepoPath(importPath);


    // Directory of current file
    //
    // Example:
    //
    // frontend/src/App.jsx
    //
    // becomes:
    //
    // frontend/src
    const currentDir =
        path.posix.dirname(
            normalizedCurrentFile
        );


    // Resolve the relative import
    //
    // Example:
    //
    // current:
    // frontend/src/App.jsx
    //
    // import:
    // ./pages/Login
    //
    // result:
    // frontend/src/pages/Login
    const absolutePath =
        path.posix.normalize(
            path.posix.join(
                currentDir,
                normalizedImportPath
            )
        );


    // Normalize all repository files
    const normalizedFiles =
        allFiles.map(
            normalizeRepoPath
        );


    // ----------------------------------------
    // 1. Exact match
    // ----------------------------------------

    const exactMatch =
        normalizedFiles.find(
            (file) =>
                file === absolutePath
        );

    if (exactMatch) {
        return exactMatch;
    }


    // ----------------------------------------
    // 2. Try file extensions
    // ----------------------------------------

    for (const extension of extensions) {

        const fileWithExtension =
            absolutePath + extension;


        const match =
            normalizedFiles.find(
                (file) =>
                    file === fileWithExtension
            );


        if (match) {
            return match;
        }
    }


    // ----------------------------------------
    // 3. Try index files
    // ----------------------------------------

    for (const extension of extensions) {

        const indexFile =
            path.posix.join(
                absolutePath,
                `index${extension}`
            );


        const match =
            normalizedFiles.find(
                (file) =>
                    file === indexFile
            );


        if (match) {
            return match;
        }
    }


    // ----------------------------------------
    // Nothing found
    // ----------------------------------------

    return null;
};


// ----------------------------------------
// Build dependency graph
// ----------------------------------------

export const buildDependencyGraph = (
    analyzedFiles
) => {

    // All repository files
    const allFiles =
        analyzedFiles.map(
            (file) => file.path
        );


    const dependencies = [];


    // ----------------------------------------
    // Process every file
    // ----------------------------------------

    for (const file of analyzedFiles) {

        const imports =
            file.analysis?.imports || [];


        // Process every import
        for (const imported of imports) {

            const importPath =
                imported.source;


            // Resolve import
            const target =
                resolveImport(
                    file.path,
                    importPath,
                    allFiles
                );
                console.log(
                    `${file.path} -> ${importPath} -> ${target}`
                );
                

            // External/unresolved import
            if (!target) {
                continue;
            }


            // Add dependency edge
            dependencies.push({
                from: normalizeRepoPath(
                    file.path
                ),

                to: target,

                type: "import"
            });
        }
    }


    return dependencies;
};