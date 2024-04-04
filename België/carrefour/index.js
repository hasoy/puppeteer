import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

(async () => {
    // Load the Stealth plugin
    puppeteer.use(StealthPlugin());

    // Start the browser
    const browser = await puppeteer.launch({ headless: "new" });

    // Open a new page
    const page = await browser.newPage();

    // Go to the desired website
    await page.goto('https://www.carrefour.be/assortiment-gebak-385-g/06490061.html');

    // Get the HTML of the page

    // Wait for the product details to load
    await page.waitForSelector('.product-details');

    // Then try to find the GTIN in a script tag
    const gtin = await page.evaluate(() => {
        for (const script of Array.from(document.querySelectorAll('script'))) {
            if (script.innerText.includes('gtin')) {
                const match = script.innerText.match(/"gtin":"(\d+)"/);
                if (match) {
                return match[1];
                }
            }
            console.log(script.innerText);
        }
    });

    console.log(gtin);

    // Close the browser
    await browser.close();
})();