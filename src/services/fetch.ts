import axios from "axios";

export function splitToChunks<T>(items: T[], chunkSize: number = 50) {
	const result = [];
	for (let i = 0; i < items.length; i += chunkSize) {
		result.push(items.slice(i, i + chunkSize));
	}
	return result;
}

async function pages(paths: string[]) {
	const requests = paths.map((path) => axios.get(path, { timeout: 10000 }));
	const chunks = splitToChunks(requests);
	const results: string[] = [];
	for (const chunk of chunks) {
		const responses = await Promise.all(chunk);
		responses.forEach((res) => {
			results.push(res.data);
		});
	}

	return results;
}

export default { pages };
