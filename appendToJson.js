const fs = require("fs");

const appendToJson = (newData, fileName) => {
  const jsonData = fs.readFileSync(fileName);
  const data = JSON.parse(jsonData);
  data.push(...newData);
  const updatedJsonData = JSON.stringify(data);
  fs.writeFileSync(fileName, updatedJsonData);
  console.log("Data appended to JSON file.");
};

module.exports = appendToJson;
