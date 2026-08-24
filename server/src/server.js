import "dotenv/config";
// console.log("APP ID:",process.env.GITHUB_APP_ID);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import githubRoutes from "./routes/github.routes.js";
import repositoryRoutes from "./routes/repository.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "CodeRipple AI Server is running 🚀"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/github",githubRoutes);
app.use(
    "/api/repositories",
    repositoryRoutes
);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});