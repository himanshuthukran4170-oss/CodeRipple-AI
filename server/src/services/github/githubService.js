import { Octokit } from "octokit";
import { getInstallationToken } from "./githubAuth.js";
import githubApp from "../../config/github.js";

export const getInstallationOctokit = async (installationId) => {
    const token = await getInstallationToken(installationId);

    return new Octokit({
        auth: token
    });
};

export const getRepositories = async (installationId) => {
    const octokit = await getInstallationOctokit(installationId);
    //we get an authenticated api client
    const response = await octokit.request(
        "GET /installation/repositories"
    );
    //by this we are saying gitHub ,give me all repo that are available to this installation
    return response.data.repositories;
};

export const getMyInstallation = async (username) => {
    const response = await githubApp.request(
        "GET /users/{username}/installation",
        {
            username
        }
    );
    //this is to get the installation id from the username
    return response.data;
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
    //this is to get information about one repo
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
// we have done this because we want to get the tree information for the repo default branch
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

export const getRepositoryTree = async (
    installationId,
    owner,
    repo,
    treeSha
) => {
    const octokit = await getInstallationOctokit(
        installationId
    );
    //here i am saying give me the entire file tree for this repository
    const response = await octokit.request(
        "GET /repos/{owner}/{repo}/git/trees/{treeSha}",
        {
            owner,
            repo,
            treeSha,
            recursive: "1"//without this i have to manually go to each directory
        }
    );

    return response.data;
};
export const getFileContent = async (
    installationId,
    owner,
    repo,
    path
) => {
    const octokit =
        await getInstallationOctokit(
            installationId
        );

    const response =
        await octokit.request(
            "GET /repos/{owner}/{repo}/contents/{path}",
            {
                owner,
                repo,
                path
            }
        );

    return response.data;
};