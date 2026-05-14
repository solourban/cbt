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

assert.deepEqual(gradeShortAnswer(shortQuestion, '150').s, 0);
assert.deepEqual(gradeShortAnswer(shortQuestion, '15').s, 4);

const subQuestion = {
  points: 4,
  subs: [{ label: '숫자', keywords: ['15'] }],
};

assert.equal(gradeSubQuestions(subQuestion, ['150']).s, 0);
assert.equal(gradeSubQuestions(subQuestion, ['15']).s, 4);

console.log('scoring tests passed');
