# 핫픽스: 정적 빌드 복구

## 배경

PR #38 머지 후 모바일에서 배포 사이트가 흰 화면으로 표시되는 문제가 보고되었다.

PR #38은 `scripts/build-static.mjs`에서 배포용 `dist/index.html` 내부의 레거시 단답형 채점 함수 `grS`를 정규식으로 치환했다.

이 방식은 기존 정적 앱의 HTML/JS 구조에 직접 개입하므로, 브라우저 런타임에서 예기치 않은 파싱 오류를 만들 수 있다.

## 판단

현재 우선순위는 BUG-001 채점 개선이 아니라 사이트 복구다.

따라서 `build-static.mjs`의 HTML 함수 치환 로직을 제거하고, 기존 정적 빌드 방식으로 복구한다.

## 처리 내용

- `legacyShortAnswerScoringPatch` 제거
- `patchLegacyIndexHtml()` 제거
- `dist/index.html`을 빌드 중 수정하지 않도록 변경
- 기존처럼 `index.html`, `config.js` 복사 후 `questions.js`에 우선 병합 후보만 추가

## 후속 작업

- 사이트 정상 로딩 확인
- BUG-001은 별도 브랜치에서 안전한 방식으로 재수정
- 정규식 기반 HTML 함수 치환 방식은 사용하지 않음
