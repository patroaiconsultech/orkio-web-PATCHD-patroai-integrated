// AO-16D-R8 — src/lib/adminEvolutionDryRun.js
// Dry-run governado: usa o mesmo API client do restante do frontend.
// Não habilita execução real, commit, deploy ou migration.

import { apiFetch } from "../ui/api.js";

function normalizeProposalId(proposalId) {
  return String(proposalId || "").trim();
}

function pickPayload(result) {
  if (result && typeof result === "object" && result.data && typeof result.data === "object") {
    return result.data;
  }
  return result;
}

function assertGovernedDryRunResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Dry-run retornou resposta inválida.");
  }

  if (data.execution_enabled !== false) {
    throw new Error("Dry-run retornou execution_enabled diferente de false.");
  }

  if (data.can_execute_real !== false) {
    throw new Error("Dry-run retornou can_execute_real diferente de false.");
  }

  return data;
}

export async function runEvolutionDryRun(proposalId, options = {}) {
  const pid = normalizeProposalId(proposalId);

  if (!pid) {
    throw new Error("proposal_id ausente para dry-run.");
  }

  const path = `/api/admin/evolution/proposals/${encodeURIComponent(pid)}/dry-run`;

  console.log("ADMIN_EVOLUTION_DRY_RUN_CLIENT_REQUEST", {
    proposal_id: pid,
    path,
    org: options.org || options.tenant || null,
  });

  const result = await apiFetch(path, {
    method: "POST",
    token: options.token,
    org: options.org || options.tenant,
    credentials: "omit",
    body: { dry_run: true },
  });

  const data = pickPayload(result);
  return assertGovernedDryRunResponse(data);
}

// Backward-compatible alias for older imports.
export const runDryRun = runEvolutionDryRun;

export default runEvolutionDryRun;
