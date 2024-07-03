import fetch from "./fetch";

import filehandler from "./filehandler";
import pagehandler from "./pagehandler";

function weHaveUnvisitedLinks(links: Map<string, boolean>) {
	for (const value of links.values()) {
		if (!value) {
			return true;
		}
	}
	return false;
}

async function start(
	onError: (message: string) => void,
	onProgressUpdate: (message: string) => void,
	onSuccess: () => void
) {
	const links = new Map<string, boolean>([
		["https://books.toscrape.com/index.html", false],
	]);
	const images: string[] = [];
	while (weHaveUnvisitedLinks(links)) {
		const unvisitedLinks: string[] = [];
		for (const [key, value] of links) {
			if (!value) {
				unvisitedLinks.push(key);
			}
		}

		try {
			const pages = await fetch.pages(unvisitedLinks);
			onProgressUpdate(`succesfully fetched ${pages.length} pages`);
			pages.forEach((page, index) => {
				const link = unvisitedLinks[index];
				links.set(link, true);

				filehandler.save(unvisitedLinks[index], page, (err) => {
					if (err) {
						onError(
							`There was an error saving page
							${unvisitedLinks[index]}`
						);
						links.set(unvisitedLinks[index], false);
					} else {
						//console.log("Succesfully saved page", unvisitedLinks[index]);
					}
				});

				pagehandler.findLinks(page, (href) => {
					const absolutUrl = new URL(href, link).href;
					if (!links.has(absolutUrl)) {
						links.set(absolutUrl, false);
					}
				});
				pagehandler.findImages(page, (src) => {
					const absolutUrl = new URL(src, link).href;
					if (!images.includes(absolutUrl)) {
						images.push(absolutUrl);
					}
				});
			});
		} catch (error) {
			console.log(error);
		}
	}
	onProgressUpdate("Downloading images");
	try {
		const imgstream = await fetch.streams(images);

		await filehandler.saveStreams(images, imgstream);
	} catch (error) {
		onError(`Problem downloading images`);
	}

	onProgressUpdate("Downloading css");
	try {
		const cssStream = await fetch.streams([
			"https://books.toscrape.com/static/oscar/css/styles.css",
		]);

		await filehandler.saveStreams(
			["https://books.toscrape.com/static/oscar/css/styles.css"],
			cssStream
		);
	} catch (error) {
		onError(`Problem downloading images`);
	}

	onSuccess();
}

export default {
	start,
};
