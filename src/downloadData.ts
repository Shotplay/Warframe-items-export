import fs from 'fs'
import path from 'path'
import lzma from "lzma-purejs";

async function downloadWarframeData(locale: string, APIWarframeDataDir: string): Promise<void> {
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

export { downloadWarframeData }