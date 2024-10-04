"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDir = deleteDir;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function deleteDir(OutputDir) {
    if (!fs_1.default.existsSync(OutputDir)) {
        fs_1.default.mkdirSync(OutputDir);
        return;
    }
    const files = fs_1.default.readdirSync(OutputDir);
    for (const file of files) {
        fs_1.default.unlinkSync(path_1.default.join(OutputDir, file));
    }
    fs_1.default.rmdirSync(OutputDir);
    fs_1.default.mkdirSync(OutputDir);
}
