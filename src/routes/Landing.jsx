import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../lib/auth.js";
import PublicChatWidget from "../ui/PublicChatWidget.jsx";
import Footer from "../ui/Footer.jsx";
import OrkioSphereMark from "../ui/OrkioSphereMark.jsx";

const COPY = {
  "pt-BR": {
    lang: "PT-BR",
    altLang: "EN-US",
    nav: ["Visão", "Integrações", "Governança", "ESG"],
    eyebrow: "Orkio OS · Tecnologia proprietária PatroAI",
    title: "O sistema operacional de inteligência empresarial.",
    subtitle:
      "O Orkio implanta uma camada de IA governável sobre a operação da empresa, conectando estratégia, dados, sistemas, automação e execução em um ecossistema contínuo.",
    primary: "Solicitar demonstração",
    secondary: "Entrar no Orkio",
    chips: ["IA auditável", "Multiagentes", "White label", "Integrações empresariais"],
    liveTitle: "Núcleo operacional vivo",
    liveCopy:
      "Diagnóstico, planejamento, execução assistida e aprendizado contínuo em uma experiência única para empresas que desejam evoluir com controle.",
    pillarsTitle: "Como o Orkio transforma a operação",
    pillars: [
      ["Diagnóstico inteligente", "Reconhece dores, gargalos e oportunidades a partir do contexto real do negócio."],
      ["Planejamento sustentável", "Estrutura cenários, metas e rotas de evolução de longo prazo com clareza executiva."],
      ["Execução assistida", "Coordena agentes, tarefas, fluxos e decisões com trilha de auditoria e controle humano."],
      ["Aprendizado contínuo", "Evolui com o uso, amadurecendo junto com a operação e os objetivos da empresa."],
    ],
    integrationTitle: "Conectado ao ecossistema da sua empresa.",
    integrationCopy:
      "O Orkio se integra a sistemas operacionais, financeiros, comerciais, dados, comunicação e APIs internas ou externas. Ele não substitui a operação existente: conecta, organiza e transforma tudo em inteligência acionável.",
    integrationItems: ["ERP", "CRM", "Financeiro", "Comunicação", "Dados & BI", "APIs"],
    governanceTitle: "IA governável, auditável e preparada para escala.",
    governanceCopy:
      "Toda evolução precisa de confiança. O Orkio preserva rastreabilidade, controle humano, histórico operacional, governança por perfil e capacidade de revisão de decisões.",
    esgTitle: "Inteligência operacional alinhada a ESG.",
    esgCopy:
      "A plataforma apoia eficiência, redução de desperdícios, responsabilidade decisória, transparência operacional e planejamento sustentável para empresas que desejam crescer com impacto positivo.",
    whiteLabelTitle: "Uma plataforma evolutiva e white label.",
    whiteLabelCopy:
      "O Orkio pode operar como tecnologia proprietária embarcada em modelos empresariais, consultorias, verticais e ecossistemas corporativos, preservando identidade, controle e governança.",
    finalTitle: "Sua empresa já possui dados. O Orkio transforma dados em estratégia, execução e crescimento.",
    finalPrimary: "Agendar demonstração",
    finalSecondary: "Falar com a PatroAI",
  },
  "en-US": {
    lang: "EN-US",
    altLang: "PT-BR",
    nav: ["Vision", "Integrations", "Governance", "ESG"],
    eyebrow: "Orkio OS · PatroAI proprietary technology",
    title: "The Enterprise Intelligence Operating System.",
    subtitle:
      "Orkio deploys a governable AI layer across the company’s operation, connecting strategy, data, systems, automation and execution into a continuous intelligence ecosystem.",
    primary: "Request a demo",
    secondary: "Open Orkio",
    chips: ["Auditable AI", "Multi-agent", "White label", "Enterprise integrations"],
    liveTitle: "A living operational core",
    liveCopy:
      "Diagnosis, strategic planning, assisted execution and continuous learning in one experience for companies that want to evolve with control.",
    pillarsTitle: "How Orkio transforms operations",
    pillars: [
      ["Intelligent diagnosis", "Identifies pains, bottlenecks and opportunities from the real business context."],
      ["Sustainable planning", "Structures scenarios, goals and long-term evolution paths with executive clarity."],
      ["Assisted execution", "Coordinates agents, tasks, workflows and decisions with audit trails and human control."],
      ["Continuous learning", "Improves with usage, maturing alongside the company’s operation and objectives."],
    ],
    integrationTitle: "Connected to your company’s ecosystem.",
    integrationCopy:
      "Orkio integrates with operational, financial, commercial, data, communication and API layers. It does not replace your existing operation: it connects, organizes and turns everything into actionable intelligence.",
    integrationItems: ["ERP", "CRM", "Finance", "Communication", "Data & BI", "APIs"],
    governanceTitle: "Governable, auditable AI built for scale.",
    governanceCopy:
      "Every evolution requires trust. Orkio preserves traceability, human control, operational history, role-based governance and decision review.",
    esgTitle: "Operational intelligence aligned with ESG.",
    esgCopy:
      "The platform supports efficiency, waste reduction, responsible decision-making, operational transparency and sustainable planning for companies that want to grow with positive impact.",
    whiteLabelTitle: "An evolutionary white-label platform.",
    whiteLabelCopy:
      "Orkio can operate as proprietary technology embedded into business models, consultancies, verticals and corporate ecosystems while preserving identity, control and governance.",
    finalTitle: "Your company already has data. Orkio turns it into strategy, execution and growth.",
    finalPrimary: "Schedule a demo",
    finalSecondary: "Talk to PatroAI",
  },
};

function detectLocale() {
  if (typeof window === "undefined") return "pt-BR";
  const lang = String(window.navigator?.language || "pt-BR").toLowerCase();
  return lang.startsWith("en") ? "en-US" : "pt-BR";
}

function GlowCard({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(450px_180px_at_20%_0%,rgba(250,204,21,0.13),transparent_55%),radial-gradient(420px_180px_at_100%_20%,rgba(168,85,247,0.14),transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function SignalChip({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/62">
      <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.75)]" />
      {children}
    </span>
  );
}

function IntegrationNode({ label, delay = 0 }) {
  return (
    <div
      className="orkio-float rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white/70 shadow-[0_16px_40px_rgba(0,0,0,0.24)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {label}
    </div>
  );
}

export default function Landing() {
  const nav = useNavigate();
  const isLogged = !!getToken();
  const [locale, setLocale] = useState("pt-BR");

  useEffect(() => setLocale(detectLocale()), []);
  const copy = useMemo(() => COPY[locale] || COPY["pt-BR"], [locale]);

  const goDemo = () => nav("/contact?topic=orkio-demo");
  const goApp = () => nav(isLogged ? "/app" : "/auth?mode=login");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05040A] text-white">
      <style>{`
        @keyframes orkioPulse { 0%,100%{ transform:scale(1); opacity:.78 } 50%{ transform:scale(1.08); opacity:1 } }
        @keyframes orkioFloat { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
        @keyframes orkioSpin { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }
        .orkio-float { animation: orkioFloat 5.8s ease-in-out infinite; }
        .orkio-spin { animation: orkioSpin 24s linear infinite; }
        .orkio-pulse { animation: orkioPulse 3.4s ease-in-out infinite; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(920px_560px_at_18%_10%,rgba(212,175,55,0.15),transparent_58%),radial-gradient(900px_560px_at_88%_6%,rgba(126,34,206,0.22),transparent_62%),radial-gradient(900px_620px_at_50%_105%,rgba(24,24,27,0.95),transparent_65%),linear-gradient(180deg,#05040A,#080712_55%,#030308)]" />
        <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:38px_38px]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#05040A]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <button onClick={() => nav("/")} className="flex items-center gap-3 text-left">
            <OrkioSphereMark size={42} glow ring />
            <div>
              <div className="text-sm font-black uppercase tracking-[0.28em] text-white">Orkio</div>
              <div className="text-xs font-semibold text-white/50">Enterprise Intelligence OS</div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {copy.nav.map((item, idx) => (
              <a
                key={item}
                href={["#vision", "#integrations", "#governance", "#esg"][idx]}
                className="rounded-xl px-3 py-2 text-sm text-white/62 transition hover:bg-white/5 hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/75 hover:bg-white/10"
            >
              {copy.altLang}
            </button>
            <button
              type="button"
              onClick={goDemo}
              className="rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#A855F7] px-4 py-2 text-sm font-black text-slate-950 shadow-[0_14px_40px_rgba(212,175,55,0.18)] transition hover:brightness-110"
            >
              {copy.primary}
            </button>
          </div>
        </div>
      </header>

      <section id="vision" className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">
            <OrkioSphereMark size={18} />
            {copy.eyebrow}
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
            {copy.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
            {copy.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={goDemo}
              className="rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#A855F7] px-6 py-4 text-sm font-black text-slate-950 shadow-[0_24px_70px_rgba(212,175,55,0.22)] transition hover:brightness-110"
            >
              {copy.primary}
            </button>
            <button
              onClick={goApp}
              className="rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.secondary}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {copy.chips.map((chip) => <SignalChip key={chip}>{chip}</SignalChip>)}
          </div>
        </div>

        <GlowCard className="min-h-[560px]">
          <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/20 opacity-70 orkio-spin" />
          <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A855F7]/25 opacity-70 orkio-spin" style={{ animationDirection: "reverse" }} />
          <div className="relative flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="orkio-pulse">
              <OrkioSphereMark size={188} ring glow />
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight">{copy.liveTitle}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/68">{copy.liveCopy}</p>

            <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-3">
              {copy.integrationItems.map((item, index) => (
                <IntegrationNode key={item} label={item} delay={index * 130} />
              ))}
            </div>
          </div>
        </GlowCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 max-w-3xl">
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">Operational model</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{copy.pillarsTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {copy.pillars.map(([title, body], index) => (
            <GlowCard key={title} className="min-h-[250px]">
              <div className="text-sm font-black text-[#F7D774]">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-black tracking-tight">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/64">{body}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      <section id="integrations" className="mx-auto max-w-7xl px-4 py-14">
        <GlowCard className="md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">Connected intelligence</div>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{copy.integrationTitle}</h2>
              <p className="mt-5 text-base leading-8 text-white/66">{copy.integrationCopy}</p>
            </div>
            <div className="relative min-h-[360px] rounded-[32px] border border-white/10 bg-black/20 p-6">
              <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 blur-[1px]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 orkio-pulse">
                <OrkioSphereMark size={132} ring glow />
              </div>
              <div className="grid h-full min-h-[312px] grid-cols-2 content-between gap-4">
                {copy.integrationItems.map((item, index) => (
                  <IntegrationNode key={item} label={item} delay={index * 100} />
                ))}
              </div>
            </div>
          </div>
        </GlowCard>
      </section>

      <section id="governance" className="mx-auto grid max-w-7xl gap-5 px-4 py-14 lg:grid-cols-3">
        <GlowCard className="lg:col-span-2">
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">Governance</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{copy.governanceTitle}</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/66">{copy.governanceCopy}</p>
        </GlowCard>
        <GlowCard>
          <div className="flex h-full flex-col items-center justify-center text-center">
            <OrkioSphereMark size={120} ring glow />
            <div className="mt-6 text-sm font-black uppercase tracking-[0.22em] text-white/50">Human control</div>
            <div className="mt-2 text-2xl font-black">Audit trail</div>
          </div>
        </GlowCard>
      </section>

      <section id="esg" className="mx-auto grid max-w-7xl gap-5 px-4 py-14 lg:grid-cols-2">
        <GlowCard>
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">ESG</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.esgTitle}</h2>
          <p className="mt-5 text-base leading-8 text-white/66">{copy.esgCopy}</p>
        </GlowCard>
        <GlowCard>
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">White label</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.whiteLabelTitle}</h2>
          <p className="mt-5 text-base leading-8 text-white/66">{copy.whiteLabelCopy}</p>
        </GlowCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.18),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-12">
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/50">
            <OrkioSphereMark size={18} />
            Orkio OS
          </div>
          <h2 className="mx-auto mt-6 max-w-5xl text-3xl font-black tracking-tight md:text-5xl">
            {copy.finalTitle}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={goDemo} className="rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#A855F7] px-6 py-4 text-sm font-black text-slate-950 transition hover:brightness-110">
              {copy.finalPrimary}
            </button>
            <button onClick={() => nav("/contact?topic=patroai")} className="rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
              {copy.finalSecondary}
            </button>
          </div>
        </div>
      </section>

      <PublicChatWidget />
      <Footer />
    </main>
  );
}
