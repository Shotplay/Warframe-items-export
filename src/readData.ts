import fs from 'fs'
import path from 'path'

async function readWarframeData(locale: string, APIWarframeDataDir: string): Promise<any[]> {
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

export { readWarframeData }