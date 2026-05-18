import React from "react";
import { Link } from "react-router-dom";
import AvatarOracleCard from "../components/AvatarOracleCard.jsx";

const AVATAR_ONBOARDING_BOOT_KEY = "orkio_avatar_onboarding_boot";
const AVATAR_ONBOARDING_CONTEXT_KEY = "orkio_avatar_onboarding_context";

function persistAvatarJourney() {
  if (typeof window === "undefined") return;
  const bootPayload = {
    source: "avatar",
    trigger: "landing_avatar",
    mode: "guided",
    started_at: Date.now(),
  };
  const contextPayload = {
    source: "avatar",
    journey: "landing_to_console_onboarding",
    requested_at: Date.now(),
  };
  try { window.localStorage?.setItem(AVATAR_ONBOARDING_BOOT_KEY, JSON.stringify(bootPayload)); } catch {}
  try { window.sessionStorage?.setItem(AVATAR_ONBOARDING_BOOT_KEY, JSON.stringify(bootPayload)); } catch {}
  try { window.localStorage?.setItem(AVATAR_ONBOARDING_CONTEXT_KEY, JSON.stringify(contextPayload)); } catch {}
}

export default function PatroaiLanding() {
  const palette = {
    text: "#ffffff",
    soft: "rgba(255,255,255,0.74)",
    faint: "rgba(255,255,255,0.48)",
    line: "rgba(255,255,255,0.08)",
    gold: "#f7c862",
    goldSoft: "#ffe29c",
    cyan: "#66bcff",
    green: "#88f3a0",
    violet: "#c783ff",
  };

  const shell = {
    minHeight: "100vh",
    background:
      "radial-gradient(920px 560px at 16% 0%, rgba(255,194,73,0.14), transparent 54%), radial-gradient(760px 520px at 82% 12%, rgba(111,132,255,0.18), transparent 48%), linear-gradient(180deg, #02050a 0%, #040812 100%)",
    color: palette.text,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  };

  const wrap = {
    width: "min(1440px, calc(100% - 32px))",
    margin: "0 auto",
  };

  const glass = {
    background: "rgba(7,10,18,0.72)",
    border: `1px solid ${palette.line}`,
    borderRadius: 30,
    boxShadow: "0 30px 100px rgba(0,0,0,0.38)",
    backdropFilter: "blur(18px)",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid rgba(247,200,98,0.26)",
    background: "rgba(247,200,98,0.06)",
    color: palette.goldSoft,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  const featureCard = (accent) => ({
    ...glass,
    padding: 18,
    minHeight: 118,
    borderLeft: `2px solid ${accent}`,
    background: "rgba(255,255,255,0.02)",
    boxShadow: "none",
  });

  const startAvatarJourney = () => {
    persistAvatarJourney();
    window.location.href = "/auth?entry=avatar";
  };

  return (
    <div style={shell}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "blur(20px)",
          background: "rgba(3,6,11,0.72)",
          borderBottom: `1px solid ${palette.line}`,
        }}
      >
        <div
          style={{
            ...wrap,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            padding: "16px 0",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 35% 30%, #fff1cb 0%, #f5cb68 18%, #a56a14 42%, rgba(11,15,24,0.96) 72%)",
                border: "1px solid rgba(255,219,133,0.34)",
                boxShadow: "0 0 26px rgba(247,200,98,0.28)",
              }}
            />
            <div>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.04em" }}>PATROAI</div>
              <div style={{ color: palette.gold, fontSize: 12, letterSpacing: "0.32em" }}>PANSULTECH</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 24, color: palette.soft, fontWeight: 600, flexWrap: "wrap" }}>
            <span>Soluções</span>
            <span>Plataforma</span>
            <span>Recursos</span>
            <span>Segmentos</span>
            <span>Academia</span>
            <span>Sobre nós</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link to="/auth" style={{ color: palette.text, textDecoration: "none", fontWeight: 700 }}>
              Login
            </Link>
            <button
              type="button"
              onClick={startAvatarJourney}
              style={{
                textDecoration: "none",
                color: palette.text,
                padding: "14px 18px",
                borderRadius: 18,
                border: "1px solid rgba(247,200,98,0.34)",
                background: "linear-gradient(180deg, rgba(28,20,7,0.9), rgba(10,10,8,0.9))",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Entrar com avatar →
            </button>
          </div>
        </div>
      </header>

      <main style={{ ...wrap, paddingTop: 36, paddingBottom: 64 }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.08fr) minmax(380px, 0.92fr)",
            gap: 28,
            alignItems: "stretch",
          }}
        >
          <div style={{ ...glass, padding: 30 }}>
            <div style={chip}>INOVAÇÃO • ESTRATÉGIA • EXECUÇÃO • ESG</div>

            <h1
              style={{
                fontSize: 68,
                lineHeight: 1.02,
                letterSpacing: "-0.045em",
                margin: "22px 0 16px",
                maxWidth: 820,
              }}
            >
              Desenvolvemos sistemas de <span style={{ color: palette.gold }}>inovação</span> que impulsionam empresas a evoluir, prosperar e gerar impacto sustentável.
            </h1>

            <p style={{ color: palette.soft, fontSize: 22, lineHeight: 1.6, maxWidth: 780 }}>
              A PatroAI cria ecossistemas inteligentes com o Orkio — uma presença de IA auditável,
              governável e multiagente, capaz de acolher, analisar, planejar e acompanhar a execução
              com sofisticação, serenidade e valor estratégico.
            </p>

            <div
              style={{
                marginTop: 24,
                borderRadius: 22,
                padding: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "linear-gradient(135deg, rgba(255,224,156,0.08), rgba(124,93,255,0.08))",
              }}
            >
              <div style={{ color: palette.goldSoft, fontWeight: 900, marginBottom: 8 }}>
                Nova entrada guiada
              </div>
              <div style={{ color: palette.soft, fontSize: 15, lineHeight: 1.7 }}>
                Agora a jornada começa pelo avatar: ele conduz a entrada, preserva intenção,
                abre o onboarding no console e prepara uma primeira experiência mais viva e premium.
              </div>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 30 }}>
              <button
                type="button"
                onClick={startAvatarJourney}
                style={{
                  padding: "17px 24px",
                  borderRadius: 18,
                  background: "linear-gradient(90deg, #a46712, #f7c862 54%, #ffe29c)",
                  color: "#101010",
                  fontWeight: 900,
                  boxShadow: "0 18px 40px rgba(247,200,98,0.24)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Iniciar onboarding guiado →
              </button>
              <Link
                to="/auth"
                style={{
                  textDecoration: "none",
                  padding: "17px 22px",
                  borderRadius: 18,
                  border: `1px solid ${palette.line}`,
                  color: palette.text,
                  background: "rgba(255,255,255,0.03)",
                  fontWeight: 800,
                }}
              >
                Entrar agora
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14, marginTop: 24 }}>
              <div style={featureCard(palette.gold)}><div style={{ color: palette.goldSoft, fontWeight: 800, marginBottom: 8 }}>Governança e segurança</div><div style={{ color: palette.soft, fontSize: 14, lineHeight: 1.55 }}>IA auditável, governável e preparada para operação enterprise.</div></div>
              <div style={featureCard(palette.violet)}><div style={{ color: "#e7b0ff", fontWeight: 800, marginBottom: 8 }}>Estratégia inteligente</div><div style={{ color: palette.soft, fontSize: 14, lineHeight: 1.55 }}>Planejamento lúcido e apoio à tomada de decisão.</div></div>
              <div style={featureCard(palette.gold)}><div style={{ color: palette.goldSoft, fontWeight: 800, marginBottom: 8 }}>Execução com IA</div><div style={{ color: palette.soft, fontSize: 14, lineHeight: 1.55 }}>Agentes especializados atuando com contexto e coordenação.</div></div>
              <div style={featureCard(palette.green)}><div style={{ color: "#baffc5", fontWeight: 800, marginBottom: 8 }}>Impacto sustentável</div><div style={{ color: palette.soft, fontSize: 14, lineHeight: 1.55 }}>Crescimento com consciência, eficiência e permanência.</div></div>
            </div>
          </div>

          <AvatarOracleCard
            name="Orkio"
            onStartChat={startAvatarJourney}
          />
        </section>
      </main>
    </div>
  );
}
