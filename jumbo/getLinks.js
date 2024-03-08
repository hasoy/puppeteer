import puppeteer from "puppeteer";
import appendToJson from "../appendToJson.js";

async function run() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const newCategories = [
    "aardappelen,-groente-en-fruit",
    "koffie-en-thee",
    "frisdrank-en-sappen",
    "drogisterij",
    "baby,-peuter",
  ];

  for (const category of newCategories) {
    for (let i = 0; i < 50; i++) {
      const url = `https://www.jumbo.com/producten/${category}/?offset=${i * 24}`;
      try {
        await page.goto(url, {
          waitUntil: "networkidle0",
          timeout: 30000, // Set a timeout value in milliseconds
        });
        const productLinks = await page.$$eval("a[data-testid='jum-router-link']", (anchors) =>
          anchors.map((anchor) => anchor.href)
        );
        if (!productLinks.length) return;
        appendToJson(productLinks, "newLinks.json");
      } catch (error) {
        console.error(`Request failed or timed out for URL: ${jumboUrls[loopIndex]}`);
        continue;
      }
    }
  }

  await browser.close();
}

run();
