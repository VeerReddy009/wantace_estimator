import { useEffect, useMemo, useState } from "react";
import QuestionField from "../dynamic/QuestionField";
import { getPublicConfig, submitEstimate } from "../../services/api";

function formatCurrency(value, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EstimatorWizard() {
  const [config, setConfig] = useState(null);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [stepIndex, setStepIndex] = useState(0);
  const [stepTouched, setStepTouched] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "", submitting: false });

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getPublicConfig();
        setConfig(data);
      } catch (error) {
        setStatus((previous) => ({ ...previous, error: error.message }));
      } finally {
        setStatus((previous) => ({ ...previous, loading: false }));
      }
    }

    loadConfig();
  }, []);

  const questions = useMemo(() => config?.questions || [], [config]);
  const isContactStep = stepIndex === questions.length;

  function updateAnswer(key, value) {
    setStepTouched(false);
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function isCurrentStepValid() {
    if (!isContactStep) {
      const question = questions[stepIndex];
      const value = answers[question.key];
      if (!question.required) return true;
      return value !== undefined && value !== null && value !== "";
    }

    return contact.name.trim() && contact.phone.trim() && contact.email.trim();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isContactStep) {
      if (!isCurrentStepValid()) {
        setStepTouched(true);
        return;
      }
      setStepTouched(false);
      setStepIndex((previous) => previous + 1);
      return;
    }

    if (!isCurrentStepValid()) return;

    setStatus((previous) => ({ ...previous, error: "", submitting: true }));

    try {
      const result = await submitEstimate({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        answers,
      });
      setEstimate(result);
    } catch (error) {
      setStatus((previous) => ({ ...previous, error: error.message, submitting: false }));
      return;
    }

    setStatus((previous) => ({ ...previous, submitting: false }));
  }

  function restart() {
    setStepIndex(0);
    setAnswers({});
    setContact({ name: "", phone: "", email: "" });
    setEstimate(null);
    setStatus((previous) => ({ ...previous, error: "" }));
  }

  if (status.loading) {
    return <p className="panel">Loading estimator configuration...</p>;
  }

  if (status.error && !config) {
    return <p className="panel error-text">{status.error}</p>;
  }

  if (estimate) {
    return (
      <section className="panel">
        <p className="eyebrow">Estimated range</p>
        <h2>
          {formatCurrency(estimate.estimate_low, estimate.currency)} - {formatCurrency(estimate.estimate_high, estimate.currency)}
        </h2>
        <p className="muted">
          Based on your provided details. A Northline team member will contact you to finalize exact scope.
        </p>
        <button className="primary-button" type="button" onClick={restart}>
          Start another estimate
        </button>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <p className="eyebrow">{config.business.name}</p>
        <h1>Roof Replacement Cost Estimator</h1>
        <p className="muted">Answer a few quick questions to receive a realistic budget range.</p>
      </div>

      <form onSubmit={handleSubmit} className="stack-lg">
        {!isContactStep ? (
          <>
            <p className="step-meta">
              Step {stepIndex + 1} of {questions.length + 1}
            </p>
            <QuestionField
              question={questions[stepIndex]}
              value={answers[questions[stepIndex].key]}
              onChange={updateAnswer}
            />
          </>
        ) : (
          <>
            <p className="step-meta">Final step: where should we send the estimate?</p>
            <div className="question-card">
              <label className="question-label" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                className="text-input"
                value={contact.name}
                onChange={(event) => setContact((previous) => ({ ...previous, name: event.target.value }))}
              />
            </div>

            <div className="question-card">
              <label className="question-label" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                className="text-input"
                value={contact.phone}
                onChange={(event) => setContact((previous) => ({ ...previous, phone: event.target.value }))}
              />
            </div>

            <div className="question-card">
              <label className="question-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="text-input"
                value={contact.email}
                onChange={(event) => setContact((previous) => ({ ...previous, email: event.target.value }))}
              />
            </div>
          </>
        )}

        {status.error ? <p className="error-text">{status.error}</p> : null}
        {stepTouched && !isContactStep && !isCurrentStepValid() ? (
          <p className="error-text">Please answer this step to continue.</p>
        ) : null}

        <div className="button-row">
          <button
            className="secondary-button"
            type="button"
            disabled={stepIndex === 0 || status.submitting}
            onClick={() => setStepIndex((previous) => previous - 1)}
          >
            Back
          </button>

          <button className="primary-button" type="submit" disabled={!isCurrentStepValid() || status.submitting}>
            {isContactStep ? (status.submitting ? "Submitting..." : "Get estimate") : "Next"}
          </button>
        </div>
      </form>
    </section>
  );
}
