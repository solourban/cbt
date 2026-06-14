# CBT 법령 연계 설계안

## 목적

도시계획기사 CBT의 법령형 문제를 단순 암기 문제로만 두지 않고, 법령 근거·기준일·개정 여부와 연결한다.

목표는 다음 세 가지다.

1. 문제 해설의 법령 근거를 명확히 한다.
2. 법령 개정으로 정답이 바뀌는 문제를 표시한다.
3. 향후 법제처 API 또는 `korean-law-mcp` 기반 검증 기능으로 확장한다.

---

## 참고 코드

참고 repo:

```txt
https://github.com/chrisryugj/korean-law-mcp.git
```

해당 프로젝트는 법제처 Open API 기반 MCP/CLI로, 법령 검색, 조문 조회, 자치법규, 판례, 행정규칙, 인용 검증, 시점 비교 등을 제공한다.

CBT에 그대로 복붙하는 것이 아니라, 구조와 역할 분리를 참고한다.

---

## 붙이면 안 되는 방식

정적 프론트에서 법제처 API 또는 MCP를 직접 호출하면 안 된다.

이유:

- API 키 또는 OC 키 노출 위험
- CORS 문제
- 호출 실패 시 사용자 화면 전체 오류 가능
- 법령 조회 결과 캐싱 어려움
- 유료 서비스 전환 시 남용 방지 불가

---

## 권장 구조

```txt
CBT Frontend
  ↓
Vercel Function / Supabase Edge Function
  ↓
Law Service Adapter
  ↓
korean-law-mcp 또는 법제처 Open API
```

프론트는 법령 결과를 직접 만들지 않고, 서버에서 검증·정리한 결과만 받는다.

---

## 최소 기능 범위

### 1단계

- 문제별 법령 근거 메타데이터 추가
- 해설 하단에 법령 근거 표시
- 법령개정 주의 배지 표시

### 2단계

- 법령명 검색
- 조문 조회
- 기준일 기준 법령 조회
- 문제 해설의 조문 인용 검증

### 3단계

- 출제 당시 법령과 현행 법령 비교
- 법령 개정 문제 자동 태깅
- 문제별 최신성 점검 리포트 생성

---

## 문제 데이터 확장안

기존 문제 객체에 `lawRefs`를 추가한다.

```js
{
  id: 101,
  exam: "2023년 1회",
  question: "...",
  explanation: "...",
  lawRefs: [
    {
      lawName: "국토의 계획 및 이용에 관한 법률",
      article: "제36조",
      basisDate: "2026-01-01",
      purpose: "용도지역 지정 근거",
      status: "needs_verification"
    }
  ]
}
```

---

## 법령 상태값

```txt
current             현행 기준 확인됨
changed             법령 개정으로 표현 또는 정답 주의 필요
historical          출제 당시 법령 기준
needs_verification  아직 검증 필요
unknown             법령 근거 미확인
```

---

## 화면 표시 방식

문제 해설 하단에 작게 표시한다.

```txt
법령 근거
- 국토의 계획 및 이용에 관한 법률 제36조
- 기준일: 2026-01-01
- 상태: 검증 필요
```

법령개정 문제가 있으면 상단에 배지를 붙인다.

```txt
⚠ 법령개정 주의
출제 당시 표현과 현행 법령 표현이 다를 수 있습니다.
```

---

## 서버 API 설계 초안

### GET /api/law/search

```txt
query=국토계획법
```

반환:

```json
{
  "items": [
    {
      "lawName": "국토의 계획 및 이용에 관한 법률",
      "lawId": "...",
      "isCurrent": true
    }
  ]
}
```

### GET /api/law/article

```txt
lawName=국토의 계획 및 이용에 관한 법률
article=제36조
basisDate=2026-01-01
```

반환:

```json
{
  "lawName": "국토의 계획 및 이용에 관한 법률",
  "article": "제36조",
  "basisDate": "2026-01-01",
  "text": "...",
  "status": "current",
  "sourceUrl": "..."
}
```

### POST /api/law/verify-question

입력:

```json
{
  "questionId": 101,
  "lawRefs": []
}
```

반환:

```json
{
  "questionId": 101,
  "status": "changed",
  "warnings": ["법령명 또는 조문 표현이 개정되었을 수 있음"]
}
```

---

## `korean-law-mcp` 참고 포인트

해당 repo에서 참고할 구조:

- 도구 레지스트리 방식
- 법령 검색과 조문 조회 분리
- 인용 검증 기능
- 시점 비교 기능
- 법령 현행성 가드
- 오류 메시지 명확화

CBT에 필요한 것은 전체 MCP 서버가 아니라, 다음 개념이다.

```txt
law search
article lookup
citation verification
basis-date comparison
currentness warning
```

---

## 적용 순서

1. 문제 데이터에 `lawRefs` 필드만 먼저 추가한다.
2. 화면에는 정적 법령 근거만 표시한다.
3. 서버 API는 나중에 추가한다.
4. 법령 검증 자동화는 `lawRefs` 데이터가 쌓인 뒤 진행한다.
5. 도시계획기사 주요 법령부터 우선 검증한다.

---

## 우선 검증 법령

- 국토의 계획 및 이용에 관한 법률
- 국토기본법
- 도시개발법
- 도시 및 주거환경정비법
- 도시재생 활성화 및 지원에 관한 특별법
- 수도권정비계획법
- 주택법
- 건축법
- 산업입지 및 개발에 관한 법률
- 스마트도시 조성 및 산업진흥 등에 관한 법률

---

## 판단

법령 연계는 CBT의 차별화 요소가 될 수 있다.

다만 지금 바로 API를 붙이는 것보다, 먼저 문제 데이터에 법령 메타데이터를 붙이는 것이 안전하다.

현재 우선순위는 다음이다.

```txt
1. 채점 안정화
2. QA 버그 수집
3. 문제 데이터 구조 정리
4. 법령 근거 메타데이터 추가
5. 서버 기반 법령 조회 연계
```
