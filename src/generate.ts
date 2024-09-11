import { csvData } from "../@types/csvData";
import fs from "fs";
import path from "path";
import lzma from "lzma-purejs";
import Progress from "cli-progress";
import csv from "csv-stringify/sync";

const bar = new Progress.Bar({
  format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
});

let countValue = 0;

const APIWarframeDataDir = path.resolve(__dirname, "APIWarframeData");
const OutputDir = path.resolve(__dirname, "..", "Output");
const AdditionalDataDir = path.resolve(__dirname, "..", "AdditionalData");

function deleteDir() {
  if (!fs.existsSync(OutputDir)) {
    fs.mkdirSync(OutputDir);
    return;
  }

  const files = fs.readdirSync(OutputDir);

  for (const file of files) {
    fs.unlinkSync(path.join(OutputDir, file));
  }

  fs.rmdirSync(OutputDir);
  fs.mkdirSync(OutputDir);
}

async function addAdditional() {
  const Files = fs.readdirSync(AdditionalDataDir);

  for (const file of Files) {
    const data = fs.readFileSync(path.join(AdditionalDataDir, file), "utf-8");
    fs.writeFileSync(path.resolve(APIWarframeDataDir, file), data);
  }
}

async function downloadWarframeData(locale: string): Promise<void> {
  if (!fs.existsSync(APIWarframeDataDir)) fs.mkdirSync(APIWarframeDataDir);
  const response = await fetch(`https://origin.warframe.com/PublicExport/index_${locale}.txt.lzma`);
  const data = await response.arrayBuffer();
  const decompressedData = lzma.decompressFile(Buffer.from(data));
  const arrFetching = Buffer.from(decompressedData)
    .toString()
    .split("\n")
    .map((item) => item.replace(/\r/g, ""));

  let locked = 0;

  await Promise.all(
    arrFetching.map(async (fetching) => {
      try {
        const response = await fetch(`https://content.warframe.com/PublicExport/Manifest/${fetching}`);
        const data = await response.text();
        const urlFetching = fetching.replace("Export", "").replace(/\.json.*/, "");
        const firstKey = !fetching.includes("Manifest")
          ? fetching.replace(/_.*/g, "")
          : fetching.replace("Export", "").replace(/\..*/g, "");
        const parsed = JSON.parse(data.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))[firstKey].filter((data) => {
          if (
            data.uniqueName !== "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchLongGun/ThanoTechLongGun" ||
            locked < 1
          ) {
            if (data.uniqueName === "/Lotus/Weapons/Tenno/Archwing/Primary/ThanoTechArchLongGun/ThanoTechLongGun")
              locked++;
            return true;
          } else {
            return false;
          }
        });
        const stringified = JSON.stringify(parsed, null, 2);

        fs.writeFileSync(path.resolve(APIWarframeDataDir, `${urlFetching}.json`), stringified);
      } catch (err) {
        console.error(err);
      }
    })
  );
}

async function readWarframeData(locale: string): Promise<any[]> {
  const files = fs.readdirSync(APIWarframeDataDir);
  const localizatedFiles = files.filter((file) => file.includes(`_${locale}`));

  const allInOne: any[] = [];

  for (const file of localizatedFiles) {
    const data = fs.readFileSync(path.resolve(APIWarframeDataDir, file), "utf-8");
    const parsed = JSON.parse(data);

    if (Array.isArray(parsed)) {
      allInOne.push(...parsed);
    }
  }

  return allInOne;
}

/**
 * - Create and/or return Array/CSV/SQL File Warframe Public Export Data
 * @param {string[]} locales
 * @param {string} [typeReturn="CSV"] Buffer or Array
 * @param {boolean} [mysql=false] Update duplicate for mysql
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

async function generateData(
  locales: string[],
  typeReturn: string = "CSV",
  mysql: boolean = false
): Promise<string | csvData[]> {
  const itemsArr: any[][] = [];

  console.log("Wait collecting information...");
  deleteDir();

  for (const locale of locales) {
    await downloadWarframeData(locale);
    await addAdditional();
    const data = await readWarframeData(locale);
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

  const files = fs.readdirSync(APIWarframeDataDir);
  await Promise.all(files.map((file) => fs.unlinkSync(path.resolve(APIWarframeDataDir, file))));
  fs.rmdirSync(APIWarframeDataDir);

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
