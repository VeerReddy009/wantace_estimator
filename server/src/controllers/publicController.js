import { Config } from "../models/Config.js";
import { Lead } from "../models/Lead.js";
import { calculateEstimate } from "../services/calculator.js";
import { validateEstimatePayload } from "../services/validateEstimate.js";

async function getActiveConfigDocument() {
  return Config.findOne({ is_active: true }).sort({ config_version: -1 }).lean();
}

export async function getPublicConfig(_req, res) {
  const config = await getActiveConfigDocument();

  if (!config) {
    return res.status(404).json({ error: "No active configuration found." });
  }

  const publicQuestions = (config.questions || [])
    .filter((question) => question.active)
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      key: question.key,
      label: question.label,
      type: question.type,
      unit: question.unit,
      required: question.required,
      min: question.min,
      max: question.max,
      order: question.order,
      options: (question.options || []).map((option) => ({
        value: option.value,
        label: option.label,
      })),
    }));

  return res.json({
    business: config.business,
    config_version: config.config_version,
    questions: publicQuestions,
  });
}

export async function createEstimate(req, res) {
  const config = await getActiveConfigDocument();

  if (!config) {
    return res.status(404).json({ error: "No active configuration found." });
  }

  const validated = validateEstimatePayload(config, req.body || {});
  if (validated.errors.length > 0) {
    return res.status(400).json({ errors: validated.errors });
  }

  const estimate = calculateEstimate(config, validated.answers);

  await Lead.create({
    ...validated.contact,
    answers: validated.answers,
    ...estimate,
    config_version: config.config_version,
  });

  return res.status(201).json({
    currency: config.business.currency,
    config_version: config.config_version,
    ...estimate,
  });
}
