import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * OrkioVideoMedia — runtime robusto para vídeo da Orkio
 *
 * AO-04E
 * - Usa um único <video> ativo por estado para evitar conflitos de autoplay/opacity.
 * - Prioriza MP4/H.264, que é o caminho mais estável em mobile e desktop.
 * - Mantém WebM como fallback.
 * - Usa autoplay real + play() programático + retry em eventos do browser.
 * - Aplica cache-buster nos assets para evitar CDN/browser servindo versão antiga.
 * - Cai para a imagem estática somente se MP4 e WebM falharem.
 */

const VIDEO_VERSION = "ao04e-20260521";

const ASSETS = {
  idle: {
    mp4: `/patroai-assets/orkio-idle-loop.mp4?v=${VIDEO_VERSION}`,
    webm: `/patroai-assets/orkio-idle-loop.webm?v=${VIDEO_VERSION}`,
  },
  speaking: {
    mp4: `/patroai-assets/orkio-speaking-loop.mp4?v=${VIDEO_VERSION}`,
    webm: `/patroai-assets/orkio-speaking-loop.webm?v=${VIDEO_VERSION}`,
  },
};

const POSTER = `/patroai-assets/orkio-video-poster.webp?v=${VIDEO_VERSION}`;
const FALLBACK_IMG = "/patroai-assets/orkio-mystic-tech-v1.webp";

const FORMATS = [
  { key: "mp4", type: "video/mp4" },
  { key: "webm", type: "video/webm" },
];

export default function OrkioVideoMedia({
  speaking = false,
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
  onError,
}) {
  const videoRef = useRef(null);
  const retryTimerRef = useRef(null);
  const [formatIndex, setFormatIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const mode = speaking ? "speaking" : "idle";
  const format = FORMATS[formatIndex] || FORMATS[0];

  const activeSource = useMemo(() => {
    return ASSETS[mode][format.key];
  }, [mode, format.key]);

  useEffect(() => {
    setReady(false);
  }, [activeSource]);

  useEffect(() => {
    if (videoFailed) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    let disposed = false;

    const safePlay = async () => {
      if (disposed || !videoRef.current) return;

      const el = videoRef.current;

      try {
        el.muted = true;
        el.defaultMuted = true;
        el.loop = true;
        el.playsInline = true;

        if (el.paused || el.readyState >= 2) {
          const playPromise = el.play();
          if (playPromise && typeof playPromise.then === "function") {
            await playPromise;
          }
        }
      } catch {
        // Alguns browsers só liberam o play após interação.
        // Mantemos o vídeo renderizado e tentamos novamente em eventos abaixo.
      }
    };

    const schedulePlay = () => {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = window.setTimeout(safePlay, 60);
    };

    schedulePlay();

    const handleVisibility = () => {
      if (!document.hidden) schedulePlay();
    };

    const handleUserGesture = () => {
      schedulePlay();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", schedulePlay);
    window.addEventListener("pointerdown", handleUserGesture, { passive: true });
    window.addEventListener("touchstart", handleUserGesture, { passive: true });

    return () => {
      disposed = true;
      window.clearTimeout(retryTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", schedulePlay);
      window.removeEventListener("pointerdown", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
    };
  }, [activeSource, videoFailed]);

  function handleLoaded() {
    setReady(true);
    const video = videoRef.current;
    if (!video) return;

    try {
      video.play().catch(() => {});
    } catch {}
  }

  function handleVideoError() {
    if (formatIndex < FORMATS.length - 1) {
      setFormatIndex((current) => current + 1);
      return;
    }

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

  const mediaStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center center",
    borderRadius,
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
      className={`orkio-video-media ${className} ${ready ? "is-ready" : "is-loading"}`}
      data-orkio-video-mode={mode}
      data-orkio-video-format={format.key}
      style={containerStyle}
    >
      <video
        key={`${mode}-${format.key}`}
        ref={videoRef}
        src={activeSource}
        style={{
          ...mediaStyle,
          opacity: ready ? 1 : 0,
          transition: "opacity 260ms ease",
        }}
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
        onLoadedData={handleLoaded}
        onCanPlay={handleLoaded}
        onPlaying={() => setReady(true)}
        onError={handleVideoError}
        aria-hidden="true"
      />

      {!ready ? (
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          style={{
            ...mediaStyle,
            opacity: 1,
          }}
          loading="eager"
          decoding="async"
        />
      ) : null}
    </div>
  );
}
