// 공개 정적 배포용 설정입니다.
// 실제 결제 검증, 관리자 코드, API 키는 이 파일에 넣지 않습니다.
// 판매용 전환 시에는 Supabase/Vercel Functions 환경변수와 서버 검증으로 이전합니다.

const CONFIG = {
  // 프리미엄 결제 안내 문구
  bankAccount: "토스뱅크 1000-0000-0000",
  bankHolder: "홍길동",
  price: "월 5,000원",
  contact: "카카오 오픈채팅 \"도시계획기사 독학카페\"",

  // 현재 정적 HTML 버전은 체험판/검증용입니다.
  // 공개 저장소에 관리자용 코드를 두지 않습니다.
  masterHash: "",

  // 무료 연습문제 개수
  freePracticeCount: 30,

  // 무료 기출 연도 범위 (이 연도 이후는 무료)
  freeExamFromYear: 2023,

  // 사이트 정보
  siteName: "도시계획기사 독학카페",
  siteUrl: "cafe.naver.com/solourban",
  footerText: "made by 네이버 도시계획기사 독학카페",
};
