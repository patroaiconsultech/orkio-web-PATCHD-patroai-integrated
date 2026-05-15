import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  savePrechatContext,
  submitEnterpriseLead,
} from "../ui/api.js";

const A = "/patroai-assets/";

const COPY = {
  pt: {
    nav: ["Recursos", "Como funciona", "Integrações", "Soluções", "Sobre nós"],
    eyebrow: "SISTEMA OPERACIONAL DE INTELIGÊNCIA EMPRESARIAL",
    title: (
      <>
        Seu negócio<br />
        <span className="blue">operando</span> com<br />
        <span className="blue">inteligência</span> contínua.
      </>
    ),
    subtitle:
      "O Orkio OS conecta estratégia, dados, automação e execução em um ecossistema de agentes inteligentes que evolui com a sua empresa.",
    primary: "Agendar uma demonstração",
    secondary: "Ver Orkio em ação",
    specialist: "Falar com especialista",
    ecosystem: "INTEGRA-SE AO ECOSSISTEMA DA SUA EMPRESA",
    systems: ["ERP", "CRM", "Financeiro", "Comunicação", "Dados & BI", "APIs & Sistemas"],
    pillars: [
      ["shield", "IA Governável", "Decisões auditáveis e rastreáveis."],
      ["brain", "Multiagentes", "Especialistas digitais trabalhando juntos."],
      ["rocket", "Execução Contínua", "Do planejamento à execução, com acompanhamento em tempo real."],
      ["lock", "Segurança & Privacidade", "Proteção de dados, LGPD e controle granular de acesso."],
      ["leaf", "ESG Integrado", "Sustentabilidade e impacto positivo na estratégia do seu negócio."],
    ],
    steps: [
      ["1.", "Diagnóstico Inteligente", "Nossa IA analisa dados, identifica gargalos, padrões e oportunidades no seu negócio."],
      ["2.", "Planejamento Estratégico", "Propõe cenários, metas e planos de ação sustentáveis alinhados aos seus objetivos."],
      ["3.", "Execução Assistida", "Agentes inteligentes automatizam processos e acompanham resultados em tempo real."],
      ["4.", "Aprendizado Contínuo", "O sistema aprende com os dados e evolui continuamente junto com a sua empresa."],
    ],
    chatTitle: "Olá. Eu sou a Orkio.",
    chatIntro: "Antes de começarmos, qual é o seu nome?",
    chatPlaceholder: "Digite sua resposta...",
    mic: "Falar",
    send: "Enviar",
    continueTrial: "Continuar com 7 dias grátis",
    enterprise: "Solicitar implantação personalizada",
    reset: "Reiniciar diagnóstico",
    plansTitle: "Planos Orkio OS",
    plans: [
      ["Essencial", "Agentes base, diagnóstico e execução assistida para começar."],
      ["Professional", "Multiagentes, relatórios, workflows e inteligência operacional avançada."],
      ["Enterprise / White Label", "Integrações, personalização, governança ampliada e implantação assistida."],
    ],
  },
  en: {
    nav: ["Resources", "How it works", "Integrations", "Solutions", "About"],
    eyebrow: "ENTERPRISE INTELLIGENCE OPERATING SYSTEM",
    title: (
      <>
        Your business<br />
        <span className="blue">operating</span> with<br />
        <span className="blue">continuous</span> intelligence.
      </>
    ),
    subtitle:
      "Orkio OS connects strategy, data, automation and execution into a multi-agent ecosystem that evolves alongside your company.",
    primary: "Schedule a demo",
    secondary: "See Orkio in action",
    specialist: "Talk to a specialist",
    ecosystem: "CONNECTED TO YOUR COMPANY ECOSYSTEM",
    systems: ["ERP", "CRM", "Finance", "Communication", "Data & BI", "APIs & Systems"],
    pillars: [
      ["shield", "Governable AI", "Auditable and traceable decisions."],
      ["brain", "Multi-Agent Runtime", "Specialized digital agents working together."],
      ["rocket", "Continuous Execution", "From planning to execution, monitored in real time."],
      ["lock", "Security & Privacy", "Data protection and granular access control."],
      ["leaf", "ESG Integrated", "Sustainability and positive impact embedded into strategy."],
    ],
    steps: [
      ["1.", "Intelligent Diagnosis", "AI analyzes data, identifies bottlenecks, patterns and opportunities."],
      ["2.", "Strategic Planning", "Proposes scenarios, goals and sustainable action plans."],
      ["3.", "Assisted Execution", "Intelligent agents automate processes and monitor results."],
      ["4.", "Continuous Learning", "The system learns from data and evolves with your company."],
    ],
    chatTitle: "Hello. I am Orkio.",
    chatIntro: "Before we begin, what is your name?",
    chatPlaceholder: "Type your answer...",
    mic: "Speak",
    send: "Send",
    continueTrial: "Continue with 7 free days",
    enterprise: "Request custom implementation",
    reset: "Restart diagnosis",
    plansTitle: "Orkio OS Plans",
    plans: [
      ["Essential", "Core agents, diagnosis and assisted execution to get started."],
      ["Professional", "Multi-agent workflows, reports and advanced operational intelligence."],
      ["Enterprise / White Label", "Integrations, customization, advanced governance and assisted deployment."],
    ],
  },
};

function Icon({ name }) {
  const paths = {
    shield: "M12 2l7 3v6c0 5-3.5 8.7-7 10-3.5-1.3-7-5-7-10V5l7-3zm-3 10l2 2 4-5",
    brain: "M8 8a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0V8zm4-4v16M7 10H4m16 0h-3M7 15H4m16 0h-3",
    rocket: "M13 3c4 1 7 4 8 8l-5 5-5-5 2-8zM8 14l2 2-4 4-2-2 4-4zm7-6l2 2",
    lock: "M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6V10zm6 4v3",
    leaf: "M20 4C12 4 6 8 5 16c6 1 12-1 15-12zM5 20c3-5 7-8 13-11",
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name] || paths.brain} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function speak(text, lang = "pt-BR") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.94;
  utterance.pitch = 1.08;
  const voices = window.speechSynthesis.getVoices?.() || [];
  const preferred = voices.find((v) => /female|maria|luciana|francisca|google português|portuguese/i.test(v.name)) || voices.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase().slice(0, 2)));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

function buildDiagnosis(answers, lang) {
  const name = answers.name || (lang === "pt" ? "você" : "you");
  const challenge = answers.challenge || "";
  const segment = answers.segment || "";
  const systems = answers.systems || "";
  const goal = answers.goal || "";
  if (lang === "en") {
    return `${name}, I identified an initial path: connect the operation around your main challenge (${challenge || "operational efficiency"}), map the key processes in ${segment || "your business"}, organize the systems already in use (${systems || "current tools"}) and turn the next 90 days into a measurable execution plan focused on ${goal || "growth and operational clarity"}.`;
  }
  return `${name}, identifiquei um primeiro caminho: conectar a operação ao redor do principal desafio (${challenge || "eficiência operacional"}), mapear os processos críticos em ${segment || "sua empresa"}, organizar os sistemas já utilizados (${systems || "ferramentas atuais"}) e transformar os próximos 90 dias em um plano mensurável de execução focado em ${goal || "crescimento com clareza operacional"}.`;
}

function OrkioPreChat({ lang, onClose }) {
  const t = COPY[lang];
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orkio_prechat_context") || "{}")?.answers || {};
    } catch {
      return {};
    }
  });
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("orkio_prechat_context") || "{}");
      if (Array.isArray(saved.messages) && saved.messages.length) return saved.messages;
    } catch {}
    return [{ role: "orkio", text: t.chatIntro }];
  });
  const [listening, setListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const prompts = useMemo(() => lang === "pt"
    ? [
        ["name", "Antes de começarmos, qual é o seu nome?"],
        ["challenge", (a) => `Prazer, ${a.name || ""}. Qual é hoje o maior desafio da sua empresa?`],
        ["segment", "Qual é o segmento da sua empresa?"],
        ["systems", "Vocês já usam sistemas, automações, ERP, CRM ou ferramentas internas?"],
        ["goal", "O que você gostaria de melhorar nos próximos 90 dias?"],
      ]
    : [
        ["name", "Before we begin, what is your name?"],
        ["challenge", (a) => `Nice to meet you, ${a.name || ""}. What is your company's biggest challenge today?`],
        ["segment", "What industry or segment does your company operate in?"],
        ["systems", "Do you already use systems, automations, ERP, CRM or internal tools?"],
        ["goal", "What would you like to improve in the next 90 days?"],
      ], [lang]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "orkio") speak(last.text, lang === "pt" ? "pt-BR" : "en-US");
  }, [messages, lang]);

  useEffect(() => {
    const context = {
      source: "orkio_public_prechat",
      language: lang,
      answers,
      messages,
      diagnosis: step >= prompts.length ? buildDiagnosis(answers, lang) : "",
      trial_days: 7,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem("orkio_prechat_context", JSON.stringify(context));
  }, [answers, messages, step, lang, prompts.length]);

  const askNext = (nextStep, nextAnswers) => {
    if (nextStep >= prompts.length) {
      const diagnosis = buildDiagnosis(nextAnswers, lang);
      setMessages((m) => [
        ...m,
        { role: "orkio", text: diagnosis },
        {
          role: "orkio",
          text:
            lang === "pt"
              ? "Criei um primeiro mapa estratégico para sua empresa. Continue essa análise dentro do Orkio OS com 7 dias gratuitos."
              : "I created a first strategic map for your company. Continue this analysis inside Orkio OS with 7 free days.",
        },
      ]);
      return;
    }
    const prompt = prompts[nextStep][1];
    setMessages((m) => [...m, { role: "orkio", text: typeof prompt === "function" ? prompt(nextAnswers) : prompt }]);
  };

  const send = async () => {
    const value = input.trim();
    if (!value) return;
    const key = prompts[Math.min(step, prompts.length - 1)]?.[0] || "note";
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    setMessages((m) => [...m, { role: "user", text: value }]);
    setInput("");
    const nextStep = step + 1;
    setStep(nextStep);
    setTimeout(() => askNext(nextStep, nextAnswers), 450);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(lang === "pt" ? "Seu navegador não liberou reconhecimento de voz. Use o campo de texto." : "Voice recognition is not available. Please type your answer.");
      return;
    }
    const recognition = new SR();
    recognition.lang = lang === "pt" ? "pt-BR" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setInput(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const continueTrial = () => {
    savePrechatContext({
      language: lang,
      answers,
      messages,
      diagnosis: buildDiagnosis(answers, lang),
      trial_days: 7,
      source: "orkio_public_prechat",
    }).catch(() => null);
    navigate("/auth?mode=register&trial=7&source=orkio-prechat");
  };

  const requestEnterprise = async () => {
    setSubmitted(true);
    const payload = {
      name: answers.name || "",
      source: "orkio_public_prechat",
      interest_type: "enterprise_white_label_integrations",
      message: buildDiagnosis(answers, lang),
      metadata: { answers, language: lang, trial_days: 7 },
    };
    await submitEnterpriseLead(payload).catch(() => {
      const subject = encodeURIComponent("Solicitação Enterprise / White Label - Orkio OS");
      const body = encodeURIComponent(JSON.stringify(payload, null, 2));
      window.location.href = `mailto:daniel@patroai.com?subject=${subject}&body=${body}`;
    });
  };

  const reset = () => {
    localStorage.removeItem("orkio_prechat_context");
    setStep(0);
    setAnswers({});
    setInput("");
    setMessages([{ role: "orkio", text: t.chatIntro }]);
    setSubmitted(false);
  };

  return (
    <div className="prechat-backdrop" role="dialog" aria-modal="true">
      <div className="prechat-panel">
        <button className="prechat-close" onClick={onClose} aria-label="Fechar">×</button>
        <div className="prechat-avatar">
          <div className={`digital-face ${listening ? "listening" : ""}`}>
            <span className="face-eye left" />
            <span className="face-eye right" />
            <span className="face-smile" />
          </div>
          <div>
            <h3>{t.chatTitle}</h3>
            <p>{lang === "pt" ? "Consultora executiva de IA para diagnóstico e evolução empresarial." : "Executive AI consultant for business diagnosis and evolution."}</p>
          </div>
        </div>

        <div className="prechat-feed">
          {messages.map((m, i) => (
            <div key={`${m.role}-${i}`} className={`bubble ${m.role}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="prechat-input">
          <button className={`voice-btn ${listening ? "active" : ""}`} onClick={startVoice}>{listening ? "..." : t.mic}</button>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={t.chatPlaceholder} />
          <button onClick={send}>{t.send}</button>
        </div>

        {step >= prompts.length && (
          <div className="prechat-actions">
            <button className="btn btn-primary" onClick={continueTrial}>{t.continueTrial} →</button>
            <button className="btn btn-secondary" onClick={requestEnterprise}>{submitted ? (lang === "pt" ? "Solicitação registrada" : "Request registered") : t.enterprise}</button>
            <button className="link-btn" onClick={reset}>{t.reset}</button>
          </div>
        )}

        <div className="plan-strip">
          <strong>{t.plansTitle}</strong>
          <div>
            {t.plans.map(([name, desc]) => (
              <span key={name}><b>{name}</b>{desc}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("pt");
  const [chatOpen, setChatOpen] = useState(false);
  const t = COPY[lang];

  const go = (path) => navigate(path);
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const demo = () => setChatOpen(true);
  const specialist = () => {
    window.location.href = "mailto:daniel@patroai.com?subject=Orkio%20OS%20-%20Falar%20com%20especialista";
  };

  return (
    <main className="orkio-page">
      <style>{`
        :root{--bg:#02060c;--panel:#06111b;--line:rgba(255,255,255,.12);--soft:rgba(255,255,255,.72);--white:#f8fbff;--green:#92f25e;--blue:#32a9ff;--cyan:#63e6ff;--purple:#9b3cff;--gold:#f5b821}
        *{box-sizing:border-box} body{margin:0;background:#02060c;color:var(--white);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif} button,a{font:inherit}
        .orkio-page{min-height:100vh;background:radial-gradient(circle at 58% 30%,rgba(35,160,255,.17),transparent 34%),radial-gradient(circle at 82% 24%,rgba(146,242,94,.09),transparent 24%),linear-gradient(180deg,#030911 0%,#02060c 66%,#010307 100%);overflow:hidden;position:relative}
        .orkio-page:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(90,190,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(90,190,255,.035) 1px,transparent 1px);background-size:76px 76px;mask-image:linear-gradient(to bottom,black 0%,black 75%,transparent 100%);opacity:.35;pointer-events:none}
        .container{width:min(1480px,calc(100% - 56px));margin:0 auto;position:relative;z-index:1}.topbar{height:94px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.055)}
        .brand{display:flex;align-items:center;gap:14px;cursor:pointer;border:0;background:transparent;color:inherit;padding:0}.brand img{width:66px;height:66px;border-radius:50%;object-fit:contain;filter:drop-shadow(0 0 28px rgba(70,185,255,.42))}
        .brand-main{font-size:39px;font-weight:900;letter-spacing:.03em}.brand-os{font-size:24px;color:var(--green);font-weight:900;margin-left:10px}.nav{display:flex;align-items:center;gap:44px;color:rgba(255,255,255,.86);font-weight:520}.nav button{background:transparent;color:inherit;border:0;cursor:pointer;padding:10px 0}.nav button:hover{color:white}
        .actions{display:flex;align-items:center;gap:16px}.btn{border:1px solid var(--line);border-radius:11px;background:rgba(255,255,255,.03);color:white;padding:14px 22px;cursor:pointer;transition:.25s ease;display:inline-flex;align-items:center;justify-content:center;gap:10px;text-decoration:none}.btn:hover{transform:translateY(-1px);border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.07)}
        .btn-primary{background:linear-gradient(135deg,#a8f263,#58b737);color:#07120a;border-color:rgba(160,244,96,.7);box-shadow:0 0 32px rgba(129,239,87,.22);font-weight:800}.btn-secondary{background:rgba(3,12,22,.65);border-color:rgba(255,255,255,.18)}.lang{border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:8px 12px;background:rgba(255,255,255,.04);color:rgba(255,255,255,.8);cursor:pointer}
        .hero{display:grid;grid-template-columns:minmax(360px,.88fr) minmax(420px,1.12fr) minmax(330px,.82fr);gap:34px;align-items:center;padding:50px 0 28px}.eyebrow{display:inline-flex;border:1px solid rgba(146,242,94,.52);color:var(--green);border-radius:999px;padding:10px 18px;letter-spacing:.075em;font-size:14px;font-weight:800;background:rgba(146,242,94,.05);margin-bottom:28px}
        h1{margin:0;font-size:clamp(44px,4.35vw,74px);line-height:1.08;letter-spacing:-.058em}.blue{background:linear-gradient(90deg,#8ef35e 0%,#35aaff 78%,#e8edf4 100%);-webkit-background-clip:text;background-clip:text;color:transparent}.hero p{color:rgba(255,255,255,.78);font-size:18px;line-height:1.7;margin:28px 0 32px;max-width:650px}.hero-ctas{display:flex;gap:18px;flex-wrap:wrap}
        .visual-stage{position:relative;min-height:460px;display:grid;place-items:center}.halo{position:absolute;width:510px;height:510px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(76,179,255,.22),transparent 18%),radial-gradient(circle at 50% 50%,transparent 36%,rgba(92,216,255,.82) 37%,rgba(92,216,255,.18) 38%,transparent 39%),radial-gradient(circle at 50% 50%,rgba(146,242,94,.15),transparent 65%);filter:drop-shadow(0 0 26px rgba(55,175,255,.45));animation:pulse 4.2s ease-in-out infinite}
        .sphere-fallback{position:absolute;width:310px;height:310px;border-radius:50%;background:radial-gradient(circle at 62% 26%,#b9efff 0 8%,#2466ab 22%,#0b2f66 42%,#143b35 58%,#f4b930 74%,#0d1830 100%);box-shadow:inset -28px -34px 60px rgba(0,0,0,.45),0 0 50px rgba(54,170,255,.55)}.sphere-fallback:after{content:"";position:absolute;left:12%;top:6%;width:62%;height:34%;border-radius:80% 20% 80% 25%;background:linear-gradient(145deg,#caff8e,#4fa341);transform:rotate(-20deg);box-shadow:inset 0 -8px 15px rgba(0,0,0,.22)}
        .orkio-sphere{position:relative;z-index:2;width:330px;height:330px;object-fit:contain;filter:drop-shadow(0 0 38px rgba(68,178,255,.55)) drop-shadow(0 18px 42px rgba(0,0,0,.78));animation:float 6s ease-in-out infinite}.network{position:absolute;right:-58px;width:520px;height:390px;opacity:.88;background:linear-gradient(90deg,transparent,rgba(52,170,255,.22),transparent),repeating-linear-gradient(12deg,transparent 0 28px,rgba(85,200,255,.22) 29px 30px);mask-image:linear-gradient(90deg,transparent,black 16%,black 74%,transparent);filter:drop-shadow(0 0 20px rgba(67,177,255,.25))}
        .pedestal{position:absolute;bottom:42px;width:270px;height:48px;border-radius:50%;border:1px solid rgba(75,194,255,.55);background:radial-gradient(ellipse at center,rgba(72,177,255,.24),transparent 68%);filter:drop-shadow(0 0 20px rgba(75,194,255,.3))}.systems-list{position:absolute;right:-22px;top:77px;display:grid;gap:15px;z-index:3}.sys{display:flex;align-items:center;gap:12px;color:#eaf8ff;font-size:14px}.sys i{width:42px;height:42px;border-radius:50%;border:1px solid rgba(99,230,255,.64);display:grid;place-items:center;background:rgba(2,12,20,.8);box-shadow:0 0 18px rgba(99,230,255,.18)}
        .dashboard-card{position:relative;border:1px solid rgba(99,230,255,.2);background:linear-gradient(180deg,rgba(4,17,28,.82),rgba(2,8,15,.9));border-radius:18px;padding:18px;box-shadow:0 0 44px rgba(54,168,255,.09)}.dashboard-title{text-align:center;font-size:13px;letter-spacing:.08em;font-weight:900;color:#eaffff;margin-bottom:12px}.dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.metric-card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);border-radius:12px;padding:14px}.rings{display:flex;gap:12px}.ring{width:60px;height:60px;border-radius:50%;border:6px solid rgba(146,242,94,.28);border-top-color:var(--green);display:grid;place-items:center;font-size:13px;font-weight:900}.line-chart{height:82px;background:linear-gradient(135deg,transparent 20%,rgba(71,169,255,.1));border-bottom:1px solid rgba(83,200,255,.25);position:relative;overflow:hidden}.line-chart:before{content:"";position:absolute;inset:28px 0 18px 0;border-top:3px solid #56c7ff;transform:skewY(-14deg)}.mini-flow{height:82px;display:grid;place-items:center;color:rgba(255,255,255,.75);font-size:13px}.insight{grid-column:1/3;font-size:12px;color:rgba(255,255,255,.62)}
        .pill-row{display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-top:1px solid rgba(255,255,255,.08);border-bottom:1px solid rgba(255,255,255,.08);padding:22px 0;margin:8px 0 28px}.pill{display:flex;gap:14px;padding:0 20px;border-right:1px solid rgba(255,255,255,.12);align-items:center}.pill:last-child{border-right:0}.ico{width:46px;height:46px;border-radius:14px;border:1px solid currentColor;display:grid;place-items:center;color:#8df95a;filter:drop-shadow(0 0 10px currentColor)}.ico svg{width:24px;height:24px}.pill strong{display:block;font-size:17px;margin-bottom:6px}.pill span{color:rgba(255,255,255,.66);font-size:14px;line-height:1.35}.section-title{text-align:center;font-size:22px;letter-spacing:.12em;margin:28px 0;color:rgba(255,255,255,.75)}.section-title b{color:var(--green)}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;padding-bottom:68px}.card{border:1px solid rgba(255,255,255,.1);border-radius:20px;background:linear-gradient(180deg,rgba(7,17,30,.72),rgba(4,9,16,.86));padding:28px;min-height:190px;box-shadow:0 0 35px rgba(0,0,0,.28);position:relative;overflow:hidden}.card h3{font-size:22px;margin:18px 0 10px}.card p{color:rgba(255,255,255,.68);line-height:1.55;margin:0}.num-ico{font-size:28px;font-weight:900}.arrow-line{position:absolute;right:-24px;top:50%;color:var(--green);font-size:38px;z-index:4}
        .floating-assistant{position:fixed;right:28px;bottom:24px;z-index:8;width:68px;height:68px;border-radius:50%;border:1px solid rgba(110,226,255,.65);background:radial-gradient(circle at 50% 35%,#2ed4ff 0 16%,#10243a 55%,#030810 100%);box-shadow:0 0 28px rgba(68,205,255,.45);cursor:pointer}.floating-assistant:before,.floating-assistant:after{content:"";position:absolute;top:27px;width:7px;height:10px;background:#d7fbff;border-radius:50%;box-shadow:0 0 10px #8ff}.floating-assistant:before{left:22px}.floating-assistant:after{right:22px}.floating-assistant span{position:absolute;left:24px;top:42px;width:20px;height:10px;border-bottom:2px solid #d9fbff;border-radius:0 0 20px 20px}
        .prechat-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(10px);z-index:30;display:grid;place-items:center;padding:20px}.prechat-panel{width:min(720px,100%);max-height:min(88vh,850px);overflow:auto;border:1px solid rgba(120,220,255,.25);border-radius:24px;background:linear-gradient(180deg,rgba(6,18,31,.96),rgba(2,6,12,.98));box-shadow:0 0 70px rgba(52,170,255,.22);padding:22px;position:relative}.prechat-close{position:absolute;right:18px;top:14px;background:transparent;color:white;border:0;font-size:30px;cursor:pointer}.prechat-avatar{display:flex;gap:18px;align-items:center;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:18px}.digital-face{width:108px;height:120px;border-radius:45% 45% 42% 42%;background:linear-gradient(180deg,#dcefff,#6e8196 38%,#111925 74%);box-shadow:inset 0 0 25px rgba(255,255,255,.26),0 0 26px rgba(76,179,255,.45);position:relative;flex:0 0 auto}.digital-face:before{content:"";position:absolute;left:-16px;top:50px;width:18px;height:40px;border-radius:12px;background:linear-gradient(180deg,#ffd45b,#462c92);box-shadow:140px 0 0 #6a38dc}.digital-face.listening{animation:pulse 1.1s infinite}.face-eye{position:absolute;top:62px;width:13px;height:13px;background:#8e54ff;border-radius:50%;box-shadow:0 0 16px #9f55ff}.face-eye.left{left:31px}.face-eye.right{right:31px}.face-smile{position:absolute;left:38px;top:91px;width:32px;height:15px;border-bottom:3px solid rgba(255,255,255,.82);border-radius:0 0 30px 30px}.prechat-avatar h3{font-size:24px;margin:0 0 6px}.prechat-avatar p{margin:0;color:rgba(255,255,255,.66);line-height:1.4}.prechat-feed{display:grid;gap:12px;padding:18px 0;max-height:310px;overflow:auto}.bubble{padding:13px 15px;border-radius:16px;line-height:1.45;max-width:88%;font-size:15px}.bubble.orkio{background:rgba(88,183,55,.12);border:1px solid rgba(146,242,94,.22);justify-self:start}.bubble.user{background:rgba(50,169,255,.12);border:1px solid rgba(50,169,255,.22);justify-self:end}.prechat-input{display:grid;grid-template-columns:auto 1fr auto;gap:10px}.prechat-input input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);color:white;border-radius:12px;padding:13px 14px}.prechat-input button,.voice-btn{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:white;border-radius:12px;padding:12px 14px;cursor:pointer}.voice-btn.active{background:rgba(146,242,94,.18);border-color:rgba(146,242,94,.55)}.prechat-actions{display:grid;gap:10px;margin-top:16px}.link-btn{background:transparent;color:rgba(255,255,255,.65);border:0;cursor:pointer;text-decoration:underline}.plan-strip{margin-top:18px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px}.plan-strip strong{display:block;margin-bottom:10px}.plan-strip div{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.plan-strip span{border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px;color:rgba(255,255,255,.65);font-size:12px}.plan-strip b{display:block;color:#fff;margin-bottom:6px}
        @keyframes pulse{0%,100%{transform:scale(.98);opacity:.85}50%{transform:scale(1.03);opacity:1}}@keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-16px) rotate(2deg)}}
        @media(max-width:1180px){.hero{grid-template-columns:1fr;gap:22px}.visual-stage{min-height:420px}.pill-row,.cards{grid-template-columns:1fr 1fr}.pill{border-right:0;border-bottom:1px solid rgba(255,255,255,.1);padding:18px}.nav{display:none}.dashboard-card{max-width:720px;margin:auto}}
        @media(max-width:720px){.container{width:min(100% - 28px,1480px)}.topbar{height:auto;padding:18px 0}.actions{display:none}.brand-main{font-size:30px}.brand img{width:56px;height:56px}.hero{padding-top:28px}.hero-ctas{flex-direction:column}.btn{width:100%}.halo{width:330px;height:330px}.orkio-sphere,.sphere-fallback{width:250px;height:250px}.systems-list{position:relative;right:auto;top:auto;grid-template-columns:1fr 1fr}.dashboard-grid,.plan-strip div{grid-template-columns:1fr}.pill-row,.cards{grid-template-columns:1fr}}`}</style>

      <div className="container">
        <header className="topbar">
          <button className="brand" onClick={() => go("/orkio")} aria-label="Orkio home">
            <img src={A + "orkio-sphere-only.png"} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span className="brand-main">ORKIO<sup style={{ fontSize: 14, marginLeft: 4 }}>™</sup><span className="brand-os">OS</span></span>
          </button>
          <nav className="nav">
            {t.nav.map((n) => (
              <button key={n} onClick={() => scroll(n.toLowerCase().includes("como") || n.toLowerCase().includes("how") ? "como-funciona" : "orkio-recursos")}>{n}</button>
            ))}
          </nav>
          <div className="actions">
            <button className="btn btn-secondary" onClick={specialist}>{t.specialist}</button>
            <button className="btn btn-primary" onClick={demo}>{t.primary} →</button>
            <button className="lang" onClick={() => setLang(lang === "pt" ? "en" : "pt")}>{lang === "pt" ? "EN" : "PT"}</button>
          </div>
        </header>

        <section className="hero">
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={demo}>{t.primary} →</button>
              <button className="btn btn-secondary" onClick={demo}>{t.secondary} ▶</button>
            </div>
          </div>

          <div className="visual-stage" aria-label="Orkio sphere and integrations">
            <div className="halo" />
            <div className="network" />
            <div className="sphere-fallback" />
            <img className="orkio-sphere" src={A + "orkio-sphere-only.png"} alt="Orkio sphere" onError={(e) => { e.currentTarget.style.opacity = 0; }} />
            <div className="pedestal" />
            <div className="systems-list">
              {t.systems.map((s, idx) => <div className="sys" key={s}><i>{["◎", "◌", "$", "☏", "▥", "<>"][idx]}</i><span>{s}</span></div>)}
            </div>
          </div>

          <aside className="dashboard-card">
            <div className="dashboard-title">{t.ecosystem}</div>
            <div className="dashboard-grid">
              <div className="metric-card">
                <strong>Painel Orkio OS</strong>
                <div className="rings"><span className="ring">92%</span><span className="ring">85%</span><span className="ring">78%</span></div>
              </div>
              <div className="metric-card"><strong>Atividades em tempo real</strong><div className="mini-flow">Planos executados · Tarefas automatizadas · Alertas inteligentes</div></div>
              <div className="metric-card"><strong>Fluxo de Operações</strong><div className="mini-flow">multiagentes conectados</div></div>
              <div className="metric-card"><strong>Performance Geral</strong><div className="line-chart" /></div>
              <div className="metric-card insight">Insights inteligentes: oportunidade de otimização identificada no processo operacional.</div>
            </div>
          </aside>
        </section>

        <section id="orkio-recursos" className="pill-row">
          {t.pillars.map(([i, h, d]) => <div className="pill" key={h}><span className="ico"><Icon name={i} /></span><div><strong>{h}</strong><span>{d}</span></div></div>)}
        </section>

        <h2 id="como-funciona" className="section-title">COMO O <b>ORKIO</b> FUNCIONA</h2>
        <section className="cards">
          {t.steps.map(([i, h, d], idx) => <article className="card" key={h}><span className="ico num-ico">{i}</span><h3>{h}</h3><p>{d}</p>{idx < 3 && <span className="arrow-line">→</span>}</article>)}
        </section>
      </div>

      <button className="floating-assistant" onClick={() => setChatOpen(true)} aria-label="Conversar com Orkio"><span /></button>
      {chatOpen && <OrkioPreChat lang={lang} onClose={() => setChatOpen(false)} />}
    </main>
  );
}
