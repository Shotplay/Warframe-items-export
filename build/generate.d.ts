import { csvData } from "../@types/csvData";
/**
 * - Create and/or return Array/CSV/SQL File Warframe Public Export Data
 * @param {string[]} locales
 * @param {string} [typeReturn="CSV"] Buffer or Array
 * @param {boolean} [DeleteDataIfExist=true] Only if typeReturn = "SQL". Does the request have to be a transaction? (I.e. either everything is transferred or nothing)
 * @return {*}  {(Promise<void | Buffer | csvData[]>)}
 * @example
 * generateData(["it", "ko"]) // create CSV file and return CSV file text with column uniqueName, jsonDataIT, jsonDataKO in Output folder
 * generateData(["de", "es"], "SQL") // generate SQL file and return SQL file text with column uniqueName, jsonDataDE, jsonDataES
 * generateData(["ru", "en"], "Array") // return Array data CSV file with column uniqueName, jsonDataRU, jsonDataEN, i.e
 * //[
 * //  {
 * //   uniqueName: '/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem'
 * //   jsonDataRU: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Сандана: Изорванное знамя","codexSecret":false,"description": "Злите солдат Гринир, используя их собственное знамя."}'
 * //   jsonDataEN: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Vanquished Banner","codexSecret":false,"description":"Add insult to injury by mocking the Grineer with their own banner."}'
 * //  }...
 * //]
 */
declare function generateData(locales: string[], typeReturn?: string): Promise<string | csvData[]>;
export { generateData };
