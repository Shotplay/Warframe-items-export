const { generateCSV } = require("./build/generate.js");

generateCSV(["ru", "en"], "Array").then((data) => console.log(data[data.length - 1]));

// GenerateCSV([locales])
// Example: GenerateCSV(["ru", "en"]) - this create output csv file with columns uniqueName, jsonDataRU, jsonDataEN
// GenerateCSV(["de", "es"]) - this create output csv file with columns uniqueName, jsonDataDE, jsonDataES
// Where jsonData<Locale> column with data items
