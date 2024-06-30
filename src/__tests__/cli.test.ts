import cli from "../cli";
import { expect, test, vi } from "vitest";

function simulateKeyPress(key: string) {
	process.stdin.emit("keypress", key, { name: key });
}

test("should start on key press", () => {
	const cb = vi.fn();
	cli.confirm(cb, vi.fn());
	simulateKeyPress("enter");
	expect(cb).toBeCalled();
});

test("should leave on q key press", () => {
	const cb = vi.fn();
	cli.confirm(vi.fn(), cb);
	simulateKeyPress("q");
	expect(cb).toBeCalled();
});
