import { answerCodeQuestion } from "./codeQuestionService.js";

console.log("CODE QUESTION TEST STARTED");

const result = await answerCodeQuestion({
    question: "How does user login work?",
    repository: "himanshuthukran4170-oss/student-welfare-system",
    limit: 5
});

console.log("\nANSWER:\n");
console.log(result.answer);

console.log("\nSOURCES:\n");
console.log(result.sources);