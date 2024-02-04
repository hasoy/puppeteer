import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { ahIds } from "./ahIds.js";
import appendToJson from "../appendToJson.js";
import { HTMLToJSON } from "html-to-json-parser";
puppeteer.use(StealthPlugin());

const failedRequests = "failedRequests.json";
const appendToFile = "ahData3.json";
let totalAdded = 0;
const TOTAL_LOOPS = 25000;
const loopStart = 14000;
const slicedIds = ahIds.slice(loopStart);
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.ah.nl");
  let productArray = [];
  for (let i = 0; i < TOTAL_LOOPS; i++) {
    const url = `https://www.ah.nl/zoeken/api/products/product?webshopId=${slicedIds[i]}`;
    try {
      await page.goto(url);
      const pageContent = await page.content();
      if (!pageContent) return;
      let result = await HTMLToJSON(pageContent);
      const card = JSON.parse(result?.content[1]?.content[0]?.content[0]).card;
      const product = {
        productName: card.products[0]?.title,
        gln: card.meta?.gln,
        barcode: card.meta?.gtin,
        gtins: card.products[0]?.gtins,
        brand: card.products[0]?.brand,
        contact: card.meta?.contact,
        contents: card.meta?.contents,
        category: card.products[0]?.category,
        properties: card.products[0]?.properties?.nutriscore,
        lifestyle: card.products[0]?.properties?.lifestyle,
        nutritions: card.meta?.nutritions,
        ingredients: card.meta.ingredients?.statement,
        allergens: card.meta.ingredients?.allergens,
      };
      productArray.push(product);
    } catch (error) {
      console.log(error);
      appendToJson([url], failedRequests);
    }
    if (productArray.length > 50) {
      appendToJson(productArray, appendToFile);
      productArray = [];
      totalAdded += 50;
      console.log(`Added ${totalAdded} products`);
    }
  }

  await browser.close();
}

run();
