import { Octokit } from "octokit";
import { getInstallationToken } from "./githubAuth.js";
import githubApp from "../../config/github.js";

export const getInstallationOctokit = async (installationId) => {
    const token = await getInstallationToken(installationId);

    return new Octokit({
        auth: token
    });
};

export const getRepository = async (
    installationId,
    owner,
    repo
) => {
    const octokit = await getInstallationOctokit(
        installationId
    );

    const response = await octokit.request(
        "GET /repos/{owner}/{repo}",
        {
            owner,
            repo
        }
    );

    return response.data;
};

export const getMyInstallation = async (username) => {
    const response = await githubApp.request(
        "GET /users/{username}/installation",
        {
            username
        }
    );

    return response.data;
};
export const getRepositoryTree = async (
    installationId,
    owner,
    repo,
    treeSha
) => {
    const octokit = await getInstallationOctokit(
        installationId
    );

    const response = await octokit.request(
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
        {
            owner,
            repo,
            tree_sha: treeSha,
            recursive: "1"
        }
    );

    return response.data;
};
export const getBranch = async (
    installationId,
    owner,
    repo,
    branch
) => {
    const octokit = await getInstallationOctokit(
        installationId
    );

    const response = await octokit.request(
        "GET /repos/{owner}/{repo}/branches/{branch}",
        {
            owner,
            repo,
            branch
        }
    );

    return response.data;
};