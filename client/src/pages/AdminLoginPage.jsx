import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await loginAdmin(form);
      localStorage.setItem("owner_token", response.token);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell page-shell-narrow">
      <section className="panel stack-lg">
        <div>
          <p className="eyebrow">Owner Panel</p>
          <h1>Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="stack-md">
          <div className="question-card">
            <label className="question-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="text-input"
              value={form.username}
              onChange={(event) => setForm((previous) => ({ ...previous, username: event.target.value }))}
            />
          </div>

          <div className="question-card">
            <label className="question-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="text-input"
              type="password"
              value={form.password}
              onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
            />
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
