import fetch from "node-fetch";
import fs from "fs";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-GB,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  Cookie:
    "SSID=CQB7Mh0AAAAAAADP4PhkY27BAM_g-GQEAAAAAAAAAAAA_tcXZQD0DA; SSRT=_tcXZQQBAA; SSOD=AJceAAAAEgD-HQAAGAAAAM_g-GTglxBlAAAAAA; SSPV=BPwAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAA; visid_incap_1876175=EQSy1HLuRD2UTBiKkNQinM7g+GQAAAAAQUIPAAAAAABaSverEzlnTjMwEW87Wv73; reese84=3:sCxcHvH9r0Trd9Ce3YTXVA==:8AveFQ7hEN4rAKzjrpfa111BOzPfrM/4Uk7Y0hExtr09OKCjdxWnXzvqRplXdliEY9TiNgc97J/51ssKtd2JTVL7AEdKoTbcyUyw5a6N2bFpGYnypfmciRv3rqjb8n1ql1APA6VvATExH+sD55d3fyhQirgmR+b6O5hO4orNc4jgSVi9gMsT08odouO+EdHQrcN1+SWJGUJIaebv3KxzT9w7/K0UOvGGXr466Y4fAur538byyDgKOLtHzNG+V0a+3cXDpivFtTV9mbNFi9mitcTSVl5hu8+pXz0/mVGB2d/lOMnI1L8Aqba4iVhfxLNbXGqjFoO0ISCk/eDK4F2B8ikKXlNK/fKy6Q1SIzWoWYXx12DlSeoJAqTyk3bCFh6OTxmdgWZg1scnOpn86m/B8cPNwymHjf0ZyXNClRZ++gFqfgJboIRrJD9ejmS10rgfci2FtRGZk2dVqzTF1OWy+96q1e2zRbIxE9NZzPIMLVU=:BHMCl1IgCyciwL7ghuDsInqHffwnmW0n7Ju0UfoO20Q=; AWSALB=oeE2ZAOBMTR7t2J/6s/YEcea3tPrW3tBpU/PsltCg6HGTKBsp0RLhtdtUx3sN2s2kFgc1jEfCU28cHZuB6NfUmNfjxoioTk08jpJXoUJUuzX5CuO7ewZrKHmtMWy; AWSALBCORS=oeE2ZAOBMTR7t2J/6s/YEcea3tPrW3tBpU/PsltCg6HGTKBsp0RLhtdtUx3sN2s2kFgc1jEfCU28cHZuB6NfUmNfjxoioTk08jpJXoUJUuzX5CuO7ewZrKHmtMWy; SSLB=0; SSSC=1.G7275812377692565091.4|0.0; sid=ojzpfmiUa1H9fg2DdcKNfEGegmNKpEjLAeZvVsD6; SecureSessionID-8lcKAygMZZ4AAAFFzHAngfeq=da5ad4ff8eee44fd8352782a6ec2f5917924108d89b562f9cf7490a50ec30124; pgid-PLUS-website-Site=brNcgJKstYtSRpTW.eorxVGc0000x_fVzqwH; nlbi_1876175=kb48friHImMMvbi6Juxx+QAAAAADhdDy+KZVjDdjWThPa+RJ; incap_ses_1084_1876175=SXAlJMd+tw6SxzZ/VCULD//XF2UAAAAAbZQoSWMT4/EFee2iwARbfg==; pageLoads=1; nlbi_1876175_2147483392=RG2ELr7c8Gqy8dnvJuxx+QAAAAAOTTh9oB1y/XVBwYdO5JXJ",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  TE: "trailers",
};

for (let j = 1; j < 158; j++) {
  const getDataUrl = `https://www.plus.nl/zoekresultaten?SearchTerm=plus?PageNumber=${j}`;
  fetch(getDataUrl, { headers: headers }).then((res) =>
    res.text().then((data) => {
      fs.appendFile("productIds.html", data, function (err) {
        if (err) throw err;
        console.log("Saved!");
      });
    })
  );
}
