import axios from "axios";

async function page(path: string) {
	const page = await axios.get(path);
	return page.data;
}

export default { page };
