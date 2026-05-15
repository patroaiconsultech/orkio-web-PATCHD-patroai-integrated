import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";

const COPY = {
  pt: {
    nav: ["Soluções", "Plataforma", "Recursos", "Segmentos", "Academia", "Sobre nós"],
    eyebrow: "INOVAÇÃO · ESTRATÉGIA · EXECUÇÃO · ESG",
    title: (
      <>
        Desenvolvemos sistemas<br />
        de <span className="gold">inovação</span> que impulsionam<br />
        empresas a evoluir, <span className="gold">prosperar</span><br />
        e gerar impacto sustentável.
      </>
    ),
    subtitle:
      "A PATROAI cria e implanta ecossistemas inteligentes com a plataforma Orkio — um cérebro de IA ultra avançado, auditável e governável, que reconhece as dores do negócio, planeja o futuro e participa da execução com máxima eficiência e governança.",
    demo: "Agendar uma demonstração",
    how: "Ver como funciona",
    login: "Login",
    assistantTitle: "Olá! Eu sou a Orkio.",
    assistantText:
      "Sou a inteligência que trabalha ao lado da sua empresa para planejar, executar e gerar resultados reais e sustentáveis.",
    talk: "Conversar agora",
    pillars: [
      ["shield", "Governança e Segurança", "IA auditável, governável e em conformidade com LGPD."],
      ["brain", "Estratégia Inteligente", "Planejamento sustentável de longo prazo alinhado ao seu propósito e mercado."],
      ["chart", "Execução com IA", "Agentes inteligentes que executam, acompanham e otimizam processos."],
      ["leaf", "ESG Integrado", "Decisões conscientes que geram impacto positivo e valor duradouro."],
    ],
    cards: [
      ["team", "Sistemas de Inovação Personalizados", "Desenvolvemos soluções sob medida para os desafios únicos da sua empresa."],
      ["nodes", "Plataforma Orkio White Label", "Sua marca, nossa tecnologia. Escalável, evolutiva e totalmente integrada."],
      ["target", "IA que Entende seu Negócio", "Reconhece dores, identifica oportunidades e propõe o melhor caminho para crescer."],
      ["rocket", "Evolução Contínua com Resultados Reais", "Aprende, se adapta e impulsiona resultados cada vez maiores."],
    ],
  },
  en: {
    nav: ["Solutions", "Platform", "Resources", "Segments", "Academy", "About"],
    eyebrow: "INNOVATION · STRATEGY · EXECUTION · ESG",
    title: (
      <>
        We build intelligent<br />
        <span className="gold">innovation</span> systems that help<br />
        companies evolve, <span className="gold">prosper</span><br />
        and create sustainable impact.
      </>
    ),
    subtitle:
      "PATROAI creates and deploys intelligent ecosystems powered by Orkio — an advanced, auditable and governable AI brain that recognizes business pain points, plans the future and participates in execution with maximum efficiency and governance.",
    demo: "Schedule a demo",
    how: "See how it works",
    login: "Login",
    assistantTitle: "Hello! I am Orkio.",
    assistantText:
      "I am the intelligence that works alongside your company to plan, execute and generate real, sustainable results.",
    talk: "Talk now",
    pillars: [
      ["shield", "Governance & Security", "Auditable, governable AI aligned with data protection."],
      ["brain", "Strategic Intelligence", "Long-term sustainable planning aligned with purpose and market."],
      ["chart", "AI Execution", "Intelligent agents that execute, monitor and optimize processes."],
      ["leaf", "ESG Integrated", "Conscious decisions that create positive impact and long-term value."],
    ],
    cards: [
      ["team", "Custom Innovation Systems", "Tailored solutions for your company's unique challenges."],
      ["nodes", "Orkio White Label Platform", "Your brand, our technology. Scalable, evolutive and fully integrated."],
      ["target", "AI That Understands Your Business", "Recognizes pain points, identifies opportunities and proposes the best path."],
      ["rocket", "Continuous Evolution with Real Results", "Learns, adapts and drives ever-increasing business outcomes."],
    ],
  },
};

function Icon({ name }) {
  const paths = {
    shield: "M12 2l7 3v6c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V5l7-3zm-3 10l2 2 4-5",
    brain: "M8 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0V8zm4-4v16M7 10H4m16 0h-3M7 15H4m16 0h-3",
    chart: "M4 19h16M7 16v-5m5 5V7m5 9v-9M6 8l4-3 4 2 4-5",
    leaf: "M20 4C12 4 6 8 5 16c6 1 12-1 15-12zM5 20c3-5 7-8 13-11",
    team: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a5 5 0 0 1 10 0m-2 0a5 5 0 0 1 10 0",
    nodes: "M6 6h4v4H6V6zm8 0h4v4h-4V6zM6 14h4v4H6v-4zm8 0h4v4h-4v-4zM10 8h4M8 10v4m8-4v4m-6 2h4",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    rocket: "M13 3c4 1 7 4 8 8l-5 5-5-5 2-8zM8 14l2 2-4 4-2-2 4-4zm7-6l2 2",
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name] || paths.brain} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PatroaiLanding() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("pt");
  const t = COPY[lang];

  const goOrkio = () => navigate("/orkio?start=prechat");
  const demo = () => navigate("/orkio?start=prechat");
  const login = () => navigate("/auth");
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="patroai-page">
      <style>{`
        :root{--bg:#02060c;--line:rgba(255,255,255,.12);--white:#f8fbff;--gold:#f5b821;--gold2:#ffe58a;--purple:#9b3cff;--green:#92f25e;--blue:#32a9ff}
        *{box-sizing:border-box}body{margin:0;background:#02060c;color:var(--white);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,a{font:inherit}
        .patroai-page{min-height:100vh;background:radial-gradient(circle at 58% 31%,rgba(245,184,33,.16),transparent 30%),radial-gradient(circle at 82% 20%,rgba(155,60,255,.13),transparent 26%),linear-gradient(180deg,#030407 0%,#02060c 58%,#010307 100%);overflow:hidden;position:relative}
        .patroai-page:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(255,214,91,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,214,91,.025) 1px,transparent 1px);background-size:76px 76px;mask-image:linear-gradient(to bottom,black 0%,black 74%,transparent 100%);opacity:.35;pointer-events:none}
        .container{width:min(1480px,calc(100% - 56px));margin:0 auto;position:relative;z-index:1}.topbar{height:94px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.055)}
        .brand{display:flex;align-items:center;gap:14px;border:0;background:transparent;color:inherit;padding:0;cursor:pointer}.brand-emblem{width:78px;height:78px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(245,184,33,.52);background:radial-gradient(circle,#2b2108,#02060c 65%);box-shadow:0 0 30px rgba(245,184,33,.28);overflow:hidden}.brand-emblem img{width:100%;height:100%;object-fit:cover}.tree-fallback{font-size:40px;color:var(--gold);filter:drop-shadow(0 0 12px rgba(245,184,33,.8))}
        .brand-word{line-height:.94}.brand-main{font-size:40px;font-weight:900;letter-spacing:.06em}.brand-main .ai{color:var(--gold)}.brand-sub{display:block;font-size:15px;letter-spacing:.52em;color:var(--gold);margin-top:9px}.nav{display:flex;align-items:center;gap:42px;color:rgba(255,255,255,.86);font-weight:520}.nav button{background:transparent;color:inherit;border:0;cursor:pointer;padding:10px 0}.nav button:hover{color:white}.actions{display:flex;align-items:center;gap:16px}
        .btn{border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.03);color:white;padding:14px 22px;cursor:pointer;transition:.25s ease;display:inline-flex;align-items:center;justify-content:center;gap:10px;text-decoration:none}.btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.07)}.btn-primary{background:linear-gradient(135deg,var(--gold),#9f6d10);border-color:rgba(255,221,111,.6);box-shadow:0 0 34px rgba(245,184,33,.22);font-weight:800}.btn-secondary{background:rgba(3,8,15,.65);border-color:rgba(255,255,255,.18)}.btn-purple{background:linear-gradient(135deg,#5524c9,#a318d6);border:1px solid rgba(190,98,255,.62);box-shadow:0 0 28px rgba(155,60,255,.25);width:100%}.lang{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.04);color:rgba(255,255,255,.8);cursor:pointer}
        .hero{display:grid;grid-template-columns:minmax(360px,.9fr) minmax(420px,1.04fr) minmax(330px,.82fr);gap:38px;align-items:center;padding:50px 0 32px}.eyebrow{display:inline-flex;border:1px solid rgba(245,184,33,.48);color:#ffd444;border-radius:999px;padding:10px 18px;letter-spacing:.075em;font-size:14px;font-weight:800;background:rgba(255,202,47,.04);margin-bottom:28px}
        h1{margin:0;font-size:clamp(40px,3.5vw,62px);line-height:1.1;letter-spacing:-.052em}.gold{background:linear-gradient(90deg,#f5b821 0%,#ffe58a 60%,#b77d14 100%);-webkit-background-clip:text;background-clip:text;color:transparent}.hero p{color:rgba(255,255,255,.78);font-size:17px;line-height:1.68;margin:26px 0 30px;max-width:650px}.hero-ctas{display:flex;gap:18px;flex-wrap:wrap}
        .visual-stage{position:relative;min-height:460px;display:grid;place-items:center}.halo{position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(255,202,69,.28),transparent 18%),radial-gradient(circle at 50% 50%,transparent 36%,rgba(245,184,33,.95) 37%,rgba(245,184,33,.2) 38%,transparent 39%),radial-gradient(circle at 50% 50%,rgba(255,213,81,.12),transparent 65%);filter:drop-shadow(0 0 30px rgba(245,184,33,.45));animation:pulse 4.2s ease-in-out infinite}.brain-icon{width:430px;height:430px;position:relative;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 50% 47%,rgba(255,236,151,.16),transparent 58%)}.brain-lines{position:absolute;inset:55px;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,transparent 0 18px,rgba(245,184,33,.08) 19px 20px),linear-gradient(90deg,transparent 49%,rgba(255,218,105,.9) 50%,transparent 51%)}.brain-lines:before,.brain-lines:after{content:"";position:absolute;inset:25px;border:2px solid rgba(255,220,107,.55);border-radius:50%;filter:drop-shadow(0 0 10px rgba(255,198,48,.6))}.brain-lines:after{inset:70px;border-style:dotted;opacity:.8}.circuit{position:absolute;inset:98px;border-radius:50%;background:repeating-linear-gradient(90deg,transparent 0 18px,rgba(255,218,105,.5) 19px 21px,transparent 22px 34px);clip-path:polygon(50% 0,84% 20%,86% 61%,64% 100%,36% 100%,14% 61%,16% 20%);opacity:.82}.central-word{position:relative;z-index:3;font-size:64px;font-weight:900;letter-spacing:-.045em;color:#fff;text-shadow:0 7px 22px rgba(0,0,0,.72),0 0 18px rgba(255,255,255,.18)}.pedestal{position:absolute;bottom:38px;width:260px;height:48px;border-radius:50%;border:1px solid rgba(245,184,33,.55);background:radial-gradient(ellipse at center,rgba(245,184,33,.22),transparent 68%);filter:drop-shadow(0 0 20px rgba(245,184,33,.3))}
        .assistant-card{border:1px solid rgba(155,60,255,.34);border-radius:22px;padding:20px;background:linear-gradient(180deg,rgba(34,15,58,.45),rgba(5,9,16,.9));box-shadow:0 0 52px rgba(155,60,255,.13)}.assistant-portrait{position:relative;height:270px;border-radius:18px;background:radial-gradient(circle at 50% 35%,rgba(92,216,255,.18),transparent 28%),linear-gradient(180deg,rgba(4,20,32,.75),rgba(5,8,15,.35));overflow:hidden;display:grid;place-items:center}.human-android{position:absolute;bottom:-12px;width:190px;height:250px}.human-head{position:absolute;top:8px;left:38px;width:118px;height:150px;border-radius:45% 45% 42% 42%;background:linear-gradient(180deg,#dcecff,#9fb4c8 26%,#233244 58%,#0c121b 100%);box-shadow:inset 0 0 24px rgba(255,255,255,.22),0 0 30px rgba(88,190,255,.35)}.human-head:before{content:"";position:absolute;left:29px;right:29px;top:84px;height:15px;border-bottom:3px solid rgba(255,255,255,.84);border-radius:0 0 32px 32px}.eye{position:absolute;top:61px;width:13px;height:13px;background:#8e54ff;border-radius:50%;box-shadow:0 0 16px #9f55ff}.eye.l{left:34px}.eye.r{right:34px}.human-body{position:absolute;bottom:0;width:190px;height:110px;border-radius:70px 70px 20px 20px;background:linear-gradient(120deg,#111827,#1b2230 46%,#060913);border:1px solid rgba(255,255,255,.1);box-shadow:0 -12px 35px rgba(155,60,255,.2)}.human-core{position:absolute;left:74px;bottom:48px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle,#ffd972,transparent 60%);border:1px solid rgba(245,184,33,.55);box-shadow:0 0 26px rgba(245,184,33,.45)}.assistant-card h3{font-size:24px;margin:18px 0 8px}.assistant-card p{font-size:16px;line-height:1.55;margin:0 0 18px;color:rgba(255,255,255,.76)}
        .pill-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:22px 0;margin:8px 0 28px}.pill{display:flex;gap:14px;padding:0 22px;border-right:1px solid rgba(255,255,255,.12);align-items:center}.pill:last-child{border-right:0}.ico{width:46px;height:46px;border-radius:14px;border:1px solid currentColor;display:grid;place-items:center;color:var(--gold);filter:drop-shadow(0 0 10px currentColor)}.ico.purple{color:#c23dff}.ico.green{color:#8df95a}.ico svg{width:24px;height:24px}.pill strong{display:block;font-size:17px;margin-bottom:6px}.pill span{color:rgba(255,255,255,.66);font-size:14px;line-height:1.35}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding-bottom:58px}.card{border:1px solid rgba(255,255,255,.1);border-radius:20px;background:linear-gradient(180deg,rgba(7,17,30,.72),rgba(4,9,16,.86));padding:28px;min-height:190px;box-shadow:0 0 35px rgba(0,0,0,.28);position:relative;overflow:hidden}.card h3{font-size:22px;margin:18px 0 10px}.card p{color:rgba(255,255,255,.68);line-height:1.55;margin:0}
        @keyframes pulse{0%,100%{transform:scale(.98);opacity:.86}50%{transform:scale(1.03);opacity:1}}
        @media(max-width:1180px){.hero{grid-template-columns:1fr;gap:22px}.visual-stage{min-height:420px}.assistant-card{max-width:560px;margin:auto}.pill-row,.cards{grid-template-columns:1fr 1fr}.pill{border-right:0;border-bottom:1px solid rgba(255,255,255,.1);padding:18px}.nav{display:none}}
        @media(max-width:720px){.container{width:min(100% - 28px,1480px)}.topbar{height:auto;padding:18px 0}.actions{display:none}.brand-main{font-size:30px}.brand-sub{font-size:11px}.brand-emblem{width:56px;height:56px}.hero{padding-top:28px}.hero-ctas{flex-direction:column}.btn{width:100%}.halo{width:330px;height:330px}.brain-icon{width:310px;height:310px}.central-word{font-size:44px}.pill-row,.cards{grid-template-columns:1fr}}`}</style>

      <div className="container">
        <header className="topbar">
          <button className="brand" onClick={() => scroll("top")} aria-label="PatroAI home">
            <span className="brand-emblem">
              <img src={A + "logo-patroai-novo.png"} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <span className="tree-fallback">♧</span>
            </span>
            <span className="brand-word">
              <span className="brand-main">PATRO<span className="ai">AI</span></span>
              <span className="brand-sub">CONSULTECH</span>
            </span>
          </button>
          <nav className="nav">
            {t.nav.map((n) => <button key={n} onClick={() => n.toLowerCase().includes("plata") || n.toLowerCase().includes("platform") ? goOrkio() : scroll("recursos")}>{n}</button>)}
          </nav>
          <div className="actions">
            <button className="btn btn-secondary" onClick={login}>{t.login}</button>
            <button className="btn btn-primary" onClick={demo}>{t.demo} →</button>
            <button className="lang" onClick={() => setLang(lang === "pt" ? "en" : "pt")}>{lang === "pt" ? "EN" : "PT"}</button>
          </div>
        </header>

        <section id="top" className="hero">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={demo}>{t.demo} →</button>
              <button className="btn btn-secondary" onClick={goOrkio}>{t.how} ▶</button>
            </div>
          </div>

          <div className="visual-stage" aria-label="PatroAI intelligence core">
            <div className="halo" />
            <div className="brain-icon">
              <div className="brain-lines" />
              <div className="circuit" />
              <div className="central-word">PatroAI</div>
            </div>
            <div className="pedestal" />
          </div>

          <aside className="assistant-card">
            <div className="assistant-portrait" aria-hidden="true">
              <div className="human-android">
                <div className="human-head"><span className="eye l" /><span className="eye r" /></div>
                <div className="human-body" />
                <div className="human-core" />
              </div>
            </div>
            <h3>{t.assistantTitle}</h3>
            <p>{t.assistantText}</p>
            <button className="btn btn-purple" onClick={goOrkio}>{t.talk} ◌</button>
          </aside>
        </section>

        <section id="recursos" className="pill-row">
          {t.pillars.map(([icon, h, d], idx) => <div className="pill" key={h}><span className={`ico ${idx === 1 ? "purple" : idx === 3 ? "green" : ""}`}><Icon name={icon} /></span><div><strong>{h}</strong><span>{d}</span></div></div>)}
        </section>

        <section className="cards">
          {t.cards.map(([icon, h, d], idx) => <article className="card" key={h}><span className={`ico ${idx === 0 || idx === 3 ? "purple" : ""}`}><Icon name={icon} /></span><h3>{h}</h3><p>{d}</p></article>)}
        </section>
      </div>
    </main>
  );
}
