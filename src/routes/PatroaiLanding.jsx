import React, { useMemo, useState } from "react";
import AvatarHero3D from "../components/AvatarHero3D.jsx";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";
import PremiumIcon from "../components/PremiumIcon.jsx";
import OrkioMysticAvatar from "../components/OrkioMysticAvatar.jsx";
import LegalFooter from "../components/LegalFooter.jsx";
import LandingLanguageSwitch from "../components/LandingLanguageSwitch.jsx";
import { useLandingLocale } from "../lib/landingLocale.js";

/**
 * PATROAI CONSULTECH — LANDING INSTITUCIONAL PREMIUM
 *
 * Rota atual preservada:
 * /        → PatroaiLanding
 * /patroai → PatroaiLanding
 * /orkio   → Landing / Orkio OS
 *
 * AO-05 — Internacionalização PT/EN:
 * - Adiciona seleção visível de idioma no header.
 * - Mantém português como padrão.
 * - Sincroniza copy da landing com voz/TTS de Orkio.
 */

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
      orkio: "PlataformOrkio",
      resources: "Recursos",
      about: "Sobre nós",
    },
    actions: {
      admin: "Admin",
      login: "Login",
      demo: "Agendar demonstração →",
    },
    hero: {
      kicker: "Consultoria • Tecnologia • IA • Execução",
      titleBefore: "Criamos sistemas inteligentes para empresas que querem evoluir com",
      titleHighlight: "clareza, estratégia e execução.",
      subtitle:
        "A PatroAI Consultech une consultoria estratégica, desenvolvimento de sistemas, automação e agentes de IA personalizados para transformar desafios empresariais em processos inteligentes, governáveis e escaláveis.",
      primary: "Conhecer a PatroAI →",
      secondary: "Falar com Orkio",
      trust: "Segurança, privacidade e governança em cada etapa.",
    },
    orkioSpeech:
      "Olá. Eu sou Orkio. Posso mostrar como a PatroAI transforma processos, sistemas e inteligência artificial em evolução real para empresas, com clareza, estratégia, governança e execução.",
    processAria: "Como atuamos",
    processSteps: [
      {
        number: "01",
        title: "Diagnosticar",
        text: "Entendemos o negócio, desafios e oportunidades.",
        icon: "search",
      },
      {
        number: "02",
        title: "Planejar",
        text: "Definimos estratégia, prioridades e arquitetura.",
        icon: "plan",
      },
      {
        number: "03",
        title: "Construir",
        text: "Desenvolvemos soluções sob medida e inteligentes.",
        icon: "code",
      },
      {
        number: "04",
        title: "Implantar",
        text: "Colocamos em produção com segurança e qualidade.",
        icon: "rocket",
      },
      {
        number: "05",
        title: "Evoluir",
        text: "Acompanhamos, otimizamos e ampliamos resultados.",
        icon: "growth",
      },
    ],
    servicesIntro: {
      label: "O que fazemos",
      title: "Soluções que geram clareza, eficiência e evolução contínua.",
      text:
        "A PatroAI não entrega apenas tecnologia. Entrega continuidade operacional: entendemos o negócio, desenhamos a solução, construímos o sistema, implantamos com clareza e acompanhamos a evolução.",
    },
    services: [
      {
        title: "Consultoria Estratégica",
        text: "Mapeamos dores, oportunidades e prioridades para estruturar caminhos claros de evolução.",
        icon: "target",
      },
      {
        title: "Desenvolvimento de Sistemas",
        text: "Criamos soluções digitais sob medida para organizar processos, dados e operações.",
        icon: "system",
      },
      {
        title: "Agentes de IA Personalizados",
        text: "Construímos agentes inteligentes adaptados ao contexto, linguagem e objetivos de cada negócio.",
        icon: "brain",
      },
      {
        title: "Automação e Governança",
        text: "Conectamos tecnologia, controle e execução para reduzir fricção e aumentar eficiência.",
        icon: "gear",
      },
    ],
    orkioSection: {
      label: "Conheça Orkio",
      title: "Conheça Orkio, a inteligência operacional da PatroAI.",
      text:
        "Orkio é nossa assistente de IA que entende o contexto do seu negócio, responde suas perguntas, orienta decisões e acelera a execução com inteligência e precisão.",
      primary: "Explorar Orkio OS →",
      secondary: "Conversar com Orkio",
      avatarLabel: "Orkio — presença místico-tecnológica da PatroAI",
      avatarTitle: "Presença de Orkio",
      avatarText: "Avatar místico-tecnológico preparado para voz, texto e diagnóstico guiado.",
    },
    orkioBenefits: [
      ["search", "Entende seu negócio"],
      ["voice", "Responde por voz e texto"],
      ["brain", "Gera insights e recomendações"],
      ["gear", "Acompanha e evolui com você"],
    ],
    footer: {
      text: "PatroAI Consultech · Sistemas inteligentes, agentes de IA personalizados e execução com governança.",
      rights: "© 2026 PatroAI. Todos os direitos reservados.",
    },
  },
  en: {
    navAria: "Main navigation",
    brandAria: "Go to PatroAI",
    nav: {
      solutions: "Solutions",
      orkio: "Orkio Platform",
      resources: "Features",
      about: "About us",
    },
    actions: {
      admin: "Admin",
      login: "Login",
      demo: "Schedule a demo →",
    },
    hero: {
      kicker: "Consulting • Technology • AI • Execution",
      titleBefore: "We create intelligent systems for companies that want to evolve with",
      titleHighlight: "clarity, strategy and execution.",
      subtitle:
        "PatroAI Consultech combines strategic consulting, software development, automation and personalized AI agents to turn business challenges into intelligent, governable and scalable processes.",
      primary: "Discover PatroAI →",
      secondary: "Talk tOrkio",
      trust: "Security, privacy and governance at every step.",
    },
    orkioSpeech:
      "Hello. I am Orkio. I can show how PatroAI turns processes, systems and artificial intelligence into real company evolution, with clarity, strategy, governance and execution.",
    processAria: "How we work",
    processSteps: [
      {
        number: "01",
        title: "Diagnose",
        text: "We understand the business, challenges and opportunities.",
        icon: "search",
      },
      {
        number: "02",
        title: "Plan",
        text: "We define strategy, priorities and architecture.",
        icon: "plan",
      },
      {
        number: "03",
        title: "Build",
        text: "We develop tailored and intelligent solutions.",
        icon: "code",
      },
      {
        number: "04",
        title: "Deploy",
        text: "We put solutions into production with safety and quality.",
        icon: "rocket",
      },
      {
        number: "05",
        title: "Evolve",
        text: "We monitor, optimize and expand results.",
        icon: "growth",
      },
    ],
    servicesIntro: {
      label: "What we do",
      title: "Solutions that create clarity, efficiency and continuous evolution.",
      text:
        "PatroAI does not deliver technology alone. It delivers operational continuity: we understand the business, design the solution, build the system, deploy with clarity and follow the evolution.",
    },
    services: [
      {
        title: "Strategic Consulting",
        text: "We map pains, opportunities and priorities to structure clear paths of evolution.",
        icon: "target",
      },
      {
        title: "Software Development",
        text: "We create tailored digital solutions to organize processes, data and operations.",
        icon: "system",
      },
      {
        title: "Personalized AI Agents",
        text: "We build intelligent agents adapted to each business context, language and goals.",
        icon: "brain",
      },
      {
        title: "Automation and Governance",
        text: "We connect technology, control and execution to reduce friction and increase efficiency.",
        icon: "gear",
      },
    ],
    orkioSection: {
      label: "Meet Orkio",
      title: "Meet Orkio, PatroAI's operational intelligence.",
      text:
        "Orkio is our AI assistant that understands your business context, answers your questions, guides decisions and accelerates execution with intelligence and precision.",
      primary: "Explore Orkio OS →",
      secondary: "Talk tOrkio",
      avatarLabel: "Orkio — PatroAI's mystic-technological presence",
      avatarTitle: "Orkio's presence",
      avatarText: "Mystic-technological avatar prepared for voice, text and guided diagnosis.",
    },
    orkioBenefits: [
      ["search", "Understands your business"],
      ["voice", "Responds by voice and text"],
      ["brain", "Generates insights and recommendations"],
      ["gear", "Follows and evolves with you"],
    ],
    footer: {
      text: "PatroAI Consultech · Intelligent systems, personalized AI agents and execution with governance.",
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
    <div className={`patroai-logo ${compact ? "patroai-logo--compact" : ""}`}>
      <img
        src={src}
        alt="PatroAI Consultech"
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

export default function PatroaiLanding() {
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
    <div className="patroai-page">
      <LandingLanguageSwitch locale={locale} onChange={setLocale} />
      <style>{`
        .patroai-page {
          min-height: 100vh;
          overflow: hidden;
          color: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background:
            radial-gradient(900px 560px at 12% 0%, rgba(247,200,98,0.13), transparent 58%),
            radial-gradient(820px 560px at 92% 16%, rgba(247,200,98,0.10), transparent 52%),
            linear-gradient(180deg, #02060b 0%, #06111b 52%, #02060b 100%);
        }

        .patroai-page * {
          box-sizing: border-box;
        }

        .patroai-page button,
        .patroai-page a {
          -webkit-tap-highlight-color: transparent;
        }

        .patroai-shell {
          width: min(1560px, calc(100% - 40px));
          margin: 0 auto;
        }

        .patroai-topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(2,6,11,0.78);
          backdrop-filter: blur(22px);
        }

        .patroai-topbar__inner {
          min-height: 104px;
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
          width: 84px;
          height: 84px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(255,214,119,0.28);
          box-shadow: 0 0 26px rgba(247,200,98,0.24);
          background: #05070b;
        }

        .patroai-logo strong {
          display: block;
          font-size: 36px;
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .patroai-logo span {
          display: block;
          margin-top: 6px;
          color: #f7c862;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.34em;
        }

        .patroai-logo--compact img {
          width: 55px;
          height: 55px;
        }

        .patroai-logo--compact strong {
          font-size: 20px;
        }

        .patroai-logo--compact span {
          font-size: 9px;
        }

        .patroai-brand-button {
          appearance: none;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }

        .patroai-nav {
          display: flex;
          align-items: center;
          gap: clamp(18px, 3vw, 42px);
          color: rgba(255,255,255,0.86);
          font-size: 15px;
          font-weight: 750;
        }

        .patroai-nav a {
          color: inherit;
          text-decoration: none;
          transition: color 160ms ease;
        }

        .patroai-nav a:hover {
          color: #f7c862;
        }

        .patroai-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .patroai-button {
          border: 1px solid rgba(247,200,98,0.52);
          border-radius: 14px;
          padding: 14px 22px;
          background: linear-gradient(135deg, #ffe3a2 0%, #f7c862 52%, #b68023 100%);
          color: #080b11;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 18px 34px rgba(247,200,98,0.18);
          transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
        }

        .patroai-button:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
          box-shadow: 0 22px 46px rgba(247,200,98,0.24);
        }

        .patroai-button--ghost {
          color: #f8fafc;
          background: rgba(255,255,255,0.035);
          border-color: rgba(247,200,98,0.22);
          box-shadow: none;
        }

        .patroai-button--ghost:hover {
          background: rgba(247,200,98,0.08);
        }

        .patroai-button--admin {
          padding-inline: 16px;
          color: rgba(255,232,170,0.86);
        }

        .patroai-hero {
          position: relative;
          padding: 38px 0 24px;
          display: grid;
          grid-template-columns: minmax(320px, 0.85fr) minmax(700px, 1.7fr);
          gap: 30px;
          align-items: center;
        }

        .patroai-hero::before {
          content: "";
          position: absolute;
          inset: -16px -8vw auto -8vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(247,200,98,0.28), transparent);
        }

        .patroai-copy {
          position: relative;
          z-index: 3;
          min-width: 0;
        }

        .patroai-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #f7c862;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 20px;
        }

        .patroai-kicker::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #f7c862;
          box-shadow: 0 0 18px rgba(247,200,98,0.7);
        }

        .patroai-copy h1 {
          max-width: 590px;
          margin: 0;
          font-size: clamp(42px, 4.2vw, 70px);
          line-height: 1.02;
          letter-spacing: -0.07em;
          font-weight: 950;
        }

        .patroai-gradient-text {
          display: inline;
          color: #f7c862;
          text-shadow: 0 0 34px rgba(247,200,98,0.12);
        }

        .patroai-copy p {
          max-width: 560px;
          margin: 22px 0 0;
          color: rgba(248,250,252,0.72);
          font-size: 16px;
          line-height: 1.72;
        }

        .patroai-hero__cta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .patroai-trust {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          color: rgba(255,226,157,0.82);
          font-size: 14px;
          line-height: 1.4;
        }

        .patroai-trust svg {
          color: #f7c862;
          flex: 0 0 auto;
        }

        .patroai-stage {
          min-width: 0;
        }

        .patroai-process {
          margin-top: 12px;
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          border: 1px solid rgba(247,200,98,0.24);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025)),
            rgba(2,6,11,0.72);
          border-radius: 24px;
          box-shadow: 0 26px 70px rgba(0,0,0,0.32);
          overflow: hidden;
        }

        .patroai-step {
          position: relative;
          padding: 22px 20px;
          min-height: 124px;
        }

        .patroai-step:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          top: 24px;
          bottom: 24px;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(247,200,98,0.28), transparent);
        }

        .patroai-step__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .patroai-step small {
          color: #fff;
          font-weight: 950;
          font-size: 13px;
        }

        .patroai-step__icon,
        .patroai-card__icon,
        .patroai-orkio__icon {
          display: inline-grid;
          place-items: center;
          border-radius: 999px;
          color: #f7c862;
          border: 1px solid rgba(247,200,98,0.44);
          background: rgba(247,200,98,0.065);
          box-shadow: inset 0 0 24px rgba(247,200,98,0.04), 0 0 22px rgba(247,200,98,0.08);
        }

        .patroai-step__icon {
          width: 56px;
          height: 56px;
        }

        .patroai-step h3,
        .patroai-card h3 {
          margin: 0;
          color: rgba(255,255,255,0.94);
          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .patroai-step p,
        .patroai-card p {
          margin: 8px 0 0;
          color: rgba(248,250,252,0.64);
          font-size: 13px;
          line-height: 1.58;
        }

        .patroai-services {
          padding: 46px 0 30px;
          display: grid;
          grid-template-columns: minmax(280px, 0.72fr) minmax(520px, 1.28fr);
          gap: 38px;
          align-items: stretch;
        }

        .patroai-section-label {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: #f7c862;
          font-size: 13px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 22px;
        }

        .patroai-section-label::before {
          content: "";
          width: 22px;
          height: 2px;
          background: #f7c862;
          border-radius: 99px;
          box-shadow: 0 0 12px rgba(247,200,98,0.56);
        }

        .patroai-services__intro h2,
        .patroai-orkio h2 {
          margin: 0;
          color: #fff;
          font-size: clamp(32px, 3vw, 52px);
          line-height: 1.1;
          letter-spacing: -0.06em;
        }

        .patroai-services__intro p,
        .patroai-orkio p {
          margin: 18px 0 0;
          color: rgba(248,250,252,0.68);
          font-size: 15px;
          line-height: 1.75;
        }

        .patroai-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .patroai-card {
          position: relative;
          min-height: 228px;
          border-radius: 22px;
          border: 1px solid rgba(247,200,98,0.22);
          background:
            radial-gradient(220px 180px at 40% 0%, rgba(247,200,98,0.09), transparent 64%),
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025));
          padding: 24px;
          box-shadow: 0 20px 54px rgba(0,0,0,0.28);
          overflow: hidden;
        }

        .patroai-card::after {
          content: "";
          position: absolute;
          inset: auto -20% -42% 16%;
          height: 96px;
          background: radial-gradient(circle, rgba(247,200,98,0.18), transparent 62%);
          filter: blur(10px);
        }

        .patroai-card__icon {
          width: 58px;
          height: 58px;
          margin-bottom: 28px;
        }

        .patroai-orkio {
          padding: 20px 0 58px;
        }

        .patroai-orkio__inner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(320px, 0.9fr) minmax(360px, 1.1fr);
          gap: 30px;
          align-items: center;
          border-radius: 34px;
          border: 1px solid rgba(247,200,98,0.24);
          background:
            radial-gradient(680px 380px at 90% 110%, rgba(247,200,98,0.18), transparent 60%),
            radial-gradient(560px 320px at 20% 0%, rgba(255,255,255,0.06), transparent 60%),
            rgba(3,8,15,0.76);
          padding: 38px;
          overflow: hidden;
          box-shadow: 0 28px 80px rgba(0,0,0,0.34);
        }

        .patroai-orkio__inner::after {
          content: "";
          position: absolute;
          right: -90px;
          bottom: -120px;
          width: 520px;
          height: 220px;
          background:
            radial-gradient(circle, rgba(247,200,98,0.22) 0 1px, transparent 1.6px);
          background-size: 14px 14px;
          opacity: 0.5;
          transform: rotate(-8deg);
        }

        .patroai-orkio__content,
        .patroai-orkio__visual {
          position: relative;
          z-index: 2;
        }

        .patroai-orkio__visual {
          display: grid;
          align-items: stretch;
        }

        .patroai-orkio__inline-avatar {
          max-width: 440px;
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(247,200,98,0.18);
          border-radius: 26px;
          padding: 12px 14px;
          background: rgba(0,0,0,0.24);
          box-shadow: inset 0 0 38px rgba(247,200,98,0.04), 0 18px 48px rgba(0,0,0,0.22);
        }

        .patroai-orkio__inline-avatar span {
          display: block;
          color: rgba(248,250,252,0.70);
          font-size: 13px;
          line-height: 1.45;
          font-weight: 720;
        }

        .patroai-orkio__inline-avatar strong {
          display: block;
          margin-bottom: 4px;
          color: #f7c862;
          font-size: 12px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .patroai-orkio__grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .patroai-orkio__grid article {
          min-height: 142px;
          border-radius: 22px;
          border: 1px solid rgba(247,200,98,0.2);
          background: rgba(255,255,255,0.04);
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
        }

        .patroai-orkio__icon {
          width: 48px;
          height: 48px;
        }

        .patroai-orkio__grid strong {
          max-width: 180px;
          color: rgba(255,255,255,0.9);
          line-height: 1.32;
        }

        .patroai-footer {
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(2,6,11,0.82);
        }

        .patroai-footer__inner {
          min-height: 96px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: rgba(248,250,252,0.56);
          font-size: 13px;
          line-height: 1.5;
        }

        .patroai-footer__inner span:nth-child(2) {
          max-width: 620px;
        }

        @media (max-width: 1280px) {
          .patroai-hero {
            grid-template-columns: 1fr;
          }

          .patroai-copy {
            max-width: 900px;
          }

          .patroai-copy h1,
          .patroai-copy p {
            max-width: 820px;
          }

          .patroai-services {
            grid-template-columns: 1fr;
          }

          .patroai-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 980px) {
          .patroai-nav {
            display: none;
          }

          .patroai-actions {
            gap: 8px;
          }

          .patroai-actions .patroai-button--admin {
            display: none;
          }

          .patroai-process {
            grid-template-columns: 1fr;
          }

          .patroai-step:not(:last-child)::after {
            top: auto;
            right: 20px;
            left: 20px;
            bottom: 0;
            width: auto;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(247,200,98,0.28), transparent);
          }

          .patroai-orkio__inner,
          .patroai-orkio__visual {
            grid-template-columns: 1fr;
          }

          .patroai-orkio__inline-avatar {
            max-width: 100%;
          }
        }

        @media (max-width: 720px) {
          .patroai-shell {
            width: min(100% - 24px, 1560px);
          }

          .patroai-topbar__inner {
            min-height: 82px;
          }

          .patroai-logo img {
            width: 64px;
            height: 64px;
          }

          .patroai-logo strong {
            font-size: 22px;
          }

          .patroai-logo span {
            font-size: 9px;
          }

          .patroai-actions .patroai-button--ghost {
            display: none;
          }

          .patroai-button {
            padding: 12px 15px;
          }

          .patroai-hero {
            padding-top: 26px;
            gap: 20px;
          }

          .patroai-copy h1 {
            font-size: clamp(38px, 11.5vw, 54px);
          }

          .patroai-copy p {
            font-size: 15px;
          }

          .patroai-hero__cta {
            align-items: stretch;
            flex-direction: column;
          }

          .patroai-hero__cta .patroai-button {
            width: 100%;
          }

          .patroai-cards,
          .patroai-orkio__grid {
            grid-template-columns: 1fr;
          }

          .patroai-orkio__inner {
            padding: 24px;
            border-radius: 26px;
          }

          .patroai-footer__inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 24px 0;
          }
        }
      `}</style>

      <header className="patroai-topbar">
        <div className="patroai-shell patroai-topbar__inner">
          <button type="button" className="patroai-brand-button" onClick={() => navigateTo(`${ROUTES.patroai}?lang=${locale}`)} aria-label={copy.brandAria}>
            <PatroaiLogo />
          </button>

          <nav className="patroai-nav" aria-label={copy.navAria}>
            <a href="#solucoes">{copy.nav.solutions}</a>
            <a href={`${ROUTES.orkioOS}?lang=${locale}`}>{copy.nav.orkio}</a>
            <a href="#como-atuamos">{copy.nav.resources}</a>
            <a href="#sobre">{copy.nav.about}</a>
          </nav>

          <div className="patroai-actions">
<button type="button" className="patroai-button patroai-button--ghost patroai-button--admin" onClick={() => navigateTo(ROUTES.admin)}>
              {copy.actions.admin}
            </button>
            <button type="button" className="patroai-button patroai-button--ghost" onClick={handleLogin}>
              {copy.actions.login}
            </button>
            <button type="button" className="patroai-button" onClick={handleDemo}>
              {copy.actions.demo}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="patroai-shell patroai-hero">
          <div className="patroai-copy">
            <div className="patroai-kicker">{copy.hero.kicker}</div>

            <h1>
              {copy.hero.titleBefore} <span className="patroai-gradient-text">{copy.hero.titleHighlight}</span>
            </h1>

            <p>{heroSubtitle}</p>

            <div className="patroai-hero__cta">
              <button type="button" className="patroai-button" onClick={handleDemo}>
                {copy.hero.primary}
              </button>
              <button type="button" className="patroai-button patroai-button--ghost" onClick={handleStartAvatarJourney}>
                {copy.hero.secondary}
              </button>
            </div>

            <div className="patroai-trust">
              <PremiumIcon name="shield" size={22} />
              <span>{copy.hero.trust}</span>
            </div>
          </div>

          <div className="patroai-stage">
            <AvatarHero3D
              speech={orkioSpeech}
              locale={ttsLocale}
              onText={handleStartAvatarJourney}
              onDiagnosis={handleStartAvatarJourney}
            />
          </div>
        </section>

        <section id="como-atuamos" className="patroai-shell patroai-process" aria-label={copy.processAria}>
          {copy.processSteps.map((step) => (
            <article key={step.title} className="patroai-step">
              <div className="patroai-step__top">
                <small>{step.number}</small>
                <span className="patroai-step__icon">
                  <PremiumIcon name={step.icon} size={27} />
                </span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </section>

        <section id="solucoes" className="patroai-shell patroai-services">
          <div className="patroai-services__intro">
            <div className="patroai-section-label">{copy.servicesIntro.label}</div>
            <h2>{copy.servicesIntro.title}</h2>
            <p>{copy.servicesIntro.text}</p>
          </div>

          <div className="patroai-cards">
            {copy.services.map((service) => (
              <article key={service.title} className="patroai-card">
                <span className="patroai-card__icon">
                  <PremiumIcon name={service.icon} size={29} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="orkio" className="patroai-shell patroai-orkio">
          <div className="patroai-orkio__inner">
            <div className="patroai-orkio__content">
              <div className="patroai-section-label">{copy.orkioSection.label}</div>
              <h2>{copy.orkioSection.title}</h2>
              <p>{copy.orkioSection.text}</p>

              <div className="patroai-hero__cta">
                <button type="button" className="patroai-button" onClick={() => navigateTo(`${ROUTES.orkioOS}?lang=${locale}`)}>
                  {copy.orkioSection.primary}
                </button>
                <button type="button" className="patroai-button patroai-button--ghost" onClick={handleStartAvatarJourney}>
                  {copy.orkioSection.secondary}
                </button>
              </div>

              <div className="patroai-orkio__inline-avatar" aria-hidden="true">
                <OrkioMysticAvatar size={118} variant="portrait" label={copy.orkioSection.avatarLabel} />
                <span>
                  <strong>{copy.orkioSection.avatarTitle}</strong>
                  {copy.orkioSection.avatarText}
                </span>
              </div>
            </div>

            <div className="patroai-orkio__visual">
              <div className="patroai-orkio__grid">
                {copy.orkioBenefits.map(([icon, label]) => (
                  <article key={label}>
                    <span className="patroai-orkio__icon">
                      <PremiumIcon name={icon} size={24} />
                    </span>
                    <strong>{label}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <LegalFooter compact locale={locale} />

      <footer id="sobre" className="patroai-footer">
        <div className="patroai-shell patroai-footer__inner">
          <PatroaiLogo compact />
          <span>{copy.footer.text}</span>
          <span>{copy.footer.rights}</span>
        </div>
      </footer>

      <AvatarPrechatModal
        open={prechatOpen}
        locale={locale}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
      />
    </div>
  );
}
