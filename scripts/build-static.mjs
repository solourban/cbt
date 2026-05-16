import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const requiredFiles = ['index.html', 'config.js', 'questions.js'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const fileName of requiredFiles) {
  const source = path.join(root, fileName);
  const target = path.join(dist, fileName);

  if (!fs.existsSync(source)) {
    console.error(`Required file missing: ${fileName}`);
    process.exit(1);
  }

  fs.copyFileSync(source, target);
}

console.log('Static legacy build complete.');
console.log(`Copied files: ${requiredFiles.join(', ')}`);
