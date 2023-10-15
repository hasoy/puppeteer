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
      const categoryUrl = `https://www.dirk.nl/boodschappen/${category}/${value}`;
      console.log(categoryUrl);
      await page.goto(categoryUrl);
      await getLinks();
    }
  }
}

async function getLinks() {
  const aTags = await page.$$("a[class='product-card__name']");

  const hrefs = await Promise.all(
    aTags.map((a) => a.getProperty("href").then((href) => href.jsonValue()))
  );
  console.log(hrefs.at(-1));

  appendToJson(hrefs, "dirkLinks.json");

  await sleep(1000);
}

await browser.close();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
