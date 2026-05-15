import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const A = "/patroai-assets/";
const PRECHAT_CONTEXT_KEY = "orkio_prechat_context_v1";

const COPY = {
  pt: {
    nav: ["Recursos", "Como funciona", "Integrações", "Soluções", "Sobre nós"],
    eyebrow: "SISTEMA OPERACIONAL DE INTELIGÊNCIA EMPRESARIAL",
    title: <>Seu negócio<br/><span className="grad-blue">operando</span> com<br/><span className="grad-blue">inteligência</span> contínua.</>,
    subtitle: "O Orkio OS conecta estratégia, dados, automação e execução em um ecossistema de agentes inteligentes que evolui com a sua empresa.",
    primary: "Começar diagnóstico gratuito",
    secondary: "Ver Orkio em ação",
    expert: "Falar com especialista",
    ecosystem: "INTEGRA-SE AO ECOSSISTEMA DA SUA EMPRESA",
    inputPlaceholder: "Digite sua resposta...",
    send: "Enviar",
    voice: "Voz",
    trial: "Continuar com 7 dias grátis",
    enterprise: "Solicitar implantação Enterprise",
    intro: "Olá. Eu sou a Orkio. Antes de começarmos, qual é o seu nome?",
    questions: [
      (name) => `Prazer, ${name}. Qual é hoje o maior desafio da sua empresa?`,
      () => "Qual é o segmento da sua empresa?",
      () => "Vocês já utilizam sistemas integrados, automações, ERP, CRM ou APIs internas?",
      () => "O que você gostaria de melhorar nos próximos 90 dias?"
    ],
    diagnosis: (ctx) => `Perfeito, ${ctx.name}. Já identifiquei um primeiro mapa de evolução: sua empresa pode ganhar eficiência conectando estratégia, dados, automação e execução contínua. Para aprofundar, continue dentro do Orkio OS com 7 dias gratuitos.`,
    systems: ["ERP", "CRM", "Financeiro", "Comunicação", "Dados & BI", "APIs & Sistemas"],
    pillars: [
      ["🛡", "IA Governável", "Decisões auditáveis e rastreáveis."],
      ["🧠", "Multiagentes", "Especialistas digitais trabalhando juntos."],
      ["🚀", "Execução Contínua", "Do planejamento à execução, com acompanhamento em tempo real."],
      ["🔒", "Segurança & Privacidade", "Proteção de dados, LGPD e controle granular de acesso."],
      ["🌿", "ESG Integrado", "Sustentabilidade e impacto positivo na estratégia do seu negócio."]
    ],
    steps: [
      ["◎", "1. Diagnóstico Inteligente", "Nossa IA analisa dados, identifica gargalos, padrões e oportunidades no seu negócio."],
      ["⌘", "2. Planejamento Estratégico", "Propõe cenários, metas e planos de ação sustentáveis alinhados aos seus objetivos."],
      ["ϟ", "3. Execução Assistida", "Agentes inteligentes automatizam processos e acompanham resultados em tempo real."],
      ["↗", "4. Aprendizado Contínuo", "O sistema aprende com os dados e evolui continuamente junto com a sua empresa."]
    ]
  },
  en: {
    nav: ["Resources", "How it works", "Integrations", "Solutions", "About"],
    eyebrow: "ENTERPRISE INTELLIGENCE OPERATING SYSTEM",
    title: <>Your business<br/><span className="grad-blue">operating</span> with<br/><span className="grad-blue">continuous</span> intelligence.</>,
    subtitle: "Orkio OS connects strategy, data, automation and execution into a multi-agent ecosystem that evolves alongside your company.",
    primary: "Start free diagnosis",
    secondary: "See Orkio in action",
    expert: "Talk to a specialist",
    ecosystem: "CONNECTS TO YOUR COMPANY ECOSYSTEM",
    inputPlaceholder: "Type your answer...",
    send: "Send",
    voice: "Voice",
    trial: "Continue with 7 free days",
    enterprise: "Request Enterprise deployment",
    intro: "Hello. I am Orkio. Before we begin, what is your name?",
    questions: [
      (name) => `Nice to meet you, ${name}. What is your company’s biggest challenge today?`,
      () => "What is your company segment?",
      () => "Do you already use integrated systems, automations, ERP, CRM or internal APIs?",
      () => "What would you like to improve in the next 90 days?"
    ],
    diagnosis: (ctx) => `Perfect, ${ctx.name}. I have created an initial evolution map: your company can gain efficiency by connecting strategy, data, automation and continuous execution. Continue inside Orkio OS with 7 free days.`,
    systems: ["ERP", "CRM", "Finance", "Communication", "Data & BI", "APIs & Systems"],
    pillars: [
      ["🛡", "Governable AI", "Auditable and traceable decisions."],
      ["🧠", "Multi-Agent Runtime", "Specialized digital agents working together."],
      ["🚀", "Continuous Execution", "From planning to execution, monitored in real time."],
      ["🔒", "Security & Privacy", "Data protection and granular access control."],
      ["🌿", "ESG Integrated", "Sustainability and positive impact embedded into strategy."]
    ],
    steps: [
      ["◎", "1. Intelligent Diagnosis", "AI analyzes data, identifies bottlenecks, patterns and opportunities."],
      ["⌘", "2. Strategic Planning", "Proposes scenarios, goals and sustainable action plans."],
      ["ϟ", "3. Assisted Execution", "Intelligent agents automate processes and monitor results."],
      ["↗", "4. Continuous Learning", "The system learns from data and evolves with your company."]
    ]
  }
};

function speak(text, lang = "pt") {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "pt" ? "pt-BR" : "en-US";
    u.rate = 0.94;
    u.pitch = 1.08;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const female = voices.find((v) => /female|woman|maria|luciana|google português|portuguese/i.test(v.name));
    if (female) u.voice = female;
    window.speechSynthesis.speak(u);
  } catch {}
}

export default function Landing() {
  const navigate = useNavigate?.();
  const [lang, setLang] = useState("pt");
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [ctx, setCtx] = useState({ name: "", challenge: "", segment: "", systems: "", goal: "" });
  const [messages, setMessages] = useState(() => [{ role: "bot", content: COPY.pt.intro }]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const t = COPY[lang];

  useEffect(() => {
    setMessages([{ role: "bot", content: t.intro }]);
    setStep(0);
    setInput("");
  }, [lang]);

  useEffect(() => {
    if (voiceEnabled) speak(messages[messages.length - 1]?.content || "", lang);
  }, [messages, voiceEnabled, lang]);

  const go = (path) => {
    try { navigate(path); }
    catch { window.location.href = path; }
  };

  const mail = () => {
    window.location.href = "mailto:contato@patroai.com?subject=Agendar%20demonstra%C3%A7%C3%A3o%20Orkio%20OS";
  };

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const currentQuestion = (nextCtx, nextStep) => {
    if (nextStep >= t.questions.length + 1) return t.diagnosis(nextCtx);
    if (nextStep === 1) return t.questions[0](nextCtx.name || ""); 
    return t.questions[nextStep - 1]?.(nextCtx) || t.diagnosis(nextCtx);
  };

  const submitAnswer = () => {
    const answer = input.trim();
    if (!answer) return;
    const keys = ["name", "challenge", "segment", "systems", "goal"];
    const key = keys[step] || "goal";
    const nextCtx = { ...ctx, [key]: answer };
    const nextStep = step + 1;
    const bot = currentQuestion(nextCtx, nextStep);
    setCtx(nextCtx);
    setStep(nextStep);
    setMessages((prev) => [...prev, { role: "user", content: answer }, { role: "bot", content: bot }]);
    setInput("");
  };

  const startVoice = () => {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        setMessages((prev) => [...prev, { role: "bot", content: lang === "pt" ? "Seu navegador não liberou reconhecimento de voz. Você pode responder por texto." : "Your browser did not enable voice recognition. You can answer by text." }]);
        return;
      }
      const rec = new SR();
      recognitionRef.current = rec;
      rec.lang = lang === "pt" ? "pt-BR" : "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (event) => {
        const txt = event?.results?.[0]?.[0]?.transcript || "";
        if (txt) setInput(txt);
      };
      rec.start();
    } catch {}
  };

  const continueTrial = () => {
    const payload = {
      ...ctx,
      lang,
      source: "orkio_landing_prechat",
      trial_days: 7,
      captured_at: new Date().toISOString(),
      summary: t.diagnosis(ctx),
    };
    try { window.localStorage?.setItem(PRECHAT_CONTEXT_KEY, JSON.stringify(payload)); } catch {}
    go("/auth?mode=register&trial=7&prechat=1");
  };

  const requestEnterprise = () => {
    const subject = encodeURIComponent("Solicitação Enterprise / White Label Orkio");
    const body = encodeURIComponent([
      "Olá, equipe PatroAI.",
      "",
      "Tenho interesse em integração, personalização ou implantação Enterprise do Orkio.",
      "",
      `Nome: ${ctx.name || ""}`,
      `Segmento: ${ctx.segment || ""}`,
      `Desafio: ${ctx.challenge || ""}`,
      `Sistemas/integrações: ${ctx.systems || ""}`,
      `Objetivo 90 dias: ${ctx.goal || ""}`,
    ].join("\n"));
    window.location.href = `mailto:contato@patroai.com?subject=${subject}&body=${body}`;
  };

  const diagnosisReady = step >= 5;

  return (
    <main className="lp-shell orkio">
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
  @media(max-width:720px){.container{width:min(100% - 28px,1460px)}.topbar{height:auto;padding:18px 0;align-items:flex-start;gap:14px}.actions{display:none}.brand-main{font-size:30px}.brand-sub{font-size:11px}.brand-emblem{width:56px;height:56px}.hero{padding-top:28px}.hero-ctas{flex-direction:column}.btn{width:100%;justify-content:center}.halo{width:330px;height:330px}.brain-icon{width:310px;height:310px}.central-word{font-size:44px}.orkio-sphere{width:260px;height:260px}.systems-list{position:relative;right:auto;top:auto;grid-template-columns:1fr 1fr}.dashboard-grid,.insight{grid-template-columns:1fr}.pill-row,.cards,.patroai .pill-row{grid-template-columns:1fr}}
  .prechat-panel{border:1px solid rgba(99,230,255,.24);background:linear-gradient(180deg,rgba(5,18,32,.88),rgba(3,8,16,.94));border-radius:24px;padding:18px;box-shadow:0 0 60px rgba(55,171,255,.12),inset 0 1px 0 rgba(255,255,255,.06)}
  .prechat-top{display:flex;gap:14px;align-items:center;margin-bottom:14px}.prechat-avatar{width:86px;height:86px;border-radius:28px;background:radial-gradient(circle at 50% 22%,rgba(109,220,255,.32),transparent 38%),linear-gradient(180deg,#16263a,#070b14);position:relative;box-shadow:0 0 26px rgba(96,210,255,.25);overflow:hidden;border:1px solid rgba(120,220,255,.2)}
  .prechat-avatar:before{content:"";position:absolute;left:22px;top:14px;width:42px;height:52px;border-radius:45% 45% 42% 42%;background:linear-gradient(180deg,#eaf8ff,#7488a4 44%,#111b28);box-shadow:inset 0 0 14px rgba(255,255,255,.28)}
  .prechat-avatar:after{content:"";position:absolute;left:35px;top:39px;width:16px;height:7px;border-bottom:2px solid rgba(255,255,255,.88);border-radius:0 0 20px 20px;box-shadow:-12px -10px 0 -4px #a65cff,12px -10px 0 -4px #a65cff}
  .prechat-pulse{position:absolute;inset:auto 22px 12px 22px;height:4px;border-radius:999px;background:linear-gradient(90deg,#6ee7ff,#9b3cff,#ffe58a);filter:drop-shadow(0 0 8px #6ee7ff);animation:pulse 1.8s ease-in-out infinite}
  .prechat-title{font-size:18px;font-weight:900}.prechat-sub{font-size:13px;color:rgba(255,255,255,.62);margin-top:4px}.prechat-log{height:210px;overflow:auto;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px}
  .bubble{max-width:92%;padding:11px 13px;border-radius:14px;font-size:14px;line-height:1.45}.bubble.bot{align-self:flex-start;background:rgba(88,205,255,.09);border:1px solid rgba(99,230,255,.18)}.bubble.user{align-self:flex-end;background:rgba(146,242,94,.12);border:1px solid rgba(146,242,94,.18)}
  .prechat-input{display:flex;gap:10px;margin-top:12px}.prechat-input input{flex:1;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:white;border-radius:12px;padding:13px 12px;outline:none}.prechat-input input:focus{border-color:rgba(99,230,255,.45)}
  .mini-btn{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:white;border-radius:12px;padding:0 14px;cursor:pointer}.mini-btn:hover{background:rgba(255,255,255,.09)}.voice-on{border-color:rgba(146,242,94,.42);color:#b8ff92}.prechat-hint{font-size:12px;color:rgba(255,255,255,.52);margin-top:10px}.plans-preview{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.plan-mini{border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px;background:rgba(255,255,255,.035);font-size:12px}.plan-mini strong{display:block;font-size:13px;margin-bottom:4px;color:#fff}
  @media(max-width:720px){.prechat-input{flex-wrap:wrap}.prechat-input input{min-width:100%}.plans-preview{grid-template-columns:1fr}}
`}</style>
      <div className="container">
        <header className="topbar">
          <button className="brand" onClick={() => go("/orkio")} aria-label="Orkio home">
            <img className="brand-emblem" src={A + "orkio-sphere-only.png"} alt="Orkio sphere" />
            <span className="brand-word">
              <span className="brand-main">ORKIO<sup style={{fontSize:14, marginLeft:4}}>™</sup> <span className="brand-os">OS</span></span>
            </span>
          </button>
          <nav className="nav">
            {t.nav.map((n) => <button key={n} onClick={() => scroll(n.toLowerCase().includes("como") || n.toLowerCase().includes("how") ? "como-funciona" : "orkio-recursos")}>{n}</button>)}
          </nav>
          <div className="actions">
            <button className="btn btn-secondary" onClick={mail}>{t.expert}</button>
            <button className="btn btn-primary" onClick={() => scroll("orkio-prechat")}>{t.primary} →</button>
            <button className="lang" onClick={() => setLang(lang === "pt" ? "en" : "pt")}>{lang === "pt" ? "EN" : "PT"}</button>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => scroll("orkio-prechat")}>{t.primary} →</button>
              <button className="btn btn-secondary" onClick={() => scroll("como-funciona")}>{t.secondary} ▶</button>
            </div>
          </div>

          <div className="visual-stage" aria-label="Orkio sphere and integrations">
            <div className="halo" />
            <div className="network" />
            <img className="orkio-sphere" src={A + "orkio-sphere-only.png"} alt="Orkio sphere" />
            <div className="pedestal" />
            <div className="systems-list">
              {t.systems.map((s,idx) => <div className="sys" key={s}><i>{["◎","◌","$","☏","▥","<>"][idx]}</i><span>{s}</span></div>)}
            </div>
          </div>

          <aside id="orkio-prechat" className="prechat-panel">
            <div className="prechat-top">
              <div className="prechat-avatar"><span className="prechat-pulse" /></div>
              <div>
                <div className="prechat-title">Orkio Experience</div>
                <div className="prechat-sub">{lang === "pt" ? "Diagnóstico pré-login com voz e texto" : "Pre-login diagnosis with voice and text"}</div>
              </div>
            </div>
            <div className="prechat-log">
              {messages.map((m, i) => <div key={i} className={`bubble ${m.role === "user" ? "user" : "bot"}`}>{m.content}</div>)}
            </div>
            <div className="prechat-input">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitAnswer()} placeholder={t.inputPlaceholder} />
              <button className="mini-btn" onClick={submitAnswer}>{t.send}</button>
              <button className={`mini-btn ${voiceEnabled ? "voice-on" : ""}`} onClick={() => setVoiceEnabled((v) => !v)}>{t.voice}</button>
              <button className="mini-btn" onClick={startVoice}>🎙</button>
            </div>
            <div className="prechat-hint">{lang === "pt" ? "A conversa é salva localmente e importada após o cadastro." : "This conversation is stored locally and imported after signup."}</div>
            {diagnosisReady && (
              <>
                <div className="plans-preview">
                  <div className="plan-mini"><strong>Essencial</strong>7 dias grátis + agentes base</div>
                  <div className="plan-mini"><strong>Professional</strong>Workflows e relatórios</div>
                  <div className="plan-mini"><strong>Enterprise</strong>White label e integrações</div>
                </div>
                <div className="hero-ctas" style={{marginTop:14}}>
                  <button className="btn btn-primary" onClick={continueTrial}>{t.trial} →</button>
                  <button className="btn btn-secondary" onClick={requestEnterprise}>{t.enterprise}</button>
                </div>
              </>
            )}
          </aside>
        </section>

        <section id="orkio-recursos" className="pill-row">
          {t.pillars.map(([i,h,d]) => <div className="pill" key={h}><span className="ico" style={{color:h.includes("ESG") ? "#8df95a" : h.includes("Multi") ? "#63e6ff" : "#8df95a"}}>{i}</span><div><strong>{h}</strong><span>{d}</span></div></div>)}
        </section>

        <h2 id="como-funciona" className="section-title">COMO O <b>ORKIO</b> FUNCIONA</h2>
        <section className="cards">
          {t.steps.map(([i,h,d], idx) => <article className="card" key={h}><span className="ico" style={{color: idx === 2 ? "#47a9ff" : "#8df95a"}}>{i}</span><h3>{h}</h3><p>{d}</p>{idx < 3 && <span className="arrow-line">→</span>}</article>)}
        </section>
      </div>
    </main>
  );
}
