import fetch from "../services/fetch";
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

describe("fetching data", () => {
	beforeEach(() => {
		(axios.get as MockedFunction<typeof axios.get>).mockReset();
	});

	test("fetch Page", async () => {
		(axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({
			data: mockPage,
		});
		const page = await fetch.page("page/index.html");
		expect(axios.get).toHaveBeenCalledWith("page/index.html");
		expect(page).toEqual(mockPage);
	});
});
