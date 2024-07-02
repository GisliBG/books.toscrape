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

function findImages(page: string, onImageFound: (src: string) => void) {
	const $ = load(page);
	$("img").each((index, element) => {
		const src = $(element).attr("src");
		if (src) {
			onImageFound(src);
		}
	});
}

export default {
	findLinks,
	findImages,
};
