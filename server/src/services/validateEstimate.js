const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEstimatePayload(config, payload) {
  const errors = [];
  const answers = payload.answers || {};

  const name = String(payload.name || "").trim();
  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();

  if (!name) errors.push("Name is required.");
  if (!phone) errors.push("Phone is required.");
  if (!email || !EMAIL_REGEX.test(email)) errors.push("A valid email is required.");

  const normalizedAnswers = {};

  const activeQuestions = (config.questions || [])
    .filter((question) => question.active)
    .sort((a, b) => a.order - b.order);

  for (const question of activeQuestions) {
    const value = answers[question.key];

    if (question.required && (value === undefined || value === null || value === "")) {
      errors.push(`${question.label} is required.`);
      continue;
    }

    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (question.type === "number") {
      const numericValue = Number(value);
      if (!Number.isFinite(numericValue)) {
        errors.push(`${question.label} must be a number.`);
        continue;
      }

      if (question.min !== undefined && numericValue < question.min) {
        errors.push(`${question.label} must be at least ${question.min}.`);
      }

      if (question.max !== undefined && numericValue > question.max) {
        errors.push(`${question.label} must be at most ${question.max}.`);
      }

      normalizedAnswers[question.key] = numericValue;
      continue;
    }

    if (question.type === "select") {
      const selectedValue = String(value);
      const optionExists = (question.options || []).some((option) => option.value === selectedValue);

      if (!optionExists) {
        errors.push(`${question.label} has an invalid option selected.`);
        continue;
      }

      normalizedAnswers[question.key] = selectedValue;
    }
  }

  return {
    errors,
    contact: {
      name,
      phone,
      email,
    },
    answers: normalizedAnswers,
  };
}
