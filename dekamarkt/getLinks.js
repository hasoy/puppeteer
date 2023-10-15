import puppeteer from "puppeteer";
import appendToJson from "../appendToJson.js";
import categories from "./categories.json" assert { type: "json" };

let category;

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();

for (const obj of categories) {
  for (const key of Object.keys(obj)) {
    category = key;
    for (const value of obj[key]) {
      const categoryUrl = `https://www.dekamarkt.nl/producten/${category}/${value}`;
      console.log(categoryUrl);
      await page.goto(categoryUrl);
      await getLinks();
    }
  }
}

async function getLinks() {
  const aTags = await page.$$("a[class='deka-product-card--image']");

  const hrefs = await Promise.all(
    aTags.map((a) => a.getProperty("href").then((href) => href.jsonValue()))
  );
  console.log(hrefs.at(-1));

  appendToJson(hrefs, "dekamarktLinks.json");

  await sleep(1000);
}

await browser.close();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
