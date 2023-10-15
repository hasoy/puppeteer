import fs from "fs";

function removeDuplicatesAndWriteToFile(filePath) {
  try {
    const rawData = fs.readFileSync(filePath);
    const originalArray = JSON.parse(rawData);
    console.log("original length", originalArray.length);

    const uniqueSet = new Set(originalArray);

    const uniqueArray = [...uniqueSet];
    console.log("new length", uniqueArray.length);

    fs.writeFileSync(filePath, JSON.stringify(uniqueArray, null, 2));

    console.log("Duplicates removed and data written to the file successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const filePath = "dirkLinks.json";
removeDuplicatesAndWriteToFile(filePath);
