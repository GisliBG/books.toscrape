import * as fs from "fs";
import path from "path";
import * as stream from "stream";
import { promisify } from "util";

const base = "./files";

function directoryIsMissing(directory: string) {
	return !fs.existsSync(directory);
}

function createDirectory(directory: string) {
	fs.mkdirSync(directory, { recursive: true });
}

function save(
	link: string,
	content: string,
	callback: (error: NodeJS.ErrnoException | null) => void
) {
	const filePath = link.replace("https://books.toscrape.com/", "");
	const dirPath = path.dirname(`${base}/${filePath}`);

	if (directoryIsMissing(dirPath)) {
		createDirectory(dirPath);
	}

	fs.writeFile(`${base}/${filePath}`, content, callback);
}

async function saveStreams(sources: string[], streams: stream.Readable[]) {
	const pipeline = promisify(stream.pipeline);
	for (const [index, stream] of streams.entries()) {
		const filePath = sources[index].replace("https://books.toscrape.com/", "");
		const dirPath = path.dirname(`${base}/${filePath}`);

		if (directoryIsMissing(dirPath)) {
			createDirectory(dirPath);
		}

		const writeStream = fs.createWriteStream(`${base}/${filePath}`);
		await pipeline(stream, writeStream);
	}
}

export default { save, saveStreams };
