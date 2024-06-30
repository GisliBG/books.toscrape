import filehandler from "../services/filehandler";
import * as fs from "fs";
import {
	expect,
	test,
	vi,
	describe,
	Mocked,
	beforeEach,
	MockedFunction,
} from "vitest";

vi.mock("fs", () => ({
	writeFile: vi.fn().mockResolvedValue(() => console.log("Saved")),
	existsSync: vi.fn(),
	mkdirSync: vi.fn(),
}));

describe("filehandler", () => {
	test("save", () => {
		const absolutePath = "https://books.toscrape.com/books/index.html";
		const cb = vi.fn();
		filehandler.save(absolutePath, "This is a test.", cb);
		expect(fs.writeFile).toHaveBeenCalledWith(
			`./files/books/index.html`,
			"This is a test.",
			cb
		);
	});
});
