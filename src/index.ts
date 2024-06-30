import cli from "./cli";
import crawler from "./services/crawler";

function main() {
	console.log("Are you sure you want to start scraping ?");
	console.log("Press q to quit!");
	cli.confirm(
		function () {
			console.log("starting");
			crawler.start();
		},
		function () {
			process.exit();
		}
	);
}

main();
