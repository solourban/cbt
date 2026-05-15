import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const updatesDir = path.join(root, 'src', 'data', 'updates');

const allowedContentGroups = new Set(['past_exam', 'mock_exam', 'ox', 'practice', 'summary']);
const allowedModeGroups = new Set(['yearly_exam', 'mixed_exam', 'mock_exam', 'ox', 'practice', 'review', 'summary']);
const allowedSourceTypes = new Set(['actual', 'reconstructed', 'derived', 'practice']);
const allowedTypes = new Set(['short_answer', 'keyword_essay', 'calculation']);

function hasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

async function loadQuestionFile(filePath) {
  const mod = await import(pathToFileURL(filePath).href);
  const arrays = Object.values(mod).filter(Array.isArray);
  return arrays.flat();
}

if (!fs.existsSync(updatesDir)) {
  console.log('업데이트 후보 디렉터리가 없습니다.');
  process.exit(0);
}

const files = fs.readdirSync(updatesDir).filter((file) => file.endsWith('.js'));
let errorCount = 0;
let questionCount = 0;

for (const file of files) {
  const filePath = path.join(updatesDir, file);
  const questions = await loadQuestionFile(filePath);
  questionCount += questions.length;

  for (const q of questions) {
    const prefix = `${file} / ${q.id ?? 'NO_ID'}`;

    const requiredFields = ['id', 'exam', 'category', 'type', 'difficulty', 'points', 'question', 'keywords', 'explanation', 'tags'];
    for (const field of requiredFields) {
      if (!hasValue(q[field])) {
        console.error(`${prefix}: 필수 필드 누락 - ${field}`);
        errorCount += 1;
      }
    }

    if (q.type && !allowedTypes.has(q.type)) {
      console.error(`${prefix}: 허용되지 않은 type - ${q.type}`);
      errorCount += 1;
    }

    if (!q.keywords?.required || !Array.isArray(q.keywords.required)) {
      console.error(`${prefix}: keywords.required 배열 누락`);
      errorCount += 1;
    }

    if (!Array.isArray(q.tags)) {
      console.error(`${prefix}: tags 배열 누락`);
      errorCount += 1;
    }

    // 새 스키마 필드. 기존 레거시 데이터에는 없을 수 있으나 업데이트 후보에는 붙이는 것을 원칙으로 한다.
    if (!allowedContentGroups.has(q.contentGroup)) {
      console.error(`${prefix}: contentGroup 누락 또는 오류 - ${q.contentGroup}`);
      errorCount += 1;
    }

    if (!allowedModeGroups.has(q.modeGroup)) {
      console.error(`${prefix}: modeGroup 누락 또는 오류 - ${q.modeGroup}`);
      errorCount += 1;
    }

    if (!allowedSourceTypes.has(q.sourceType)) {
      console.error(`${prefix}: sourceType 누락 또는 오류 - ${q.sourceType}`);
      errorCount += 1;
    }

    if (typeof q.cbtEligible !== 'boolean') {
      console.error(`${prefix}: cbtEligible boolean 누락`);
      errorCount += 1;
    }

    if (q.cbtEligible === true && q.contentGroup !== 'past_exam') {
      console.error(`${prefix}: cbtEligible true는 past_exam에만 허용`);
      errorCount += 1;
    }
  }
}

console.log(`검사 파일 수: ${files.length}`);
console.log(`검사 문제 수: ${questionCount}`);

if (errorCount > 0) {
  console.error(`스키마 오류 수: ${errorCount}`);
  process.exit(1);
}

console.log('문제 데이터 스키마 검사 통과');
