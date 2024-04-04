import puppeteer from "puppeteer-extra";
import * as cheerio from 'cheerio';
import appendIdToFile from './appendIdToFile.js';

async function generate() {
    console.log('Extract product ref from the website.');

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    for (let i = 0; i < 31; i++) {
        const url = `https://www.kruidvat.nl/gezondheid/zelfzorg?page=${i}&size=20&sort=score`;
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            const pageContent = await page.content();
            if (!pageContent) return;
            const $ = cheerio.load(pageContent);
            $('.product__list-col').each((index, element) => {
                const productCode = $(element).find('.tile__product-slide').data('code');
                console.log(`Product code ${index + 1}: ${productCode}`);
                appendIdToFile(productCode, 'Kruidvat/zelfzorgCodes.json');
            });
        
        } catch (error) {
            console.error('Error:', error);
        }
    }   
}

generate();