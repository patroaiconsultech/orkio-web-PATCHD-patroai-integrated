CAMINHO REAL DO PROJETO:
src/components/OrkioVideoMedia.jsx

CONTEÚDO COMPLETO:
================================================================================
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * AO-UX-01 — OrkioVideoMedia com estabilidade perceptiva
 *
 * Responsabilidade UX:
 * - o vídeo nunca pode travar ou quebrar a landing;
 * - se autoplay falhar, exibe poster/imagem premium;
 * - se o usuário preferir movimento reduzido, evita vídeo pesado;
 * - o áudio/TTS continua sendo a fonte de verdade do estado speaking.
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

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;

  try {
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
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
  syncKey = 0, // mantido só por compatibilidade
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
  onError,
  onVideoError,
  onReady,
}) {
  const idleRef = useRef(null);
  const speakingRef = useRef(null);
  const mountedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [preferWebM, setPreferWebM] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    setPreferWebM(canPlayWebM());
    setMotionReduced(prefersReducedMotion());

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const idleSrc = useMemo(() => (preferWebM ? IDLE_WEBM : IDLE_MP4), [preferWebM]);
  const speakingSrc = useMemo(() => (preferWebM ? SPEAK_WEBM : SPEAK_MP4), [preferWebM]);

  useEffect(() => {
    if (failed || motionReduced) return undefined;

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
      video.setAttribute("aria-hidden", "true");
    };

    const startVideo = async (video) => {
      try {
        prepareVideo(video);
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
        return true;
      } catch {
        return false;
      }
    };

    const markReady = () => {
      if (cancelled || !mountedRef.current) return;
      setReady(true);
      setPosterOnly(false);
      if (typeof onReady === "function") onReady();
    };

    const readyTimer = window.setTimeout(async () => {
      const results = await Promise.all(videos.map(startVideo));
      if (cancelled) return;

      if (results.some(Boolean)) {
        markReady();
      } else {
        // Browser bloqueou autoplay mudo ou rede ainda lenta.
        // Mantemos poster premium sem derrubar a landing.
        setPosterOnly(true);
      }
    }, 40);

    const posterTimer = window.setTimeout(() => {
      if (!cancelled && !ready) setPosterOnly(true);
    }, 1600);

    const retryOnInteraction = async () => {
      if (cancelled || failed || motionReduced) return;
      const results = await Promise.all(videos.map(startVideo));
      if (results.some(Boolean)) markReady();
    };

    const onCanPlay = () => markReady();

    videos.forEach((video) => {
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("loadeddata", onCanPlay);
    });

    window.addEventListener("pointerdown", retryOnInteraction, { passive: true });
    window.addEventListener("touchstart", retryOnInteraction, { passive: true });
    window.addEventListener("keydown", retryOnInteraction);

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      window.clearTimeout(posterTimer);
      videos.forEach((video) => {
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("loadeddata", onCanPlay);
      });
      window.removeEventListener("pointerdown", retryOnInteraction);
      window.removeEventListener("touchstart", retryOnInteraction);
      window.removeEventListener("keydown", retryOnInteraction);
    };
  }, [failed, motionReduced, onReady, preferWebM, ready]);

  function reportVideoError() {
    // Falha de vídeo é falha visual, não falha da jornada.
    setFailed(true);
    setPosterOnly(false);
    if (typeof onVideoError === "function") onVideoError();
    if (typeof onError === "function") onError();
  }

  const containerStyle = {
    position: "relative",
    width: normalizeSize(size),
    height: "100%",
    borderRadius,
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 18%, rgba(247,200,98,0.16), transparent 36%), linear-gradient(180deg, rgba(4,8,15,0.98), rgba(2,6,11,1))",
    ...style,
  };

  const mediaStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius,
    pointerEvents: "none",
  };

  if (failed || motionReduced) {
    return (
      <div
        className={`orkio-video-media is-static ${className}`}
        data-orkio-video-state={motionReduced ? "reduced-motion" : "fallback-image"}
        style={containerStyle}
      >
        <img
          src={FALLBACK_IMG}
          alt="Orkio"
          loading="eager"
          decoding="async"
          style={{
            ...mediaStyle,
            position: "relative",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`orkio-video-media ${posterOnly ? "is-poster-only" : ""} ${className}`}
      data-orkio-video-state={speaking ? "speaking" : ready ? "idle" : "loading"}
      style={containerStyle}
    >
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
          ...mediaStyle,
          zIndex: 1,
          opacity: ready && speaking ? 1 : 0,
          transition: "opacity 80ms linear",
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
          ...mediaStyle,
          zIndex: 2,
          opacity: ready && !speaking ? 1 : 0,
          transition: "opacity 120ms ease",
        }}
      />

      {(!ready || posterOnly) && (
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          style={{
            ...mediaStyle,
            zIndex: 3,
          }}
        />
      )}
    </div>
  );
}
