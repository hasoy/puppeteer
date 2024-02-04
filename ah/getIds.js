import { categories } from "./categories.js";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import appendToJson from "../appendToJson.js";
import { HTMLToJSON } from "html-to-json-parser";
puppeteer.use(StealthPlugin());

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.ah.nl");
  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < 5; j++) {
      const url = `https://www.ah.nl/zoeken/api/products/search?taxonomySlug=${categories[i]}&size=1000&page=${j}`;
      try {
        await page.goto(url);
        const pageContent = await page.content();
        if (!pageContent) return;
        let result = await HTMLToJSON(pageContent);
        let parsed = JSON.parse(result?.content[1]?.content[0]?.content[0]);
        let ids = parsed.cards.map((card) => card.id);
        console.log(ids);
        appendToJson(ids, `links.json`);
      } catch (error) {
        console.log(error);
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // Add a delay of 1 second
    }
  }

  await browser.close();
}
run();
