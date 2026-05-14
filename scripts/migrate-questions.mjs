import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'questions.js');
const targetDir = path.join(root, 'src', 'data');
const targetPath = path.join(targetDir, 'questions.js');

if (!fs.existsSync(sourcePath)) {
  console.error('questions.js 파일을 찾을 수 없습니다.');
  process.exit(1);
}

const source = fs.readFileSync(sourcePath, 'utf8');

if (!source.includes('const QUESTIONS =')) {
  console.error('questions.js에서 const QUESTIONS = 선언을 찾지 못했습니다.');
  process.exit(1);
}

const migrated = source
  .replace('const QUESTIONS =', 'export const QUESTIONS =')
  .replace(/;\s*$/, ';\n\nexport default QUESTIONS;\n');

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetPath, migrated, 'utf8');

console.log(`문제 데이터 모듈 생성 완료: ${path.relative(root, targetPath)}`);
