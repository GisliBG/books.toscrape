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
		const unvisitedLinks: string[] = [];
		for (const [key, value] of links) {
			if (!value) {
				unvisitedLinks.push(key);
			}
		}

		try {
			const pages = await fetch.pages(unvisitedLinks);
			pages.forEach((page, index) => {
				const link = unvisitedLinks[index];
				links.set(link, true);

				filehandler.save(unvisitedLinks[index], page, (err) => {
					if (err) {
						console.log(
							"There was an error saving page",
							unvisitedLinks[index]
						);
						links.set(unvisitedLinks[index], false);
					} else {
						console.log("Succesfully saved page", unvisitedLinks[index]);
					}
				});

				const $ = load(page);
				$("a").each((index, element) => {
					const href = $(element).attr("href");

					if (href) {
						const absolutUrl = new URL(href, link).href;
						if (!links.has(absolutUrl)) links.set(absolutUrl, false);
					}
				});
			});
		} catch (error) {
			console.log(error);
		}
	}
	console.log("All done!");
}

export default {
	start,
};
