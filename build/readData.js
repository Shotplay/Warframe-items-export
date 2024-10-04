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
exports.readWarframeData = readWarframeData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function readWarframeData(locale, APIWarframeDataDir) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
