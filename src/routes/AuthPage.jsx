import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { consumeReturnTo, DEFAULT_AFTER_LOGIN_PATH } from "../lib/authReturn";
import { completeOtpLogin, setSession } from "../lib/auth.js";
import { validateInvestorAccessCode } from "../ui/api.js";

function normalizeSessionPayload(result) {
  const data = result?.data || result?.payload || result || {};

  const token =
    data?.access_token ||
    data?.token ||
    data?.jwt ||
    data?.session?.access_token ||
    data?.session?.token ||
    data?.auth?.access_token ||
    data?.auth?.token ||
    "";

  const user =
    data?.user ||
    data?.account ||
    data?.profile ||
    data?.session?.user ||
    data?.auth?.user ||
    null;

  const tenant =
    data?.tenant ||
    data?.org ||
    data?.org_slug ||
    data?.workspace ||
    user?.tenant ||
    user?.org_slug ||
    "public";

  return { token, user, tenant, raw: data };
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [org, setOrg] = useState("public");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    setBusy(true);
    setError("");

    try {
      const result = await validateInvestorAccessCode({
        email: email.trim(),
        code: code.trim(),
        tenant: org || "public",
        org: org || "public",
      });

      const session = normalizeSessionPayload(result);

      if (!session.token || !session.user) {
        throw new Error("Resposta de autenticação sem token ou usuário.");
      }

      try {
        completeOtpLogin({
          access_token: session.token,
          user: session.user,
          tenant: session.tenant,
        });
      } catch {
        setSession({
          token: session.token,
          user: session.user,
          tenant: session.tenant,
        });
      }

      const destination =
        consumeReturnTo(location) ||
        DEFAULT_AFTER_LOGIN_PATH ||
        "/app";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.message || "Falha ao validar código de acesso.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.32),_transparent_32%),#070711] px-4 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <div className="w-full rounded-[2rem] border border-white/10 bg-black/30 p-6 shadow-2xl shadow-black/35 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200/70">
            Patroai
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Entrar
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Acesse sua conta usando o código de acesso autorizado.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                E-mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                placeholder="voce@empresa.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                Código de acesso
              </span>
              <input
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                placeholder="código autorizado"
                autoComplete="one-time-code"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                Organização
              </span>
              <input
                value={org}
                onChange={(event) => setOrg(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                placeholder="public"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-50">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-violet-400 px-4 py-3 text-sm font-black text-black transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Validando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
