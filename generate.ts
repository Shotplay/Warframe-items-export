import fs from "fs";
import path from "path";
import lzma from "lzma-purejs";
import csv from "csv-stringify/sync";

const APIWarframeDataDir = path.resolve(__dirname, "APIWarframeData");

async function downloadWarframeData(locale: string): Promise<void> {
  if (!fs.existsSync(APIWarframeDataDir)) {
    fs.mkdirSync(APIWarframeDataDir);
  }
  if (!fs.existsSync("./Output")) {
    fs.mkdirSync("./Output");
  }

  const response = await fetch(`https://origin.warframe.com/PublicExport/index_${locale}.txt.lzma`);
  const data = await response.arrayBuffer();
  const decompressedData = lzma.decompressFile(Buffer.from(data));
  const arrFetching = Buffer.from(decompressedData)
    .toString()
    .split("\n")
    .map((item) => item.replace(/\r/g, ""));

  await Promise.all(
    arrFetching.map(async (fetching) => {
      try {
        const response = await fetch(`https://content.warframe.com/PublicExport/Manifest/${fetching}`);
        const data = await response.text();
        const urlFetching = fetching.replace("Export", "").replace(/\.json.*/, "");
        const firstKey = !fetching.includes("Manifest") ? fetching.replace(/_.*/g, "") : fetching.replace("Export", "").replace(/\..*/g, "");
        const parsed = JSON.parse(data.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))[firstKey];
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
  const localizatedFiles = files.filter((file) => file.includes(locale));

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

async function generateCSV(locales: string[]): Promise<void> {
  const itemsArr: any[][] = [];

  for (const locale of locales) {
    await downloadWarframeData(locale);
    const data = await readWarframeData(locale);
    itemsArr.push(data);
  }

  const csvData = itemsArr[0].map((data, index) => {
    const obj: any = {
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

  const csvString = csv.stringify(csvData, {
    header: true,
    quoted_string: true,
  });

  fs.writeFileSync(path.resolve(__dirname, "Output/output.csv"), csvString, "utf-8");

  const files = fs.readdirSync(APIWarframeDataDir);
  await Promise.all(files.map((file) => fs.unlinkSync(path.resolve(APIWarframeDataDir, file))));
  fs.rmdirSync(APIWarframeDataDir);
}

generateCSV(["ru", "en"])
  .then(() => console.log(`File created! ${path.resolve(__dirname, "Output", "output.csv")}`))
  .catch((err) => console.error(err));
// GenerateCSV([locales])
