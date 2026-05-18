import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { PRIORITY_UPDATE_IDS } from '../src/data/updates/merge-selection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const requiredFiles = ['index.html', 'config.js', 'questions.js'];

for (const fileName of requiredFiles) {
  const filePath = path.join(dist, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`dist/${fileName} 파일이 없습니다. npm run build 결과를 확인하세요.`);
    process.exit(1);
  }
}

const questionsSource = fs.readFileSync(path.join(dist, 'questions.js'), 'utf8');
const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(`${questionsSource}\nthis.QUESTIONS = QUESTIONS;`, sandbox);

const questions = sandbox.QUESTIONS;
if (!Array.isArray(questions)) {
  console.error('dist/questions.js에서 QUESTIONS 배열을 읽지 못했습니다.');
  process.exit(1);
}

const questionIds = new Set(questions.map((question) => question.id));
const missingPriorityIds = PRIORITY_UPDATE_IDS.filter((id) => !questionIds.has(id));

if (missingPriorityIds.length > 0) {
  console.error(`우선 병합 후보가 dist/questions.js에 누락되었습니다: ${missingPriorityIds.join(', ')}`);
  process.exit(1);
}

const duplicatedIds = questions
  .map((question) => question.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);

if (duplicatedIds.length > 0) {
  console.error(`dist/questions.js에 중복 ID가 있습니다: ${[...new Set(duplicatedIds)].join(', ')}`);
  process.exit(1);
}

console.log('정적 빌드 검증 완료');
console.log(`dist 문제 수: ${questions.length}`);
console.log(`우선 병합 후보 반영 수: ${PRIORITY_UPDATE_IDS.length}`);
