import { csvData } from "../@types/csvData";
/**
 * - Create and/or return Array/CSV/SQL/JSON File Warframe Public Export Data
 * @template TypeReturn
 * @param {string[]} locales
 * @param {TypeReturn} [typeReturn="CSV"] Buffer or Array
 * @param {boolean} [mysql=false] Update duplicate for mysql
 * @return {*}  {(Promise<void | Buffer | csvData[]>)}
 * @example
 * generateData(["it", "ko"]) // create CSV file and return CSV file text with column uniqueName, jsonDataIT, jsonDataKO in Output folder
 * generateData(["zh", "tc"], "JSON") // Loads JSONs from Warframe Public Export on Chinese mainland and Taiwan
 * generateData(["de", "es"], "SQL") // generate SQL file and return SQL file text with column uniqueName, jsonDataDE, jsonDataES
 * generateData(["de", "es"], "SQL", true) // Does the same as above, but adds duplicate update for mysql
 * generateData(["ru", "en"], "Array") // return Array data CSV file with column uniqueName, jsonDataRU, jsonDataEN, i.e
 * //[
 * //  {
 * //   uniqueName: '/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem'
 * //   jsonDataRU: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Сандана: Изорванное знамя","codexSecret":false,"description": "Злите солдат Гринир, используя их собственное знамя."}'
 * //   jsonDataEN: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Vanquished Banner","codexSecret":false,"description":"Add insult to injury by mocking the Grineer with their own banner."}'
 * //  }...
 * //]
 */
declare enum TypesReturn {
    CSV = 0,
    Array = 1,
    SQL = 2,
    JSON = 3
}
declare function generateData<TypeReturn = keyof typeof TypesReturn>(locales: string[], typeReturn: TypeReturn, mysql?: boolean, deleteDownloadedData?: boolean): Promise<string | csvData[]>;
export { generateData };
