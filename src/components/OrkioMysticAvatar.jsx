import React, { useState } from "react";

const AVATAR_SRC = "/patroai-assets/orkio-mystic-tech-v1.webp";

export default function OrkioMysticAvatar({
  size = 92,
  variant = "orb",
  speaking = false,
  label = "A Orkio — presença místico-tecnológica",
  onClick,
}) {
  const [failed, setFailed] = useState(false);
  const isCard = variant === "card" || variant === "portrait";
  const dimension = typeof size === "number" ? `${size}px` : size;
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={label}
      className={`orkio-mystic-avatar ${isCard ? "is-card" : "is-orb"} ${speaking ? "is-speaking" : ""}`}
      style={{
        "--orkio-avatar-size": dimension,
      }}
    >
      <style>{`
        .orkio-mystic-avatar {
          position: relative;
          width: var(--orkio-avatar-size);
          height: var(--orkio-avatar-size);
          display: grid;
          place-items: center;
          border: 0;
          padding: 0;
          color: inherit;
          background: transparent;
          isolation: isolate;
          flex: 0 0 auto;
        }

        button.orkio-mystic-avatar {
          cursor: pointer;
        }

        .orkio-mystic-avatar::before,
        .orkio-mystic-avatar::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
        }

        .orkio-mystic-avatar::before {
          inset: -8%;
          background:
            radial-gradient(circle at 50% 45%, rgba(245,196,81,0.28), transparent 54%),
            radial-gradient(circle at 50% 50%, rgba(129,140,248,0.22), transparent 62%);
          filter: blur(10px);
          opacity: 0.86;
          z-index: -2;
        }

        .orkio-mystic-avatar::after {
          inset: -2%;
          border: 1px solid rgba(245,196,81,0.28);
          box-shadow:
            0 0 34px rgba(245,196,81,0.18),
            inset 0 0 28px rgba(129,140,248,0.12);
          z-index: 1;
        }

        .orkio-mystic-avatar.is-card {
          height: calc(var(--orkio-avatar-size) * 1.22);
          border-radius: 30px;
        }

        .orkio-mystic-avatar.is-card::before,
        .orkio-mystic-avatar.is-card::after {
          border-radius: 30px;
        }

        .orkio-mystic-avatar__img,
        .orkio-mystic-avatar__fallback {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          border-radius: 999px;
          border: 1px solid rgba(245,196,81,0.34);
          background: #05070d;
          box-shadow:
            0 20px 54px rgba(0,0,0,0.36),
            0 0 46px rgba(245,196,81,0.16);
        }

        .orkio-mystic-avatar.is-card .orkio-mystic-avatar__img,
        .orkio-mystic-avatar.is-card .orkio-mystic-avatar__fallback {
          border-radius: 30px;
        }

        .orkio-mystic-avatar__fallback {
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle at 42% 24%, rgba(245,196,81,0.34), transparent 30%),
            radial-gradient(circle at 50% 60%, rgba(129,140,248,0.18), transparent 44%),
            linear-gradient(180deg, rgba(11,18,32,0.96), rgba(3,7,18,1));
          color: #f8dfa3;
          font-size: clamp(22px, 22%, 42px);
          font-weight: 950;
          letter-spacing: -0.06em;
        }

        .orkio-mystic-avatar__halo {
          position: absolute;
          inset: 10%;
          border-radius: inherit;
          background:
            linear-gradient(120deg, transparent 0%, rgba(245,196,81,0.18) 44%, transparent 62%);
          mix-blend-mode: screen;
          opacity: 0.58;
          transform: rotate(-8deg);
          pointer-events: none;
          z-index: 2;
        }

        .orkio-mystic-avatar__mouthRig {
          position: absolute;
          left: 50%;
          top: 42.5%;
          z-index: 4;
          width: calc(var(--orkio-avatar-size) * 0.26);
          height: calc(var(--orkio-avatar-size) * 0.09);
          transform:
            translate(-50%, -50%)
            scaleX(calc(0.78 + (var(--orkio-mouth-wide, 0) * 0.18)));
          opacity: calc(0.10 + (var(--orkio-mouth-open, 0) * 0.38));
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .orkio-mystic-avatar__mouthRig span {
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          border-radius: 999px;
          transform-origin: center center;
        }

        .orkio-mystic-avatar__mouthShadow {
          width: 78%;
          height: 42%;
          background: radial-gradient(ellipse at center, rgba(2,6,14,0.62), rgba(2,6,14,0.24) 55%, transparent 76%);
          transform:
            translate(-50%, -50%)
            scaleX(calc(0.62 + (var(--orkio-mouth-wide, 0) * 0.40)))
            scaleY(calc(0.16 + (var(--orkio-jaw-drop, var(--orkio-mouth-open, 0)) * 0.72)));
          opacity: calc(0.06 + (var(--orkio-mouth-open, 0) * 0.34));
        }

        .orkio-mystic-avatar__mouthLine {
          width: 82%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,226,157,0.50), rgba(247,200,98,0.74), rgba(255,226,157,0.50), transparent);
          transform:
            translate(-50%, calc(-50% + (var(--orkio-jaw-drop, var(--orkio-mouth-open, 0)) * 1.8px)))
            scaleX(calc(0.58 + (var(--orkio-mouth-wide, 0) * 0.42)));
          opacity: calc(0.10 + (var(--orkio-mouth-open, 0) * 0.50));
          box-shadow: 0 0 calc(4px + (var(--orkio-voice-glow, 0) * 10px)) rgba(247,200,98,0.20);
        }

        .orkio-mystic-avatar__mouthGlow {
          width: 92%;
          height: 74%;
          background: radial-gradient(ellipse at center, rgba(247,200,98,0.24), rgba(96,165,250,0.06) 46%, transparent 72%);
          transform:
            translate(-50%, -50%)
            scaleX(calc(0.68 + (var(--orkio-mouth-wide, 0) * 0.30)))
            scaleY(calc(0.22 + (var(--orkio-mouth-open, 0) * 0.92)));
          opacity: calc(0.04 + (var(--orkio-mouth-open, 0) * 0.24));
          filter: blur(2.2px);
        }

        .orkio-mystic-avatar.is-speaking {
          animation: orkioMysticFloat 2.4s ease-in-out infinite;
        }

        .orkio-mystic-avatar.is-speaking::after {
          animation: orkioMysticPulse 1.05s ease-in-out infinite;
        }

        @keyframes orkioMysticFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes orkioMysticPulse {
          0%, 100% { box-shadow: 0 0 34px rgba(245,196,81,0.18), inset 0 0 28px rgba(129,140,248,0.12); }
          50% { box-shadow: 0 0 58px rgba(245,196,81,0.34), 0 0 0 10px rgba(245,196,81,0.06), inset 0 0 34px rgba(129,140,248,0.18); }
        }
      `}</style>

      {failed ? (
        <span className="orkio-mystic-avatar__fallback">O</span>
      ) : (
        <img
          className="orkio-mystic-avatar__img"
          src={AVATAR_SRC}
          alt={label}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      <span className="orkio-mystic-avatar__halo" aria-hidden="true" />
      <span className="orkio-mystic-avatar__mouthRig" aria-hidden="true">
        <span className="orkio-mystic-avatar__mouthShadow" />
        <span className="orkio-mystic-avatar__mouthLine" />
        <span className="orkio-mystic-avatar__mouthGlow" />
      </span>
    </Wrapper>
  );
}
