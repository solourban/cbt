# CBT 운영 전환 로드맵

## 목표

현재 정적 HTML CBT를 실제 운영·관리·판매 가능한 CBT 서비스로 전환합니다.

## 원칙

1. 정적 배포 체험판은 유지한다.
2. 유료 문제 데이터는 프론트엔드에 포함하지 않는다.
3. 인증·결제·권한 검증은 서버 또는 Supabase RLS에서 처리한다.
4. 코드 변경은 작은 단위로 브랜치/PR 기반으로 진행한다.

## 단계별 진행

### Phase 1. 정적 앱 안정화

- Vercel 정적 배포 유지
- 공개 설정 파일 정리
- 채점 함수 버그 수정
- 숫자형 정답 오판 방지
- 제출 저장 로직 개선
- 광고 고지 문구 정리

### Phase 2. React/Vite 전환

- `index.html` 내부 React 코드를 `src/App.jsx`로 이동
- `questions.js`를 임시 데이터 모듈로 분리
- `package.json`, `vite.config.js` 추가
- Vercel Build Command: `npm run build`
- Output Directory: `dist`

### Phase 3. Supabase 도입

- Supabase Auth 추가
- 문제 DB 설계
- 오답노트/북마크/풀이기록 DB 저장
- `profiles.premium_until` 기준 권한 체크
- RLS 적용

### Phase 4. 유료화 MVP

- 수동 입금 확인
- 관리자 페이지에서 프리미엄 기간 부여
- 이용권 코드 발급/사용 기능
- 무료/유료 문제 분리

### Phase 5. 앱/결제 확장

- PWA 설정
- Android TWA 또는 React Native 검토
- Google Play Billing 또는 토스페이먼츠 연동
- 약관, 개인정보처리방침, 환불정책 정리

## 우선순위

### 먼저 할 것

- 보안 취약점 문서화
- 공개 설정 파일 정리
- 정적 앱 채점 로직 보정
- 운영용 DB 스키마 설계

### 나중에 할 것

- 자동결제
- 앱스토어 출시
- AI 서술형 채점
- PDF/엑셀 문제 업로드 자동 변환
