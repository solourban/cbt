import {
  QUESTION_UPDATE_CANDIDATES,
  QUESTION_UPDATE_SUMMARY,
} from '../src/data/updates/index.js';

const ids = new Map();
const duplicatedIds = [];

for (const question of QUESTION_UPDATE_CANDIDATES) {
  if (ids.has(question.id)) {
    duplicatedIds.push(question.id);
  }
  ids.set(question.id, question.exam);
}

console.log('기출 업데이트 후보 요약');
console.table(QUESTION_UPDATE_SUMMARY);
console.log(`전체 후보 수: ${QUESTION_UPDATE_CANDIDATES.length}`);

if (duplicatedIds.length) {
  console.error(`ID 중복 발견: ${duplicatedIds.join(', ')}`);
  process.exit(1);
}

console.log('ID 중복 없음');
