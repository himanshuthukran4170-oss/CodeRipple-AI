import { answerCodeQuestion } from "../services/ai/codeQuestionService.js";

export const askCodeQuestion = async (req, res) => {
    try {

        const { question, repository } = req.body;

        // Validate input
        if (!question || !repository) {
            return res.status(400).json({
                success: false,
                message: "Question and repository are required"
            });
        }

        console.log(
            `Code question received: "${question}"`
        );

        console.log(
            `Repository: ${repository}`
        );

        // Run complete RAG pipeline
        const result = await answerCodeQuestion({
            question,
            repository,
            limit: 5
        });

        return res.status(200).json({
            success: true,
            question: result.question,
            answer: result.answer,
            sources: result.sources
        });

    } catch (error) {

        console.error(
            "Code question controller failed:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to answer code question"
        });
    }
};