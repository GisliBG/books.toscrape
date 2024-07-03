import fetch, { splitToChunks } from "../services/fetch";
import {
	expect,
	test,
	vi,
	describe,
	Mocked,
	beforeEach,
	MockedFunction,
} from "vitest";
import axios from "axios";

vi.mock("axios");

const mockPage = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>HTML 5 Boilerplate</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
      <script src="index.js"></script>
      </body>
    </html>`;
const secondMockPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>HTML 5 Boilerplate</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
  <h1>Category</h1>
  <script src="index.js"></script>
  </body>
</html>`;

describe("fetching data", () => {
	beforeEach(() => {
		(axios.get as MockedFunction<typeof axios.get>).mockReset();
	});

	test("fetch Pages in parallel", async () => {
		(axios.get as MockedFunction<typeof axios.get>)
			.mockResolvedValueOnce({
				status: 200,
				data: mockPage,
			})
			.mockResolvedValueOnce({
				status: 200,
				data: secondMockPage,
			});

		const res = await fetch.pages([
			"page/index.html",
			"page/category/index.html",
		]);

		expect(res).toEqual([mockPage, secondMockPage]);

		//expect(axios.get).toHaveBeenCalledWith("page/index.html");
		//expect(cb).toHaveBeenCalledTimes(2);
	});

	test("spliting in chunks", () => {
		// Should split array of 500 into 10 chunks of size 50;
		const req = Array.from(
			{ length: 500 },
			() =>
				new Promise((resolve) => {
					resolve("test");
				})
		);
		const chunks = splitToChunks(req, 50);
		expect(chunks.length).toBe(10);
		// Should also split uneven chunks so that the last array has the remaining items
		req.push(new Promise((resolve) => resolve("test")));
		expect(req.length).toBe(501);
		const unEvenChunks = splitToChunks(req, 20);
		expect(unEvenChunks.length).toBe(26);
		expect(unEvenChunks[unEvenChunks.length - 1].length).toBe(1);
	});
});
