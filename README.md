# Books to scrape console program

## How to setup and run the application

Make sure you have Node.js installed
and follow these steps:

1. npm install
2. npm run build
3. npm start

## How to run test

npm run test

## Short description

Once the application starts it waits for a user input before it starts scraping the website.
It starts from the main page and from there it looks for all links and images on the page.
Each link that is found for the first time is stored so the page it links to can be fetched later,
a Link that has been found before is not stored.

After each Link has been found we download all the images we found on the way and the css file so
our local copy looks nice.

For optimzation we fetch the pages in chunks of parallel requests.
