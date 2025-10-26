import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '../compiler/$types';

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
	const min = data.min;
	const max = data.max;

	const d = max - min;

	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;
    

	return json(Math.floor(random));
};