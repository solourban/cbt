# 기출 업데이트 스크립트 사용법

## 중복검사

2020년 업데이트 후보와 기존 `questions.js`의 ID 및 유사 문항을 비교한다.

```bash
node scripts/check-question-duplicates.mjs
```

## 주의

현재 `question-update-2020-first` 브랜치는 정적 앱 기반 브랜치라 `package.json`이 없을 수 있다.
Vite 전환 브랜치와 병합한 뒤에는 `package.json`의 scripts에 다음 명령을 추가할 수 있다.

```json
{
  "scripts": {
    "check:duplicates": "node scripts/check-question-duplicates.mjs"
  }
}
```

## 병합 전 확인 순서

1. `node scripts/check-question-duplicates.mjs` 실행
2. ID 중복 여부 확인
3. 문항 유사도 0.6 이상 항목 수동 검토
4. 신규 추가/기존 보강/보류로 분류
5. 본 `questions.js` 또는 Vite 전환 후 `src/data/questions.js`에 병합
