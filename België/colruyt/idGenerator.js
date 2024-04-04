import request from 'request';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function generate() {
    console.log('Extract product ref from the website.');

    const baseOptions = {
        'method': 'GET',
        'headers': {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Cookie': 'dtCookie=v_4_srv_19_sn_077E52BF0C68D871D158681E64685925_perc_100000_ol_0_mul_1_app-3Ab84fed97a8123cd5_0; TS0113bcfc=016303f955182688884b7b2fdf0ccb821a0afe292a47e531c83864f24d10c50f17ae6a6085075505dd7ae8b914c33f7dd6600e828a; s_fid=3D4DB26DA1E12F44-18FE7DF130AB3874; s_cc=true; OptanonAlertBoxClosed=2024-03-21T17:28:02.332Z; reese84=3:Itbq0TdDNgnOcEDLZ2NeKA==:9kZ++wbzAPDlnsUdFa150bpU6Bv5q4iNfspS6wgeXJJVI0E66lEWYq2WptHSYCGX7cRLE6jS0tAa/56lmwsE09z79sx7A+xBkgVWWUELciycRV1NqQf9VD+563BNIv5qPXO+T109qPwHYjV8Os7jnBCi6wxdYw2xE+KYmmb4eAp8osOOqjZOruqR1SivgNWNtH10W803uYigqgV4HgSROoBLAeyZLe9ysS5vPHnmDqhvgBlWlk9n83Mk8A9B7Ns1zG4iqAwyx3QtLyWLgp+wtFViO5XyNlIMbI62MvhPBbgZS0+9ikMMTMvEW9tzDDTyA+H7uqui88qFo+48uHqc5dUVxWfeUYjxNZ06Ua6JSVxYAxnyvitu7jKgMXs9OE/5jMaZbWBZ0CXaqScIe8Y18Yz6sT7/m/MzoGRs6sQxqpz25MaAU2NdCaSyfmoEs25sOSO2wHwrIzr29RPNAUXQpQ==:JlIP+xhYOPPPIY3D6UsID3yfsoSRvkz6YZ/n2jGqGZs=; OptanonConsent=isGpcEnabled=0&datestamp=Sat+Mar+23+2024+22%3A01%3A13+GMT%2B0100+(Midden-Europese+standaardtijd)&version=6.20.0&isIABGlobal=false&hosts=&consentId=13d04fa6-4999-4c05-92f8-c9cf306cdc29&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A0%2CC0002%3A0%2CC0004%3A0&geolocation=%3B&AwaitingReconsent=false; tms_storevisit=eyJic2xfYXJ0aWNsZV9jb3VudCI6MCwidXNlcl92aXNpdF9pZCI6IjM0MDcxOC4xNzExMjIxMDcyNTA4IiwidGltZUV2ZW50X3N0YXJ0VGltZSI6MTcxMTIyMTE5NDQyNSwibGFzdF9sb2dpbl9zdGF0ZSI6Im5vIiwicGFnZV9kZXB0aCI6NDMsImFkYmxvY2tfc3RhdHVzIjoibm90YWN0aXZlIiwicHJldmlvdXNQYWdlIjp7InBhZ2VfbmFtZSI6Ik5pZXQtdm9lZGluZyUyMCU3QyUyMENvbHJ1eXQifX0%3D; utag_main=v_id:018e620e265c0053c00d8d5060e00506f0023067009d8^$_n:6^$_e:119^$_s:0^$_t:1711229478513^$vapi_domain:colruyt.be^$ses_id:1711221072515%3Bexp-session^$_n:44%3Bexp-session',
            'Origin': 'https://www.colruyt.be',
            'Referer': 'https://www.colruyt.be/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'X-CG-APIKey': 'a8ylmv13-b285-4788-9e14-0f79b7ed2411',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        }
    };

    for (let page = 1; page <= 26; page++) {
        console.log(`Getting page ${page}...`);
        const options = {
            ...baseOptions,
            url: `https://apip.colruyt.be/gateway/ictmgmt.emarkecom.cgproductretrsvc.v2/v2/v2/nl/products?categoryIds=693&clientCode=CLP&isAvailable=true&page=${page}&placeId=604&size=22&sort=popularity%20asc`
        };

        await delay(2400); // Wait for 2 seconds

        request(options, function (error, response) {
            if (error) throw new Error(error);

            // Check if the response is JSON
            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                console.log('Response:', response.body);
                console.error('Invalid content type:', contentType);
                return;
            }

            const products = JSON.parse(response.body).products;

            // Read the existing products from the file
            const filePath = path.join(__dirname, 'data/niet-voedingProductsData.json');
            let existingProducts = [];
            if (fs.existsSync(filePath)) {
                const rawData = fs.readFileSync(filePath);
                existingProducts = JSON.parse(rawData);
            }

            // Append the new products to the existing products
            const allProducts = existingProducts.concat(products);

            // Write the updated product list to the file
            fs.writeFileSync(filePath, JSON.stringify(allProducts, null, 2));

            console.log(`Added ${products.length} new products. Now ${allProducts.length} in total.`);
        });
    }
}

generate();