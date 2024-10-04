import fs from 'fs'
import path from 'path'

async function addAdditionalData(AdditionalDataDir: string, APIWarframeDataDir: string) {
  const Files = fs.readdirSync(AdditionalDataDir);

  for (const file of Files) {
    const data = fs.readFileSync(path.join(AdditionalDataDir, file), "utf-8");
    fs.writeFileSync(path.resolve(APIWarframeDataDir, file), data);
  }
}

export { addAdditionalData}