import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, uploadFile, chat, chatStream, transcribeAudio, requestFounderHandoff, getRealtimeClientSecret, startRealtimeSession, startSummitSession, postRealtimeEventsBatch, endRealtimeSession, getRealtimeSession, getSummitSessionScore, submitSummitSessionReview, downloadRealtimeAta as downloadRealtimeAtaFile, guardRealtimeTranscript, getOrionSquadHealth, getOrionSquadPreview, getAgentCapabilities } from "../ui/api.js";
import { clearSession, getTenant, getToken, getUser, isAdmin, isApproved, setSession, logout } from "../lib/auth.js";
import { ORKIO_CANONICAL_VOICE_ID, ORKIO_DEFAULT_TTS_SPEED, ORKIO_DEFAULT_VOICE_ID, ORKIO_VOICES, coerceTtsSpeed, coerceVoiceId } from "../lib/voices.js";
import TermsModal from "../ui/TermsModal.jsx";
import PWAInstallPrompt from "../components/PWAInstallPrompt.jsx";
import OnboardingModal from "../components/OnboardingModal.jsx";
import { startSessionHeartbeat } from "../lib/sessionHeartbeat.js";
import EmptyStatePremium from "../components/EmptyStatePremium.jsx";
import ExecutionTimeline from "../components/ExecutionTimeline.jsx";
import MessageBubble from "../components/chat/MessageBubble.jsx";
import RealtimeTimeboxOverlay from "../components/realtime/RealtimeTimeboxOverlay.jsx";
import RealtimeTranscriptSummary from "../components/realtime/RealtimeTranscriptSummary.jsx";

// AO68A-HF6R5_REALTIME_OPENING_STT_FOCUS — safe AppConsole patch applied

// ORKIO_AO60D_REALTIME_MOBILE_HARDENING
function buildRealtimeDiagnosticError(code, message, diagnostic = {}) {
  const err = new Error(message || "Falha ao iniciar Realtime");
  err.code = code || "REALTIME_DIAGNOSTIC_ERROR";
  err.userMessage = message || "Não consegui abrir a voz em tempo real agora.";
  err.diagnostic = diagnostic || {};
  return err;
}

function getRealtimeBrowserPreflight() {
  const result = {
    ok: true,
    online: true,
    secureContext: true,
    hasMediaDevices: true,
    hasGetUserMedia: true,
    protocol: "",
    host: "",
    reason: null,
  };

  try {
    if (typeof window !== "undefined") {
      result.secureContext = Boolean(
        window.isSecureContext ||
        window.location?.protocol === "https:" ||
        /^localhost$|^127\.0\.0\.1$/.test(window.location?.hostname || "")
      );
      result.protocol = window.location?.protocol || "";
      result.host = window.location?.host || "";
    }
  } catch {}

  try {
    if (typeof navigator !== "undefined") {
      result.online = navigator.onLine !== false;
      result.hasMediaDevices = Boolean(navigator.mediaDevices);
      result.hasGetUserMedia = Boolean(navigator.mediaDevices?.getUserMedia);
    }
  } catch {}

  if (!result.online) {
    result.ok = false;
    result.reason = "browser_offline";
  } else if (!result.secureContext) {
    result.ok = false;
    result.reason = "insecure_context";
  } else if (!result.hasMediaDevices || !result.hasGetUserMedia) {
    result.ok = false;
    result.reason = "media_devices_unavailable";
  }

  return result;
}

function realtimePreflightMessage(reason) {
  if (reason === "browser_offline") {
    return "Não consegui abrir a voz em tempo real porque o dispositivo parece estar sem conexão. O chat continua funcionando quando a internet voltar.";
  }
  if (reason === "insecure_context") {
    return "A voz em tempo real precisa de uma conexão segura HTTPS no navegador/PWA. O chat continua disponível por texto.";
  }
  if (reason === "media_devices_unavailable") {
    return "Este navegador/PWA não expôs o microfone para a voz em tempo real. Atualize o app, verifique permissões ou continue por texto.";
  }
  return "Não consegui abrir a voz em tempo real agora. O chat continua funcionando normalmente.";
}


function normalizeUserFacingRuntimeMessage(value, context = "") {
  let normalizedValue = value;
  if (value && typeof value === "object") {
    normalizedValue =
      value.userMessage ??
      value.message ??
      value.detail?.message ??
      value.detail ??
      value.code ??
      value.error ??
      value.statusText ??
      "";
    if (typeof normalizedValue === "object") {
      try { normalizedValue = JSON.stringify(normalizedValue); } catch { normalizedValue = ""; }
    }
  }
  const raw = String(normalizedValue || "").trim();
  const lower = raw.toLowerCase();
  // ORKIO_AO60C_PWA_REALTIME_DIAGNOSTIC_GUARD
  if (
    lower.includes("failed to fetch") ||
    lower.includes("network_fetch_failed") ||
    lower.includes("network request failed") ||
    lower.includes("load failed") ||
    lower.includes("networkerror") ||
    lower.includes("cors") ||
    lower.includes("typeerror: failed")
  ) {
    if (context === "voice" || context === "realtime") {
      return (
        "Não consegui abrir a voz em tempo real agora. O chat continua funcionando normalmente.\n\n" +
        "Motivo provável: a conexão de voz não foi concluída entre o PWA e a API. " +
        "Tente novamente em alguns segundos ou continue por texto."
      );
    }

    return (
      "Não consegui concluir a conexão agora. Verifique sua internet e tente novamente. " +
      "O chat continua disponível por texto."
    );
  }

  if (context === "voice" || context === "realtime") {
    if (
      lower.includes("browser_offline") ||
      lower.includes("insecure_context") ||
      lower.includes("media_devices_unavailable") ||
      lower.includes("mic_permission_denied") ||
      lower.includes("mic_get_user_media_failed") ||
      lower.includes("realtime_sdp_fetch_failed")
    ) {
      if (lower.includes("browser_offline")) {
        return "Não consegui abrir a voz em tempo real porque o dispositivo parece estar sem conexão. O chat continua funcionando normalmente quando a internet voltar.";
      }
      if (lower.includes("insecure_context")) {
        return "A voz em tempo real precisa de uma conexão segura HTTPS no navegador/PWA. O chat continua disponível por texto.";
      }
      if (lower.includes("media_devices_unavailable")) {
        return "Este navegador/PWA não liberou acesso ao microfone para a voz em tempo real. Verifique as permissões do app ou continue por texto.";
      }
      if (lower.includes("mic_permission_denied")) {
        return "O microfone está bloqueado para este PWA. Libere a permissão de microfone nas configurações do navegador/app e tente novamente.";
      }
      if (lower.includes("mic_get_user_media_failed")) {
        return "Não consegui capturar o áudio do microfone neste dispositivo. Tente novamente, revise as permissões ou continue por texto.";
      }
      if (lower.includes("realtime_sdp_fetch_failed")) {
        return "Não consegui concluir a conexão de voz em tempo real com o provedor agora. O chat continua disponível por texto.";
      }
    }
  }

  if (
    context === "voice" || context === "realtime"
  ) {
    if (
      lower.includes("rate_limited") ||
      lower.includes("status_429") ||
      lower.includes("http 429") ||
      lower.includes("realtime_cooldown_active") ||
      lower.includes("too many requests")
    ) {
      return "A voz em tempo real estará disponível novamente em alguns minutos. O chat por texto continua disponível.";
    }

    if (
      lower.includes("auth_forbidden") ||
      lower.includes("status_403") ||
      lower.includes("http 403") ||
      lower.includes("forbidden")
    ) {
      return (
        "A voz em tempo real não foi autorizada para esta sessão. " +
        "Verifique se o onboarding foi concluído e tente novamente. O chat continua disponível por texto."
      );
    }

    if (
      lower.includes("auth_session_expired") ||
      lower.includes("status_401") ||
      lower.includes("unauthorized") ||
      lower.includes("session expired")
    ) {
      return (
        "Sua sessão precisa ser atualizada antes de iniciar a voz em tempo real. " +
        "Entre novamente e tente outra vez. O chat continua disponível por texto."
      );
    }
  }

  if (!raw) {
    return context === "voice"
      ? "Não consegui acessar a voz neste momento. Você pode continuar por texto."
      : "Não consegui concluir esta ação agora.";
  }

  if (
    lower.includes("requested device not found") ||
    lower.includes("device not found") ||
    lower.includes("notfounderror") ||
    lower.includes("microphone not found") ||
    lower.includes("no input devices")
  ) {
    return "Microfone não encontrado. Verifique se há um microfone conectado e se o navegador tem permissão para usá-lo. Você também pode continuar por texto.";
  }

  if (
    lower.includes("permission denied") ||
    lower.includes("notallowederror") ||
    lower.includes("permission dismissed")
  ) {
    return "Permissão de microfone negada. Libere o acesso ao microfone no navegador ou continue por texto.";
  }

  if (
    lower.includes("realtime connection failed") ||
    lower.includes("realtime connection disconnected") ||
    lower.includes("pc_failed")
  ) {
    return "A conexão de voz oscilou. A conversa por texto segue disponível normalmente.";
  }

  if (lower.includes("onboarding incomplete") || lower.includes("cadastro complementar pendente")) {
    return "Seu cadastro complementar precisa ser concluído para liberar este recurso. Se você acabou de salvar o contexto, abra uma nova conversa ou tente novamente em instantes.";
  }

  if (lower === "[object object]") {
    return "Não consegui concluir esta ação agora. Tente novamente em instantes.";
  }

  return raw;
}

function humanizeConsoleStatusMessage(value) {
  return normalizeUserFacingRuntimeMessage(value);
}


// ORKIO_UI_SAFE_TRACE_OBJECT_NORMALIZATION_FINAL
// Normaliza valores antes de entrarem no executionTrace.
// Evita que objetos JS apareçam como "[object Object]" no painel "Ver execução".
function safeTraceText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw || raw === "[object Object]") return fallback;
    return raw;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const joined = value
      .map((item) => safeTraceText(item, ""))
      .filter(Boolean)
      .join(", ");
    return joined || fallback;
  }

  if (typeof value === "object") {
    const preferred =
      value.label ??
      value.message ??
      value.status ??
      value.reason ??
      value.detail ??
      value.name ??
      value.code ??
      value.event ??
      value.step ??
      value.type;

    if (preferred !== undefined) {
      return safeTraceText(preferred, fallback);
    }

    try {
      const compact = JSON.stringify(value);
      if (compact && compact !== "{}") {
        return compact.length > 220 ? `${compact.slice(0, 217)}...` : compact;
      }
    } catch {}
  }
  return fallback;
}

function safeTraceBadges(badges) {
  if (!Array.isArray(badges)) return [];
  return badges.map((badge) => safeTraceText(badge, "")).filter(Boolean);
}

function sanitizeExecutionTraceStep(step) {
  const source = step && typeof step === "object" ? step : {};

  return {
    ...source,
    kind: safeTraceText(source.kind, "status"),
    label: safeTraceText(source.label, "Etapa registrada"),
    detail: safeTraceText(source.detail, ""),
    agentName: safeTraceText(source.agentName, ""),
    badges: safeTraceBadges(source.badges),
    source: safeTraceText(source.source, ""),
  };
}


// ORKIO_WHATSAPP_CTA_PREMIUM
// Transforma links WhatsApp enviados pelo backend em um CTA visual premium,
// sem alterar o conteúdo semântico da resposta do agente.
function normalizeExternalHref(rawUrl = "") {
  let url = String(rawUrl || "").trim();
  let trailing = "";

  while (/[),.;!?]+$/.test(url)) {
    trailing = `${url.slice(-1)}${trailing}`;
    url = url.slice(0, -1);
  }

  const href = url.toLowerCase().startsWith("www.") ? `https://${url}` : url;
  return { href, displayUrl: url, trailing };
}

function isWhatsappUrl(rawUrl = "") {
  const url = String(rawUrl || "").trim().toLowerCase();
  return (
    url.includes("wa.me/") ||
    url.includes("api.whatsapp.com/send") ||
    url.includes("whatsapp.com/send")
  );
}

function renderWhatsappCtaCard(href, key) {
  const safeHref = href || "https://wa.me/5551989697605";

  return (
    <div
      key={key}
      style={{
        marginTop: 14,
        marginBottom: 8,
        padding: "14px",
        borderRadius: "18px",
        border: "1px solid rgba(52,211,153,0.34)",
        background:
          "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(15,23,42,0.34))",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
        whiteSpace: "normal",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: 950,
          color: "#d1fae5",
          letterSpacing: "0.2px",
          marginBottom: 6,
        }}
      >
        Quer transformar isso em projeto real?
      </div>

      <div
        style={{
          fontSize: "12px",
          lineHeight: 1.45,
          color: "rgba(236,253,245,0.86)",
          marginBottom: 12,
        }}
      >
        Nossa equipe pode mapear sua demanda e desenhar os agentes personalizados ideais para sua empresa.
      </div>

      <a
        href={safeHref}
        target="_blank"
        rel="noreferrer noopener"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          textDecoration: "none",
          borderRadius: "999px",
          padding: "10px 14px",
          background: "linear-gradient(135deg, #22c55e, #14b8a6)",
          color: "#04111d",
          fontSize: "13px",
          fontWeight: 950,
          boxShadow: "0 12px 28px rgba(20,184,166,0.24)",
        }}
      >
        💬 Falar com a equipe no WhatsApp
      </a>

      <div
        style={{
          marginTop: 9,
          fontSize: "11px",
          color: "rgba(209,250,229,0.62)",
          fontWeight: 700,
        }}
      >
        Atendimento humano • ORKIO/PATROAI
      </div>
    </div>
  );
}

function renderMessageContentPremium(value) {
  const text = String(value || "");
  if (!text) return "";

  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
  const nodes = [];
  let lastIndex = 0;
  let matchIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const rawUrl = match[0];
    const before = text.slice(lastIndex, match.index);
    if (before) nodes.push(before);

    const { href, displayUrl, trailing } = normalizeExternalHref(rawUrl);

    if (isWhatsappUrl(href)) {
      nodes.push(renderWhatsappCtaCard(href, `whatsapp-cta-${match.index}-${matchIndex}`));
    } else {
      nodes.push(
        <a