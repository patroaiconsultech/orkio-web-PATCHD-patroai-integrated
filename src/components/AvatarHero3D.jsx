import React, { useCallback, useMemo, useRef, useState } from "react";

/**
 * AO-02 — AvatarHero3D vivo e seguro
 *
 * Componente puro:
 * - não importa a landing;
 * - não importa a si mesmo;
 * - usa TTS público quando disponível;
 * - faz fallback seguro para speechSynthesis;
 * - anima o avatar durante a fala.
 */

const AVATAR_SRC = "/patroai-assets/orkio-mystic-tech-v1.webp";

export default function AvatarHero3D({
  speech = "",
  onText,
  onDiagnosis,
  tenant = "public",
  token = "",
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const effectiveSpeech = useMemo(() => {
    return typeof speech === "string" && speech.trim()
      ? speech.trim()
      : "Olá. Eu sou a Orkio. Posso ajudar você a transformar perguntas soltas em diagnóstico, clareza operacional e próximos passos.";
  }, [speech]);

  const safeCallback = useCallback((fn) => {
    if (typeof fn === "function") fn();
  }, []);

  function getApiRoot() {
    const env = typeof window !== "undefined" && window.__ORKIO_ENV__ ? window.__ORKIO_ENV__ : {};
    const base = String(env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
    return base.endsWith("/api") ? base.slice(0, -4) : base;
  }

  function cleanupAudioUrl(audio) {
    try {
      if (audio?.dataset?.blobUrl) URL.revokeObjectURL(audio.dataset.blobUrl);
    } catch {}
  }

  function pickBrowserVoice() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

    const voices = window.speechSynthesis.getVoices?.() || [];
    const preferredNames = ["francisca", "maria", "luciana", "helena", "google português", "brasil", "female"];

    return (
      voices.find((voice) => preferredNames.some((name) => voice.name.toLowerCase().includes(name))) ||
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("pt")) ||
      null
    );
  }

  function fallbackBrowserSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(effectiveSpeech);
      const voice = pickBrowserVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = "pt-BR";
      utterance.rate = 0.92;
      utterance.pitch = 1.12;
      utterance.volume = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  async function requestTts(endpoint) {
    const res = await fetch(`${getApiRoot()}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(tenant ? { "X-Org-Slug": tenant } : {}),
      },
      body: JSON.stringify({
        text: effectiveSpeech,
        voice: "shimmer",
        speed: 0.9,
        locale: "pt-BR",
      }),
    });

    if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
    return res.blob();
  }

  const handleSpeak = useCallback(async () => {
    if (speaking) return;
    setSpeaking(true);

    try {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
        cleanupAudioUrl(audioRef.current);
        audioRef.current = null;
      }

      let blob;
      try {
        blob = await requestTts(token ? "/api/tts" : "/api/public/tts");
      } catch (primaryErr) {
        if (token) throw primaryErr;
        blob = await requestTts("/api/tts/public");
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.dataset.blobUrl = url;
      audioRef.current = audio;

      audio.onended = () => {
        cleanupAudioUrl(audio);
        setSpeaking(false);
      };
      audio.onerror = () => {
        cleanupAudioUrl(audio);
        setSpeaking(false);
      };

      await audio.play();
    } catch (err) {
      console.warn("ORKIO_AVATAR_TTS_FAILED", err?.message || err);
      const browserFallbackOk = fallbackBrowserSpeech();
      if (!browserFallbackOk) {
        setSpeaking(false);
        safeCallback(onText);
      }
    }
  }, [effectiveSpeech, onText, safeCallback, speaking, tenant, token]);

  return (
    <section className={`orkio-avatar-hero ${speaking ? "is-speaking" : ""}`} aria-label="Assistente Orkio">
      <style>{`
        .orkio-avatar-hero {
          position: relative;
          min-height: 520px;
          border: 1px solid rgba(247,200,98,0.28);
          border-radius: 34px;
          overflow: hidden;
          background:
            radial-gradient(520px 360px at 55% 28%, rgba(247,200,98,0.19), transparent 62%),
            radial-gradient(420px 320px at 92% 35%, rgba(247,200,98,0.15), transparent 64%),
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.032)),
            rgba(2,6,11,0.76);
          box-shadow: 0 32px 90px rgba(0,0,0,0.42);
          isolation: isolate;
        }

        .orkio-avatar-hero,
        .orkio-avatar-hero * {
          box-sizing: border-box;
        }

        .orkio-avatar-hero::before,
        .orkio-avatar-hero::after {
          content: "";
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }

        .orkio-avatar-hero::before {
          width: 520px;
          height: 520px;
          right: -190px;
          top: -140px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(247,200,98,0.16), transparent 66%);
          filter: blur(2px);
        }

        .orkio-avatar-hero::after {
          left: 0;
          right: 0;
          bottom: 0;
          height: 46%;
          background:
            radial-gradient(ellipse at 56% 100%, rgba(247,200,98,0.20), transparent 56%),
            linear-gradient(180deg, transparent, rgba(0,0,0,0.28));
        }

        .orkio-avatar-hero__grid {
          position: relative;
          z-index: 2;
          min-height: 520px;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          align-items: stretch;
        }

        .orkio-avatar-hero__copy {
          padding: 34px 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          min-width: 0;
        }

        .orkio-avatar-hero__eyebrow {
          color: #f7c862;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .orkio-avatar-hero__copy h2 {
          margin: 0;
          color: #f8fafc;
          font-size: clamp(34px, 4.2vw, 58px);
          line-height: 0.98;
          letter-spacing: -0.06em;
          overflow-wrap: anywhere;
        }

        .orkio-avatar-hero__copy h2 span {
          display: block;
          background: linear-gradient(135deg, #fff3ca, #f7c862 48%, #a76f19);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 38px rgba(247,200,98,0.18);
        }

        .orkio-avatar-hero__copy p {
          margin: 0;
          max-width: 390px;
          color: rgba(248,250,252,0.74);
          font-size: 15px;
          line-height: 1.68;
        }

        .orkio-avatar-hero__actions {
          display: grid;
          gap: 10px;
          max-width: 330px;
          margin-top: 4px;
        }

        .orkio-avatar-hero__action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          min-height: 48px;
          padding: 12px 15px;
          border-radius: 15px;
          border: 1px solid rgba(247,200,98,0.30);
          background: rgba(0,0,0,0.30);
          color: rgba(248,250,252,0.88);
          font-weight: 850;
          cursor: pointer;
          transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
        }

        .orkio-avatar-hero__action:hover {
          transform: translateY(-1px);
          border-color: rgba(247,200,98,0.58);
          background: rgba(247,200,98,0.10);
        }

        .orkio-avatar-hero__action b {
          color: #f7c862;
          font-size: 18px;
        }

        .orkio-avatar-hero__status {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          color: rgba(255,226,157,0.78);
          font-size: 12px;
          font-weight: 780;
        }

        .orkio-avatar-hero__pulse {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 1px solid rgba(247,200,98,0.48);
          background: radial-gradient(circle, #f7c862 0 20%, transparent 25%);
          box-shadow: 0 0 0 rgba(247,200,98,0);
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__pulse {
          animation: orkioAvatarPulse 1.1s ease-in-out infinite;
        }

        .orkio-avatar-hero__visual {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 62px 20px 0;
          overflow: hidden;
        }

        .orkio-avatar-hero__visual::before {
          content: "";
          position: absolute;
          inset: 18% 8% -18% 4%;
          border-radius: 42% 42% 0 0;
          background:
            radial-gradient(circle at 50% 28%, rgba(247,200,98,0.18), transparent 34%),
            radial-gradient(circle at 58% 66%, rgba(67,213,255,0.08), transparent 46%),
            linear-gradient(180deg, rgba(247,200,98,0.08), rgba(255,255,255,0.018));
          border: 1px solid rgba(247,200,98,0.16);
          box-shadow: inset 0 0 80px rgba(247,200,98,0.07), 0 30px 80px rgba(0,0,0,0.30);
          opacity: 0.9;
          z-index: 1;
          pointer-events: none;
        }

        .orkio-avatar-hero__avatar {
          position: relative;
          z-index: 3;
          width: min(390px, 88%);
          max-height: 440px;
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(0 34px 46px rgba(0,0,0,0.62));
          transform: translateX(8px) translateY(28px);
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__avatar {
          animation: orkioAvatarFloat 2.2s ease-in-out infinite;
        }

        .orkio-avatar-hero__voiceWaves {
          position: absolute;
          right: 18%;
          top: 22%;
          width: 118px;
          height: 118px;
          border-radius: 999px;
          pointer-events: none;
          z-index: 4;
          opacity: 0;
          transform: scale(0.84);
        }

        .orkio-avatar-hero__voiceWaves span {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          border: 1px solid rgba(247,200,98,0.28);
          box-shadow: 0 0 34px rgba(247,200,98,0.16);
        }

        .orkio-avatar-hero__voiceWaves span:nth-child(2) {
          inset: 18px;
          border-color: rgba(67,213,255,0.20);
        }

        .orkio-avatar-hero__voiceWaves span:nth-child(3) {
          inset: 36px;
          border-color: rgba(255,255,255,0.12);
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__voiceWaves {
          opacity: 1;
          animation: orkioAvatarVoiceRing 1.4s ease-in-out infinite;
        }

        .orkio-avatar-hero__fallback {
          position: relative;
          z-index: 3;
          width: min(360px, 78%);
          aspect-ratio: 0.68;
          margin-bottom: 10px;
          border-radius: 48% 48% 30% 30%;
          background:
            radial-gradient(circle at 50% 18%, rgba(247,200,98,0.24), transparent 30%),
            radial-gradient(circle at 50% 48%, rgba(67,213,255,0.10), transparent 44%),
            linear-gradient(140deg, rgba(247,200,98,0.18), rgba(255,255,255,0.04) 42%, rgba(247,200,98,0.08)),
            rgba(4,8,15,0.72);
          border: 1px solid rgba(247,200,98,0.30);
          box-shadow: inset 0 0 60px rgba(247,200,98,0.09), 0 30px 60px rgba(0,0,0,0.46);
        }

        @keyframes orkioAvatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(247,200,98,0.26); transform: scale(1); }
          50% { box-shadow: 0 0 0 9px rgba(247,200,98,0.04); transform: scale(1.06); }
        }

        @keyframes orkioAvatarFloat {
          0%, 100% { transform: translateX(8px) translateY(28px); }
          50% { transform: translateX(8px) translateY(20px); }
        }

        @keyframes orkioAvatarVoiceRing {
          0% { opacity: 0.24; transform: scale(0.84); }
          55% { opacity: 0.72; transform: scale(1.04); }
          100% { opacity: 0; transform: scale(1.22); }
        }

        @media (max-width: 960px) {
          .orkio-avatar-hero,
          .orkio-avatar-hero__grid,
          .orkio-avatar-hero__visual {
            min-height: auto;
          }

          .orkio-avatar-hero__grid {
            grid-template-columns: 1fr;
          }

          .orkio-avatar-hero__copy {
            padding: 28px 22px 8px;
          }

          .orkio-avatar-hero__visual {
            min-height: 360px;
          }

          .orkio-avatar-hero__visual {
            padding-top: 24px;
          }

          .orkio-avatar-hero__avatar {
            width: min(340px, 82%);
            transform: translateX(0) translateY(18px);
          }
        }

        @media (max-width: 560px) {
          .orkio-avatar-hero {
            border-radius: 26px;
          }

          .orkio-avatar-hero__copy h2 {
            font-size: 38px;
          }

          .orkio-avatar-hero__visual {
            min-height: 310px;
          }

          .orkio-avatar-hero__voiceWaves {
            right: 10%;
            top: 26%;
            width: 84px;
            height: 84px;
          }
        }
      `}</style>

      <div className="orkio-avatar-hero__grid">
        <div className="orkio-avatar-hero__copy">
          <span className="orkio-avatar-hero__eyebrow">Conheça a Orkio</span>
          <h2>
            Olá, eu sou a
            <span>Orkio.</span>
          </h2>
          <p>
            Posso te ajudar a transformar perguntas soltas em diagnóstico, clareza operacional
            e próximos passos para evolução da sua empresa.
          </p>

          <div className="orkio-avatar-hero__actions">
            <button type="button" className="orkio-avatar-hero__action" onClick={handleSpeak}>
              <span>{speaking ? "A Orkio falando..." : "Falar com a Orkio"}</span>
              <b>≋</b>
            </button>
            <button type="button" className="orkio-avatar-hero__action" onClick={() => safeCallback(onText)}>
              <span>Digitar pergunta</span>
              <b>□</b>
            </button>
            <button type="button" className="orkio-avatar-hero__action" onClick={() => safeCallback(onDiagnosis)}>
              <span>Iniciar diagnóstico empresarial</span>
              <b>✦</b>
            </button>
          </div>

          <div className="orkio-avatar-hero__status" aria-live="polite">
            <span className="orkio-avatar-hero__pulse" aria-hidden="true" />
            <span>{speaking ? "Respondendo por voz." : "Respondo por voz e por texto."}</span>
          </div>
        </div>

        <div className="orkio-avatar-hero__visual" aria-hidden="true">
          {!avatarFailed ? (
            <img
              className="orkio-avatar-hero__avatar"
              src={AVATAR_SRC}
              alt=""
              loading="eager"
              decoding="async"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="orkio-avatar-hero__fallback" />
          )}

          <div className="orkio-avatar-hero__voiceWaves">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
