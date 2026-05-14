# Vite 전환 작업 메모

## 현재 전략

기존 `index.html` 단일 파일 앱을 한 번에 제거하지 않고, Vite/React 구조를 병행 구축합니다. 기존 정적 배포가 깨지는 것을 방지하기 위해 다음 순서로 진행합니다.

## 완료

- `package.json` 추가
- `vite.config.js` 추가
- `src/main.jsx` 추가
- `src/App.jsx` 임시 확인 화면 추가
- `src/lib/scoring.js` 채점 엔진 분리
- `src/lib/scoring.test.js` 채점 테스트 추가
- `src/config.js` 모듈 설정 추가
- `scripts/migrate-questions.mjs` 추가

## 문제 데이터 이전 방법

```bash
npm run migrate:questions
```

위 명령을 실행하면 루트의 `questions.js`를 읽어 `src/data/questions.js`로 변환합니다.

변환 방식:

```js
const QUESTIONS = [ ... ]
```

을 다음 형태로 바꿉니다.

```js
export const QUESTIONS = [ ... ];
export default QUESTIONS;
```

## 다음 작업

1. 기존 `index.html` 내부의 App 컴포넌트를 `src/App.jsx`로 이전
2. 기존 인라인 스타일 상수와 유틸 함수를 모듈화
3. 기존 `g1`, `grS`, `grE`, `grC`, `grSubs` 호출부를 `src/lib/scoring.js` 기준으로 교체
4. Vercel 프로젝트 설정 변경
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 정적 HTML 백업 후 제거 또는 `legacy/index.html`로 이동

## 주의

- `questions.js`는 현재 유료 문제 보호가 되지 않습니다.
- 판매용 전환 시에는 무료 문제만 프론트에 두고, 유료 문제는 Supabase DB에서 권한 확인 후 내려줘야 합니다.
