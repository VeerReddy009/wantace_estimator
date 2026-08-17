function toNumberOrUndefined(value) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function normalizeConfigPayload(payload) {
  const questions = (payload.questions || []).map((question, index) => {
    const q = {
      key: String(question.key || "").trim(),
      label: String(question.label || "").trim(),
      type: question.type === "number" ? "number" : "select",
      required: question.required !== false,
      active: question.active !== false,
      order: toNumberOrUndefined(question.order) ?? index,
    };

    if (question.unit) {
      q.unit = String(question.unit).trim();
    }

    const min = toNumberOrUndefined(question.min);
    const max = toNumberOrUndefined(question.max);

    if (min !== undefined) q.min = min;
    if (max !== undefined) q.max = max;

    if (q.type === "select") {
      q.options = (question.options || []).map((option) => ({
        value: String(option.value || "").trim(),
        label: String(option.label || "").trim(),
        rate_per_sqft: toNumberOrUndefined(option.rate_per_sqft),
        multiplier: toNumberOrUndefined(option.multiplier),
        tear_off_per_sqft: toNumberOrUndefined(option.tear_off_per_sqft),
      }));
    } else {
      q.options = [];
    }

    return q;
  });

  questions.sort((a, b) => a.order - b.order);

  return {
    business: {
      name: String(payload.business?.name || "Northline Roofing & Exteriors").trim(),
      region: String(payload.business?.region || "Chicago Metro").trim(),
      currency: String(payload.business?.currency || "USD").trim(),
    },
    questions,
    modifiers: {
      waste_factor: toNumberOrUndefined(payload.modifiers?.waste_factor) ?? 0.1,
      permit_flat_fee: toNumberOrUndefined(payload.modifiers?.permit_flat_fee) ?? 350,
      range_spread_pct: toNumberOrUndefined(payload.modifiers?.range_spread_pct) ?? 12,
    },
  };
}
