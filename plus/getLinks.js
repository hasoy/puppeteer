import puppeteer from "puppeteer-extra";
import appendToJson from "../appendToJson.js";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
async function getLinks() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

 const headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0" , "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" , "Accept-Language: en-GB,en;q=0.5" , "Accept-Encoding: gzip, deflate, br" , "Connection: keep-alive" , "Referer: https://www.plus.nl/producten/aardappelen-groente-fruit" , "Cookie: SSID=CQBTbh0AAAAAAADP4PhkY27BAM_g-GQHAAAAAAAAAAAAAPbHZQD0DA; SSRT=SPjHZQQBAA; SSOD=AJceAAAAEgD,QAAGAAAAM_g-GTglxBlAAAAAA; SSPV=BPwAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAA; visid_incap_1876175=EQSy1HLuRD2UTBiKkNQinM7g+GQAAAAAQUIPAAAAAABaSverEzlnTjMwEW87Wv73; reese84=3:a8GMV/wur6tyqZmO43anHw==:yOQk+ejM2EJh9MdYv8NLLW/QnngTtQCeiKffdprX2CHfrNT2/7+SFy4XjWMHdh2RUhTLqvCqWdwAenKwX0zPOyIEnIQlxDoJ/WBRbCtrkgzVKB7B1Wuvncd92+1/uul01msrRpbetvxclY2RdgjYt5x1SKvzDeoe4nF67smRPE5GGsxcflRP2Bp56utZaLVusag3EM1hYq4Uj1hcMSMh4rkfSV6bsq9DTZbz05gKFrJ+Q9La1Z16eN+0fc0bBDxABqYfB7GxLkRKzjKMwSaa/VTA95NsTE3fwWcQB2YjNIDwQo7x0RsmmqtcPrJPHiYeaTHihXH5jasCJU1zHCRdCk0WGPyB8uJtAQRjHnuCsq+Jtfylr6dPG9Qz6YvCyow62wYxlCrO1TLKZL3Dqg/xCHc9PbtH1xSqeOtz5Y3Qig8EWwS+aThD2gdHohbd23hv/arHjZg8v1GPtmoIvQ0U4Q==:nzCPKJ8CjimHqj2MqP0XwUhCbcs0xNLUB74nIVNfsZc=; AWSALB=qjQo/xlRsvYiOkszKouPyhs2agDeBbPD2dCBAUgYcjMkJjKwMZ2LE13aakwFM0PQb+V6FYDLglyuCvu//4yLV6t9F0dfKzxtiB/J6Ua6doR3rm5lh2jB/0dN16my; AWSALBCORS=qjQo/xlRsvYiOkszKouPyhs2agDeBbPD2dCBAUgYcjMkJjKwMZ2LE13aakwFM0PQb+V6FYDLglyuCvu//4yLV6t9F0dfKzxtiB/J6Ua6doR3rm5lh2jB/0dN16my; SSLB=0; SSSC=1.G7275812377692565091.7^|0.0; SecureSessionID-8lcKAygMZZ4AAAFFzHAngfeq=9cbb5ff4abb8e3254b6587a70c984b9523a0d8e193cf123fa48d908ca69a8c31; pgid-PLUS-website-Site=qzZ4gnyqc2pSRptm3TDxA7.s0000wJjRv2O5; sid=GzNvMddif0xmMbKl7TMLMv5o-uITK_c9uOl,m4l; nlbi_1876175=N24OIgMpb3DtUeQ1Juxx+QAAAAA5al9zutTuiFX5R8D5fY2p; incap_ses_1078_1876175=DUfqERwqPSO+mQBst9T1DgH2x2UAAAAAdwudOM2m4+kl81ENLOYMFQ==; nlbi_1876175_2147483392=PG9oFaUR/WtqHydAJuxx+QAAAAACAN5daRoFj9VgLHgbpkhT; pageLoads=7" , "Upgrade-Insecure-Requests: 1" , "Sec-Fetch-Dest: document" , "Sec-Fetch-Mode: navigate" , "Sec-Fetch-Site: same-origin" , "Sec-Fetch-User: ?1" , "TE: trailers"}
  let index = 2;
  // const categoryUrl = "https://www.plus.nl/zoekresultaten?SearchTerm=plus";
  // await page.setExtraHTTPHeaders(customHeaders);
  const url = "https://www.plus.nl/producten/zuivel-eieren-boter/verse-zuivel/melk-karnemelk";
  await page.goto("https://www.plus.nl/");
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  console.log(page.content());

  // while (index < 15) {
  //   const aTags = await page.$$("a[draggable='false']");
  //   console.log(aTags);
  //   const hrefs = await Promise.all(
  //     aTags.map((a) => a.getProperty("href").then((href) => href.jsonValue()))
  //   );

  //   console.log(...hrefs);

  //   appendToJson(hrefs, "plusLinks.json");

  //   index++;

  //   const categoryUrl = `https://www.plus.nl/producten/brood-gebak-bakproducten/brood?PageNumber=${index}&PageSize=12`;

  //   await page.goto(categoryUrl, {
  //     waitUntil: "networkidle0",
  //   });
  // }

  await browser.close();
}

getLinks();
