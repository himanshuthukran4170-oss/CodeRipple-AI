import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
    {
        githubId: {
            type: Number,
            required: true
        },

        name: {
            type: String,
            required: true
        },

        fullName: {
            type: String,
            required: true
        },

        owner: {
            type: String,
            required: true
        },

        defaultBranch: {
            type: String,
            default: "main"
        },

        githubUrl: {
            type: String
        },

        installationId: {
            type: Number,
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Repository = mongoose.model(
    "Repository",
    repositorySchema
);

export default Repository;