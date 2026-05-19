// AO-16D — src/lib/adminEvolutionDryRun.js

function getApiBase() {
  return (
    import.meta?.env?.VITE_API_BASE_URL ||
    import.meta?.env?.VITE_API_URL ||
    ""
  ).replace(/\/$/, "");
}

function getStoredToken() {
  return (
    localStorage.getItem("orkio_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("orkio_token") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("token") ||
    ""
  );
}

async function parseResponse(response) {
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || data?.error || `Falha HTTP ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.payload = data;
    throw err;
  }

  return data;
}

export async function runEvolutionDryRun(proposalId) {
  if (!proposalId) throw new Error("proposal_id ausente para dry-run.");

  const token = getStoredToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${getApiBase()}/api/admin/evolution/proposals/${encodeURIComponent(proposalId)}/dry-run`;

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ dry_run: true }),
  });

  const data = await parseResponse(response);

  if (data?.execution_enabled !== false) {
    throw new Error("Dry-run retornou execution_enabled diferente de false.");
  }
  if (data?.can_execute_real !== false) {
    throw new Error("Dry-run retornou can_execute_real diferente de false.");
  }

  return data;
}
