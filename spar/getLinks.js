const fs = require("fs");
const puppeteer = require("puppeteer");
const appendToJson = require("../appendToJson");

async function getLinks() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  let CATEGORY = "bakkerij";
  let index = 1;
  const categoryUrl = `https://www.spar.nl/boodschappen/${CATEGORY}?p=${index}`;
  await page.goto(categoryUrl);

  while (index < 15) {
    const aTags = await page.$$("a[data-ga-product-click='']");
    const hrefs = await Promise.all(
      aTags.map((a) => a.getProperty("href").then((href) => href.jsonValue()))
    );

    console.log(...hrefs);

    appendToJson(hrefs, "sparLinks.json");

    index++;

    const categoryUrl = `https://www.spar.nl/boodschappen/${CATEGORY}?p=${index}`;
    await page.goto(categoryUrl, {
      waitUntil: "networkidle0",
    });
  }

  await browser.close();
}

getLinks();
