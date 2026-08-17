function NumericInput({ value, onChange, step = "0.01" }) {
  return (
    <input
      type="number"
      className="text-input"
      value={value ?? ""}
      step={step}
      onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
    />
  );
}

export default function ConfigEditor({ config, onConfigChange, onSave, saving }) {
  function updateBusiness(field, value) {
    onConfigChange({
      ...config,
      business: {
        ...config.business,
        [field]: value,
      },
    });
  }

  function updateModifier(field, value) {
    onConfigChange({
      ...config,
      modifiers: {
        ...config.modifiers,
        [field]: value,
      },
    });
  }

  function updateQuestion(index, patch) {
    const questions = [...config.questions];
    questions[index] = { ...questions[index], ...patch };
    onConfigChange({ ...config, questions });
  }

  function updateOption(questionIndex, optionIndex, patch) {
    const questions = [...config.questions];
    const question = questions[questionIndex];
    const options = [...(question.options || [])];
    options[optionIndex] = { ...options[optionIndex], ...patch };
    questions[questionIndex] = { ...question, options };
    onConfigChange({ ...config, questions });
  }

  return (
    <section className="panel stack-lg">
      <div className="owner-header-row">
        <div>
          <p className="eyebrow">Owner Configuration</p>
          <h2>Pricing and questions</h2>
        </div>
        <button className="primary-button" type="button" onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="owner-grid-2">
        <div className="question-card">
          <label className="question-label">Business name</label>
          <input
            className="text-input"
            value={config.business.name || ""}
            onChange={(event) => updateBusiness("name", event.target.value)}
          />
        </div>
        <div className="question-card">
          <label className="question-label">Region</label>
          <input
            className="text-input"
            value={config.business.region || ""}
            onChange={(event) => updateBusiness("region", event.target.value)}
          />
        </div>
      </div>

      <div className="owner-grid-3">
        <div className="question-card">
          <label className="question-label">Waste factor (decimal)</label>
          <NumericInput value={config.modifiers.waste_factor} onChange={(value) => updateModifier("waste_factor", value)} />
        </div>
        <div className="question-card">
          <label className="question-label">Permit flat fee</label>
          <NumericInput value={config.modifiers.permit_flat_fee} onChange={(value) => updateModifier("permit_flat_fee", value)} />
        </div>
        <div className="question-card">
          <label className="question-label">Estimate spread %</label>
          <NumericInput value={config.modifiers.range_spread_pct} onChange={(value) => updateModifier("range_spread_pct", value)} />
        </div>
      </div>

      <div className="stack-lg">
        {config.questions.map((question, questionIndex) => (
          <article className="question-card" key={question.key}>
            <div className="owner-header-row">
              <h3>{question.key}</h3>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={question.active !== false}
                  onChange={(event) => updateQuestion(questionIndex, { active: event.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="owner-grid-3">
              <div>
                <label className="question-label">Label</label>
                <input
                  className="text-input"
                  value={question.label || ""}
                  onChange={(event) => updateQuestion(questionIndex, { label: event.target.value })}
                />
              </div>
              <div>
                <label className="question-label">Min</label>
                <NumericInput value={question.min} onChange={(value) => updateQuestion(questionIndex, { min: value })} />
              </div>
              <div>
                <label className="question-label">Max</label>
                <NumericInput value={question.max} onChange={(value) => updateQuestion(questionIndex, { max: value })} />
              </div>
            </div>

            {question.type === "select" ? (
              <div className="stack-sm">
                {(question.options || []).map((option, optionIndex) => (
                  <div className="owner-option-grid" key={`${question.key}-${option.value}`}>
                    <input
                      className="text-input"
                      value={option.label}
                      onChange={(event) => updateOption(questionIndex, optionIndex, { label: event.target.value })}
                    />
                    <NumericInput
                      value={option.rate_per_sqft}
                      onChange={(value) => updateOption(questionIndex, optionIndex, { rate_per_sqft: value })}
                    />
                    <NumericInput
                      value={option.multiplier}
                      onChange={(value) => updateOption(questionIndex, optionIndex, { multiplier: value })}
                    />
                    <NumericInput
                      value={option.tear_off_per_sqft}
                      onChange={(value) => updateOption(questionIndex, optionIndex, { tear_off_per_sqft: value })}
                    />
                  </div>
                ))}
                <p className="hint">Columns: Label, Rate/SqFt, Multiplier, Tear-Off/SqFt.</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
