import fs from 'fs';

// Lees het JSON-bestand
fs.readFile('./colruyt/data/zuivelProductsData.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Fout bij het lezen van het bestand:', err);
        return;
    }

    // Parseer de JSON-data
    let producten = JSON.parse(data);

    // Maak een lege array om de GTIN-codes in op te slaan
    let gtinCodes = [];


    //Doorloop elk product
    for (let i = 0; i < producten.length; i++) {
        producten[i].gtin?.forEach(code => {
            gtinCodes.push({
                gtin: code,
                productId: producten[i]?.productId,
                name: producten[i]?.name,
                description: producten[i]?.description,
                technicalArticleNumber: producten[i]?.technicalArticleNumber,
                commercialArticleNumber: producten[i]?.commercialArticleNumber,
                LongName: producten[i]?.LongName
            })
        });
    }
    
    // Schrijf de GTIN-codes naar een nieuw bestand
    fs.writeFile('./colruyt/gtinData/zuivelProducten.json', JSON.stringify(gtinCodes, null, 2), 'utf8', err => {
        if (err) {
            console.error('Fout bij het schrijven naar het bestand:', err);
        }
    });
});