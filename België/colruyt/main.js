import puppeteer from "puppeteer-extra";
import * as cheerio from 'cheerio';
import fs from 'fs';
import util from 'util';
import updateProductToFile from './updateProductToFile.js';
// Maak een promisified versie van fs.readFile
const readFile = util.promisify(fs.readFile);

async function getProducts() {
    // Gebruik de promisified readFile functie
    const data =  await readFile('./uniek_article_number/onderhoud-Huishouden-output.json', 'utf8');
    const products = JSON.parse(data);
    return products;
}

function dataFromProductInfo($, product, actieveBarcode) {
    const productInfo = {
        category: $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 .category').text(),
        title: $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 h1').text(),
        description: $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 h2').text(),
        size: $('.col-xs-12.col-sm-4.col-md-4.col-lg-4 .brutto').text(),
        ingredients: $('.col-xs-12.col-sm-12.col-md-12.col-lg-12 p').first().text(),
        storage: $('.col-xs-12.col-sm-12.col-md-12.col-lg-12 p').last().text(),
        image: $('.col-xs-12.col-sm-4.col-sm-pull-8.col-md-3.col-md-pull-9.col-lg-3.col-lg-pull-9 img').attr('src'),
        allergens: $('#allergenen .item').text(),
        activeBarcode: actieveBarcode,
        productId: product.productId,
        name: product.name,
        description: product.description,
        technicalArticleNumber: product.technicalArticleNumber,
        commercialArticleNumber: product.commercialArticleNumber,
        LongName: product.LongName
    };

    let tt = '';
    $('#voedingswaarden .value-detail').each(function() {
        const name = $(this).find('.val-name').text();
        const nbr = $(this).find('.val-nbr').text();
        productInfo[name] = nbr;
        if (name.trim() !== '' && nbr.trim() !== '') {
            tt += `${name}: ${nbr}\n`;
        }
    });

    return productInfo;
}

async function scrapeWebsite(url, product) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  let hasNextBarcode = true;
  const activatedBarcodes = new Set();

  while (hasNextBarcode) {
      // Vind de actieve barcode
      const activeBarcode = await page.$('.active[data-gtin]');
      let activeGtin;
      if (activeBarcode) {
          // Pak de data-gtin attribuut
          activeGtin = await page.evaluate(el => el.getAttribute('data-gtin'), activeBarcode);
          if (activeGtin.trim() === '') {
              console.log('Geen barcode gevonden voor dit product');
          } else {
              // Als er een actieve barcode is, gebruik deze
              const content = await page.content();
              const $ = cheerio.load(content);
    
              const productInfo = dataFromProductInfo($, product, activeGtin);
              updateProductToFile(productInfo);
          }
          
      } else {
          // Als er geen actieve barcode is, gebruik dan de current_gtin
          activeGtin = await page.$eval('#current_gtin', el => el.textContent);
          if (activeGtin.trim() === '') {
              console.log('Geen barcode gevonden voor dit product');
          } else {
              // Als er een actieve barcode is, gebruik deze
              const content = await page.content();
              const $ = cheerio.load(content);
    
              const productInfo = dataFromProductInfo($, product, activeGtin);
              updateProductToFile(productInfo);
          }
      }
      console.log(activeGtin);

      // Pak de data-gtin attribuut
      //const activeGtin = await page.evaluate(el => el.getAttribute('data-gtin'), activeBarcode);

      // Voeg de actieve barcode toe aan de set van geactiveerde barcodes
      activatedBarcodes.add(activeGtin);

      // Vind alle niet-actieve barcodes
      const nextBarcodes = await page.$$('li:not(.active)[data-gtin]');
      // Haal de data-gtin waarden van alle niet-actieve barcodes
      const nextGtins = await Promise.all(nextBarcodes.map(barcode => page.evaluate(el => el.getAttribute('data-gtin'), barcode)));
      // Vind de eerste barcode die nog niet is geactiveerd
      const nextGtin = nextGtins.find(gtin => !activatedBarcodes.has(gtin));

      // Als er een volgende barcode is, maak deze actief
      if (nextGtin) {
          const nextBarcode = nextBarcodes[nextGtins.indexOf(nextGtin)];
          await nextBarcode.$('a').then(a => a.click());
          // Wacht een beetje om de pagina tijd te geven om te reageren
          await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
          // Als er geen volgende barcode is, stop de loop
          hasNextBarcode = false;
      }
  }

  await browser.close();
}


(async () => {
    const products = await getProducts();

    for (const product of products) {
        const number = product.technicalArticleNumber;
        const url = `https://fic.colruytgroup.com/productinfo/nl/algc/${number}`;
        try {
            await scrapeWebsite(url, product);
        } catch (error) {
            console.error(`Fout bij het scrapen van ${url}:`, error);
        }
    }
})();