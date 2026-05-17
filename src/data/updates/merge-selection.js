import { QUESTION_UPDATE_CANDIDATES } from './index.js';

// 본 데이터 우선 병합 후보
// 기준: 원문 구조가 비교적 명확하고, CBT 채점 구조에 바로 적용 가능하며, 중복 위험이 낮은 문제
export const PRIORITY_UPDATE_IDS = [
  20200101,
  20200104,
  20200106,
  20200202,
  20200205,
  20200213,
  20200215,
  20200301,
  20200303,
  20200305,
  20200306,
  20200311,
  20200317,
  20200318,
  20200322,
  20200323,
  20190201,
  20190207,
  20180201,
  20180221,
  20180224,
  20170101,
  20170107,
  20160103,
  20160110,
  20110401,
];

// 보류 후보
// 기준: 계산 결과·법령개정·원문 판독·중복 위험 검토가 필요한 문제
export const HOLD_UPDATE_IDS = [
  20190403,
  20180205,
  20170106,
  20110402,
];

export const PRIORITY_QUESTION_UPDATES = QUESTION_UPDATE_CANDIDATES.filter((question) =>
  PRIORITY_UPDATE_IDS.includes(question.id),
);

export const HOLD_QUESTION_UPDATES = QUESTION_UPDATE_CANDIDATES.filter((question) =>
  HOLD_UPDATE_IDS.includes(question.id),
);

export const UNCLASSIFIED_QUESTION_UPDATES = QUESTION_UPDATE_CANDIDATES.filter(
  (question) => !PRIORITY_UPDATE_IDS.includes(question.id) && !HOLD_UPDATE_IDS.includes(question.id),
);

export const MERGE_SELECTION_SUMMARY = {
  totalCandidates: QUESTION_UPDATE_CANDIDATES.length,
  priorityCount: PRIORITY_QUESTION_UPDATES.length,
  holdCount: HOLD_QUESTION_UPDATES.length,
  unclassifiedCount: UNCLASSIFIED_QUESTION_UPDATES.length,
};

export default PRIORITY_QUESTION_UPDATES;
