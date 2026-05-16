import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'questions.js');
const targetDir = path.join(root, 'src', 'data');
const targetPath = path.join(targetDir, 'questions.js');
const reportPath = path.join(root, 'tmp', 'questions-migration-report.json');

function ensureFileExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.error(`${label} 파일을 찾을 수 없습니다: ${path.relative(root, filePath)}`);
    process.exit(1);
  }
}

function loadLegacyQuestions(source) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.QUESTIONS = QUESTIONS;`, sandbox);
  return sandbox.QUESTIONS || [];
}

ensureFileExists(sourcePath, '원본 questions.js');
const source = fs.readFileSync(sourcePath, 'utf8');

if (!source.includes('const QUESTIONS =')) {
  console.error('questions.js에서 const QUESTIONS = 선언을 찾지 못했습니다.');
  process.exit(1);
}

const questions = loadLegacyQuestions(source);
if (!Array.isArray(questions)) {
  console.error('QUESTIONS가 배열이 아닙니다.');
  process.exit(1);
}

const ids = new Set();
const duplicatedIds = [];
for (const question of questions) {
  if (ids.has(question.id)) duplicatedIds.push(question.id);
  ids.add(question.id);
}

const migrated = source
  .replace('const QUESTIONS =', 'export const QUESTIONS =')
  .replace(/;\s*$/, ';\n\nexport default QUESTIONS;\n');

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetPath, migrated, 'utf8');

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      source: 'questions.js',
      target: 'src/data/questions.js',
      count: questions.length,
      duplicatedIds,
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
  'utf8',
);

console.log(`문제 데이터 모듈 생성 완료: ${path.relative(root, targetPath)}`);
console.log(`문제 수: ${questions.length}`);
console.log(duplicatedIds.length ? `ID 중복: ${duplicatedIds.join(', ')}` : 'ID 중복 없음');
console.log(`리포트: ${path.relative(root, reportPath)}`);
