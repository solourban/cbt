import assert from 'node:assert/strict';
import {
  gradeShortAnswer,
  gradeSubQuestions,
  hasKeyword,
} from './scoring.js';

assert.equal(hasKeyword('15', '15'), true);
assert.equal(hasKeyword('15m', '15'), true);
assert.equal(hasKeyword('150', '15'), false);
assert.equal(hasKeyword('제1종일반주거지역', '제1종일반주거지역'), true);

const shortQuestion = {
  points: 4,
  keywords: { required: ['15'], bonus: [] },
  acceptedAnswers: [],
};

assert.equal(gradeShortAnswer(shortQuestion, '150').s, 0);
assert.equal(gradeShortAnswer(shortQuestion, '15').s, 4);

const subQuestion = {
  points: 4,
  subs: [{ label: '숫자', keywords: ['15'] }],
};

assert.equal(gradeSubQuestions(subQuestion, ['150']).s, 0);
assert.equal(gradeSubQuestions(subQuestion, ['15']).s, 4);

const bug001Question = {
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
    bonus: ['사용방식', '도시개발사업'],
  },
};

const bug001Partial = gradeShortAnswer(bug001Question, '수용, 사용방식, 환지방식');
assert.equal(bug001Partial.s, 2);
assert.deepEqual(bug001Partial.fb, ['✓ 수용, 환지', '✗ 혼용', '+ 사용방식']);

const bug001Full = gradeShortAnswer(bug001Question, '수용 또는 사용방식, 환지방식, 혼용방식');
assert.equal(bug001Full.s, 3);

console.log('scoring tests passed');
