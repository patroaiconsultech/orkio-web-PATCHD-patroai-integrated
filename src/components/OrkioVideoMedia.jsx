import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * AO-04I — OrkioVideoMedia com speaking pré-aquecido.
 *
 * Regra operacional:
 * - O áudio continua sendo a fonte de verdade.
 * - O vídeo speaking fica pré-carregado e tocando mudo em segundo plano.
 * - Quando o áudio começa, o frontend só troca a opacidade idle→speaking.
 * - O vídeo nunca volta para idle antes de speaking=false enviado pelo pai.
 */

const ASSET_VERSION = "ao04i";
const IDLE_MP4 = `/patroai-assets/orkio-idle-loop.mp4?v=${ASSET_VERSION}`;
const IDLE_WEBM = `/patroai-assets/orkio-idle-loop.webm?v=${ASSET_VERSION}`;
const SPEAKING_MP4 = `/patroai-assets/orkio-speaking-loop.mp4?v=${ASSET_VERSION}`;
const SPEAKING_WEBM = `/patroai-assets/orkio-speaking-loop.webm?v=${ASSET_VERSION}`;
const POSTER = `/patroai-assets/orkio-video-poster.webp?v=${ASSET_VERSION}`;
const FALLBACK_IMG = "/patroai-assets/orkio-mystic-tech-v1.webp";

async function safePlay(videoEl, retries = 3) {
  if (!videoEl) return false;

  for (let i = 0; i < retries; i += 1) {
    try {
      videoEl.muted = true;
      videoEl.playsInline = true;
      await videoEl.play();
      return true;
    } catch {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 40 * (i + 1)));
      }
    }
  }

  return false;
}

export default function OrkioVideoMedia({
  speaking = false,
  syncKey = 0,
  holdSpeaking = false,
  onVideoReady,
  onVideoError,
  className = "",
  style = {},
  size = "100%",
  borderRadius = "28px",
}) {
  const idleRef = useRef(null);
  const speakingRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const isSpeakingRef = useRef(false);
  const didSignalReadyRef = useRef(false);

  isSpeakingRef.current = speaking;

  const handleSpeakingEnded = useCallback(() => {
    const el = speakingRef.current;
    if (!el) return;

    try {
      el.currentTime = 0;
    } catch {}

    // Se ainda estiver falando, reinicia. Se estiver idle, mantém pré-aquecido.
    safePlay(el);
  }, []);

  useEffect(() => {
    if (videoFailed) return;

    const idleEl = idleRef.current;
    const speakingEl = speakingRef.current;

    try { idleEl?.load?.(); } catch {}
    try { speakingEl?.load?.(); } catch {}

    // Os dois vídeos ficam tocando mudos. Isso remove delay no momento da fala.
    safePlay(idleEl);
    safePlay(speakingEl).then((ok) => {
      if (ok && !didSignalReadyRef.current && typeof onVideoReady === "function") {
        didSignalReadyRef.current = true;
        onVideoReady();
      }
    });
  }, [videoFailed, onVideoReady]);

  useEffect(() => {
    if (videoFailed) return;

    const idleEl = idleRef.current;
    const speakingEl = speakingRef.current;

    if (speaking) {
      if (idleEl) idleEl.style.opacity = "0";
      if (speakingEl) {
        speakingEl.style.opacity = "1";
        safePlay(speakingEl);
      }
    } else if (!holdSpeaking) {
      if (idleEl) {
        idleEl.style.opacity = "1";
        safePlay(idleEl);
      }
      if (speakingEl) {
        speakingEl.style.opacity = "0";
        // Não pausar: speaking fica aquecido para a próxima fala.
        safePlay(speakingEl);
      }
    }
  }, [speaking, syncKey, videoFailed, holdSpeaking]);

  function handleVideoError() {
    setVideoFailed(true);
    if (typeof onVideoError === "function") onVideoError();
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
    transition: "opacity 45ms linear",
    willChange: "opacity",
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
      <video
        ref={idleRef}
        style={{ ...videoStyle, opacity: speaking ? 0 : 1 }}
        poster={POSTER}
        playsInline
        muted
        loop
        preload="auto"
        onError={handleVideoError}
        aria-hidden="true"
      >
        <source src={IDLE_MP4} type="video/mp4" />
        <source src={IDLE_WEBM} type="video/webm" />
      </video>

      <video
        ref={speakingRef}
        style={{ ...videoStyle, opacity: speaking ? 1 : 0 }}
        poster={POSTER}
        playsInline
        muted
        loop
        preload="auto"
        onEnded={handleSpeakingEnded}
        onError={handleVideoError}
        aria-hidden="true"
      >
        <source src={SPEAKING_MP4} type="video/mp4" />
        <source src={SPEAKING_WEBM} type="video/webm" />
      </video>
    </div>
  );
}
