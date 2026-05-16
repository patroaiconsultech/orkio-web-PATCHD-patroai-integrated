import React, { useMemo, useRef, useState } from "react";
import OrkioSphereMark from "../ui/OrkioSphereMark.jsx";
import PricingCheckoutModal from "../ui/PricingCheckoutModal.jsx";
import { ORKIO_DEFAULT_VOICE_ID, coerceTtsSpeed, coerceVoiceId } from "../lib/voices.js";

const COPY = {
  "pt-BR": {
    kicker: "PatroAI apresenta Orkio",
    title: "Bem-vindo ao Orkio",
    subtitle:
      "Clareza, direção e próxima ação em um único ponto de entrada. O shell do console permanece intacto, mas o centro da experiência passa a parecer vivo.",
    listen: "Ouvir Orkio",
    primary: "Iniciar conversa guiada",
    secondary: "Abrir blueprint",
    tertiary: "Próximos passos",
    pricing: "Ver planos",
    voiceReady: "Voz pronta",
    voicePlaying: "Orkio falando",
    quickStart: "Começos rápidos",
    plansTitle: "Pricing do Orkio",
    plansSubtitle: "Escolha o nível de profundidade, velocidade e governança ideal para sua operação.",
    lines: [
      "Quero um diagnóstico executivo da plataforma",
      "Monte um plano cirúrgico para a próxima melhoria",
      "Mostre a prioridade mais importante desta semana",
    ],
    speech:
      "Olá, eu sou a Orkio. Respira comigo por um instante. Eu estou aqui para trazer clareza, direção e próximos passos — com calma, presença e precisão.",
  },
  "en-US": {
    kicker: "PatroAI presents Orkio",
    title: "Welcome to Orkio",
    subtitle:
      "Clarity, direction, and the next best action in a single entry point. The console shell stays intact, but the center of the experience now feels alive.",
    listen: "Listen to Orkio",
    primary: "Start guided conversation",
    secondary: "Open blueprint",
    tertiary: "Next steps",
    pricing: "View plans",
    voiceReady: "Voice ready",
    voicePlaying: "Orkio speaking",
    quickStart: "Quick starts",
    plansTitle: "Orkio pricing",
    plansSubtitle: "Choose the right level of depth, speed, and governance for your operation.",
    lines: [
      "I want an executive diagnosis of the platform",
      "Build a surgical plan for the next improvement",
      "Show me the most important priority this week",
    ],
    speech:
      "Hello, I’m Orkio. Take a breath with me. I’m here to bring clarity, direction, and the next best steps — calmly, clearly, and with presence.",
  },
};

const PLAN_CARDS = {
  "pt-BR": [
    { name: "Essential", price: "US$ 20", copy: "Entrada inteligente com governança e clareza operacional." },
    { name: "Premium", price: "US$ 49", copy: "Mais profundidade, mais ritmo e mais capacidade executiva." },
    { name: "Superpremium", price: "US$ 149", copy: "Maior densidade estratégica, operação guiada e valor percebido superior." },
  ],
  "en-US": [
    { name: "Essential", price: "US$ 20", copy: "Smart entry with governance and operational clarity." },
    { name: "Premium", price: "US$ 49", copy: "More depth, more pace, and stronger executive capacity." },
    { name: "Superpremium", price: "US$ 149", copy: "Higher strategic density, guided operation, and stronger perceived value." },
  ],
};

export default function OrkioVoiceHero({
  user,
  tenant,
  token,
  defaultLocale = "pt-BR",
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onFillPrompt,
}) {
  const [locale, setLocale] = useState(defaultLocale === "en-US" ? "en-US" : "pt-BR");
  const [playing, setPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const audioRef = useRef(null);

  const copy = useMemo(() => COPY[locale] || COPY["pt-BR"], [locale]);
  const plans = useMemo(() => PLAN_CARDS[locale] || PLAN_CARDS["pt-BR"], [locale]);

  const resolvedVoice = useMemo(() => {
    const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
    return coerceVoiceId(
      (env.VITE_ORKIO_VOICE_ID || import.meta.env.VITE_ORKIO_VOICE_ID || env.VITE_REALTIME_VOICE || import.meta.env.VITE_REALTIME_VOICE || ORKIO_DEFAULT_VOICE_ID).trim()
    );
  }, []);

  const resolvedTtsSpeed = useMemo(() => {
    const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
    return coerceTtsSpeed(env.VITE_ORKIO_TTS_SPEED || import.meta.env.VITE_ORKIO_TTS_SPEED || 0.92);
  }, []);

  async function speak() {
    if (playing) return;
    setPlaying(true);
    try {
      const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
      const base = (env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
      const apiUrl = base.endsWith("/api") ? base.slice(0, -4) : base;
      const res = await fetch(`${apiUrl}/api/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(tenant ? { "X-Org-Slug": tenant } : {}),
        },
        body: JSON.stringify({
          text: copy.speech,
          voice: resolvedVoice,
          speed: resolvedTtsSpeed,
        }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setPlaying(false);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setPlaying(false);
      };
      await audio.play();
    } catch (err) {
      console.warn("ORKIO_VOICE_HERO_TTS_FAILED", err?.message || err);
      setPlaying(false);
    }
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          borderRadius: 34,
          border: "1px solid rgba(148,163,184,0.16)",
          background:
            "linear-gradient(180deg, rgba(12,19,34,0.98) 0%, rgba(7,11,21,1) 100%)",
          boxShadow: "0 34px 90px rgba(2,6,23,0.42)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(124,58,237,0.24), transparent 34%), radial-gradient(circle at top right, rgba(37,99,235,0.18), transparent 26%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 20 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                borderRadius: 999,
                padding: "10px 14px",
                background: "rgba(124,58,237,0.14)",
                border: "1px solid rgba(124,58,237,0.22)",
                color: "#ddd6fe",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 6px rgba(34,197,94,0.16)" }} />
              {copy.kicker}
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setLocale("pt-BR")} style={langBtn(locale === "pt-BR")}>PT-BR</button>
              <button onClick={() => setLocale("en-US")} style={langBtn(locale === "en-US")}>EN-US</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(280px,360px)", gap: 18, alignItems: "stretch" }}>
            <div>
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={speak}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: playing ? "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(37,99,235,0.18))" : "rgba(15,23,42,0.58)",
                    boxShadow: playing ? "0 0 0 12px rgba(124,58,237,0.12)" : "0 18px 42px rgba(2,6,23,0.32)",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <OrkioSphereMark size={42} badge />
                </button>

                <div>
                  <div style={{ color: "rgba(148,163,184,0.86)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 900, marginBottom: 10 }}>
                    {playing ? copy.voicePlaying : copy.voiceReady}
                  </div>
                  <div style={{ color: "#f8fafc", fontSize: 46, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 900 }}>
                    {copy.title}
                  </div>
                </div>
              </div>

              <p style={{ marginTop: 18, marginBottom: 0, color: "#94a3b8", fontSize: 17, lineHeight: 1.78, maxWidth: 760 }}>
                {copy.subtitle}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
                <button onClick={speak} style={primaryGhostBtn()}>{copy.listen}</button>
                <button onClick={onPrimaryAction} style={primaryBtn()}>{copy.primary}</button>
                <button onClick={onSecondaryAction} style={secondaryBtn()}>{copy.secondary}</button>
                <button onClick={onTertiaryAction} style={secondaryBtn()}>{copy.tertiary}</button>
              </div>

              <div style={{ marginTop: 22, borderRadius: 26, padding: 18, background: "rgba(2,6,23,0.34)", border: "1px solid rgba(148,163,184,0.16)" }}>
                <div style={{ color: "#64748b", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 900, marginBottom: 10 }}>
                  {copy.quickStart}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {copy.lines.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onFillPrompt?.(prompt)}
                      style={{
                        border: "1px solid rgba(148,163,184,0.16)",
                        background: "rgba(15,23,42,0.56)",
                        color: "#94a3b8",
                        borderRadius: 999,
                        padding: "10px 14px",
                        fontSize: 13,
                        lineHeight: 1.35,
                        cursor: "pointer",
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <div style={sideCard()}>
                <div style={sideEyebrow()}>{copy.plansTitle}</div>
                <div style={sideText()}>{copy.plansSubtitle}</div>
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  {plans.map((plan) => (
                    <div key={plan.name} style={{ borderRadius: 18, padding: 14, border: "1px solid rgba(148,163,184,0.12)", background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{plan.name}</div>
                        <div style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 900 }}>{plan.price}</div>
                      </div>
                      <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.65, marginTop: 6 }}>{plan.copy}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setModalOpen(true)} style={{ ...primaryBtn(), width: "100%", marginTop: 14 }}>
                  {copy.pricing}
                </button>
              </div>

              <div style={sideCard()}>
                <div style={sideEyebrow()}>Command deck</div>
                <div style={sideText()}>
                  PatroAI presents Orkio as a governed intelligence product. The company remains institutional, the product remains commercial, and the app remains operational.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PricingCheckoutModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function langBtn(active) {
  return {
    border: "1px solid rgba(148,163,184,0.16)",
    background: active ? "rgba(124,58,237,0.16)" : "rgba(15,23,42,0.56)",
    color: active ? "#ddd6fe" : "#94a3b8",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function primaryBtn() {
  return {
    border: "none",
    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
    color: "white",
    borderRadius: 16,
    padding: "15px 18px",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 22px 44px rgba(76,29,149,0.34)",
  };
}

function primaryGhostBtn() {
  return {
    border: "1px solid rgba(124,58,237,0.22)",
    background: "rgba(124,58,237,0.12)",
    color: "#ddd6fe",
    borderRadius: 16,
    padding: "15px 18px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function secondaryBtn() {
  return {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.62)",
    color: "#f8fafc",
    borderRadius: 16,
    padding: "15px 18px",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function sideCard() {
  return {
    background: "linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(7,11,21,1) 100%)",
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: 28,
    padding: 20,
    boxShadow: "0 28px 70px rgba(2,6,23,0.34)",
  };
}

function sideEyebrow() {
  return {
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.88)",
    marginBottom: 9,
    fontWeight: 900,
  };
}

function sideText() {
  return {
    fontSize: 14,
    lineHeight: 1.72,
    color: "rgba(226,232,240,0.82)",
  };
}
