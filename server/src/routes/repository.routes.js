import express from "express";

import {
    analyzeRepository
} from "../controllers/repository.controller.js";

import protect from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/analyze",
    protect,
    analyzeRepository
);

export default router;