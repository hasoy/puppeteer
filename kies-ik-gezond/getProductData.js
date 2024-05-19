// THIS CODE IS NOT FUNCTIONAL YET
// it is just a copy from the jumbo variant
// adjust it to make it work for kies ik gezond

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import data from "./data.json" assert { type: "json" };
import appendToJson from "../appendToJson.js";

puppeteer.use(StealthPlugin());

async function run() {
  console.log(data.length);
  let productsArray = [];
  const totalLoops = data.length;
  let totalAdded = 0;
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  console.log("starting...");

  for (let loopIndex = 0; loopIndex < totalLoops; loopIndex++) {
    try {
      const url = `https://etiketwijzer-app.voedingscentrum.nl/products/${data[loopIndex].id}?html`;
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000, // Set a timeout value in milliseconds
      });
      const ingredientsTag = await page.$('p[class="ingredients"]');
      const ingredientsContent = await page.evaluate(
        (element) => element.textContent,
        ingredientsTag,
      );
      const ingredientsValue = JSON.parse(ingredientsContent);
      console.log(ingredientsValue);

      let product = {
        allIngredients: ingredientsValue,
      };

      productsArray.push(product);

      if (productsArray.length === 50) {
        appendToJson(productsArray, "newJumboProducts2.json");
        totalAdded += 50;
        console.log(`${totalAdded} added`);
        productsArray = [];
      }
    } catch (error) {
      console.error(
        `Request failed or timed out for URL: ${jumboUrls[loopIndex]}`,
      );
      console.log(error);
      // Handle the error and go to the next URL
      appendToJson([jumboUrls[loopIndex]], "failedRequests.json");
      continue;
    }
  }

  await browser.close();
}

run();
