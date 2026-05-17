import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const requiredFiles = ['config.js', 'questions.js', 'question-updates.js'];
const sourceIndexPath = path.join(root, 'index.html');
const targetIndexPath = path.join(dist, 'index.html');
const updateScriptTag = '<script src="question-updates.js"></script>';

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

if (!fs.existsSync(sourceIndexPath)) {
  console.error('Required file missing: index.html');
  process.exit(1);
}

let indexHtml = fs.readFileSync(sourceIndexPath, 'utf8');
if (!indexHtml.includes('question-updates.js')) {
  indexHtml = indexHtml.replace(
    '<script src="questions.js"></script>',
    `<script src="questions.js"></script>\n${updateScriptTag}`,
  );
}
fs.writeFileSync(targetIndexPath, indexHtml, 'utf8');

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
console.log(`Copied files: index.html, ${requiredFiles.join(', ')}`);
console.log('Injected question-updates.js after questions.js.');
