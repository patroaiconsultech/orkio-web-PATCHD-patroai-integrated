import usePatroaiSeo from "../lib/usePatroaiSeo.js";
import React, { useMemo, useState } from "react";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";
import LandingLanguageSwitch from "../components/LandingLanguageSwitch.jsx";
import { useLandingLocale } from "../lib/landingLocale.js";

const ROUTES = {
  orkioOS: "/orkio",
  patroai: "/patroai",
  auth: "/auth",
  app: "/app",
  admin: "/admin",
};

const LOGO_PRIMARY = "/patroai-assets/logo-patroai-novo.png";
const LOGO_FALLBACK = "/patroai-assets/logo-patroai-novo.webp";

const PATROAI_PAGE_COPY = {
  pt: {
    navAria: "Navegação principal",
    brandAria: "Ir para PatroAI",
    nav: {
      solutions: "Soluções",
      orkio: "Orkio",
      resources: "Metodologia",
      about: "Sobre",
    },
    actions: {
      admin: "Admin",
      login: "Login",
      demo: "Agendar demonstração →",
    },
    hero: {
      kicker: "Startup Outsourcing • SaaS • IA • Governança",
      titleBefore: "Criamos startups inteligentes do plano à",
      titleHighlight: "operação.",
      subtitle:
        "A PatroAI desenvolve startups, produtos digitais e operações inteligentes em modelo outsourcing premium, combinando business plan, estudo de viabilidade econômico-financeira, tecnologia, SaaS, IA, governança e rastreabilidade para investidores e stakeholders.",
      primary: "Conhecer a PatroAI →",
      secondary: "Falar com Orkio",
      trust:
        "Implantação e evolução acompanhadas por consultores especializados em negócios e tecnologia.",
    },
    orkioSpeech:
      "Olá. Eu sou Orkio. Posso mostrar como a PatroAI transforma ideias, empresas e oportunidades em operações digitais estruturadas, com estratégia, tecnologia, governança e clareza para investidores.",
    processAria: "Como atuamos",
    processSteps: [
      { number: "01", title: "Estruturar", text: "Mapeamos a oportunidade, o mercado, o modelo de negócio, os riscos e os objetivos do projeto.", icon: "search" },
      { number: "02", title: "Validar", text: "Construímos business plan, projeções e estudo de viabilidade econômico-financeira.", icon: "plan" },
      { number: "03", title: "Construir", text: "Desenvolvemos tecnologia, automações, agentes de IA e plataformas digitais sob medida.", icon: "code" },
      { number: "04", title: "Implantar", text: "Colocamos a operação em funcionamento com documentação, governança e rastreabilidade.", icon: "rocket" },
      { number: "05", title: "Evoluir", text: "Acompanhamos a sequência da operação com consultores especializados em negócios e tecnologia.", icon: "growth" },
    ],
    servicesIntro: {
      label: "O que fazemos",
      title:
        "Startup outsourcing, SaaS, IA e governança para negócios que precisam nascer ou evoluir com estrutura premium.",
      text:
        "A PatroAI atua do plano à operação. Elaboramos business plans, estudos de viabilidade econômico-financeira, arquitetura de produto, desenvolvimento tecnológico, implantação, gestão assistida e acompanhamento por consultores especializados em negócios e tecnologia. Também oferecemos a plataforma PatroAI em modelo SaaS para empresas já em operação.",
    },
    services: [
      {
        title: "Startup Outsourcing Premium",
        text:
          "Desenvolvemos startups, produtos digitais e novas operações desde a concepção estratégica até a implantação, tecnologia, governança e operação assistida.",
        icon: "target",
      },
      {
        title: "Business Plan & Viabilidade",
        text:
          "Estruturamos modelos de negócio, projeções financeiras e estudos de viabilidade econômico-financeira para apoiar decisões mais seguras.",
        icon: "system",
      },
      {
        title: "Tecnologia, SaaS & IA",
        text:
          "Criamos plataformas, automações e agentes de IA personalizados, com possibilidade de comercialização da plataforma em modelo SaaS para empresas já em operação.",
        icon: "brain",
      },
      {
        title: "Governança para Investidores",
        text:
          "Organizamos documentos, marcos, indicadores e rastreabilidade para dar clareza a investidores, empresas e stakeholders.",
        icon: "gear",
      },
    ],
    orkioSection: {
      label: "Conheça Orkio",
      title: "Conheça Orkio, a inteligência operacional da PatroAI.",
      text:
        "Orkio é nossa inteligência operacional para diagnóstico, clareza executiva e próximos passos. Ele apoia fundadores, empresas e consultores na leitura do contexto, na organização das decisões e na evolução da operação com IA.",
      primary: "Explorar Orkio OS →",
      secondary: "Conversar com Orkio",
      avatarLabel: "Orkio — presença místico-tecnológica da PatroAI",
      avatarTitle: "Presença de Orkio",
      avatarText:
        "Avatar místico-tecnológico preparado para voz, texto, diagnóstico guiado e continuidade contextual.",
    },
    orkioBenefits: [
      ["search", "Entende o contexto do negócio"],
      ["voice", "Responde por voz e texto"],
      ["brain", "Gera insights e recomendações"],
      ["gear", "Acompanha a evolução da operação"],
    ],
    footer: {
      text:
        "PatroAI Consultech · Startup outsourcing premium, SaaS, IA, governança e rastreabilidade para investidores.",
      rights: "© 2026 PatroAI. Todos os direitos reservados.",
    },
  },
  en: {
    navAria: "Main navigation",
    brandAria: "Go to PatroAI",
    nav: {
      solutions: "Solutions",
      orkio: "Orkio",
      resources: "Methodology",
      about: "About",
    },
    actions: {
      admin: "Admin",
      login: "Login",
      demo: "Schedule a demo →",
    },
    hero: {
      kicker: "Startup Outsourcing • SaaS • AI • Governance",
      titleBefore: "We build intelligent startups from plan to",
      titleHighlight: "operation.",
      subtitle:
        "PatroAI develops startups, digital products and intelligent operations through a premium outsourcing model, combining business plans, financial feasibility studies, technology, SaaS, AI, governance and traceability for investors and stakeholders.",
      primary: "Discover PatroAI →",
      secondary: "Talk to Orkio",
      trust:
        "Deployment and operational evolution supported by specialized business and technology consultants.",
    },
    orkioSpeech:
      "Hello. I am Orkio. I can show how PatroAI transforms ideas, companies and opportunities into structured digital operations, with strategy, technology, governance and investor-grade clarity.",
    processAria: "How we work",
    processSteps: [
      { number: "01", title: "Structure", text: "We map the opportunity, market, business model, risks and strategic goals of the project.", icon: "search" },
      { number: "02", title: "Validate", text: "We build the business plan, projections and financial feasibility study.", icon: "plan" },
      { number: "03", title: "Build", text: "We develop technology, automations, AI agents and tailored digital platforms.", icon: "code" },
      { number: "04", title: "Deploy", text: "We launch the operation with documentation, governance and traceability.", icon: "rocket" },
      { number: "05", title: "Evolve", text: "We support the ongoing operation with specialized business and technology consultants.", icon: "growth" },
    ],
    servicesIntro: {
      label: "What we do",
      title:
        "Startup outsourcing, SaaS, AI and governance for businesses that need to launch or evolve with a premium structure.",
      text:
        "PatroAI works from plan to operation. We create business plans, financial feasibility studies, product architecture, technology development, deployment, assisted management and ongoing support through specialized business and technology consultants. We also offer the PatroAI platform as SaaS for companies already in operation.",
    },
    services: [
      {
        title: "Premium Startup Outsourcing",
        text:
          "We develop startups, digital products and new operations from strategic conception to deployment, technology, governance and assisted operations.",
        icon: "target",
      },
      {
        title: "Business Plan & Feasibility",
        text:
          "We structure business models, financial projections and feasibility studies to support safer decisions.",
        icon: "system",
      },
      {
        title: "Technology, SaaS & AI",
        text:
          "We create platforms, automations and personalized AI agents, with the possibility of commercializing the platform as SaaS for companies already in operation.",
        icon: "brain",
      },
      {
        title: "Investor-Grade Governance",
        text:
          "We organize documents, milestones, indicators and traceability to provide clarity for investors, companies and stakeholders.",
        icon: "gear",
      },
    ],
    orkioSection: {
      label: "Meet Orkio",
      title: "Meet Orkio, PatroAI's operational intelligence.",
      text:
        "Orkio is our operational intelligence for diagnosis, executive clarity and next steps. It supports founders, companies and consultants in understanding context, organizing decisions and evolving operations with AI.",
      primary: "Explore Orkio OS →",
      secondary: "Talk to Orkio",
      avatarLabel: "Orkio — PatroAI's mystic-technological presence",
      avatarTitle: "Orkio's presence",
      avatarText:
        "Mystic-technological avatar prepared for voice, text, guided diagnosis and contextual continuity.",
    },
    orkioBenefits: [
      ["search", "Understands business context"],
      ["voice", "Responds by voice and text"],
      ["brain", "Generates insights and recommendations"],
      ["gear", "Follows operational evolution"],
    ],
    footer: {
      text:
        "PatroAI Consultech · Premium startup outsourcing, SaaS, AI, governance and investor-grade traceability.",
      rights: "© 2026 PatroAI. All rights reserved.",
    },
  },
};

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
    <div className="patroai-logo-wrap">
      <img
        src={src}
        alt="PatroAI Consultech"
        className="patroai-logo-img"
        onError={() => {
          if (src !== LOGO_FALLBACK) setSrc(LOGO_FALLBACK);
        }}
      />
      {!compact ? (
        <div className="patroai-logo-text">
          <strong>PatroAI</strong>
          <span>Consultech</span>
        </div>
      ) : null}
    </div>
  );
}

function PremiumMark({ icon = "✦" }) {
  return <span className="premium-mark" aria-hidden="true">{icon}</span>;
}

export default function PatroaiLanding() {
  usePatroaiSeo();

  const [prechatOpen, setPrechatOpen] = useState(false);
  const { locale, setLocale, ttsLocale } = useLandingLocale();

  const copy = PATROAI_PAGE_COPY[locale] || PATROAI_PAGE_COPY.pt;
  const heroSubtitle = useMemo(() => copy.hero.subtitle, [copy.hero.subtitle]);
  const orkioSpeech = useMemo(() => copy.orkioSpeech, [copy.orkioSpeech]);

  function handleLogin() {
    safeNavigateToAuth({ mode: "login", source: "patroai_landing", lang: locale });
  }

  function handleDemo() {
    safeNavigateToAuth({ mode: "register", source: "patroai_demo", lang: locale });
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
      lang: locale,
    });
  }

  return (
    <main className="patroai-page">
      <style>{`
        .patroai-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 0%, rgba(34,197,94,.10), transparent 26%),
            radial-gradient(circle at 78% 8%, rgba(245,158,11,.16), transparent 28%),
            linear-gradient(180deg, #030711 0%, #071019 52%, #04070d 100%);
          color: #f8fafc;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          overflow-x: hidden;
        }

        .patroai-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .patroai-header {
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(18px);
          background: rgba(3, 7, 18, .78);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .patroai-header-inner {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .patroai-logo-wrap {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .patroai-logo-img {
          width: 54px;
          height: 54px;
          object-fit: contain;
          border-radius: 18px;
          box-shadow: 0 16px 40px rgba(0,0,0,.28);
        }

        .patroai-logo-text {
          display: grid;
          gap: 2px;
          line-height: 1;
        }

        .patroai-logo-text strong {
          font-size: 18px;
          letter-spacing: .04em;
          color: #facc15;
        }

        .patroai-logo-text span {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: rgba(255,255,255,.72);
        }

        .patroai-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          color: rgba(255,255,255,.75);
          font-size: 14px;
        }

        .patroai-nav a {
          color: inherit;
          text-decoration: none;
          font-weight: 700;
        }

        .patroai-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patroai-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color: #fff;
          font-weight: 850;
          text-decoration: none;
          cursor: pointer;
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .patroai-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(250,204,21,.45);
          background: rgba(255,255,255,.10);
        }

        .patroai-btn.primary {
          color: #111827;
          background: linear-gradient(135deg, #fff7cc, #facc15 58%, #d97706);
          border-color: rgba(250,204,21,.42);
          box-shadow: 0 14px 36px rgba(250,204,21,.18);
        }

        .patroai-hero {
          padding: clamp(58px, 8vw, 112px) 0 52px;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr);
          gap: clamp(30px, 5vw, 74px);
          align-items: center;
        }

        .patroai-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #86efac;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.24);
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .patroai-hero h1 {
          margin: 24px 0 18px;
          font-size: clamp(44px, 8vw, 86px);
          line-height: .92;
          letter-spacing: -.075em;
          max-width: 820px;
        }

        .patroai-hero h1 span {
          background: linear-gradient(135deg, #fef3c7 0%, #facc15 38%, #67e8f9 86%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .patroai-subtitle {
          max-width: 720px;
          color: rgba(255,255,255,.76);
          font-size: clamp(17px, 2vw, 21px);
          line-height: 1.66;
        }

        .patroai-hero-cta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .patroai-trust {
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,.74);
          font-size: 14px;
          font-weight: 700;
        }

        .premium-mark {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #facc15;
          background: rgba(250,204,21,.10);
          border: 1px solid rgba(250,204,21,.24);
          flex: 0 0 auto;
        }

        .orkio-card {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          padding: 28px;
          border: 1px solid rgba(255,255,255,.12);
          background:
            radial-gradient(circle at 50% 24%, rgba(250,204,21,.18), transparent 34%),
            linear-gradient(180deg, rgba(15,23,42,.92), rgba(2,6,23,.94));
          box-shadow: 0 34px 100px rgba(0,0,0,.38);
        }

        .orkio-card::before {
          content: "";
          position: absolute;
          inset: -40%;
          background: conic-gradient(from 180deg, transparent, rgba(250,204,21,.16), transparent, rgba(34,197,94,.12), transparent);
          animation: spin 18s linear infinite;
          opacity: .58;
        }

        .orkio-card-inner {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 20px;
          justify-items: center;
          text-align: center;
        }

        .orkio-avatar {
          width: min(320px, 80vw);
          aspect-ratio: 1;
          border-radius: 999px;
          background:
            radial-gradient(circle at 48% 45%, rgba(250,204,21,.38), transparent 34%),
            radial-gradient(circle at 50% 50%, rgba(34,197,94,.16), transparent 62%);
          border: 1px solid rgba(250,204,21,.22);
          display: grid;
          place-items: center;
          box-shadow: inset 0 0 80px rgba(250,204,21,.12), 0 24px 72px rgba(0,0,0,.34);
        }

        .orkio-avatar video,
        .orkio-avatar img {
          width: 84%;
          height: 84%;
          object-fit: cover;
          object-position: 74% center;
          border-radius: 999px;
          display: block;
          box-shadow: 0 24px 64px rgba(0,0,0,.32);
        }

        .patroai-section {
          padding: 54px 0;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }

        .process-card,
        .service-card,
        .orkio-benefit {
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.055);
          padding: 20px;
          box-shadow: 0 18px 46px rgba(0,0,0,.20);
        }

        .process-card strong {
          color: #facc15;
          font-size: 13px;
          letter-spacing: .12em;
        }

        .process-card h3,
        .service-card h3 {
          margin: 12px 0 8px;
          font-size: 18px;
          letter-spacing: -.025em;
        }

        .process-card p,
        .service-card p {
          margin: 0;
          color: rgba(255,255,255,.68);
          line-height: 1.55;
          font-size: 14px;
        }

        .section-heading {
          max-width: 780px;
          margin-bottom: 24px;
        }

        .section-heading span {
          color: #facc15;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .16em;
        }

        .section-heading h2 {
          margin: 12px 0;
          font-size: clamp(30px, 5vw, 54px);
          line-height: 1.02;
          letter-spacing: -.055em;
        }

        .section-heading p {
          color: rgba(255,255,255,.72);
          line-height: 1.68;
          font-size: 17px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .service-icon {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: #facc15;
          background: rgba(250,204,21,.10);
          border: 1px solid rgba(250,204,21,.18);
          margin-bottom: 16px;
        }

        .orkio-section {
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(320px, 1.05fr);
          gap: 36px;
          align-items: center;
          border-radius: 34px;
          border: 1px solid rgba(255,255,255,.10);
          background: linear-gradient(135deg, rgba(15,23,42,.84), rgba(2,6,23,.92));
          padding: clamp(24px, 5vw, 46px);
        }

        .orkio-benefits {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 22px;
        }

        .orkio-benefit {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          color: rgba(255,255,255,.82);
        }

        .patroai-footer {
          padding: 34px 0 46px;
          color: rgba(255,255,255,.58);
          font-size: 14px;
          border-top: 1px solid rgba(255,255,255,.08);
          margin-top: 42px;
        }

        .patroai-footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 980px) {
          .patroai-nav {
            display: none;
          }

          .patroai-hero,
          .orkio-section {
            grid-template-columns: 1fr;
          }

          .process-grid,
          .services-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .patroai-shell {
            width: min(100% - 22px, 1180px);
          }

          .patroai-header-inner {
            min-height: 72px;
          }

          .patroai-actions .patroai-btn:not(.primary) {
            display: none;
          }

          .patroai-logo-text {
            display: none;
          }

          .patroai-hero {
            padding-top: 38px;
          }

          .process-grid,
          .services-grid,
          .orkio-benefits {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header className="patroai-header">
        <div className="patroai-shell patroai-header-inner">
          <button
            type="button"
            className="patroai-logo-wrap"
            onClick={() => navigateTo(`${ROUTES.patroai}?lang=${locale}`)}
            aria-label={copy.brandAria}
          >
            <PatroaiLogo />
          </button>

          <nav className="patroai-nav" aria-label={copy.navAria}>
            <a href="#solutions">{copy.nav.solutions}</a>
            <a href="#orkio">{copy.nav.orkio}</a>
            <a href="#method">{copy.nav.resources}</a>
            <a href="#about">{copy.nav.about}</a>
          </nav>

          <div className="patroai-actions">
            <LandingLanguageSwitch value={locale} onChange={setLocale} />
            <button className="patroai-btn" type="button" onClick={() => navigateTo(ROUTES.admin)}>
              {copy.actions.admin}
            </button>
            <button className="patroai-btn" type="button" onClick={handleLogin}>
              {copy.actions.login}
            </button>
            <button className="patroai-btn primary" type="button" onClick={handleDemo}>
              {copy.actions.demo}
            </button>
          </div>
        </div>
      </header>

      <section className="patroai-shell patroai-hero" id="about">
        <div>
          <div className="patroai-kicker">
            <PremiumMark icon="✦" />
            {copy.hero.kicker}
          </div>

          <h1>
            {copy.hero.titleBefore} <span>{copy.hero.titleHighlight}</span>
          </h1>

          <p className="patroai-subtitle">{heroSubtitle}</p>

          <div className="patroai-hero-cta">
            <button className="patroai-btn primary" type="button" onClick={handleDemo}>
              {copy.hero.primary}
            </button>
            <button className="patroai-btn" type="button" onClick={handleStartAvatarJourney}>
              {copy.hero.secondary}
            </button>
          </div>

          <div className="patroai-trust">
            <PremiumMark icon="✓" />
            {copy.hero.trust}
          </div>
        </div>

        <aside className="orkio-card" aria-label={copy.orkioSection.avatarLabel}>
          <div className="orkio-card-inner">
            <div className="orkio-avatar">
              <video
                src="/patroai-assets/orkio-mindpulse-male.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Orkio"
              />
            </div>
          </div>
        </aside>
      </section>

      <section className="patroai-shell patroai-section" id="method" aria-label={copy.processAria}>
        <div className="process-grid">
          {copy.processSteps.map((step) => (
            <article className="process-card" key={`${step.number}-${step.title}`}>
              <strong>{step.number}</strong>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="patroai-shell patroai-section" id="solutions">
        <div className="section-heading">
          <span>{copy.servicesIntro.label}</span>
          <h2>{copy.servicesIntro.title}</h2>
          <p>{copy.servicesIntro.text}</p>
        </div>

        <div className="services-grid">
          {copy.services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-icon">✦</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="patroai-shell patroai-section" id="orkio">
        <div className="orkio-section">
          <div>
            <div className="section-heading">
              <span>{copy.orkioSection.label}</span>
              <h2>{copy.orkioSection.title}</h2>
              <p>{copy.orkioSection.text}</p>
            </div>

            <div className="patroai-hero-cta">
              <button
                className="patroai-btn primary"
                type="button"
                onClick={() => navigateTo(`${ROUTES.orkioOS}?lang=${locale}`)}
              >
                {copy.orkioSection.primary}
              </button>
              <button className="patroai-btn" type="button" onClick={handleStartAvatarJourney}>
                {copy.orkioSection.secondary}
              </button>
            </div>
          </div>

          <div className="orkio-benefits">
            {copy.orkioBenefits.map(([icon, label]) => (
              <div className="orkio-benefit" key={label}>
                <PremiumMark icon="✓" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="patroai-footer">
        <div className="patroai-shell patroai-footer-inner">
          <span>{copy.footer.text}</span>
          <span>{copy.footer.rights}</span>
        </div>
      </footer>

      <AvatarPrechatModal
        open={prechatOpen}
        isOpen={prechatOpen}
        locale={locale}
        ttsLocale={ttsLocale}
        introText={orkioSpeech}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
      />
    </main>
  );
}
