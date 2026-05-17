import { MERGE_SELECTION_SUMMARY, PRIORITY_UPDATE_IDS, HOLD_UPDATE_IDS, UNCLASSIFIED_QUESTION_UPDATES } from '../src/data/updates/merge-selection.js';

console.log('기출 후보 병합 선택 요약');
console.log(MERGE_SELECTION_SUMMARY);

if (UNCLASSIFIED_QUESTION_UPDATES.length > 0) {
  console.log('미분류 후보가 있습니다:');
  for (const question of UNCLASSIFIED_QUESTION_UPDATES) {
    console.log(`- ${question.id} / ${question.exam} / ${question.question.slice(0, 60).replace(/\n/g, ' ')}`);
  }
  process.exitCode = 1;
}

const duplicatedSelectionIds = [...PRIORITY_UPDATE_IDS, ...HOLD_UPDATE_IDS].filter((id, index, array) =>
  array.indexOf(id) !== index,
);

if (duplicatedSelectionIds.length > 0) {
  console.log(`선택 목록 ID 중복: ${duplicatedSelectionIds.join(', ')}`);
  process.exitCode = 1;
}

if (!UNCLASSIFIED_QUESTION_UPDATES.length && !duplicatedSelectionIds.length) {
  console.log('병합 선택 목록 검증 완료');
}
