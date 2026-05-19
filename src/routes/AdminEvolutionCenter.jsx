import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../ui/api.js";
import {
  getTenant,
  getToken,
  getUser,
  hasAdminConsoleAccess,
  isAdmin,
  isMasterAdmin,
} from "../lib/auth.js";

const CARD = "rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur";
const BTN = "rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
const INPUT = "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35";
const TEXTAREA = "w-full min-h-[92px] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35";

function nowLabel() {
  try {
    return new Date().toLocaleString("pt-BR");
  } catch {
    return "-";
  }
}

function ts(v) {
  if (!v) return "-";
  try {
    if (typeof v === "string" && v.includes("T")) return new Date(v).toLocaleString("pt-BR");
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    return new Date((n > 10_000_000_000 ? n : n * 1000)).toLocaleString("pt-BR");
  } catch {
    return "-";
  }
}

function pretty(v) {
  if (v === null || v === undefined || v === "") return "-";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
}

function extractError(err) {
  const detail = err?.data?.detail || err?.data?.message;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object") {
    return detail.reason || detail.message || JSON.stringify(detail);
  }
  return err?.message || "Falha na operação.";
}

function unwrapPayload(data) {
  if (!data) return null;
  if (data.data && data.data !== data) return data.data;
  return data;
}

function normalizeList(raw) {
  const d = unwrapPayload(raw);
  const source =
    Array.isArray(d) ? d :
    Array.isArray(d?.items) ? d.items :
    Array.isArray(d?.proposals) ? d.proposals :
    Array.isArray(d?.data?.items) ? d.data.items :
    [];
  return source.map(normalizeProposal).filter(Boolean);
}

function normalizeProposal(raw) {
  const p = raw?.item || raw?.proposal || raw;
  if (!p || typeof p !== "object") return null;
  const id = p.proposal_id || p.id || p.uuid || p.key;
  if (!id) return null;

  return {
    ...p,
    proposal_id: id,
    title: p.title || p.titulo || p.name || "Proposta de evolução controlada",
    status: p.status || "pending_approval",
    risk: p.risk || p.risk_band || p.risco || "baixo_medio",
    summary: p.summary || p.resumo || p.description || p.objective || "",
    rollback_plan: p.rollback_plan || p.rollback || p.rollbackPlan || "",
    validation_checklist: p.validation_checklist || p.checklist || p.validation || [],
    created_at: p.created_at || p.createdAt || p.created_ts || p.created,
    updated_at: p.updated_at || p.updatedAt || p.updated_ts || p.updated,
    execution_enabled: p.execution_enabled === true ? true : false,
  };
}

function statusTone(status) {
  const s = String(status || "").toLowerCase();
  if (["approved", "completed"].includes(s)) return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
  if (["rejected", "failed", "rolled_back"].includes(s)) return "border-rose-400/25 bg-rose-400/10 text-rose-100";
  if (["running"].includes(s)) return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  return "border-sky-400/25 bg-sky-400/10 text-sky-100";
}

function riskTone(risk) {
  const r = String(risk || "").toLowerCase();
  if (r.includes("alto") || r.includes("high") || r.includes("critical")) return "border-rose-400/25 bg-rose-400/10 text-rose-100";
  if (r.includes("medio") || r.includes("médio") || r.includes("medium")) return "border-amber-400/25 bg-amber-400/10 text-amber-100";
  return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
}

function Pill({ children, className = "" }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-4">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200/70">{eyebrow}</p> : null}
      <h2 className="mt-1 text-2xl font-black text-white">{title}</h2>
      {children ? <p className="mt-2 text-sm leading-relaxed text-white/62">{children}</p> : null}
    </div>
  );
}

function KeyValue({ label, value, mono = false }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">{label}</div>
      <div className={`mt-1 text-sm text-white/85 ${mono ? "font-mono" : ""}`}>{pretty(value)}</div>
    </div>
  );
}

export default function AdminEvolutionCenter() {
  const nav = useNavigate();
  const token = getToken();
  const tenant = getTenant() || "public";
  const user = getUser();
  const allowed = Boolean(token && (isAdmin(user) || isMasterAdmin(user) || hasAdminConsoleAccess(user)));

  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [detail, setDetail] = useState(null);
  const [plan, setPlan] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [actionBusy, setActionBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rejectReason, setRejectReason] = useState("Rejeitado pelo Admin após revisão.");
  const [lastRefresh, setLastRefresh] = useState("");

  const selected = useMemo(() => {
    const found = items.find(x => String(x.proposal_id) === String(selectedId));
    return detail || found || null;
  }, [items, selectedId, detail]);

  const loadList = useCallback(async () => {
    if (!allowed) return;
    const data = await apiFetch("/api/admin/evolution/proposals", { token, org: tenant });
    const next = normalizeList(data);
    setItems(next);
    if (!selectedId && next[0]?.proposal_id) setSelectedId(next[0].proposal_id);
    return next;
  }, [allowed, selectedId, tenant, token]);

  const loadExecutions = useCallback(async () => {
    if (!allowed) return;
    try {
      const data = await apiFetch("/api/admin/evolution/executions", { token, org: tenant });
      const payload = unwrapPayload(data);
      const arr = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : Array.isArray(payload?.executions) ? payload.executions : [];
      setExecutions(arr);
    } catch (err) {
      // AO-14: executions are read-only/future. Do not fail the console if not available.
      setExecutions([]);
    }
  }, [allowed, tenant, token]);

  const loadDetail = useCallback(async (id) => {
    if (!allowed || !id) return null;
    const data = await apiFetch(`/api/admin/evolution/proposals/${encodeURIComponent(id)}`, { token, org: tenant });
    const payload = unwrapPayload(data);
    const normalized = normalizeProposal(payload?.item || payload?.proposal || payload);
    setDetail(normalized);
    return normalized;
  }, [allowed, tenant, token]);

  const loadPlan = useCallback(async (id) => {
    if (!allowed || !id) return null;
    const data = await apiFetch(`/api/admin/evolution/proposals/${encodeURIComponent(id)}/execution-plan`, { token, org: tenant });
    const payload = unwrapPayload(data);
    setPlan(payload);
    return payload;
  }, [allowed, tenant, token]);

  const refreshAll = useCallback(async () => {
    if (!allowed) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const next = await loadList();
      const id = selectedId || next?.[0]?.proposal_id;
      if (id) {
        await loadDetail(id);
        await loadPlan(id);
      }
      await loadExecutions();
      setLastRefresh(nowLabel());
    } catch (err) {
      setError(extractError(err));
    } finally {
      setBusy(false);
    }
  }, [allowed, loadDetail, loadExecutions, loadList, loadPlan, selectedId]);

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (!selectedId || !allowed) return;
    setError("");
    setNotice("");
    setPlan(null);
    loadDetail(selectedId)
      .then(() => loadPlan(selectedId))
      .catch(err => setError(extractError(err)));
  }, [allowed, loadDetail, loadPlan, selectedId]);

  async function approve(id) {
    if (!id) return;
    setActionBusy(`approve:${id}`);
    setError("");
    setNotice("");
    try {
      const data = await apiFetch(`/api/admin/evolution/proposals/${encodeURIComponent(id)}/approve`, {
        method: "POST",
        token,
        org: tenant,
      });
      const payload = unwrapPayload(data);
      const next = normalizeProposal(payload?.item || payload?.proposal || payload);
      if (next) setDetail(next);
      setNotice("Proposta aprovada. Execução continua desabilitada até o próximo ciclo controlado.");
      await refreshAll();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setActionBusy("");
    }
  }

  async function reject(id) {
    if (!id) return;
    setActionBusy(`reject:${id}`);
    setError("");
    setNotice("");
    try {
      const data = await apiFetch(`/api/admin/evolution/proposals/${encodeURIComponent(id)}/reject`, {
        method: "POST",
        token,
        org: tenant,
        body: { reason: rejectReason || "Rejeitado pelo Admin." },
      });
      const payload = unwrapPayload(data);
      const next = normalizeProposal(payload?.item || payload?.proposal || payload);
      if (next) setDetail(next);
      setNotice("Proposta rejeitada. Nenhuma execução foi iniciada.");
      await refreshAll();
    } catch (err) {
      setError(extractError(err));
    } finally {
      setActionBusy("");
    }
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#070711] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <div className={CARD}>
            <SectionTitle eyebrow="Acesso restrito" title="Evolution Console">
              Faça login com uma conta Admin para governar propostas de evolução.
            </SectionTitle>
            <button onClick={() => nav("/auth")} className={`${BTN} bg-white text-black hover:bg-white/90`}>
              Ir para login
            </button>
          </div>
        </div>
      </main>
    );
  }

  const proposalCount = items.length;
  const pendingCount = items.filter(x => String(x.status).toLowerCase().includes("pending")).length;
  const approvedCount = items.filter(x => String(x.status).toLowerCase() === "approved").length;
  const rejectedCount = items.filter(x => String(x.status).toLowerCase() === "rejected").length;
  const planExecutionEnabled = plan?.execution_enabled === true || selected?.execution_enabled === true;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.30),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_34%),#070711] px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/25 p-5 shadow-2xl shadow-black/30 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/70">PTE • Admin Controlled Evolution</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Evolution Console</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/62">
              Governança visual para propostas criadas pelo Orion. Esta tela aprova ou rejeita propostas, mas não executa patches, commits, deploys ou migrations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => nav("/admin")} className={`${BTN} border border-white/10 bg-white/5 text-white/80 hover:bg-white/10`}>
              Admin
            </button>
            <button onClick={refreshAll} disabled={busy} className={`${BTN} bg-violet-400 text-black hover:bg-violet-300`}>
              {busy ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          <div className={CARD}>
            <div className="text-3xl font-black">{proposalCount}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">propostas</div>
          </div>
          <div className={CARD}>
            <div className="text-3xl font-black text-sky-100">{pendingCount}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">pendentes</div>
          </div>
          <div className={CARD}>
            <div className="text-3xl font-black text-emerald-100">{approvedCount}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">aprovadas</div>
          </div>
          <div className={CARD}>
            <div className="text-3xl font-black text-rose-100">{rejectedCount}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">rejeitadas</div>
          </div>
        </section>

        <section className={`${CARD} border-amber-400/20 bg-amber-400/5`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold text-amber-100">Guarda operacional ativa</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-50/70">
                AO-14 é console visual. Ele não chama endpoint de execução. O próximo estágio correto é dry-run controlado, somente após validação de approve/reject.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill className="border-emerald-400/25 bg-emerald-400/10 text-emerald-100">execution_enabled=false</Pill>
              <Pill className="border-violet-400/25 bg-violet-400/10 text-violet-100">proposal_only</Pill>
              <Pill className="border-white/10 bg-white/5 text-white/70">última atualização: {lastRefresh || "-"}</Pill>
            </div>
          </div>
        </section>

        {error ? (
          <section className="rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-50">
            <strong>Erro:</strong> {error}
          </section>
        ) : null}

        {notice ? (
          <section className="rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm text-emerald-50">
            {notice}
          </section>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <div className={CARD}>
            <SectionTitle eyebrow="Fila de governança" title="Propostas">
              Propostas criadas via <span className="font-mono">@Orion proposal_only</span>.
            </SectionTitle>

            {items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-black/15 p-5 text-sm text-white/60">
                Nenhuma proposta encontrada. No chat, peça: <br />
                <span className="mt-2 block rounded-2xl bg-black/30 p-3 font-mono text-xs text-white/80">
                  @Orion gere uma proposta de evolução controlada proposal_only para o ciclo Admin aprovar antes de qualquer execução.
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map(item => {
                  const active = String(item.proposal_id) === String(selectedId);
                  return (
                    <button
                      key={item.proposal_id}
                      onClick={() => setSelectedId(item.proposal_id)}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        active ? "border-violet-300/40 bg-violet-300/10" : "border-white/10 bg-black/15 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{item.title}</p>
                          <p className="mt-1 font-mono text-[11px] text-white/45">{item.proposal_id}</p>
                        </div>
                        <Pill className={statusTone(item.status)}>{item.status}</Pill>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Pill className={riskTone(item.risk)}>risco: {item.risk}</Pill>
                        <Pill className="border-white/10 bg-white/5 text-white/55">{ts(item.created_at)}</Pill>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className={CARD}>
              <SectionTitle eyebrow="Detalhe governado" title={selected?.title || "Selecione uma proposta"}>
                Revise status, risco, rollback e plano antes de aprovar ou rejeitar.
              </SectionTitle>

              {selected ? (
                <>
                  <div className="grid gap-3 md:grid-cols-3">
                    <KeyValue label="proposal_id" value={selected.proposal_id} mono />
                    <KeyValue label="status" value={selected.status} />
                    <KeyValue label="risco" value={selected.risk} />
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <KeyValue label="criada em" value={ts(selected.created_at)} />
                    <KeyValue label="atualizada em" value={ts(selected.updated_at)} />
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Resumo</div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/75">{selected.summary || "Sem resumo retornado."}</p>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Rollback plan</div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/75">{selected.rollback_plan || "Rollback não informado."}</p>
                  </div>

                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/15 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">Checklist de validação</div>
                    {Array.isArray(selected.validation_checklist) && selected.validation_checklist.length ? (
                      <ul className="mt-2 space-y-2 text-sm text-white/75">
                        {selected.validation_checklist.map((x, idx) => <li key={idx}>• {String(x)}</li>)}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-white/55">Checklist não informado pelo endpoint.</p>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                    <input
                      className={INPUT}
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Motivo de rejeição"
                    />
                    <button
                      onClick={() => approve(selected.proposal_id)}
                      disabled={actionBusy || String(selected.status).toLowerCase() === "approved"}
                      className={`${BTN} bg-emerald-400 text-black hover:bg-emerald-300`}
                    >
                      {actionBusy === `approve:${selected.proposal_id}` ? "Aprovando..." : "Aprovar"}
                    </button>
                    <button
                      onClick={() => reject(selected.proposal_id)}
                      disabled={actionBusy || String(selected.status).toLowerCase() === "rejected"}
                      className={`${BTN} bg-rose-400 text-black hover:bg-rose-300`}
                    >
                      {actionBusy === `reject:${selected.proposal_id}` ? "Rejeitando..." : "Rejeitar"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/15 bg-black/15 p-6 text-sm text-white/60">
                  Nenhum detalhe selecionado.
                </div>
              )}
            </div>

            <div className={CARD}>
              <SectionTitle eyebrow="Plano de execução" title="Dry-run futuro, execução desligada">
                Este endpoint deve confirmar que nada será aplicado automaticamente.
              </SectionTitle>

              <div className="mb-4 flex flex-wrap gap-2">
                <Pill className={planExecutionEnabled ? "border-rose-400/25 bg-rose-400/10 text-rose-100" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"}>
                  execution_enabled={String(Boolean(planExecutionEnabled))}
                </Pill>
                <Pill className="border-white/10 bg-white/5 text-white/65">
                  next_stage={plan?.next_stage || "controlled_dry_run"}
                </Pill>
                <Pill className="border-white/10 bg-white/5 text-white/65">
                  requires_admin_approval={String(plan?.requires_admin_approval !== false)}
                </Pill>
              </div>

              <textarea
                className={TEXTAREA}
                readOnly
                value={plan ? JSON.stringify(unwrapPayload(plan), null, 2) : "Plano ainda não carregado."}
              />

              {planExecutionEnabled ? (
                <div className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-50">
                  Bloqueador: o plano retornou execution_enabled=true. Não avance para AO-15 até corrigir.
                </div>
              ) : null}
            </div>

            <div className={CARD}>
              <SectionTitle eyebrow="Execuções" title="Read-only">
                AO-14 só observa execuções futuras. Nenhum botão de execução foi incluído.
              </SectionTitle>
              {executions.length ? (
                <div className="space-y-2">
                  {executions.map((x, idx) => (
                    <div key={x.execution_id || x.id || idx} className="rounded-2xl border border-white/10 bg-black/15 p-3 text-sm text-white/70">
                      <div className="font-mono text-xs text-white/55">{x.execution_id || x.id || `execution_${idx + 1}`}</div>
                      <div className="mt-1">{x.status || "status desconhecido"}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/15 p-3 text-sm text-white/55">
                  Nenhuma execução registrada. Esperado neste estágio.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
