import React, { useEffect, useRef, useState } from "react";

/**
 * AO-04K — OrkioVideoMedia corretivo e compatível
 *
 * Princípio operacional:
 * - O áudio/TTS é a fonte de verdade do estado speaking.
 * - Este componente apenas reflete speaking=true/false.
 * - Idle e speaking ficam pré-carregados.
 * - O speaking permanece em loop até o pai encerrar a fala.
 * - video.onended nunca encerra a fala.
 *
 * Compatibilidade preservada:
 * - aceita className, style, size, borderRadius, onError e onVideoError.
 */

const IDLE_MP4 = "/patroai-assets/orkio-idle-loop.mp4";
const IDLE_WEBM = "/patroai-assets/orkio-idle-loop.webm";
const SPEAK_MP4 = "/patroai-assets/orkio-speaking-loop.mp4";
const SPEAK_WEBM = "/patroai-assets/orkio-speaking-loop.webm";
const POSTER = "/patroai-assets/orkio-video-poster.webp";
const FALLBACK_IMG = "/patroai-assets/orkio-mystic-tech-v1.webp";

function canPlayWebM() {
  if (typeof document === "undefined") return false;
  try {
    const video = document.createElement("video");
    return Boolean(video.canPlayType?.('video/webm; codecs="vp9"'));
  } catch {
    return false;
  }
}

function normalizeSize(size) {
  if (typeof size === "number") return `${size}px`;
  return size || "100%";
}

export default function OrkioVideoMedia({
  speaking = false,
  syncKey = 0, // mantido só por compatibilidade; não usado no novo runtime
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
  onError,
  onVideoError,
}) {
  const idleRef = useRef(null);
  const speakingRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [preferWebM, setPreferWebM] = useState(false);

  useEffect(() => {
    setPreferWebM(canPlayWebM());
  }, []);

  useEffect(() => {
    if (failed) return undefined;

    const idleVideo = idleRef.current;
    const speakingVideo = speakingRef.current;
    if (!idleVideo || !speakingVideo) return undefined;

    let cancelled = false;
    const videos = [idleVideo, speakingVideo];

    const prepareVideo = (video) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
    };

    const startVideo = async (video) => {
      try {
        prepareVideo(video);
        await video.play();
      } catch {
        // Em alguns browsers, autoplay mudo pode aguardar interação.
        // Uma nova tentativa roda no próximo clique/render.
      }
    };

    const timer = window.setTimeout(async () => {
      await Promise.all(videos.map(startVideo));
      if (!cancelled) setReady(true);
    }, 40);

    const retryOnInteraction = () => {
      videos.forEach((video) => startVideo(video));
    };

    window.addEventListener("pointerdown", retryOnInteraction, { passive: true });
    window.addEventListener("touchstart", retryOnInteraction, { passive: true });
    window.addEventListener("keydown", retryOnInteraction);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", retryOnInteraction);
      window.removeEventListener("touchstart", retryOnInteraction);
      window.removeEventListener("keydown", retryOnInteraction);
    };
  }, [failed, preferWebM]);

  function reportVideoError() {
    setFailed(true);
    if (typeof onVideoError === "function") onVideoError();
    if (typeof onError === "function") onError();
  }

  const idleSrc = preferWebM ? IDLE_WEBM : IDLE_MP4;
  const speakingSrc = preferWebM ? SPEAK_WEBM : SPEAK_MP4;

  const containerStyle = {
    position: "relative",
    width: normalizeSize(size),
    height: "100%",
    borderRadius,
    overflow: "hidden",
    background: "#020610",
    ...style,
  };

  const videoStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius,
    pointerEvents: "none",
  };

  if (failed) {
    return (
      <div className={`orkio-video-media ${className}`} style={containerStyle}>
        <img
          src={FALLBACK_IMG}
          alt="Orkio"
          loading="eager"
          decoding="async"
          style={{
            ...videoStyle,
            position: "relative",
          }}
        />
      </div>
    );
  }

  return (
    <div className={`orkio-video-media ${className}`} style={containerStyle}>
      <video
        ref={speakingRef}
        src={speakingSrc}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="auto"
        onError={reportVideoError}
        aria-hidden="true"
        style={{
          ...videoStyle,
          zIndex: 1,
          opacity: 1,
          transition: "none",
        }}
      />

      <video
        ref={idleRef}
        src={idleSrc}
        poster={POSTER}
        muted
        loop
        playsInline
        preload="auto"
        onError={reportVideoError}
        aria-hidden="true"
        style={{
          ...videoStyle,
          zIndex: 2,
          opacity: speaking ? 0 : 1,
          transition: "none",
        }}
      />

      {!ready && (
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          style={{
            ...videoStyle,
            zIndex: 3,
          }}
        />
      )}
    </div>
  );
}
