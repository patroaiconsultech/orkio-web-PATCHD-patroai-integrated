import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * OrkioVideoMedia — runtime sincronizado de vídeo da Orkio
 *
 * AO-04F
 * - Mantém idle e speaking pré-carregados ao mesmo tempo.
 * - Evita delay de troca causado por alterar src no momento da fala.
 * - Reinicia o vídeo speaking em um ponto calibrável sempre que uma nova fala começa.
 * - Prioriza MP4/H.264 e mantém WebM como fallback.
 * - Usa autoplay nativo + play() programático + retry em eventos do browser.
 * - Cai para imagem estática se os vídeos falharem.
 */

const VIDEO_VERSION = "ao04f-20260521";

const IDLE_MP4 = `/patroai-assets/orkio-idle-loop.mp4?v=${VIDEO_VERSION}`;
const IDLE_WEBM = `/patroai-assets/orkio-idle-loop.webm?v=${VIDEO_VERSION}`;
const SPEAKING_MP4 = `/patroai-assets/orkio-speaking-loop.mp4?v=${VIDEO_VERSION}`;
const SPEAKING_WEBM = `/patroai-assets/orkio-speaking-loop.webm?v=${VIDEO_VERSION}`;
const POSTER = `/patroai-assets/orkio-video-poster.webp?v=${VIDEO_VERSION}`;
const FALLBACK_IMG = "/patroai-assets/orkio-mystic-tech-v1.webp";

function setVideoTime(video, time) {
  if (!video || !Number.isFinite(time) || time < 0) return;

  try {
    const duration = Number(video.duration);
    const safeTime = Number.isFinite(duration) && duration > 0
      ? Math.min(time, Math.max(0, duration - 0.12))
      : time;

    video.currentTime = safeTime;
  } catch {
    // Alguns browsers recusam seek antes de loadedmetadata. Tentamos de novo no evento.
  }
}

function forceVideoFlags(video) {
  if (!video) return;

  try {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
  } catch {}
}

function playVideo(video) {
  if (!video) return;

  forceVideoFlags(video);

  try {
    if (video.readyState === 0) video.load?.();
  } catch {}

  try {
    const playPromise = video.play?.();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } catch {}
}

export default function OrkioVideoMedia({
  speaking = false,
  speakingSyncKey = 0,
  speakingStartOffset = 0.18,
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
  onError,
}) {
  const idleRef = useRef(null);
  const speakingRef = useRef(null);
  const retryTimerRef = useRef(null);
  const pauseTimerRef = useRef(null);
  const lastSpeakingKeyRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [idleReady, setIdleReady] = useState(false);
  const [speakingReady, setSpeakingReady] = useState(false);

  const hasAnyReady = idleReady || speakingReady;

  const clearTimers = useCallback(() => {
    if (typeof window === "undefined") return;
    window.clearTimeout(retryTimerRef.current);
    window.clearTimeout(pauseTimerRef.current);
  }, []);

  const primeVideos = useCallback(() => {
    if (videoFailed) return;

    const idle = idleRef.current;
    const talking = speakingRef.current;

    if (idle) {
      forceVideoFlags(idle);
      if (!speaking) playVideo(idle);
      try { idle.preload = "auto"; idle.load?.(); } catch {}
    }

    if (talking) {
      forceVideoFlags(talking);
      try { talking.preload = "auto"; talking.load?.(); } catch {}
    }
  }, [speaking, videoFailed]);

  useEffect(() => {
    if (videoFailed || typeof window === "undefined") return undefined;

    primeVideos();

    const schedulePrime = () => {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = window.setTimeout(primeVideos, 80);
    };

    const handleVisibility = () => {
      if (!document.hidden) schedulePrime();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", schedulePrime);
    window.addEventListener("pointerdown", schedulePrime, { passive: true });
    window.addEventListener("touchstart", schedulePrime, { passive: true });

    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", schedulePrime);
      window.removeEventListener("pointerdown", schedulePrime);
      window.removeEventListener("touchstart", schedulePrime);
    };
  }, [clearTimers, primeVideos, videoFailed]);

  useEffect(() => {
    if (videoFailed || typeof window === "undefined") return;

    const idle = idleRef.current;
    const talking = speakingRef.current;

    window.clearTimeout(pauseTimerRef.current);

    if (speaking) {
      if (talking) {
        const isNewSpeech = lastSpeakingKeyRef.current !== speakingSyncKey;
        lastSpeakingKeyRef.current = speakingSyncKey;

        talking.style.opacity = "1";
        talking.style.zIndex = "2";

        if (isNewSpeech) {
          const applyOffset = () => setVideoTime(talking, speakingStartOffset);
          applyOffset();
          talking.addEventListener("loadedmetadata", applyOffset, { once: true });
        }

        playVideo(talking);
      }

      if (idle) {
        idle.style.opacity = "0";
        idle.style.zIndex = "1";
        // Mantém o idle vivo por um instante para evitar flash preto na troca.
        pauseTimerRef.current = window.setTimeout(() => {
          try { idle.pause?.(); } catch {}
        }, 180);
      }

      return;
    }

    if (idle) {
      idle.style.opacity = "1";
      idle.style.zIndex = "2";
      playVideo(idle);
    }

    if (talking) {
      talking.style.opacity = "0";
      talking.style.zIndex = "1";
      pauseTimerRef.current = window.setTimeout(() => {
        try { talking.pause?.(); } catch {}
        setVideoTime(talking, speakingStartOffset);
      }, 180);
    }
  }, [speaking, speakingSyncKey, speakingStartOffset, videoFailed]);

  function handleAnyError() {
    setVideoFailed(true);
    if (typeof onError === "function") onError();
  }

  function markReady(kind) {
    if (kind === "idle") setIdleReady(true);
    if (kind === "speaking") setSpeakingReady(true);

    const video = kind === "idle" ? idleRef.current : speakingRef.current;
    if (video) playVideo(video);
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

  const mediaStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
    borderRadius,
    transition: "opacity 90ms linear",
    willChange: "opacity",
  };

  if (videoFailed) {
    return (
      <div className={`orkio-video-media ${className}`} style={containerStyle}>
        <img
          src={FALLBACK_IMG}
          alt="Orkio"
          style={mediaStyle}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className={`orkio-video-media ${className} ${hasAnyReady ? "is-ready" : "is-loading"}`}
      data-orkio-video-mode={speaking ? "speaking" : "idle"}
      data-orkio-speaking-sync-key={speakingSyncKey}
      style={containerStyle}
    >
      <video
        ref={idleRef}
        style={{ ...mediaStyle, opacity: speaking ? 0 : 1, zIndex: speaking ? 1 : 2 }}
        poster={POSTER}
        autoPlay
        muted
        defaultMuted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        onLoadedData={() => markReady("idle")}
        onCanPlay={() => markReady("idle")}
        onPlaying={() => setIdleReady(true)}
        onError={handleAnyError}
        aria-hidden="true"
      >
        <source src={IDLE_MP4} type="video/mp4" />
        <source src={IDLE_WEBM} type="video/webm" />
      </video>

      <video
        ref={speakingRef}
        style={{ ...mediaStyle, opacity: speaking ? 1 : 0, zIndex: speaking ? 2 : 1 }}
        poster={POSTER}
        autoPlay
        muted
        defaultMuted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        controlsList="nodownload noplaybackrate noremoteplayback"
        onLoadedMetadata={(event) => setVideoTime(event.currentTarget, speakingStartOffset)}
        onLoadedData={() => markReady("speaking")}
        onCanPlay={() => markReady("speaking")}
        onPlaying={() => setSpeakingReady(true)}
        onError={handleAnyError}
        aria-hidden="true"
      >
        <source src={SPEAKING_MP4} type="video/mp4" />
        <source src={SPEAKING_WEBM} type="video/webm" />
      </video>

      {!hasAnyReady ? (
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          style={{
            ...mediaStyle,
            opacity: 1,
            zIndex: 3,
          }}
          loading="eager"
          decoding="async"
        />
      ) : null}
    </div>
  );
}
