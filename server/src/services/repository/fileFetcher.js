import {
    getFileContent
} from "../github/githubService.js";

import {
    analyzeCode
} from "./astAnalyzer.js";

export const fetchAndAnalyzeFile = async (
    installationId,
    owner,
    repo,
    filePath
) => {
    const file = await getFileContent(
        installationId,
        owner,
        repo,
        filePath
    );

    if (Array.isArray(file)) {
        throw new Error(
            `${filePath} is a directory`
        );
    }

    const content = Buffer.from(
        file.content,
        "base64"
    ).toString("utf-8");

    const analysis = analyzeCode(
        content,
        filePath
    );

    return {
        path: file.path,
        sha: file.sha,
        size: file.size,
        content,
        analysis
    };
};
//github return file content encoded in base64. buffer decode it into bytes (to string)convert byte into normal text