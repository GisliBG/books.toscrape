import readline from "node:readline";

function confirm(onConfirm: () => void, onExit: () => void) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	readline.emitKeypressEvents(process.stdin);
	if (process.stdin.isTTY) {
		process.stdin.setRawMode(true);
	}

	let hasConfirmed = false;
	process.stdin.on("keypress", (chunk, key) => {
		if (key && key.name === "q") {
			onExit();
		}
		if (!hasConfirmed) {
			hasConfirmed = true;
			onConfirm();
		}
	});
}

export default { confirm };
