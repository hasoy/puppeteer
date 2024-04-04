import puppeteer from "puppeteer-extra";
import * as cheerio from 'cheerio';
import fs from 'fs';
import util from 'util';

// Maak een promisified versie van fs.readFile
const readFile = util.promisify(fs.readFile);


async function getProducts() {
    // Gebruik de promisified readFile functie
    const data =  await readFile('./colruyt/gtinData/chips-BorrelhapjesProducten.json', 'utf8');
    const products = JSON.parse(data);
    return products;
}

async function scrapeWebsite(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    try {
        const content = await page.content(); // Dit geeft de HTML-inhoud van de pagina
        return content;
    } catch (error) {
        console.error("Fout bij het ophalen van inhoud van de pagina:", error);
        return null;
    } finally {
        await browser.close();
    }
}


(async () => {
    const products = await getProducts();

    for (const product of products) {
        const number = product.technicalArticleNumber;
        const url = `https://fic.colruytgroup.com/productinfo/nl/algc/${number}`;
        let productInfo = {};
        try {
            const content = await scrapeWebsite(url);
            if (content) {
                const $ = cheerio.load(content);
                productInfo.category = $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 .category').text();
                productInfo.title = $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 h1').text();
                productInfo.description = $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 h2').text();
                productInfo.size = $('.col-xs-12.col-sm-4.col-md-4.col-lg-4 .brutto').text();
                productInfo.ingredients = $('.col-xs-12.col-sm-12.col-md-12.col-lg-12 p').first().text();
                productInfo.storage = $('.col-xs-12.col-sm-12.col-md-12.col-lg-12 p').last().text();
                productInfo.image = $('.col-xs-12.col-sm-4.col-sm-pull-8.col-md-3.col-md-pull-9.col-lg-3.col-lg-pull-9 img').attr('src');
                productInfo.allergens = $('#allergenen .item').text();

                productInfo.gtin = product.gtin
                productInfo.productId = product.productId
                productInfo.name = product.name
                productInfo.description = product.description
                productInfo.technicalArticleNumber = product.technicalArticleNumber
                productInfo.commercialArticleNumber = product.commercialArticleNumber
                productInfo.LongName = product.LongName

                let tt = '';
                $('#voedingswaarden .value-detail').each(function() {
                    const name = $(this).find('.val-name').text();
                    const nbr = $(this).find('.val-nbr').text();
                    productInfo[name] = nbr;
                    if (name.trim() !== '' && nbr.trim() !== '') {
                        tt += `${name}: ${nbr}\n`;
                    }
                });

                console.log("Product Information: ", productInfo);
            } else {
                console.log(`Geen inhoud ontvangen van ${url}`);
            }
        } catch (error) {
            console.error(`Fout bij het scrapen van ${url}:`, error);
        }
    }
})();


