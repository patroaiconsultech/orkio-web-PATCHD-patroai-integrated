import React, { useMemo, useRef, useState } from "react";
import OrkioSphereMark from "../ui/OrkioSphereMark.jsx";
import { ORKIO_DEFAULT_VOICE_ID, coerceTtsSpeed, coerceVoiceId } from "../lib/voices.js";

export default function OrkioVoiceHero({
  tenant,
  token,
  defaultLocale = "pt-BR",
  kicker = "PatroAI apresenta Orkio",
  title = "Da concepção à execução cirúrgica.",
  subtitle = "O Orkio é a Business Execution Engine da PatroAI: organiza tese, estrutura business plans sofisticados, coordena agentes e acompanha a execução com governança.",
  speech = "Olá. Eu sou o Orkio. Através de mim, a PatroAI pode conceber novos negócios, estruturar business plans sofisticados e conduzir a execução com clareza, inteligência e governança.",
  primaryLabel = "Conhecer o Orkio",
  secondaryLabel = "Entrar agora",
  tertiaryLabel = "Falar com a PatroAI",
  badgeLabel = "Voz ativa",
  quickTitle = "Começos rápidos",
  quickPrompts = [],
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onFillPrompt,
}) {
  const [locale, setLocale] = useState(defaultLocale === "en-US" ? "en-US" : "pt-BR");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const isPt = locale === "pt-BR";
  const effectiveQuickPrompts = quickPrompts?.length
    ? quickPrompts
    : isPt
      ? [
          "Estruture um novo negócio do zero.",
          "Monte um business plan sofisticado.",
          "Transforme a estratégia em execução cirúrgica.",
        ]
      : [
          "Structure a new business from zero.",
          "Build a sophisticated business plan.",
          "Turn strategy into disciplined execution.",
        ];

  const resolvedVoice = useMemo(() => {
    const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
    return coerceVoiceId(
      (
        env.VITE_ORKIO_VOICE_ID ||
        import.meta.env.VITE_ORKIO_VOICE_ID ||
        env.VITE_REALTIME_VOICE ||
        import.meta.env.VITE_REALTIME_VOICE ||
        ORKIO_DEFAULT_VOICE_ID
      ).trim()
    );
  }, []);

  const resolvedTtsSpeed = useMemo(() => {
    const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
    return coerceTtsSpeed(env.VITE_ORKIO_TTS_SPEED || import.meta.env.VITE_ORKIO_TTS_SPEED || 0.9);
  }, []);

  function cleanupAudioUrl(audio) {
    try {
      if (audio?.dataset?.blobUrl) URL.revokeObjectURL(audio.dataset.blobUrl);
    } catch {}
  }

  function fallbackBrowserSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(speech);
      utter.lang = isPt ? "pt-BR" : "en-US";
      utter.rate = resolvedTtsSpeed;
      utter.pitch = 1.08;
      utter.onend = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utter);
      return true;
    } catch {
      return false;
    }
  }

  async function speak() {
    if (playing) return;
    setPlaying(true);

    try {
      const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
      const base = (env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
      const apiUrl = base.endsWith("/api") ? base.slice(0, -4) : base;
      const endpoint = token ? "/api/tts" : "/api/tts/public";
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(tenant ? { "X-Org-Slug": tenant } : {}),
        },
        body: JSON.stringify({
          text: speech,
          voice: resolvedVoice,
          speed: resolvedTtsSpeed,
        }),
      });

      if (!res.ok) throw new Error(`TTS ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
        cleanupAudioUrl(audioRef.current);
      }

      const audio = new Audio(url);
      audio.dataset.blobUrl = url;
      audioRef.current = audio;
      audio.onended = () => {
        cleanupAudioUrl(audio);
        setPlaying(false);
      };
      audio.onerror = () => {
        cleanupAudioUrl(audio);
        setPlaying(false);
      };
      await audio.play();
    } catch (err) {
      console.warn("ORKIO_VOICE_HERO_TTS_FAILED", err?.message || err);
      const browserFallbackOk = fallbackBrowserSpeech();
      if (!browserFallbackOk) setPlaying(false);
    }
  }

  return (
    <section
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
            "radial-gradient(circle at top left, rgba(124,58,237,0.24), transparent 34%), radial-gradient(circle at top right, rgba(37,99,235,0.18), transparent 26%), radial-gradient(circle at bottom center, rgba(245,158,11,0.18), transparent 32%)",
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
            {kicker}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setLocale("pt-BR")} style={langBtn(locale === "pt-BR")}>PT-BR</button>
            <button onClick={() => setLocale("en-US")} style={langBtn(locale === "en-US")}>EN-US</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(280px,360px)", gap: 18, alignItems: "stretch" }}>
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
                aria-label={isPt ? "Ouvir o Orkio" : "Listen to Orkio"}
              >
                <OrkioSphereMark size={42} badge />
              </button>

              <div>
                <div style={{ color: "rgba(148,163,184,0.86)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 900, marginBottom: 10 }}>
                  {playing ? (isPt ? "Orkio falando" : "Orkio speaking") : badgeLabel}
                </div>
                <div style={{ color: "#f8fafc", fontSize: 46, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 900 }}>
                  {title}
                </div>
              </div>
            </div>

            <p style={{ marginTop: 18, marginBottom: 0, color: "#94a3b8", fontSize: 17, lineHeight: 1.78, maxWidth: 780 }}>
              {subtitle}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
              <button onClick={speak} style={primaryGhostBtn()}>{isPt ? "Ouvir Orkio" : "Listen to Orkio"}</button>
              <button onClick={onPrimaryAction} style={primaryBtn()}>{primaryLabel}</button>
              <button onClick={onSecondaryAction} style={secondaryBtn()}>{secondaryLabel}</button>
              <button onClick={onTertiaryAction} style={secondaryBtn()}>{tertiaryLabel}</button>
            </div>

            <div style={{ marginTop: 22, borderRadius: 26, padding: 18, background: "rgba(2,6,23,0.34)", border: "1px solid rgba(148,163,184,0.16)" }}>
              <div style={{ color: "#64748b", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 900, marginBottom: 10 }}>
                {quickTitle}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {effectiveQuickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onFillPrompt?.(prompt)}
                    style={{
                      border: "1px solid rgba(148,163,184,0.16)",
                      background: "rgba(15,23,42,0.56)",
                      color: "#cbd5e1",
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

          <div
            style={{
              borderRadius: 30,
              border: "1px solid rgba(148,163,184,0.16)",
              background:
                "linear-gradient(180deg, rgba(15,23,42,0.88) 0%, rgba(10,14,24,0.98) 100%)",
              padding: 22,
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "#f8fafc", fontSize: 22, fontWeight: 900, lineHeight: 1.15 }}>
                {isPt ? "Narrativa para clientes e investidores" : "Narrative for clients and investors"}
              </div>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: 15, marginTop: 14 }}>
                {isPt
                  ? "A PatroAI usa o Orkio para transformar visão em direção concreta: diagnóstico, tese, business plan, arquitetura, agentes e execução acompanhada."
                  : "PatroAI uses Orkio to turn vision into concrete direction: diagnosis, thesis, business plan, architecture, agents, and guided execution."}
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {[
                isPt ? "Concepção estratégica" : "Strategic conception",
                isPt ? "Business plans sofisticados" : "Sophisticated business plans",
                isPt ? "Execução cirúrgica com IA" : "Surgical AI execution",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 18,
                    padding: "14px 16px",
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.02)",
                    color: "#e2e8f0",
                    fontWeight: 700,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function langBtn(active) {
  return {
    border: "1px solid rgba(148,163,184,0.16)",
    background: active ? "rgba(245,158,11,0.16)" : "rgba(15,23,42,0.46)",
    color: active ? "#fde68a" : "#cbd5e1",
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
    borderRadius: 999,
    padding: "13px 18px",
    background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
    color: "#111827",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 14px 34px rgba(245,158,11,0.24)",
  };
}

function primaryGhostBtn() {
  return {
    border: "1px solid rgba(124,58,237,0.26)",
    borderRadius: 999,
    padding: "13px 18px",
    background: "rgba(124,58,237,0.12)",
    color: "#ddd6fe",
    fontWeight: 800,
    cursor: "pointer",
  };
}

function secondaryBtn() {
  return {
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: 999,
    padding: "13px 18px",
    background: "rgba(15,23,42,0.54)",
    color: "#e2e8f0",
    fontWeight: 800,
    cursor: "pointer",
  };
}
