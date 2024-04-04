import puppeteer from "puppeteer-extra";
import * as cheerio from 'cheerio';
import { voedingssupplementenIds } from './krProductenIds.js';
import saveProductToFile from './saveProductToFile.js';

const lengthOfKrIds = voedingssupplementenIds.length;
const kruidvatIds = voedingssupplementenIds.slice(0, lengthOfKrIds);

async function run() {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (const id of kruidvatIds) {
        const url = `https://www.kruidvat.nl/p/${id}`;
        console.log(`Navigating to ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const html = await page.content();
        const $ = cheerio.load(html);

        const productTitle = $('.product-title');
        const productNaam = productTitle.text().trim();
        const elements = $('h5.product-information__paragraph-title');
        const productInformation = {};

        for (let i = 0; i < elements.length; i++) {
            const element = elements.eq(i).text().trim();
            const elementContent = elements.eq(i).next().text().trim();
            productInformation[element] = elementContent;
        }

        const productText = $('div.product-information__text.product-information__html').text().trim();
        const eanCode = $('p.product-information__text.product-information__ean').text().replace('EAN code:', '').trim();

        const product = {
            productNaam: productNaam,
            productInformation: productInformation,
            ExtraInfo: productText,
            eanCode: eanCode
        }
        console.log(product);
        saveProductToFile(product, 'Kruidvat/data/kruidvatVoedingssupplementenData.json');
    }
    await browser.close();
}

run();