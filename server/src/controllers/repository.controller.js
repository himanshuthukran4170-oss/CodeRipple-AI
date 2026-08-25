import {
    getMyInstallation
} from "../services/github/githubService.js";

import {
    indexRepository
} from "../services/repository/repositoryIndexer.js";

export const analyzeRepository = async (req, res) => {
    try {
        const {
            owner,
            repo
        } = req.body;

        if (!owner || !repo) {
            return res.status(400).json({
                message:
                    "Owner and repository name are required"
            });
        }

        const username =
            process.env.GITHUB_USERNAME;

        const installation =
            await getMyInstallation(username);

        const result =
            await indexRepository(
                installation.id,
                owner,
                repo
            );

            res.json({
                message: "Repository indexed successfully",
            
                repository: {
                    name: result.repository.name,
                    fullName: result.repository.full_name,
                    defaultBranch: result.repository.default_branch
                },
            
                totalFiles: result.analyzedFiles.length,
            
                files: result.analyzedFiles.map((file) => ({
                    path: file.path,
                    sha: file.sha,
                    size: file.size,
            
                    analysis: file.analysis
                })),
                dependencies:
                    result.dependencies
            });

    } catch (error) {
        console.error(
            "Repository indexing error:",
            error.response?.data ||
            error.message
        );

        res.status(500).json({
            message:
                "Failed to index repository"
        });
    }
};