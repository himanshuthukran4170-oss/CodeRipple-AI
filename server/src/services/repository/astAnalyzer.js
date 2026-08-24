import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export const analyzeCode = (code, filePath) => {
    try {
        const ast = parse(code, {
            sourceType: "unambiguous",
            sourceFilename: filePath,

            plugins: [
                "jsx",
                "typescript"
            ]
        });

        const functions = [];
        const classes = [];
        const imports = [];
        const exports = [];

        traverse(ast, {

            FunctionDeclaration(path) {
                functions.push({
                    name:
                        path.node.id?.name ||
                        "anonymous",

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            },

            FunctionExpression(path) {
                functions.push({
                    name:
                        path.node.id?.name ||
                        "anonymous",

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            },

            ArrowFunctionExpression(path) {
                functions.push({
                    name: "arrow function",

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            },

            ClassDeclaration(path) {
                classes.push({
                    name:
                        path.node.id?.name ||
                        "anonymous",

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            },

            ImportDeclaration(path) {
                imports.push({
                    source:
                        path.node.source.value,

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            },

            ExportNamedDeclaration(path) {
                exports.push({
                    type: "named",

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            },

            ExportDefaultDeclaration(path) {
                exports.push({
                    type: "default",

                    line:
                        path.node.loc?.start.line ||
                        null
                });
            }
        });

        return {
            filePath,
            functions,
            classes,
            imports,
            exports
        };

    } catch (error) {

        console.error(
            `AST analysis failed for ${filePath}:`,
            error.message
        );

        return null;
    }
};
// const testCode = `
// import express from "express";

// function hello() {
//     console.log("Hello");
// }

// const add = (a, b) => {
//     return a + b;
// };

// export default hello;
// `;

// console.log(
//     analyzeCode(testCode, "test.js")
// );