import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";

const PT = {
  nav: ["Soluções", "Plataforma", "Recursos", "Segmentos", "Academia", "Sobre nós"],
  eyebrow: "INOVAÇÃO · ESTRATÉGIA · EXECUÇÃO · ESG",
  title: <>Desenvolvemos sistemas<br/>de <span className="grad-gold">inovação</span> que impulsionam<br/>empresas a evoluir, <span className="grad-gold">prosperar</span><br/>e gerar impacto sustentável.</>,
  subtitle: "A PatroAI cria e implanta ecossistemas inteligentes com a plataforma Orkio — um cérebro de IA ultra avançado, auditável e governável, que reconhece as dores do negócio, planeja o futuro e participa da execução com máxima eficiência e governança.",
  primary: "Conhecer o Orkio OS",
  secondary: "Ver experiência Orkio",
  avatarTitle: "Olá! Eu sou o Orkio.",
  avatarText: "Sou a inteligência que trabalha ao lado da sua empresa para planejar, executar e gerar resultados reais e sustentáveis.",
  pillars: [
    ["🛡", "Governança e Segurança", "IA auditável, governável e em conformidade com LGPD."],
    ["🧠", "Estratégia Inteligente", "Planejamento sustentável de longo prazo alinhado ao seu propósito e mercado."],
    ["📈", "Execução com IA", "Agentes inteligentes que executam, acompanham e otimizam processos."],
    ["🌿", "ESG Integrado", "Decisões conscientes que geram impacto positivo e valor duradouro."]
  ],
  cards: [
    ["👥", "Sistemas de Inovação Personalizados", "Desenvolvemos soluções sob medida para os desafios únicos da sua empresa."],
    ["🔗", "Plataforma Orkio White Label", "Sua marca, nossa tecnologia. Escalável, evolutiva e totalmente integrada."],
    ["🎯", "IA que Entende seu Negócio", "Reconhece dores, identifica oportunidades e propõe o melhor caminho para crescer."],
    ["🚀", "Evolução Contínua com Resultados Reais", "Aprende, se adapta e impulsiona resultados cada vez maiores."]
  ]
};

const EN = {
  nav: ["Solutions", "Platform", "Resources", "Segments", "Academy", "About"],
  eyebrow: "INNOVATION · STRATEGY · EXECUTION · ESG",
  title: <>We build intelligent<br/><span className="grad-gold">innovation</span> systems that help<br/>companies evolve, <span className="grad-gold">scale</span><br/>and create sustainable impact.</>,
  subtitle: "PatroAI creates and implements intelligent ecosystems powered by Orkio — an advanced, auditable and governable AI brain that understands business pain points, plans the future and participates in execution.",
  primary: "Explore Orkio OS",
  secondary: "See Orkio experience",
  avatarTitle: "Hi! I am Orkio.",
  avatarText: "I work alongside your company to plan, execute and generate real, sustainable results.",
  pillars: [
    ["🛡", "Governance & Security", "Auditable, governable AI aligned with privacy and compliance."],
    ["🧠", "Strategic Intelligence", "Long-term planning aligned with purpose, market and execution."],
    ["📈", "AI Execution", "Intelligent agents execute, monitor and optimize business processes."],
    ["🌿", "Integrated ESG", "Conscious decisions that create positive impact and lasting value."]
  ],
  cards: [
    ["👥", "Custom Innovation Systems", "Tailored solutions for the unique challenges of your company."],
    ["🔗", "Orkio White Label Platform", "Your brand, our technology. Scalable, evolutionary and fully integrated."],
    ["🎯", "AI that Understands Business", "Recognizes pain points, identifies opportunities and proposes paths to growth."],
    ["🚀", "Continuous Evolution", "Learns, adapts and drives better results over time."]
  ]
};

export default function PatroaiLanding() {
  const navigate = useNavigate?.();
  const [lang, setLang] = useState("pt");
  const t = lang === "pt" ? PT : EN;

  const go = (path) => {
    try { navigate(path); }
    catch { window.location.href = path; }
  };
  const mail = () => {
    window.location.href = "mailto:contato@patroai.com?subject=Agendar%20demonstra%C3%A7%C3%A3o%20PatroAI";
  };
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="lp-shell patroai">
      <style>{`/* V3 official landing styles */
  :root{--bg:#02060c;--panel:#06111b;--line:rgba(255,255,255,.12);--soft:rgba(255,255,255,.72);--white:#f8fbff;--gold:#f5b821;--gold2:#ffe58a;--green:#92f25e;--blue:#32a9ff;--cyan:#63e6ff;--purple:#9b3cff}
  *{box-sizing:border-box} body{margin:0;background:#02060c;color:var(--white);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif} button,a{font:inherit}
  .lp-shell{min-height:100vh;background:radial-gradient(circle at 62% 30%,rgba(42,153,255,.16),transparent 31%),radial-gradient(circle at 82% 20%,rgba(114,255,74,.08),transparent 26%),radial-gradient(circle at 48% 60%,rgba(255,183,33,.12),transparent 28%),linear-gradient(180deg,#030911 0%,#02060c 58%,#010307 100%);overflow:hidden;position:relative}
  .lp-shell::before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,transparent,black 12%,black 82%,transparent);opacity:.32;pointer-events:none}
  .container{width:min(1460px,calc(100% - 56px));margin:0 auto;position:relative;z-index:1}.topbar{height:96px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
  .brand{display:flex;align-items:center;gap:14px;cursor:pointer;border:0;background:transparent;color:inherit;padding:0}.brand-emblem{width:72px;height:72px;border-radius:50%;object-fit:contain;filter:drop-shadow(0 0 24px rgba(255,185,33,.38))}
  .brand-word{line-height:.92}.brand-main{font-size:40px;font-weight:800;letter-spacing:.055em}.brand-main .gold{color:var(--gold)}.brand-sub{display:block;font-size:15px;letter-spacing:.48em;color:var(--gold);margin-top:9px}.brand-os{font-size:23px;color:var(--green);font-weight:800;margin-left:6px}
  .nav{display:flex;align-items:center;gap:44px;color:rgba(255,255,255,.86);font-weight:520}.nav button{background:transparent;color:inherit;border:0;cursor:pointer;padding:10px 0}.nav button:hover{color:white}.actions{display:flex;align-items:center;gap:16px}
  .btn{border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.03);color:white;padding:14px 22px;cursor:pointer;transition:.25s ease;display:inline-flex;align-items:center;gap:10px;text-decoration:none}.btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.07)}
  .btn-primary{background:linear-gradient(135deg,var(--gold),#9f6d10);border-color:rgba(255,221,111,.55);color:#fff;box-shadow:0 0 28px rgba(245,184,33,.22)}.orkio .btn-primary{background:linear-gradient(135deg,#9cf35b,#4fae33);color:#06110a;border-color:rgba(156,243,91,.55)}.btn-secondary{background:rgba(4,12,22,.65);border-color:rgba(255,255,255,.18)}.btn-purple{background:linear-gradient(135deg,#5627c9,#a318d6);border:1px solid rgba(190,98,255,.62);box-shadow:0 0 28px rgba(155,60,255,.25);width:100%;justify-content:center}.lang{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.04);color:rgba(255,255,255,.8);cursor:pointer}
  .hero{display:grid;grid-template-columns:minmax(360px,.9fr) minmax(420px,1fr) minmax(330px,.8fr);gap:42px;align-items:center;padding:54px 0 34px}.eyebrow{display:inline-flex;border:1px solid rgba(245,184,33,.48);color:#ffd444;border-radius:999px;padding:10px 18px;letter-spacing:.08em;font-size:14px;font-weight:700;background:rgba(255,202,47,.04);margin-bottom:28px}.orkio .eyebrow{border-color:rgba(146,242,94,.52);color:var(--green);background:rgba(146,242,94,.05)}
  h1{margin:0;font-size:clamp(44px,4.2vw,72px);line-height:1.08;letter-spacing:-.055em}.grad-gold{background:linear-gradient(90deg,#fff 0%,#fff 30%,#f8c12b 52%,#ffdf7f 74%);-webkit-background-clip:text;background-clip:text;color:transparent}.grad-blue{background:linear-gradient(90deg,#8af15a 0%,#47a9ff 70%,#e8edf4 100%);-webkit-background-clip:text;background-clip:text;color:transparent}.hero p{color:rgba(255,255,255,.78);font-size:18px;line-height:1.7;margin:28px 0 32px;max-width:650px}.hero-ctas{display:flex;gap:18px;flex-wrap:wrap}
  .visual-stage{position:relative;min-height:460px;display:grid;place-items:center}.halo{position:absolute;width:540px;height:540px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(255,202,69,.28),transparent 18%),radial-gradient(circle at 50% 50%,transparent 36%,rgba(245,184,33,.95) 37%,rgba(245,184,33,.2) 38%,transparent 39%),radial-gradient(circle at 50% 50%,rgba(255,213,81,.12),transparent 65%);filter:drop-shadow(0 0 26px rgba(245,184,33,.45));animation:pulse 4s ease-in-out infinite}.orkio .halo{background:radial-gradient(circle at 50% 50%,rgba(76,179,255,.22),transparent 18%),radial-gradient(circle at 50% 50%,transparent 36%,rgba(92,216,255,.82) 37%,rgba(92,216,255,.18) 38%,transparent 39%),radial-gradient(circle at 50% 50%,rgba(146,242,94,.15),transparent 65%)}
  .brain-icon{width:430px;height:430px;position:relative;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 50% 47%,rgba(255,236,151,.16),transparent 58%)}.brain-lines{position:absolute;inset:58px;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,transparent 0 18px,rgba(245,184,33,.08) 19px 20px),linear-gradient(90deg,transparent 49%,rgba(255,218,105,.9) 50%,transparent 51%)}.brain-lines::before,.brain-lines::after{content:"";position:absolute;inset:25px;border:2px solid rgba(255,220,107,.55);border-radius:50%;filter:drop-shadow(0 0 10px rgba(255,198,48,.6))}.brain-lines::after{inset:70px;border-style:dotted;opacity:.8}.central-word{position:relative;z-index:3;font-size:64px;font-weight:900;letter-spacing:-.045em;color:#fff;text-shadow:0 7px 22px rgba(0,0,0,.72),0 0 18px rgba(255,255,255,.18)}.pedestal{position:absolute;bottom:38px;width:260px;height:48px;border-radius:50%;border:1px solid rgba(245,184,33,.55);background:radial-gradient(ellipse at center,rgba(245,184,33,.22),transparent 68%);filter:drop-shadow(0 0 20px rgba(245,184,33,.3))}.orbit-dot{position:absolute;width:10px;height:10px;background:#ffd75c;border-radius:50%;box-shadow:0 0 20px #ffc729}.d1{top:44px}.d2{right:48px;top:230px}.d3{bottom:88px;left:116px}.d4{left:42px;top:224px}
  .orkio-sphere{position:relative;z-index:2;width:340px;height:340px;object-fit:contain;filter:drop-shadow(0 0 36px rgba(68,178,255,.5)) drop-shadow(0 18px 42px rgba(0,0,0,.75));animation:float 6s ease-in-out infinite}.network{position:absolute;right:-40px;width:470px;height:380px;opacity:.8;background:linear-gradient(90deg,transparent,rgba(52,170,255,.22),transparent),repeating-linear-gradient(12deg,transparent 0 28px,rgba(85,200,255,.22) 29px 30px);mask-image:linear-gradient(90deg,transparent,black 16%,black 74%,transparent);filter:drop-shadow(0 0 20px rgba(67,177,255,.25))}.systems-list{position:absolute;right:-20px;top:84px;display:grid;gap:16px;z-index:3}.sys{display:flex;align-items:center;gap:12px;color:#eaf8ff;font-size:14px}.sys i{width:42px;height:42px;border-radius:50%;border:1px solid rgba(99,230,255,.64);display:grid;place-items:center;background:rgba(2,12,20,.8);box-shadow:0 0 18px rgba(99,230,255,.18)}
  .dashboard-card{position:relative;border:1px solid rgba(99,230,255,.2);background:linear-gradient(180deg,rgba(4,17,28,.82),rgba(2,8,15,.9));border-radius:18px;padding:18px;box-shadow:0 0 44px rgba(54,168,255,.09)}.dashboard-title{text-align:center;font-size:13px;letter-spacing:.08em;font-weight:800;color:#eaffff;margin-bottom:12px}.dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.metric-card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);border-radius:12px;padding:14px}.rings{display:flex;gap:12px}.ring{width:60px;height:60px;border-radius:50%;border:6px solid rgba(146,242,94,.28);border-top-color:var(--green);display:grid;place-items:center;font-size:13px;font-weight:800}.line-chart{height:82px;background:linear-gradient(135deg,transparent 20%,rgba(71,169,255,.1));border-bottom:1px solid rgba(83,200,255,.25);position:relative;overflow:hidden}.line-chart::before{content:"";position:absolute;inset:28px 0 18px 0;border-top:3px solid #56c7ff;transform:skewY(-14deg)}.mini-flow{height:82px;display:grid;place-items:center;color:rgba(255,255,255,.75);font-size:13px}.insight{grid-column:1/3;font-size:12px;color:rgba(255,255,255,.62)}
  .assistant-card{border:1px solid rgba(155,60,255,.34);border-radius:22px;padding:22px;background:linear-gradient(180deg,rgba(34,15,58,.45),rgba(5,9,16,.9));box-shadow:0 0 52px rgba(155,60,255,.13)}.avatar-human{position:relative;height:255px;border-radius:18px;background:radial-gradient(circle at 50% 30%,rgba(92,216,255,.18),transparent 26%),radial-gradient(circle at 50% 72%,rgba(245,184,33,.1),transparent 24%),linear-gradient(180deg,rgba(4,20,32,.75),rgba(5,8,15,.35));overflow:hidden;display:grid;place-items:center}.avatar-head{position:absolute;top:32px;width:118px;height:138px;border-radius:45% 45% 42% 42%;background:linear-gradient(180deg,#dcefff,#6e8196 38%,#111925 74%);box-shadow:inset 0 0 25px rgba(255,255,255,.26),0 0 26px rgba(76,179,255,.45)}.avatar-head::before{content:"";position:absolute;left:-18px;top:54px;width:20px;height:42px;border-radius:12px;background:linear-gradient(180deg,#ffd45b,#462c92);box-shadow:154px 0 0 #6a38dc}.avatar-eye{position:absolute;top:72px;width:14px;height:14px;background:#8e54ff;border-radius:50%;box-shadow:0 0 16px #9f55ff}.avatar-eye.left{left:36px}.avatar-eye.right{right:36px}.avatar-smile{position:absolute;left:42px;top:104px;width:34px;height:16px;border-bottom:3px solid rgba(255,255,255,.82);border-radius:0 0 30px 30px}.avatar-body{position:absolute;bottom:-20px;width:200px;height:110px;border-radius:70px 70px 20px 20px;background:linear-gradient(120deg,#111827,#1b2230 46%,#060913);border:1px solid rgba(255,255,255,.1);box-shadow:0 -12px 35px rgba(155,60,255,.2)}.avatar-core{position:absolute;bottom:50px;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle,#ffd972,transparent 60%);border:1px solid rgba(245,184,33,.55);box-shadow:0 0 26px rgba(245,184,33,.45)}.assistant-card h3{font-size:25px;margin:18px 0 8px}.assistant-card p{font-size:16px;line-height:1.55;margin:0 0 18px;color:rgba(255,255,255,.76)}
  .pill-row{display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:22px 0;margin:8px 0 28px}.patroai .pill-row{grid-template-columns:repeat(4,1fr)}.pill{display:flex;gap:14px;padding:0 20px;border-right:1px solid rgba(255,255,255,.12);align-items:center}.pill:last-child{border-right:0}.ico{width:44px;height:44px;border-radius:14px;border:1px solid currentColor;display:grid;place-items:center;font-size:22px;filter:drop-shadow(0 0 10px currentColor)}.pill strong{display:block;font-size:17px;margin-bottom:6px}.pill span{color:rgba(255,255,255,.66);font-size:14px;line-height:1.35}.section-title{text-align:center;font-size:22px;letter-spacing:.12em;margin:28px 0;color:rgba(255,255,255,.75)}.section-title b{color:var(--green)}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;padding-bottom:52px}.card{border:1px solid rgba(255,255,255,.1);border-radius:20px;background:linear-gradient(180deg,rgba(7,17,30,.72),rgba(4,9,16,.86));padding:28px;min-height:190px;box-shadow:0 0 35px rgba(0,0,0,.28);position:relative;overflow:hidden}.card::after{content:"";position:absolute;inset:auto -40px -50px auto;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(80,180,255,.14),transparent 65%)}.card h3{font-size:22px;margin:18px 0 10px}.card p{color:rgba(255,255,255,.68);line-height:1.55;margin:0}.arrow-line{position:absolute;right:-24px;top:50%;color:var(--green);font-size:38px;z-index:4}
  @keyframes pulse{0%,100%{transform:scale(.98);opacity:.82}50%{transform:scale(1.03);opacity:1}}@keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-16px) rotate(2deg)}}
  @media(max-width:1180px){.hero{grid-template-columns:1fr;gap:22px}.visual-stage{min-height:420px}.assistant-card{max-width:560px;margin:auto}.pill-row,.cards,.patroai .pill-row{grid-template-columns:1fr 1fr}.pill{border-right:0;border-bottom:1px solid rgba(255,255,255,.1);padding:18px}.nav{display:none}}
  @media(max-width:720px){.container{width:min(100% - 28px,1460px)}.topbar{height:auto;padding:18px 0;align-items:flex-start;gap:14px}.actions{display:none}.brand-main{font-size:30px}.brand-sub{font-size:11px}.brand-emblem{width:56px;height:56px}.hero{padding-top:28px}.hero-ctas{flex-direction:column}.btn{width:100%;justify-content:center}.halo{width:330px;height:330px}.brain-icon{width:310px;height:310px}.central-word{font-size:44px}.orkio-sphere{width:260px;height:260px}.systems-list{position:relative;right:auto;top:auto;grid-template-columns:1fr 1fr}.dashboard-grid,.insight{grid-template-columns:1fr}.pill-row,.cards,.patroai .pill-row{grid-template-columns:1fr}}`}</style>
      <div className="container">
        <header className="topbar">
          <button className="brand" onClick={() => go("/")} aria-label="PatroAI home">
            <img className="brand-emblem" src={A + "logo-patroai-oficial.png"} alt="PatroAI" />
            <span className="brand-word">
              <span className="brand-main">PATRO<span className="gold">AI</span></span>
              <span className="brand-sub">CONSULTECH</span>
            </span>
          </button>
          <nav className="nav">
            {t.nav.map((n) => (
              <button key={n} onClick={() => n.toLowerCase().includes("plata") || n.toLowerCase().includes("platform") ? go("/orkio") : scroll("como-funciona")}>{n}</button>
            ))}
          </nav>
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => go("/app")}>Login</button>
            <button className="btn btn-primary" onClick={() => go("/orkio")}>{t.primary} →</button>
            <button className="lang" onClick={() => setLang(lang === "pt" ? "en" : "pt")}>{lang === "pt" ? "EN" : "PT"}</button>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => go("/orkio")}>{t.primary} →</button>
              <button className="btn btn-secondary" onClick={() => scroll("como-funciona")}>{t.secondary} ▶</button>
            </div>
          </div>

          <div className="visual-stage" aria-label="PatroAI intelligence brain">
            <div className="halo" />
            <div className="brain-icon">
              <div className="brain-lines" />
              <div className="central-word">PatroAI</div>
              <span className="orbit-dot d1" /><span className="orbit-dot d2" /><span className="orbit-dot d3" /><span className="orbit-dot d4" />
            </div>
            <div className="pedestal" />
          </div>

          <aside className="assistant-card">
            <div className="avatar-human">
              <div className="avatar-body" />
              <div className="avatar-core" />
              <div className="avatar-head">
                <span className="avatar-eye left" />
                <span className="avatar-eye right" />
                <span className="avatar-smile" />
              </div>
            </div>
            <h3>{t.avatarTitle}</h3>
            <p>{t.avatarText}</p>
            <button className="btn btn-purple" onClick={() => go("/orkio")}>Conversar agora ◔</button>
          </aside>
        </section>

        <section className="pill-row">
          {t.pillars.map(([i,h,d]) => <div className="pill" key={h}><span className="ico" style={{color:h.includes("ESG") ? "#8df95a" : h.includes("Estr") || h.includes("Strateg") ? "#d335ff" : "#f5b821"}}>{i}</span><div><strong>{h}</strong><span>{d}</span></div></div>)}
        </section>

        <section id="como-funciona" className="cards">
          {t.cards.map(([i,h,d]) => <article className="card" key={h}><span className="ico" style={{color:h.includes("Orkio") ? "#46a9ff" : h.includes("Evol") || h.includes("Continuous") ? "#d335ff" : "#f5b821"}}>{i}</span><h3>{h}</h3><p>{d}</p></article>)}
        </section>
      </div>
    </main>
  );
}
