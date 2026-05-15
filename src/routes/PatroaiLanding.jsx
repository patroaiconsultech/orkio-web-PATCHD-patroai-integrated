import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";

const COPY = {
  "pt-BR": {
    lang: "PT-BR",
    next: "EN",
    nav: ["Soluções", "Plataforma", "Recursos", "Segmentos", "Academia", "Sobre nós"],
    eyebrow: "INOVAÇÃO · ESTRATÉGIA · EXECUÇÃO · ESG",
    title: ["Desenvolvemos sistemas", "de inovação", "que impulsionam", "empresas a evoluir,", "prosperar", "e gerar impacto sustentável."],
    subtitle:
      "A PatroAI cria e implanta ecossistemas inteligentes com a plataforma Orkio — um cérebro de IA ultra avançado, auditável e governável, que reconhece as dores do negócio, planeja o futuro e participa da execução com máxima eficiência e governança.",
    primary: "Agendar uma demonstração",
    secondary: "Ver como funciona",
    avatarTitle: "Olá! Eu sou o Orkio.",
    avatarText:
      "Sou a inteligência que trabalha ao lado da sua empresa para planejar, executar e gerar resultados reais e sustentáveis.",
    avatarCta: "Conversar agora",
    pillars: [
      ["Governança e Segurança", "IA auditável, governável e em conformidade com LGPD."],
      ["Estratégia Inteligente", "Planejamento sustentável de longo prazo alinhado ao seu propósito e mercado."],
      ["Execução com IA", "Agentes inteligentes que executam, acompanham e otimizam processos."],
      ["ESG Integrado", "Decisões conscientes que geram impacto positivo e valor duradouro."],
    ],
    cards: [
      ["Sistemas de Inovação Personalizados", "Desenvolvemos soluções sob medida para os desafios únicos da sua empresa."],
      ["Plataforma Orkio White Label", "Sua marca, nossa tecnologia. Escalável, evolutiva e totalmente integrada."],
      ["IA que Entende seu Negócio", "Reconhece dores, identifica oportunidades e propõe o melhor caminho para crescer."],
      ["Evolução Contínua com Resultados Reais", "Aprende, se adapta e impulsiona resultados cada vez maiores."],
    ],
  },
  "en-US": {
    lang: "EN-US",
    next: "PT",
    nav: ["Solutions", "Platform", "Features", "Segments", "Academy", "About"],
    eyebrow: "INNOVATION · STRATEGY · EXECUTION · ESG",
    title: ["We build intelligent", "innovation systems", "that help companies", "evolve, scale,", "prosper", "and create sustainable impact."],
    subtitle:
      "PatroAI designs and deploys intelligent ecosystems powered by Orkio — an advanced, auditable and governable AI brain that understands business challenges, plans the future and supports execution with precision and accountability.",
    primary: "Book a demo",
    secondary: "See how it works",
    avatarTitle: "Hi! I am Orkio.",
    avatarText:
      "I am the intelligence working alongside your company to plan, execute and generate real, sustainable results.",
    avatarCta: "Start conversation",
    pillars: [
      ["Governance & Security", "Auditable and governable AI aligned with compliance."],
      ["Strategic Intelligence", "Long-term sustainable planning aligned with your market and purpose."],
      ["AI Execution", "Intelligent agents that execute, track and optimize processes."],
      ["ESG Integrated", "Conscious decisions that create positive impact and durable value."],
    ],
    cards: [
      ["Custom Innovation Systems", "Tailored solutions for the unique challenges of your company."],
      ["Orkio White Label Platform", "Your brand, our technology. Scalable, evolutive and fully integrated."],
      ["AI That Understands Your Business", "Identifies pain points, opportunities and the best path to growth."],
      ["Continuous Evolution With Real Results", "Learns, adapts and drives increasingly stronger outcomes."],
    ],
  },
};

function Icon({ type }) {
  const common = { width: 36, height: 36, viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    shield: <><path d="M24 5 9 11v12c0 10 6.6 17 15 20 8.4-3 15-10 15-20V11L24 5Z"/><path d="m17 24 5 5 10-12"/></>,
    brain: <><path d="M18 10c-4 0-7 3-7 7 0 1 .2 2 .6 2.8A8 8 0 0 0 12 36h7V10Z"/><path d="M30 10c4 0 7 3 7 7 0 1-.2 2-.6 2.8A8 8 0 0 1 36 36h-7V10Z"/></>,
    chart: <><path d="M8 39h32"/><rect x="12" y="25" width="5" height="10"/><rect x="22" y="18" width="5" height="17"/><rect x="32" y="10" width="5" height="25"/><path d="M11 16c8 1 16-2 25-10"/></>,
    leaf: <><path d="M39 8C23 9 10 18 10 34c16 2 27-7 29-26Z"/><path d="M12 34c7-8 14-13 25-20"/></>,
    people: <><circle cx="17" cy="17" r="6"/><circle cx="31" cy="17" r="6"/><path d="M7 39c2-8 7-12 14-12s12 4 14 12"/><path d="M27 28c6 1 10 5 12 11"/></>,
    nodes: <><rect x="18" y="6" width="12" height="12" rx="2"/><rect x="6" y="30" width="12" height="12" rx="2"/><rect x="30" y="30" width="12" height="12" rx="2"/><path d="M24 18v7M12 30l12-5 12 5"/></>,
    target: <><circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="7"/><path d="M24 24 38 10"/><path d="M34 10h4v4"/></>,
    rocket: <><path d="M28 7c7 2 11 6 13 13-8 1-14 6-18 14l-9-9c8-4 13-10 14-18Z"/><path d="M16 32 9 39M32 16h.01"/></>,
  };
  return <svg {...common}>{paths[type]}</svg>;
}

function RobotCard({ t }) {
  return (
    <aside className="robot-card">
      <div className="robot-head">
        <div className="head-ring" />
        <div className="eye left" />
        <div className="eye right" />
        <div className="smile" />
        <div className="ear ear-left" />
        <div className="ear ear-right" />
      </div>
      <div className="robot-body">
        <img src={`${A}logo-patroai-novo.png`} alt="" />
      </div>
      <h2>{t.avatarTitle.split("Orkio")[0]}<span>Orkio</span>{t.avatarTitle.split("Orkio")[1]}</h2>
      <p>{t.avatarText}</p>
      <button>{t.avatarCta}<i>▮▮▮</i></button>
    </aside>
  );
}

function PatroaiLanding() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState("pt-BR");
  const t = COPY[locale];

  return (
    <main className="patroai-page">
      <style>{css}</style>

      <nav className="topbar">
        <button className="brand" onClick={() => navigate("/")}>
          <img src={`${A}logo-patroai-novo.png`} alt="PatroAI" />
          <div>
            <strong>PATRO<span>AI</span></strong>
            <small>CONSULTECH</small>
          </div>
        </button>
        <div className="navlinks">{t.nav.map((n) => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}</div>
        <div className="actions">
          <button className="lang" onClick={() => setLocale(locale === "pt-BR" ? "en-US" : "pt-BR")}>{t.next}</button>
          <button className="login" onClick={() => navigate("/login")}>Login</button>
          <button className="demo">Agendar demo <span>↗</span></button>
        </div>
      </nav>

      <section className="hero">
        <div className="copy">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>
            {t.title[0]}<br />
            <span>{t.title[1]}</span> {t.title[2]}<br />
            {t.title[3]} <span>{t.title[4]}</span><br />
            {t.title[5]}
          </h1>
          <p>{t.subtitle}</p>
          <div className="buttons">
            <button className="primary">{t.primary} <span>→</span></button>
            <button className="secondary">{t.secondary} <i>▷</i></button>
          </div>
        </div>

        <div className="brain-stage">
          <div className="halo" />
          <img src={`${A}logo-patroai-novo.png`} alt="" />
          <strong>PatroAI</strong>
          <div className="pedestal" />
          <div className="rings" />
        </div>

        <RobotCard t={t} />
      </section>

      <section className="pillars">
        {t.pillars.map(([title, desc], i) => (
          <article key={title}>
            <div className={`icon i${i}`}><Icon type={["shield", "brain", "chart", "leaf"][i]} /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </section>

      <section className="cards">
        {t.cards.map(([title, desc], i) => (
          <article key={title}>
            <div className={`card-icon c${i}`}><Icon type={["people", "nodes", "target", "rocket"][i]} /></div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const css = `
:root{--bg:#050509;--gold:#f4c33d;--gold2:#ffdf7b;--purple:#9b28ff;--green:#79ed58;--text:#f6f7fb;--muted:#b9bdc7}
*{box-sizing:border-box}.patroai-page{min-height:100vh;background:radial-gradient(circle at 50% 28%,rgba(244,195,61,.14),transparent 28%),radial-gradient(circle at 82% 30%,rgba(155,40,255,.11),transparent 22%),linear-gradient(180deg,#030306,#08090e 60%,#040408);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;overflow:hidden}.patroai-page:before{content:"";position:fixed;inset:0;background:radial-gradient(circle at 50% 45%,rgba(255,206,77,.16),transparent 3%,transparent 45%),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px);background-size:auto,94px 94px,94px 94px;mask-image:radial-gradient(circle at 50% 35%,#000,transparent 72%);pointer-events:none}
.topbar{height:118px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;border-bottom:1px solid rgba(255,255,255,.05);position:relative;z-index:5}.brand{display:flex;align-items:center;gap:14px;background:none;border:0;color:#fff;cursor:pointer;text-align:left}.brand img{width:78px;height:78px;border-radius:50%;filter:drop-shadow(0 0 18px rgba(244,195,61,.38))}.brand strong{font-size:43px;line-height:.92;letter-spacing:.06em;font-weight:900}.brand strong span{color:var(--gold)}.brand small{display:block;color:var(--gold2);font-size:15px;letter-spacing:.52em;margin-left:4px;margin-top:8px}.navlinks{display:flex;gap:38px}.navlinks a{color:#fff;text-decoration:none;font-size:16px}.actions{display:flex;gap:18px;align-items:center}.actions button{font:inherit;color:#fff;background:none;border:0}.lang,.login{opacity:.95}.demo{border:1px solid rgba(244,195,61,.65)!important;border-radius:999px!important;padding:15px 25px!important;color:#ffd65d!important;font-weight:800!important;background:rgba(244,195,61,.03)!important}
.hero{display:grid;grid-template-columns:1.02fr 1.05fr .88fr;gap:32px;align-items:center;padding:52px 38px 32px;position:relative;z-index:2}.eyebrow{display:inline-flex;border:1px solid rgba(244,195,61,.58);border-radius:999px;padding:11px 18px;color:#ffda54;font-weight:800;letter-spacing:.04em;margin-bottom:28px;background:rgba(244,195,61,.05)}h1{font-size:50px;line-height:1.12;margin:0 0 25px;font-weight:900;letter-spacing:-.055em}h1 span{color:var(--gold);text-shadow:0 0 24px rgba(244,195,61,.28)}.copy p{font-size:18px;line-height:1.7;color:#d5d6dd;max-width:610px}.buttons{display:flex;gap:22px;margin-top:32px}.primary{border:1px solid rgba(255,225,112,.75);border-radius:13px;padding:17px 28px;background:linear-gradient(135deg,#ffd95d,#a66d05);color:#fff;font-weight:800;box-shadow:0 0 35px rgba(244,195,61,.25)}.secondary{border:1px solid rgba(255,255,255,.22);border-radius:13px;padding:17px 28px;background:rgba(255,255,255,.03);color:#fff;font-weight:800}.secondary i{margin-left:14px;border:1px solid #fff;border-radius:50%;padding:3px 5px;font-style:normal}
.brain-stage{height:470px;display:grid;place-items:center;position:relative}.brain-stage img{width:380px;height:380px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 28px rgba(244,195,61,.48));z-index:2;animation:breath 4.8s ease-in-out infinite}.brain-stage strong{position:absolute;z-index:3;font-size:52px;font-weight:900;color:#fff;text-shadow:0 2px 8px #000}.halo{position:absolute;width:390px;height:390px;border:2px solid rgba(244,195,61,.8);border-radius:50%;box-shadow:0 0 28px rgba(244,195,61,.45),inset 0 0 28px rgba(244,195,61,.15)}.halo:before,.halo:after{content:"";position:absolute;inset:-12px;border-radius:50%;border:1px solid rgba(244,195,61,.18)}.pedestal{position:absolute;bottom:42px;width:300px;height:64px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(244,195,61,.45),rgba(244,195,61,.08),transparent 70%);filter:blur(3px)}.rings{position:absolute;bottom:48px;width:460px;height:160px;border-radius:50%;border:1px solid rgba(244,195,61,.16);transform:rotateX(68deg)}
.robot-card{border:1px solid rgba(155,40,255,.48);border-radius:25px;padding:28px 24px 24px;background:radial-gradient(circle at 50% 20%,rgba(155,40,255,.23),transparent 44%),linear-gradient(180deg,rgba(10,8,21,.94),rgba(5,5,9,.88));box-shadow:0 0 48px rgba(155,40,255,.13);min-height:510px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden}.robot-head{position:absolute;top:36px;left:50%;transform:translateX(-50%);width:210px;height:210px;border-radius:50%;background:radial-gradient(circle at 50% 42%,#1e1434,#050509 64%);border:2px solid rgba(255,207,66,.65);box-shadow:0 0 60px rgba(155,40,255,.62)}.head-ring{position:absolute;inset:-20px;border-radius:50%;border:8px solid rgba(163,68,255,.8);border-bottom-color:transparent;filter:drop-shadow(0 0 18px #a33cff)}.eye{position:absolute;top:72px;width:28px;height:46px;border-radius:50%;background:#fff;box-shadow:0 0 18px #a33cff,0 0 30px #a33cff inset}.eye.left{left:58px}.eye.right{right:58px}.smile{position:absolute;left:82px;top:128px;width:48px;height:25px;border-bottom:5px solid #e6b7ff;border-radius:50%;box-shadow:0 0 12px #a33cff}.ear{position:absolute;top:72px;width:32px;height:64px;border-radius:22px;background:linear-gradient(#ffd764,#3b2463);border:1px solid rgba(255,215,100,.75)}.ear-left{left:-18px}.ear-right{right:-18px}.robot-body{position:absolute;left:50%;top:242px;transform:translateX(-50%);width:190px;height:130px;border-radius:70px 70px 20px 20px;background:linear-gradient(180deg,#12101a,#07070b);border:1px solid rgba(255,255,255,.08)}.robot-body img{width:58px;height:58px;object-fit:contain;position:absolute;left:50%;top:28px;transform:translateX(-50%);filter:drop-shadow(0 0 12px rgba(244,195,61,.7))}.robot-card h2{margin:350px 0 10px;font-size:24px}.robot-card h2 span{color:#ffd33f}.robot-card p{color:#d6d1df;line-height:1.55;font-size:17px;margin:0 0 24px}.robot-card button{border:1px solid rgba(255,255,255,.12);background:linear-gradient(135deg,#5132d5,#aa14c5);color:#fff;border-radius:15px;padding:17px 20px;font-weight:800}.robot-card button i{float:right;font-style:normal;opacity:.8}
.pillars{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin:18px 38px 0;padding:28px 0;border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.06)}.pillars article{display:grid;grid-template-columns:auto 1fr;gap:18px;padding-right:24px;border-right:1px solid rgba(255,255,255,.11)}.pillars article:last-child{border-right:0}.icon{color:var(--gold);filter:drop-shadow(0 0 14px rgba(244,195,61,.35))}.i1,.i3{color:#ad2cff}.i3{color:#6cff55}.pillars h3{margin:0 0 6px;font-size:18px}.pillars p{margin:0;color:#bec0ca;line-height:1.5}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:34px 32px 56px}.cards article{border:1px solid rgba(255,255,255,.11);border-radius:20px;padding:24px;min-height:190px;background:linear-gradient(180deg,rgba(11,13,20,.82),rgba(5,5,9,.78));box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}.card-icon{color:#b62cff;margin-bottom:18px}.c1{color:#3aa6ff}.c2{color:#ffc83d}.c3{color:#b62cff}.cards h3{font-size:23px;line-height:1.16;margin:0 0 14px}.cards p{color:#bec0ca;line-height:1.55;margin:0}
@keyframes breath{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.02)}}
@media(max-width:1150px){.topbar{height:auto;padding:22px}.navlinks{display:none}.hero{grid-template-columns:1fr}.brain-stage{order:-1;height:360px}.brain-stage img{width:300px;height:300px}.halo{width:310px;height:310px}.robot-card{min-height:480px;max-width:520px}.pillars,.cards{grid-template-columns:1fr 1fr}.pillars article{border-right:0}.brand strong{font-size:34px}}@media(max-width:700px){.actions .login,.actions .demo{display:none}.hero{padding:26px 20px}.topbar{padding:18px}.brand img{width:58px;height:58px}.brand strong{font-size:28px}.brand small{font-size:11px}.copy h1,h1{font-size:38px}.buttons{flex-direction:column}.primary,.secondary{width:100%}.pillars,.cards{grid-template-columns:1fr;margin-left:20px;margin-right:20px;padding-left:0;padding-right:0}.cards{padding-left:20px;padding-right:20px;margin:0}.brain-stage strong{font-size:40px}}
`;

export default PatroaiLanding;
