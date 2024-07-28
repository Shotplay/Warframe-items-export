"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lzma_purejs_1 = __importDefault(require("lzma-purejs"));
const sync_1 = __importDefault(require("csv-stringify/sync"));
const APIWarframeDataDir = path_1.default.resolve(__dirname, "APIWarframeData");
async function downloadWarframeData(locale) {
    if (!fs_1.default.existsSync(APIWarframeDataDir)) {
        fs_1.default.mkdirSync(APIWarframeDataDir);
    }
    if (!fs_1.default.existsSync("./Output")) {
        fs_1.default.mkdirSync("./Output");
    }
    const response = await fetch(`https://origin.warframe.com/PublicExport/index_${locale}.txt.lzma`);
    const data = await response.arrayBuffer();
    const decompressedData = lzma_purejs_1.default.decompressFile(Buffer.from(data));
    const arrFetching = Buffer.from(decompressedData)
        .toString()
        .split("\n")
        .map((item) => item.replace(/\r/g, ""));
    await Promise.all(arrFetching.map(async (fetching) => {
        try {
            const response = await fetch(`https://content.warframe.com/PublicExport/Manifest/${fetching}`);
            const data = await response.text();
            const urlFetching = fetching.replace("Export", "").replace(/\.json.*/, "");
            const firstKey = !fetching.includes("Manifest") ? fetching.replace(/_.*/g, "") : fetching.replace("Export", "").replace(/\..*/g, "");
            const parsed = JSON.parse(data.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))[firstKey];
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
    const localizatedFiles = files.filter((file) => file.includes(locale));
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
async function generateCSV(locales) {
    const itemsArr = [];
    for (const locale of locales) {
        await downloadWarframeData(locale);
        const data = await readWarframeData(locale);
        itemsArr.push(data);
    }
    const csvData = itemsArr[0].map((data, index) => {
        const obj = {
            uniqueName: data.uniqueName || data.rewardName,
        };
        for (let i = 0; i < locales.length; i++) {
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
        return obj;
    });
    const csvString = sync_1.default.stringify(csvData, {
        header: true,
        quoted_string: true,
    });
    fs_1.default.writeFileSync(path_1.default.resolve(__dirname, "Output/output.csv"), csvString, "utf-8");
    const files = fs_1.default.readdirSync(APIWarframeDataDir);
    await Promise.all(files.map((file) => fs_1.default.unlinkSync(path_1.default.resolve(APIWarframeDataDir, file))));
    fs_1.default.rmdirSync(APIWarframeDataDir);
}
generateCSV(["ru", "en"]).catch((err) => console.error(err));
//# sourceMappingURL=generate.js.map