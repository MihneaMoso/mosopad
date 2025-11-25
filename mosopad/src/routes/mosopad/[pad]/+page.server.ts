import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import type { compileData } from "../../api/compiler/compilecpp";
import { drizzle } from 'drizzle-orm/better-sqlite3';

// const db = drizzle(process.env.DATABASE_URL);


export interface EditorData {
  title: string,
  editorContent: string,
  language: string,
  compilerOptions: string[]
}

async function getCompilationResult(
  fetchFn: typeof fetch,
  textareaContent: string,
  optimizationLevel: string,
  compilerFlags: string[],
): Promise<compileData> {
  const response = await fetchFn("/api/compiler", {
    method: "POST",
    body: JSON.stringify({
      textareaContent,
      optimizationLevel,
      compilerFlags,
    }),
    headers: { "content-type": "application/json" },
  });

  let response_data: compileData = await response.json();
  console.log("Response data: ", response_data);
  return response_data;
}

export const actions = {
  // default: async (event) => {
  //     // TODO log the user in
  // },
  submitCode: async ({ fetch, request }) => {
    const data = await request.formData();
    const textareaContent = data.get("codecontent");
    const optimizationLevel = data.get("optimizationselect");
    const compilerOptions = data.get("compilerFlags");

    if (!textareaContent) {
      return fail(400, { textareaContent, missing: true });
    }
    if (!optimizationLevel) {
      return fail(400, { optimizationLevel, missing: true });
    }
    if (!compilerOptions) {
      return fail(400, { compilerOptions, missing: true });
    }

    // TODO: implement static code analysis here to check if the code is valid
    // if there are syntax error/any errors that can be detected statically, return fail()

    if (typeof textareaContent !== "string") {
      throw error(400, "Invalid code content");
    }
    if (typeof optimizationLevel !== "string") {
      throw error(400, "Invalid optimization level");
    }
    if (typeof compilerOptions !== "string") {
      throw error(400, "Invalid compiler flags");
    }

    const options = compilerOptions.split(" ");

    const outputData = await getCompilationResult(
      fetch,
      textareaContent,
      optimizationLevel,
      options,
    );

    const processedData = {
      success: true,
      optimizationLevel: optimizationLevel,
      options: options,
      output: outputData,
    };
    console.log(processedData);

    return processedData;
  },
} satisfies Actions;


function getDefaultEditorData(padName: string): EditorData {
  return {
    title: padName.charAt(0).toLocaleUpperCase() + padName.slice(1), // hello -> Hello
    editorContent: `#include <iostream>
int main() {
    std::cout << "Hello, World!";
    return 0;
}`,
    language: "CPP",
    compilerOptions: ["-O1", "-Wall", "-Wextra"],
  };
}


function padExistsInDatabase(pad: string): boolean {
  return true;
}

function getEditorData(padName: string): EditorData {
  // TODO: fetch data from database
  // default behaviour
  return getDefaultEditorData(padName);
}

export const load: PageServerLoad = ({ params }) => {
  // console.log(params.pad);

  if (!padExistsInDatabase(params.pad)) {
    const data = getDefaultEditorData(params.pad);
    return data;
  }; // TODO: change this to create  default pad instead

  const data = getEditorData(params.pad);

  return data;

  // query api for pad content, author, title, language, metadata etc.
  // using params.pad

  // error(404, 'Not found');
};
