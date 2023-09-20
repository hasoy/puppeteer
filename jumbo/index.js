const puppeteer = require("puppeteer");
const jumboUrls = require("./jumboUrls");
const appendToJson = require("../appendToJson");

async function run() {
  let productsArray = [];
  const loopStart = 0;
  const TOTAL_LOOPS = 11000;
  let totalAdded = 0;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (let loopIndex = loopStart; loopIndex < TOTAL_LOOPS + loopIndex; loopIndex++) {
    try {
      await page.goto(jumboUrls[loopIndex], {
        waitUntil: "networkidle0",
        timeout: 30000, // Set a timeout value in milliseconds
      });
      const headTag = await page.$("head");
      const scriptTag = await headTag.$('script[type="application/ld+json"]');
      const barcodeContent = await page.evaluate((element) => element.textContent, scriptTag);
      const barcode = JSON.parse(barcodeContent).gtin13;

      const bodyTag = await page.$("body");
      const titleTag = await bodyTag.$('strong[data-testid="product-title"]');

      const titleContent = await page.evaluate((element) => element.textContent, titleTag);

      const ulElement = await page.$('ul[data-testid="ingredients-text-body"]');

      const weightElement = await page.$('h2[data-testid="product-subtitle"]');
      const weightContent = await page?.evaluate((element) => element.textContent, weightElement);

      const allergensElement = await page.$('div[data-testid="allergens-content"]');
      const allergensContent = await page.evaluate((parentElement) => {
        const spanElement = parentElement?.querySelector("span");
        return spanElement?.textContent;
      }, allergensElement);

      const categoryContext = await page.$eval("ol.breadcrumb-trail li:first-child", (li) =>
        li?.textContent?.trim()
      );

      const liElements = await ulElement?.$$("li");
      let ingredients;
      if (liElements) {
        const liTexts = await Promise?.all(
          liElements?.map((li) => li?.evaluate((node) => node.textContent))
        );
        ingredients = liTexts?.join(", ");
      }

      let product = {
        allIngredients: ingredients,
        productName: titleContent,
        barcode: barcode,
        weight: weightContent,
        allergens: { contains: allergensContent },
        category: categoryContext,
      };

      productsArray.push(product);

      if (productsArray.length === 50) {
        appendToJson(productsArray, "jumboProducts.json");
        totalAdded += 50;
        console.log(`${totalAdded} added`);
        productsArray = [];
      }
    } catch (error) {
      console.error(`Request failed or timed out for URL: ${jumboUrls[loopIndex]}`);
      // Handle the error and go to the next URL
      appendToJson([jumboUrls[loopIndex]], "failedRequests.json");
      continue;
    }
  }

  await browser.close();
}

run();
