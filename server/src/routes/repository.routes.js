import express from "express";

import {
    analyzeRepository
} from "../controllers/repository.controller.js";
import {
    analyzeRepositoryImpact
} from "../controllers/repository.controller.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/analyze",
    protect,
    analyzeRepository
);
router.post(
    "/impact",
    analyzeRepositoryImpact
);

export default router;