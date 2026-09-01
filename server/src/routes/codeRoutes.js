import express from "express";
import { askCodeQuestion } from "../controllers/codeController.js";

const router = express.Router();

router.post("/ask", askCodeQuestion);

export default router;