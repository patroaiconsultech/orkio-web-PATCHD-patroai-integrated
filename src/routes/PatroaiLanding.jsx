import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const COPY = {
  "pt-BR": {
    lang: "PT-BR",
    altLang: "EN-US",
    nav: ["Visão", "Orkio", "ESG", "Contato"],
    eyebrow: "PatroAI · Sistemas de inovação empresarial",
    title: "Desenvolvemos sistemas de inovação para empresas que desejam evoluir.",
    subtitle:
      "A PatroAI cria ecossistemas inteligentes para estratégia, governança, automação e execução. Nossa tecnologia proprietária, Orkio OS, funciona como um cérebro de IA avançado, auditável e governável para ajudar empresas a prosperar.",
    primary: "Conhecer o Orkio",
    secondary: "Falar com a PatroAI",
    pillarsTitle: "Inteligência aplicada à evolução empresarial",
    pillars: [
      ["Estratégia", "Diagnóstico de dores, desenho de cenários e planejamento sustentável de longo prazo."],
      ["Execução", "Agentes e fluxos que apoiam a operação, reduzem retrabalho e aceleram decisões."],
      ["Governança", "Rastreabilidade, controle humano, segurança e evolução auditável."],
      ["ESG", "Tecnologia alinhada a responsabilidade, eficiência, transparência e impacto positivo."],
    ],
    orkioTitle: "Orkio OS é nossa tecnologia proprietária.",
    orkioCopy:
      "Uma plataforma white label evolutiva que reconhece as dores do negócio, planeja caminhos sustentáveis e participa da execução com agentes inteligentes, integrações e governança.",
    businessTitle: "Para empresas que precisam sair da intenção e chegar à execução.",
    businessCopy:
      "Unimos visão estratégica, arquitetura tecnológica e inteligência operacional para implantar sistemas vivos de melhoria contínua em empresas, consultorias, verticais e ecossistemas corporativos.",
    finalTitle: "A inovação deixa de ser discurso quando vira sistema.",
    finalPrimary: "Agendar conversa",
    finalSecondary: "Ver Orkio OS",
    footer: "PatroAI — Inteligência empresarial com evolução contínua.",
  },
  "en-US": {
    lang: "EN-US",
    altLang: "PT-BR",
    nav: ["Vision", "Orkio", "ESG", "Contact"],
    eyebrow: "PatroAI · Enterprise innovation systems",
    title: "We build innovation systems for companies that want to evolve.",
    subtitle:
      "PatroAI creates intelligent ecosystems for strategy, governance, automation and execution. Our proprietary technology, Orkio OS, works as an advanced, auditable and governable AI brain that helps companies prosper.",
    primary: "Discover Orkio",
    secondary: "Talk to PatroAI",
    pillarsTitle: "Applied intelligence for enterprise evolution",
    pillars: [
      ["Strategy", "Business diagnosis, scenario design and sustainable long-term planning."],
      ["Execution", "Agents and workflows that support operations, reduce rework and accelerate decisions."],
      ["Governance", "Traceability, human control, security and auditable evolution."],
      ["ESG", "Technology aligned with responsibility, efficiency, transparency and positive impact."],
    ],
    orkioTitle: "Orkio OS is our proprietary technology.",
    orkioCopy:
      "An evolutionary white-label platform that understands business pains, plans sustainable paths and supports execution through intelligent agents, integrations and governance.",
    businessTitle: "For companies that need to move from intention to execution.",
    businessCopy:
      "We combine strategic vision, technology architecture and operational intelligence to deploy living systems of continuous improvement across companies, consultancies, verticals and corporate ecosystems.",
    finalTitle: "Innovation becomes real when it becomes a system.",
    finalPrimary: "Schedule a conversation",
    finalSecondary: "See Orkio OS",
    footer: "PatroAI — Enterprise intelligence with continuous evolution.",
  },
};

function detectLocale() {
  if (typeof window === "undefined") return "pt-BR";
  const lang = String(window.navigator?.language || "pt-BR").toLowerCase();
  return lang.startsWith("en") ? "en-US" : "pt-BR";
}

function PatroAILogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center rounded-full border border-[#D4AF37]/35 bg-[#0B1020] shadow-[0_0_34px_rgba(212,175,55,0.26)]">
        <img
          src="/patroai-assets/logo-patroai-novo.png"
          alt="PatroAI"
          className="h-9 w-9 rounded-full object-contain"
        />
      </div>
      {!compact ? (
        <div className="text-xl font-black tracking-[0.18em] text-white">PatroAI</div>
      ) : null}
    </div>
  );
}

function GoldCard({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_220px_at_10%_0%,rgba(212,175,55,0.16),transparent_55%),radial-gradient(480px_260px_at_100%_0%,rgba(79,183,243,0.11),transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function MiniChip({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/58">
      {children}
    </span>
  );
}

export default function PatroaiLanding() {
  const nav = useNavigate();
  const [locale, setLocale] = useState("pt-BR");

  useEffect(() => setLocale(detectLocale()), []);
  const copy = useMemo(() => COPY[locale] || COPY["pt-BR"], [locale]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06070D] text-white">
      <style>{`
        @keyframes patroaiGlow { 0%,100%{ opacity:.72; transform:scale(1)} 50%{ opacity:1; transform:scale(1.06)} }
        @keyframes patroaiFloat { 0%,100%{ transform:translateY(0)} 50%{ transform:translateY(-12px)} }
        .patroai-glow { animation: patroaiGlow 3.8s ease-in-out infinite; }
        .patroai-float { animation: patroaiFloat 6s ease-in-out infinite; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_560px_at_16%_8%,rgba(212,175,55,0.16),transparent_56%),radial-gradient(860px_540px_at_88%_6%,rgba(79,183,243,0.14),transparent_60%),linear-gradient(180deg,#07080F,#0A1020_58%,#05060B)]" />
        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:38px_38px]" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06070D]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center">
            <PatroAILogo />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {copy.nav.map((item, idx) => (
              <a
                key={item}
                href={["#vision", "#orkio", "#esg", "#contact"][idx]}
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
              onClick={() => nav("/contact?topic=patroai")}
              className="rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#4FB7F3] px-4 py-2 text-sm font-black text-slate-950 shadow-[0_14px_40px_rgba(212,175,55,0.18)] transition hover:brightness-110"
            >
              {copy.secondary}
            </button>
          </div>
        </div>
      </header>

      <section id="vision" className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#F7D774]">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.75)]" />
            {copy.eyebrow}
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.94] tracking-tight md:text-7xl">
            {copy.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
            {copy.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => nav("/orkio")}
              className="rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#4FB7F3] px-6 py-4 text-sm font-black text-slate-950 shadow-[0_24px_70px_rgba(212,175,55,0.22)] transition hover:brightness-110"
            >
              {copy.primary}
            </button>
            <button
              onClick={() => nav("/contact?topic=patroai")}
              className="rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.secondary}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <MiniChip>Strategy</MiniChip>
            <MiniChip>Execution</MiniChip>
            <MiniChip>Governance</MiniChip>
            <MiniChip>ESG</MiniChip>
          </div>
        </div>

        <GoldCard className="min-h-[560px]">
          <div className="relative flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="absolute h-[410px] w-[410px] rounded-full border border-[#D4AF37]/20" />
            <div className="absolute h-[300px] w-[300px] rounded-full border border-[#4FB7F3]/18" />
            <div className="patroai-glow grid h-56 w-56 place-items-center rounded-full border border-[#D4AF37]/40 bg-[#090B14]/80 shadow-[0_0_90px_rgba(212,175,55,0.24)]">
              <img
                src="/patroai-assets/logo-patroai-novo.png"
                alt="PatroAI"
                className="h-40 w-40 rounded-full object-contain"
              />
            </div>
            <div className="mt-7 text-3xl font-black tracking-[0.22em] text-white">PatroAI</div>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/66">
              Enterprise innovation systems powered by governable intelligence.
            </p>
          </div>
        </GoldCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 max-w-3xl">
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">Operating thesis</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{copy.pillarsTitle}</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {copy.pillars.map(([title, body], index) => (
            <GoldCard key={title} className="min-h-[250px]">
              <div className="text-sm font-black text-[#F7D774]">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-black tracking-tight">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/64">{body}</p>
            </GoldCard>
          ))}
        </div>
      </section>

      <section id="orkio" className="mx-auto max-w-7xl px-4 py-14">
        <GoldCard className="md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">Proprietary platform</div>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{copy.orkioTitle}</h2>
              <p className="mt-5 text-base leading-8 text-white/66">{copy.orkioCopy}</p>
              <button
                onClick={() => nav("/orkio")}
                className="mt-7 rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                {copy.finalSecondary}
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {["AI Brain", "Auditability", "White Label", "Integrations"].map((item) => (
                <div key={item} className="patroai-float rounded-[28px] border border-white/10 bg-black/24 p-6">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F7D774]/72">{item}</div>
                  <div className="mt-4 h-20 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent_65%)]" />
                </div>
              ))}
            </div>
          </div>
        </GoldCard>
      </section>

      <section id="esg" className="mx-auto grid max-w-7xl gap-5 px-4 py-14 lg:grid-cols-2">
        <GoldCard>
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">Business evolution</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.businessTitle}</h2>
          <p className="mt-5 text-base leading-8 text-white/66">{copy.businessCopy}</p>
        </GoldCard>
        <GoldCard>
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#F7D774]/70">ESG + Governance</div>
          <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Inovação responsável, rastreável e sustentável.</h2>
          <p className="mt-5 text-base leading-8 text-white/66">
            A PatroAI posiciona inteligência artificial como infraestrutura para empresas evoluírem com eficiência, transparência, responsabilidade e impacto positivo.
          </p>
        </GoldCard>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.20),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-12">
          <div className="mx-auto w-fit">
            <PatroAILogo compact />
          </div>
          <h2 className="mx-auto mt-6 max-w-5xl text-3xl font-black tracking-tight md:text-5xl">
            {copy.finalTitle}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => nav("/contact?topic=patroai")} className="rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F7D774] to-[#4FB7F3] px-6 py-4 text-sm font-black text-slate-950 transition hover:brightness-110">
              {copy.finalPrimary}
            </button>
            <button onClick={() => nav("/orkio")} className="rounded-2xl border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
              {copy.finalSecondary}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/56 md:flex-row md:items-center md:justify-between">
          <div>{copy.footer}</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/orkio" className="hover:text-white">Orkio OS</Link>
            <Link to="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/legal/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
