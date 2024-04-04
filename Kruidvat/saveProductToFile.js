import * as fs from 'fs';

export default function saveProductToFile(product, fileName) {
    let products = [];
    if (fs.existsSync(fileName)) {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        products = JSON.parse(fileContent);
    }
    if (!products.some(p => p.eanCode === product.eanCode)) {
        products.push(product);
        fs.writeFileSync(fileName, JSON.stringify(products));
        console.log(`Product met EAN-code ${product.eanCode} is toegevoegd aan het bestand ${fileName}.`);
    } else {
        console.log(`Product met EAN-code ${product.eanCode} is niet toegevoegd aan het bestand ${fileName} omdat het al bestaat.`);
    }
}