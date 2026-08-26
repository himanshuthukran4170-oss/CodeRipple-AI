import {
    getMyInstallation
} from "../services/github/githubService.js";

import {
    indexRepository
} from "../services/repository/repositoryIndexer.js";
import {
    analyzeImpact
} from "../services/repository/impactAnalyzer.js";

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
                    result.dependencies,
                chunks:result.chunks
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

export const analyzeRepositoryImpact = async (
    req,
    res
) => {

    try {

        const {
            owner,
            repo,
            changedFile
        } = req.body;


        if (
            !owner ||
            !repo ||
            !changedFile
        ) {

            return res.status(400).json({
                message:
                    "Owner, repository and changed file are required"
            });
        }


        const username =
            process.env.GITHUB_USERNAME;


        const installation =
            await getMyInstallation(
                username
            );


        const result =
            await indexRepository(
                installation.id,
                owner,
                repo
            );


        const impact =
            analyzeImpact(
                result.dependencies,
                changedFile
            );


        res.json({
            message:
                "Impact analysis completed",

            repository: {
                name:
                    result.repository.name,

                fullName:
                    result.repository.full_name
            },

            impact
        });


    } catch (error) {

        console.error(
            "Impact analysis error:",
            error.message
        );


        res.status(500).json({
            message:
                "Failed to analyze repository impact"
        });
    }
};