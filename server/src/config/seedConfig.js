import { Config } from "../models/Config.js";
import { normalizeConfigPayload } from "../services/normalizeConfig.js";

const seedConfigV3Raw = {
  config_version: 3,
  business: {
    name: "Northline Roofing & Exteriors",
    region: "Chicagoland",
    currency: "USD",
  },
  questions: [
    {
      key: "roof_area",
      label: "Approximate roof area",
      type: "number",
      unit: "sq ft",
      required: true,
      min: 500,
      max: 12000,
      order: 1,
      active: true,
    },
    {
      key: "material",
      label: "Preferred material",
      type: "select",
      required: true,
      order: 2,
      active: true,
      options: [
        { value: "asphalt_3tab", label: "Asphalt 3-Tab", rate_per_sqft: "4.25" },
        { value: "architectural", label: "Architectural Shingle", rate_per_sqft: "5.75" },
        { value: "standing_seam", label: "Standing Seam Metal", rate_per_sqft: "9.2" },
      ],
    },
    {
      key: "pitch",
      label: "Roof pitch",
      type: "select",
      required: true,
      order: 3,
      active: true,
      options: [
        { value: "low", label: "Low (4/12 or less)", multiplier: "1.00" },
        { value: "moderate", label: "Moderate (5/12 - 8/12)", multiplier: "1.12" },
        { value: "steep", label: "Steep (9/12+)", multiplier: "1.27" },
      ],
    },
    {
      key: "stories",
      label: "Number of stories",
      type: "select",
      required: true,
      order: 4,
      active: true,
      options: [
        { value: "one", label: "1 Story", multiplier: "1.00" },
        { value: "two", label: "2 Stories", multiplier: "1.08" },
        { value: "three_plus", label: "3+ Stories", multiplier: "1.16" },
      ],
    },
    {
      key: "layers",
      label: "Existing roof layers to tear off",
      type: "select",
      required: true,
      order: 5,
      active: true,
      options: [
        { value: "one", label: "1 Layer", tear_off_per_sqft: "1.10" },
        { value: "two", label: "2 Layers", tear_off_per_sqft: "1.85" },
        { value: "three", label: "3 Layers", tear_off_per_sqft: "2.55" },
      ],
    },
  ],
  modifiers: {
    waste_factor: "0.10",
    permit_flat_fee: "350",
    range_spread_pct: "12",
  },
};

export async function ensureSeedConfig() {
  const activeCount = await Config.countDocuments({ is_active: true });
  if (activeCount > 0) {
    return;
  }

  const normalized = normalizeConfigPayload(seedConfigV3Raw);

  await Config.create({
    ...normalized,
    config_version: seedConfigV3Raw.config_version,
    is_active: true,
  });
}
