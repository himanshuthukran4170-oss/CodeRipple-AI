import {
    getRepository,
    getBranch,
    getRepositoryTree
} from "../github/githubService.js";

export const indexRepository = async (
    installationId,
    owner,
    repo
) => {
    console.log(
        `Indexing ${owner}/${repo}...`
    );

    const repository = await getRepository(
        installationId,
        owner,
        repo
    );

    const branch = await getBranch(
        installationId,
        owner,
        repo,
        repository.default_branch
    );

    const treeSha = branch.commit.commit.tree.sha;

    const tree = await getRepositoryTree(
        installationId,
        owner,
        repo,
        treeSha
    );

    return {
        repository,
        tree
    };
};