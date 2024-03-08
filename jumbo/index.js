import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import jumboUrls from "./newLinks.json" assert { type: "json" };
import appendToJson from "../appendToJson.js";

puppeteer.use(StealthPlugin());

async function run() {
  console.log(jumboUrls.length);
  let productsArray = [];
  const loopStart = 6000 + 3900;
  const totalLoops = jumboUrls.length - loopStart;
  let totalAdded = 0;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://www.jumbo.com/");

  for (let loopIndex = loopStart; loopIndex > totalLoops; loopIndex++) {
    try {
      await page.goto(jumboUrls[loopIndex], {
        waitUntil: "networkidle0",
        timeout: 30000, // Set a timeout value in milliseconds
      });
      const bodyTag = await page.$("body");
      const scriptTag = await bodyTag.$('script[id="__NUXT_DATA__"]');
      const barcodeContent = await page.evaluate((element) => element.textContent, scriptTag);
      const barcode = JSON.parse(barcodeContent).gtin13;

      const titleTag = await bodyTag.$('strong[data-testid="product-title"]');

      const titleContent = await page.evaluate((element) => element.textContent, titleTag);

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

      const ulElement = await page.$('ul[data-testid="ingredients-text-body"]');
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
        appendToJson(productsArray, "newJumboProducts.json");
        totalAdded += 50;
        console.log(`${totalAdded} added`);
        productsArray = [];
      }
    } catch (error) {
      console.error(`Request failed or timed out for URL: ${jumboUrls[loopIndex]}`);
      console.log(error);
      // Handle the error and go to the next URL
      appendToJson([jumboUrls[loopIndex]], "failedRequests.json");
      continue;
    }
  }

  await browser.close();
}

run();
