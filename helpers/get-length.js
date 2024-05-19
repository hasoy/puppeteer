import fs from "fs";

export default function getLength(fileName) {
  const jsonData = fs.readFileSync(fileName);
  const data = JSON.parse(jsonData);
  console.log(data.length);
}

getLength("../data/ahData1.json");
getLength("../data/ahData2.json");
getLength("../data/ahData3.json");
