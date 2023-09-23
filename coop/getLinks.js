const fs = require("fs");
const puppeteer = require("puppeteer");
const appendToJson = require("../appendToJson");

async function getLinks() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  let CATEGORY = "chips_nootjes_en_borrelhapjes";
  let index = 1;
  let totalPages = 37;
  const categoryUrl = `https://www.coop.nl/categorie/boodschappen.${CATEGORY}`;
  await page.goto(categoryUrl);

  while (index < totalPages + 1) {
    const aTags = await page.$$("a[class='product-card-mobile__title ng-star-inserted']");

    const hrefs = await Promise.all(
      aTags.map((a) => a.getProperty("href").then((href) => href.jsonValue()))
    );

    const splitHrefs = hrefs.map((href) => href.split("/")[4]);

    appendToJson(hrefs, "coopLinks.json");
    appendToJson(splitHrefs, "coopIds.json");

    index++;
    console.log(index);

    // const nextButton = await page.$$(
    //   "button[class='button button--tertiary button__svg--pagination']"
    // );
    // await Promise.all([
    //   await page.click("button[class='button button--tertiary button__svg--pagination']"),
    // ]);

    const categoryUrl = `https://www.coop.nl/categorie/boodschappen.${CATEGORY}?pagina=${index}`;
    await page.goto(categoryUrl);
    await sleep(10000);
  }

  await browser.close();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

getLinks();
