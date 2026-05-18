import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRIORITY_QUESTION_UPDATES, MERGE_SELECTION_SUMMARY } from '../src/data/updates/merge-selection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const requiredFiles = ['config.js'];
const legacyIndexPath = path.join(root, 'index.html');
const distIndexPath = path.join(dist, 'index.html');
const legacyQuestionsPath = path.join(root, 'questions.js');
const distQuestionsPath = path.join(dist, 'questions.js');

function patchLegacyIndex(source) {
  const safeShortAnswerScorer = `function grS(q,a){
  const c=(a||"").trim().replace(/\\s+/g,"").replace(/[()（）]/g,"").toLowerCase();
  if(!c)return{s:0,m:q.points,fb:[]};
  const has=(kw)=>{
    const kk=String(kw||"").replace(/\\s+/g,"").toLowerCase();
    if(!kk)return false;
    if(kk.length<=2||/^\\d+$/.test(kk)){
      const safe=kk.replace(/[.*+?^\${}()|[\\]\\\\]/g,"\\\\$&");
      return c===kk||new RegExp("(?:^|[^0-9a-zA-Z가-힣])"+safe+"(?:$|[^0-9a-zA-Z가-힣])").test(c);
    }
    return c.includes(kk);
  };
  const r=q.keywords?.required||[];
  if(q.acceptedAnswers?.length){
    for(const ac of q.acceptedAnswers){
      if(ac.every(x=>has(x)))return{s:q.points,m:q.points,fb:["정답입니다!"]};
    }
  }
  const mt=r.filter(has),ms=r.filter(k=>!has(k)),bn=(q.keywords?.bonus||[]).filter(has);
  const rt=r.length>0?mt.length/r.length:0,sc=Math.round(q.points*rt),fb=[];
  if(mt.length)fb.push("✓ "+mt.join(", "));
  if(ms.length)fb.push("✗ "+ms.join(", "));
  if(bn.length)fb.push("+ "+bn.join(", "));
  return{s:sc,m:q.points,fb};
}
`;

  const patched = source.replace(/function grS\(q,a\)\{[\s\S]*?\nfunction grE\(q,a\)\{/, `${safeShortAnswerScorer}function grE(q,a){`);
  if (patched === source) {
    console.warn('Legacy short-answer scorer patch was not applied.');
  }
  return patched;
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

if (!fs.existsSync(legacyIndexPath)) {
  console.error('Required file missing: index.html');
  process.exit(1);
}

const patchedIndexSource = patchLegacyIndex(fs.readFileSync(legacyIndexPath, 'utf8'));
fs.writeFileSync(distIndexPath, patchedIndexSource, 'utf8');

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
console.log('Copied files: index.html, config.js');
console.log(`Merged priority updates into questions.js: ${PRIORITY_QUESTION_UPDATES.length}`);
console.log(`Selection summary: ${JSON.stringify(MERGE_SELECTION_SUMMARY)}`);
