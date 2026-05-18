import React, { useMemo, useState } from "react";
import AvatarOracleCard from "../components/AvatarOracleCard.jsx";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";
import OrkioVoiceHero from "../components/OrkioVoiceHero.jsx";

function rememberAppRedirect() {
  try {
    window.localStorage?.setItem("post_auth_redirect", "/app");
    window.sessionStorage?.setItem("post_auth_redirect", "/app");
  } catch {}
}

function safeNavigateToAuth(params = {}) {
  rememberAppRedirect();
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    query.set(key, String(value));
  });
  window.location.href = `/auth${query.toString() ? `?${query.toString()}` : ""}`;
}

const AGENTS = [
  {
    name: "Orkio",
    role: "Copiloto central",
    text: "Organiza contexto, conversa principal, planos e próximos passos.",
  },
  {
    name: "Chris",
    role: "Estratégia e negócios",
    text: "Ajuda a clarear proposta, produto, posicionamento e decisões.",
  },
  {
    name: "Orion",
    role: "Engenharia e auditoria",
    text: "Apoia arquitetura, runtime, patches, deploy e diagnóstico técnico.",
  },
  {
    name: "Team",
    role: "Visão integrada",
    text: "Coordena múltiplos agentes quando a tarefa precisa de leitura completa.",
  },
];

export default function PatroaiLanding() {
  const [prechatOpen, setPrechatOpen] = useState(false);

  const heroSubtitle = useMemo(
    () =>
      "Entre, conte rapidamente seu contexto e use Orkio, Chris, Orion e Team para transformar conversas em planos, decisões e testes com continuidade.",
    []
  );

  function handleLogin() {
    safeNavigateToAuth({ mode: "login" });
  }

  function handleRegister() {
    safeNavigateToAuth({ mode: "register", beta: 1 });
  }

  function handleStartAvatarJourney() {
    setPrechatOpen(true);
  }

  function handleContinueAfterPrechat() {
    setPrechatOpen(false);
    safeNavigateToAuth({ entry: "avatar", onboarding: 1, prechat: 1, mode: "register" });
  }

  const primaryButton = {
    border: 0,
    borderRadius: 18,
    padding: "15px 20px",
    fontWeight: 900,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #172554 0%, #2563eb 52%, #7c3aed 100%)",
    boxShadow: "0 18px 42px rgba(37,99,235,0.28)",
  };

  const secondaryButton = {
    border: "1px solid rgba(15,23,42,0.12)",
    borderRadius: 18,
    padding: "15px 20px",
    fontWeight: 850,
    cursor: "pointer",
    color: "#0f172a",
    background: "rgba(255,255,255,0.82)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% 0%, rgba(37,99,235,0.16), transparent 30%), radial-gradient(circle at 90% 10%, rgba(124,58,237,0.18), transparent 32%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 58%, #f8fafc 100%)",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "38px 20px 70px",
          display: "grid",
          gap: 30,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontSize: 13, letterSpacing: "0.16em", fontWeight: 950, color: "#1e3a8a", textTransform: "uppercase" }}>
              PatroAI · Orkio
            </div>
            <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>
              Beta controlado · copiloto de agentes
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={handleLogin} style={secondaryButton}>
              Entrar
            </button>
            <button type="button" onClick={handleRegister} style={primaryButton}>
              Criar acesso beta
            </button>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.08fr) minmax(320px, 0.92fr)",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div style={{ display: "grid", gap: 22, maxWidth: 760 }}>
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                gap: 10,
                borderRadius: 999,
                padding: "9px 13px",
                background: "rgba(37,99,235,0.09)",
                border: "1px solid rgba(37,99,235,0.16)",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 950,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: "#22c55e", boxShadow: "0 0 0 6px rgba(34,197,94,0.14)" }} />
              Teste fechado com contexto preservado
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(42px, 6.4vw, 78px)",
                lineHeight: 0.96,
                letterSpacing: "-0.055em",
                maxWidth: 900,
              }}
            >
              Orkio é seu copiloto de agentes para organizar decisões, testes e evolução da sua empresa.
            </h1>

            <p style={{ margin: 0, maxWidth: 760, fontSize: 19, lineHeight: 1.72, color: "#334155" }}>
              {heroSubtitle}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button type="button" onClick={handleLogin} style={{ ...primaryButton, fontSize: 16 }}>
                Entrar no Orkio
              </button>
              <button type="button" onClick={handleRegister} style={{ ...secondaryButton, fontSize: 16 }}>
                Criar acesso beta
              </button>
              <button
                type="button"
                onClick={handleStartAvatarJourney}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#475569",
                  fontWeight: 850,
                  cursor: "pointer",
                  padding: "12px 6px",
                }}
              >
                Conversar com avatar
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
                marginTop: 8,
              }}
            >
              {["Entre em menos de 1 minuto", "Receba contexto no primeiro chat", "Teste com plano e checklist"].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 18,
                    border: "1px solid rgba(15,23,42,0.09)",
                    background: "rgba(255,255,255,0.72)",
                    padding: "13px 14px",
                    color: "#334155",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <OrkioVoiceHero onPrimaryAction={handleLogin} />
            <AvatarOracleCard
              title="Onboarding com avatar"
              subtitle="Opcional para o beta: use quando quiser uma entrada mais guiada antes do cadastro."
              ctaLabel="Iniciar conversa com avatar"
              onAction={handleStartAvatarJourney}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(15,23,42,0.10)",
                background: "rgba(255,255,255,0.78)",
                boxShadow: "0 18px 48px rgba(15,23,42,0.08)",
                padding: 18,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>{agent.name}</div>
              <div style={{ marginTop: 4, color: "#2563eb", fontSize: 13, fontWeight: 900 }}>{agent.role}</div>
              <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.55 }}>
                {agent.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AvatarPrechatModal
        open={prechatOpen}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
        autoSpeak={false}
      />
    </div>
  );
}
