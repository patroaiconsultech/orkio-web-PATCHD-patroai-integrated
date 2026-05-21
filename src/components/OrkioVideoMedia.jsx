import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * AO-04G — OrkioVideoMedia com runtime robusto de sincronização
 *
 * Regras fundamentais:
 * - O áudio é a fonte de verdade do estado speaking
 * - O vídeo speaking permanece em loop até que o pai diga speaking=false
 * - O vídeo NUNCA decide quando parar de falar
 * - Prioriza MP4/H.264 no source, WebM como fallback
 * - preload="auto" para ambos os vídeos
 * - Loop manual via onEnded como safety net
 * - Crossfade suave entre idle e speaking (200ms)
 *
 * Props de sincronização:
 * - syncKey: incrementado a cada nova sessão de fala (força restart do speaking)
 * - speakingStartOffset: offset em ms para antecipar o vídeo speaking (default 0)
 * - videoLeadMs: alias para speakingStartOffset (default 120)
 * - holdSpeaking: se true, mantém speaking mesmo se prop speaking mudar (safety)
 * - onVideoReady: callback quando o vídeo speaking está pronto para tocar
 * - onVideoError: callback quando o vídeo falha
 */

const IDLE_MP4 = "/patroai-assets/orkio-idle-loop.mp4";
const IDLE_WEBM = "/patroai-assets/orkio-idle-loop.webm";
const SPEAKING_MP4 = "/patroai-assets/orkio-speaking-loop.mp4";
const SPEAKING_WEBM = "/patroai-assets/orkio-speaking-loop.webm";
const POSTER = "/patroai-assets/orkio-video-poster.webp";
const FALLBACK_IMG = "/patroai-assets/orkio-mystic-tech-v1.webp";

// Retry play com backoff leve
async function safePlay(videoEl, retries = 3) {
  if (!videoEl) return false;
  for (let i = 0; i < retries; i++) {
    try {
      await videoEl.play();
      return true;
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, 50 * (i + 1)));
      }
    }
  }
  return false;
}

export default function OrkioVideoMedia({
  speaking = false,
  syncKey = 0,
  speakingStartOffset = 0,
  videoLeadMs = 120,
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
  const lastSyncKeyRef = useRef(-1);
  const isSpeakingRef = useRef(false);

  // Manter ref atualizado para uso em callbacks
  isSpeakingRef.current = speaking;

  // Garantir loop manual como safety net (caso o atributo loop falhe)
  const handleSpeakingEnded = useCallback(() => {
    const el = speakingRef.current;
    if (!el) return;
    // Se ainda estiver speaking, reiniciar o vídeo
    if (isSpeakingRef.current) {
      el.currentTime = 0;
      safePlay(el);
    }
  }, []);

  // Efeito principal de sincronização
  useEffect(() => {
    if (videoFailed) return;

    const idleEl = idleRef.current;
    const speakingEl = speakingRef.current;

    if (speaking) {
      // Transição para speaking
      if (idleEl) {
        idleEl.style.opacity = "0";
        // Não pausar imediatamente - deixar o crossfade acontecer
        setTimeout(() => {
          if (isSpeakingRef.current && idleEl) {
            idleEl.pause();
          }
        }, 220);
      }

      if (speakingEl) {
        // Se é uma nova sessão de fala (syncKey mudou), reiniciar do início
        if (syncKey !== lastSyncKeyRef.current) {
          lastSyncKeyRef.current = syncKey;
          speakingEl.currentTime = 0;
        }
        speakingEl.style.opacity = "1";
        safePlay(speakingEl).then((ok) => {
          if (ok && typeof onVideoReady === "function") {
            onVideoReady();
          }
        });
      }
    } else if (!holdSpeaking) {
      // Transição para idle
      if (speakingEl) {
        speakingEl.style.opacity = "0";
        // Pausar após crossfade
        setTimeout(() => {
          if (!isSpeakingRef.current && speakingEl) {
            speakingEl.pause();
          }
        }, 220);
      }

      if (idleEl) {
        idleEl.style.opacity = "1";
        safePlay(idleEl);
      }
    }
  }, [speaking, syncKey, videoFailed, holdSpeaking, onVideoReady]);

  // Autoplay idle no mount
  useEffect(() => {
    if (videoFailed) return;
    const idleEl = idleRef.current;
    if (idleEl && !speaking) {
      safePlay(idleEl);
    }
  }, [videoFailed]);

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
    transition: "opacity 200ms ease",
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
      {/* Idle loop — sempre presente, opacidade controlada */}
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

      {/* Speaking loop — loop attr + safety net onEnded */}
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
