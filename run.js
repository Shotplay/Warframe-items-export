const { generateCSV } = require("./build/generate.js");

generateCSV(["ru", "en"])

// GenerateCSV([locales])
// GenerateCSV(["it", "ko"])  create CSV file with column uniqueName, jsonDataIT, jsonDataKO in Output folder
// GenerateCSV(["de", "es"], "Buffer")  return buffer CSV file with column uniqueName, jsonDataDE, jsonDataES
// GenerateCSV(["ru", "en"], "Array")  return Array data CSV file with column uniqueName, jsonDataRU, jsonDataEN, i.e
//[
//  {
//   uniqueName: '/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem'
//   jsonDataRU: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Сандана: Изорванное знамя","codexSecret":false,"description": "Злите солдат Гринир, используя их собственное знамя."}'
//   jsonDataEN: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Vanquished Banner","codexSecret":false,"description":"Add insult to injury by mocking the Grineer with their own banner."}'
//  }...
//]

