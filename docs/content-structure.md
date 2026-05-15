# CBT 플랫폼 콘텐츠 구조

## 목적

이 플랫폼은 도시계획기사 실기 시험 대비를 위한 CBT 문제풀이 서비스다. 따라서 콘텐츠 명칭과 데이터 분류는 실제 앱 안의 구성과 맞춰 관리한다.

중요한 기준은 다음과 같다.

- 앱 전체가 CBT 플랫폼이다.
- 앱 안에 `년도별 기출`, `기출 섞어풀기`, `모의고사`, `OX`, `연습`, `오답/북마크/통계` 같은 풀이 모드가 있다.
- 데이터는 실제 기출/복원문제와 창작형 모의고사/연습문제를 분리해서 관리한다.

---

## 앱 내 구성 기준

### 1. 년도별 기출

회차별 기출·복원문제를 그대로 푸는 모드다.

예시:

```txt
2020년 1회
2020년 2회(1차)
2020년 2회(2차)
2020년 3회(1차)
2020년 3회(2차)
```

사용 목적:

- 실제 시험 회차 흐름 확인
- 회차별 문제 풀이
- 복원 기출 학습

등록 기준:

- 시험 회차가 명확해야 함
- 원문 또는 복원문제 구조가 확인되어야 함
- 정답 키워드가 명확해야 함
- 원문이 불완전하면 `기출복원` 태그를 붙임

데이터 속성 예시:

```js
sourceType: 'reconstructed'
contentGroup: 'past_exam'
modeGroup: 'yearly_exam'
exam: '2020년 1회'
cbtEligible: true
```

---

### 2. 기출 섞어풀기

여러 연도의 기출·복원문제를 섞어서 푸는 모드다.

주의: 앱 전체 이름이 CBT이므로, 이 모드를 문서에서 단순히 `CBT`라고 부르면 혼동된다. 문서상 명칭은 `기출 섞어풀기`로 둔다. 실제 UI 명칭은 앱 코드에 맞춰 최종 확정한다.

사용 목적:

- 여러 연도 기출 랜덤 풀이
- 실전 감각 유지
- 약점 유형 반복

등록 기준:

- `년도별 기출` 데이터 중 섞어풀기에 적합한 문제를 사용
- 실제 기출 또는 복원문제 기반이어야 함
- 교육자료 기반 창작문제는 기본 기출 섞어풀기 풀에 섞지 않음

데이터 속성 예시:

```js
contentGroup: 'past_exam'
modeGroup: 'mixed_exam'
cbtEligible: true
```

---

### 3. 모의고사

복원문제, 교육자료, 법령자료, 빈출 개념을 바탕으로 새로 구성한 시험형 문제다.

사용 목적:

- 실전 대비
- 기출에 없는 응용문제 대비
- 회차형 모의고사 구성

등록 기준:

- 실제 기출 원문이 아니어도 가능
- 단, 출제근거가 있어야 함
- 기출 복원과 구분해야 함
- 문제는 시험 문항 형식이어야 함

데이터 속성 예시:

```js
sourceType: 'derived'
contentGroup: 'mock_exam'
modeGroup: 'mock_exam'
exam: '모의고사 1회'
cbtEligible: false
```

---

### 4. OX

기출·복원문제 또는 핵심 개념을 OX형으로 변환한 빠른 확인 모드다.

사용 목적:

- 짧은 시간에 개념 확인
- 헷갈리는 법령·수치·정의 확인
- 이동 중 반복 학습

등록 기준:

- 실제 회차형 기출문제와 구분한다.
- OX 전용 문항은 `contentGroup: 'ox'` 또는 `modeGroup: 'ox'`로 관리한다.
- 기존 기출의 해설을 자동 변환해 생성하는 경우 원본 문제 ID를 연결한다.

데이터 속성 예시:

```js
sourceType: 'derived'
contentGroup: 'ox'
modeGroup: 'ox'
originQuestionId: 20200323
```

---

### 5. 연습

개념 암기, 키워드 확인, 계산 공식 연습용 문제다.

사용 목적:

- 단원별 기본기 강화
- 짧은 문제 반복
- 계산 공식 또는 법령 키워드 암기

등록 기준:

- 실제 기출 원문이 아니어도 가능
- 요약형·개념형 문제 가능
- 기출문제와 UI에서 명확히 분리해야 함

데이터 속성 예시:

```js
sourceType: 'practice'
contentGroup: 'practice'
modeGroup: 'practice'
exam: '연습문제'
cbtEligible: false
```

---

### 6. 오답 / 북마크 / 통계

문제 원천 데이터가 아니라 사용자 풀이 기록을 기반으로 하는 학습 보조 기능이다.

사용 목적:

- 틀린 문제 재풀이
- 북마크 문제 모아보기
- 취약 단원 확인
- 점수 추이 확인

데이터 속성 예시:

```js
answerHistory
bookmarks
weakCategories
```

---

### 7. 핵심정리 / 해설

문제 자체가 아니라 해설·요약·암기 보조 콘텐츠다.

사용 목적:

- 문제 풀이 후 개념 정리
- 법령개정 주의사항 제공
- 키워드 암기 보조

등록 기준:

- 문제 데이터와 분리
- 기출문제처럼 노출하지 않음
- 해설, 요약, 카드형 콘텐츠로 활용

데이터 속성 예시:

```js
contentGroup: 'summary'
modeGroup: 'summary'
```

---

## 문제 데이터 필드 권장안

```js
{
  id: 20200101,
  exam: '2020년 1회',
  contentGroup: 'past_exam',
  modeGroup: 'yearly_exam',
  sourceType: 'reconstructed',
  cbtEligible: true,
  category: '도시설계',
  type: 'calculation',
  difficulty: 2,
  points: 4,
  question: '...',
  steps: [],
  acceptedAnswers: [],
  keywords: {
    required: [],
    bonus: []
  },
  explanation: '...',
  tags: ['기출복원', '2020년']
}
```

## sourceType 구분

### actual

실제 기출 원문이 명확하게 확인되는 문제.

### reconstructed

복원문제 기반. 원문과 완전히 같다고 단정할 수는 없지만, 회차·문제 구조·정답이 확인되는 문제.

### derived

복원문제, 교육자료, 법령자료를 바탕으로 새로 만든 모의고사형/OX형 문제.

### practice

개념 암기, 키워드 반복, 계산 연습용 문제.

## contentGroup 구분

### past_exam

년도별 기출 및 기출 섞어풀기에 활용할 기출 기반 문제.

### mock_exam

모의고사 문제.

### ox

OX 전용 문제.

### practice

연습문제.

### summary

핵심정리, 해설, 암기카드 등 문제 외 콘텐츠.

## modeGroup 구분

### yearly_exam

년도별 기출 모드.

### mixed_exam

기출 섞어풀기 모드.

### mock_exam

모의고사 모드.

### ox

OX 모드.

### practice

연습 모드.

### review

오답·북마크·약점 복습 모드.

### summary

핵심정리/해설 모드.

## 앞으로의 업데이트 원칙

1. 기출 업데이트는 `contentGroup: 'past_exam'`에만 넣는다.
2. 기출 섞어풀기는 `past_exam` 중 `cbtEligible: true`만 사용한다.
3. 교육자료 기반 창작 문제는 `mock_exam`, `ox`, `practice`로만 넣는다.
4. 요약형 문장은 기출문제로 넣지 않는다.
5. 오래된 복원자료에서 원문이 불명확하면 `reconstructed`로 표시한다.
6. 원문 확인이 불가능한 개념형 문제는 `practice` 또는 `summary`로 분리한다.
7. 앱 내 최종 메뉴명은 코드/UI에 맞춰 확정하고, 문서 명칭도 그에 맞춰 동기화한다.
