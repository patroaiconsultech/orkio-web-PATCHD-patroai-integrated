import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OrkioMysticAvatar from "./OrkioMysticAvatar.jsx";
import { createOrkioSpeechMotion } from "../lib/orkioSpeechMotion.js";
import {
  cleanupAudioUrl,
  getOrkioTtsSpeed,
  getOrkioVoiceId,
  requestOrkioTtsBlob,
  speakWithOrkioBrowserVoice,
} from "../lib/orkioTts.js";

/**
 * AO-04H — OrkioVoiceHero com áudio restaurado + sincronização vídeo/voz
 *
 * Princípio: O ÁUDIO é a fonte de verdade do estado playing/speaking.
 *
 * Fluxo:
 * 1. Clique → mantém vídeo idle enquanto o TTS carrega
 * 2. TTS blob é carregado e o áudio é preparado
 * 3. Speaking video é disparado apenas no início real do áudio
 * 4. playing permanece true durante TODA a duração do áudio
 * 5. SOMENTE audio.onended → playing=false → vídeo volta para idle
 *
 * O vídeo NUNCA decide quando parar. O áudio manda.
 */


function waitForAudioReady(audio, timeoutMs = 2600) {
  if (!audio || audio.readyState >= 3) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    let timer = null;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      audio.removeEventListener("canplay", finish);
      audio.removeEventListener("canplaythrough", finish);
      audio.removeEventListener("loadeddata", finish);
      audio.removeEventListener("error", finish);
      resolve();
    };

    audio.addEventListener("canplay", finish, { once: true });
    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("loadeddata", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });

    timer = setTimeout(finish, timeoutMs);

    try {
      audio.load?.();
    } catch {
      finish();
    }
  });
}

function nextAnimationFrame() {
  if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

export default function OrkioVoiceHero({
  tenant,
  token,
  defaultLocale = "pt-BR",
  kicker = "PatroAI apresenta Orkio",
  title = "Da concepção à execução cirúrgica.",
  subtitle = "A Orkio é a Business Execution Engine da PatroAI: organiza tese, estrutura business plans sofisticados, coordena agentes e acompanha a execução com governança.",
  speech = "Olá. Eu sou a Orkio. Através de mim, a PatroAI pode conceber novos negócios, estruturar business plans sofisticados e conduzir a execução com clareza, inteligência e governança.",
  primaryLabel = "Conhecer a Orkio",
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
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [speakingSyncKey, setSpeakingSyncKey] = useState(0);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const motionRef = useRef(null);
  const playingLockRef = useRef(false);

  const isPt = locale === "pt-BR";

  const getMotionController = useCallback(() => {
    if (!motionRef.current) {
      motionRef.current = createOrkioSpeechMotion(heroRef, {
        intensity: 0.92,
        smoothing: 0.78,
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

  const effectiveSpeech = useMemo(() => {
    if (typeof speech === "string" && speech.trim()) return speech.trim();
    return isPt
      ? "Olá. Eu sou a Orkio. Posso ajudar você a entender, organizar e executar com clareza."
      : "Hello. I am Orkio. I can help you understand, organize, and execute with clarity.";
  }, [isPt, speech]);

  const effectiveQuickPrompts = useMemo(() => {
    if (Array.isArray(quickPrompts) && quickPrompts.length) return quickPrompts;
    return isPt
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
  }, [isPt, quickPrompts]);

  const resolvedVoice = useMemo(() => getOrkioVoiceId(), []);
  const resolvedTtsSpeed = useMemo(() => getOrkioTtsSpeed(), []);

  // Função para encerrar a fala de forma segura
  const endPlaying = useCallback(() => {
    playingLockRef.current = false;
    setVoiceLoading(false);
    getMotionController().stop();
    setPlaying(false);
  }, [getMotionController]);

  function fallbackBrowserSpeech() {
    return speakWithOrkioBrowserVoice(effectiveSpeech, {
      locale,
      onStart: () => {
        setVoiceLoading(false);
        playingLockRef.current = true;
        setPlaying(true);
        setSpeakingSyncKey((k) => k + 1);
        getMotionController().startSynthetic({ strength: 0.64 });
      },
      onEnd: () => {
        endPlaying();
      },
      onError: () => {
        endPlaying();
      },
    });
  }

  async function speak() {
    if (playing || voiceLoading || playingLockRef.current) return;

    // AO-04I: durante o carregamento do TTS, a Orkio permanece em idle.
    // O vídeo speaking só entra quando o áudio está pronto para começar.
    playingLockRef.current = true;
    setVoiceLoading(true);

    try {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
        cleanupAudioUrl(audioRef.current);
        getMotionController().stop();
        audioRef.current = null;
      }

      const blob = await requestOrkioTtsBlob({
        text: effectiveSpeech,
        token,
        tenant,
        locale,
      });

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.dataset.blobUrl = url;
      audio.preload = "auto";
      audioRef.current = audio;

      audio.onended = () => {
        cleanupAudioUrl(audio);
        endPlaying();
      };
      audio.onerror = () => {
        cleanupAudioUrl(audio);
        endPlaying();
      };

      await waitForAudioReady(audio);

      if (!playingLockRef.current) return;

      setVoiceLoading(false);
      setSpeakingSyncKey((k) => k + 1);
      setPlaying(true);
      getMotionController().startSynthetic({ strength: 0.64 });

      await nextAnimationFrame();

      if (playingLockRef.current) {
        await audio.play();
      }
    } catch (err) {
      console.warn("ORKIO_VOICE_HERO_TTS_FAILED", err?.message || err);
      setVoiceLoading(false);
      const browserFallbackOk = fallbackBrowserSpeech();
      if (!browserFallbackOk) {
        endPlaying();
      }
    }
  }

  return (
    <section ref={heroRef} className={`orkio-voice-hero ${playing ? "is-playing" : ""} ${voiceLoading ? "is-loading-voice" : ""}`} aria-label="Orkio OS voz e texto">
      <style>{`
        .orkio-voice-hero {
          width: 100%;
          max-width: 100%;
          border-radius: 34px;
          border: 1px solid rgba(148,163,184,0.16);
          background:
            radial-gradient(720px 380px at 8% 0%, rgba(84,213,104,0.13), transparent 58%),
            radial-gradient(620px 340px at 95% 8%, rgba(245,185,56,0.12), transparent 54%),
            linear-gradient(180deg, rgba(8,16,26,0.98) 0%, rgba(4,9,16,1) 100%);
          box-shadow: 0 34px 90px rgba(2,6,23,0.42);
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
          --orkio-voice-level: 0;
          --orkio-mouth-open: 0;
          --orkio-head-tilt: 0;
          --orkio-breath: 0;
          --orkio-voice-glow: 0;
        }

        .orkio-voice-hero,
        .orkio-voice-hero * {
          box-sizing: border-box;
        }

        .orkio-voice-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top left, rgba(84,213,104,0.14), transparent 34%),
            radial-gradient(circle at top right, rgba(245,185,56,0.14), transparent 26%),
            radial-gradient(circle at bottom center, rgba(67,213,255,0.08), transparent 32%);
          pointer-events: none;
        }

        .orkio-voice-hero__inner {
          position: relative;
          z-index: 1;
          padding: 28px;
        }

        .orkio-voice-hero__top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .orkio-voice-hero__kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border-radius: 999px;
          padding: 10px 14px;
          background: rgba(124,58,237,0.14);
          border: 1px solid rgba(124,58,237,0.22);
          color: #ddd6fe;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .orkio-voice-hero__led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 6px rgba(34,197,94,0.16);
        }

        .orkio-voice-hero.is-playing .orkio-voice-hero__led {
          animation: orkioVoicePulse 1s ease-in-out infinite;
        }

        .orkio-voice-hero__langs {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .orkio-voice-hero__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          align-items: stretch;
          min-width: 0;
        }

        .orkio-voice-hero__main {
          min-width: 0;
        }

        .orkio-voice-hero__headlineRow {
          display: flex;
          gap: 18px;
          align-items: center;
          flex-wrap: nowrap;
          min-width: 0;
        }

        .orkio-voice-hero__orbButton {
          flex: 0 0 auto;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 1px solid rgba(148,163,184,0.16);
          background: rgba(15,23,42,0.44);
          box-shadow: 0 18px 42px rgba(2,6,23,0.32);
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .orkio-voice-hero__orbButton:hover {
          transform: translateY(-1px);
        }

        .orkio-voice-hero.is-playing .orkio-voice-hero__orbButton {
          background: linear-gradient(135deg, rgba(124,58,237,0.22), rgba(37,99,235,0.18));
          box-shadow:
            0 0 0 calc(8px + (var(--orkio-voice-level) * 14px)) rgba(124,58,237,0.10),
            0 18px 42px rgba(2,6,23,0.32),
            0 0 calc(22px + (var(--orkio-voice-glow) * 28px)) rgba(124,58,237,0.16);
          transform:
            translateY(calc(-5px * var(--orkio-voice-level)))
            rotate(calc(var(--orkio-head-tilt) * 1deg))
            scale(calc(1 + (var(--orkio-voice-level) * 0.04)));
        }

        .orkio-voice-hero__copy {
          min-width: 0;
        }

        .orkio-voice-hero__badge {
          color: rgba(148,163,184,0.86);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .orkio-voice-hero__voiceMeter {
          width: min(180px, 100%);
          height: 5px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(148,163,184,0.12);
          margin-bottom: 10px;
        }

        .orkio-voice-hero__voiceMeter span {
          display: block;
          height: 100%;
          width: calc(18% + (var(--orkio-mouth-open) * 82%));
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(134,239,172,0.95), rgba(96,165,250,0.92), rgba(247,200,98,0.86));
          box-shadow: 0 0 18px rgba(96,165,250,0.18);
          opacity: calc(0.42 + (var(--orkio-voice-glow) * 0.58));
          transition: width 80ms linear, opacity 120ms linear;
        }

        .orkio-voice-hero__title {
          color: #f8fafc;
          font-size: clamp(30px, 4.1vw, 46px);
          line-height: 1.02;
          letter-spacing: -0.045em;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .orkio-voice-hero__subtitle {
          margin-top: 18px;
          margin-bottom: 0;
          color: #94a3b8;
          font-size: 17px;
          line-height: 1.78;
          max-width: 780px;
        }

        .orkio-voice-hero__actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .orkio-voice-hero__quick {
          margin-top: 22px;
          border-radius: 26px;
          padding: 18px;
          background: rgba(2,6,23,0.34);
          border: 1px solid rgba(148,163,184,0.16);
        }

        .orkio-voice-hero__quickTitle {
          color: #64748b;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .orkio-voice-hero__chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .orkio-voice-hero__chip {
          border: 1px solid rgba(148,163,184,0.16);
          background: rgba(15,23,42,0.56);
          color: #cbd5e1;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.35;
          cursor: pointer;
        }

        .orkio-voice-hero__sideCard {
          border-radius: 30px;
          border: 1px solid rgba(148,163,184,0.16);
          background: linear-gradient(180deg, rgba(15,23,42,0.88) 0%, rgba(10,14,24,0.98) 100%);
          padding: 22px;
          min-height: auto;
          display: grid;
          gap: 16px;
          min-width: 0;
        }

        .orkio-voice-hero__sideTitle {
          color: #f8fafc;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.15;
        }

        .orkio-voice-hero__sideCard p {
          color: #94a3b8;
          line-height: 1.7;
          font-size: 15px;
          margin-top: 14px;
        }

        .orkio-voice-hero__sideList {
          display: grid;
          gap: 10px;
        }

        .orkio-voice-hero__sideItem {
          border-radius: 18px;
          padding: 14px 16px;
          border: 1px solid rgba(148,163,184,0.16);
          background: rgba(255,255,255,0.02);
          color: #e2e8f0;
          font-weight: 700;
        }

        .orkio-voice-hero__langBtn,
        .orkio-voice-hero__primary,
        .orkio-voice-hero__secondary,
        .orkio-voice-hero__ghost {
          cursor: pointer;
          font-family: inherit;
        }

        .orkio-voice-hero__langBtn {
          border: 1px solid rgba(148,163,184,0.16);
          background: rgba(15,23,42,0.46);
          color: #cbd5e1;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 800;
        }

        .orkio-voice-hero__langBtn.is-active {
          background: rgba(245,158,11,0.16);
          color: #fde68a;
        }

        .orkio-voice-hero__primary,
        .orkio-voice-hero__secondary,
        .orkio-voice-hero__ghost {
          border-radius: 999px;
          padding: 13px 18px;
          font-weight: 850;
        }

        .orkio-voice-hero__primary {
          border: none;
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
          color: #111827;
          font-weight: 900;
          box-shadow: 0 14px 34px rgba(245,158,11,0.24);
        }

        .orkio-voice-hero__secondary {
          border: 1px solid rgba(148,163,184,0.16);
          background: rgba(15,23,42,0.54);
          color: #e2e8f0;
        }

        .orkio-voice-hero__ghost {
          border: 1px solid rgba(124,58,237,0.26);
          background: rgba(124,58,237,0.12);
          color: #ddd6fe;
        }

        @keyframes orkioVoicePulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(34,197,94,0.16); transform: scale(1); }
          50% { box-shadow: 0 0 0 10px rgba(34,197,94,0.06); transform: scale(1.12); }
        }

        @keyframes orkioVoiceFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (max-width: 980px) {
          .orkio-voice-hero__grid {
            grid-template-columns: 1fr;
          }

          .orkio-voice-hero__sideCard {
            min-height: auto;
          }
        }

        @media (max-width: 640px) {
          .orkio-voice-hero {
            border-radius: 26px;
          }

          .orkio-voice-hero__inner {
            padding: 18px;
          }

          .orkio-voice-hero__top {
            align-items: flex-start;
            margin-bottom: 18px;
          }

          .orkio-voice-hero__headlineRow {
            display: grid;
            grid-template-columns: 54px minmax(0, 1fr);
            gap: 12px;
            align-items: start;
          }

          .orkio-voice-hero__orbButton {
            width: 54px;
            height: 54px;
          }

          .orkio-voice-hero__title {
            font-size: clamp(28px, 8.6vw, 34px);
            line-height: 1.08;
            letter-spacing: -0.04em;
          }

          .orkio-voice-hero__subtitle {
            font-size: 15px;
            line-height: 1.62;
          }

          .orkio-voice-hero__actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .orkio-voice-hero__primary,
          .orkio-voice-hero__secondary,
          .orkio-voice-hero__ghost {
            width: 100%;
          }

          .orkio-voice-hero__sideTitle {
            font-size: 20px;
          }

          .orkio-voice-hero__quick,
          .orkio-voice-hero__sideCard {
            border-radius: 22px;
            padding: 16px;
          }
        }

        @media (max-width: 390px) {
          .orkio-voice-hero__title {
            font-size: 30px;
          }

          .orkio-voice-hero__kicker {
            font-size: 11px;
          }
        }
      `}</style>

      <div className="orkio-voice-hero__inner">
        <div className="orkio-voice-hero__top">
          <div className="orkio-voice-hero__kicker">
            <span className="orkio-voice-hero__led" />
            {kicker}
          </div>

          <div className="orkio-voice-hero__langs">
            <button type="button" onClick={() => setLocale("pt-BR")} className={`orkio-voice-hero__langBtn ${locale === "pt-BR" ? "is-active" : ""}`}>
              PT-BR
            </button>
            <button type="button" onClick={() => setLocale("en-US")} className={`orkio-voice-hero__langBtn ${locale === "en-US" ? "is-active" : ""}`}>
              EN-US
            </button>
          </div>
        </div>

        <div className="orkio-voice-hero__grid">
          <div className="orkio-voice-hero__main">
            <div className="orkio-voice-hero__headlineRow">
              <button
                type="button"
                onClick={speak}
                className="orkio-voice-hero__orbButton"
                aria-label={isPt ? "Ouvir a Orkio" : "Listen to Orkio"}
              >
                <OrkioMysticAvatar size={42} speaking={playing} syncKey={speakingSyncKey} />
              </button>

              <div className="orkio-voice-hero__copy">
                <div className="orkio-voice-hero__badge">
                  {playing ? (isPt ? "A Orkio falando" : "Orkio speaking") : badgeLabel}
                </div>
                <div className="orkio-voice-hero__voiceMeter" aria-hidden="true">
                  <span />
                </div>
                <div className="orkio-voice-hero__title">{title}</div>
              </div>
            </div>

            <p className="orkio-voice-hero__subtitle">{subtitle}</p>

            <div className="orkio-voice-hero__actions">
              <button type="button" onClick={speak} className="orkio-voice-hero__ghost">
                {isPt ? "Ouvir a Orkio" : "Listen to Orkio"}
              </button>
              <button type="button" onClick={onPrimaryAction} className="orkio-voice-hero__primary">
                {primaryLabel}
              </button>
              <button type="button" onClick={onSecondaryAction} className="orkio-voice-hero__secondary">
                {secondaryLabel}
              </button>
              <button type="button" onClick={onTertiaryAction} className="orkio-voice-hero__secondary">
                {tertiaryLabel}
              </button>
            </div>

            <div className="orkio-voice-hero__quick">
              <div className="orkio-voice-hero__quickTitle">{quickTitle}</div>
              <div className="orkio-voice-hero__chips">
                {effectiveQuickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onFillPrompt?.(prompt)}
                    className="orkio-voice-hero__chip"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="orkio-voice-hero__sideCard" aria-label="Narrativa Orkio">
            <div>
              <div className="orkio-voice-hero__sideTitle">
                {isPt ? "Como a Orkio transforma visão em execução" : "How Orkio turns vision into execution"}
              </div>
              <p>
                {isPt
                  ? "A PatroAI usa a Orkio para transformar visão em direção concreta: diagnóstico, tese, business plan, arquitetura, agentes e execução acompanhada."
                  : "PatroAI uses Orkio to turn vision into concrete direction: diagnosis, thesis, business plan, architecture, agents, and guided execution."}
              </p>
            </div>

            <div className="orkio-voice-hero__sideList">
              {[
                isPt ? "Concepção estratégica" : "Strategic conception",
                isPt ? "Business plans sofisticados" : "Sophisticated business plans",
                isPt ? "Execução cirúrgica com IA" : "Surgical AI execution",
              ].map((item) => (
                <div key={item} className="orkio-voice-hero__sideItem">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
