import cli from "./cli";
import crawler from "./services/crawler";

function main() {
	console.log("Are you sure you want to start scraping ?");
	console.log("Press q to quit!");
	cli.confirm(
		function () {
			crawler.start(
				(errorMessage) => {
					console.log(errorMessage);
				},
				(progressMessage) => console.log(progressMessage),
				() => console.log("All done press q to quit!")
			);
		},
		function () {
			process.exit();
		}
	);
}

main();
