# 문제 데이터 스키마 기준

## 목적

문제 데이터는 앱 안의 풀이 모드와 정확히 연결되어야 한다. 특히 `년도별 기출`, `기출 섞어풀기`, `모의고사`, `OX`, `연습`을 데이터 단계에서 구분해야 한다.

## 필수 기본 필드

```js
{
  id: 20200101,
  exam: '2020년 1회',
  category: '도시설계',
  type: 'calculation',
  difficulty: 2,
  points: 4,
  question: '...',
  acceptedAnswers: [],
  keywords: {
    required: [],
    bonus: []
  },
  explanation: '...',
  tags: []
}
```

## 추가 분류 필드

앞으로 신규 데이터에는 아래 필드를 붙인다.

```js
{
  contentGroup: 'past_exam',
  modeGroup: 'yearly_exam',
  sourceType: 'reconstructed',
  cbtEligible: true
}
```

---

## contentGroup

콘텐츠의 원천과 성격을 구분한다.

### past_exam

년도별 기출·복원문제.

사용 위치:

- 년도별 기출
- 기출 섞어풀기
- 오답/북마크/통계

조건:

- 회차가 명확해야 함
- 문제 구조와 정답이 확인되어야 함
- 기출복원 자료는 `sourceType: 'reconstructed'`로 표시

### mock_exam

복원문제, 교육자료, 법령자료를 바탕으로 만든 모의고사형 문제.

사용 위치:

- 모의고사

조건:

- 실제 기출처럼 표시하지 않음
- 출제근거를 해설이나 태그에 남김

### ox

OX 전용 문제.

사용 위치:

- OX 모드

조건:

- 기존 문제에서 자동 생성한 경우 원본 문제 ID를 연결
- 별도 생성 문제면 `sourceType: 'derived'`

### practice

연습문제.

사용 위치:

- 연습

조건:

- 개념 암기, 키워드 반복, 계산 공식 연습 가능
- 기출처럼 표시하지 않음

### summary

핵심정리·해설·암기카드.

사용 위치:

- 핵심정리 / 해설

조건:

- 문제풀이 데이터와 분리

---

## modeGroup

앱 안에서 어떤 풀이 모드에 쓰이는지 구분한다.

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

오답/북마크/약점 복습 모드.

### summary

핵심정리/해설 모드.

---

## sourceType

문제의 출처 신뢰도를 나타낸다.

### actual

실제 기출 원문이 명확히 확인된 문제.

### reconstructed

기출 복원자료 기반 문제. 회차·정답 구조는 확인되지만 실제 원문과 완전히 같다고 단정하지 않는 문제.

### derived

복원문제, 교육자료, 법령자료를 바탕으로 새로 만든 시험형 문제.

### practice

개념 암기, 키워드 반복, 계산 연습용 문제.

---

## cbtEligible

기출 섞어풀기 모드에 들어갈 수 있는지 여부.

```js
cbtEligible: true
```

가능한 경우:

- `contentGroup: 'past_exam'`
- `sourceType: 'actual'` 또는 `sourceType: 'reconstructed'`
- 회차와 정답 구조가 명확함

불가능한 경우:

- 모의고사형 창작 문제
- 연습문제
- OX 전용 문제
- 핵심정리/요약자료

---

## 유형별 예시

### 년도별 기출 / 기출 섞어풀기 가능

```js
{
  id: 20200323,
  exam: '2020년 3회(2차)',
  contentGroup: 'past_exam',
  modeGroup: 'yearly_exam',
  sourceType: 'reconstructed',
  cbtEligible: true,
  category: '도시계획법규',
  type: 'short_answer',
  question: '용도지역 4가지를 쓰시오.',
  keywords: {
    required: ['도시지역', '관리지역', '농림지역', '자연환경보전지역'],
    bonus: ['용도지역']
  }
}
```

### 모의고사

```js
{
  id: 9001001,
  exam: '모의고사 1회',
  contentGroup: 'mock_exam',
  modeGroup: 'mock_exam',
  sourceType: 'derived',
  cbtEligible: false,
  question: '...'
}
```

### OX

```js
{
  id: 8001001,
  exam: 'OX',
  contentGroup: 'ox',
  modeGroup: 'ox',
  sourceType: 'derived',
  cbtEligible: false,
  originQuestionId: 20200323,
  statement: '용도지역은 도시지역, 관리지역, 농림지역, 자연환경보전지역으로 구분된다.',
  answer: true
}
```

### 연습

```js
{
  id: 7001001,
  exam: '연습문제',
  contentGroup: 'practice',
  modeGroup: 'practice',
  sourceType: 'practice',
  cbtEligible: false,
  question: '지구단위계획의 목적 4가지를 쓰시오.'
}
```

## 업데이트 원칙

1. PDF 복원자료에서 회차와 정답 구조가 확인되면 `past_exam`.
2. PDF에서 개념만 확인되고 원문이 불명확하면 `practice` 또는 `summary`.
3. 교육자료를 바탕으로 만든 시험형 문제는 `mock_exam`.
4. OX는 별도 `ox`로 분리.
5. `cbtEligible: true`는 기출 섞어풀기에 넣어도 되는 문제에만 붙인다.
