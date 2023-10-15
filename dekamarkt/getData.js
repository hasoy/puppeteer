import dekamarktLinks from "./dekamarktLinks.json" assert { type: "json" };
import appendToJson from "../appendToJson.js";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

// total product coop 6184
const offset = 6000;
const loopAmount = 6249;
let tempArray = [];

const splitArray = dekamarktLinks?.slice(offset);
function fetchProductsLoop(index, loopAmount) {
  if (index >= loopAmount) {
    return;
  }
  if (tempArray.length > 50) {
    appendToJson([...tempArray], "dekamarktProducts.json");
    tempArray = [];
  }

  fetchAndWriteProduct(splitArray[index]);

  setTimeout(() => {
    fetchProductsLoop(index + 1, loopAmount);
    console.log("loop amount: ", index);
  }, 250);
}

fetchProductsLoop(0, loopAmount);

async function fetchAndWriteProduct(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    if (!data) return;
    const $ = cheerio.load(data);
    const scriptContent = $("script").text();

    const end = '"}';
    const barcode = extractBetweenStrings(scriptContent, `Barcode:"`, end);
    const productName = url.split("/").at(-2).replace(/[-]/gm, " ");
    const allergens = extractBetweenStrings(scriptContent, "ProductAllergens:", "],") + "}]";
    const ingredients = extractBetweenStrings(scriptContent, 'ProductIngredients:[{Text:"', '"}');
    const weight = extractBetweenStrings(scriptContent, 'CommercialContent:"', '",');
    const product = {
      productName,
      barcode,
      store: "Dekamarkt",
      allIngredients: ingredients,
      land: "Netherlands",
      weight,
      // category:,
      allergens,
    };
    tempArray.push(product);
  } catch (error) {
    appendToJson([url], "failedRequests.json");
  }
}

function extractBetweenStrings(bigString, begin, end) {
  const beginIndex = bigString.indexOf(begin);
  const endIndex = bigString.indexOf(end, beginIndex + begin.length);

  if (beginIndex === -1 || endIndex === -1) {
    return null;
  }

  return bigString.slice(beginIndex + begin.length, endIndex);
}
