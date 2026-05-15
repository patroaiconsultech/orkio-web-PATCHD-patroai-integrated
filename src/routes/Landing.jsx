import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";
const PRECHAT_KEY = "orkio_prechat_context_v1";

const PT = {
  nav: ["Recursos", "Como funciona", "Integrações", "Soluções", "Sobre nós"],
  eyebrow: "SISTEMA OPERACIONAL DE INTELIGÊNCIA EMPRESARIAL",
  title: <>Seu negócio<br/><span className="green">operando</span> com<br/><span className="blue">inteligência</span> contínua.</>,
  subtitle: "O Orkio OS conecta estratégia, dados, automação e execução em um ecossistema de agentes inteligentes que evolui com a sua empresa.",
  demo: "Agendar demonstração",
  action: "Ver Orkio em ação",
  chatTitle: "Olá, eu sou a Orkio.",
  chatText: "Antes de você criar uma conta, posso entender rapidamente seu negócio e preparar um primeiro mapa de evolução.",
  start: "Começar diagnóstico",
  mic: "Falar",
  typePlaceholder: "Escreva ou fale sua resposta...",
  trial: "Ativar 7 dias grátis",
  questions: [
    "Antes de começarmos, qual é o seu nome?",
    "Prazer. Qual é hoje o maior desafio da sua empresa?",
    "Qual é o segmento da sua empresa?",
    "Vocês já utilizam sistemas integrados, automações ou algum ERP/CRM?",
    "O que você gostaria de melhorar nos próximos 90 dias?"
  ],
  plans: [
    ["IA Governável", "Decisões auditáveis e rastreáveis."],
    ["Multiagentes", "Especialistas digitais trabalhando juntos."],
    ["Execução Contínua", "Do planejamento à execução, com acompanhamento em tempo real."],
    ["Segurança & Privacidade", "Proteção de dados, LGPD e controle granular de acesso."],
    ["ESG Integrado", "Sustentabilidade e impacto positivo na estratégia do seu negócio."]
  ],
  steps: [
    ["1. Diagnóstico Inteligente", "Nossa IA analisa dados, identifica gargalos, padrões e oportunidades no seu negócio."],
    ["2. Planejamento Estratégico", "Propõe cenários, metas e planos de ação sustentáveis alinhados aos seus objetivos."],
    ["3. Execução Assistida", "Agentes inteligentes automatizam processos e acompanham resultados em tempo real."],
    ["4. Aprendizado Contínuo", "O sistema aprende com os dados e evolui continuamente junto com a sua empresa."]
  ]
};

const EN = {
  nav: ["Resources", "How it works", "Integrations", "Solutions", "About"],
  eyebrow: "ENTERPRISE INTELLIGENCE OPERATING SYSTEM",
  title: <>Your business<br/><span className="green">operating</span> with<br/><span className="blue">continuous</span> intelligence.</>,
  subtitle: "Orkio OS connects strategy, data, automation and execution into an intelligent agent ecosystem that evolves with your company.",
  demo: "Schedule demo",
  action: "See Orkio in action",
  chatTitle: "Hi, I am Orkio.",
  chatText: "Before you create an account, I can quickly understand your business and prepare a first evolution map.",
  start: "Start diagnosis",
  mic: "Speak",
  typePlaceholder: "Write or speak your answer...",
  trial: "Activate 7-day trial",
  questions: [
    "Before we start, what is your name?",
    "Nice to meet you. What is your company’s biggest challenge today?",
    "What is your business segment?",
    "Do you already use integrated systems, automations or ERP/CRM?",
    "What would you like to improve in the next 90 days?"
  ],
  plans: [
    ["Governable AI", "Auditable and traceable decisions."],
    ["Multi-agents", "Digital specialists working together."],
    ["Continuous Execution", "From planning to execution, with real-time tracking."],
    ["Security & Privacy", "Data protection and granular access control."],
    ["ESG Integrated", "Sustainability and positive impact in your business strategy."]
  ],
  steps: [
    ["1. Intelligent Diagnosis", "Our AI analyzes data and identifies bottlenecks, patterns and opportunities."],
    ["2. Strategic Planning", "Proposes scenarios, goals and sustainable action plans aligned with your objectives."],
    ["3. Assisted Execution", "Intelligent agents automate processes and track results in real time."],
    ["4. Continuous Learning", "The system learns from data and evolves continuously with your company."]
  ]
};

function speak(text, lang = "pt-BR") {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.94;
    u.pitch = 1.08;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const preferred = voices.find(v => /female|maria|luciana|helena|google português|brasil/i.test(v.name)) || voices.find(v => String(v.lang).toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  } catch {}
}

function useSpeechRecognition({ onResult, lang }) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const supported = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const start = () => {
    if (!supported) return false;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = false;
    rec.continuous = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (event) => {
      const txt = event?.results?.[0]?.[0]?.transcript || "";
      if (txt) onResult(txt);
    };
    recRef.current = rec;
    rec.start();
    return true;
  };

  return { start, listening, supported };
}

function OrkioAvatar({ speaking, listening }) {
  return (
    <div className={`orkio-avatar ${speaking ? "speaking" : ""} ${listening ? "listening" : ""}`}>
      <div className="avatar-grid" />
      <div className="digital-halo" />
      <div className="female-head">
        <span className="hair left" /><span className="hair right" />
        <span className="eye left" /><span className="eye right" />
        <span className="smile" />
      </div>
      <div className="digital-neck" />
      <div className="digital-body"><span /></div>
      <div className="voice-rings"><i/><i/><i/></div>
    </div>
  );
}

function PreChat({ t, lang }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState([]);
  const [messages, setMessages] = useState([
    { role: "orkio", text: t.chatText }
  ]);
  const [speaking, setSpeaking] = useState(false);
  const langCode = lang === "pt" ? "pt-BR" : "en-US";

  useEffect(() => {
    setMessages([{ role: "orkio", text: t.chatText }]);
  }, [lang]);

  function orkioSay(text) {
    setMessages(m => [...m, { role: "orkio", text }]);
    setSpeaking(true);
    speak(text, langCode);
    window.setTimeout(() => setSpeaking(false), Math.max(1500, text.length * 55));
  }

  function start() {
    setOpen(true);
    if (messages.length <= 1) orkioSay(t.questions[0]);
  }

  function submit(text = input) {
    const clean = String(text || "").trim();
    if (!clean) return;
    setInput("");
    const nextAnswers = [...answers, clean];
    setAnswers(nextAnswers);
    setMessages(m => [...m, { role: "user", text: clean }]);
    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep < t.questions.length) {
      const q = nextStep === 1 && clean ? t.questions[nextStep].replace("Prazer.", `Prazer, ${clean}.`).replace("Nice to meet you.", `Nice to meet you, ${clean}.`) : t.questions[nextStep];
      window.setTimeout(() => orkioSay(q), 450);
      return;
    }

    const name = nextAnswers[0] || "";
    const challenge = nextAnswers[1] || "";
    const segment = nextAnswers[2] || "";
    const systems = nextAnswers[3] || "";
    const goal = nextAnswers[4] || "";
    const summary = lang === "pt"
      ? `${name}, já identifiquei um primeiro mapa: sua empresa atua em ${segment || "um segmento ainda a detalhar"}, possui como desafio "${challenge || "evolução operacional"}" e pode evoluir com diagnóstico, integração, planejamento e execução assistida.`
      : `${name}, I created a first map: your company operates in ${segment || "a segment to detail"}, has the challenge "${challenge || "operational evolution"}" and can evolve through diagnosis, integration, planning and assisted execution.`;
    window.setTimeout(() => orkioSay(summary), 500);

    try {
      localStorage.setItem(PRECHAT_KEY, JSON.stringify({
        source: "orkio-prechat",
        created_at: new Date().toISOString(),
        name, challenge, segment, systems, goal,
        answers: nextAnswers,
        summary,
        trial_days: 7
      }));
    } catch {}
  }

  const { start: startMic, listening, supported } = useSpeechRecognition({
    lang: langCode,
    onResult: (txt) => { setInput(txt); submit(txt); }
  });

  function activateTrial() {
    try {
      const current = JSON.parse(localStorage.getItem(PRECHAT_KEY) || "{}");
      localStorage.setItem(PRECHAT_KEY, JSON.stringify({ ...current, trial_days: 7, cta_clicked_at: new Date().toISOString() }));
    } catch {}
    navigate("/auth?mode=register&trial=7&source=orkio-prechat");
  }

  const finished = answers.length >= t.questions.length;

  return (
    <aside className="prechat-card">
      <OrkioAvatar speaking={speaking} listening={listening} />
      <h3>{t.chatTitle}</h3>
      <p>{t.chatText}</p>

      {!open ? (
        <button className="btn purple" onClick={start}>{t.start} ◔</button>
      ) : (
        <div className="chatbox">
          <div className="msgs">
            {messages.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}
          </div>
          {!finished ? (
            <div className="composer">
              <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter") submit(); }} placeholder={t.typePlaceholder} />
              <button onClick={() => submit()}>Enviar</button>
              <button title={supported ? t.mic : "Voz indisponível neste navegador"} disabled={!supported || listening} onClick={startMic}>{listening ? "..." : "🎙"}</button>
            </div>
          ) : (
            <button className="btn green wide" onClick={activateTrial}>{t.trial} →</button>
          )}
        </div>
      )}
    </aside>
  );
}

function IconCircle({ children }) { return <span className="icon-circle">{children}</span>; }

export default function Landing() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("pt");
  const t = lang === "pt" ? PT : EN;
  const integrations = ["ERP", "CRM", "Financeiro", "Comunicação", "Dados & BI", "APIs & Sistemas"];

  return (
    <main className="orkio-page">
      <style>{`
        :root{--green:#8cf451;--blue:#22a9ff;--cyan:#5fe7ff;--gold:#f6b91d;--purple:#9d35ff;--line:rgba(255,255,255,.12)}
        *{box-sizing:border-box}body{margin:0;background:#02070d;color:#f7fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input{font:inherit}
        .orkio-page{min-height:100vh;background:radial-gradient(circle at 57% 32%,rgba(33,160,255,.21),transparent 29%),radial-gradient(circle at 38% 60%,rgba(246,185,29,.13),transparent 25%),linear-gradient(180deg,#020812,#02060c 60%,#010306);overflow:hidden}
        .wrap{width:min(1510px,calc(100% - 64px));margin:0 auto}.topbar{height:96px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.08);gap:24px}.logo{display:flex;align-items:center;gap:14px;background:transparent;border:0;color:white;cursor:pointer}.logo img{width:62px;height:62px;object-fit:contain;filter:drop-shadow(0 0 22px rgba(74,174,255,.45))}.logo span{font-size:42px;font-weight:850;letter-spacing:.04em}.logo small{font-size:23px;color:var(--green);font-weight:800;margin-left:4px}.nav{display:flex;gap:40px}.nav button{background:transparent;border:0;color:rgba(255,255,255,.84);cursor:pointer}.actions{display:flex;gap:16px;align-items:center}.btn{border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.035);color:white;padding:14px 23px;cursor:pointer;display:inline-flex;gap:10px;align-items:center;justify-content:center;text-decoration:none;transition:.22s}.btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.07)}.green{color:var(--green)}.blue{color:var(--blue)}.btn.green{background:linear-gradient(135deg,#a7f96a,#54b73e);color:#051006;border-color:rgba(159,250,97,.5);box-shadow:0 0 26px rgba(140,244,81,.22)}.btn.purple{background:linear-gradient(135deg,#5728da,#b613d8);border-color:rgba(201,93,255,.68);box-shadow:0 0 30px rgba(157,53,255,.23);width:100%}.btn.outline{background:rgba(3,12,21,.55)}.lang{border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:10px 12px;background:rgba(255,255,255,.04);color:white;cursor:pointer}
        .hero{display:grid;grid-template-columns:minmax(390px,.88fr) minmax(480px,.95fr) minmax(360px,.8fr);gap:38px;align-items:center;padding:58px 0 34px}.eyebrow{display:inline-flex;border:1px solid rgba(140,244,81,.52);border-radius:999px;color:var(--green);background:rgba(140,244,81,.05);padding:10px 18px;font-weight:800;letter-spacing:.065em;font-size:14px;margin-bottom:27px}h1{font-size:clamp(44px,4.1vw,72px);line-height:1.08;letter-spacing:-.058em;margin:0}.copy p{color:rgba(255,255,255,.78);font-size:18px;line-height:1.65;max-width:590px;margin:28px 0 31px}.row{display:flex;gap:18px;flex-wrap:wrap}
        .sphere-stage{position:relative;min-height:470px;display:grid;place-items:center}.sphere-stage::before{content:"";position:absolute;width:550px;height:550px;border-radius:50%;background:radial-gradient(circle,rgba(39,167,255,.18),transparent 56%)}.sphere-stage::after{content:"";position:absolute;bottom:33px;width:360px;height:44px;border-radius:50%;border:1px solid rgba(246,185,29,.4);box-shadow:0 0 52px rgba(246,185,29,.22)}.sphere{position:relative;width:315px;aspect-ratio:1;border-radius:50%;display:grid;place-items:center;filter:drop-shadow(0 0 55px rgba(37,166,255,.35));animation:float 4.8s ease-in-out infinite}.sphere img{width:100%;height:100%;object-fit:contain}.orb-fallback{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 65% 23%,#85c9ff,#0f4671 38%,#f3c331 70%,#263d15);display:none}.network i{position:absolute;left:55%;top:50%;width:380px;height:1px;background:linear-gradient(90deg,rgba(44,175,255,.75),transparent);transform:rotate(calc((var(--i) - 3) * 11deg));transform-origin:left;box-shadow:0 0 12px #2caeff}.integration-list{position:absolute;right:-25px;top:80px;display:grid;gap:16px}.integration-list span{display:flex;align-items:center;gap:12px}.integration-list b{width:50px;height:50px;border-radius:50%;border:1px solid rgba(95,231,255,.6);display:grid;place-items:center;color:var(--cyan);box-shadow:0 0 24px rgba(39,167,255,.18)}
        .dashboard{border:1px solid rgba(51,173,255,.26);border-radius:22px;background:rgba(3,15,27,.76);padding:20px;box-shadow:0 0 45px rgba(34,169,255,.1)}.dashboard h3{margin:0 0 18px}.dashboard h3 span{font-size:11px;color:rgba(255,255,255,.55)}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{aspect-ratio:1;border-radius:50%;border:1px solid rgba(140,244,81,.38);display:grid;place-items:center;color:var(--green);font-weight:850;background:radial-gradient(circle,rgba(140,244,81,.15),transparent 65%)}.panel-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}.panel-grid div{height:86px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(34,169,255,.04))}.insight{font-size:13px;color:rgba(255,255,255,.65);line-height:1.45}
        .prechat-card{border:1px solid rgba(68,178,255,.28);border-radius:24px;background:linear-gradient(180deg,rgba(8,18,31,.75),rgba(4,9,17,.78));padding:20px;min-height:470px;box-shadow:0 0 60px rgba(34,169,255,.12)}.prechat-card h3{font-size:24px;margin:16px 0 8px}.prechat-card p{color:rgba(255,255,255,.75);line-height:1.5}.orkio-avatar{position:relative;height:220px;border-radius:18px;background:radial-gradient(circle at 50% 35%,rgba(54,174,255,.22),transparent 40%),linear-gradient(180deg,#04111f,#070914);overflow:hidden;display:grid;place-items:center}.avatar-grid{position:absolute;inset:0;background:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:100% 20px;opacity:.2}.digital-halo{position:absolute;width:198px;height:198px;border-radius:50%;border:1px solid rgba(72,184,255,.4);box-shadow:0 0 42px rgba(52,174,255,.24);animation:pulse 3.4s infinite}.female-head{position:absolute;top:33px;width:102px;height:130px;border-radius:50% 50% 44% 44%;background:linear-gradient(145deg,#cbd9e8,#27394f 45%,#0a111e);box-shadow:inset 18px 0 32px rgba(255,255,255,.2),0 0 34px rgba(80,176,255,.24)}.eye{position:absolute;top:61px;width:11px;height:11px;border-radius:50%;background:#a358ff;box-shadow:0 0 16px #a358ff}.eye.left{left:32px}.eye.right{right:32px}.smile{position:absolute;left:36px;top:98px;width:31px;height:11px;border-bottom:2px solid rgba(255,255,255,.78);border-radius:50%}.digital-neck{position:absolute;top:158px;width:34px;height:35px;background:linear-gradient(#192b40,#07111d)}.digital-body{position:absolute;bottom:-25px;width:178px;height:100px;border-radius:82px 82px 0 0;background:linear-gradient(145deg,#17263d,#050811 62%);border:1px solid rgba(255,255,255,.08)}.digital-body span{position:absolute;top:20px;left:50%;transform:translateX(-50%);width:39px;height:39px;border-radius:50%;background:radial-gradient(circle,#ffef9a,#d69f19 42%,transparent 72%);box-shadow:0 0 26px rgba(246,185,29,.65)}.voice-rings i{position:absolute;inset:24px;border:1px solid rgba(95,231,255,.18);border-radius:50%;animation:pulse 3s infinite}.voice-rings i:nth-child(2){inset:48px;animation-delay:.4s}.voice-rings i:nth-child(3){inset:72px;animation-delay:.8s}.orkio-avatar.listening .digital-halo,.orkio-avatar.speaking .digital-halo{border-color:rgba(140,244,81,.7);box-shadow:0 0 45px rgba(140,244,81,.28)}.orkio-avatar.speaking .digital-body span{animation:pulse 1.2s infinite}
        .chatbox{margin-top:14px}.msgs{max-height:190px;overflow:auto;display:flex;flex-direction:column;gap:10px;padding-right:4px}.msg{padding:11px 12px;border-radius:13px;line-height:1.35;font-size:14px}.msg.orkio{background:rgba(34,169,255,.1);border:1px solid rgba(34,169,255,.16)}.msg.user{background:rgba(140,244,81,.1);border:1px solid rgba(140,244,81,.18);align-self:flex-end}.composer{display:grid;grid-template-columns:1fr auto auto;gap:8px;margin-top:12px}.composer input{border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(0,0,0,.26);color:white;padding:12px}.composer button{border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(255,255,255,.06);color:white;padding:0 12px;cursor:pointer}.wide{width:100%;margin-top:12px}
        .pillars{display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.08)}.pillar{display:flex;gap:14px;padding:24px 22px;border-right:1px solid rgba(255,255,255,.09)}.pillar:last-child{border-right:0}.icon-circle{min-width:48px;height:48px;border-radius:16px;border:1px solid currentColor;color:var(--green);display:grid;place-items:center}.pillar:nth-child(2) .icon-circle{color:var(--cyan)}.pillar:nth-child(3) .icon-circle{color:var(--gold)}.pillar:nth-child(4) .icon-circle{color:var(--green)}.pillar b{display:block}.pillar span span{display:block;color:rgba(255,255,255,.66);line-height:1.42;margin-top:5px}.section-title{text-align:center;color:rgba(255,255,255,.75);letter-spacing:.12em;margin:32px 0 22px}.section-title b{color:var(--green)}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding-bottom:58px}.step{position:relative;min-height:220px;border:1px solid rgba(255,255,255,.1);border-radius:20px;background:linear-gradient(180deg,rgba(7,18,31,.85),rgba(3,7,13,.85));padding:28px}.step h3{margin:20px 0 10px}.step p{color:rgba(255,255,255,.68);line-height:1.5}.step:after{content:"→";position:absolute;right:-22px;top:48%;font-size:34px;color:var(--green);filter:drop-shadow(0 0 10px rgba(140,244,81,.55))}.step:last-child:after{display:none}
        @keyframes float{50%{transform:translateY(-12px)}}@keyframes pulse{50%{transform:scale(1.04);opacity:.72}}
        @media (max-width:1220px){.hero{grid-template-columns:1fr}.nav{display:none}.sphere-stage{min-height:400px}.integration-list{position:static;grid-template-columns:1fr 1fr;margin-top:18px}.pillars{grid-template-columns:1fr 1fr}.steps{grid-template-columns:1fr 1fr}.dashboard{max-width:520px}.prechat-card{max-width:560px}.topbar{height:auto;padding:22px 0}}
        @media (max-width:720px){.wrap{width:min(100% - 28px,1510px)}.actions .outline{display:none}.logo span{font-size:31px}.logo img{width:50px;height:50px}h1{font-size:39px}.sphere{width:240px}.network i{width:220px}.pillars,.steps{grid-template-columns:1fr}.pillar{border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.step:after{display:none}.composer{grid-template-columns:1fr}.hero{padding-top:30px}}
      `}</style>

      <div className="wrap">
        <header className="topbar">
          <button className="logo" onClick={()=>navigate("/")}>
            <img src={A + "orkio-sphere-only.png"} alt="" onError={(e)=>{e.currentTarget.style.display="none"}} />
            <span>ORKIO</span><small>OS</small>
          </button>
          <nav className="nav">{t.nav.map((n,i)=><button key={n} onClick={()=> i===1 ? document.getElementById("como-funciona")?.scrollIntoView({behavior:"smooth"}) : document.getElementById("orkio-recursos")?.scrollIntoView({behavior:"smooth"})}>{n}</button>)}</nav>
          <div className="actions">
            <button className="btn outline" onClick={()=>document.querySelector(".prechat-card")?.scrollIntoView({behavior:"smooth"})}>Falar com especialista</button>
            <button className="btn green" onClick={()=>navigate("/auth?mode=register&trial=7&source=orkio-landing")}>{t.demo} →</button>
            <button className="lang" onClick={()=>setLang(lang==="pt"?"en":"pt")}>{lang==="pt"?"EN":"PT"}</button>
          </div>
        </header>

        <section className="hero">
          <div className="copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="row">
              <button className="btn green" onClick={()=>navigate("/auth?mode=register&trial=7&source=orkio-landing")}>{t.demo} →</button>
              <button className="btn outline" onClick={()=>document.querySelector(".prechat-card")?.scrollIntoView({behavior:"smooth"})}>{t.action} ▶</button>
            </div>
          </div>

          <div className="sphere-stage">
            <div className="network">{integrations.map((_,i)=><i key={i} style={{"--i":i}} />)}</div>
            <div className="sphere">
              <img src={A + "orkio-sphere-only.png"} alt="Orkio" onError={(e)=>{e.currentTarget.style.display="none"; e.currentTarget.nextSibling.style.display="block"}} />
              <span className="orb-fallback" />
            </div>
            <div className="integration-list">{integrations.map((x,i)=><span key={x}><b>{i+1}</b>{x}</span>)}</div>
          </div>

          <PreChat t={t} lang={lang} />
        </section>

        <section id="orkio-recursos" className="pillars">
          {t.plans.map(([h,d],i)=><div className="pillar" key={h}><IconCircle>{["⌁","⚙","↗","⌘","◒"][i]}</IconCircle><span><b>{h}</b><span>{d}</span></span></div>)}
        </section>

        <aside className="dashboard" style={{margin:"30px auto", maxWidth:720}}>
          <h3>Painel Orkio OS <span>em tempo real</span></h3>
          <div className="metrics"><div className="metric">92%</div><div className="metric">85%</div><div className="metric">78%</div></div>
          <div className="panel-grid"><div/><div/><div/><div/></div>
          <div className="insight">Insights inteligentes: oportunidade de otimização identificada no processo operacional.</div>
        </aside>

        <h2 id="como-funciona" className="section-title">COMO O <b>ORKIO</b> FUNCIONA</h2>
        <section className="steps">
          {t.steps.map(([h,d])=><article className="step" key={h}><IconCircle>◇</IconCircle><h3>{h}</h3><p>{d}</p></article>)}
        </section>
      </div>
    </main>
  );
}
