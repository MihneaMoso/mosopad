import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function padExistsInDatabase (pad: string) {
	return true;
}

function getEditorData (padName: string) {
	return {
		title: "Example title",
		editorContent: "Example editor content",
		language: "Javascript",
		compilerOpions: "-O1 -Wall -Wextra"
	}
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