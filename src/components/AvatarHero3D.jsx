import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createOrkioSpeechMotion } from "../lib/orkioSpeechMotion.js";
import {
  cleanupAudioUrl,
  requestOrkioTtsBlob,
  speakWithOrkioBrowserVoice,
} from "../lib/orkioTts.js";

/**
 * AO-04B — Avatar com fala natural e movimento audio-reativo
 *
 * Objetivo deste patch:
 * - remover o fundo/moldura oval estranha atrás da Orkio;
 * - deixar o retrato em card limpo, no mesmo idioma visual das demais imagens;
 * - preservar a fala por TTS público e o fallback do navegador;
 * - reforçar o estado visual de "falando" com glow e equalizer discreto.
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
        setSpeaking(false);
      },
      onError: () => {
        getMotionController().stop();
        setSpeaking(false);
      },
    });
  }

  const handleSpeak = useCallback(async () => {
    if (speaking) return;
    setSpeaking(true);

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
      audioRef.current = audio;

      audio.onended = () => {
        cleanupAudioUrl(audio);
        getMotionController().stop();
        setSpeaking(false);
      };
      audio.onerror = () => {
        cleanupAudioUrl(audio);
        getMotionController().stop();
        setSpeaking(false);
      };

      await getMotionController().startAudioElement(audio, { strength: 1 });
      await audio.play();
    } catch (err) {
      console.warn("ORKIO_AVATAR_TTS_FAILED", err?.message || err);
      const browserFallbackOk = fallbackBrowserSpeech();
      if (!browserFallbackOk) {
        getMotionController().stop();
        setSpeaking(false);
        safeCallback(onText);
      }
    }
  }, [effectiveSpeech, getMotionController, onText, safeCallback, speaking, tenant, token]);

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
          aspect-ratio: 0.8;
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
          transform:
            translate3d(0, calc(-7px * var(--orkio-voice-level)), 0)
            rotate(calc(var(--orkio-head-tilt) * 1deg))
            scale(calc(1 + (var(--orkio-voice-level) * 0.018)));
          transform-origin: 50% 58%;
          transition: transform 120ms linear, box-shadow 180ms ease;
          will-change: transform;
        }

        .orkio-avatar-hero__portraitShell::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.035), transparent 26%, transparent 74%, rgba(247,200,98,0.06));
          z-index: 2;
        }

        .orkio-avatar-hero__avatar {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
          filter: saturate(calc(1.02 + (var(--orkio-voice-level) * 0.05))) contrast(calc(1.02 + (var(--orkio-voice-level) * 0.04)));
          transform: scale(calc(1.006 + (var(--orkio-breath) * 0.008)));
          transform-origin: 50% 52%;
          transition: filter 140ms ease;
          will-change: transform, filter;
        }

        .orkio-avatar-hero__fallback {
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 50% 18%, rgba(247,200,98,0.24), transparent 30%),
            radial-gradient(circle at 50% 48%, rgba(67,213,255,0.10), transparent 44%),
            linear-gradient(140deg, rgba(247,200,98,0.18), rgba(255,255,255,0.04) 42%, rgba(247,200,98,0.08)),
            rgba(4,8,15,0.72);
        }


        .orkio-avatar-hero__mouthRig {
          position: absolute;
          left: 50%;
          top: 43.2%;
          z-index: 5;
          width: 62px;
          height: 24px;
          pointer-events: none;
          transform:
            translate(-50%, -50%)
            rotate(calc(var(--orkio-head-tilt) * 0.16deg))
            scaleX(calc(0.86 + (var(--orkio-mouth-wide) * 0.18)));
          opacity: calc(0.18 + (var(--orkio-voice-level) * 0.34));
          mix-blend-mode: screen;
          transition: opacity 90ms linear, transform 70ms linear;
        }

        .orkio-avatar-hero__mouthShadow,
        .orkio-avatar-hero__mouthLine,
        .orkio-avatar-hero__mouthGlow {
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          border-radius: 999px;
          transform-origin: center center;
        }

        .orkio-avatar-hero__mouthShadow {
          width: 38px;
          height: 10px;
          background: radial-gradient(ellipse at center, rgba(2,6,14,0.66), rgba(2,6,14,0.28) 52%, transparent 76%);
          transform:
            translate(-50%, -50%)
            scaleX(calc(0.58 + (var(--orkio-mouth-wide) * 0.46)))
            scaleY(calc(0.12 + (var(--orkio-jaw-drop) * 0.82)));
          opacity: calc(0.08 + (var(--orkio-mouth-open) * 0.42));
          filter: blur(0.45px);
        }

        .orkio-avatar-hero__mouthLine {
          width: 42px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,226,157,0.52), rgba(247,200,98,0.72), rgba(255,226,157,0.52), transparent);
          transform:
            translate(-50%, calc(-50% + (var(--orkio-jaw-drop) * 2.2px)))
            scaleX(calc(0.62 + (var(--orkio-mouth-wide) * 0.44)))
            scaleY(calc(0.70 + (var(--orkio-mouth-round) * 0.50)));
          opacity: calc(0.16 + (var(--orkio-mouth-open) * 0.46));
          box-shadow: 0 0 calc(6px + (var(--orkio-voice-glow) * 14px)) rgba(247,200,98,0.22);
        }

        .orkio-avatar-hero__mouthGlow {
          width: 52px;
          height: 16px;
          background: radial-gradient(ellipse at center, rgba(247,200,98,0.30), rgba(96,165,250,0.08) 48%, transparent 72%);
          transform:
            translate(-50%, -50%)
            scaleX(calc(0.72 + (var(--orkio-mouth-wide) * 0.32)))
            scaleY(calc(0.26 + (var(--orkio-mouth-open) * 0.98)));
          opacity: calc(0.05 + (var(--orkio-mouth-open) * 0.24));
          filter: blur(3.4px);
        }

        .orkio-avatar-hero__voiceAura {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 35%, rgba(247,200,98,0.12), transparent 42%),
            radial-gradient(circle at 48% 28%, rgba(99,102,241,0.08), transparent 38%);
          opacity: calc(0.22 + (var(--orkio-voice-glow) * 0.52));
          transition: opacity 140ms linear;
        }

        .orkio-avatar-hero__equalizer {
          position: absolute;
          left: 18px;
          bottom: 18px;
          z-index: 3;
          display: inline-flex;
          align-items: flex-end;
          gap: 5px;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(247,200,98,0.22);
          background: rgba(3,7,14,0.72);
          box-shadow: 0 10px 24px rgba(0,0,0,0.32);
          opacity: 0.9;
        }

        .orkio-avatar-hero__equalizer span {
          width: 4px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(180deg, #ffe5a0, #f7c862 58%, #7b520f);
          transform-origin: center bottom;
          opacity: calc(0.45 + (var(--orkio-voice-level) * 0.55));
          transform: scaleY(calc(0.42 + (var(--orkio-mouth-open) * 1.15)));
          transition: transform 80ms linear, opacity 120ms linear;
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__portraitShell {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 24px 70px rgba(0,0,0,0.46),
            0 0 calc(42px + (var(--orkio-voice-glow) * 36px)) rgba(247,200,98,0.18);
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__equalizer span {
          opacity: 1;
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__equalizer span:nth-child(2) {
          transform: scaleY(calc(0.36 + (var(--orkio-mouth-open) * 1.32)));
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__equalizer span:nth-child(3) {
          transform: scaleY(calc(0.28 + (var(--orkio-mouth-open) * 1.48)));
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__equalizer span:nth-child(4) {
          transform: scaleY(calc(0.40 + (var(--orkio-mouth-open) * 1.18)));
        }

        @keyframes orkioAvatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(247,200,98,0.26); transform: scale(1); }
          50% { box-shadow: 0 0 0 9px rgba(247,200,98,0.04); transform: scale(1.06); }
        }

        @keyframes orkioEqualizer {
          0%, 100% { transform: scaleY(0.45); }
          40% { transform: scaleY(1.2); }
          70% { transform: scaleY(0.7); }
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
          <div className="orkio-avatar-hero__portraitShell">
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

            <div className="orkio-avatar-hero__voiceAura" aria-hidden="true" />
            <div className="orkio-avatar-hero__mouthRig" aria-hidden="true">
              <span className="orkio-avatar-hero__mouthShadow" />
              <span className="orkio-avatar-hero__mouthLine" />
              <span className="orkio-avatar-hero__mouthGlow" />
            </div>

            <div className="orkio-avatar-hero__equalizer" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
