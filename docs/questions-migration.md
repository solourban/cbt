# questions.js 모듈 이전

## 목적

기존 정적 앱의 루트 `questions.js`를 Vite/React 앱에서 import할 수 있는 모듈 파일로 변환한다.

기존 정적 배포를 깨지 않기 위해 원본 `questions.js`는 유지하고, 변환 결과를 `src/data/questions.js`에 생성한다.

## 실행 명령

```bash
npm run migrate:questions
```

또는 직접 실행:

```bash
node scripts/migrate-questions.mjs
```

## 변환 방식

기존:

```js
const QUESTIONS = [ ... ];
```

변환:

```js
export const QUESTIONS = [ ... ];
export default QUESTIONS;
```

## 출력 파일

```txt
src/data/questions.js
tmp/questions-migration-report.json
```

## 리포트 내용

```json
{
  "source": "questions.js",
  "target": "src/data/questions.js",
  "count": 0,
  "duplicatedIds": [],
  "generatedAt": "..."
}
```

## 주의

- 이 스크립트는 본 PR에서 실제 `src/data/questions.js`를 커밋하지 않는다.
- 로컬 또는 CI에서 실행한 뒤 결과를 확인하고 별도 PR로 커밋한다.
- 원본 `questions.js`는 기존 정적 HTML 앱을 위해 당분간 유지한다.
- Vite 앱 전환이 완료되면 루트 `questions.js`는 legacy로 이동하거나 제거한다.

## 다음 작업

1. `npm run migrate:questions` 실행
2. `tmp/questions-migration-report.json` 확인
3. `src/data/questions.js` 커밋
4. `src/App.jsx`에서 `QUESTIONS` import 적용
5. 기존 정적 `index.html` 앱과 Vite 앱 동작 비교
