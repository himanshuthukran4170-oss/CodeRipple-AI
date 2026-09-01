import { searchRelevantCode } from "../vector/codeSearchService.js";
import { generateCodeAnswer } from "./codeAnswerService.js";

export const answerCodeQuestion = async ({
    question,
    repository,
    limit = 5
}) => {

    console.log(`Question: "${question}"`);

    // 1. Find relevant code
    const searchResults = await searchRelevantCode(
        question,
        repository,
        limit
    );

    // 2. Generate answer using retrieved code
    const answer = await generateCodeAnswer({
        question,
        searchResults
    });

    return {
        question,
        answer,
        sources: searchResults.metadatas?.[0] || []
    };
};