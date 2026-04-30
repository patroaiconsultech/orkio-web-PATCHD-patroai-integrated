import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const COPY = {
  "pt-BR": {
    lang: "PT-BR",
    altLang: "EN-US",
    kicker: "PatroAI",
    title: "Inteligência aplicada para empresas que precisam de clareza, execução e governança.",
    subtitle:
      "A PatroAI é a empresa proprietária do Orkio. Construímos sistemas de inteligência estratégica, automação e apoio à decisão para operações que precisam crescer com direção e responsabilidade.",
    primary: "Conhecer o Orkio",
    secondary: "Falar com a PatroAI",
    section1Title: "O que fazemos",
    section1Copy:
      "Projetamos experiências e infraestruturas de inteligência para transformar estratégia em execução, com foco em clareza operacional, automação útil e tomada de decisão assistida.",
    section2Title: "Como operamos",
    section2Copy:
      "Unimos produto, arquitetura e governança. A tecnologia precisa ser útil, auditável e alinhada ao propósito real do negócio.",
    section3Title: "Produto proprietário",
    section3Copy:
      "Orkio é a plataforma de inteligência estratégica da PatroAI. Ele organiza contexto, orienta decisões, coordena execução e preserva controle humano.",
    capabilitiesTitle: "Capacidades centrais",
    capabilities: [
      "Sistemas de inteligência para operação e decisão",
      "Automação orientada por governança",
      "Experiências premium com voz, contexto e execução",
      "Arquitetura de produto com rastreabilidade e controle",
    ],
    orkioTitle: "Conheça o Orkio",
    orkioCopy:
      "Acesse a landing do produto para ver proposta de valor, pricing e a experiência do console operacional.",
    footer: "PatroAI · empresa proprietária do Orkio",
  },
  "en-US": {
    lang: "EN-US",
    altLang: "PT-BR",
    kicker: "PatroAI",
    title: "Applied intelligence for companies that need clarity, execution, and governance.",
    subtitle:
      "PatroAI is the company behind Orkio. We build strategic intelligence systems, automation, and decision-support experiences for operations that need to grow with direction and responsibility.",
    primary: "Discover Orkio",
    secondary: "Contact PatroAI",
    section1Title: "What we do",
    section1Copy:
      "We design intelligence systems and product experiences that turn strategy into execution with operational clarity, useful automation, and decision support.",
    section2Title: "How we operate",
    section2Copy:
      "We combine product, architecture, and governance. Technology should be useful, auditable, and aligned with the real purpose of the business.",
    section3Title: "Flagship product",
    section3Copy:
      "Orkio is PatroAI’s strategic intelligence platform. It organizes context, supports decisions, coordinates execution, and preserves human control.",
    capabilitiesTitle: "Core capabilities",
    capabilities: [
      "Intelligence systems for operations and decisions",
      "Governed automation",
      "Premium experiences with voice, context, and execution",
      "Product architecture with traceability and control",
    ],
    orkioTitle: "Meet Orkio",
    orkioCopy:
      "Open the product landing to explore the value proposition, pricing, and the operational console experience.",
    footer: "PatroAI · owner of Orkio",
  },
};

function detectLocale() {
  if (typeof window === "undefined") return "pt-BR";
  const lang = (window.navigator?.language || "pt-BR").toLowerCase();
  return lang.startsWith("en") ? "en-US" : "pt-BR";
}

function Stat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-2 text-sm leading-6 text-white/65">{label}</div>
    </div>
  );
}

export default function PatroaiLanding() {
  const [locale, setLocale] = useState("pt-BR");

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const copy = useMemo(() => COPY[locale] || COPY["pt-BR"], [locale]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,183,243,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_22%),linear-gradient(180deg,#10273b_0%,#0b1b2a_100%)] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1b2a]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/patroai-assets/logo-patroai-novo.png"
              alt="PatroAI"
              className="h-10 w-auto"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black tracking-[0.18em] text-white/80"
            >
              {copy.altLang}
            </button>
            <Link
              to="/orkio"
              className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#4FB7F3] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950"
            >
              {copy.primary}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4FB7F3]/25 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#4FB7F3]">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37] shadow-[0_0_0_6px_rgba(212,175,55,0.12)]" />
            {copy.kicker}
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-tight md:text-7xl">
            {copy.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
            {copy.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/orkio"
              className="rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#4FB7F3] px-6 py-4 text-sm font-black text-slate-950 shadow-[0_18px_50px_rgba(79,183,243,0.24)]"
            >
              {copy.primary}
            </Link>
            <Link
              to="/contact"
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 text-sm font-semibold text-white hover:bg-white/[0.08]"
            >
              {copy.secondary}
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat value="Orkio" label={copy.section3Copy} />
            <Stat value="AI + Gov" label={copy.section2Copy} />
            <Stat value={copy.lang} label="Locale ready" />
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur md:p-8">
          <div className="text-[11px] font-black uppercase tracking-[0.28em] text-white/44">
            {copy.capabilitiesTitle}
          </div>
          <div className="mt-5 grid gap-4">
            {copy.capabilities.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/76"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-[#D4AF37]/18 bg-[linear-gradient(135deg,rgba(212,175,55,0.15),rgba(79,183,243,0.08))] p-5">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
              {copy.orkioTitle}
            </div>
            <p className="mt-3 text-sm leading-7 text-white/72">{copy.orkioCopy}</p>
            <Link
              to="/orkio"
              className="mt-4 inline-flex rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black text-white hover:bg-white/[0.08]"
            >
              {copy.primary}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 md:grid-cols-3">
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#4FB7F3]">
            {copy.section1Title}
          </div>
          <p className="mt-4 text-sm leading-7 text-white/72">{copy.section1Copy}</p>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#4FB7F3]">
            {copy.section2Title}
          </div>
          <p className="mt-4 text-sm leading-7 text-white/72">{copy.section2Copy}</p>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#4FB7F3]">
            {copy.section3Title}
          </div>
          <p className="mt-4 text-sm leading-7 text-white/72">{copy.section3Copy}</p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-white/56 md:flex-row md:items-center md:justify-between">
          <div>{copy.footer}</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/orkio" className="hover:text-white">
              Orkio
            </Link>
            <Link to="/legal/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/legal/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
