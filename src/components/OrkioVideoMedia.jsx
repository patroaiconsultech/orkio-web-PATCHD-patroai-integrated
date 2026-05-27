import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * AO-UX08B — Orkio Mindpulse Video
 *
 * Princípio UX:
 * - Orkio não faz lip-sync falso;
 * - a voz vem do runtime/TTS;
 * - o vídeo é presença mental/pulsante;
 * - quando speaking=true, aura/luz/equalizer reagem à fala;
 * - se vídeo falhar, poster/imagem preserva a experiência.
 */

const IDLE_MP4 = "/patroai-assets/orkio-mindpulse-male.mp4?v=ao-ux08f";
const IDLE_WEBM = "";
const POSTER = "";
const FALLBACK_IMG = "";

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
  syncKey = 0, // mantido por compatibilidade
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
  onError,
  onVideoError,
  onReady,
}) {
  const videoRef = useRef(null);
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

  const videoSrc = useMemo(() => (preferWebM && IDLE_WEBM ? IDLE_WEBM : IDLE_MP4), [preferWebM]);

  useEffect(() => {
    if (failed || motionReduced) return undefined;

    const video = videoRef.current;
    if (!video) return undefined;

    let cancelled = false;

    const prepareVideo = () => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-hidden", "true");
    };

    const markReady = () => {
      if (cancelled || !mountedRef.current) return;
      setReady(true);
      setPosterOnly(false);
      if (typeof onReady === "function") onReady();
    };

    const startVideo = async () => {
      try {
        prepareVideo();
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") await playPromise;
        markReady();
      } catch {
        if (!cancelled) setPosterOnly(true);
      }
    };

    const readyTimer = window.setTimeout(startVideo, 40);

    const posterTimer = window.setTimeout(() => {
      if (!cancelled && !ready) setPosterOnly(true);
    }, 1600);

    const retryOnInteraction = () => {
      if (!cancelled && !failed && !motionReduced) startVideo();
    };

    video.addEventListener("canplay", markReady);
    video.addEventListener("loadeddata", markReady);

    window.addEventListener("pointerdown", retryOnInteraction, { passive: true });
    window.addEventListener("touchstart", retryOnInteraction, { passive: true });
    window.addEventListener("keydown", retryOnInteraction);

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      window.clearTimeout(posterTimer);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("loadeddata", markReady);
      window.removeEventListener("pointerdown", retryOnInteraction);
      window.removeEventListener("touchstart", retryOnInteraction);
      window.removeEventListener("keydown", retryOnInteraction);
    };
  }, [failed, motionReduced, onReady, ready, videoSrc]);

  function reportVideoError() {
    setFailed(true);
    setPosterOnly(false);
    if (typeof onVideoError === "function") onVideoError();
    if (typeof onError === "function") onError();
  }

  const containerStyle = {
    position: "relative",
    width: normalizeSize(size),
    height: "100%",
    minHeight: "260px",
    borderRadius,
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 18%, rgba(247,200,98,0.18), transparent 36%), linear-gradient(180deg, rgba(4,8,15,0.98), rgba(2,6,11,1))",
    boxShadow: speaking
      ? "0 0 80px rgba(245,185,56,0.24), inset 0 0 80px rgba(245,185,56,0.08)"
      : "0 0 44px rgba(0,0,0,0.36)",
    transition: "box-shadow 420ms ease, filter 420ms ease",
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
    filter: speaking ? "saturate(1.08) contrast(1.04)" : "saturate(0.96) contrast(1)",
    transition: "filter 420ms ease, opacity 420ms ease",
  };

  const imgFallback = (
    <img
      src={failed || motionReduced ? FALLBACK_IMG : POSTER}
      alt=""
      aria-hidden="true"
      style={mediaStyle}
      onError={() => setFailed(false)}
    />
  );

  if (failed || motionReduced) {
    return (
      <div
        className={`orkio-mindpulse-media ${speaking ? "is-speaking" : ""} ${className}`}
        style={containerStyle}
        aria-label="Orkio — presença digital"
      >
        <style>{mindpulseCss}</style>
        {imgFallback}
        <div className="orkio-mindpulse-vignette" />
        {speaking && <MindpulseOverlay />}
      </div>
    );
  }

  return (
    <div
      className={`orkio-mindpulse-media ${speaking ? "is-speaking" : ""} ${className}`}
      style={containerStyle}
      aria-label="Orkio — presença digital"
      data-orkio-mindpulse="true"
    >
      <style>{mindpulseCss}</style>

      <video
        ref={videoRef}
        src={videoSrc}
        poster={POSTER || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={reportVideoError}
        style={mediaStyle}
      />

      {(!ready || posterOnly) && (
        <img src={POSTER} alt="" aria-hidden="true" style={{ ...mediaStyle, opacity: 0.94 }} />
      )}

      <div className="orkio-mindpulse-vignette" />
      {speaking && <MindpulseOverlay />}
    </div>
  );
}

function MindpulseOverlay() {
  return (
    <>
      <div className="orkio-mindpulse-aura" />
      <div className="orkio-mindpulse-ring ring-one" />
      <div className="orkio-mindpulse-ring ring-two" />
      <div className="orkio-mindpulse-core" />
      <div className="orkio-mindpulse-eq" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="orkio-mindpulse-caption">transmitindo presença</div>
    </>
  );
}

const mindpulseCss = `
.orkio-mindpulse-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 22%, transparent 0%, transparent 34%, rgba(0,0,0,0.34) 100%),
    linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.38));
}

.orkio-mindpulse-aura {
  position: absolute;
  inset: 8%;
  border-radius: 999px;
  pointer-events: none;
  border: 1px solid rgba(247, 200, 98, 0.22);
  box-shadow:
    0 0 38px rgba(247, 200, 98, 0.18),
    inset 0 0 42px rgba(247, 200, 98, 0.08);
  animation: orkioMindAura 2.6s ease-in-out infinite;
}

.orkio-mindpulse-ring {
  position: absolute;
  left: 50%;
  top: 44%;
  width: 42%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 1px solid rgba(247, 200, 98, 0.24);
  pointer-events: none;
  opacity: 0;
}

.orkio-mindpulse-ring.ring-one {
  animation: orkioMindRing 2.2s ease-out infinite;
}

.orkio-mindpulse-ring.ring-two {
  animation: orkioMindRing 2.2s ease-out infinite;
  animation-delay: 1.1s;
}

.orkio-mindpulse-core {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 9%;
  min-width: 34px;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255,240,180,0.86), rgba(247,200,98,0.34) 38%, transparent 72%);
  filter: blur(0.4px);
  animation: orkioMindCore 1.4s ease-in-out infinite;
}

.orkio-mindpulse-eq {
  position: absolute;
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%);
  display: flex;
  align-items: end;
  gap: 5px;
  height: 28px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(2, 6, 11, 0.42);
  border: 1px solid rgba(247, 200, 98, 0.18);
  backdrop-filter: blur(10px);
}

.orkio-mindpulse-eq span {
  display: block;
  width: 3px;
  height: 8px;
  border-radius: 999px;
  background: rgba(247, 200, 98, 0.82);
  box-shadow: 0 0 10px rgba(247, 200, 98, 0.45);
  animation: orkioMindEq 0.82s ease-in-out infinite;
}

.orkio-mindpulse-eq span:nth-child(2) { animation-delay: 0.08s; }
.orkio-mindpulse-eq span:nth-child(3) { animation-delay: 0.16s; }
.orkio-mindpulse-eq span:nth-child(4) { animation-delay: 0.24s; }
.orkio-mindpulse-eq span:nth-child(5) { animation-delay: 0.32s; }

.orkio-mindpulse-caption {
  position: absolute;
  right: 16px;
  bottom: 14px;
  max-width: calc(100% - 32px);
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 235, 180, 0.84);
  background: rgba(2, 6, 11, 0.42);
  border: 1px solid rgba(247, 200, 98, 0.16);
  backdrop-filter: blur(10px);
}

@keyframes orkioMindAura {
  0%, 100% {
    opacity: 0.48;
    transform: scale(0.985);
  }
  50% {
    opacity: 1;
    transform: scale(1.018);
  }
}

@keyframes orkioMindRing {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.68);
  }
  18% {
    opacity: 0.52;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.72);
  }
}

@keyframes orkioMindCore {
  0%, 100% {
    opacity: 0.48;
    transform: translate(-50%, -50%) scale(0.92);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.18);
  }
}

@keyframes orkioMindEq {
  0%, 100% { height: 7px; opacity: 0.52; }
  50% { height: 24px; opacity: 1; }
}
`;
