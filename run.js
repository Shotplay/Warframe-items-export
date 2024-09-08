const { generateData } = require("./build/generate.js");

generateData(["ru", "en"], "SQL");

// generateData([locales])
// generateData(["it", "ko"])  create CSV file and return CSV file text with column uniqueName, jsonDataIT, jsonDataKO in Output folder
// generateData(["de", "es"], "SQL")  generate SQL file and return SQL file text with column uniqueName, jsonDataDE, jsonDataES
// generateData(["ru", "en"], "Array")  return Array data CSV file with column uniqueName, jsonDataRU, jsonDataEN, i.e
//[
//  {
//   uniqueName: '/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem'
//   jsonDataRU: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Сандана: Изорванное знамя","codexSecret":false,"description": "Злите солдат Гринир, используя их собственное знамя."}'
//   jsonDataEN: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Vanquished Banner","codexSecret":false,"description":"Add insult to injury by mocking the Grineer with their own banner."}'
//  }...
//]
