import axios from "axios";
import { load } from "cheerio";
import * as fs from "fs";
import path from "path";

const booksToScrapeURL = "https://books.toscrape.com/";

function directoryIsMissing(directory: string) {
	return !fs.existsSync(directory);
}

function createDirectory(directory: string) {
	fs.mkdirSync(directory, { recursive: true });
}

function writeFileToDirectory(filePath: string, content: string) {
	const dirPath = path.dirname(filePath);
	// console.log(filePath, dirPath);
	if (directoryIsMissing(dirPath)) {
		createDirectory(dirPath);
	}
	fs.writeFile(filePath, content, function (err) {
		if (err) {
			console.log("Error saving to file", err);
		} else {
			console.log("successfully saved!", path);
		}
	});
}

function weHaveUnvisitedLinks(links: Map<string, boolean>) {
	for (const value of links.values()) {
		if (!value) {
			return true;
		}
	}
	return false;
}

async function main() {
	const page = await axios.get(booksToScrapeURL);

	const directory = "./books";
	if (directoryIsMissing(directory)) {
		createDirectory(directory);
	}
	writeFileToDirectory(`${directory}/index.html`, page.data);

	const $ = load(page.data);
	const linkObjects = $("a");

	const links = new Map<string, boolean>([["index.html", true]]);
	linkObjects.each((index, element) => {
		const href = $(element).attr("href");
		if (href) {
			links.set(href, false);
		}
	});

	while (weHaveUnvisitedLinks(links)) {
		for (const [key, value] of links) {
			if (!value) {
				const page = await axios.get(`${booksToScrapeURL}${key}`);
				writeFileToDirectory(`./books/${key}`, page.data);
				links.set(key, true);
				const $ = load(page.data);
				$("a").each((index, element) => {
					const href = $(element).attr("href");

					if (href && !links.has(href)) {
						links.set(href, false);
					}
				});
			}
		}
	}
	console.log("All done!");
}

main();
