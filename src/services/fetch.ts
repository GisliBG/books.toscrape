import axios from "axios";

axios.defaults.baseURL = "https://books.toscrape.com/";

async function page(path: string) {
	const page = await axios.get(path);
	return page.data;
}

export default { page };
