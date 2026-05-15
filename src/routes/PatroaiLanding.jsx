import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";
const WHATSAPP_URL = "https://wa.me/5551989697605?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20a%20PatroAI%20e%20o%20Orkio%20OS.";

const PT = {
  nav: ["Soluções", "Plataforma", "Recursos", "Segmentos", "Academia", "Sobre nós"],
  eyebrow: "INOVAÇÃO · ESTRATÉGIA · EXECUÇÃO · ESG",
  title: <>Desenvolvemos sistemas<br/>de <span>inovação</span> que impulsionam<br/>empresas a evoluir, <span>prosperar</span><br/>e gerar impacto sustentável.</>,
  subtitle: "A PatroAI cria e implanta ecossistemas inteligentes com a plataforma Orkio — um cérebro de IA ultra avançado, auditável e governável, que reconhece as dores do negócio, planeja o futuro e participa da execução com máxima eficiência e governança.",
  primary: "Agendar uma demonstração",
  secondary: "Ver como funciona",
  avatarTitle: "Olá! Eu sou a Orkio.",
  avatarText: "Sou a inteligência que trabalha ao lado da sua empresa para planejar, executar e gerar resultados reais e sustentáveis.",
  talk: "Conversar agora",
  pillars: [
    ["shield", "Governança e Segurança", "IA auditável, governável e em conformidade com LGPD."],
    ["brain", "Estratégia Inteligente", "Planejamento sustentável de longo prazo alinhado ao seu propósito e mercado."],
    ["chart", "Execução com IA", "Agentes inteligentes que executam, acompanham e otimizam processos."],
    ["leaf", "ESG Integrado", "Decisões conscientes que geram impacto positivo e valor duradouro."]
  ],
  cards: [
    ["team", "Sistemas de Inovação Personalizados", "Desenvolvemos soluções sob medida para os desafios únicos da sua empresa."],
    ["nodes", "Plataforma Orkio White Label", "Sua marca, nossa tecnologia. Escalável, evolutiva e totalmente integrada."],
    ["target", "IA que Entende seu Negócio", "Reconhece dores, identifica oportunidades e propõe o melhor caminho para crescer."],
    ["rocket", "Evolução Contínua com Resultados Reais", "Aprende, se adapta e impulsiona resultados cada vez maiores."]
  ],
  orkioTitle: <>Seu negócio<br/><span>operando</span> com<br/><b>inteligência</b> contínua.</>,
  orkioSubtitle: "O Orkio OS conecta estratégia, dados, automação e execução em um ecossistema de agentes inteligentes que evolui com a sua empresa.",
  contactTitle: "Solicite uma conversa estratégica",
  contactText: "Conte o desafio da sua empresa e a equipe PatroAI retornará para avaliar estratégia, implantação, integrações ou white label.",
};

const EN = {
  nav: ["Solutions", "Platform", "Resources", "Segments", "Academy", "About"],
  eyebrow: "INNOVATION · STRATEGY · EXECUTION · ESG",
  title: <>We build intelligent<br/><span>innovation</span> systems that help<br/>companies evolve, <span>scale</span><br/>and create sustainable impact.</>,
  subtitle: "PatroAI creates and implements intelligent ecosystems powered by Orkio — an advanced, auditable and governable AI brain that understands business pain points, plans the future and participates in execution.",
  primary: "Schedule a demo",
  secondary: "See how it works",
  avatarTitle: "Hi! I am Orkio.",
  avatarText: "I work alongside your company to plan, execute and generate real, sustainable results.",
  talk: "Start conversation",
  pillars: [
    ["shield", "Governance & Security", "Auditable, governable AI aligned with privacy and compliance."],
    ["brain", "Strategic Intelligence", "Long-term planning aligned with purpose, market and execution."],
    ["chart", "AI Execution", "Intelligent agents execute, monitor and optimize business processes."],
    ["leaf", "ESG Integrated", "Responsible decisions that generate long-term value."]
  ],
  cards: [
    ["team", "Custom Innovation Systems", "Solutions designed for the unique challenges of your company."],
    ["nodes", "Orkio White Label Platform", "Your brand, our technology. Scalable, evolving and fully integrated."],
    ["target", "AI That Understands Business", "Identifies pain points, opportunities and the best path to growth."],
    ["rocket", "Continuous Evolution", "Learns, adapts and drives increasingly better results."]
  ],
  orkioTitle: <>Your business<br/><span>operating</span> with<br/><b>continuous</b> intelligence.</>,
  orkioSubtitle: "Orkio OS connects strategy, data, automation and execution into an intelligent agent ecosystem that evolves with your company.",
  contactTitle: "Request a strategic conversation",
  contactText: "Tell us about your challenge and the PatroAI team will evaluate strategy, implementation, integrations or white label.",
};

function Icon({ name }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const map = {
    shield: <><path d="M12 3l7 3v5c0 5-3.2 8.6-7 10-3.8-1.4-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/></>,
    brain: <><path d="M8 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3"/><path d="M16 6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3"/><path d="M8 6c0-2 2-3 4-2 2-1 4 0 4 2v12c0 2-2 3-4 2-2 1-4 0-4-2V6z"/><path d="M12 4v16"/></>,
    chart: <><path d="M4 19V5"/><path d="M4 19h16"/><path d="M7 15l4-4 3 3 5-7"/><path d="M17 7h2v2"/></>,
    leaf: <><path d="M20 4c-8 0-13 5-13 13"/><path d="M20 4c0 9-5 14-13 13"/><path d="M7 17c2-4 5-7 9-9"/></>,
    team: <><path d="M16 21v-2a4 4 0 0 0-8 0v2"/><circle cx="12" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M2 21v-2a4 4 0 0 1 3-3.87"/></>,
    nodes: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="9" y="14" width="6" height="6" rx="1"/><path d="M10 7h4M12 10v4"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/><path d="M18 6l2-2"/></>,
    rocket: <><path d="M13 14l7-7c1-1 1-3 1-4-1 0-3 0-4 1l-7 7"/><path d="M8 16l-3 3"/><path d="M9 11l-4 1 3 3 1 4 3-4"/><circle cx="15" cy="9" r="1"/></>,
  };
  return <svg className="icon-svg" {...common}>{map[name] || map.target}</svg>;
}

function PatroAiCoreMark() {
  const rays = Array.from({ length: 12 });
  const circuits = Array.from({ length: 17 });
  return (
    <div className="core-mark" aria-label="PatroAI">
      <div className="core-ring" />
      <div className="core-ring second" />
      <div className="core-particles">{rays.map((_, i) => <i key={i} style={{ "--r": `${i * 30}deg` }} />)}</div>
      <div className="tree">
        {circuits.map((_, i) => (
          <span key={i} className={`branch b${i}`} />
        ))}
        <em className="trunk" />
      </div>
      <strong>PatroAI</strong>
      <div className="stage-glow" />
    </div>
  );
}

function HumanDigitalAvatar({ speaking=false }) {
  return (
    <div className={`human-avatar ${speaking ? "speaking" : ""}`} aria-hidden="true">
      <div className="scanline" />
      <div className="avatar-halo" />
      <div className="head">
        <div className="hair h1" /><div className="hair h2" />
        <div className="face">
          <span className="eye left" /><span className="eye right" />
          <span className="nose" />
          <span className="soft-smile" />
        </div>
      </div>
      <div className="neck" />
      <div className="body">
        <span className="chest-core" />
        <span className="shoulder l" /><span className="shoulder r" />
      </div>
      <div className="hud h1" /><div className="hud h2" /><div className="hud h3" />
    </div>
  );
}

function MiniOrkioSection({ t, go }) {
  const integrations = ["ERP", "CRM", "Financeiro", "Comunicação", "Dados & BI", "APIs & Sistemas"];
  return (
    <section id="platform" className="orkio-strip">
      <div className="orkio-nav">
        <button className="orkio-logo" onClick={() => go("/orkio")}>
          <img src={A + "orkio-sphere-only.png"} alt="" onError={(e)=>{e.currentTarget.style.display="none"}} />
          <span>ORKIO</span><b>OS</b>
        </button>
        <nav><button onClick={() => go("/orkio#recursos")}>Recursos</button><button onClick={() => go("/orkio#como-funciona")}>Como funciona</button><button onClick={() => go("/orkio#integracoes")}>Integrações</button></nav>
        <button className="btn outline" onClick={() => go("/orkio")}>Falar com especialista</button>
      </div>
      <div className="orkio-grid">
        <div className="orkio-copy">
          <small>SISTEMA OPERACIONAL DE INTELIGÊNCIA EMPRESARIAL</small>
          <h2>{t.orkioTitle}</h2>
          <p>{t.orkioSubtitle}</p>
          <div className="row-actions">
            <button className="btn green" onClick={() => go("/orkio")}>Agendar uma demonstração →</button>
            <button className="btn outline" onClick={() => go("/orkio")}>Ver Orkio em ação ▶</button>
          </div>
        </div>
        <div className="orkio-sphere">
          <div className="blue-lines">{integrations.map((_,i)=><i key={i} style={{"--i":i}} />)}</div>
          <img src={A + "orkio-sphere-only.png"} alt="Orkio" onError={(e)=>{e.currentTarget.style.display="none"}} />
          <span className="orb-fallback" />
        </div>
        <div className="orkio-panel">
          <b>Painel Orkio OS <span>em tempo real</span></b>
          <div className="metrics"><span>92%</span><span>85%</span><span>78%</span></div>
          <div className="panel-grid"><i/><i/><i/><i/></div>
          <small>Insights inteligentes · oportunidade de otimização identificada</small>
        </div>
      </div>
    </section>
  );
}

export default function PatroaiLanding() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("pt");
  const [contactOpen, setContactOpen] = useState(false);
  const t = lang === "pt" ? PT : EN;
  const go = (path) => navigate(path);

  const mailto = useMemo(() => {
    const subject = encodeURIComponent("Solicitação estratégica PatroAI");
    const body = encodeURIComponent("Olá, gostaria de conversar sobre PatroAI / Orkio OS.\n\nNome:\nEmpresa:\nSegmento:\nObjetivo:\nIntegrações desejadas:\n");
    return `mailto:daniel@patroai.com?subject=${subject}&body=${body}`;
  }, []);

  return (
    <main className="patroai-page">
      <style>{`
        :root{--gold:#f6b91d;--gold2:#ffe389;--green:#8cf451;--blue:#22a9ff;--purple:#a724ff;--ink:#02050a;--line:rgba(255,255,255,.13);--muted:rgba(255,255,255,.72)}
        *{box-sizing:border-box} body{margin:0;background:#02050a;color:white;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        button,a,input,textarea,select{font:inherit}.patroai-page{min-height:100vh;background:radial-gradient(circle at 65% 24%,rgba(247,185,29,.19),transparent 28%),radial-gradient(circle at 84% 22%,rgba(141,34,255,.18),transparent 22%),linear-gradient(180deg,#010308,#03050b 55%,#010307);overflow:hidden}
        .site{width:min(1510px,calc(100% - 64px));margin:0 auto;position:relative}.site::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent);height:1px;top:96px}
        .topbar{height:96px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;align-items:center;gap:14px;background:transparent;border:0;color:white;cursor:pointer;padding:0}.brand img{width:74px;height:74px;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 22px rgba(246,185,29,.38))}.brand-word{line-height:.92}.brand-word strong{font-size:42px;letter-spacing:.07em}.brand-word strong span{color:var(--gold)}.brand-word small{display:block;margin-top:9px;color:var(--gold);letter-spacing:.58em;font-size:13px}
        .nav{display:flex;align-items:center;gap:38px}.nav button{border:0;background:transparent;color:rgba(255,255,255,.86);cursor:pointer}.nav button:hover{color:white}.top-actions{display:flex;align-items:center;gap:16px}.btn{border:1px solid var(--line);background:rgba(255,255,255,.035);color:white;border-radius:14px;padding:14px 24px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:10px;transition:.22s}.btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.32);background:rgba(255,255,255,.07)}.gold{background:linear-gradient(135deg,#f4be21,#9f6d10);border-color:rgba(255,218,104,.68);box-shadow:0 0 28px rgba(246,185,29,.25)}.purple{background:linear-gradient(135deg,#5b2ade,#b214d4);border-color:rgba(202,93,255,.65);box-shadow:0 0 30px rgba(153,43,255,.25);width:100%}.green{background:linear-gradient(135deg,#a7f96a,#55b73e);color:#061009;border-color:rgba(159,250,97,.55)}.outline{background:rgba(2,8,14,.58);border-color:rgba(255,255,255,.18)}.lang{border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(255,255,255,.04);color:white;padding:10px 12px;cursor:pointer}
        .hero{display:grid;grid-template-columns:minmax(390px,.92fr) minmax(500px,1.1fr) minmax(320px,.74fr);gap:42px;align-items:center;padding:52px 0 40px}.eyebrow{display:inline-flex;border:1px solid rgba(246,185,29,.5);border-radius:999px;color:#ffd74d;background:rgba(246,185,29,.045);padding:10px 18px;font-weight:800;letter-spacing:.08em;font-size:14px;margin-bottom:25px}.copy h1{font-size:clamp(40px,3.9vw,64px);line-height:1.08;letter-spacing:-.055em;margin:0}.copy h1 span{color:var(--gold);text-shadow:0 0 20px rgba(246,185,29,.25)}.copy p{color:rgba(255,255,255,.78);font-size:17px;line-height:1.65;margin:27px 0 30px;max-width:590px}.row-actions{display:flex;gap:18px;flex-wrap:wrap}
        .core-wrap{position:relative;min-height:520px;display:grid;place-items:center}.core-mark{position:relative;width:min(560px,100%);aspect-ratio:1;display:grid;place-items:center;filter:drop-shadow(0 0 20px rgba(246,185,29,.45))}.core-ring{position:absolute;inset:9%;border-radius:50%;border:2px solid rgba(255,213,86,.85);box-shadow:0 0 26px rgba(246,185,29,.48),inset 0 0 42px rgba(246,185,29,.14)}.core-ring.second{inset:17%;border-style:dashed;opacity:.36;animation:spin 28s linear infinite}.core-particles i{position:absolute;left:50%;top:50%;width:9px;height:9px;border-radius:50%;background:#ffe58a;box-shadow:0 0 16px #ffd14a;transform:rotate(var(--r)) translateY(-250px)}.tree{position:absolute;width:70%;height:64%;bottom:16%;left:15%;}.trunk{position:absolute;bottom:0;left:50%;width:10px;height:64%;background:linear-gradient(#ffe483,#f6b91d);box-shadow:0 0 20px rgba(246,185,29,.9);border-radius:999px}.branch{position:absolute;bottom:35%;left:50%;width:3px;background:#ffd45a;border-radius:999px;box-shadow:0 0 11px #ffc83c;transform-origin:bottom}.branch::after{content:"";position:absolute;top:-7px;left:-4px;width:11px;height:11px;border:2px solid #fff2b1;border-radius:50%;background:#2a1f0b;box-shadow:0 0 12px #ffd45a}.b0{height:160px;transform:rotate(-64deg)}.b1{height:150px;transform:rotate(-50deg)}.b2{height:165px;transform:rotate(-37deg)}.b3{height:145px;transform:rotate(-24deg)}.b4{height:180px;transform:rotate(-12deg)}.b5{height:190px;transform:rotate(0deg)}.b6{height:180px;transform:rotate(12deg)}.b7{height:145px;transform:rotate(24deg)}.b8{height:165px;transform:rotate(37deg)}.b9{height:150px;transform:rotate(50deg)}.b10{height:160px;transform:rotate(64deg)}.b11{height:125px;transform:rotate(-78deg)}.b12{height:125px;transform:rotate(78deg)}.b13{height:105px;transform:rotate(-92deg)}.b14{height:105px;transform:rotate(92deg)}.b15{height:130px;transform:rotate(-5deg)}.b16{height:130px;transform:rotate(5deg)}.core-mark strong{position:relative;z-index:4;font-size:clamp(54px,5vw,82px);letter-spacing:-.06em;text-shadow:0 5px 18px rgba(0,0,0,.65)}.stage-glow{position:absolute;bottom:7%;width:58%;height:36px;border-radius:50%;border:1px solid rgba(246,185,29,.55);box-shadow:0 0 50px rgba(246,185,29,.34)}
        .avatar-card{border:1px solid rgba(177,86,255,.5);border-radius:26px;padding:24px;background:linear-gradient(180deg,rgba(15,22,34,.72),rgba(11,8,20,.72));box-shadow:0 0 70px rgba(124,39,255,.18),inset 0 0 60px rgba(255,255,255,.025);min-height:410px;display:flex;flex-direction:column;justify-content:space-between}.avatar-card h3{font-size:25px;margin:18px 0 8px}.avatar-card h3 span{color:var(--gold)}.avatar-card p{color:rgba(255,255,255,.76);line-height:1.55;margin:0 0 18px}.human-avatar{position:relative;height:245px;border-radius:18px;background:radial-gradient(circle at 50% 34%,rgba(42,184,255,.22),transparent 38%),linear-gradient(180deg,#05111e,#070816);overflow:hidden;display:grid;place-items:center}.scanline{position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:100% 18px;opacity:.22}.avatar-halo{position:absolute;width:210px;height:210px;border-radius:50%;border:1px solid rgba(54,179,255,.4);box-shadow:0 0 40px rgba(46,154,255,.25);animation:pulse 3.6s ease-in-out infinite}.head{position:absolute;top:30px;width:105px;height:137px;border-radius:50% 50% 45% 45%;background:linear-gradient(145deg,#cbd8e5,#27384f 48%,#0b1220);box-shadow:inset 18px 0 35px rgba(255,255,255,.18),0 0 36px rgba(80,176,255,.25)}.face{position:absolute;inset:0}.eye{position:absolute;top:64px;width:11px;height:11px;border-radius:50%;background:#9d57ff;box-shadow:0 0 16px #9d57ff}.eye.left{left:34px}.eye.right{right:34px}.nose{position:absolute;left:50%;top:78px;width:1px;height:16px;background:rgba(255,255,255,.34)}.soft-smile{position:absolute;left:38px;top:102px;width:30px;height:11px;border-bottom:2px solid rgba(255,255,255,.78);border-radius:50%}.neck{position:absolute;top:156px;width:34px;height:44px;background:linear-gradient(#1a2a3e,#07111d)}.body{position:absolute;bottom:-28px;width:185px;height:115px;border-radius:85px 85px 0 0;background:linear-gradient(145deg,#17263d,#050811 60%);border:1px solid rgba(255,255,255,.08)}.chest-core{position:absolute;top:23px;left:50%;width:42px;height:42px;border-radius:50%;transform:translateX(-50%);background:radial-gradient(circle,#ffef9a,#d79f18 40%,transparent 70%);box-shadow:0 0 28px rgba(246,185,29,.7)}.hud{position:absolute;border:1px solid rgba(45,174,255,.35);border-radius:999px}.hud.h1{width:250px;height:250px}.hud.h2{width:155px;height:155px}.hud.h3{width:300px;height:60px;top:68px}.speaking .eye{animation:blink 2.7s infinite}.speaking .chest-core{animation:pulse 1.5s infinite}
        .pillar-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.08);margin-top:8px}.pillar{display:flex;gap:18px;align-items:center;padding:24px 28px;border-right:1px solid rgba(255,255,255,.1)}.pillar:last-child{border-right:0}.icon-bubble{width:50px;height:50px;border-radius:17px;border:1px solid currentColor;display:grid;place-items:center;color:var(--gold);box-shadow:0 0 22px rgba(246,185,29,.13)}.pillar:nth-child(2) .icon-bubble,.card:nth-child(1) .icon-bubble,.card:nth-child(4) .icon-bubble{color:#c82cff}.pillar:nth-child(4) .icon-bubble{color:var(--green)}.icon-svg{width:25px;height:25px}.pillar strong{display:block;font-size:17px}.pillar span:last-child{display:block;color:rgba(255,255,255,.68);line-height:1.45;margin-top:5px}
        .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:30px 0 58px}.card{min-height:205px;border:1px solid rgba(255,255,255,.11);border-radius:20px;background:linear-gradient(180deg,rgba(7,17,29,.86),rgba(3,7,13,.86));padding:28px;box-shadow:inset 0 0 50px rgba(38,165,255,.035)}.card h3{font-size:25px;line-height:1.14;margin:22px 0 12px}.card p{color:rgba(255,255,255,.68);line-height:1.55;margin:0}.card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.22);transition:.25s}
        .orkio-strip{border-top:1px solid rgba(255,255,255,.18);background:radial-gradient(circle at 48% 45%,rgba(31,154,255,.22),transparent 25%),radial-gradient(circle at 25% 70%,rgba(117,255,69,.1),transparent 28%),#02060c;margin:0 -32px;padding:22px 32px 34px}.orkio-nav{display:flex;align-items:center;justify-content:space-between;gap:24px}.orkio-logo{display:flex;align-items:center;gap:14px;background:transparent;border:0;color:white;cursor:pointer}.orkio-logo img{width:58px;height:58px;filter:drop-shadow(0 0 20px rgba(91,210,255,.45))}.orkio-logo span{font-size:40px;font-weight:850;letter-spacing:.05em}.orkio-logo b{font-size:23px;color:var(--green)}.orkio-nav nav{display:flex;gap:34px}.orkio-nav nav button{background:transparent;border:0;color:rgba(255,255,255,.84);cursor:pointer}.orkio-grid{display:grid;grid-template-columns:.9fr .9fr .82fr;gap:36px;align-items:center;padding-top:20px}.orkio-copy small{display:inline-flex;border:1px solid rgba(140,244,81,.5);border-radius:999px;color:var(--green);padding:8px 16px;font-weight:800}.orkio-copy h2{font-size:clamp(38px,3.4vw,56px);line-height:1.08;letter-spacing:-.055em}.orkio-copy h2 span{color:var(--green)}.orkio-copy h2 b{color:var(--blue)}.orkio-copy p{color:rgba(255,255,255,.74);font-size:17px;line-height:1.6}.orkio-sphere{position:relative;height:340px;display:grid;place-items:center}.orkio-sphere img{width:270px;max-width:80%;filter:drop-shadow(0 0 55px rgba(39,165,255,.38))}.orb-fallback{position:absolute;width:250px;height:250px;border-radius:50%;background:radial-gradient(circle at 65% 24%,#83c7ff,#10436e 37%,#f3c331 68%,#233b14);display:none}.blue-lines i{position:absolute;left:58%;top:50%;width:330px;height:1px;background:linear-gradient(90deg,rgba(57,174,255,.75),transparent);transform:rotate(calc((var(--i) - 3) * 10deg));transform-origin:left;box-shadow:0 0 12px #2aa9ff}.orkio-panel{border:1px solid rgba(50,169,255,.25);border-radius:18px;background:rgba(4,16,27,.76);padding:18px;box-shadow:0 0 40px rgba(34,169,255,.1)}.orkio-panel b{display:block;margin-bottom:16px}.orkio-panel b span{font-size:11px;color:rgba(255,255,255,.52)}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.metrics span{border:1px solid rgba(140,244,81,.35);border-radius:50%;aspect-ratio:1;display:grid;place-items:center;color:var(--green);font-weight:800}.panel-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}.panel-grid i{height:70px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(34,169,255,.04))}
        .contact{padding:46px 0 70px;border-top:1px solid rgba(255,255,255,.1);display:grid;grid-template-columns:.9fr 1.1fr;gap:32px;align-items:start}.contact h2{font-size:38px;margin:0 0 12px}.contact p{color:rgba(255,255,255,.72);line-height:1.6}.contact-form{display:grid;grid-template-columns:1fr 1fr;gap:14px;border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:22px;background:rgba(255,255,255,.035)}.contact-form input,.contact-form textarea{border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.28);border-radius:13px;color:white;padding:14px 15px}.contact-form textarea{grid-column:1/-1;min-height:110px}.contact-form .btn{grid-column:1/-1}
        .float-whatsapp{position:fixed;right:22px;bottom:22px;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#1bd741;color:#041008;text-decoration:none;font-weight:900;box-shadow:0 0 32px rgba(27,215,65,.38);z-index:40}.float-whatsapp::before{content:"☎";font-size:25px}
        @keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{transform:scale(1.035);opacity:.8}}@keyframes blink{0%,96%,100%{transform:scaleY(1)}98%{transform:scaleY(.25)}}
        @media (max-width:1180px){.hero,.orkio-grid,.contact{grid-template-columns:1fr}.nav{display:none}.core-wrap{min-height:440px}.pillar-row,.cards{grid-template-columns:1fr 1fr}.avatar-card{max-width:480px}.orkio-nav{flex-wrap:wrap}.topbar{height:auto;padding:22px 0}.site::before{display:none}}
        @media (max-width:720px){.site{width:min(100% - 28px,1510px)}.brand-word strong{font-size:29px}.brand img{width:54px;height:54px}.top-actions{gap:8px}.top-actions .btn.outline{display:none}.hero{padding-top:28px}.copy h1{font-size:38px}.core-mark{width:360px}.core-particles i{transform:rotate(var(--r)) translateY(-165px)}.core-mark strong{font-size:48px}.pillar-row,.cards,.contact-form{grid-template-columns:1fr}.pillar{border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.orkio-nav nav{display:none}.orkio-logo span{font-size:30px}.contact{padding-bottom:90px}}
      `}</style>

      <div className="site">
        <header className="topbar">
          <button className="brand" onClick={() => go("/")}>
            <img src={A + "logo-patroai-oficial.png"} alt="PatroAI" onError={(e)=>{e.currentTarget.style.display="none"}} />
            <span className="brand-word"><strong>PATRO<span>AI</span></strong><small>CONSULTECH</small></span>
          </button>
          <nav className="nav">
            {t.nav.map((item, idx) => (
              <button key={item} onClick={() => idx === 1 ? document.getElementById("platform")?.scrollIntoView({behavior:"smooth"}) : document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>{item}</button>
            ))}
          </nav>
          <div className="top-actions">
            <button className="btn outline" onClick={() => go("/auth?mode=login")}>Login</button>
            <button className="btn gold" onClick={() => setContactOpen(true)}>{t.primary} →</button>
            <button className="lang" onClick={() => setLang(lang === "pt" ? "en" : "pt")}>{lang === "pt" ? "EN" : "PT"}</button>
          </div>
        </header>

        <section className="hero">
          <div className="copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="row-actions">
              <button className="btn gold" onClick={() => setContactOpen(true)}>{t.primary} →</button>
              <button className="btn outline" onClick={() => document.getElementById("platform")?.scrollIntoView({behavior:"smooth"})}>{t.secondary} ▶</button>
            </div>
          </div>

          <div className="core-wrap">
            <PatroAiCoreMark />
          </div>

          <aside className="avatar-card">
            <HumanDigitalAvatar speaking />
            <div>
              <h3>{lang === "pt" ? <>Olá! Eu sou a <span>Orkio</span>.</> : <>Hi! I am <span>Orkio</span>.</>}</h3>
              <p>{t.avatarText}</p>
              <button className="btn purple" onClick={() => go("/orkio")}>{t.talk} ◔</button>
            </div>
          </aside>
        </section>

        <section className="pillar-row">
          {t.pillars.map(([icon, title, desc]) => (
            <div className="pillar" key={title}>
              <span className="icon-bubble"><Icon name={icon}/></span>
              <span><strong>{title}</strong><span>{desc}</span></span>
            </div>
          ))}
        </section>

        <section className="cards" id="resources">
          {t.cards.map(([icon, title, desc]) => (
            <article className="card" key={title}>
              <span className="icon-bubble"><Icon name={icon}/></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </section>

        <MiniOrkioSection t={t} go={go} />

        <section className="contact" id="contact">
          <div>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>
            <div className="row-actions">
              <a className="btn green" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Conversar no WhatsApp</a>
              <a className="btn outline" href={mailto}>Enviar por e-mail</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={(e)=>{e.preventDefault(); window.location.href = mailto;}}>
            <input required placeholder={lang === "pt" ? "Nome" : "Name"} />
            <input required placeholder={lang === "pt" ? "Empresa" : "Company"} />
            <input placeholder={lang === "pt" ? "E-mail" : "Email"} />
            <input placeholder={lang === "pt" ? "Telefone" : "Phone"} />
            <textarea placeholder={lang === "pt" ? "Conte brevemente o desafio, integrações ou objetivo." : "Briefly describe your challenge, integrations or goal."} />
            <button className="btn gold" type="submit">{lang === "pt" ? "Solicitar contato estratégico" : "Request strategic contact"} →</button>
          </form>
        </section>
      </div>

      <a className="float-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Conversar no WhatsApp" />

      {contactOpen && (
        <div role="dialog" aria-modal="true" onClick={() => setContactOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.68)",zIndex:50,display:"grid",placeItems:"center",padding:20}}>
          <div onClick={(e)=>e.stopPropagation()} style={{width:"min(560px,100%)",border:"1px solid rgba(255,255,255,.14)",borderRadius:24,padding:24,background:"#07101b",boxShadow:"0 0 70px rgba(246,185,29,.18)"}}>
            <h2 style={{marginTop:0}}>Vamos conversar?</h2>
            <p style={{color:"rgba(255,255,255,.72)"}}>Escolha o canal para iniciar uma conversa estratégica com a PatroAI.</p>
            <div className="row-actions">
              <a className="btn green" href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a>
              <a className="btn gold" href={mailto}>E-mail</a>
              <button className="btn outline" onClick={() => setContactOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
