import { Config } from "../models/Config.js";
import { Lead } from "../models/Lead.js";
import { normalizeConfigPayload } from "../services/normalizeConfig.js";

async function findActiveConfig() {
  return Config.findOne({ is_active: true }).sort({ config_version: -1 });
}

export async function getAdminConfig(_req, res) {
  const config = await findActiveConfig();

  if (!config) {
    return res.status(404).json({ error: "No active configuration found." });
  }

  return res.json(config);
}

export async function updateAdminConfig(req, res) {
  const config = await findActiveConfig();

  if (!config) {
    return res.status(404).json({ error: "No active configuration found." });
  }

  const normalized = normalizeConfigPayload(req.body || {});

  if (normalized.questions.length === 0) {
    return res.status(400).json({ error: "At least one question is required." });
  }

  config.business = normalized.business;
  config.questions = normalized.questions;
  config.modifiers = normalized.modifiers;
  config.config_version = Number(config.config_version || 0) + 1;

  await config.save();

  return res.json({
    message: "Configuration updated successfully.",
    config_version: config.config_version,
  });
}

export async function getAdminLeads(_req, res) {
  const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
  return res.json(leads);
}
