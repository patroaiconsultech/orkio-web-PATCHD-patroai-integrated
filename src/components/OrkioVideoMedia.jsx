import React, { useEffect, useRef, useState } from "react";

/**
 * OrkioVideoMedia — Componente centralizado de mídia de vídeo da Orkio
 *
 * Responsabilidades:
 * - Reproduzir orkio-idle-loop quando não estiver falando
 * - Reproduzir orkio-speaking-loop quando estiver falando
 * - Fallback para imagem estática se vídeo falhar
 * - Suporte a .webm com fallback para .mp4
 * - playsInline, muted, loop, preload="metadata"
 * - Responsivo e não trava a UI
 */

const IDLE_WEBM = "/patroai-assets/orkio-idle-loop.webm";
const IDLE_MP4 = "/patroai-assets/orkio-idle-loop.mp4";
const SPEAKING_WEBM = "/patroai-assets/orkio-speaking-loop.webm";
const SPEAKING_MP4 = "/patroai-assets/orkio-speaking-loop.mp4";
const POSTER = "/patroai-assets/orkio-video-poster.webp";
const FALLBACK_IMG = "/patroai-assets/orkio-mystic-tech-v1.webp";

export default function OrkioVideoMedia({
  speaking = false,
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
  onError,
}) {
  const idleRef = useRef(null);
  const speakingRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (videoFailed) return;

    const idleEl = idleRef.current;
    const speakingEl = speakingRef.current;

    if (speaking) {
      if (idleEl) {
        idleEl.pause();
        idleEl.style.opacity = "0";
      }
      if (speakingEl) {
        speakingEl.style.opacity = "1";
        speakingEl.play().catch(() => {});
      }
    } else {
      if (speakingEl) {
        speakingEl.pause();
        speakingEl.style.opacity = "0";
      }
      if (idleEl) {
        idleEl.style.opacity = "1";
        idleEl.play().catch(() => {});
      }
    }
  }, [speaking, videoFailed]);

  function handleVideoError() {
    setVideoFailed(true);
    if (typeof onError === "function") onError();
  }

  const containerStyle = {
    position: "relative",
    width: typeof size === "number" ? `${size}px` : size,
    height: "100%",
    borderRadius,
    overflow: "hidden",
    background: "#05070d",
    ...style,
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius,
    transition: "opacity 300ms ease",
  };

  if (videoFailed) {
    return (
      <div className={`orkio-video-media ${className}`} style={containerStyle}>
        <img
          src={FALLBACK_IMG}
          alt="Orkio"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius,
          }}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`orkio-video-media ${className}`} style={containerStyle}>
      {/* Idle loop */}
      <video
        ref={idleRef}
        style={{ ...videoStyle, opacity: speaking ? 0 : 1 }}
        poster={POSTER}
        playsInline
        muted
        loop
        preload="metadata"
        onError={handleVideoError}
        aria-hidden="true"
      >
        <source src={IDLE_WEBM} type="video/webm" />
        <source src={IDLE_MP4} type="video/mp4" />
      </video>

      {/* Speaking loop */}
      <video
        ref={speakingRef}
        style={{ ...videoStyle, opacity: speaking ? 1 : 0 }}
        poster={POSTER}
        playsInline
        muted
        loop
        preload="metadata"
        onError={handleVideoError}
        aria-hidden="true"
      >
        <source src={SPEAKING_WEBM} type="video/webm" />
        <source src={SPEAKING_MP4} type="video/mp4" />
      </video>
    </div>
  );
}
