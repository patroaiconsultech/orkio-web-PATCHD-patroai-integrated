// AO-14D — Final Status Action Guard
// Cole estes helpers perto dos helpers do AdminEvolutionCenter.jsx,
// antes do return do componente ou fora dele, conforme o padrão atual do arquivo.

const normalizeProposalStatus = (proposal) => {
  const raw =
    proposal?.proposal_status ||
    proposal?.status ||
    proposal?.state ||
    "";
  return String(raw).trim().toLowerCase();
};

const isProposalPendingApproval = (proposal) =>
  normalizeProposalStatus(proposal) === "pending_approval";

const isProposalApproved = (proposal) =>
  normalizeProposalStatus(proposal) === "approved";

const isProposalRejected = (proposal) =>
  normalizeProposalStatus(proposal) === "rejected";

const getProposalDecisionLabel = (proposal) => {
  if (isProposalApproved(proposal)) {
    return "Aprovada pelo Admin. Nenhuma execução automática foi iniciada.";
  }
  if (isProposalRejected(proposal)) {
    return "Rejeitada pelo Admin. Nenhuma execução automática foi iniciada.";
  }
  if (isProposalPendingApproval(proposal)) {
    return "";
  }
  const status = normalizeProposalStatus(proposal) || "desconhecido";
  return `Status governado: ${status}. Ações bloqueadas até revisão operacional.`;
};

// Substitua o bloco que hoje renderiza sempre Aprovar/Rejeitar por este bloco.
// Ajuste selectedProposal, handleApprove, handleReject e busy se os nomes no arquivo real forem diferentes.

{isProposalPendingApproval(selectedProposal) ? (
  <div className="mt-6 flex flex-wrap gap-3">
    <button
      type="button"
      onClick={handleApprove}
      disabled={busy}
      className="rounded-2xl border border-emerald-300/40 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-50"
    >
      {busy ? "Processando..." : "Aprovar"}
    </button>

    <button
      type="button"
      onClick={handleReject}
      disabled={busy}
      className="rounded-2xl border border-rose-300/40 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50"
    >
      {busy ? "Processando..." : "Rejeitar"}
    </button>
  </div>
) : (
  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
    {getProposalDecisionLabel(selectedProposal)}
  </div>
)}
