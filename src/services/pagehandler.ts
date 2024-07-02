import { load } from "cheerio";

function findLinks(page: string, onLinkFound: (href: string) => void) {
	const $ = load(page);
	$("a").each((index, element) => {
		const href = $(element).attr("href");
		if (href) {
			onLinkFound(href);
		}
	});
}

export default {
	findLinks,
};
