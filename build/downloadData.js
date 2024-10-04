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
exports.downloadWarframeData = downloadWarframeData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lzma_purejs_1 = __importDefault(require("lzma-purejs"));
function downloadWarframeData(locale, APIWarframeDataDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(APIWarframeDataDir))
            fs_1.default.mkdirSync(APIWarframeDataDir);
        const response = yield fetch(`https://origin.warframe.com/PublicExport/index_${locale}.txt.lzma`);
        const data = yield response.arrayBuffer();
        const decompressedData = lzma_purejs_1.default.decompressFile(Buffer.from(data));
        const arrFetching = Buffer.from(decompressedData)
            .toString()
            .split("\n")
            .map((item) => item.replace(/\r/g, ""));
        let locked = 0;
        yield Promise.all(arrFetching.map((fetching) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`https://content.warframe.com/PublicExport/Manifest/${fetching}`);
                const data = yield response.text();
                const urlFetching = fetching.replace("Export", "").replace(/\.json.*/, "");
                const firstKey = !fetching.includes("Manifest")
                    ? fetching.replace(/_.*/g, "")
                    : fetching.replace("Export", "").replace(/\..*/g, "");
                const parsed = JSON.parse(data.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))[firstKey].filter((data) => {
                    if (data.uniqueName !== "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchLongGun/ThanoTechLongGun" ||
                        locked < 1) {
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
        })));
    });
}
