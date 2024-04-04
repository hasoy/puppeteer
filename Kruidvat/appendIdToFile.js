import * as fs from 'fs';

export default function appendIdToFile(id, fileName) {
    let data = [];
    if (fs.existsSync(fileName)) {
        const fileContent = fs.readFileSync(fileName, 'utf8');
        data = JSON.parse(fileContent);
    }
    if (!data.includes(id)) {
        data.push(id);
        fs.writeFileSync(fileName, JSON.stringify(data));
        console.log(`ID ${id} is toegevoegd aan het bestand ${fileName}.`);
    } else {
        console.log(`ID ${id} is niet toegevoegd aan het bestand ${fileName} omdat het al bestaat.`);
    }
}