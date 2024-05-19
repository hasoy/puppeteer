import fs from "fs";

const getLength = (path) => {
  const jsonData = fs.readFileSync(path);
  const data = JSON.parse(jsonData);
  console.log(data.length);
};
getLength("all-data.json");
