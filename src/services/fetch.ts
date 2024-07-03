import axios from "axios";
import * as stream from "stream";

export function splitToChunks<T>(items: Promise<T>[], chunkSize: number = 50) {
	const result = [];
	for (let i = 0; i < items.length; i += chunkSize) {
		const chunk = items.slice(i, i + chunkSize);
		result.push(chunk);
	}
	return result;
}

async function pages(paths: string[]) {
	const requests = paths.map((path) => axios.get<string>(path));
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

async function streams(paths: string[]) {
	const requests = paths.map((path) => {
		return axios.get<stream.Readable>(path, {
			responseType: "stream",
		});
	});
	const chunks = splitToChunks(requests, 20);
	const results: stream.Readable[] = [];
	for (const chunk of chunks) {
		const responses = await Promise.all(chunk);
		responses.forEach((res) => {
			results.push(res.data);
		});
	}
	return results;
}

export default { pages, streams };
