const API_BASE = "/api";

async function apiRequest(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const token = sessionStorage.getItem("admin_token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "İşlem gerçekleştirilemedi.");
  return data;
}

const TranslationAPI = {
  list: () => apiRequest("/translations"),
  create: payload => apiRequest("/translations", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => apiRequest(`/translations/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: id => apiRequest(`/translations/${id}`, { method: "DELETE" }),
  rate: (id, score) => apiRequest(`/translations/${id}/rate`, { method: "POST", body: JSON.stringify({ score }) }),
  comment: (id, payload) => apiRequest(`/translations/${id}/comments`, { method: "POST", body: JSON.stringify(payload) }),
  download: id => apiRequest(`/translations/${id}/download`, { method: "POST" }),
  login: (username, password) => apiRequest("/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => apiRequest("/admin/logout", { method: "POST" }),
  session: () => apiRequest("/admin/session")
};
