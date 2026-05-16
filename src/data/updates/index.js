import { QUESTIONS_2020_UPDATE } from './questions-2020.js';
import { QUESTIONS_2019_UPDATE } from './questions-2019.js';
import { QUESTIONS_2018_UPDATE } from './questions-2018.js';
import { QUESTIONS_2017_UPDATE } from './questions-2017.js';
import { QUESTIONS_2016_UPDATE } from './questions-2016.js';
import { QUESTIONS_2011_UPDATE } from './questions-2011.js';

export const QUESTION_UPDATES_BY_YEAR = {
  2020: QUESTIONS_2020_UPDATE,
  2019: QUESTIONS_2019_UPDATE,
  2018: QUESTIONS_2018_UPDATE,
  2017: QUESTIONS_2017_UPDATE,
  2016: QUESTIONS_2016_UPDATE,
  2011: QUESTIONS_2011_UPDATE,
};

export const QUESTION_UPDATE_CANDIDATES = Object.values(QUESTION_UPDATES_BY_YEAR).flat();

export const QUESTION_UPDATE_SUMMARY = Object.fromEntries(
  Object.entries(QUESTION_UPDATES_BY_YEAR).map(([year, questions]) => [
    year,
    {
      count: questions.length,
      ids: questions.map((question) => question.id),
    },
  ]),
);

export default QUESTION_UPDATE_CANDIDATES;
