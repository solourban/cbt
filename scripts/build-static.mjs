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
const distIndexPath = path.join(dist, 'index.html');
const distQuestionsPath = path.join(dist, 'questions.js');

const legacyShortAnswerScoringPatch = String.raw`function grS(q,a){
  const normalizeAnswer=v=>String(v||"").trim().replace(/\s+/g,"").replace(/[()（）]/g,"").toLowerCase();
  const escapeRegExp=v=>String(v||"").replace(/[|\\{}()[\]^$+*?.]/g,"\\$&");
  const hasKeyword=(answer,keyword)=>{
    const target=normalizeAnswer(keyword);
    if(!target)return false;
    if(/^\d+$/.test(target)){
      const re=new RegExp("(?:^|[^0-9])"+escapeRegExp(target)+"(?![0-9])");
      return re.test(answer);
    }
    return answer.includes(target);
  };
  const c=normalizeAnswer(a);
  const max=q.points||0;
  if(!c)return{s:0,m:max,fb:[]};
  const required=q.keywords?.required||[];
  const bonus=q.keywords?.bonus||[];
  if(q.acceptedAnswers?.length){
    for(const accepted of q.acceptedAnswers){
      if(accepted.every(item=>hasKeyword(c,item)))return{s:max,m:max,fb:["정답입니다!"]};
    }
  }
  const mt=required.filter(item=>hasKeyword(c,item));
  const ms=required.filter(item=>!hasKeyword(c,item));
  const bn=bonus.filter(item=>hasKeyword(c,item));
  const rate=required.length>0?mt.length/required.length:0;
  const sc=Math.round(max*rate);
  const fb=[];
  if(mt.length)fb.push("✓ "+mt.join(", "));
  if(ms.length)fb.push("✗ "+ms.join(", "));
  if(bn.length)fb.push("+ "+bn.join(", "));
  return{s:sc,m:max,fb};
}`;

function patchLegacyIndexHtml(indexSource) {
  const patched = indexSource.replace(/function grS\(q,a\)\{.*?\}\nfunction grE\(q,a\)\{/s, `${legacyShortAnswerScoringPatch}\nfunction grE(q,a){`);

  if (patched === indexSource) {
    console.error('Failed to patch legacy grS function in index.html');
    process.exit(1);
  }

  return patched;
}

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

const legacyIndexSource = fs.readFileSync(distIndexPath, 'utf8');
fs.writeFileSync(distIndexPath, patchLegacyIndexHtml(legacyIndexSource), 'utf8');

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
console.log('Patched legacy short-answer scoring function: grS');
console.log(`Merged priority updates into questions.js: ${PRIORITY_QUESTION_UPDATES.length}`);
console.log(`Selection summary: ${JSON.stringify(MERGE_SELECTION_SUMMARY)}`);
