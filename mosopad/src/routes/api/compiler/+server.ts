import { error, json, text } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { compile } from "./compilecpp";


export const POST: RequestHandler = async ({ request, url }) => {
    const data = await request.json();

    const rawContent: string = data.textareaContent;
    const optimizationLevel: string = data.optimizationLevel;
    const compilerOptions: string[] = data.compilerFlags;

    // Accept c++ code string from request and write contents to temporary file
    // Run g++ temp.cpp -o temp.out
    // Exexute ./temp.out and return stdout/stderr
    // console.log(rawContent);
    console.log("Opt level: ", optimizationLevel);
    console.log("Compiler options: ", compilerOptions);
    let output = await compile(rawContent, optimizationLevel, compilerOptions);
    // console.log(output)
    
    return json(output);
};

export const fallback: RequestHandler = async ({ request }) => {
    return text(`I caught your ${request.method} request!`);
};
