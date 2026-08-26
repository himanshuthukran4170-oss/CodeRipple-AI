export const createCodeChunks = (
    analyzedFiles
) => {

    const chunks = [];

    for (const file of analyzedFiles) {

        const analysis =
            file.analysis;

        if (!analysis) {
            continue;
        }

        // File-level chunk for now
        chunks.push({
            filePath: file.path,
            type: "file",
            name: file.path,
            startLine: 1,
            endLine: null,
            content: file.content
        });
    }

    return chunks;
};