import React, { useCallback, useRef, useState } from "react";

/**
 * AO-01 HOTFIX — AvatarHero3D puro
 *
 * Este componente NÃO importa a landing e NÃO importa a si mesmo.
 * Ele é visual, isolado e seguro para ser usado dentro de PatroaiLanding.jsx.
 *
 * Contrato esperado:
 * <AvatarHero3D
 *   speech="texto opcional para fala local"
 *   onText={handleStartAvatarJourney}
 *   onDiagnosis={handleStartAvatarJourney}
 * />
 */

const AVATAR_SRC = "/patroai-assets/orkio-avatar-hero.webp";
const BRAIN_SRC = "/patroai-assets/patroai-brain-hero.webp";

export default function AvatarHero3D({ speech = "", onText, onDiagnosis }) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [brainFailed, setBrainFailed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const safeCallback = useCallback((fn) => {
    if (typeof fn === "function") fn();
  }, []);

  const handleSpeak = useCallback(() => {
    const text =
      typeof speech === "string" && speech.trim()
        ? speech.trim()
        : "Olá. Eu sou o Orkio. Posso ajudar você a organizar contexto, entender desafios e iniciar uma evolução com clareza.";

    try {
      if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        safeCallback(onText);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.96;
      utterance.pitch = 0.92;
      utterance.volume = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeaking(false);
      safeCallback(onText);
    }
  }, [onText, safeCallback, speech]);

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

        .orkio-avatar-hero::before,
        .orkio-avatar-hero::after {
          content: "";
          position: absolute;
          inset: auto;
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
          grid-template-columns: 0.95fr 1.05fr;
          align-items: stretch;
        }

        .orkio-avatar-hero__copy {
          padding: 34px 28px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
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
          overflow: hidden;
        }

        .orkio-avatar-hero__brain {
          position: absolute;
          left: -90px;
          bottom: 20px;
          width: min(390px, 58%);
          max-height: 390px;
          object-fit: contain;
          opacity: 0.92;
          filter: drop-shadow(0 0 28px rgba(247,200,98,0.34));
          z-index: 1;
        }

        .orkio-avatar-hero__avatar {
          position: relative;
          z-index: 3;
          width: min(430px, 94%);
          max-height: 500px;
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(0 34px 46px rgba(0,0,0,0.62));
          transform: translateX(8px);
        }

        .orkio-avatar-hero.is-speaking .orkio-avatar-hero__avatar {
          animation: orkioAvatarFloat 2.2s ease-in-out infinite;
        }

        .orkio-avatar-hero__fallback {
          position: relative;
          z-index: 3;
          width: min(360px, 78%);
          aspect-ratio: 0.68;
          margin-bottom: 10px;
          border-radius: 48% 48% 30% 30%;
          background:
            radial-gradient(circle at 50% 18%, rgba(255,245,210,0.9), transparent 0 13%, transparent 14%),
            linear-gradient(140deg, rgba(247,200,98,0.18), rgba(255,255,255,0.04) 42%, rgba(247,200,98,0.08)),
            rgba(4,8,15,0.72);
          border: 1px solid rgba(247,200,98,0.30);
          box-shadow: inset 0 0 60px rgba(247,200,98,0.09), 0 30px 60px rgba(0,0,0,0.46);
        }

        .orkio-avatar-hero__fallback::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 10%;
          width: 42%;
          aspect-ratio: 1;
          transform: translateX(-50%);
          border-radius: 44% 44% 48% 48%;
          border: 1px solid rgba(247,200,98,0.42);
          background: radial-gradient(circle at 50% 52%, rgba(247,200,98,0.18), transparent 62%);
        }

        .orkio-avatar-hero__fallback::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 38%;
          width: 62%;
          height: 52%;
          transform: translateX(-50%);
          border-radius: 38% 38% 18% 18%;
          border: 1px solid rgba(247,200,98,0.30);
          background: linear-gradient(180deg, rgba(247,200,98,0.10), rgba(0,0,0,0.18));
        }

        .orkio-avatar-hero__brainFallback {
          position: absolute;
          left: -64px;
          bottom: 44px;
          width: 290px;
          height: 290px;
          z-index: 1;
          border-radius: 999px;
          border: 1px solid rgba(247,200,98,0.25);
          background:
            radial-gradient(circle at 50% 50%, rgba(247,200,98,0.44), transparent 0 2%, transparent 3%),
            repeating-radial-gradient(circle, rgba(247,200,98,0.12) 0 1px, transparent 1px 18px),
            radial-gradient(circle, rgba(247,200,98,0.20), transparent 66%);
          box-shadow: 0 0 54px rgba(247,200,98,0.22);
        }

        @keyframes orkioAvatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(247,200,98,0.26); transform: scale(1); }
          50% { box-shadow: 0 0 0 9px rgba(247,200,98,0.04); transform: scale(1.06); }
        }

        @keyframes orkioAvatarFloat {
          0%, 100% { transform: translateX(8px) translateY(0); }
          50% { transform: translateX(8px) translateY(-4px); }
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

          .orkio-avatar-hero__brain {
            left: 8px;
            bottom: 8px;
            width: 260px;
          }

          .orkio-avatar-hero__avatar {
            width: min(360px, 84%);
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

          .orkio-avatar-hero__brain,
          .orkio-avatar-hero__brainFallback {
            display: none;
          }
        }
      `}</style>

      <div className="orkio-avatar-hero__grid">
        <div className="orkio-avatar-hero__copy">
          <span className="orkio-avatar-hero__eyebrow">Conheça o Orkio</span>
          <h2>
            Olá, eu sou o
            <span>Orkio.</span>
          </h2>
          <p>
            Posso te ajudar a transformar perguntas soltas em diagnóstico, clareza operacional
            e próximos passos para evolução da sua empresa.
          </p>

          <div className="orkio-avatar-hero__actions">
            <button type="button" className="orkio-avatar-hero__action" onClick={handleSpeak}>
              <span>Falar com Orkio</span>
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

          <div className="orkio-avatar-hero__status">
            <span className="orkio-avatar-hero__pulse" aria-hidden="true" />
            <span>{speaking ? "Respondendo por voz." : "Respondo por voz e por texto."}</span>
          </div>
        </div>

        <div className="orkio-avatar-hero__visual" aria-hidden="true">
          {!brainFailed ? (
            <img
              className="orkio-avatar-hero__brain"
              src={BRAIN_SRC}
              alt=""
              loading="eager"
              decoding="async"
              onError={() => setBrainFailed(true)}
            />
          ) : (
            <div className="orkio-avatar-hero__brainFallback" />
          )}

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
        </div>
      </div>
    </section>
  );
}
