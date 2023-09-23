import productIds from "./coopIds.json" assert { type: "json" };
import appendToJson from "../appendToJson.js";
import fetch from "node-fetch";

// total product coop 6005
const offset = 6000;
const loopAmount = 6;
let tempArray = [];

const splitArray = productIds.slice(offset);
function fetchProductsLoop(index, loopAmount) {
  if (index >= loopAmount) {
    return;
  }
  if (tempArray.length === 5) {
    appendToJson([...tempArray], "coopProducts.json");
    tempArray = [];
  }

  fetchAndWriteProduct(splitArray[index]);

  setTimeout(() => {
    fetchProductsLoop(index + 1, loopAmount);
    console.log("loop amount: ", index);
  }, 500);
}

fetchProductsLoop(0, loopAmount);

const parseJson = async (response) => {
  const text = await response.text();
  try {
    const json = await JSON.parse(text);
    return json;
  } catch (err) {
    console.log("Did not receive JSON, instead received: " + err);
    return null;
  }
};

async function fetchAndWriteProduct(id) {
  const coopUrl = `https://api.coop.nl/INTERSHOP/rest/WFS/COOP-COOPBase-Site/-;loc=nl_NL;cur=EUR/products/${id}`;
  try {
    const response = await fetch(coopUrl);
    const data = await parseJson(response);
    if (!data) return;
    const product = {
      productName: data.name,
      barcode: data.sku ?? id,
      store: "Coop",
      allIngredients:
        data.attributeGroups.PRODUCT_DETAIL_ATTRIBUTES_INGREDIENTS.attributes[0].value,
      land: "Netherlands",
      weight: data.attributes[0].value,
      category: data.defaultCategory.name,

      vegan:
        data.attributeGroups.PRODUCT_DETAIL_ATTRIBUTES_LOGO.attributes.includes({
          name: "Vegan",
          type: "Boolean",
          value: true,
        }) ||
        data.defaultCategory.name.toLowerCase() === "vegan" ||
        data.name.toLowerCase().includes("vegan"),
    };
    console.log(product);
    tempArray.push(product);
  } catch (error) {
    console.log("id:" + id, error);
    return;
  }
}
