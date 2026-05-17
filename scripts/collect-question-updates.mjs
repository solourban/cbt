import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const updatesIndexPath = path.join(root, 'src', 'data', 'updates', 'index.js');
const mergeSelectionPath = path.join(root, 'src', 'data', 'updates', 'merge-selection.js');
const outDir = path.join(root, 'tmp');
const outPath = path.join(outDir, 'question-update-candidates.json');

if (!fs.existsSync(updatesIndexPath)) {
  console.error('업데이트 인덱스 파일을 찾을 수 없습니다: src/data/updates/index.js');
  process.exit(1);
}

const mod = await import(pathToFileURL(updatesIndexPath).href);
const byYear = mod.QUESTION_UPDATES_BY_YEAR || {};
const all = [];

for (const [year, questions] of Object.entries(byYear)) {
  for (const question of questions) {
    all.push({
      ...question,
      updateSourceYear: year,
    });
  }
}

const ids = new Map();
const duplicatedIds = [];

for (const question of all) {
  if (ids.has(question.id)) {
    duplicatedIds.push({ id: question.id, years: [ids.get(question.id), question.updateSourceYear] });
  } else {
    ids.set(question.id, question.updateSourceYear);
  }
}

let mergeSelection = null;
if (fs.existsSync(mergeSelectionPath)) {
  const selectionMod = await import(pathToFileURL(mergeSelectionPath).href);
  mergeSelection = {
    summary: selectionMod.MERGE_SELECTION_SUMMARY,
    priorityIds: selectionMod.PRIORITY_UPDATE_IDS,
    holdIds: selectionMod.HOLD_UPDATE_IDS,
    unclassifiedIds: selectionMod.UNCLASSIFIED_QUESTION_UPDATES.map((question) => question.id),
  };
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      count: all.length,
      years: Object.fromEntries(
        Object.entries(byYear).map(([year, questions]) => [year, questions.length]),
      ),
      duplicatedIds,
      mergeSelection,
      questions: all,
    },
    null,
    2,
  ),
  'utf8',
);

console.log(`후보 문제 수: ${all.length}`);
console.log(`연도별 후보 수: ${Object.entries(byYear).map(([year, questions]) => `${year}:${questions.length}`).join(', ')}`);
if (mergeSelection) {
  console.log(`우선 병합 후보: ${mergeSelection.summary.priorityCount}`);
  console.log(`보류 후보: ${mergeSelection.summary.holdCount}`);
  console.log(`미분류 후보: ${mergeSelection.summary.unclassifiedCount}`);
}
if (duplicatedIds.length) {
  console.log('ID 중복 발견:');
  for (const item of duplicatedIds) console.log(`- ${item.id}: ${item.years.join(' / ')}`);
} else {
  console.log('ID 중복 없음');
}
console.log(`출력 파일: ${path.relative(root, outPath)}`);
