# 기출 업데이트 병합 도구

## 목적

연도별로 분리된 기출 업데이트 후보 파일을 한 번에 수집하고, 본 데이터 병합 전 상태를 점검한다.

## 전제

아래 후보 파일들이 `src/data/updates/`에 존재해야 한다.

```txt
questions-2020.js
questions-2019.js
questions-2018.js
questions-2017.js
questions-2016.js
questions-2011.js
```

현재 연도별 후보 파일은 각각 별도 PR에 있으므로, 해당 PR들이 병합된 뒤 본 도구를 실행한다.

## 후보 수집

```bash
node scripts/collect-question-updates.mjs
```

실행 결과:

```txt
후보 문제 수
아직 병합되지 않은 파일
ID 중복 여부
출력 파일 위치
```

출력 파일:

```txt
tmp/question-update-candidates.json
```

## 출력 JSON 구조

```json
{
  "count": 30,
  "missing": [],
  "duplicatedIds": [],
  "questions": []
}
```

## 병합 흐름

1. 연도별 후보 PR 병합
2. `node scripts/collect-question-updates.mjs` 실행
3. `tmp/question-update-candidates.json` 확인
4. ID 중복·문항 중복 확인
5. 우선 병합 후보만 본 데이터에 추가
6. 보류 후보는 `hold` 또는 문서로 유지

## 주의

- 이 스크립트는 본 `questions.js`를 직접 수정하지 않는다.
- 후보 데이터를 모으고 검토용 JSON을 만드는 역할만 한다.
- 본 데이터 병합은 Vite 전환 후 `src/data/questions.js` 기준으로 하는 것을 권장한다.
