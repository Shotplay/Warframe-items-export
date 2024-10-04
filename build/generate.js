"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateData = generateData;
const deleteDir_1 = require("./deleteDir");
const downloadData_1 = require("./downloadData");
const addAdditionalData_1 = require("./addAdditionalData");
const readData_1 = require("./readData");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const sync_1 = __importDefault(require("csv-stringify/sync"));
const bar = new cli_progress_1.default.Bar({
    format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
});
let countValue = 0;
const APIWarframeDataDir = path_1.default.resolve(__dirname, "../Output/APIWarframeData");
const OutputDir = path_1.default.resolve(__dirname, "../Output");
const AdditionalDataDir = path_1.default.resolve(__dirname, "../AdditionalData");
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
var TypesReturn;
(function (TypesReturn) {
    TypesReturn[TypesReturn["CSV"] = 0] = "CSV";
    TypesReturn[TypesReturn["Array"] = 1] = "Array";
    TypesReturn[TypesReturn["SQL"] = 2] = "SQL";
    TypesReturn[TypesReturn["JSON"] = 3] = "JSON";
})(TypesReturn || (TypesReturn = {}));
function generateData(locales_1, typeReturn_1) {
    return __awaiter(this, arguments, void 0, function* (locales, typeReturn, mysql = false, deleteDownloadedData = false) {
        const itemsArr = [];
        console.log("Wait collecting information...");
        (0, deleteDir_1.deleteDir)(OutputDir);
        for (const locale of locales) {
            yield (0, downloadData_1.downloadWarframeData)(locale, APIWarframeDataDir);
            yield (0, addAdditionalData_1.addAdditionalData)(AdditionalDataDir, APIWarframeDataDir);
            const data = yield (0, readData_1.readWarframeData)(locale, APIWarframeDataDir);
            itemsArr.push(data);
        }
        bar.start(itemsArr.flat().length / itemsArr.length, 0);
        const csvDatas = [];
        let uniqueNameLength = 0;
        for (const arr of itemsArr) {
            let csvData = [];
            yield Promise.all(arr.map((data, indexMap) => __awaiter(this, void 0, void 0, function* () {
                const obj = {
                    uniqueName: data.uniqueName || data.rewardName,
                };
                if (csvDatas.some((dataDatasArr) => dataDatasArr.some((dataDatas) => dataDatas.uniqueName === obj.uniqueName)))
                    return;
                if (obj.uniqueName.length > uniqueNameLength)
                    uniqueNameLength = obj.uniqueName.length;
                countValue++;
                bar.update(countValue);
                for (let i = 0; i < locales.length; i++) {
                    const key = `jsonData${locales[i].toUpperCase()}`;
                    if (!itemsArr[i][indexMap]) {
                        obj[key] = "undefined";
                        continue;
                    }
                    obj[key] = JSON.stringify(itemsArr[i][indexMap])
                        .replace(/\n/gm, "\\n")
                        .replace(/\r/gm, "\\r")
                        .replace(/\t/gm, "\\t")
                        .replace(/\f/gm, "\\f")
                        .replace(/\v/gm, "\\v")
                        .replace(/\0/gm, "\\0")
                        .replace(/\u2028/gm, "\\u2028")
                        .replace(/\u2029/gm, "\\u2029");
                }
                csvData.push(obj);
            }))).then(() => csvDatas.push(csvData));
        }
        const csvString = sync_1.default.stringify(csvDatas.flat(), {
            header: true,
            quoted_string: true,
        });
        bar.stop();
        if (typeReturn !== "JSON" && deleteDownloadedData) {
            const files = fs_1.default.readdirSync(APIWarframeDataDir);
            yield Promise.all(files.map((file) => fs_1.default.unlinkSync(path_1.default.resolve(APIWarframeDataDir, file))));
            fs_1.default.rmdirSync(APIWarframeDataDir);
        }
        switch (typeReturn) {
            case "Array": {
                return csvDatas.flat();
            }
            case "SQL": {
                const flatted = csvDatas.flat();
                const insertions = flatted.map((data) => {
                    const columns = Object.keys(data);
                    const dataColumns = Object.values(data);
                    return `INSERT INTO \`warframeLocalizations\` (\`${columns.join("`,`")}\`) VALUES ('${dataColumns
                        .map((string) => string.replace(/'/gm, "\\'"))
                        .join("','")}') ${mysql
                        ? ` ON DUPLICATE KEY UPDATE ${columns
                            .map((column, index) => `\`${column}\`=VALUES('${dataColumns[index]}')`)
                            .join(",")}`
                        : ""};`;
                });
                const tables = locales.map((locale) => `\`jsonData${locale.toUpperCase()}\` TEXT NOT NULL`);
                const data = `-- Generated by https://github.com/Shotplay/Warframe-items-export\nCREATE TABLE IF NOT EXISTS \`warframeLocalizations\`(\`uniqueName\` VARCHAR(${uniqueNameLength}) NOT NULL PRIMARY KEY,${tables.join(",")});\n${insertions.join("\n")}`;
                const outputSQLPath = path_1.default.join(OutputDir, "output.sql");
                fs_1.default.writeFileSync(outputSQLPath, data, "utf-8");
                console.log(`File created ${outputSQLPath}`);
                return data;
            }
            case "JSON": {
                const JSONsPath = path_1.default.resolve(__dirname, '../build/APIWarframeData/');
                console.log(`JSONs Created ${JSONsPath}`);
                return JSONsPath;
            }
            case "CSV": {
                const outputCSVPath = path_1.default.join(OutputDir, "output.csv");
                fs_1.default.writeFileSync(outputCSVPath, csvString, "utf-8");
                console.log(`File created ${outputCSVPath}`);
                return csvString;
            }
            default: {
                throw new Error("Wrong typeReturn");
            }
        }
    });
}
