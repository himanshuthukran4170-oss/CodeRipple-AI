import {
    searchRelevantCode
} from "./codeSearchService.js";


console.log(
    "CODE SEARCH TEST STARTED"
);


// -----------------------------------------
// Repository
// -----------------------------------------

const repository =
    "himanshuthukran4170-oss/student-welfare-system";


// -----------------------------------------
// Search query
// -----------------------------------------

const query =
    "How does user login work?";


try {

    const results =
        await searchRelevantCode(
            query,
            repository,
            5
        );


    console.log(
        "\nSEARCH RESULTS\n"
    );


    console.dir(
        results,
        {
            depth: null
        }
    );


} catch (error) {

    console.error(
        "\nSEARCH FAILED:"
    );

    console.error(
        error.message
    );
}