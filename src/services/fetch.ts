import axios from "axios";
import * as stream from "stream";

export function splitToChunks<T>(items: T[], chunkSize: number = 50) {
	const result = [];
	for (let i = 0; i < items.length; i += chunkSize) {
		result.push(items.slice(i, i + chunkSize));
	}
	return result;
}

async function pages(paths: string[]) {
	const requests = paths.map((path) =>
		axios.get<string>(path, { timeout: 10000 })
	);
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

async function images(paths: string[]) {
	const requests = paths.map((path) =>
		axios.get<stream.Readable>(path, {
			timeout: 10000,
			responseType: "stream",
		})
	);
	const chunks = splitToChunks(requests);
	const results: stream.Readable[] = [];
	for (const chunk of chunks) {
		const responses = await Promise.all(chunk);
		responses.forEach((res) => {
			results.push(res.data);
		});
	}
	return results;
}

export default { pages, images };
