import fs from 'fs'
import path from 'path'

function deleteDir(OutputDir: string) {
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

export { deleteDir }