# CBT 서비스 보안·운영 점검

## 현재 상태

현재 앱은 `index.html`, `config.js`, `questions.js`로 구성된 정적 React 앱입니다. Vercel 정적 배포에는 적합하지만, 유료 CBT 서비스로 운영하기에는 인증·결제·문제 데이터 보호 구조가 부족합니다.

## 즉시 확인된 위험

### 1. 유료 문제 데이터 노출

`questions.js`에 문제 데이터 전체가 포함되어 있으면 사용자는 개발자도구 또는 소스 보기로 전체 문제를 확인할 수 있습니다. 화면에서 프리미엄 잠금을 적용해도 데이터 자체는 이미 브라우저에 내려온 상태입니다.

대응 방향:

- 무료 문제만 정적 파일로 제공
- 유료 문제는 Supabase DB에 저장
- 프리미엄 권한이 있는 사용자에게만 서버에서 조회 허용

### 2. 프론트엔드 인증 우회

정적 앱에서 `localStorage`로 프리미엄 상태를 판단하면 사용자가 브라우저에서 값을 조작할 수 있습니다.

대응 방향:

- 프리미엄 여부는 서버 또는 Supabase RLS 기준으로 판정
- 프론트엔드는 표시만 담당
- 결제·이용권 검증은 서버 함수에서 처리

### 3. 공개 설정 파일에 민감 로직 배치

`config.js`는 누구나 볼 수 있습니다. 관리자 코드, API 키, 결제 검증 키, DB 서비스 키를 넣으면 안 됩니다.

대응 방향:

- 공개 가능한 안내 문구만 `config.js`에 배치
- 민감정보는 Vercel/Supabase 환경변수에 저장
- 저장소 히스토리에 민감정보가 들어갔다면 키를 폐기하고 새로 발급

## 현재 구조에서 낮은 위험

- SQL Injection: 현재 DB 쿼리가 없어 직접 위험은 낮음
- 인증 없는 API: 현재 백엔드 API가 없어 직접 위험은 낮음
- 개인정보 대량 유출: 회원가입·DB 저장이 없으면 직접 위험은 낮음

다만 Supabase, 결제, 관리자 페이지를 붙이는 순간 위 항목은 다시 점검해야 합니다.

## 운영형 전환 권장 구조

```txt
Frontend: Vercel + React/Vite 또는 Next.js
Auth: Supabase Auth
Database: Supabase Postgres
Authorization: Supabase RLS
Payment v1: 수동 입금 + 관리자 승인
Payment v2: 토스페이먼츠 또는 Google Play Billing
Admin: /admin 문제·회원·이용권 관리
```

## 1차 작업 범위

- 공개 설정 파일 정리
- 보안 점검 문서 추가
- 정적 체험판 유지
- 채점 로직 및 저장 로직 개선 검토

## 2차 작업 범위

- Vite/React 구조 전환
- Supabase 스키마 작성
- 무료/유료 문제 분리
- 로그인 및 premium_until 권한 체크
- 관리자 승인 페이지 제작
