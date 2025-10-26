import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";

async function getCompilationResult(fetchFn: typeof fetch, textareaContent: string) {
    const response = await fetchFn("/api/compiler", {
        method: "POST",
        body: JSON.stringify({ textareaContent }),
        headers: { "content-type": "application/json" },
    });

    let response_data = await response.json();
    console.log(response_data);
    return response_data;
}

export const actions = {
    // default: async (event) => {
    //     // TODO log the user in
    // },
    submitCode: async ({ fetch, request }) => {
        const data = await request.formData();
        const textareaContent = data.get("codecontent");

		if (!textareaContent) {
			return fail(400, {textareaContent, missing: true});
		}

		// TODO: implement static code analysis here to check if the code is valid
		// if there are syntax error/any errors that can be detected statically, return fail()

        if (typeof textareaContent !== "string") {
            throw error(400, "Invalid code content");
        }

        const outputData = await getCompilationResult(fetch, textareaContent);

		return {
			success: true,
			output: outputData
		}
    },
} satisfies Actions;

function padExistsInDatabase(pad: string) {
    return true;
}

function getEditorData(padName: string) {
    return {
        title: "Example title",
        editorContent: "Example editor content",
        language: "Javascript",
        compilerOpions: ["-O1", "-Wall", "-Wextra"],
    };
}



export const load: PageServerLoad = ({ params }) => {
    // console.log(params.pad);

    if (!padExistsInDatabase(params.pad)) error(404, "Pad Not Found");

    const data = getEditorData(params.pad);

    return data;

    // query api for pad content, author, title, language, metadata etc.
    // using params.pad

    // error(404, 'Not found');
};
