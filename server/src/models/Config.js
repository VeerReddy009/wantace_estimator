import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    rate_per_sqft: { type: Number },
    multiplier: { type: Number },
    tear_off_per_sqft: { type: Number },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, enum: ["number", "select"], required: true },
    unit: { type: String, trim: true },
    required: { type: Boolean, default: true },
    min: { type: Number },
    max: { type: Number },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    options: { type: [OptionSchema], default: [] },
  },
  { _id: false }
);

const ConfigSchema = new mongoose.Schema(
  {
    config_version: { type: Number, required: true, default: 1 },
    is_active: { type: Boolean, default: true },
    business: {
      name: { type: String, required: true },
      region: { type: String, required: true },
      currency: { type: String, default: "USD" },
    },
    questions: { type: [QuestionSchema], default: [] },
    modifiers: {
      waste_factor: { type: Number, default: 0.1 },
      permit_flat_fee: { type: Number, default: 350 },
      range_spread_pct: { type: Number, default: 12 },
    },
  },
  { timestamps: true }
);

ConfigSchema.index({ is_active: 1 });
ConfigSchema.index({ config_version: -1 });

export const Config = mongoose.model("Config", ConfigSchema);
