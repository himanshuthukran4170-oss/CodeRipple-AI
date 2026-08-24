const ignoredDirectories = [
    "node_modules/",
    ".git/",
    "dist/",
    "build/",
    "coverage/",
    ".next/",
    "vendor/"
];

const allowedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs"
];

export const isUsefulFile = (path) => {
    const lowerPath = path.toLowerCase();
    for (const directory of ignoredDirectories) {
        if (lowerPath.startsWith(directory)) {
            return false;
        }

        if (lowerPath.includes(`/${directory}`)) {
            return false;
        }
    }
    return allowedExtensions.some(
        (extension) =>
            lowerPath.endsWith(extension)
    );
};

export const filterSourceFiles = (tree) => {
    return tree.filter(
        (item) =>
            item.type === "blob" &&
            isUsefulFile(item.path)
            //this means i only want actual files
            //and is this file something coderipple should analyze
    );
};