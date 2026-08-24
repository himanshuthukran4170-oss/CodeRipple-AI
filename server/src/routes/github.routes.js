import express from "express";

import {
    getGitHubRepositories,
    getGitHubInstallation
} from "../controllers/github.controller.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.get(
    "/installation",
    protect,
    getGitHubInstallation
);

router.get(
    "/repositories",
    protect,
    getGitHubRepositories
);

export default router;