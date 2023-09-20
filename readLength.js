const fs = require("fs");

const fileName = "sparLinks.json";
// Read the JSON file and parse the contents
const data = JSON.parse(fs.readFileSync(fileName));

// Convert the array to a Set object to remove duplicates

// Convert the Set object back to an array and write it to the JSON file
console.log(data.length);
