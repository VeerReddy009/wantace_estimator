function pickOption(questions, answers, key) {
  const question = questions.find((item) => item.key === key);
  if (!question || question.type !== "select") {
    return null;
  }

  const selected = answers[key];
  return question.options.find((opt) => opt.value === selected) || null;
}

export function calculateEstimate(config, answers) {
  const roofArea = Number(answers.roof_area || 0);

  const material = pickOption(config.questions, answers, "material");
  const pitch = pickOption(config.questions, answers, "pitch");
  const layers = pickOption(config.questions, answers, "layers");
  const stories = pickOption(config.questions, answers, "stories");

  const ratePerSqft = Number(material?.rate_per_sqft || 0);
  const pitchMultiplier = Number(pitch?.multiplier || 1);
  const tearOffPerSqft = Number(layers?.tear_off_per_sqft || 0);
  const storiesMultiplier = Number(stories?.multiplier || 1);

  const wasteFactor = Number(config.modifiers.waste_factor || 0.1);
  const permitFee = Number(config.modifiers.permit_flat_fee || 350);
  const spreadRaw = Number(config.modifiers.range_spread_pct || 12);
  const spread = spreadRaw > 1 ? spreadRaw / 100 : spreadRaw;

  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const adjustedSubtotal = (baseMaterialCost + tearOffCost) * pitchMultiplier * storiesMultiplier;
  const midpoint = adjustedSubtotal + permitFee;

  return {
    estimate_mid: Math.round(midpoint),
    estimate_low: Math.round(midpoint * (1 - spread)),
    estimate_high: Math.round(midpoint * (1 + spread)),
  };
}
