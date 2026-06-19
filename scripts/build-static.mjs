import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRIORITY_QUESTION_UPDATES, MERGE_SELECTION_SUMMARY } from '../src/data/updates/merge-selection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const requiredFiles = ['index.html', 'config.js'];
const legacyQuestionsPath = path.join(root, 'questions.js');
const distQuestionsPath = path.join(dist, 'questions.js');

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

if (!fs.existsSync(legacyQuestionsPath)) {
  console.error('Required file missing: questions.js');
  process.exit(1);
}

const legacyQuestionsSource = fs.readFileSync(legacyQuestionsPath, 'utf8');
const priorityUpdatesJson = JSON.stringify(PRIORITY_QUESTION_UPDATES, null, 2);
const mergedQuestionsSource = `${legacyQuestionsSource}

// Auto-appended during static build from src/data/updates/merge-selection.js
(function appendPriorityQuestionUpdates(){
  if (typeof QUESTIONS === 'undefined' || !Array.isArray(QUESTIONS)) {
    console.error('QUESTIONS array is not available.');
    return;
  }

  const UPDATE_QUESTIONS = ${priorityUpdatesJson};
  const existingIds = new Set(QUESTIONS.map((question) => question.id));
  const filteredUpdates = UPDATE_QUESTIONS.filter((question) => !existingIds.has(question.id));

  QUESTIONS.push(...filteredUpdates);
  console.info('[CBT] priority question updates appended:', filteredUpdates.length);
})();
`;

fs.writeFileSync(distQuestionsPath, mergedQuestionsSource, 'utf8');

console.log('Static legacy build complete.');
console.log(`Copied files: ${requiredFiles.join(', ')}`);
console.log(`Merged priority updates into questions.js: ${PRIORITY_QUESTION_UPDATES.length}`);
console.log(`Selection summary: ${JSON.stringify(MERGE_SELECTION_SUMMARY)}`);
