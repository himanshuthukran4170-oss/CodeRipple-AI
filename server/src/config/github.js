import "dotenv/config";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKeyPath = path.join(
    __dirname,
    "../../secrets/github-private-key.pem"
);

const privateKey = fs.readFileSync(
    privateKeyPath,
    "utf8"
);

const appId = process.env.GITHUB_APP_ID;

if (!appId) {
    throw new Error("GITHUB_APP_ID is missing");
}

if (!privateKey) {
    throw new Error("GitHub private key is missing");
}

console.log("GitHub App configuration loaded");

const githubApp = new Octokit({
    authStrategy: createAppAuth,
    auth: {
        appId: appId,
        privateKey: privateKey
    }
});

export default githubApp;