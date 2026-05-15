import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const updatesDir = path.join(root, 'src', 'data', 'updates');
const outDir = path.join(root, 'tmp');
const outPath = path.join(outDir, 'question-update-candidates.json');

const updateFiles = [
  'questions-2020.js',
  'questions-2019.js',
  'questions-2018.js',
  'questions-2017.js',
  'questions-2016.js',
  'questions-2011.js',
];

function getDefaultExportName(fileName) {
  return fileName
    .replace('questions-', 'QUESTIONS_')
    .replace('.js', '_UPDATE')
    .replace('-', '_')
    .toUpperCase();
}

const all = [];
const missing = [];

for (const fileName of updateFiles) {
  const filePath = path.join(updatesDir, fileName);
  if (!fs.existsSync(filePath)) {
    missing.push(fileName);
    continue;
  }

  const mod = await import(pathToFileURL(filePath).href);
  const exportName = getDefaultExportName(fileName);
  const questions = mod[exportName] || mod.default || [];

  for (const question of questions) {
    all.push({
      ...question,
      updateSourceFile: fileName,
    });
  }
}

const ids = new Map();
const duplicatedIds = [];

for (const question of all) {
  if (ids.has(question.id)) {
    duplicatedIds.push({ id: question.id, files: [ids.get(question.id), question.updateSourceFile] });
  } else {
    ids.set(question.id, question.updateSourceFile);
  }
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ count: all.length, missing, duplicatedIds, questions: all }, null, 2), 'utf8');

console.log(`후보 문제 수: ${all.length}`);
if (missing.length) console.log(`아직 병합되지 않은 파일: ${missing.join(', ')}`);
if (duplicatedIds.length) {
  console.log('ID 중복 발견:');
  for (const item of duplicatedIds) console.log(`- ${item.id}: ${item.files.join(' / ')}`);
} else {
  console.log('ID 중복 없음');
}
console.log(`출력 파일: ${path.relative(root, outPath)}`);
