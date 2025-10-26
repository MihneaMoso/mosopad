import { error, json, text } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { compile } from "./compilecpp";


export const POST: RequestHandler = async ({ request, url }) => {
    const data = await request.json();

    const rawContent = data.textareaContent;

    // Accept c++ code string from request and write contents to temporary file
    // Run g++ temp.cpp -o temp.out
    // Exexute ./temp.out and return stdout/stderr
    // console.log(rawContent);
    let output = await compile(rawContent);
    // console.log(output)
    
    return json(output);
};

export const fallback: RequestHandler = async ({ request }) => {
    return text(`I caught your ${request.method} request!`);
};
