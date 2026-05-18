import React, { useEffect, useMemo, useState } from "react";
import AvatarOracleCard from "../components/AvatarOracleCard.jsx";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";
import OrkioVoiceHero from "../components/OrkioVoiceHero.jsx";

function safeNavigateToAuth(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    query.set(key, String(value));
  });
  window.location.href = `/auth${query.toString() ? `?${query.toString()}` : ""}`;
}

function rememberPostAuthRedirect(path = "/app") {
  try {
    window.sessionStorage?.setItem("post_auth_redirect", path);
  } catch {}
}

export default function PatroaiLanding() {
  const [prechatOpen, setPrechatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 820 : false
  );

  useEffect(() => {
    const onResize = () => {
      try {
        setIsMobile(window.innerWidth <= 820);
      } catch {}
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const heroSubtitle = useMemo(
    () =>
      "Uma jornada de ativação guiada por avatar, com conversa inicial opcional antes do cadastro para gerar contexto, presença e encantamento.",
    []
  );

  function handleLogin() {
    rememberPostAuthRedirect("/app");
    safeNavigateToAuth({ mode: "login" });
  }

  function handleCreateAccount() {
    rememberPostAuthRedirect("/app");
    safeNavigateToAuth({ mode: "register" });
  }

  function handleOpenApp() {
    try {
      if (window.localStorage?.getItem("orkio_token")) {
        window.location.href = "/app";
        return;
      }
    } catch {}
    handleLogin();
  }

  function handleStartAvatarJourney() {
    setPrechatOpen(true);
  }

  function handleContinueAfterPrechat() {
    setPrechatOpen(false);
    rememberPostAuthRedirect("/app");
    safeNavigateToAuth({ mode: "register", entry: "avatar", onboarding: 1, prechat: 1 });
  }

  const shellStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(191,219,254,0.55), rgba(248,250,252,1) 38%, rgba(238,242,255,1) 100%)",
    color: "#0f172a",
  };

  const buttonBase = {
    minHeight: 44,
    borderRadius: 999,
    padding: "12px 18px",
    fontWeight: 900,
    cursor: "pointer",
    border: "1px solid rgba(15,23,42,0.12)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={shellStyle}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(18px)",
          background: "rgba(248,250,252,0.82)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: isMobile ? "12px 16px" : "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <button
            type="button"
            onClick={handleOpenApp}
            style={{
              border: 0,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#0f172a",
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
            }}
            title="Abrir Orkio"
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 30%, #fff7d6 0%, #f8d46c 22%, #a76a16 48%, #0f172a 78%)",
                boxShadow: "0 0 26px rgba(245,158,11,0.28)",
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 950, letterSpacing: "0.16em" }}>ORKIO</div>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 800 }}>
                Intelligence OS
              </div>
            </div>
          </button>

          <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={handleLogin}
              style={{
                ...buttonBase,
                background: "#ffffff",
                color: "#0f172a",
              }}
            >
              Entrar
            </button>
            {!isMobile ? (
              <button
                type="button"
                onClick={handleCreateAccount}
                style={{
                  ...buttonBase,
                  border: 0,
                  background: "linear-gradient(135deg, #0f172a, #2563eb)",
                  color: "#ffffff",
                  boxShadow: "0 16px 34px rgba(37,99,235,0.18)",
                }}
              >
                Criar conta
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: isMobile ? "30px 16px 64px" : "48px 20px 72px",
          display: "grid",
          gap: 28,
        }}
      >
        <div style={{ display: "grid", gap: 18, maxWidth: 860 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.12em",
              fontWeight: 800,
              color: "#31508e",
              textTransform: "uppercase",
            }}
          >
            Orkio • Landing Premium
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(38px, 6vw, 74px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
            }}
          >
            A primeira conversa pode começar antes do cadastro.
          </h1>
          <p style={{ margin: 0, maxWidth: 760, fontSize: 18, lineHeight: 1.7, color: "#334155" }}>
            {heroSubtitle}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              type="button"
              onClick={handleLogin}
              style={{
                ...buttonBase,
                border: 0,
                background: "linear-gradient(135deg, #0f172a, #2563eb)",
                color: "#ffffff",
                boxShadow: "0 18px 40px rgba(37,99,235,0.18)",
              }}
            >
              Entrar na minha conta
            </button>
            <button
              type="button"
              onClick={handleCreateAccount}
              style={{
                ...buttonBase,
                background: "#ffffff",
                color: "#0f172a",
              }}
            >
              Criar conta grátis
            </button>
            <button
              type="button"
              onClick={handleStartAvatarJourney}
              style={{
                ...buttonBase,
                background: "rgba(255,255,255,0.54)",
                color: "#31508e",
              }}
            >
              Conversar com o avatar
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <OrkioVoiceHero
            onPrimaryAction={handleLogin}
            primaryLabel="Entrar na minha conta"
            secondaryLabel="Criar conta grátis"
            tertiaryLabel="Conversar com o avatar"
            onSecondaryAction={handleCreateAccount}
            onTertiaryAction={handleStartAvatarJourney}
          />

          <AvatarOracleCard
            title="Entrar com a Orkio"
            subtitle="Faça uma microconversa guiada ou entre direto na sua conta."
            ctaLabel="Iniciar conversa com avatar"
            onAction={handleStartAvatarJourney}
          />
        </div>
      </section>

      <AvatarPrechatModal
        open={prechatOpen}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
        autoSpeak={true}
      />
    </div>
  );
}
