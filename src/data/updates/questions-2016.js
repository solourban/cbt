// 2016년 도시계획기사 실기 기출 복원 업데이트 후보
// 출처: 업로드된 2016년 복원문제 이미지 PDF 기반
// 주의: 기존 questions.js 및 2017~2020 후보와 중복 검토 후 본 데이터에 병합하세요.

export const QUESTIONS_2016_UPDATE = [
  {
    id: 20160103,
    exam: '2016년 기출복원',
    category: '도시개발',
    type: 'short_answer',
    difficulty: 2,
    points: 3,
    question: '도시개발사업의 시행방식 3가지를 쓰시오.',
    acceptedAnswers: [['수용 또는 사용방식', '환지방식', '혼용방식']],
    keywords: {
      required: ['수용', '환지', '혼용'],
      bonus: ['사용방식', '도시개발사업']
    },
    explanation: '도시개발사업의 시행방식은 수용 또는 사용방식, 환지방식, 수용 또는 사용방식과 환지방식을 혼용하는 방식으로 구분한다.',
    tags: ['기출복원', '2016년', '도시개발사업', '수용방식', '환지방식']
  },
  {
    id: 20160110,
    exam: '2016년 기출복원',
    category: '도시계획법규',
    type: 'short_answer',
    difficulty: 2,
    points: 4,
    question: '도시계획 수립 과정에서 주민참여 또는 의견청취와 관련된 절차를 쓰시오.',
    acceptedAnswers: [['공청회', '주민의견청취', '공고', '열람']],
    keywords: {
      required: ['공청회', '주민의견청취', '공고', '열람'],
      bonus: ['주민참여', '도시계획위원회']
    },
    explanation: '도시계획 수립 과정에서는 공청회, 주민의견청취, 공고, 열람 등 주민참여와 의견수렴 절차가 활용된다. 구체적인 적용 절차는 계획 종류와 관련 법령에 따라 달라질 수 있다.',
    tags: ['기출복원', '2016년', '주민참여', '주민의견청취', '법령검토필요']
  }
];

export default QUESTIONS_2016_UPDATE;
