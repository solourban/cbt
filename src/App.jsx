import React from 'react';
import { gradeShortAnswer, gradeSubQuestions } from './lib/scoring.js';

const sampleQuestion = {
  points: 4,
  keywords: { required: ['15'], bonus: [] },
  acceptedAnswers: [],
};

const sampleSubQuestion = {
  points: 4,
  subs: [{ label: '숫자형 정답 테스트', keywords: ['15'] }],
};

export default function App() {
  const shortWrong = gradeShortAnswer(sampleQuestion, '150');
  const shortCorrect = gradeShortAnswer(sampleQuestion, '15');
  const subWrong = gradeSubQuestions(sampleSubQuestion, ['150']);
  const subCorrect = gradeSubQuestions(sampleSubQuestion, ['15']);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, lineHeight: 1.7 }}>
      <h1>도시계획기사 CBT</h1>
      <p>Vite/React 전환 준비 화면입니다. 기존 정적 HTML 앱은 루트 index.html에서 계속 유지됩니다.</p>

      <section style={{ marginTop: 24 }}>
        <h2>채점 엔진 분리 확인</h2>
        <ul>
          <li>단답형: 정답 15 / 입력 150 → {shortWrong.s}점</li>
          <li>단답형: 정답 15 / 입력 15 → {shortCorrect.s}점</li>
          <li>소문항: 정답 15 / 입력 150 → {subWrong.s}점</li>
          <li>소문항: 정답 15 / 입력 15 → {subCorrect.s}점</li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>다음 이전 작업</h2>
        <ol>
          <li>기존 index.html의 App 컴포넌트를 src/App.jsx로 이전</li>
          <li>questions.js를 src/data/questions.js로 이전</li>
          <li>config.js를 src/config.js로 이전</li>
          <li>Vercel 빌드 설정을 Vite 기준으로 변경</li>
        </ol>
      </section>
    </main>
  );
}
