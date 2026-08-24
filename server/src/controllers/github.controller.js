import {
    getRepositories,
    getMyInstallation
} from "../services/github/githubService.js";

export const getGitHubInstallation = async (req, res) => {
    try {
        const username = process.env.GITHUB_USERNAME;

        if (!username) {
            return res.status(500).json({
                message: "GitHub username is missing"
            });
        }

        const installation = await getMyInstallation(username);

        res.json({
            installationId: installation.id,
            account: installation.account
        });

    } catch (error) {
        console.error("========== GITHUB ERROR ==========");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Response:", error.response?.data);
        console.error("=================================");

        res.status(500).json({
            message: "Failed to get GitHub installation"
        });
    }
};


export const getGitHubRepositories = async (req, res) => {
    try {
        const username = process.env.GITHUB_USERNAME;

        if (!username) {
            return res.status(500).json({
                message: "GitHub username is missing"
            });
        }

        const installation = await getMyInstallation(username);

        const repositories = await getRepositories(
            installation.id
        );

        res.json({
            repositories
        });

    } catch (error) {
        console.error(
            "GitHub Repository Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch GitHub repositories"
        });
    }
};