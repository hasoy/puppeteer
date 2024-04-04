import request from 'request';
import puppeteer from "puppeteer-extra";
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import util from 'util';

// Maak een promisified versie van fs.readFile
const readFile = util.promisify(fs.readFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getProducts() {
    // Gebruik de promisified readFile functie
    const data =  await readFile('./colruyt/gtinData/chips-BorrelhapjesProducten.json', 'utf8');
    const products = JSON.parse(data);
    return products;
}

async function run() {


    const products = await getProducts();


    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
        'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0'
    ];


    for (let i = 0; i < products.length; i++) {

        const gtin = products[i].gtin;
        console.log(`Getting product info for ${gtin}...`);
        const URL = `https://fic.colruytgroup.com/productinfo/AppServlet?m=HomeCtrl.getGtinData&gtin=${gtin}`;

        const baseOptions = {
            'method': 'GET',
            'headers': {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9,nl;q=0.8',
                'Connection': 'keep-alive',
                'Content-Length': '0',
                'Cookie': 'JSESSIONID=0000lV81Uf79NZIAy2Wg2eVs-rd:1hiqlld2m; TS01a4b3ab=016303f955a53e042d5b1ed1a2ce5535380c921da69bd279ca3bbc92dd70d8964701d6fbb001f62f9e4541300f3f3403c97096605e; _ga=GA1.2.537425736.1711722138; _gid=GA1.2.408893562.1711722138; _gat=1; TS01a4b3ab=016303f95577f392b0a0b2c73e03c735a65c63dec6bc3ae721a1c6ffeb42cae2faabbfef970f6cbb64927cd5c3e209b0bdc97dcfca',
                'Origin': 'https://fic.colruytgroup.com',
                'Referer': 'https://fic.colruytgroup.com/productinfo/nl/algc/3933753',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            },
            url: URL
        };

        request(baseOptions, function (error, response) {
            
            if (error) throw new Error(error);

            const content = response.body;
            const $ = cheerio.load(content);
            let productInfo = {};
            productInfo.category = $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 .category').text();
            productInfo.title = $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 h1').text();
            productInfo.description = $('.col-xs-12.col-sm-8.col-md-8.col-lg-8 h2').text();
            productInfo.size = $('.col-xs-12.col-sm-4.col-md-4.col-lg-4 .brutto').text();
            productInfo.ingredients = $('.col-xs-12.col-sm-12.col-md-12.col-lg-12 p').first().text();
            productInfo.storage = $('.col-xs-12.col-sm-12.col-md-12.col-lg-12 p').last().text();
            productInfo.image = $('.col-xs-12.col-sm-4.col-sm-pull-8.col-md-3.col-md-pull-9.col-lg-3.col-lg-pull-9 img').attr('src');
            productInfo.allergens = $('#allergenen .item').text();

            let tt = '';
            $('#voedingswaarden .value-detail').each(function() {
                const name = $(this).find('.val-name').text();
                const nbr = $(this).find('.val-nbr').text();
                productInfo[name] = nbr;
                if (name.trim() !== '' && nbr.trim() !== '') {
                    tt += `${name}: ${nbr}\n`;
                }
            });
            
            console.log("Infomatie A: ", productInfo);

        });

        await delay(2400); // Wait for 2 seconds
    } 
}

run();