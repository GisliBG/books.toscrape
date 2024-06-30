import * as fs from "fs";
import path from "path";

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

export default { save };
