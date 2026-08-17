export default function QuestionField({ question, value, onChange }) {
  if (question.type === "number") {
    return (
      <div className="question-card">
        <label className="question-label" htmlFor={question.key}>
          {question.label}
          {question.unit ? <span className="question-unit"> ({question.unit})</span> : null}
        </label>
        <input
          id={question.key}
          className="text-input"
          type="number"
          min={question.min}
          max={question.max}
          value={value ?? ""}
          placeholder={
            question.min !== undefined && question.max !== undefined
              ? `${question.min} - ${question.max}`
              : "Enter a value"
          }
          onChange={(event) => onChange(question.key, event.target.value === "" ? "" : Number(event.target.value))}
        />
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div className="question-card">
        <p className="question-label">{question.label}</p>
        <div className="select-grid">
          {(question.options || []).map((option) => {
            const checked = value === option.value;
            return (
              <label className={`option-chip ${checked ? "active" : ""}`} key={option.value}>
                <span>{option.label}</span>
                <input
                  type="radio"
                  name={question.key}
                  checked={checked}
                  onChange={() => onChange(question.key, option.value)}
                />
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
