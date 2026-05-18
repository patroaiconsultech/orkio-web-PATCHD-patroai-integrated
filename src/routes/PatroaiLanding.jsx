import React, { useEffect, useState } from "react";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";
import OrkioVoiceHero from "../components/OrkioVoiceHero.jsx";

function navigateTo(path) {
  window.location.href = path;
}

function navigateToAuth(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    query.set(key, String(value));
  });
  navigateTo(`/auth${query.toString() ? `?${query.toString()}` : ""}`);
}

function rememberPostAuthRedirect(path = "/app") {
  try {
    window.sessionStorage?.setItem("post_auth_redirect", path);
  } catch {}
}

export default function PatroaiLanding() {
  const [prechatOpen, setPrechatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 860 : false
  );

  useEffect(() => {
    const onResize = () => {
      try {
        setIsMobile(window.innerWidth <= 860);
      } catch {}
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleLogin() {
    rememberPostAuthRedirect("/app");
    navigateToAuth({ mode: "login" });
  }

  function handleCreateAccount() {
    rememberPostAuthRedirect("/app");
    navigateToAuth({ mode: "register" });
  }

  function handleOpenApp() {
    try {
      if (window.localStorage?.getItem("orkio_token")) {
        navigateTo("/app");
        return;
      }
    } catch {}
    handleLogin();
  }

  function handleAvatarJourney() {
    setPrechatOpen(true);
  }

  function handleContinueAfterPrechat() {
    setPrechatOpen(false);
    rememberPostAuthRedirect("/app");
    navigateToAuth({ mode: "register", entry: "avatar", onboarding: 1, prechat: 1 });
  }

  const palette = {
    bg: "#030713",
    text: "#f8fafc",
    soft: "rgba(248,250,252,0.74)",
    faint: "rgba(248,250,252,0.54)",
    line: "rgba(255,255,255,0.10)",
    gold: "#f7c862",
    blue: "#6fb7ff",
    green: "#8af0b1",
  };

  const wrap = {
    width: "min(1180px, calc(100% - 32px))",
    margin: "0 auto",
  };

  const buttonBase = {
    minHeight: 44,
    borderRadius: 999,
    padding: isMobile ? "11px 14px" : "13px 18px",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
    border: `1px solid ${palette.line}`,
  };

  const card = {
    borderRadius: 28,
    border: `1px solid ${palette.line}`,
    background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))",
    boxShadow: "0 28px 90px rgba(0,0,0,0.28)",
    backdropFilter: "blur(18px)",
  };

  const featureCard = (accent) => ({
    ...card,
    padding: 22,
    borderLeft: `2px solid ${accent}`,
    boxShadow: "none",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        color: palette.text,
        background:
          "radial-gradient(900px 560px at 8% 0%, rgba(247,200,98,0.16), transparent 56%), radial-gradient(720px 460px at 92% 8%, rgba(111,183,255,0.18), transparent 50%), linear-gradient(180deg, #030713 0%, #050914 58%, #02040a 100%)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: `1px solid ${palette.line}`,
          background: "rgba(3,7,19,0.78)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            ...wrap,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            padding: isMobile ? "12px 0" : "15px 0",
          }}
        >
          <button
            type="button"
            onClick={() => navigateTo("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: 0,
              background: "transparent",
              color: palette.text,
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
            }}
            aria-label="Ir para a landing PatroAI"
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 30%, #fff7d6 0%, #f8d46c 20%, #9a6a22 46%, #172033 76%)",
                boxShadow: "0 0 32px rgba(247,200,98,0.32)",
              }}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 950, letterSpacing: "0.08em" }}>PATROAI</div>
              <div style={{ color: palette.gold, fontSize: 11, letterSpacing: "0.22em", fontWeight: 800 }}>
                AGENTES + ORKIO OS
              </div>
            </div>
          </button>

          {!isMobile ? (
            <nav style={{ display: "flex", gap: 22, color: palette.soft, fontWeight: 700 }}>
              <a href="#agentes" style={{ color: "inherit", textDecoration: "none" }}>Agentes</a>
              <a href="#fintech" style={{ color: "inherit", textDecoration: "none" }}>Fintech</a>
              <a href="#governanca" style={{ color: "inherit", textDecoration: "none" }}>Governança</a>
              <a href="#orkio" style={{ color: "inherit", textDecoration: "none" }}>Orkio</a>
            </nav>
          ) : null}

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={handleLogin}
              style={{
                ...buttonBase,
                background: "rgba(255,255,255,0.04)",
                color: palette.text,
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
                  background: "linear-gradient(90deg, #a46712, #f7c862 58%, #ffe29c)",
                  color: "#101010",
                  boxShadow: "0 18px 44px rgba(247,200,98,0.22)",
                }}
              >
                Criar conta
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main style={{ ...wrap, padding: isMobile ? "34px 0 70px" : "56px 0 86px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.06fr) minmax(360px, 0.94fr)",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <div style={{ ...card, padding: isMobile ? 24 : 34 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(247,200,98,0.28)",
                background: "rgba(247,200,98,0.08)",
                color: "#ffe29c",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Plataforma institucional PatroAI
            </div>

            <h1
              style={{
                margin: "22px 0 16px",
                fontSize: "clamp(42px, 7vw, 78px)",
                lineHeight: 0.98,
                letterSpacing: "-0.055em",
              }}
            >
              Agentes inteligentes para transformar visão em operação.
            </h1>

            <p style={{ margin: 0, color: palette.soft, fontSize: 20, lineHeight: 1.68, maxWidth: 820 }}>
              A PatroAI une estratégia, tecnologia e governança para criar agentes personalizados,
              estruturar negócios e acelerar jornadas comerciais, financeiras e operacionais com o Orkio.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <button
                type="button"
                onClick={handleLogin}
                style={{
                  ...buttonBase,
                  border: 0,
                  background: "linear-gradient(90deg, #a46712, #f7c862 58%, #ffe29c)",
                  color: "#101010",
                  boxShadow: "0 18px 44px rgba(247,200,98,0.22)",
                }}
              >
                Entrar na plataforma
              </button>
              <button
                type="button"
                onClick={handleCreateAccount}
                style={{
                  ...buttonBase,
                  background: "rgba(255,255,255,0.06)",
                  color: palette.text,
                }}
              >
                Criar conta
              </button>
              <button
                type="button"
                onClick={handleAvatarJourney}
                style={{
                  ...buttonBase,
                  background: "rgba(111,183,255,0.10)",
                  color: "#d9ecff",
                }}
              >
                Conversar com avatar
              </button>
            </div>
          </div>

          <div id="orkio" style={{ minWidth: 0 }}>
            <OrkioVoiceHero
              tenant="public"
              kicker="Orkio • Sistema operacional de execução"
              title="Do plano à execução governada."
              subtitle="Entre direto na plataforma, crie sua conta ou faça uma conversa inicial opcional com o avatar. Login e onboarding ficam separados."
              speech="Olá. Eu sou o Orkio. A PatroAI usa agentes inteligentes para transformar estratégia em execução com clareza, governança e continuidade."
              primaryLabel="Entrar"
              secondaryLabel="Criar conta"
              tertiaryLabel="Conversar com avatar"
              quickTitle="Perguntas rápidas"
              quickPrompts={[
                "Como a PatroAI cria agentes personalizados?",
                "Como o Orkio apoia execução e governança?",
                "Como a plataforma pode apoiar uma fintech?",
              ]}
              onPrimaryAction={handleLogin}
              onSecondaryAction={handleCreateAccount}
              onTertiaryAction={handleAvatarJourney}
            />
          </div>
        </section>

        <section
          id="agentes"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          <div style={featureCard(palette.gold)}>
            <div style={{ color: "#ffe29c", fontWeight: 950, marginBottom: 10 }}>Agentes personalizados</div>
            <div style={{ color: palette.soft, lineHeight: 1.72 }}>
              Criação de agentes sob medida para atendimento, análise, originação, relacionamento e execução.
            </div>
          </div>
          <div id="fintech" style={featureCard(palette.blue)}>
            <div style={{ color: "#cbe8ff", fontWeight: 950, marginBottom: 10 }}>Fintech e crédito estruturado</div>
            <div style={{ color: palette.soft, lineHeight: 1.72 }}>
              Base para operações estruturadas, home equity, análise de risco, originação e relacionamento institucional.
            </div>
          </div>
          <div id="governanca" style={featureCard(palette.green)}>
            <div style={{ color: "#caffdd", fontWeight: 950, marginBottom: 10 }}>Governança operacional</div>
            <div style={{ color: palette.soft, lineHeight: 1.72 }}>
              Fluxos rastreáveis, separação de responsabilidades, auditoria e continuidade entre chats, agentes e decisões.
            </div>
          </div>
        </section>

        <section
          style={{
            ...card,
            marginTop: 24,
            padding: isMobile ? 22 : 28,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: palette.gold, fontWeight: 950, marginBottom: 8 }}>Acesso direto preservado</div>
            <div style={{ color: palette.soft, lineHeight: 1.7 }}>
              Usuários existentes podem entrar sem passar pelo onboarding. A conversa com avatar continua disponível,
              mas como jornada opcional de encantamento e coleta de contexto.
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenApp}
            style={{
              ...buttonBase,
              border: 0,
              background: "linear-gradient(135deg, #2563eb, #0f172a)",
              color: "#ffffff",
              boxShadow: "0 18px 44px rgba(37,99,235,0.20)",
            }}
          >
            Abrir Orkio
          </button>
        </section>
      </main>

      <AvatarPrechatModal
        open={prechatOpen}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
        autoSpeak={true}
      />
    </div>
  );
}
