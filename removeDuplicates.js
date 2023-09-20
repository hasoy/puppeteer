const fs = require("fs");

function removeDuplicatesAndWriteToFile(filePath) {
  try {
    // Read the JSON file and parse its contents into an array
    const rawData = fs.readFileSync(filePath);
    const originalArray = JSON.parse(rawData);

    // Create a Set from the original array to remove duplicates
    const uniqueSet = new Set(originalArray);

    // Convert the Set back into an array
    const uniqueArray = [...uniqueSet];

    // Write the updated array back to the same file
    fs.writeFileSync(filePath, JSON.stringify(uniqueArray, null, 2));

    console.log("Duplicates removed and data written to the file successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example usage:
const filePath = "sparLinks.json"; // Replace with the path to your JSON file
removeDuplicatesAndWriteToFile(filePath);
