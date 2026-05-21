import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createOrkioSpeechMotion } from "../lib/orkioSpeechMotion.js";
import {
  cleanupAudioUrl,
  requestOrkioTtsBlob,
  speakWithOrkioBrowserVoice,
} from "../lib/orkioTts.js";
import OrkioVideoMedia from "./OrkioVideoMedia.jsx";

/**
 * AO-04D — Avatar com vídeo idle/speaking + fala natural
 *
 * Evolução do AO-04B:
 * - Usa OrkioVideoMedia para exibir vídeo idle/speaking
 * - Fallback automático para imagem estática se vídeo falhar
 * - Preserva TTS atual (orkioTts.js) sem alteração
 * - Mantém orkioSpeechMotion como complemento (CSS vars para glow/pulse)
 */

const AVATAR_SRC = "/patroai-assets/orkio-mystic-tech-v1.webp";
const AVATAR_VIDEO_LEAD_MS = 120;

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function waitForAudioReady(audio, timeoutMs = 900) {
  if (!audio || audio.readyState >= 2) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      audio.removeEventListener("loadeddata", finish);
      audio.removeEventListener("canplay", finish);
      audio.removeEventListener("error", finish);
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);

    audio.addEventListener("loadeddata", finish, { once: true });
    audio.addEventListener("canplay", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });

    try { audio.load?.(); } catch {}
  });
}

export default function AvatarHero3D({
  speech = "",
  onText,
  onDiagnosis,
  tenant = "public",
  token = "",
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [preparingSpeech, setPreparingSpeech] = useState(false);
  const [speechSyncKey, setSpeechSyncKey] = useState(0);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const motionRef = useRef(null);

  const effectiveSpeech = useMemo(() => {
    return typeof speech === "string" && speech.trim()
      ? speech.trim()
      : "Olá. Eu sou a Orkio. Posso ajudar você a transformar perguntas soltas em diagnóstico, clareza operacional e próximos passos.";
  }, [speech]);

  const safeCallback = useCallback((fn) => {
    if (typeof fn === "function") fn();
  }, []);

  const getMotionController = useCallback(() => {
    if (!motionRef.current) {
      motionRef.current = createOrkioSpeechMotion(heroRef, {
        intensity: 1,
        smoothing: 0.76,
      });
    }

    return motionRef.current;
  }, []);

  useEffect(() => {
    return () => {
      motionRef.current?.dispose?.();
      try {
        audioRef.current?.pause?.();
      } catch {}
    };
  }, []);

  function fallbackBrowserSpeech() {
    return speakWithOrkioBrowserVoice(effectiveSpeech, {
      locale: "pt-BR",
      onStart: () => {
        setSpeaking(true);
        getMotionController().startSynthetic({ strength: 0.66 });
      },
      onEnd: () => {
        getMotionController().stop();
        setPreparingSpeech(false);
        setSpeaking(false);
      },
      onError: () => {
        getMotionController().stop();
        setPreparingSpeech(false);
        setSpeaking(false);
      },
    });
  }

  const handleSpeak = useCallback(async () => {
    if (speaking || preparingSpeech) return;
    setPreparingSpeech(true);

    try {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
        cleanupAudioUrl(audioRef.current);
        getMotionController().stop();
        audioRef.current = null;
      }

      const blob = await requestOrkioTtsBlob({
        text: effectiveSpeech,
        token,
        tenant,
        locale: "pt-BR",
      });

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.dataset.blobUrl = url;
      audio.preload = "auto";
      audioRef.current = audio;

      audio.onended = () => {
        cleanupAudioUrl(audio);
        getMotionController().stop();
        setPreparingSpeech(false);
        setSpeaking(false);
      };
      audio.onerror = () => {
        cleanupAudioUrl(audio);
        getMotionController().stop();
        setPreparingSpeech(false);
        setSpeaking(false);
      };

      await waitForAudioReady(audio);
      await getMotionController().startAudioElement(audio, { strength: 1 });

      // Sincronização visual: reinicia o loop speaking e dá um pequeno lead ao vídeo
      // antes de soltar o áudio, reduzindo atraso perceptivo boca/voz.
      setSpeechSyncKey((current) => current + 1);
      setSpeaking(true);
      await sleep(AVATAR_VIDEO_LEAD_MS);

      await audio.play();
      setPreparingSpeech(false);
    } catch (err) {
      console.warn("ORKIO_AVATAR_TTS_FAILED", err?.message || err);
      const browserFallbackOk = fallbackBrowserSpeech();
      if (!browserFallbackOk) {
        getMotionController().stop();
        setPreparingSpeech(false);
        setSpeaking(false);
        safeCallback(onText);
      }
    }
  }, [effectiveSpeech, getMotionController, onText, preparingSpeech, safeCallback, speaking, tenant, token]);

  return (
    <section ref={heroRef} className={`orkio-avatar-hero ${speaking ? "is-speaking" : ""}`} aria-label="Assistente Orkio">
      <style>{`
        .orkio-avatar-hero {
          position: relative;
          min-height: 520px;
          border: 1px solid rgba(247,200,98,0.28);
          border-radius: 34px;
          overflow: hidden;
          background:
            radial-gradient(620px 380px at 16% 50%, rgba(247,200,98,0.14), transparent 60%),
            radial-gradient(520px 340px at 96% 10%, rgba(247,200,98,0.08), transparent 54%),
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.028)),
            rgba(2,6,11,0.82);
          box-shadow: 0 32px 90px rgba(0,0,0,0.42);
          isolation: isolate;
          --orkio-voice-level: 0;
          --orkio-mouth-open: 0;
          --orkio-jaw-drop: 0;
          --orkio-mouth-round: 0;
          --orkio-mouth-wide: 0;
          --orkio-head-tilt: 0;
          --orkio-breath: 0;
          --orkio-voice-glow: 0;
        }

        .orkio-avatar-hero,
        .orkio-avatar-hero * {
          box-sizing: border-box;
        }

        .orkio-avatar-hero::after {
          content: "";
          position: absolute;
          inset: auto 0 0 0;
          height: 34%;
          pointer-events: none;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.24));
          z-index: 0;
        }

        .orkio-avatar-hero__grid {
          position: relative;
          z-index: 1;
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
          align-items: center;
          justify-content: center;
          padding: 24px 26px 24px 14px;
          overflow: hidden;
        }

        .orkio-avatar-hero__visual::before {
          content: "";
          position: absolute;
          inset: 28px 28px 28px 12px;
          border-radius: 30px;
          background:
            radial-gradient(320px 220px at 50% 12%, rgba(247,200,98,0.10), transparent 58%),
            linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid rgba(247,200,98,0.12);
          opacity: 0.6;
          pointer-events: none;
        }

        .orkio-avatar-hero__portraitShell {
          position: relative;
          z-index: 2;
          width: min(360px, 90%);
          aspect-ratio: 0.75;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(247,200,98,0.26);
          background:
            radial-gradient(circle at 50% 10%, rgba(247,200,98,0.13), transparent 32%),
            linear-gradient(180deg, rgba(7,12,22,0.98), rgba(4,8,15,0.96));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.04),
            0 20px 60px rgba(0,0,0,0.42),
            0 0 42px rgba(247,200,98,0.08);
          transform-origin: 50% 58%;
          transition: transform 120ms linear, box-shadow 180ms ease;
          will-change: transform;
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__portraitShell {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.04),
            0 20px 60px rgba(0,0,0,0.42),
            0 0 58px rgba(247,200,98,0.22);
        }

        .orkio-avatar-hero__voiceAura {
          position: absolute;
          inset: -12%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(247,200,98,0.12), transparent 58%);
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__voiceAura {
          opacity: 1;
          animation: orkioAuraBreath 2s ease-in-out infinite;
        }

        @keyframes orkioAvatarPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(247,200,98,0); }
          50% { box-shadow: 0 0 0 8px rgba(247,200,98,0.14); }
        }

        @keyframes orkioAuraBreath {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.06); opacity: 1; }
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
            min-height: 380px;
            padding: 12px 18px 24px;
          }

          .orkio-avatar-hero__visual::before {
            inset: 12px 18px 18px;
          }

          .orkio-avatar-hero__portraitShell {
            width: min(360px, 92%);
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
            min-height: 320px;
          }

          .orkio-avatar-hero__portraitShell {
            width: min(300px, 92%);
            border-radius: 24px;
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
              <span>{preparingSpeech ? "Preparando voz..." : speaking ? "A Orkio falando..." : "Falar com a Orkio"}</span>
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
            <span>{preparingSpeech ? "Sincronizando voz e avatar." : speaking ? "Respondendo por voz." : "Respondo por voz e por texto."}</span>
          </div>
        </div>

        <div className="orkio-avatar-hero__visual" aria-hidden="true">
          <div className="orkio-avatar-hero__portraitShell">
            {videoAvailable ? (
              <OrkioVideoMedia
                speaking={speaking}
                speakingSyncKey={speechSyncKey}
                speakingStartOffset={0.18}
                borderRadius="28px"
                onError={() => setVideoAvailable(false)}
              />
            ) : !avatarFailed ? (
              <img
                className="orkio-avatar-hero__avatar"
                src={AVATAR_SRC}
                alt=""
                loading="eager"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "28px",
                }}
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="orkio-avatar-hero__fallback" style={{
                width: "100%",
                height: "100%",
                borderRadius: "28px",
                background: "radial-gradient(circle at 42% 24%, rgba(245,196,81,0.34), transparent 30%), radial-gradient(circle at 50% 60%, rgba(129,140,248,0.18), transparent 44%), linear-gradient(180deg, rgba(11,18,32,0.96), rgba(3,7,18,1))",
                display: "grid",
                placeItems: "center",
                color: "#f8dfa3",
                fontSize: "42px",
                fontWeight: 950,
              }}>O</div>
            )}

            <div className="orkio-avatar-hero__voiceAura" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
