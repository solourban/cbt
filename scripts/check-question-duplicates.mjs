import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const legacyQuestionsPath = path.join(root, 'questions.js');
const updatePath = path.join(root, 'src', 'data', 'updates', 'questions-2020.js');

function normalize(value = '') {
  return String(value)
    .replace(/\s+/g, '')
    .replace(/[()（）\[\]{}「」『』.,·:;!?]/g, '')
    .toLowerCase();
}

function loadLegacyQuestions() {
  const source = fs.readFileSync(legacyQuestionsPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.QUESTIONS = QUESTIONS;`, sandbox);
  return sandbox.QUESTIONS || [];
}

async function loadUpdates() {
  const moduleUrl = pathToFileURL(updatePath).href;
  const mod = await import(moduleUrl);
  return mod.QUESTIONS_2020_UPDATE || mod.default || [];
}

function similarity(a, b) {
  const aa = normalize(a);
  const bb = normalize(b);
  if (!aa || !bb) return 0;
  if (aa === bb) return 1;
  if (aa.includes(bb) || bb.includes(aa)) return 0.9;

  const aTokens = new Set(aa.match(/[가-힣a-z0-9]{2,}/g) || []);
  const bTokens = new Set(bb.match(/[가-힣a-z0-9]{2,}/g) || []);
  if (!aTokens.size || !bTokens.size) return 0;

  let hit = 0;
  for (const token of aTokens) if (bTokens.has(token)) hit += 1;
  return hit / Math.max(aTokens.size, bTokens.size);
}

const legacy = loadLegacyQuestions();
const updates = await loadUpdates();

const legacyIds = new Set(legacy.map((q) => q.id));
let hasIssue = false;

console.log(`기존 문제 수: ${legacy.length}`);
console.log(`업데이트 후보 수: ${updates.length}`);
console.log('');

for (const candidate of updates) {
  const idDuplicated = legacyIds.has(candidate.id);
  const closeMatches = legacy
    .map((q) => ({ q, score: similarity(candidate.question, q.question) }))
    .filter((item) => item.score >= 0.6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (idDuplicated || closeMatches.length) {
    hasIssue = true;
    console.log(`후보 ${candidate.id} / ${candidate.exam}`);
    if (idDuplicated) console.log('  - ID 중복 있음');
    for (const match of closeMatches) {
      console.log(`  - 유사 문제: ${match.q.id} / ${match.q.exam} / score=${match.score.toFixed(2)}`);
      console.log(`    ${String(match.q.question).slice(0, 120).replace(/\n/g, ' ')}`);
    }
    console.log('');
  }
}

if (!hasIssue) {
  console.log('명확한 ID/문항 중복 후보 없음');
}
