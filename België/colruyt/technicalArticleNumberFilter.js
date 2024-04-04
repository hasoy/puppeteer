import fs from 'fs';

// Lees de JSON-bestand
fs.readFile('./gtinData/zuivelProducten.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse de JSON data
    const products = JSON.parse(data);

    // Maak een nieuwe array met alleen unieke technicalArticleNumbers
    const uniqueProducts = Array.from(new Set(products.map(product => product.technicalArticleNumber)))
        .map(technicalArticleNumber => {
            return products.find(product => product.technicalArticleNumber === technicalArticleNumber)
        });

    // Schrijf de unieke producten naar een nieuwe JSON-bestand
    fs.writeFile('uniek_article_number/zuivel-output.json', JSON.stringify(uniqueProducts, null, 2), 'utf8', err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File successfully written!');
    });
});