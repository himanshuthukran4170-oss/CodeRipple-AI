import githubApp from "../../config/github.js";

export const getInstallationToken = async (installationId) => {
    const response = await githubApp.auth({
        type: "installation",
        installationId: Number(installationId)
    });

    return response.token;
};