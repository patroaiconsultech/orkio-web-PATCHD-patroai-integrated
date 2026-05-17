import React from "react";
import { Link, useNavigate } from "react-router-dom";
import OrkioVoiceHero from "../components/OrkioVoiceHero.jsx";

export default function Landing() {
  const nav = useNavigate();

  const palette = {
    text: "#ffffff",
    soft: "rgba(255,255,255,0.74)",
    faint: "rgba(255,255,255,0.52)",
    line: "rgba(255,255,255,0.08)",
    gold: "#f7c862",
    goldSoft: "#ffe29c",
    cyan: "#66bcff",
    green: "#88f3a0",
    violet: "#c783ff",
  };

  const shell = {
    minHeight: "100vh",
    color: palette.text,
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    background:
      "radial-gradient(900px 560px at 10% 0%, rgba(255,194,73,0.12), transparent 56%), radial-gradient(760px 500px at 86% 10%, rgba(111,132,255,0.16), transparent 48%), linear-gradient(180deg, #02050a 0%, #050914 100%)",
  };

  const wrap = {
    width: "min(1360px, calc(100% - 32px))",
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

  const card = (accent) => ({
    ...glass,
    padding: 20,
    minHeight: 132,
    borderLeft: `2px solid ${accent}`,
    background: "rgba(255,255,255,0.02)",
    boxShadow: "none",
  });

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
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "16px 0" }}>
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
              <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.04em" }}>ORKIO</div>
              <div style={{ color: palette.gold, fontSize: 12, letterSpacing: "0.24em" }}>BUSINESS EXECUTION ENGINE</div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 24, color: palette.soft, fontWeight: 600 }}>
            <span>Business plans</span>
            <span>Agentes</span>
            <span>Execução</span>
            <span>Governança</span>
            <span>Resultados</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link to="/patroai" style={{ color: palette.text, textDecoration: "none", fontWeight: 700 }}>
              PatroAI
            </Link>
            <Link
              to="/auth"
              style={{
                textDecoration: "none",
                color: palette.text,
                padding: "14px 18px",
                borderRadius: 18,
                border: "1px solid rgba(247,200,98,0.34)",
                background: "linear-gradient(180deg, rgba(28,20,7,0.9), rgba(10,10,8,0.9))",
                fontWeight: 900,
              }}
            >
              Entrar →
            </Link>
          </div>
        </div>
      </header>

      <main style={{ ...wrap, paddingTop: 36, paddingBottom: 72 }}>
        <section style={{ display: "grid", gap: 28 }}>
          <div style={{ ...glass, padding: 28 }}>
            <div style={chip}>DA CONCEPÇÃO À EXECUÇÃO CIRÚRGICA</div>

            <h1 style={{ fontSize: 72, lineHeight: 1.02, letterSpacing: "-0.045em", margin: "22px 0 16px", maxWidth: 980 }}>
              O <span style={{ color: palette.gold }}>Orkio</span> é a camada de inteligência que permite à PatroAI <span style={{ color: palette.cyan }}>conceber</span>, <span style={{ color: palette.green }}>estruturar</span> e <span style={{ color: palette.violet }}>executar</span> qualquer negócio com governança.
            </h1>

            <p style={{ color: palette.soft, fontSize: 22, lineHeight: 1.65, maxWidth: 920 }}>
              Com o Orkio, a narrativa deixa de ser apenas consultiva: ele ajuda a transformar tese em business plans sofisticados, coordena agentes especializados, organiza a operação e acompanha a execução com rastreabilidade.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 26 }}>
              <button
                type="button"
                onClick={() => nav("/auth")}
                style={{
                  padding: "17px 24px",
                  borderRadius: 18,
                  border: 0,
                  background: "linear-gradient(90deg, #a46712, #f7c862 54%, #ffe29c)",
                  color: "#101010",
                  fontWeight: 900,
                  boxShadow: "0 18px 40px rgba(247,200,98,0.24)",
                  cursor: "pointer",
                }}
              >
                Entrar no Orkio →
              </button>

              <button
                type="button"
                onClick={() => nav("/patroai")}
                style={{
                  padding: "17px 22px",
                  borderRadius: 18,
                  border: `1px solid ${palette.line}`,
                  color: palette.text,
                  background: "rgba(255,255,255,0.03)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Ver narrativa PatroAI
              </button>
            </div>
          </div>

          <OrkioVoiceHero
            tenant="public"
            kicker="Orkio • Business Execution Engine"
            title="Qualquer negócio, do plano à operação."
            subtitle="O Orkio foi posicionado para clientes e investidores como o motor que atravessa toda a jornada: visão, business plan, modelagem, agentes, execução e acompanhamento governado."
            speech="Olá. Eu sou o Orkio. Através de mim, a PatroAI pode conceber novos negócios, estruturar business plans sofisticados e conduzir a execução com clareza, inteligência e governança."
            primaryLabel="Entrar no Orkio"
            secondaryLabel="Conhecer a PatroAI"
            tertiaryLabel="Falar com a equipe"
            quickTitle="Perguntas que o site precisa responder"
            quickPrompts={[
              "Como a PatroAI concebe um novo negócio através do Orkio?",
              "Como o Orkio transforma business plan em execução?",
              "Qual é o diferencial competitivo da plataforma?",
            ]}
            onPrimaryAction={() => nav("/auth")}
            onSecondaryAction={() => nav("/patroai")}
            onTertiaryAction={() => nav("/contact")}
          />

          <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            <div style={card(palette.gold)}>
              <div style={{ color: palette.goldSoft, fontWeight: 900, marginBottom: 10 }}>Concepção estratégica</div>
              <div style={{ color: palette.soft, lineHeight: 1.7 }}>
                Diagnóstico, tese, proposta de valor, arquitetura do negócio e desenho do caminho de entrada.
              </div>
            </div>
            <div style={card(palette.cyan)}>
              <div style={{ color: "#a9e7ff", fontWeight: 900, marginBottom: 10 }}>Business plans sofisticados</div>
              <div style={{ color: palette.soft, lineHeight: 1.7 }}>
                Estruturação de BP, monetização, roadmap, narrativa para investidores e desenho operacional.
              </div>
            </div>
            <div style={card(palette.green)}>
              <div style={{ color: "#baffc5", fontWeight: 900, marginBottom: 10 }}>Execução cirúrgica</div>
              <div style={{ color: palette.soft, lineHeight: 1.7 }}>
                Orquestração de agentes, governança, rastreabilidade e acompanhamento contínuo da operação.
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
