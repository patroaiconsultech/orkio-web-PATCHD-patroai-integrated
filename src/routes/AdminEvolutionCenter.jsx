// AO-16D — Admin Dry-Run Action UX
// Apply inside src/routes/AdminEvolutionCenter.jsx.
// Surgical snippet, not a full-file replacement.
//
// Map these names to your real component if they differ:
// selectedProposal, executionPlan, executions,
// loadProposal(id), loadExecutionPlan(id), loadExecutions().

import { runEvolutionDryRun } from "../lib/adminEvolutionDryRun";

// Add near component state:
const [dryRunBusy, setDryRunBusy] = useState(false);
const [dryRunError, setDryRunError] = useState("");
const [dryRunResult, setDryRunResult] = useState(null);

// Add inside the component:
const proposalStatus = selectedProposal?.status || selectedProposal?.proposal_status || "";
const executionStatus =
  executionPlan?.execution_status ||
  selectedProposal?.execution_status ||
  dryRunResult?.execution_status ||
  "not_started";

const canDryRun =
  proposalStatus === "approved" &&
  Boolean(executionPlan?.can_dry_run || selectedProposal?.can_dry_run) &&
  executionStatus !== "dry_run_completed" &&
  executionPlan?.can_execute_real !== true &&
  selectedProposal?.can_execute_real !== true;

async function handleRunDryRun() {
  const proposalId = selectedProposal?.proposal_id || selectedProposal?.id;
  if (!proposalId) return;

  setDryRunBusy(true);
  setDryRunError("");

  try {
    const result = await runEvolutionDryRun(proposalId);
    setDryRunResult(result);

    if (typeof loadProposal === "function") await loadProposal(proposalId);
    if (typeof loadExecutionPlan === "function") await loadExecutionPlan(proposalId);
    if (typeof loadExecutions === "function") await loadExecutions();
  } catch (err) {
    setDryRunError(err?.message || "Não foi possível executar o dry-run governado.");
  } finally {
    setDryRunBusy(false);
  }
}

// Replace old “Dry-run futuro / Execuções read-only” action area with:
<section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
  <div className="text-xs uppercase tracking-[0.35em] text-slate-400">
    Plano de execução
  </div>

  <h3 className="mt-2 text-2xl font-bold text-white">
    {executionStatus === "dry_run_completed"
      ? "Dry-run concluído"
      : canDryRun
        ? "Dry-run governado disponível"
        : "Dry-run futuro, execução desligada"}
  </h3>

  <p className="mt-2 text-sm text-slate-300">
    O dry-run gera execution_id, diff_preview, smoke_plan, smoke_result e rollback_plan.
    A execução real permanece bloqueada.
  </p>

  <div className="mt-4 flex flex-wrap gap-2 text-xs">
    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-200">
      execution_enabled=false
    </span>
    <span className="rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1 text-slate-200">
      can_execute_real=false
    </span>
    <span className="rounded-full border border-slate-500/30 bg-slate-500/10 px-3 py-1 text-slate-200">
      status={executionStatus}
    </span>
  </div>

  {canDryRun && (
    <button
      type="button"
      onClick={handleRunDryRun}
      disabled={dryRunBusy}
      className="mt-5 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
    >
      {dryRunBusy ? "Executando dry-run..." : "Executar dry-run governado"}
    </button>
  )}

  {dryRunError && (
    <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">
      {dryRunError}
    </div>
  )}

  {(dryRunResult || executionPlan) && (
    <pre className="mt-5 max-h-80 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-slate-100">
      {JSON.stringify(dryRunResult || executionPlan, null, 2)}
    </pre>
  )}
</section>

// Replace old executions copy with:
// “Dry-run governado registra execuções simuladas. Nenhuma execução real,
// commit, deploy, migration ou escrita de repositório é permitida nesta etapa.”
