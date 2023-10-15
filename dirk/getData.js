import dirkLinks from "./dirkLinks.json" assert { type: "json" };
import appendToJson from "../appendToJson.js";
import fetch from "node-fetch";

// total product coop 4696
const offset = 0;
const loopAmount = 4696;
let tempArray = [];

const splitArray = dirkLinks?.slice(offset);
function fetchProductsLoop(index, loopAmount) {
  if (index >= loopAmount) {
    return;
  }
  if (tempArray.length === 50) {
    appendToJson([...tempArray], "dirkProducts.json");
    tempArray = [];
  }

  fetchAndWriteProduct(splitArray[index]?.split("/").at(-1));

  setTimeout(() => {
    fetchProductsLoop(index + 1, loopAmount);
    console.log("loop amount: ", index);
  }, 500);
}

fetchProductsLoop(0, loopAmount);

const parseJson = async (response) => {
  const text = await response.text();
  try {
    const json = await JSON?.parse(text);
    return json;
  } catch (err) {
    console.log("Did not receive JSON, instead received: " + err);
    return null;
  }
};

async function fetchAndWriteProduct(id) {
  const url = `https://api.dirk.nl/v1/assortmentcache/66/${id}?api_key=6d3a42a3-6d93-4f98-838d-bcc0ab2307fd`;
  try {
    const response = await fetch(url);
    const data = await parseJson(response);
    if (!data) return;
    const product = {
      productName:
        `${data.Brand?.toLowerCase()} ${data.MainDescription?.toLowerCase()} ${data.SubDescription?.toLowerCase()}`?.trim(),
      barcode: data.ProductBarcodes.map((barcode) => barcode.Barcode)?.join(),
      store: "Dirk",
      allIngredients: data.ProductDeclarations[0].ProductIngredients[0].Text,
      land: "Netherlands",
      weight: data.CommercialContent,
      category: data.WebSubGroups[0].WebGroup.WebDepartment.Description,
      allergens: data.ProductDeclarations[0].ProductAllergens?.map(
        (allergen) => allergen.AllergenDescription
      )?.join(),
    };
    tempArray.push(product);
  } catch (error) {
    console.log("id:" + id, error);
    return;
  }
}
