import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";

const COPY = {
  "pt-BR": {
    lang: "PT-BR",
    next: "EN",
    nav: ["Recursos", "Como funciona", "Integrações", "Soluções", "Sobre nós"],
    eyebrow: "SISTEMA OPERACIONAL DE INTELIGÊNCIA EMPRESARIAL",
    titleA: "Seu negócio",
    titleB: "operando",
    titleC: "com",
    titleD: "inteligência",
    titleE: "contínua.",
    subtitle:
      "O Orkio OS conecta estratégia, dados, automação e execução em um ecossistema de agentes inteligentes que evolui com a sua empresa.",
    cta: "Agendar uma demonstração",
    cta2: "Ver Orkio em ação",
    expert: "Falar com especialista",
    demo: "Agendar demonstração",
    ecosystem: "INTEGRA-SE AO ECOSSISTEMA DA SUA EMPRESA",
    systems: ["ERP", "CRM", "Financeiro", "Comunicação", "Dados & BI", "APIs & Sistemas"],
    metrics: ["Eficiência Operacional", "Execução de Planos", "Performance de Agentes"],
    pillars: [
      ["IA Governável", "Decisões auditáveis e rastreáveis."],
      ["Multiagentes", "Especialistas digitais trabalhando juntos."],
      ["Execução Contínua", "Do planejamento à execução, com acompanhamento em tempo real."],
      ["Segurança & Privacidade", "Proteção de dados, LGPD e controle granular de acesso."],
      ["ESG Integrado", "Sustentabilidade e impacto positivo na estratégia do seu negócio."],
    ],
    howTitle: "COMO O ORKIO FUNCIONA",
    steps: [
      ["1. Diagnóstico Inteligente", "Nossa IA analisa dados, identifica gargalos, padrões e oportunidades no seu negócio."],
      ["2. Planejamento Estratégico", "Propõe cenários, metas e planos de ação sustentáveis alinhados aos seus objetivos."],
      ["3. Execução Assistida", "Agentes inteligentes automatizam processos e acompanham resultados em tempo real."],
      ["4. Aprendizado Contínuo", "O sistema aprende com os dados e evolui continuamente junto com a sua empresa."],
    ],
  },
  "en-US": {
    lang: "EN-US",
    next: "PT",
    nav: ["Features", "How it works", "Integrations", "Solutions", "About"],
    eyebrow: "ENTERPRISE INTELLIGENCE OPERATING SYSTEM",
    titleA: "Your business",
    titleB: "operating",
    titleC: "with",
    titleD: "continuous",
    titleE: "intelligence.",
    subtitle:
      "Orkio OS connects strategy, data, automation and execution into a multi-agent ecosystem that evolves alongside your company.",
    cta: "Book a demo",
    cta2: "See Orkio in action",
    expert: "Talk to a specialist",
    demo: "Schedule demo",
    ecosystem: "CONNECTS TO YOUR COMPANY ECOSYSTEM",
    systems: ["ERP", "CRM", "Finance", "Communication", "Data & BI", "APIs & Systems"],
    metrics: ["Operational Efficiency", "Plan Execution", "Agent Performance"],
    pillars: [
      ["Governable AI", "Auditable and traceable decisions."],
      ["Multi-Agent Runtime", "Digital specialists working together."],
      ["Continuous Execution", "From planning to execution, with real-time tracking."],
      ["Security & Privacy", "Data protection, compliance and granular access control."],
      ["ESG Integrated", "Sustainability and positive impact embedded into strategy."],
    ],
    howTitle: "HOW ORKIO WORKS",
    steps: [
      ["1. Intelligent Diagnosis", "AI analyzes data and identifies bottlenecks, patterns and opportunities."],
      ["2. Strategic Planning", "It proposes scenarios, goals and sustainable action plans."],
      ["3. Assisted Execution", "Intelligent agents automate processes and track results in real time."],
      ["4. Continuous Learning", "The system learns from data and evolves with your company."],
    ],
  },
};

function Icon({ type }) {
  const common = { width: 34, height: 34, viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    shield: <><path d="M24 5 9 11v12c0 10 6.6 17 15 20 8.4-3 15-10 15-20V11L24 5Z"/><path d="m17 24 5 5 10-12"/></>,
    brain: <><path d="M18 10c-4 0-7 3-7 7 0 1 .2 2 .6 2.8A8 8 0 0 0 12 36h7V10Z"/><path d="M30 10c4 0 7 3 7 7 0 1-.2 2-.6 2.8A8 8 0 0 1 36 36h-7V10Z"/><path d="M18 18h-4M30 18h4M18 28h-5M30 28h5"/></>,
    rocket: <><path d="M28 7c7 2 11 6 13 13-8 1-14 6-18 14l-9-9c8-4 13-10 14-18Z"/><path d="M16 32 9 39M32 16h.01"/><path d="M13 24 7 23l7-7M24 35l1 6 7-7"/></>,
    lock: <><rect x="10" y="20" width="28" height="20" rx="4"/><path d="M16 20v-6a8 8 0 0 1 16 0v6"/><path d="M24 28v5"/></>,
    leaf: <><path d="M39 8C23 9 10 18 10 34c16 2 27-7 29-26Z"/><path d="M12 34c7-8 14-13 25-20"/></>,
    radar: <><circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="6"/><path d="M24 24 36 14"/><path d="M38 24h4M6 24h4M24 6v4"/></>,
    plan: <><rect x="10" y="10" width="28" height="28" rx="5"/><path d="M16 31 24 23l5 5 5-12"/><circle cx="16" cy="31" r="2"/><circle cx="24" cy="23" r="2"/><circle cx="29" cy="28" r="2"/><circle cx="34" cy="16" r="2"/></>,
    bolt: <><path d="M28 4 10 27h13l-3 17 18-24H25l3-16Z"/></>,
    chart: <><path d="M8 39h32"/><rect x="12" y="25" width="5" height="10"/><rect x="22" y="18" width="5" height="17"/><rect x="32" y="10" width="5" height="25"/><path d="M11 16c8 1 16-2 25-10"/></>,
  };
  return <svg {...common}>{paths[type]}</svg>;
}

function OrkioLanding() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState("pt-BR");
  const t = COPY[locale];
  const metricValues = useMemo(() => ["92%", "85%", "78%"], []);

  const goDemo = () => {
    const el = document.querySelector("#contato");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="orkio-page">
      <style>{css}</style>

      <nav className="orkio-nav">
        <button className="brand" onClick={() => navigate("/")}>
          <img src={`${A}logo-orkio-v2-transparente.png`} alt="Orkio" />
          <span className="brand-os">OS</span>
        </button>
        <div className="nav-links">
          {t.nav.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}
        </div>
        <div className="nav-actions">
          <button className="ghost" onClick={() => setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")}>{t.next}</button>
          <button className="ghost">{t.expert}</button>
          <button className="lime" onClick={goDemo}>{t.demo} <span>→</span></button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>
            {t.titleA}<br />
            <span className="green">{t.titleB}</span> {t.titleC}<br />
            <span className="blue">{t.titleD}</span> {t.titleE}
          </h1>
          <p>{t.subtitle}</p>
          <div className="cta-row">
            <button className="lime big" onClick={goDemo}>{t.cta} <span>→</span></button>
            <button className="outline big" onClick={() => navigate("/app")}>{t.cta2} <span className="play">▷</span></button>
          </div>
        </div>

        <div className="orbital-stage" aria-hidden="true">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
          <div className="sphere-glow" />
          <img className="sphere" src={`${A}logo-orkio-sphere.png`} alt="" />
          <div className="platform" />
          <div className="network">
            {Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ "--i": i }} />)}
          </div>
        </div>

        <div className="ecosystem-card">
          <div className="ecosystem-title">{t.ecosystem}</div>
          <div className="systems">
            {t.systems.map((s, i) => (
              <div className="system-line" key={s}>
                <div className="system-icon">{["◎","◌","$","☏","▥","</>"][i]}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="panel">
            <div className="panel-title">Painel Orkio OS</div>
            <div className="metrics">
              {metricValues.map((m, i) => (
                <div className="metric" key={m}>
                  <span>{m}</span>
                  <small>{t.metrics[i]}</small>
                </div>
              ))}
            </div>
            <div className="mini-grid">
              <div className="flow-card">
                <small>Fluxo de Operações</small>
                <div className="nodes"><b/><b/><b/><b/><b/></div>
              </div>
              <div className="chart-card">
                <small>Performance Geral</small>
                <svg viewBox="0 0 160 80"><path d="M5 65 C30 58,45 62,65 45 S95 36,115 28 145 12" /></svg>
                <strong>+32%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars" id="recursos">
        {t.pillars.map(([title, desc], i) => (
          <article key={title} className="pillar">
            <div className={`pillar-icon tone-${i}`}><Icon type={["shield", "brain", "rocket", "lock", "leaf"][i]} /></div>
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="how" id="como-funciona">
        <h2>{t.howTitle.split("ORKIO")[0]}<span>ORKIO</span>{t.howTitle.split("ORKIO")[1]}</h2>
        <div className="steps">
          {t.steps.map(([title, desc], i) => (
            <article key={title} className="step">
              <div className="step-icon"><Icon type={["radar", "plan", "bolt", "chart"][i]} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
              {i < 3 && <div className="arrow">→</div>}
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contato">
        <h2>Orkio OS</h2>
        <p>{locale === "pt-BR" ? "Inteligência operacional governável para empresas que querem evoluir com estratégia, integração e execução." : "Governable operational intelligence for companies ready to evolve with strategy, integration and execution."}</p>
        <button className="lime big">{t.demo} <span>→</span></button>
      </section>
    </main>
  );
}

const css = `
:root{--bg:#040b12;--panel:#081522;--line:rgba(125,209,255,.2);--text:#eef6ff;--muted:#aab8c6;--green:#9df263;--blue:#36a6ff;--cyan:#50e2ff;--gold:#f6c84e;}
*{box-sizing:border-box}.orkio-page{min-height:100vh;background:radial-gradient(circle at 45% 32%,rgba(45,175,255,.18),transparent 26%),radial-gradient(circle at 78% 20%,rgba(141,255,93,.08),transparent 24%),linear-gradient(180deg,#030810,#06111c 58%,#030810);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}
.orkio-page:before{content:"";position:fixed;inset:0;background:linear-gradient(90deg,rgba(89,212,255,.035) 1px,transparent 1px),linear-gradient(rgba(89,212,255,.03) 1px,transparent 1px);background-size:84px 84px;mask-image:radial-gradient(circle at 50% 35%,#000,transparent 70%);pointer-events:none}
.orkio-nav{height:96px;display:flex;align-items:center;justify-content:space-between;padding:0 52px;position:relative;z-index:3}
.brand{display:flex;align-items:center;gap:10px;background:none;border:0;cursor:pointer}.brand img{height:58px;width:260px;object-fit:contain;object-position:left center;filter:drop-shadow(0 0 18px rgba(126,224,255,.18))}.brand-os{font-weight:900;color:var(--green);font-size:24px;letter-spacing:.03em;margin-left:-32px}
.nav-links{display:flex;gap:42px}.nav-links a{color:#fff;text-decoration:none;font-size:16px;opacity:.93}.nav-actions{display:flex;align-items:center;gap:18px}button{font:inherit}.ghost,.outline{border:1px solid rgba(139,180,220,.35);background:rgba(5,15,25,.45);color:#fff;border-radius:9px;padding:13px 22px}.lime{border:0;background:linear-gradient(135deg,#baff70,#7ddf48);color:#06100a;border-radius:9px;padding:14px 24px;font-weight:800;box-shadow:0 0 30px rgba(141,242,99,.22);cursor:pointer}.big{font-size:16px;padding:17px 24px}.outline.big{display:flex;gap:12px;align-items:center}.play{border:1px solid #6da5d8;border-radius:99px;width:24px;height:24px;display:inline-grid;place-items:center}
.hero{display:grid;grid-template-columns:1.08fr 1.05fr .94fr;gap:30px;align-items:center;min-height:520px;padding:38px 52px 18px;position:relative;z-index:2}.eyebrow{display:inline-flex;border:1px solid rgba(157,242,99,.65);color:#baff70;border-radius:999px;padding:10px 16px;font-size:13px;font-weight:800;letter-spacing:.03em;background:rgba(89,255,107,.05);margin-bottom:28px}.hero h1{font-size:52px;line-height:1.08;letter-spacing:-.055em;margin:0 0 24px;font-weight:900}.green{color:var(--green);text-shadow:0 0 22px rgba(157,242,99,.25)}.blue{color:var(--blue);text-shadow:0 0 28px rgba(54,166,255,.28)}.hero-copy p{max-width:520px;color:#d7e1ea;line-height:1.7;font-size:18px}.cta-row{display:flex;gap:20px;margin-top:34px;flex-wrap:wrap}
.orbital-stage{height:430px;position:relative;display:grid;place-items:center}.sphere{width:260px;height:260px;object-fit:contain;z-index:2;animation:float 4.8s ease-in-out infinite;filter:drop-shadow(0 0 34px rgba(73,174,255,.5)) drop-shadow(0 0 50px rgba(255,198,65,.25))}.sphere-glow{position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(76,180,255,.34),rgba(255,215,76,.13) 45%,transparent 70%);filter:blur(12px)}.orbit{position:absolute;border:1px solid rgba(90,211,255,.24);border-radius:50%;transform:rotateX(67deg)}.orbit-1{width:360px;height:360px}.orbit-2{width:430px;height:430px}.orbit-3{width:510px;height:510px;opacity:.45}.platform{position:absolute;bottom:40px;width:315px;height:66px;border-radius:50%;border:1px solid rgba(133,225,255,.35);background:radial-gradient(ellipse at center,rgba(255,198,65,.24),rgba(30,159,255,.08),transparent 70%);filter:blur(.2px)}.network{position:absolute;right:-24px;top:78px;width:230px;height:250px}.network i{position:absolute;left:0;top:calc(var(--i)*12px);width:210px;height:1px;background:linear-gradient(90deg,rgba(85,206,255,.75),transparent);transform:rotate(calc(-36deg + var(--i)*4deg));transform-origin:left center}.network i:after{content:"";position:absolute;right:0;top:-3px;width:7px;height:7px;background:#69e6ff;border-radius:50%;box-shadow:0 0 12px #69e6ff}
.ecosystem-card{position:relative;border:1px solid rgba(80,150,207,.25);border-radius:22px;padding:44px 20px 18px;background:linear-gradient(180deg,rgba(7,18,31,.8),rgba(4,11,18,.72));box-shadow:0 0 60px rgba(31,154,255,.08)}.ecosystem-title{text-align:center;font-weight:900;font-size:13px;letter-spacing:.04em;margin-bottom:20px}.systems{position:absolute;left:-174px;top:86px;display:grid;gap:14px}.system-line{display:flex;align-items:center;gap:12px;color:#fff;font-size:13px}.system-icon{width:44px;height:44px;border:1px solid rgba(81,219,255,.7);border-radius:50%;display:grid;place-items:center;color:#63e6ff;background:#081522;box-shadow:0 0 18px rgba(80,219,255,.22)}.panel{border:1px solid rgba(83,151,209,.17);border-radius:14px;background:#07131f;padding:18px}.panel-title{font-size:13px;color:#d9ebff;margin-bottom:16px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{height:84px;border:1px solid rgba(99,205,255,.14);border-radius:12px;display:grid;place-items:center;text-align:center}.metric span{font-size:24px;font-weight:900;color:#b5ff69}.metric small{font-size:10px;color:#95aabd}.mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.flow-card,.chart-card{min-height:110px;border:1px solid rgba(99,205,255,.14);border-radius:12px;padding:12px;color:#95aabd}.nodes{display:flex;gap:10px;margin-top:28px;align-items:center;justify-content:center}.nodes b{width:22px;height:22px;border-radius:50%;border:1px solid #68e8ff;background:#102132}.chart-card svg{width:100%;height:54px}.chart-card path{fill:none;stroke:#61d8ff;stroke-width:4}.chart-card strong{float:right;color:#9df263}
.pillars{margin:22px 30px 0;padding:26px 22px;display:grid;grid-template-columns:repeat(5,1fr);gap:26px;border-top:1px solid rgba(122,194,255,.15);border-bottom:1px solid rgba(122,194,255,.12)}.pillar{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;border-right:1px solid rgba(122,194,255,.15);padding-right:18px}.pillar:last-child{border-right:0}.pillar-icon{color:var(--green);filter:drop-shadow(0 0 14px rgba(157,242,99,.28))}.tone-1,.tone-3{color:#5ee4ff}.tone-2{color:#a9ff5d}.pillar h3{margin:0 0 7px;font-size:17px}.pillar p{margin:0;color:#aebdca;line-height:1.45}
.how{padding:26px 52px 56px}.how h2{text-align:center;font-size:22px;letter-spacing:.09em;color:#cfd8e2}.how h2 span{color:#9df263}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:34px;margin-top:24px}.step{position:relative;min-height:224px;border:1px solid rgba(97,182,255,.18);border-radius:22px;padding:24px;background:linear-gradient(180deg,rgba(8,22,35,.78),rgba(4,12,20,.92));box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}.step-icon{width:76px;height:76px;border:1px solid rgba(108,225,255,.35);border-radius:18px;display:grid;place-items:center;color:#61d8ff;margin-bottom:18px;background:rgba(5,18,30,.65)}.step h3{font-size:17px}.step p{color:#b3c1cf;line-height:1.55}.arrow{position:absolute;right:-30px;top:50%;font-size:42px;color:#9df263;text-shadow:0 0 18px #9df263}
.contact{margin:0 52px 70px;padding:36px;border:1px solid rgba(157,242,99,.2);border-radius:28px;background:radial-gradient(circle at 30% 20%,rgba(157,242,99,.13),transparent 40%),#06111c;text-align:center}.contact h2{font-size:38px;margin:0}.contact p{color:#c7d2de;margin:14px auto 24px;max-width:720px;line-height:1.6}
@keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-14px) rotate(2deg)}}
@media(max-width:1100px){.orkio-nav{padding:22px;height:auto;align-items:flex-start}.nav-links{display:none}.hero{grid-template-columns:1fr;padding:22px}.systems{position:static;margin-bottom:18px}.pillars,.steps{grid-template-columns:1fr 1fr}.pillar{border-right:0}.ecosystem-card{max-width:640px}.brand img{width:210px}.brand-os{margin-left:-24px}}@media(max-width:700px){.nav-actions{display:none}.hero h1{font-size:42px}.pillars,.steps{grid-template-columns:1fr}.mini-grid,.metrics{grid-template-columns:1fr}.orkio-nav{padding:18px}.brand img{width:190px}.hero{padding:18px}.orbital-stage{height:340px}.sphere{width:210px}.how,.contact{margin-left:18px;margin-right:18px;padding-left:0;padding-right:0}.contact{padding:28px 18px}.cta-row{flex-direction:column}.big{width:100%}}
`;

export default OrkioLanding;
