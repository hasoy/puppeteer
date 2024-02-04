const puppeteer = require("puppeteer");
const sparUrls = require("./failedRequests");
const appendToJson = require("../appendToJson");

async function run() {
  let productsArray = [];
  const appendToFile = "sparData.json";
  const failedRequests = "failedRequests.json";
  const loopStart = 0;
  const TOTAL_LOOPS = sparUrls.length;
  let totalAdded = 0;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (let loopIndex = loopStart; loopIndex < TOTAL_LOOPS + loopIndex; loopIndex++) {
    try {
      await page.goto(sparUrls[loopIndex], {
        waitUntil: "networkidle0",
        timeout: 30000, // Set a timeout value in milliseconds
      });
      const headTag = await page.$("head");
      const scriptTag = await headTag.$('script[type="application/ld+json"]');
      const barcodeContent = await page.evaluate((element) => element.textContent, scriptTag);
      const barcode = JSON.parse(barcodeContent).gtin13;
      const title = JSON.parse(barcodeContent).name;
      const category = JSON.parse(barcodeContent).category;

      const weightElement = await page.$('h2[class="c-offer__subtitle"]');
      const weightContent = await page?.evaluate((element) => element.textContent, weightElement);

      const ingredients = await page.evaluate(() => {
        const pTag = document.querySelector(".c-offer__ingredients-body .content p");
        return pTag ? pTag.textContent : null;
      });

      const allergenTexts = await page.evaluate(() => {
        const allergenElements = document.querySelectorAll(".c-offer__allergens .c-media__content");
        const allergenTexts = [];

        allergenElements.forEach((element) => {
          allergenTexts.push(element.textContent.trim());
        });

        return allergenTexts;
      });

      const $ = cheerio.load(ingredients);

      const product = {
        allIngredients: $.text(),
        productName: title,
        barcode: barcode,
        weight: weightContent,
        allergens: { contains: allergenTexts },
        category: category,
      };
      console.log(product);

      productsArray.push(product);

      if (productsArray.length === 5) {
        appendToJson(productsArray, appendToFile);
        totalAdded += 5;
        console.log(`${totalAdded} added`);
        productsArray = [];
      }
    } catch (error) {
      console.error(`Request failed or timed out for URL: ${sparUrls[loopIndex]}`);
      // Handle the error and go to the next URL
      appendToJson([sparUrls[loopIndex]], failedRequests);
      continue;
    }
  }

  await browser.close();
}

run();
