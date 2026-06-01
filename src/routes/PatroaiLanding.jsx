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
const ORKIO_VIDEO = "/patroai-assets/orkio-mindpulse-male.mp4";

const PATROAI_PAGE_COPY = {
  pt: {
    navAria: "Navegação principal",
    brandAria: "Ir para PatroAI",
    nav: {
      solutions: "Soluções",
      orkio: "Orkio",
      resources: "ESG & Método",
      about: "Sobre",
    },
    actions: {
      admin: "Admin",
      login: "Login",
      demo: "Agendar demonstração →",
    },
    hero: {
      kicker: "Startups • Outsourcing • IA para empresas • ESG",
      titleBefore: "Resolvemos as dores do seu negócio com",
      titleHighlight: "IA e ESG.",
      subtitle:
        "A PatroAI cria startups, produtos digitais, verticais inteligentes e agentes de IA para empresas em formação ou já consolidadas. Nosso foco é entender as dores reais do negócio, transformar processos em operação inteligente e orientar a evolução com governança, rastreabilidade e visão ESG.",
      primary: "Conhecer a PatroAI →",
      secondary: "Falar com Orkio",
      trust:
        "Estratégia, tecnologia, inteligência artificial e consultoria especializada para gerar clareza, eficiência e impacto responsável.",
    },
    orkioSpeech:
      "Olá. Eu sou Orkio. Posso mostrar como a PatroAI resolve dores do negócio com inteligência artificial, estrutura startups, cria verticais como a Arquitech e organiza decisões com governança, rastreabilidade e visão ESG.",
    processAria: "Como atuamos",
    processSteps: [
      {
        number: "01",
        title: "Diagnosticar",
        text: "Mapeamos dores, gargalos, riscos, processos, oportunidades e impacto esperado para o negócio.",
        icon: "search",
      },
      {
        number: "02",
        title: "Priorizar",
        text: "Separarmos sintoma de causa raiz e definimos o menor caminho entre problema, tecnologia, retorno e responsabilidade ESG.",
        icon: "plan",
      },
      {
        number: "03",
        title: "Construir",
        text: "Desenvolvemos plataformas, automações, agentes de IA, produtos digitais e operações sob medida.",
        icon: "code",
      },
      {
        number: "04",
        title: "Implantar",
        text: "Colocamos a solução em funcionamento com documentação, governança, rastreabilidade e clareza operacional.",
        icon: "rocket",
      },
      {
        number: "05",
        title: "Evoluir",
        text: "Acompanhamos a operação com consultores especializados, melhoria contínua, dados e visão sustentável de longo prazo.",
        icon: "growth",
      },
    ],
    servicesIntro: {
      label: "O que fazemos",
      title:
        "Criamos startups, implantamos IA em empresas consolidadas e resolvemos dores do negócio com visão ESG.",
      text:
        "A PatroAI atua em duas frentes: criação de novos negócios digitais em modelo startup outsourcing e evolução de empresas já existentes com inteligência artificial aplicada. Elaboramos business plans, estudos de viabilidade econômico-financeira, arquitetura de produto, agentes personalizados, automações, SaaS, implantação, governança e acompanhamento consultivo. ESG entra como critério de decisão: eficiência com responsabilidade, rastreabilidade, impacto e clareza para stakeholders.",
    },
    services: [
      {
        title: "Startup Outsourcing Premium",
        text:
          "Desenvolvemos startups, produtos digitais e novas operações desde a concepção estratégica até implantação, tecnologia, governança e operação assistida.",
        icon: "target",
      },
      {
        title: "IA para Empresas Consolidadas",
        text:
          "Apoiamos empresas que já possuem operação, equipe, clientes e processos, levando IA para atendimento, vendas, gestão, documentação, análise e tomada de decisão.",
        icon: "brain",
      },
      {
        title: "Dores do Negócio + ESG",
        text:
          "Mapeamos gargalos reais e priorizamos soluções com impacto operacional, rastreabilidade, redução de desperdícios, governança e responsabilidade social e ambiental.",
        icon: "leaf",
      },
      {
        title: "Business Plan & Viabilidade",
        text:
          "Estruturamos modelos de negócio, projeções financeiras e estudos de viabilidade econômico-financeira para decisões mais seguras.",
        icon: "system",
      },
      {
        title: "Tecnologia, SaaS & Agentes de IA",
        text:
          "Criamos plataformas, automações e agentes de IA personalizados, com possibilidade de comercialização da plataforma em modelo SaaS para empresas em operação.",
        icon: "gear",
      },
      {
        title: "Vertical Arquitech",
        text:
          "A Arquitech é uma vertical PatroAI para arquitetura assistida por IA, organizada em torno da ARIA, superagente dedicada a briefing, escopo, riscos, propostas, cronogramas e decisões de projeto.",
        icon: "architecture",
      },
    ],
    esgSection: {
      label: "ESG aplicado ao negócio",
      title: "ESG não como discurso: como critério de decisão, eficiência e confiança.",
      text:
        "A PatroAI usa IA e governança para ajudar empresas a resolver problemas reais sem perder responsabilidade. Isso significa melhorar processos, reduzir desperdícios, organizar documentação, dar transparência às decisões, qualificar dados e criar operações mais conscientes para clientes, equipes, investidores e parceiros.",
      items: [
        "Eficiência operacional com redução de retrabalho e desperdício",
        "Governança, documentação e rastreabilidade das decisões",
        "Tecnologia aplicada com responsabilidade e clareza para stakeholders",
      ],
    },
    orkioSection: {
      label: "Conheça Orkio",
      title: "Conheça Orkio, a inteligência operacional da PatroAI.",
      text:
        "Orkio é nossa inteligência operacional para diagnóstico, clareza executiva e próximos passos. Ele apoia fundadores, empresas e consultores na leitura do contexto, na organização das decisões e na evolução da operação com IA, governança e visão ESG.",
      primary: "Explorar Orkio OS →",
      secondary: "Conversar com Orkio",
      avatarLabel: "Orkio — presença místico-tecnológica da PatroAI",
      avatarTitle: "Presença de Orkio",
      avatarText:
        "Avatar místico-tecnológico preparado para voz, texto, diagnóstico guiado e continuidade contextual.",
    },
    orkioBenefits: [
      ["search", "Entende as dores do negócio"],
      ["voice", "Responde por voz e texto"],
      ["brain", "Gera insights e recomendações"],
      ["gear", "Acompanha evolução com governança"],
    ],
    footer: {
      text:
        "PatroAI Consultech · Startups, outsourcing, IA para empresas, verticais inteligentes, ESG, governança e rastreabilidade.",
      rights: "© 2026 PatroAI. Todos os direitos reservados.",
    },
  },

  en: {
    navAria: "Main navigation",
    brandAria: "Go to PatroAI",
    nav: {
      solutions: "Solutions",
      orkio: "Orkio",
      resources: "ESG & Method",
      about: "About",
    },
    actions: {
      admin: "Admin",
      login: "Login",
      demo: "Schedule a demo →",
    },
    hero: {
      kicker: "Startups • Outsourcing • AI for companies • ESG",
      titleBefore: "We solve your business pains with",
      titleHighlight: "AI and ESG.",
      subtitle:
        "PatroAI creates startups, digital products, intelligent verticals and AI agents for companies that are being formed or already consolidated. Our focus is to understand real business pains, transform processes into intelligent operations and guide evolution with governance, traceability and an ESG perspective.",
      primary: "Discover PatroAI →",
      secondary: "Talk to Orkio",
      trust:
        "Strategy, technology, artificial intelligence and specialized consulting to generate clarity, efficiency and responsible impact.",
    },
    orkioSpeech:
      "Hello. I am Orkio. I can show how PatroAI solves business pains with artificial intelligence, structures startups, creates verticals such as Arquitech and organizes decisions with governance, traceability and an ESG perspective.",
    processAria: "How we work",
    processSteps: [
      {
        number: "01",
        title: "Diagnose",
        text: "We map pains, bottlenecks, risks, processes, opportunities and expected impact for the business.",
        icon: "search",
      },
      {
        number: "02",
        title: "Prioritize",
        text: "We separate symptom from root cause and define the shortest path between problem, technology, return and ESG responsibility.",
        icon: "plan",
      },
      {
        number: "03",
        title: "Build",
        text: "We develop platforms, automations, AI agents, digital products and tailored operations.",
        icon: "code",
      },
      {
        number: "04",
        title: "Deploy",
        text: "We put the solution into operation with documentation, governance, traceability and operational clarity.",
        icon: "rocket",
      },
      {
        number: "05",
        title: "Evolve",
        text: "We support the operation with specialized consultants, continuous improvement, data and a sustainable long-term vision.",
        icon: "growth",
      },
    ],
    servicesIntro: {
      label: "What we do",
      title:
        "We create startups, implement AI in established companies and solve business pains with an ESG perspective.",
      text:
        "PatroAI works on two fronts: creating new digital businesses through startup outsourcing and evolving existing companies with applied artificial intelligence. We build business plans, financial feasibility studies, product architecture, personalized agents, automations, SaaS, deployment, governance and consultative support. ESG works as a decision criterion: efficiency with responsibility, traceability, impact and clarity for stakeholders.",
    },
    services: [
      {
        title: "Premium Startup Outsourcing",
        text:
          "We develop startups, digital products and new operations from strategic conception to deployment, technology, governance and assisted operations.",
        icon: "target",
      },
      {
        title: "AI for Established Companies",
        text:
          "We support companies that already have operations, teams, clients and processes, bringing AI into service, sales, management, documentation, analysis and decision-making.",
        icon: "brain",
      },
      {
        title: "Business Pains + ESG",
        text:
          "We map real bottlenecks and prioritize solutions with operational impact, traceability, waste reduction, governance and social and environmental responsibility.",
        icon: "leaf",
      },
      {
        title: "Business Plan & Feasibility",
        text:
          "We structure business models, financial projections and feasibility studies to support safer decisions.",
        icon: "system",
      },
      {
        title: "Technology, SaaS & AI Agents",
        text:
          "We create platforms, automations and personalized AI agents, with the possibility of commercializing the platform as SaaS for companies already in operation.",
        icon: "gear",
      },
      {
        title: "Arquitech Vertical",
        text:
          "Arquitech is a PatroAI vertical for AI-assisted architecture, organized around ARIA, a dedicated superagent for briefings, scopes, risks, proposals, schedules and project decisions.",
        icon: "architecture",
      },
    ],
    esgSection: {
      label: "ESG applied to business",
      title: "ESG not as discourse: as a criterion for decision, efficiency and trust.",
      text:
        "PatroAI uses AI and governance to help companies solve real problems without losing responsibility. This means improving processes, reducing waste, organizing documentation, bringing transparency to decisions, qualifying data and creating more conscious operations for clients, teams, investors and partners.",
      items: [
        "Operational efficiency with reduced rework and waste",
        "Governance, documentation and traceability of decisions",
        "Responsible technology with stakeholder clarity",
      ],
    },
    orkioSection: {
      label: "Meet Orkio",
      title: "Meet Orkio, PatroAI's operational intelligence.",
      text:
        "Orkio is our operational intelligence for diagnosis, executive clarity and next steps. It supports founders, companies and consultants in understanding context, organizing decisions and evolving operations with AI, governance and an ESG perspective.",
      primary: "Explore Orkio OS →",
      secondary: "Talk to Orkio",
      avatarLabel: "Orkio — PatroAI's mystic-technological presence",
      avatarTitle: "Orkio's presence",
      avatarText:
        "Mystic-technological avatar prepared for voice, text, guided diagnosis and contextual continuity.",
    },
    orkioBenefits: [
      ["search", "Understands business pains"],
      ["voice", "Responds by voice and text"],
      ["brain", "Generates insights and recommendations"],
      ["gear", "Follows evolution with governance"],
    ],
    footer: {
      text:
        "PatroAI Consultech · Startups, outsourcing, AI for companies, intelligent verticals, ESG, governance and traceability.",
      rights: "© 2026 PatroAI. All rights reserved.",
    },
  },
};

function rememberAppRedirect() {
  try {
    window.localStorage?.setItem("post_auth_redirect", ROUTES.app);
    window.sessionStorage?.setItem("post_auth_redirect", ROUTES.app);
  } catch {
    // Navegação deve continuar mesmo se storage estiver indisponível.
  }
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
    <div className="patroai-logo-wrap-inner">
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
  return (
    <span className="premium-mark" aria-hidden="true">
      {icon}
    </span>
  );
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
            radial-gradient(circle at 8% 0%, rgba(34,197,94,.12), transparent 28%),
            radial-gradient(circle at 78% 8%, rgba(245,158,11,.16), transparent 30%),
            radial-gradient(circle at 50% 54%, rgba(14,165,233,.08), transparent 34%),
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

        .patroai-logo-button,
        .patroai-logo-wrap {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          padding: 0;
        }

        .patroai-logo-wrap-inner {
          display: inline-flex;
          align-items: center;
          gap: 12px;
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
          text-align: left;
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
          font-weight: 750;
        }

        .patroai-nav a:hover {
          color: #facc15;
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
          white-space: nowrap;
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

        .patroai-kicker,
        .esg-pill {
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
          max-width: 860px;
        }

        .patroai-hero h1 span,
        .section-heading h2 span {
          background: linear-gradient(135deg, #fef3c7 0%, #facc15 38%, #67e8f9 86%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .patroai-subtitle {
          max-width: 760px;
          color: rgba(255,255,255,.78);
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
          width: 82%;
          height: 82%;
          object-fit: cover;
          object-position: center center;
          border-radius: 999px;
          display: block;
          box-shadow: 0 24px 64px rgba(0,0,0,.32);
        }

        .orkio-avatar-copy {
          max-width: 360px;
          color: rgba(255,255,255,.72);
          line-height: 1.55;
          margin: 0;
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
        .orkio-benefit,
        .esg-card {
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
        .service-card h3,
        .esg-card h3 {
          margin: 12px 0 8px;
          font-size: 18px;
          letter-spacing: -.025em;
        }

        .process-card p,
        .service-card p,
        .esg-card p {
          margin: 0;
          color: rgba(255,255,255,.68);
          line-height: 1.55;
          font-size: 14px;
        }

        .section-heading {
          max-width: 860px;
          margin-bottom: 24px;
        }

        .section-heading > span {
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
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

        .esg-section {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(320px, 1.1fr);
          gap: 28px;
          align-items: stretch;
          border-radius: 34px;
          border: 1px solid rgba(34,197,94,.20);
          background:
            radial-gradient(circle at 0% 0%, rgba(34,197,94,.16), transparent 32%),
            linear-gradient(135deg, rgba(6,78,59,.34), rgba(2,6,23,.92));
          padding: clamp(24px, 5vw, 46px);
          box-shadow: 0 28px 78px rgba(0,0,0,.26);
        }

        .esg-panel {
          display: grid;
          gap: 14px;
        }

        .esg-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255,255,255,.07);
        }

        .esg-card .premium-mark {
          width: 30px;
          height: 30px;
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
          .orkio-section,
          .esg-section {
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

          .patroai-hero h1 {
            letter-spacing: -.055em;
          }
        }
      `}</style>

      <header className="patroai-header">
        <div className="patroai-shell patroai-header-inner">
          <button
            type="button"
            className="patroai-logo-button"
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
                src={ORKIO_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                aria-label="Orkio"
              />
            </div>
            <p className="orkio-avatar-copy">{copy.orkioSection.avatarText}</p>
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

      <section className="patroai-shell patroai-section" aria-label={copy.esgSection.label}>
        <div className="esg-section">
          <div className="section-heading">
            <span>{copy.esgSection.label}</span>
            <h2>{copy.esgSection.title}</h2>
            <p>{copy.esgSection.text}</p>
          </div>

          <div className="esg-panel">
            {copy.esgSection.items.map((item) => (
              <article className="esg-card" key={item}>
                <PremiumMark icon="✓" />
                <p>{item}</p>
              </article>
            ))}
          </div>
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

