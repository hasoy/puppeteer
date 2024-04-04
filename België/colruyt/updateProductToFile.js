import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function updateProductToFile(products) {
    // Read the existing products from the file
    const filePath = path.join(__dirname, 'data_with_information/onderhoud-Huishouden-data-output.json');
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
}
