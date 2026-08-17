const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.errors?.join(" ") || "Request failed";
    throw new Error(message);
  }

  return data;
}

export function getPublicConfig() {
  return request("/config");
}

export function submitEstimate(payload) {
  return request("/estimate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginAdmin(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAdminConfig(token) {
  return request("/admin/config", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateAdminConfig(token, payload) {
  return request("/admin/config", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function getAdminLeads(token) {
  return request("/admin/leads", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
