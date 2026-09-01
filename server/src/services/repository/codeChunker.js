import { parse } from "@babel/parser";


// -----------------------------------------
// Parse source code
// -----------------------------------------

const parseCode = (code, filePath) => {

    const isTypeScript =
        filePath.endsWith(".ts") ||
        filePath.endsWith(".tsx");

    const plugins = [
        "jsx",
        "classProperties",
        "objectRestSpread",
        "optionalChaining",
        "nullishCoalescingOperator",
        "dynamicImport"
    ];

    if (isTypeScript) {
        plugins.push("typescript");
    }

    try {

        return parse(code, {
            sourceType: "unambiguous",
            plugins
        });

    } catch (error) {

        console.error(
            `Failed to parse ${filePath}:`,
            error.message
        );

        return null;
    }
};


// -----------------------------------------
// Generate code from AST node
// -----------------------------------------

const getNodeCode = (node, code) => {

    if (
        node.start === undefined ||
        node.end === undefined
    ) {
        return "";
    }

    return code.slice(
        node.start,
        node.end
    );
};


// -----------------------------------------
// Create AST based code chunks
// -----------------------------------------

export const createCodeChunks = (
    analyzedFiles
) => {

    const chunks = [];


    for (const file of analyzedFiles) {

        const code = file.content;

        if (!code) {
            continue;
        }


        console.log(
            `Chunking: ${file.path}`
        );


        const ast = parseCode(
            code,
            file.path
        );


        if (!ast) {
            continue;
        }


        // ---------------------------------
        // Recursively walk AST
        // ---------------------------------

        const walk = (node) => {

            if (!node || typeof node !== "object") {
                return;
            }


            // -----------------------------
            // Function declaration
            // -----------------------------

            if (
                node.type ===
                "FunctionDeclaration"
            ) {

                chunks.push({

                    filePath: file.path,

                    type: "function",

                    name:
                        node.id?.name ||
                        "anonymous",

                    startLine:
                        node.loc?.start.line ||
                        null,

                    endLine:
                        node.loc?.end.line ||
                        null,

                    content:
                        getNodeCode(
                            node,
                            code
                        )
                });
            }


            // -----------------------------
            // Arrow function
            // -----------------------------

            if (
                node.type ===
                "VariableDeclarator" &&
                node.init?.type ===
                "ArrowFunctionExpression"
            ) {

                chunks.push({

                    filePath: file.path,

                    type: "arrow-function",

                    name:
                        node.id?.name ||
                        "anonymous",

                    startLine:
                        node.loc?.start.line ||
                        null,

                    endLine:
                        node.loc?.end.line ||
                        null,

                    content:
                        getNodeCode(
                            node,
                            code
                        )
                });
            }


            // -----------------------------
            // Class declaration
            // -----------------------------

            if (
                node.type ===
                "ClassDeclaration"
            ) {

                chunks.push({

                    filePath: file.path,

                    type: "class",

                    name:
                        node.id?.name ||
                        "anonymous",

                    startLine:
                        node.loc?.start.line ||
                        null,

                    endLine:
                        node.loc?.end.line ||
                        null,

                    content:
                        getNodeCode(
                            node,
                            code
                        )
                });
            }


            // -----------------------------
            // Visit child AST nodes
            // -----------------------------

            for (
                const key of Object.keys(node)
            ) {

                // Ignore Babel metadata
                if (
                    key === "loc" ||
                    key === "start" ||
                    key === "end" ||
                    key === "tokens" ||
                    key === "comments"
                ) {
                    continue;
                }


                const child = node[key];


                if (Array.isArray(child)) {

                    for (const item of child) {

                        if (
                            item &&
                            typeof item === "object" &&
                            item.type
                        ) {
                            walk(item);
                        }
                    }

                } else if (
                    child &&
                    typeof child === "object" &&
                    child.type
                ) {

                    walk(child);
                }
            }
        };


        walk(ast);
    }


    return chunks;
};