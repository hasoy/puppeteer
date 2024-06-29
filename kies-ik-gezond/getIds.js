import appendToJson from "../appendToJson.js";
// url for getting the product id with a barcode: https://etiketwijzer-app.voedingscentrum.nl/products/barcode/8720182162120?html
// after getting the product id call the url for the ingredients
// for the title etc. scrape the data from all products and search for the ids

const categories = [
  "IJs",
  "Aardappel%2C%20onbewerkt",
  "Friet%2C%20aardappelschijfjes%20en%20aardappelpuree",
  "Pasta%2C%20couscous%2C%20quinoa%20en%20noodles",
  "Rijst",
  "Wrap%2C%20pizzabodem%2C%20pannenkoek%20en%20taco",
  "Babykoekjes",
  "Babyvoeding%3A%20fles%20%3C6%20m",
  "Babyvoeding%3A%20fruitpotje",
  "Babyvoeding%3A%20maaltijd%2012%2B%20m",
  "Babyvoeding%3A%20maaltijd%20%3C1%20jaar",
  "Babyvoeding%3A%20opvolgmelk%2012%2B%20m",
  "Babyvoeding%3A%20opvolgmelk%206-12%20m",
  "Babyvoeding%3A%20pap%20%3C1%20jaar",
  "Johannesbrood-pitmeel",
  "Ontbijtgranen",
  "Meel-%20en%20bakmix",
  "Cracker%2C%20beschuit%2C%20toast%20en%20croutons",
  "Broodmixen",
  "Brood",
  "Bakbenodigdheden",
  "Hartig%20broodbeleg%20(zoals%20salades)",
  "Kaas",
  "Notenpasta%20en%20pindakaas",
  "Vleeswaren",
  "Zoet%20broodbeleg",
  "Frisdrank%2C%20sap%20en%20limonade",
  "Water%2C%20thee%20en%20koffie",
  "Alcohol",
  "(Maaltijd)salades",
  "Fruit%20in%20blik%20of%20glas%20en%20gedroogd",
  "Fruit%20inclusief%20diepvries",
  "Groente%20in%20blik%20of%20glas%20en%20gedroogd",
  "Groente%20inclusief%20diepvries",
  "Belegde%20broodjes",
  "Kant-en-klaar-maaltijden",
  "Suiker",
  "Zoetstof",
  "Zout%2C%20kruiden%2C%20specerijen%2C%20azijn",
  "Halvarine%2C%20margarine%20en%20boter",
  "Oli%C3%ABn%20en%20bakvetten",
  "Noten%2C%20pinda%27s%20en%20zaden",
  "Peulvruchten%20(zoals%20bonen)",
  "(Gefrituurde)%20snacks",
  "Chips%2C%20zoutjes%20en%20borrelhapjes",
  "Koek%20en%20gebak",
  "Snoep%20en%20chocola",
  "Sauzen%20en%20jus",
  "Soepen",
  "Bewerkt%20vlees%3A%20kip%2C%20rund%2C%20varken",
  "Ei",
  "Magere%20vis%20(zoals%20pangasius%2C%20tonijn%2C%20vissticks)",
  "Onbewerkt%20vlees%3A%20kip%2C%20kalkoen%2C%20eend",
  "Onbewerkt%20vlees%3A%20rund%2C%20varken%2C%20lam",
  "Peulvruchten%20(zoals%20bonen)",
  "Vegetarische%20producten",
  "Schaal-%20en%20schelpdieren",
  "Vleeswaren",
  "Vette%20vis%20(zoals%20zalm%2C%20makreel%2C%20haring)",
  "Dieetproducten",
  "Supplementen",
  "Kaas",
  "Kaasvervanger",
  "Melk",
  "Melkproducten",
  "Plantaardige%20dranken%20en%20toetjes",
  "Yoghurt%2C%20kwark%20en%20karnemelk",
];

const url = (category, page) =>
  `https://etiketwijzer-app.voedingscentrum.nl/api/products/search?query=*&isSuggestion=false&productgroup=${category}&page=${page}`;
// these headers are just copied from the initial request. If expired read the readme to get the new headers
const headers = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "en-US,en;q=0.9",
  Authorization:
    "ApiKey HMw6I858g7Ajp_p2t8abZw7Ar5vSSjqqrc6X8eZBQfA;YgM2y3dDNiea73Pc/YK+zCWkwDKn4/GOnC1Ob6gkcW4=",
  Connection: "keep-alive",
  Cookie:
    "appVersion=1.8.6; deviceType=Android; isEetmeterInstalled=0; _ga=GA1.1.456620250.1715941921; _ga_SE3DT0DFSX=GS1.1.1715941920.1.1.1715942791.0.0.0",
  Host: "etiketwijzer-app.voedingscentrum.nl",
  Referer: "https://etiketwijzer-app.voedingscentrum.nl/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 14; sdk_gphone64_x86_64 Build/UE1A.230829.036.A2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/113.0.5672.136 Mobile Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
};

const getIds = async (category, page, categoryIndex) => {
  if (categoryIndex >= categories.length) {
    console.log("All categories have been scraped.");
    return;
  }

  console.log(`scraping ${category} page ${page}`);

  try {
    const response = await fetch(url(category, page), { headers: headers });
    const data = await response.json();

    if (data.results.length === 0) {
      console.log(`starting new category ${categories[categoryIndex + 1]}`);
      await getIds(categories[categoryIndex + 1], 0, categoryIndex + 1);
      return;
    }

    appendToJson(data.results, `data.json`);
    console.log(`scraped ${category} page ${page}`);
    await getIds(category, page + 1, categoryIndex);
  } catch (error) {
    console.error(`Error scraping category ${category} page ${page}:`, error);
  }
};

(async () => {
  await getIds(categories[0], 0, 0);
})();
