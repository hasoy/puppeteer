import puppeteer from "puppeteer-extra";
import appendToJson from "../appendToJson.js";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
async function getLinks() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  let index = 2;
  // const categoryUrl = "https://www.plus.nl/zoekresultaten?SearchTerm=plus";
  // await page.setExtraHTTPHeaders(customHeaders);
  const url = "https://www.plus.nl/producten/zuivel-eieren-boter/verse-zuivel/melk-karnemelk";
  await page.goto("https://www.plus.nl/");
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  console.log(page.content());

  // while (index < 15) {
  //   const aTags = await page.$$("a[draggable='false']");
  //   console.log(aTags);
  //   const hrefs = await Promise.all(
  //     aTags.map((a) => a.getProperty("href").then((href) => href.jsonValue()))
  //   );

  //   console.log(...hrefs);

  //   appendToJson(hrefs, "plusLinks.json");

  //   index++;

  //   const categoryUrl = `https://www.plus.nl/producten/brood-gebak-bakproducten/brood?PageNumber=${index}&PageSize=12`;

  //   await page.goto(categoryUrl, {
  //     waitUntil: "networkidle0",
  //   });
  // }

  await browser.close();
}

getLinks();
