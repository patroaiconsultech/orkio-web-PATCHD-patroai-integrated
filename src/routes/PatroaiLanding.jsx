import React, { useMemo, useState } from "react";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";

/**
 * PATROAI CONSULTECH — LANDING INSTITUCIONAL
 *
 * Rota esperada atual: /patroai
 * Não alterar App.jsx por causa deste arquivo.
 * Este componente mantém navegação segura para /auth e preserva redirect para /app.
 *
 * Logo oficial:
 * - Preferencial: public/assets/logo-patroai-novo.png  -> /assets/logo-patroai-novo.png
 * - Fallback:     public/logo-patroai-novo.png         -> /logo-patroai-novo.png
 */

const ROUTES = {
  orkioOS: "/orkio",
  patroai: "/patroai",
  auth: "/auth",
  app: "/app",
};

const LOGO_PRIMARY = "/patroai-assets/logo-patroai-novo.png";
const LOGO_FALLBACK = "/patroai-assets/logo-patroai-novo.webp";

function rememberAppRedirect() {
  try {
    window.localStorage?.setItem("post_auth_redirect", ROUTES.app);
    window.sessionStorage?.setItem("post_auth_redirect", ROUTES.app);
  } catch {}
}

function safeNavigateToAuth(params = {}) {
  rememberAppRedirect();
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    query.set(key, String(value));
  });

  window.location.href = `${ROUTES.auth}${query.toString() ? `?${query.toString()}` : ""}`;
}

function navigateTo(path) {
  window.location.href = path;
}

function PatroaiLogo({ compact = false }) {
  const [src, setSrc] = useState(LOGO_PRIMARY);

  return (
    <div className={`patroai-logo ${compact ? "patroai-logo--compact" : ""}`}>
      <img
        src={src}
        alt="Patroai Consultech"
        onError={() => {
          if (src !== LOGO_FALLBACK) setSrc(LOGO_FALLBACK);
        }}
      />
      <div>
        <strong>PatroAI</strong>
        <span>Consultech</span>
      </div>
    </div>
  );
}

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Diagnosticar",
    text: "Entendemos o negócio, desafios, processos e oportunidades reais.",
    icon: "⌕",
  },
  {
    number: "02",
    title: "Planejar",
    text: "Definimos estratégia, prioridades, arquitetura e próximos passos.",
    icon: "◫",
  },
  {
    number: "03",
    title: "Construir",
    text: "Desenvolvemos sistemas, automações e agentes sob medida.",
    icon: "</>",
  },
  {
    number: "04",
    title: "Implantar",
    text: "Colocamos em produção com clareza, segurança e acompanhamento.",
    icon: "↗",
  },
  {
    number: "05",
    title: "Evoluir",
    text: "Acompanhamos resultados, aprendizados e novas oportunidades.",
    icon: "⌁",
  },
];

const SERVICES = [
  {
    title: "Consultoria Estratégica",
    text: "Mapeamos dores, oportunidades e prioridades para estruturar caminhos claros de evolução.",
    icon: "◎",
  },
  {
    title: "Desenvolvimento de Sistemas",
    text: "Criamos soluções digitais sob medida para organizar processos, dados e operações.",
    icon: "▣",
  },
  {
    title: "Agentes de IA Personalizados",
    text: "Construímos agentes inteligentes adaptados ao contexto, linguagem e objetivos de cada negócio.",
    icon: "✺",
  },
  {
    title: "Automação e Governança",
    text: "Conectamos tecnologia, controle e execução para reduzir fricção e aumentar eficiência.",
    icon: "⚙",
  },
];

const TRUST_ITEMS = [
  "Segurança, privacidade e governança em cada etapa.",
  "IA aplicada ao contexto real do negócio.",
  "Execução com clareza, método e continuidade.",
];

const ORKIO_REPLIES = {
  voice:
    "Pode falar comigo. Eu escuto sua necessidade, organizo o contexto e transformo a conversa em próximos passos.",
  text:
    "Pode digitar sua pergunta. Eu respondo por escrito, preservo o contexto e ajudo a estruturar a evolução da sua empresa.",
  diagnosis:
    "Vamos começar pelo essencial: entender onde a operação perde energia, clareza e velocidade. Depois eu organizo um plano inicial.",
};

function OrkioAssistantCard({ onStartDiagnosis }) {
  const [mode, setMode] = useState("diagnosis");
  const [reply, setReply] = useState(ORKIO_REPLIES.diagnosis);

  const actions = [
    { key: "voice", label: "Falar com Orkio", icon: "≋" },
    { key: "text", label: "Digitar pergunta", icon: "□" },
    { key: "diagnosis", label: "Iniciar diagnóstico empresarial", icon: "✦" },
  ];

  function selectAction(key) {
    setMode(key);
    setReply(ORKIO_REPLIES[key] || ORKIO_REPLIES.diagnosis);
    if (key === "diagnosis") onStartDiagnosis?.();
  }

  return (
    <aside className="patroai-assistant" aria-label="Assistente Orkio">
      <div className="patroai-assistant__glow" />

      <div className="patroai-assistant__header">
        <div className="patroai-assistant__badge">
          <span>Orkio</span>
          <small>Online · voz e texto</small>
        </div>
        <i />
      </div>

      <div className="patroai-assistant__body">
        <div>
          <p>Olá, eu sou o</p>
          <h2>Orkio.</h2>
          <span>
            Posso mostrar como a Patroai transforma processos, sistemas e inteligência artificial em evolução real para empresas.
          </span>

          <div className="patroai-assistant__actions">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                className={mode === action.key ? "is-active" : ""}
                onClick={() => selectAction(action.key)}
              >
                <b>{action.icon}</b>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="patroai-avatar" aria-hidden="true">
          <div className="patroai-avatar__head">
            <span />
            <span />
            <em />
          </div>
          <div className="patroai-avatar__torso">
            <img src={LOGO_PRIMARY} alt="" onError={(event) => (event.currentTarget.style.display = "none")} />
          </div>
        </div>
      </div>

      <div className="patroai-assistant__reply">
        <strong>Resposta do Orkio</strong>
        <p>{reply}</p>
      </div>
    </aside>
  );
}

function HeroOrb() {
  return (
    <div className="patroai-orb" aria-hidden="true">
      <div className="patroai-orb__ring patroai-orb__ring--one" />
      <div className="patroai-orb__ring patroai-orb__ring--two" />
      <div className="patroai-orb__core">
        <div className="patroai-circuit">
          {Array.from({ length: 18 }).map((_, index) => (
            <span key={index} style={{ "--i": index }} />
          ))}
        </div>
        <strong>PatroAI</strong>
      </div>
      {Array.from({ length: 9 }).map((_, index) => (
        <i key={index} style={{ "--i": index }} />
      ))}
    </div>
  );
}

export default function PatroaiLanding() {
  const [prechatOpen, setPrechatOpen] = useState(false);

  const heroSubtitle = useMemo(
    () =>
      "A Patroai Consultech une consultoria estratégica, desenvolvimento de sistemas, automação e agentes de IA personalizados para transformar desafios empresariais em processos inteligentes, governáveis e escaláveis.",
    []
  );

  function handleLogin() {
    safeNavigateToAuth({ mode: "login", source: "patroai_landing" });
  }

  function handleDemo() {
    safeNavigateToAuth({ mode: "register", source: "patroai_demo" });
  }

  function handleStartAvatarJourney() {
    setPrechatOpen(true);
  }

  function handleContinueAfterPrechat() {
    setPrechatOpen(false);
    safeNavigateToAuth({
      entry: "avatar",
      onboarding: 1,
      prechat: 1,
      mode: "register",
      source: "patroai_landing",
    });
  }

  return (
    <div className="patroai-page">
      <style>{`
        .patroai-page {
          min-height: 100vh;
          overflow: hidden;
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(900px 560px at 14% 0%, rgba(245,185,56,0.13), transparent 58%),
            radial-gradient(820px 560px at 88% 16%, rgba(245,185,56,0.12), transparent 52%),
            linear-gradient(180deg, #02060b 0%, #06111b 52%, #02060b 100%);
        }

        .patroai-page * {
          box-sizing: border-box;
        }

        .patroai-shell {
          width: min(1480px, calc(100% - 36px));
          margin: 0 auto;
        }

        .patroai-topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(2,6,11,0.78);
          backdrop-filter: blur(22px);
        }

        .patroai-topbar__inner {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .patroai-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #fff;
          text-decoration: none;
        }

        .patroai-logo img {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(255,214,119,0.28);
          box-shadow: 0 0 26px rgba(245,185,56,0.24);
          background: #05070b;
        }

        .patroai-logo strong {
          display: block;
          font-size: 28px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: 0.01em;
        }

        .patroai-logo span {
          display: block;
          margin-top: 5px;
          color: #f5c451;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.34em;
        }

        .patroai-logo--compact img {
          width: 42px;
          height: 42px;
        }

        .patroai-logo--compact strong {
          font-size: 20px;
        }

        .patroai-nav {
          display: flex;
          align-items: center;
          gap: 34px;
          color: rgba(255,255,255,0.76);
          font-size: 14px;
          font-weight: 650;
        }

        .patroai-nav a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .patroai-nav a:hover {
          color: #f6d27f;
        }

        .patroai-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .patroai-button {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 0;
          border-radius: 16px;
          padding: 0 20px;
          color: #080807;
          background: linear-gradient(135deg, #f8dfa3 0%, #f2bf42 48%, #a76b14 100%);
          box-shadow: 0 18px 46px rgba(245,185,56,0.18);
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .patroai-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 54px rgba(245,185,56,0.24);
        }

        .patroai-button--ghost {
          color: rgba(255,255,255,0.86);
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: none;
        }

        .patroai-button--ghost:hover {
          border-color: rgba(245,185,56,0.42);
          box-shadow: none;
        }

        .patroai-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(360px, 0.86fr) minmax(360px, 0.92fr);
          gap: 38px;
          align-items: center;
          padding: 62px 0 34px;
        }

        .patroai-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          margin-bottom: 22px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(245,185,56,0.26);
          background: rgba(245,185,56,0.065);
          color: #f6ce72;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .patroai-hero h1 {
          margin: 0;
          max-width: 720px;
          font-size: clamp(42px, 5.2vw, 72px);
          line-height: 0.98;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .patroai-gradient-text {
          color: transparent;
          background: linear-gradient(90deg, #f8dfa3, #f2bd3e 55%, #a86c14);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .patroai-hero p {
          margin: 24px 0 0;
          max-width: 640px;
          color: rgba(255,255,255,0.68);
          font-size: 16px;
          line-height: 1.78;
        }

        .patroai-hero__cta {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 32px;
        }

        .patroai-trust {
          display: grid;
          gap: 12px;
          margin-top: 28px;
          color: rgba(255,255,255,0.58);
          font-size: 13px;
        }

        .patroai-trust span {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patroai-trust span::before {
          content: "✓";
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          border: 1px solid rgba(245,185,56,0.32);
          color: #f7cc68;
          font-size: 12px;
        }

        .patroai-orb {
          position: relative;
          display: grid;
          place-items: center;
          aspect-ratio: 1;
          min-height: 420px;
        }

        .patroai-orb::before {
          content: "";
          position: absolute;
          inset: 6%;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(245,185,56,0.22), rgba(245,185,56,0.07) 38%, transparent 67%);
          filter: blur(18px);
        }

        .patroai-orb__ring {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(245,185,56,0.26);
        }

        .patroai-orb__ring--one {
          inset: 10%;
          animation: patroai-spin 38s linear infinite;
        }

        .patroai-orb__ring--two {
          inset: 18%;
          border-style: dashed;
          opacity: 0.68;
          animation: patroai-spin-reverse 54s linear infinite;
        }

        .patroai-orb__core {
          position: relative;
          display: grid;
          place-items: center;
          width: 62%;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px solid rgba(255,222,143,0.42);
          background: rgba(4,8,14,0.58);
          box-shadow: inset 0 0 80px rgba(245,185,56,0.1), 0 0 90px rgba(245,185,56,0.18);
          overflow: hidden;
        }

        .patroai-orb__core::before {
          content: "";
          position: absolute;
          width: 1px;
          height: 86%;
          background: linear-gradient(180deg, transparent, rgba(255,226,156,0.8), transparent);
        }

        .patroai-orb__core::after {
          content: "";
          position: absolute;
          width: 84%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,226,156,0.24), transparent);
        }

        .patroai-orb__core strong {
          position: relative;
          z-index: 2;
          color: #fff;
          font-size: clamp(32px, 4vw, 56px);
          font-weight: 950;
          letter-spacing: -0.05em;
          text-shadow: 0 0 28px rgba(255,225,150,0.55);
        }

        .patroai-circuit {
          position: absolute;
          inset: 18%;
        }

        .patroai-circuit span {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 2px;
          height: calc(26% + (var(--i) % 6) * 8%);
          transform-origin: bottom center;
          transform: rotate(calc((var(--i) - 8.5) * 10deg));
          background: linear-gradient(180deg, rgba(255,230,155,0.92), rgba(245,185,56,0.08));
          border-radius: 999px;
        }

        .patroai-circuit span::before {
          content: "";
          position: absolute;
          top: -5px;
          left: 50%;
          width: 8px;
          height: 8px;
          transform: translateX(-50%);
          border-radius: 999px;
          border: 2px solid rgba(255,230,155,0.95);
          background: #04070c;
          box-shadow: 0 0 14px rgba(255,230,155,0.7);
        }

        .patroai-orb > i {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #ffe29c;
          box-shadow: 0 0 18px rgba(255,226,156,0.95);
          transform:
            rotate(calc(var(--i) * 40deg))
            translateX(190px);
          animation: patroai-pulse 2.8s ease-in-out infinite;
          animation-delay: calc(var(--i) * 0.16s);
        }

        .patroai-assistant {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          border: 1px solid rgba(245,185,56,0.22);
          background: rgba(255,255,255,0.045);
          box-shadow: 0 30px 120px rgba(0,0,0,0.38);
          backdrop-filter: blur(18px);
          padding: 24px;
        }

        .patroai-assistant__glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 82% 12%, rgba(245,185,56,0.18), transparent 38%);
          pointer-events: none;
        }

        .patroai-assistant__header,
        .patroai-assistant__body,
        .patroai-assistant__reply {
          position: relative;
          z-index: 1;
        }

        .patroai-assistant__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .patroai-assistant__badge span {
          display: block;
          color: #f7cc68;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.18em;
        }

        .patroai-assistant__badge small {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,0.45);
          font-size: 12px;
        }

        .patroai-assistant__header i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #42e87f;
          box-shadow: 0 0 16px rgba(66,232,127,0.9);
        }

        .patroai-assistant__body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 180px;
          gap: 18px;
          align-items: center;
        }

        .patroai-assistant__body p {
          margin: 0;
          color: rgba(255,255,255,0.78);
          font-size: 18px;
        }

        .patroai-assistant__body h2 {
          margin: 4px 0 16px;
          color: #f5c451;
          font-size: 52px;
          line-height: 0.95;
          letter-spacing: -0.05em;
        }

        .patroai-assistant__body span {
          display: block;
          color: rgba(255,255,255,0.68);
          font-size: 14px;
          line-height: 1.72;
        }

        .patroai-assistant__actions {
          display: grid;
          gap: 10px;
          margin-top: 22px;
        }

        .patroai-assistant__actions button {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 48px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.10);
          padding: 0 14px;
          color: rgba(255,255,255,0.78);
          background: rgba(0,0,0,0.22);
          font-weight: 780;
          cursor: pointer;
          text-align: left;
        }

        .patroai-assistant__actions button b {
          color: #f6ce72;
          font-size: 17px;
        }

        .patroai-assistant__actions button.is-active {
          color: #fff;
          border-color: rgba(245,185,56,0.52);
          background: rgba(245,185,56,0.13);
          box-shadow: 0 0 28px rgba(245,185,56,0.12);
        }

        .patroai-avatar {
          position: relative;
          min-height: 300px;
          display: grid;
          place-items: end center;
        }

        .patroai-avatar::before {
          content: "";
          position: absolute;
          bottom: 10px;
          width: 150px;
          height: 230px;
          border-radius: 90px 90px 24px 24px;
          background: linear-gradient(180deg, rgba(245,185,56,0.18), rgba(255,255,255,0.04), transparent);
          filter: blur(18px);
        }

        .patroai-avatar__head {
          position: absolute;
          top: 28px;
          width: 112px;
          height: 128px;
          border-radius: 52px 52px 46px 46px;
          border: 1px solid rgba(245,185,56,0.32);
          background: linear-gradient(145deg, rgba(255,255,255,0.14), rgba(6,10,18,0.96));
          box-shadow: inset 0 0 40px rgba(245,185,56,0.1), 0 0 40px rgba(245,185,56,0.12);
        }

        .patroai-avatar__head span {
          position: absolute;
          top: 54px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f8dfa3;
          box-shadow: 0 0 14px rgba(248,223,163,0.9);
        }

        .patroai-avatar__head span:first-child {
          left: 34px;
        }

        .patroai-avatar__head span:nth-child(2) {
          right: 34px;
        }

        .patroai-avatar__head em {
          position: absolute;
          left: 50%;
          bottom: 34px;
          width: 34px;
          height: 2px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: rgba(248,223,163,0.65);
        }

        .patroai-avatar__torso {
          position: absolute;
          bottom: 0;
          width: 170px;
          height: 170px;
          border-radius: 80px 80px 28px 28px;
          border-top: 1px solid rgba(245,185,56,0.28);
          background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.36));
        }

        .patroai-avatar__torso img {
          position: absolute;
          left: 50%;
          top: 54px;
          width: 54px;
          height: 54px;
          transform: translateX(-50%);
          border-radius: 999px;
          object-fit: cover;
          box-shadow: 0 0 28px rgba(245,185,56,0.25);
        }

        .patroai-assistant__reply {
          margin-top: 22px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.24);
          padding: 16px;
        }

        .patroai-assistant__reply strong {
          display: block;
          margin-bottom: 8px;
          color: #f6ce72;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
        }

        .patroai-assistant__reply p {
          margin: 0;
          color: rgba(255,255,255,0.70);
          font-size: 13px;
          line-height: 1.7;
        }

        .patroai-process {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          border: 1px solid rgba(245,185,56,0.18);
          border-radius: 32px;
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(16px);
          padding: 14px;
        }

        .patroai-step,
        .patroai-card {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.085);
          background: rgba(0,0,0,0.22);
          padding: 18px;
        }

        .patroai-step__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .patroai-step small {
          color: rgba(246,206,114,0.86);
          font-weight: 950;
        }

        .patroai-step b,
        .patroai-card b {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 16px;
          border: 1px solid rgba(245,185,56,0.24);
          color: #f6ce72;
          background: rgba(245,185,56,0.08);
          font-size: 17px;
        }

        .patroai-step h3,
        .patroai-card h3 {
          margin: 0;
          color: #fff;
          font-size: 18px;
        }

        .patroai-step p,
        .patroai-card p {
          margin: 9px 0 0;
          color: rgba(255,255,255,0.56);
          font-size: 13px;
          line-height: 1.65;
        }

        .patroai-services {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 34px;
          padding: 76px 0;
        }

        .patroai-section-label {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          color: #f6ce72;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .patroai-section-label::before {
          content: "";
          width: 42px;
          height: 1px;
          background: rgba(246,206,114,0.8);
        }

        .patroai-services h2,
        .patroai-orkio h2 {
          margin: 0;
          max-width: 650px;
          color: #fff;
          font-size: clamp(34px, 4vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .patroai-services__intro p,
        .patroai-orkio p {
          margin: 22px 0 0;
          max-width: 560px;
          color: rgba(255,255,255,0.62);
          font-size: 16px;
          line-height: 1.75;
        }

        .patroai-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .patroai-card {
          min-height: 232px;
          padding: 26px;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .patroai-card:hover {
          transform: translateY(-2px);
          border-color: rgba(245,185,56,0.36);
          background: rgba(255,255,255,0.055);
        }

        .patroai-card b {
          margin-bottom: 30px;
          width: 56px;
          height: 56px;
          border-radius: 20px;
          font-size: 22px;
        }

        .patroai-orkio {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(245,185,56,0.18);
          border-radius: 38px;
          background: linear-gradient(135deg, rgba(245,185,56,0.09), rgba(255,255,255,0.035), rgba(80,160,255,0.055));
          padding: 44px;
        }

        .patroai-orkio::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(245,185,56,0.16), transparent 34%);
          pointer-events: none;
        }

        .patroai-orkio__inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 0.92fr;
          gap: 40px;
          align-items: center;
        }

        .patroai-orkio__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .patroai-orkio__grid article {
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 24px;
          background: rgba(0,0,0,0.22);
          padding: 20px;
        }

        .patroai-orkio__grid strong {
          display: block;
          margin-top: 14px;
          color: rgba(255,255,255,0.84);
          font-size: 14px;
        }

        .patroai-footer {
          margin-top: 70px;
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.18);
        }

        .patroai-footer__inner {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }

        @keyframes patroai-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes patroai-spin-reverse {
          to { transform: rotate(-360deg); }
        }

        @keyframes patroai-pulse {
          0%, 100% { opacity: 0.35; scale: 0.82; }
          50% { opacity: 1; scale: 1.18; }
        }

        @media (max-width: 1180px) {
          .patroai-hero {
            grid-template-columns: 1fr;
          }

          .patroai-orb {
            display: none;
          }

          .patroai-assistant__body {
            grid-template-columns: 1fr 170px;
          }
        }

        @media (max-width: 860px) {
          .patroai-nav {
            display: none;
          }

          .patroai-actions .patroai-button--ghost {
            display: none;
          }

          .patroai-topbar__inner {
            min-height: 82px;
          }

          .patroai-logo strong {
            font-size: 23px;
          }

          .patroai-logo span {
            letter-spacing: 0.22em;
          }

          .patroai-logo img {
            width: 48px;
            height: 48px;
          }

          .patroai-hero {
            padding-top: 42px;
          }

          .patroai-assistant__body {
            grid-template-columns: 1fr;
          }

          .patroai-avatar {
            display: none;
          }

          .patroai-process,
          .patroai-services,
          .patroai-orkio__inner {
            grid-template-columns: 1fr;
          }

          .patroai-cards,
          .patroai-orkio__grid {
            grid-template-columns: 1fr;
          }

          .patroai-footer__inner {
            align-items: flex-start;
            flex-direction: column;
            padding: 24px 0;
          }
        }

        @media (max-width: 560px) {
          .patroai-shell {
            width: min(100% - 24px, 1480px);
          }

          .patroai-topbar__inner {
            gap: 14px;
          }

          .patroai-actions {
            width: 100%;
          }

          .patroai-actions .patroai-button {
            flex: 1;
          }

          .patroai-hero h1 {
            font-size: 42px;
          }

          .patroai-button {
            width: 100%;
          }

          .patroai-assistant,
          .patroai-orkio {
            border-radius: 28px;
            padding: 20px;
          }
        }
      `}</style>

      <header className="patroai-topbar">
        <div className="patroai-shell patroai-topbar__inner">
          <button
            type="button"
            onClick={() => navigateTo(ROUTES.patroai)}
            style={{ appearance: "none", background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
            aria-label="Ir para Patroai"
          >
            <PatroaiLogo />
          </button>

          <nav className="patroai-nav" aria-label="Navegação principal">
            <a href="#solucoes">Soluções</a>
            <a href="#como-atuamos">Como atuamos</a>
            <a href="#orkio">Orkio</a>
            <a href="#sobre">Sobre nós</a>
          </nav>

          <div className="patroai-actions">
            <button type="button" className="patroai-button patroai-button--ghost" onClick={handleLogin}>
              Login
            </button>
            <button type="button" className="patroai-button" onClick={handleDemo}>
              Agendar demonstração →
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="patroai-shell patroai-hero">
          <div>
            <div className="patroai-kicker">Consultoria • Tecnologia • IA • Execução</div>

            <h1>
              Criamos sistemas inteligentes para empresas que querem evoluir com{" "}
              <span className="patroai-gradient-text">clareza, estratégia e execução.</span>
            </h1>

            <p>{heroSubtitle}</p>

            <div className="patroai-hero__cta">
              <button type="button" className="patroai-button" onClick={handleDemo}>
                Conhecer a Patroai →
              </button>
              <button type="button" className="patroai-button patroai-button--ghost" onClick={handleStartAvatarJourney}>
                Falar com Orkio
              </button>
            </div>

            <div className="patroai-trust">
              {TRUST_ITEMS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <HeroOrb />

          <OrkioAssistantCard onStartDiagnosis={handleStartAvatarJourney} />
        </section>

        <section id="como-atuamos" className="patroai-shell patroai-process" aria-label="Como atuamos">
          {PROCESS_STEPS.map((step) => (
            <article key={step.title} className="patroai-step">
              <div className="patroai-step__top">
                <small>{step.number}</small>
                <b>{step.icon}</b>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </section>

        <section id="solucoes" className="patroai-shell patroai-services">
          <div className="patroai-services__intro">
            <div className="patroai-section-label">O que fazemos</div>
            <h2>Soluções que geram clareza, eficiência e evolução contínua.</h2>
            <p>
              A Patroai não entrega apenas tecnologia. Entrega continuidade operacional: entendemos o negócio,
              desenhamos a solução, construímos o sistema, implantamos com clareza e acompanhamos a evolução.
            </p>
          </div>

          <div className="patroai-cards">
            {SERVICES.map((service) => (
              <article key={service.title} className="patroai-card">
                <b>{service.icon}</b>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="orkio" className="patroai-shell patroai-orkio">
          <div className="patroai-orkio__inner">
            <div>
              <div className="patroai-section-label">Conheça o Orkio</div>
              <h2>A inteligência operacional da Patroai.</h2>
              <p>
                O Orkio é o sistema operacional inteligente criado para acompanhar empresas em sua jornada de evolução,
                conectando estratégia, dados, automação, agentes e execução em um único ambiente vivo.
              </p>

              <div className="patroai-hero__cta">
                <button type="button" className="patroai-button" onClick={() => navigateTo(ROUTES.orkioOS)}>
                  Explorar Orkio OS →
                </button>
                <button type="button" className="patroai-button patroai-button--ghost" onClick={handleStartAvatarJourney}>
                  Conversar com Orkio
                </button>
              </div>
            </div>

            <div className="patroai-orkio__grid">
              {[
                ["◉", "Entende seu negócio"],
                ["≋", "Responde por voz e texto"],
                ["✦", "Gera insights e recomendações"],
                ["✓", "Acompanha e evolui com você"],
              ].map(([icon, label]) => (
                <article key={label}>
                  <b>{icon}</b>
                  <strong>{label}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="sobre" className="patroai-footer">
        <div className="patroai-shell patroai-footer__inner">
          <PatroaiLogo compact />
          <span>Patroai Consultech · Sistemas inteligentes, agentes de IA personalizados e execução com governança.</span>
          <span>© 2026 Patroai. Todos os direitos reservados.</span>
        </div>
      </footer>

      <AvatarPrechatModal
        open={prechatOpen}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
        autoSpeak={false}
      />
    </div>
  );
}
