import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const updatesDir = path.join(root, 'src', 'data', 'updates');

const files = process.argv.slice(2);

if (!files.length) {
  console.error('사용법: node scripts/apply-past-exam-metadata.mjs src/data/updates/questions-2020.js');
  process.exit(1);
}

for (const relativePath of files) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    console.error(`파일 없음: ${relativePath}`);
    process.exitCode = 1;
    continue;
  }

  let source = fs.readFileSync(filePath, 'utf8');

  // 이미 contentGroup이 있으면 중복 삽입하지 않는다.
  if (source.includes('contentGroup:')) {
    console.log(`이미 메타데이터가 있는 것으로 판단되어 건너뜀: ${relativePath}`);
    continue;
  }

  // 각 문제 객체에서 exam 필드 바로 뒤에 기출 메타데이터를 삽입한다.
  source = source.replace(
    /(exam:\s*['"][^'"\n]+['"],\n)/g,
    `$1    contentGroup: 'past_exam',\n    modeGroup: 'yearly_exam',\n    sourceType: 'reconstructed',\n    cbtEligible: true,\n`
  );

  fs.writeFileSync(filePath, source, 'utf8');
  console.log(`기출 메타데이터 적용 완료: ${relativePath}`);
}
