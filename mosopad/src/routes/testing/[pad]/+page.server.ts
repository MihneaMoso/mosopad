import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
    // console.log(params.pad);
	if (params.pad === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

    // query api for pad content, author, title, language, metadata etc.
    // using params.pad

    
	error(404, 'Not found');
};