import React, { useState } from "react";
import OrkioVideoMedia from "./OrkioVideoMedia.jsx";

/**
 * OrkioMysticAvatar — Componente reutilizável de avatar com vídeo
 *
 * Evolução: agora usa OrkioVideoMedia quando variant="card" ou "portrait",
 * com fallback para imagem estática se vídeo falhar.
 * Mantém compatibilidade total com a API existente.
 */

const AVATAR_SRC = "/patroai-assets/orkio-mystic-tech-v1.webp";

export default function OrkioMysticAvatar({
  size = 92,
  variant = "orb",
  speaking = false,
  label = "A Orkio — presença místico-tecnológica",
  onClick,
  useVideo = true,
}) {
  const [failed, setFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const isCard = variant === "card" || variant === "portrait";
  const dimension = typeof size === "number" ? `${size}px` : size;
  const Wrapper = onClick ? "button" : "div";

  const shouldUseVideo = useVideo && isCard && !videoFailed;

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

      {shouldUseVideo ? (
        <OrkioVideoMedia
          speaking={speaking}
          borderRadius={isCard ? "30px" : "999px"}
          onError={() => setVideoFailed(true)}
        />
      ) : failed ? (
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
    </Wrapper>
  );
}
