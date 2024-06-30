import fetch from "./fetch";
import { load } from "cheerio";
import filehandler from "./filehandler";

function weHaveUnvisitedLinks(links: Map<string, boolean>) {
	for (const value of links.values()) {
		if (!value) {
			return true;
		}
	}
	return false;
}

async function start() {
	const links = new Map<string, boolean>([
		["https://books.toscrape.com/index.html", false],
	]);
	while (weHaveUnvisitedLinks(links)) {
		for (const [key, value] of links) {
			if (!value) {
				const page = await fetch.page(key);
				links.set(key, true);

				filehandler.save(key, page, (err) => {
					if (err) {
						console.log("There was an error saving page", key);
						links.set(key, false);
					} else {
						console.log("Succesfully saved page", key);
					}
				});

				const $ = load(page);
				$("a").each((index, element) => {
					const href = $(element).attr("href");

					if (href && !links.has(href)) {
						const absolutUrl = new URL(href, key).href;
						links.set(absolutUrl, false);
					}
				});
			}
		}
	}
	console.log("All done!");
}

export default {
	start,
};
