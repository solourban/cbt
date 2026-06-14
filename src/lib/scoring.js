// CBT 채점 로직
// 정적 HTML에서 분리한 순수 함수 모듈입니다.
// 브라우저 상태와 분리해 테스트 가능하도록 작성합니다.

export function normalizeAnswer(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, "")
    .replace(/[()（）]/g, "")
    .toLowerCase();
}

export function normalizeText(value = "") {
  return String(value).trim().replace(/\s+/g, " ").toLowerCase();
}

export function normalizeKeyword(value = "") {
  return String(value).replace(/\s+/g, "").toLowerCase();
}

export function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function hasKeyword(answer, keyword) {
  const target = normalizeKeyword(keyword);
  if (!target) return false;

  // 숫자 키워드는 부분 포함으로 판정하면 오답이 정답 처리될 수 있음.
  // 예: 정답 15인데 150을 정답 처리하는 문제 방지.
  if (/^\d+$/.test(target)) {
    const re = new RegExp(`(?:^|[^0-9a-zA-Z가-힣])${escapeRegExp(target)}(?:$|[^0-9a-zA-Z가-힣])`);
    return answer === target || re.test(answer);
  }

  return answer.includes(target);
}

export function gradeShortAnswer(question, rawAnswer = "") {
  const answer = normalizeAnswer(rawAnswer);
  const max = question.points || 0;
  if (!answer) return { s: 0, m: max, fb: [] };

  const required = question.keywords?.required || [];
  const bonus = question.keywords?.bonus || [];

  if (question.acceptedAnswers?.length) {
    for (const accepted of question.acceptedAnswers) {
      if (accepted.every((item) => hasKeyword(answer, item))) {
        return { s: max, m: max, fb: ["정답입니다!"] };
      }
    }
  }

  const matched = required.filter((item) => hasKeyword(answer, item));
  const missed = required.filter((item) => !hasKeyword(answer, item));
  const bonusMatched = bonus.filter((item) => hasKeyword(answer, item));
  const rate = required.length > 0 ? matched.length / required.length : 0;
  const score = Math.round(max * rate);
  const fb = [];

  if (matched.length) fb.push(`✓ ${matched.join(", ")}`);
  if (missed.length) fb.push(`✗ ${missed.join(", ")}`);
  if (bonusMatched.length) fb.push(`+ ${bonusMatched.join(", ")}`);

  return { s: score, m: max, fb };
}

export function gradeEssay(question, rawAnswer = "") {
  const answer = normalizeText(rawAnswer);
  const max = question.points || 0;
  if (!answer) return { s: 0, m: max, fb: [] };

  const required = question.keywords?.required || [];
  const bonus = question.keywords?.bonus || [];
  const matched = required.filter((item) => answer.includes(String(item).toLowerCase()));
  const missed = required.filter((item) => !answer.includes(String(item).toLowerCase()));
  const bonusMatched = bonus.filter((item) => answer.includes(String(item).toLowerCase()));

  let raw = max * (required.length > 0 ? matched.length / required.length : 0) * 0.7 + bonusMatched.length * 0.5;
  raw = Math.max(0, Math.min(max, Math.round(raw)));

  const fb = [`${matched.length}/${required.length} 키워드`];
  if (missed.length) fb.push(`누락: ${missed.join(", ")}`);

  return { s: raw, m: max, fb };
}

export function gradeCalculation(question, stepAnswers = []) {
  const steps = question.steps || [];
  const max = question.points || 0;
  if (!steps.length) return { s: 0, m: max, rs: [] };

  const rs = steps.map((step, index) => {
    const userAnswer = normalizeAnswer(stepAnswers[index] || "");
    const correct = normalizeAnswer(step.answer || "");
    const alternates = (step.alternates || []).map((item) => normalizeAnswer(item));

    if (!userAnswer) return { ok: false, lb: step.label, ans: step.answer };

    return {
      ok: userAnswer === correct || alternates.includes(userAnswer),
      lb: step.label,
      ua: stepAnswers[index],
      ans: step.answer,
    };
  });

  return {
    s: Math.round((rs.filter((item) => item.ok).length / steps.length) * max),
    m: max,
    rs,
  };
}

export function gradeSubQuestions(question, answers = []) {
  const subs = question.subs || [];
  const max = question.points || 0;
  if (!subs.length) return { s: 0, m: max, rs: [], fb: [] };

  const pointPerSub = max / subs.length;
  let total = 0;

  const rs = subs.map((sub, index) => {
    const answer = normalizeAnswer(answers[index] || "");
    const keywords = sub.keywords || [];

    if (!answer) {
      return {
        lb: sub.label,
        ok: false,
        score: 0,
        max: Math.round(pointPerSub),
        ans: keywords.join(", "),
      };
    }

    const matched = keywords.filter((item) => hasKeyword(answer, item));
    const rate = keywords.length > 0 ? matched.length / keywords.length : 0;
    const score = Math.round(pointPerSub * rate);
    total += score;

    return {
      lb: sub.label,
      ok: rate >= 0.8,
      score,
      max: Math.round(pointPerSub),
      ans: keywords.join(", "),
    };
  });

  return {
    s: Math.min(total, max),
    m: max,
    rs,
    fb: rs.map((item) => `${item.ok ? "✓" : "✗"} ${item.lb}`),
  };
}

export function gradeQuestion(question, textAnswers = {}, calcAnswers = {}) {
  if (question.subs) return gradeSubQuestions(question, calcAnswers[question.id] || []);
  if (question.type === "calculation") return gradeCalculation(question, calcAnswers[question.id] || []);
  if (question.type === "keyword_essay") return gradeEssay(question, textAnswers[question.id] || "");
  return gradeShortAnswer(question, textAnswers[question.id] || "");
}
