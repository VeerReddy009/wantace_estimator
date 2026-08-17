import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfigEditor from "../components/owner/ConfigEditor";
import LeadsTable from "../components/owner/LeadsTable";
import { getAdminConfig, getAdminLeads, updateAdminConfig } from "../services/api";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("owner_token");

  const [config, setConfig] = useState(null);
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [adminConfig, leadData] = await Promise.all([getAdminConfig(token), getAdminLeads(token)]);
        setConfig(adminConfig);
        setLeads(leadData);
      } catch (requestError) {
        localStorage.removeItem("owner_token");
        setError(requestError.message);
        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate, token]);

  async function handleSave() {
    if (!config) return;

    setSaving(true);
    setError("");

    try {
      await updateAdminConfig(token, {
        business: config.business,
        modifiers: config.modifiers,
        questions: config.questions,
      });

      const refreshedConfig = await getAdminConfig(token);
      setConfig(refreshedConfig);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("owner_token");
    navigate("/admin/login", { replace: true });
  }

  if (loading) {
    return (
      <main className="page-shell">
        <p className="panel">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="page-shell owner-page-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Northline Roofing & Exteriors</p>
          <h1>Owner Panel</h1>
        </div>
        <button type="button" className="secondary-button" onClick={logout}>
          Logout
        </button>
      </header>

      {error ? <p className="panel error-text">{error}</p> : null}
      {config ? <ConfigEditor config={config} onConfigChange={setConfig} onSave={handleSave} saving={saving} /> : null}
      <LeadsTable leads={leads} />
    </main>
  );
}
