import { deleteDir } from "./deleteDir";
import { downloadWarframeData } from "./downloadData";
import { addAdditionalData } from "./addAdditionalData";
import { readWarframeData } from "./readData";
import { csvData } from "../@types/csvData";
import fs from "fs";
import path from "path";
import Progress from "cli-progress";
import csv from "csv-stringify/sync";

const bar = new Progress.Bar({
  format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
});

let countValue = 0;

const APIWarframeDataDir = path.resolve(__dirname, "../Output/APIWarframeData");
const OutputDir = path.resolve(__dirname, "../Output");
const AdditionalDataDir = path.resolve(__dirname, "../AdditionalData");

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

enum TypesReturn {
  CSV,
  Array,
  SQL,
  JSON
}

async function generateData<TypeReturn = keyof typeof TypesReturn>(
  locales: string[],
  typeReturn: TypeReturn,
  mysql: boolean = false,
  deleteDownloadedData: boolean = false
): Promise<string | csvData[]> {
  const itemsArr: any[][] = [];

  console.log("Wait collecting information...");
  deleteDir(OutputDir);

  for (const locale of locales) {
    await downloadWarframeData(locale, APIWarframeDataDir);
    await addAdditionalData(AdditionalDataDir, APIWarframeDataDir);
    const data = await readWarframeData(locale, APIWarframeDataDir);
    itemsArr.push(data);
  }

  bar.start(itemsArr.flat().length / itemsArr.length, 0);

  const csvDatas: csvData[][] = [];
  let uniqueNameLength = 0;

  for (const arr of itemsArr) {
    let csvData: csvData[] = [];

    await Promise.all(
      arr.map(async (data, indexMap) => {
        const obj: any = {
          uniqueName: data.uniqueName || data.rewardName,
        };
        if (csvDatas.some((dataDatasArr) => dataDatasArr.some((dataDatas) => dataDatas.uniqueName === obj.uniqueName)))
          return;
        if (obj.uniqueName.length > uniqueNameLength) uniqueNameLength = obj.uniqueName.length;

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
      })
    ).then(() => csvDatas.push(csvData));
  }

  const csvString = csv.stringify(csvDatas.flat() as any, {
    header: true,
    quoted_string: true,
  });

  bar.stop();

  if (typeReturn !== "JSON" && deleteDownloadedData) {
    const files = fs.readdirSync(APIWarframeDataDir);
    await Promise.all(files.map((file) => fs.unlinkSync(path.resolve(APIWarframeDataDir, file))));
    fs.rmdirSync(APIWarframeDataDir);
  }

  switch (typeReturn) {
    case "Array": {
      return csvDatas.flat();
    }
    case "SQL": {
      const flatted = csvDatas.flat();
      const insertions = flatted.map((data) => {
        const columns = Object.keys(data);
        const dataColumns = Object.values(data) as string[];

        return `INSERT INTO \`warframeLocalizations\` (\`${columns.join("`,`")}\`) VALUES ('${dataColumns
          .map((string) => string.replace(/'/gm, "\\'"))
          .join("','")}') ${
          mysql
            ? ` ON DUPLICATE KEY UPDATE ${columns
                .map((column, index) => `\`${column}\`=VALUES('${dataColumns[index]}')`)
                .join(",")}`
            : ""
        };`;
      });

      const tables = locales.map((locale) => `\`jsonData${locale.toUpperCase()}\` TEXT NOT NULL`);
      const data = `-- Generated by https://github.com/Shotplay/Warframe-items-export\nCREATE TABLE IF NOT EXISTS \`warframeLocalizations\`(\`uniqueName\` VARCHAR(${uniqueNameLength}) NOT NULL PRIMARY KEY,${tables.join(
        ","
      )});\n${insertions.join("\n")}`;

      const outputSQLPath = path.join(OutputDir, "output.sql");
      fs.writeFileSync(outputSQLPath, data, "utf-8");
      console.log(`File created ${outputSQLPath}`);
      return data;
    }
    case "JSON": {
      const JSONsPath = path.resolve(__dirname, '../build/APIWarframeData/');
      console.log(`JSONs Created ${JSONsPath}`);
      return JSONsPath;
    }
    case "CSV": {
      const outputCSVPath = path.join(OutputDir, "output.csv");
      fs.writeFileSync(outputCSVPath, csvString, "utf-8");

      console.log(`File created ${outputCSVPath}`);
      return csvString;
    }
    default: {
      throw new Error("Wrong typeReturn");
    }
  }
}

export { generateData };
