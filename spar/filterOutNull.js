const fs = require("fs");
const failedRequests = require("./failedRequests");
const appendToJson = require("../appendToJson");

// Function to filter out null values from an array of strings
function filterAndWriteToFile(inputArray, outputPath) {
  const filteredArray = inputArray.filter((item) => item !== null);

  appendToJson(filteredArray, outputPath);
}

// Example usage:
const outputPath = "filtered_data.json";

filterAndWriteToFile(failedRequests, outputPath);
