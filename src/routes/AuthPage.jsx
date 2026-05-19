import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { consumeReturnTo, DEFAULT_AFTER_LOGIN_PATH } from "../lib/authReturn";

function getApiBase() {
  return (
    import.meta?.env?.VITE_API_BASE_URL ||
    import.meta?.env?.VITE_API_URL ||
    ""
  ).replace(/\/$/, "");
}

function storeAuthPayload(data) {
  const token =
    data?.access_token ||
    data?.token ||
    data?.jwt ||
    data?.data?.access_token ||
    data?.data?.token ||
    "";

  const user = data?.user || data?.data?.user || null;

  if (token) {
    localStorage.setItem("orkio_token", token);
    localStorage.setItem("access_token", token);
    localStorage.setItem("token", token);
  }

  if (user) {
    localStorage.setItem("orkio_user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
  }

  return { token, user };
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
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      `Falha HTTP ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org, setOrg] = useState("public");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    setBusy(true);
    setError("");

    try {
      const response = await fetch(`${getApiBase()}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Orkio-Org": org || "public",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          org: org || "public",
        }),
      });

      const data = await parseResponse(response);
      storeAuthPayload(data);

      const destination =
        consumeReturnTo(location) ||
        DEFAULT_AFTER_LOGIN_PATH ||
        "/app";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.message || "Falha ao entrar.");
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
            Acesse sua conta para continuar.
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
                Senha
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                placeholder="••••••••"
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
              {busy ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
