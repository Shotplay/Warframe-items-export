"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSV = generateCSV;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lzma_purejs_1 = __importDefault(require("lzma-purejs"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const sync_1 = __importDefault(require("csv-stringify/sync"));
const bar = new cli_progress_1.default.Bar({
    format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
});
let countValue = 0;
const APIWarframeDataDir = path_1.default.resolve(__dirname, "APIWarframeData");
const OutputDir = path_1.default.resolve(__dirname, "..", "Output");
const AdditionalDataDir = path_1.default.resolve(__dirname, "..", "AdditionalData");
function deleteDir() {
    const files = fs_1.default.readdirSync(OutputDir);
    for (const file of files) {
        fs_1.default.unlinkSync(path_1.default.join(OutputDir, file));
    }
    fs_1.default.rmdirSync(OutputDir);
    fs_1.default.mkdirSync(OutputDir);
}
async function addAdditional() {
    const Files = fs_1.default.readdirSync(AdditionalDataDir);
    for (const file of Files) {
        const data = fs_1.default.readFileSync(path_1.default.join(AdditionalDataDir, file), "utf-8");
        fs_1.default.writeFileSync(path_1.default.resolve(APIWarframeDataDir, file), data);
    }
}
async function downloadWarframeData(locale) {
    if (!fs_1.default.existsSync(APIWarframeDataDir))
        fs_1.default.mkdirSync(APIWarframeDataDir);
    const response = await fetch(`https://origin.warframe.com/PublicExport/index_${locale}.txt.lzma`);
    const data = await response.arrayBuffer();
    const decompressedData = lzma_purejs_1.default.decompressFile(Buffer.from(data));
    const arrFetching = Buffer.from(decompressedData)
        .toString()
        .split("\n")
        .map((item) => item.replace(/\r/g, ""));
    let locked = 0;
    await Promise.all(arrFetching.map(async (fetching) => {
        try {
            const response = await fetch(`https://content.warframe.com/PublicExport/Manifest/${fetching}`);
            const data = await response.text();
            const urlFetching = fetching.replace("Export", "").replace(/\.json.*/, "");
            const firstKey = !fetching.includes("Manifest") ? fetching.replace(/_.*/g, "") : fetching.replace("Export", "").replace(/\..*/g, "");
            const parsed = JSON.parse(data.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))[firstKey].filter((data) => {
                if (data.uniqueName !== "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchLongGun/ThanoTechLongGun" || locked < 1) {
                    if (data.uniqueName === "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchLongGun/ThanoTechLongGun")
                        locked++;
                    return true;
                }
                else {
                    return false;
                }
            });
            const stringified = JSON.stringify(parsed, null, 2);
            fs_1.default.writeFileSync(path_1.default.resolve(APIWarframeDataDir, `${urlFetching}.json`), stringified);
        }
        catch (err) {
            console.error(err);
        }
    }));
}
async function readWarframeData(locale) {
    const files = fs_1.default.readdirSync(APIWarframeDataDir);
    const localizatedFiles = files.filter((file) => file.includes(`_${locale}`));
    const allInOne = [];
    for (const file of localizatedFiles) {
        const data = fs_1.default.readFileSync(path_1.default.resolve(APIWarframeDataDir, file), "utf-8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            allInOne.push(...parsed);
        }
    }
    return allInOne;
}
/**
 * - Create or return Buffer/Array CSV File Warframe Public Export Data
 * @param {string[]} locales
 * @param {string} [typeReturn] Buffer or Array
 * @return {*}  {(Promise<void | Buffer | csvData[]>)}
 * @example
 * GenerateCSV(["it", "ko"]) // create CSV file with column uniqueName, jsonDataIT, jsonDataKO in Output folder
 * GenerateCSV(["de", "es"], "Buffer") // return buffer CSV file with column uniqueName, jsonDataDE, jsonDataES
 * GenerateCSV(["ru", "en"], "Array") // return Array data CSV file with column uniqueName, jsonDataRU, jsonDataEN, i.e
 * //[
 * //  {
 * //   uniqueName: '/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem'
 * //   jsonDataRU: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Сандана: Изорванное знамя","codexSecret":false,"description": "Злите солдат Гринир, используя их собственное знамя."}'
 * //   jsonDataEN: '{"uniqueName":"/Lotus/Characters/Tenno/Accessory/Scarves/GrnBannerScarf/GrnBannerScarfItem","name":"Vanquished Banner","codexSecret":false,"description":"Add insult to injury by mocking the Grineer with their own banner."}'
 * //  }...
 * //]
 */
async function generateCSV(locales, typeReturn) {
    const itemsArr = [];
    console.log("Wait collecting information...");
    for (const locale of locales) {
        deleteDir();
        await downloadWarframeData(locale);
        await addAdditional();
        const data = await readWarframeData(locale);
        itemsArr.push(data);
    }
    bar.start(itemsArr.flat().length / itemsArr.length, 0);
    const csvDatas = [];
    for (const arr of itemsArr) {
        let csvData = [];
        await Promise.all(arr.map(async (data, index) => {
            const obj = {
                uniqueName: data.uniqueName || data.rewardName,
            };
            if (csvDatas.some((data) => data.uniqueName === data.uniqueName))
                return;
            countValue++;
            bar.update(countValue);
            for (let i = 0; i < locales.length; i++) {
                if (!itemsArr[i][index]) {
                    obj[`jsonData${locales[i].toUpperCase()}`] = "undefined";
                    continue;
                }
                obj[`jsonData${locales[i].toUpperCase()}`] = JSON.stringify(itemsArr[i][index])
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
        })).then(() => csvDatas.push(csvData));
    }
    const csvString = sync_1.default.stringify(csvDatas.flat(), {
        header: true,
        quoted_string: true,
    });
    bar.stop();
    const files = fs_1.default.readdirSync(APIWarframeDataDir);
    await Promise.all(files.map((file) => fs_1.default.unlinkSync(path_1.default.resolve(APIWarframeDataDir, file))));
    fs_1.default.rmdirSync(APIWarframeDataDir);
    switch (typeReturn) {
        case "Buffer": {
            return Buffer.from(csvString);
        }
        case "Array": {
            return csvDatas.flat();
        }
        default: {
            fs_1.default.writeFileSync(path_1.default.join(OutputDir, "output.csv"), csvString, "utf-8");
            console.log(`File created ${path_1.default.join(OutputDir, "output.csv")}`);
        }
    }
}
