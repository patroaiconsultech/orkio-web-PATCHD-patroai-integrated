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
          key={`link-${match.index}-${matchIndex}`}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            color: "#93c5fd",
            fontWeight: 800,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            overflowWrap: "anywhere",
          }}
        >
          {displayUrl}
        </a>
      );
    }

    if (trailing) nodes.push(trailing);
    lastIndex = match.index + rawUrl.length;
    matchIndex += 1;
  }

  const after = text.slice(lastIndex);
  if (after) nodes.push(after);

  return nodes.length ? nodes : text;
}



const ORKIO_ENV = (typeof window !== "undefined" && window.__ORKIO_ENV__) ? window.__ORKIO_ENV__ : {};
const SUMMIT_VOICE_MODE = ((ORKIO_ENV.VITE_SUMMIT_VOICE_MODE || import.meta.env.VITE_SUMMIT_VOICE_MODE || "realtime").trim().toLowerCase() === "stt_tts")
  ? "stt_tts"
  : "realtime";
const SPEECH_RECOGNITION_LANG = ((ORKIO_ENV.VITE_SPEECH_RECOGNITION_LANG || import.meta.env.VITE_SPEECH_RECOGNITION_LANG || "pt-BR").trim() || "pt-BR");


// METATRON_CHAT_FORCE_STREAM_AND_TIMEOUT
// Auditoria 16/05: o stream estava sendo abortado cedo demais pelo connect timeout
// de 15s. Mantemos /api/chat/stream como rail primário e ampliamos a janela de
// conexão/turno para permitir respostas multiagente sem cancelar prematuramente.
// METATRON_PLATFORM_RECOVERY_HARD_STREAM
// Recuperação operacional 17/05:
// O runtime/env estava conseguindo desligar o stream e empurrar o chat direto
// para /api/chat, caminho que fica preso em preflight/provisional headers.
// Para restabelecer a plataforma, o chat textual SEMPRE tenta /api/chat/stream
// como trilho primário. O env não pode desativar esse trilho.
const ORKIO_CHAT_STREAM_PRIMARY = true;
const CHAT_STREAM_TIMEOUT_MS = Math.max(
  30000,
  Number(ORKIO_ENV.VITE_CHAT_STREAM_TIMEOUT_MS || import.meta.env.VITE_CHAT_STREAM_TIMEOUT_MS || 120000) || 120000
);
const CHAT_STREAM_NO_USEFUL_CHUNK_TIMEOUT_MS = Math.max(
  10000,
  Math.min(
    60000,
    Number(
      ORKIO_ENV.VITE_CHAT_STREAM_NO_USEFUL_CHUNK_TIMEOUT_MS ||
        import.meta.env.VITE_CHAT_STREAM_NO_USEFUL_CHUNK_TIMEOUT_MS ||
        25000
    ) || 25000
  )
);
// AO20K-HF4G_FRONTEND_STREAM_TERMINAL_GUARD
// Se o backend mantiver o SSE vivo apenas com keepalive/status, a UI não deve
// permanecer em "runtime" indefinidamente. O consumidor encerra com fallback
// seguro quando não vê chunk útil dentro da janela acima.

const CHAT_STREAM_CONNECT_TIMEOUT_MS = Math.max(
  30000,
  Number(ORKIO_ENV.VITE_CHAT_STREAM_CONNECT_TIMEOUT_MS || import.meta.env.VITE_CHAT_STREAM_CONNECT_TIMEOUT_MS || 90000) || 90000
);
const CHAT_TURN_RECONCILE_ATTEMPTS = Math.max(
  1,
  Number(ORKIO_ENV.VITE_CHAT_TURN_RECONCILE_ATTEMPTS || import.meta.env.VITE_CHAT_TURN_RECONCILE_ATTEMPTS || 2) || 2
);

// METATRON_CHAT_RECOVERY_DIRECT_FALLBACK
// Recuperação operacional 17/05:
// /api/chat/stream permanece como rail primário, mas o fallback /api/chat volta a ficar
// habilitado para restaurar a plataforma quando o SSE não estabilizar.
// O fallback segue com AbortController + timeout para não travar a UI.
// METATRON_PLATFORM_RECOVERY_HARD_STREAM
// /api/chat direto está comprovadamente instável neste deploy: preflight 200,
// POST pendente/provisional headers. Mantemos o fallback DESLIGADO por padrão
// para não trocar um erro de stream por um travamento indefinido.
// Só habilite com VITE_CHAT_DIRECT_FALLBACK_ENABLED=true após o POST /api/chat
// aparecer como 200 nos logs da API.
const ORKIO_CHAT_DIRECT_FALLBACK_ENABLED = (
  String(ORKIO_ENV.VITE_CHAT_DIRECT_FALLBACK_ENABLED || import.meta.env.VITE_CHAT_DIRECT_FALLBACK_ENABLED || "false")
    .trim()
    .toLowerCase() === "true"
);

const WALLET_UI_ENABLED = false;

const EMPTY_STATE_PREVIEW_STEPS = [
  { title: "Readiness", description: "Shell preservado, acessos visíveis e console pronto para a primeira ação com percepção premium." },
  { title: "Focus", description: "O centro da experiência destaca a próxima melhor ação sem esconder threads, wallet e navegação." },
  { title: "Activation", description: "A primeira execução nasce com prompts guiados, contexto e leitura de impacto imediato." },
  { title: "Executive output", description: "Timeline, telemetria e resposta final mantêm linguagem mais madura e decisiva." },
];

const EMPTY_STATE_PREVIEW_LOGS = [
  "Primeira vitória visível no centro do console.",
  "Prompt guiado, blueprint e próximos passos acessíveis no primeiro clique.",
  "Sidebar, usuário e navegação continuam intactos.",
  "Leitura premium reforçada por contraste, profundidade e hierarquia.",
];

class StreamSemanticError extends Error {
  constructor(payload = {}) {
    super(payload?.message || payload?.error || "Stream semantic error");
    this.name = "StreamSemanticError";
    this.payload = payload || {};
    this.status = payload?.code || "STREAM_ERROR";
  }
}

function withTimeout(promise, ms, label = "timeout") {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(label);
      err.code = "STREAM_TIMEOUT";
      reject(err);
    }, Math.max(1000, Number(ms || 0)));
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function isAbortLikeError(err) {
  return err?.name === "AbortError" ||
    err?.code === "CHAT_STREAM_ABORTED" ||
    err?.code === "STREAM_TIMEOUT" ||
    err?.code === "CHAT_STREAM_TIMEOUT" ||
    err?.code === "FETCH_ABORTED" ||
    err?.code === "CHAT_DIRECT_TIMEOUT";
}



async function consumeChatStream(
  response,
  {
    onStatus,
    onError,
    onDone,
    onChunk,
    onAgentDone,
    onKeepalive,
    onExecution,
    signal,
    isStale,
  } = {}
) {
  const reader = response?.body?.getReader?.();
  if (!reader) return { thread_id: null, trace_id: null, event_count: 0, used_stream: false };

  const abortStream = () => {
    try { reader.cancel?.(); } catch {}
    const err = new Error("CHAT_STREAM_ABORTED");
    err.name = "AbortError";
    err.code = "CHAT_STREAM_ABORTED";
    throw err;
  };

  const decoder = new TextDecoder();
  let buf = "";
  let lastThreadId = null;
  let lastTraceId = null;
  let eventCount = 0;
  let donePayload = null;
  let draftText = "";
  let doneSeen = false;
  const streamStartedAt = Date.now();
  let lastStreamActivityAt = streamStartedAt;
  let firstUsefulChunkAt = null;

  const markStreamActivity = () => {
    lastStreamActivityAt = Date.now();
  };

  const buildStreamTerminalError = (code, message) => {
    const err = new Error(message || code);
    err.code = code;
    err.thread_id = lastThreadId;
    err.trace_id = lastTraceId;
    err.draftText = draftText;
    return err;
  };

  // AO-24_STREAM_KEEPALIVE_PROGRESS_GUARD
  // status/keepalive SSE events mean the backend is alive and still processing.
  // Do not kill a live stream just because the first useful chunk is slower.
  // Keep the terminal guard only for true stream silence/inactivity.
  const assertStreamActivityProgress = () => {
    if (doneSeen || firstUsefulChunkAt) return;

    const silentFor = Date.now() - lastStreamActivityAt;
    const maxSilentMs = Math.max(CHAT_STREAM_NO_USEFUL_CHUNK_TIMEOUT_MS, 45000);

    if (silentFor > maxSilentMs) {
      throw buildStreamTerminalError(
        "CHAT_STREAM_NO_ACTIVITY_TIMEOUT",
        "CHAT_STREAM_NO_ACTIVITY_TIMEOUT"
      );
    }
  };

  const flushBlock = (block) => {
    const lines = String(block || "").split(/\r?\n/).filter(Boolean);
    if (!lines.length) return;
    let ev = "message";
    const dataLines = [];
    for (const line of lines) {
      if (line.startsWith("event:")) ev = line.slice(6).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
    }
    let payload = {};
    if (dataLines.length) {
      try { payload = JSON.parse(dataLines.join("\n")); } catch { payload = { raw: dataLines.join("\n") }; }
    }
    try {
      console.log("SSE_EVENT", ev, payload);
    } catch {}
    if (signal?.aborted || isStale?.()) abortStream();
    markStreamActivity();
    if (payload?.thread_id) lastThreadId = payload.thread_id;
    if (payload?.trace_id) lastTraceId = payload.trace_id;
    eventCount += 1;
    if (ev === "status") {
      onStatus?.(payload);
      assertStreamActivityProgress();
    }
    if (ev === "execution") onExecution?.(payload);
    if (ev === "agent_started" || ev === "orchestrator_merge") {
      onExecution?.({ ...(payload || {}), event: ev, step: ev });
    }
    if (ev === "agent_chunk") {
      const delta = String(payload?.delta ?? payload?.content ?? payload?.text ?? "");
      if (delta) {
        draftText += delta;
        firstUsefulChunkAt = firstUsefulChunkAt || Date.now();
      }
      onChunk?.(payload, draftText);
      onExecution?.({ ...(payload || {}), event: ev, step: ev });
    }
    if (ev === "chunk") {
      const delta = String(payload?.delta ?? payload?.content ?? "");
      if (delta) {
        draftText += delta;
        firstUsefulChunkAt = firstUsefulChunkAt || Date.now();
      }
      onChunk?.(payload, draftText);
    }
    if (ev === "agent_done") onAgentDone?.(payload, draftText);
    if (ev === "keepalive") {
      onKeepalive?.(payload);
      assertStreamActivityProgress();
    }
    if (ev === "error") {
      onError?.(payload);

      // METATRON_CHAT_STREAM_TERMINAL_GUARD_CLIENT
      // O backend pode emitir um erro operacional recuperável e, em seguida,
      // enviar chunk/agent_done/done para liberar a UI com mensagem segura.
      // Não devemos abortar o parser nesses códigos; devemos continuar lendo
      // até o event: done.
      const recoverableCodes = new Set([
        "CHAT_STREAM_TERMINAL_TIMEOUT",
        "CHAT_STREAM_RUNTIME_TIMEOUT",
        "CHAT_STREAM_BACKEND_TIMEOUT",
        "CHAT_STREAM_RECOVERY_DONE",
        "CHAT_STREAM_RECOVERY_SHIM_FAILED",
        "CHAT_STREAM_FATAL",
        "STREAM_RECOVERED_WITH_OPERATIONAL_MESSAGE",
      ]);

      const agentScopedRecoverableError = !!payload?.agent_id && payload?.code !== "SERVER_BUSY";
      const terminalRecoverableError = recoverableCodes.has(String(payload?.code || ""));

      if (!agentScopedRecoverableError && !terminalRecoverableError) {
        throw new StreamSemanticError(payload);
      }
    }
    if (ev === "done") {
      donePayload = payload || {};
      onDone?.(payload);
      doneSeen = true;
      try { reader.cancel?.(); } catch {}
      return;
    }
  };

  while (true) {
    if (signal?.aborted || isStale?.()) abortStream();
    const { value, done } = await reader.read();
    if (signal?.aborted || isStale?.()) abortStream();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split(/\r?\n\r?\n/);
    buf = parts.pop() || "";
    for (const part of parts) {
      flushBlock(part);
      if (doneSeen) break;
    }
    if (doneSeen) break;
  }
  if (!doneSeen && buf.trim()) flushBlock(buf);
  if (!doneSeen) {
    throw buildStreamTerminalError(
      "CHAT_STREAM_ENDED_WITHOUT_DONE",
      "CHAT_STREAM_ENDED_WITHOUT_DONE"
    );
  }
  return {
    thread_id: donePayload?.thread_id || lastThreadId,
    trace_id: donePayload?.trace_id || lastTraceId,
    event_count: eventCount,
    used_stream: true,
    runtime_hints: donePayload?.runtime_hints || null,
    execution_cursor: donePayload?.runtime_hints?.routing?.execution_cursor || null,
    execution_lifecycle: donePayload?.runtime_hints?.routing?.execution_lifecycle || null,
    routing_source: donePayload?.runtime_hints?.routing?.routing_source || null,
    route_applied: !!donePayload?.runtime_hints?.routing?.route_applied,
    done_payload: donePayload,
    draft_text: draftText,
  };
}

const REALTIME_IDLE_FOLLOWUP_ENABLED = ((ORKIO_ENV.VITE_REALTIME_IDLE_FOLLOWUP_ENABLED || import.meta.env.VITE_REALTIME_IDLE_FOLLOWUP_ENABLED || "true").toString().trim().toLowerCase() !== "false");
const REALTIME_IDLE_FOLLOWUP_MS = Math.max(5000, Number(ORKIO_ENV.VITE_REALTIME_IDLE_FOLLOWUP_MS || import.meta.env.VITE_REALTIME_IDLE_FOLLOWUP_MS || 10000) || 10000);
const REALTIME_REARM_AFTER_ASSISTANT_MS = Math.max(800, Number(ORKIO_ENV.VITE_REALTIME_RESTART_AFTER_TTS_MS || import.meta.env.VITE_REALTIME_RESTART_AFTER_TTS_MS || 1800) || 1800);

const REALTIME_AUTO_RESPONSE_ENABLED = ((ORKIO_ENV.VITE_REALTIME_AUTO_RESPONSE_ENABLED || import.meta.env.VITE_REALTIME_AUTO_RESPONSE_ENABLED || "true").toString().trim().toLowerCase() !== "false");

// AO68A-HF6R5 — AMCHAM realtime VAD defaults.
// Goal: less noise-triggered topic drift and fewer early phrase cuts in PT/EN.
const REALTIME_SERVER_VAD_THRESHOLD = Math.min(
  0.95,
  Math.max(
    0.1,
    Number(
      ORKIO_ENV.VITE_REALTIME_VAD_THRESHOLD ||
        import.meta.env.VITE_REALTIME_VAD_THRESHOLD ||
        0.72
    ) || 0.72
  )
);
const REALTIME_SERVER_VAD_SILENCE_MS = Math.max(
  250,
  Number(
    ORKIO_ENV.VITE_REALTIME_VAD_SILENCE_MS ||
      import.meta.env.VITE_REALTIME_VAD_SILENCE_MS ||
      1800
  ) || 1800
);
const REALTIME_SERVER_VAD_PREFIX_MS = Math.max(
  0,
  Number(
    ORKIO_ENV.VITE_REALTIME_VAD_PREFIX_PADDING_MS ||
      ORKIO_ENV.VITE_REALTIME_VAD_HOLD_MS ||
      import.meta.env.VITE_REALTIME_VAD_PREFIX_PADDING_MS ||
      import.meta.env.VITE_REALTIME_VAD_HOLD_MS ||
      500
  ) || 500
);

function resolveRealtimeIdleDisplayName(userObj) {
  const raw = (userObj?.name || userObj?.full_name || "").toString().trim();
  if (!raw) return "";
  const first = raw.split(/\s+/).filter(Boolean)[0] || raw;
  return first.replace(/[^\p{L}\p{N}]/gu, "") || "";
}


function normalizeAgentVoiceId(raw, fallback = ORKIO_DEFAULT_VOICE_ID) {
  const voice = String(raw || "").trim().toLowerCase();
  const aliases = {
    marine: "marin",
    marin: "marin",
    nova: "shimmer",
    onyx: "echo",
    fable: "sage",
  };
  const valid = new Set(["alloy","ash","ballad","cedar","coral","echo","fable","marin","nova","onyx","sage","shimmer","verse"]);
  const normalized = aliases[voice] || voice;
  return valid.has(normalized) ? normalized : (String(fallback || ORKIO_DEFAULT_VOICE_ID).trim().toLowerCase() || ORKIO_DEFAULT_VOICE_ID);
}


function extractPatchGovernanceMeta(content) {
  const text = String(content || "");
  if (!/PATCH GOVERNANCE RESPONSE/i.test(text)) return null;
  const get = (name) => {
    const m = text.match(new RegExp(`^\\s*${name}\\s*:\\s*([^\\n]+)`, "im"));
    return m ? String(m[1] || "").trim() : "";
  };
  const auditReceiptId = get("audit_receipt_id");
  const patchMode = get("patch_mode");
  const writeAllowed = get("write_allowed");
  return {
    audit_receipt_id: auditReceiptId,
    patch_mode: patchMode,
    write_allowed: writeAllowed,
    can_approve: Boolean(auditReceiptId && /proposal_only/i.test(patchMode) && /false/i.test(writeAllowed)),
  };
}


function extractPatchApprovalMeta(content) {
  const text = String(content || "");
  const isApprovalResponse = /PATCH APPROVAL RESPONSE/i.test(text);
  const isGovernedExecutionResponse = /GOVERNED PATCH EXECUTION RESPONSE|PATCH EXECUTION RESPONSE/i.test(text);
  if (!isApprovalResponse && !isGovernedExecutionResponse) return null;
  const get = (name) => {
    const m = text.match(new RegExp(`^\\s*-?\\s*${name}\\s*:\\s*([^\\n]+)`, "im"));
    return m ? String(m[1] || "").trim() : "";
  };

  const status = get("status");
  const auditReceiptId = get("audit_receipt_id");
  const patchMode = get("patch_mode");
  const writeAllowed = get("write_allowed");
  const humanApproved = get("human_approved");
  const approvalId = get("approval_id");
  const patchId = get("patch_id");
  const executionChannel = get("execution_channel");

  const terminalExecution = /execution_completed|execution_failed|execution_cancelled|execution_blocked_no_executable_artifact|execution_blocked_executor_not_wired|execution_request_failed|execution_blocked_missing_approval|execution_blocked_invalid_context/i.test(status);
  const approvedPending =
    /approval_registered/i.test(status) ||
    /execution_blocked_conversational_channel/i.test(status) ||
    /side_channel_required/i.test(executionChannel) ||
    (/approved_apply/i.test(patchMode) && /true/i.test(humanApproved) && !terminalExecution);
  return {
    status,
    audit_receipt_id: auditReceiptId,
    approval_id: approvalId,
    patch_id: patchId,
    patch_mode: patchMode,
    write_allowed: writeAllowed,
    human_approved: humanApproved,
    execution_channel: executionChannel,
    can_execute: Boolean(approvedPending && /approved_apply/i.test(patchMode) && /true/i.test(humanApproved) && !terminalExecution),
  };
}

function findPendingApprovedPatchExecution(items) {
  const arr = Array.isArray(items) ? items : [];
  let latestApproval = null;
  let latestTerminal = null;
  let latestProposal = null;

  for (const m of arr) {
    const content = String(m?.content || "");
    const ts = Number(m?.created_at || 0) || 0;
    const id = String(m?.id || "");
    const key = `${ts}:${id}`;

    // PATCH23: any newer proposal supersedes previous approval/execution state.
    // Without this, an old approved_apply message can keep rendering an execution
    // button for a stale patch_id/audit_receipt_id after a new proposal appears.
    const isProposal =
      /PATCH GOVERNANCE RESPONSE/i.test(content) &&
      /patch_mode\s*:\s*proposal_only/i.test(content);
    if (isProposal) {
      const auditMatch = content.match(/^\s*audit_receipt_id\s*:\s*([^\n]+)/im);
      latestProposal = {
        message: m,
        key,
        audit_receipt_id: auditMatch ? String(auditMatch[1] || "").trim() : "",
      };
    }

    const approval = extractPatchApprovalMeta(content);
    if (approval?.can_execute) {
      latestApproval = { message: m, meta: approval, key };
    }

    // A conversational-channel block is NOT a terminal execution result.
    // It only tells the user to use the governed side-channel button.
    // Keep the approved execution pending so the "Executar patch aprovado" button remains visible.
    const isExecutionResponse = /GOVERNED PATCH EXECUTION RESPONSE|PATCH EXECUTION RESPONSE/i.test(content);
    const isConversationalBlock = /execution_blocked_conversational_channel/i.test(content);
    const isRealTerminalExecution =
      /execution_completed|execution_failed|execution_cancelled|execution_blocked_no_executable_artifact|execution_blocked_executor_not_wired|execution_request_failed|execution_blocked_missing_approval|execution_blocked_invalid_context/i.test(content);

    if (isExecutionResponse && isRealTerminalExecution && !isConversationalBlock) {
      latestTerminal = { message: m, key };
    }
  }

  if (!latestApproval) return null;

  // A newer proposal invalidates old approved-apply UI state.
  if (latestProposal && String(latestProposal.key) > String(latestApproval.key)) {
    return null;
  }

  if (latestTerminal && String(latestTerminal.key) > String(latestApproval.key)) return null;
  return latestApproval;
}

function buildPendingExecutionGuidance() {
  return [
    "GOVERNED PATCH EXECUTION RESPONSE",
    "",
    "- status: execution_blocked_conversational_channel",
    "- patch_mode: approved_apply",
    "- write_allowed: false",
    "- human_approved: true",
    "",
    "Resultado:",
    "Existe uma execução governada aprovada aguardando ação, mas o chat comum não executa patches.",
    "Use exclusivamente o botão “Executar patch aprovado”.",
    "Nenhuma escrita, branch, commit ou PR foi executado por esta mensagem.",
  ].join("\n");
}

function resolveAgentVoice(agentLike) {
  const name = String(agentLike?.agent_name || agentLike?.name || "").trim().toLowerCase();
  const dbVoice = String(agentLike?.voice_id || "").trim();
  const envMap = {
    orkio: (window.__ORKIO_ENV__?.VITE_ORKIO_VOICE_ID || import.meta.env.VITE_ORKIO_VOICE_ID || "").trim(),
    chris: (window.__ORKIO_ENV__?.VITE_CHRIS_VOICE_ID || import.meta.env.VITE_CHRIS_VOICE_ID || "").trim(),
    orion: (window.__ORKIO_ENV__?.VITE_ORION_VOICE_ID || import.meta.env.VITE_ORION_VOICE_ID || "").trim(),
  };
  const defaultVoice = (window.__ORKIO_ENV__?.VITE_REALTIME_VOICE || import.meta.env.VITE_REALTIME_VOICE || ORKIO_DEFAULT_VOICE_ID).trim() || ORKIO_DEFAULT_VOICE_ID;
  return normalizeAgentVoiceId(dbVoice || envMap[name] || defaultVoice, defaultVoice);
}


function canonicalizeSpeakerLabel(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";
  const normalizedKey = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const map = {
    ux_frontend: "UX Frontend",
    auditor: "Auditor",
    systems_architect: "Systems Architect",
    backend_engineer: "Backend Engineer",
    frontend_engineer: "Frontend Engineer",
    qa_release_engineer: "QA Release Engineer",
    devops_sre: "DevOps SRE",
    security_guardian: "Security Guardian",
    data_db_architect: "Data DB Architect",
    realtime_voice_engineer: "Realtime Voice Engineer",
    orkio: "Orkio",
    chris: "Chris",
    orion: "Orion",
    agent: "Agent",
    agente: "Agent",
    assistant: "Agent",
    model: "Agent",
  };

  return map[normalizedKey] || text;
}

// AO64D — Public assistant speaker sanitation.
// Orion is an internal audit/governance agent and must not appear as the visible
// assistant for AMCHAM/public users. Backend may return blocked_agent=Orion and
// resolved_agent=Orkio; the UI must honor the resolved public speaker.
function canSeeInternalOrionSpeaker() {
  try {
    return Boolean(isAdmin?.());
  } catch {
    return false;
  }
}

function readRuntimeRoutingField(messageLike, key) {
  try {
    return (
      messageLike?.[key] ||
      messageLike?.runtime_hints?.routing?.[key] ||
      messageLike?.runtimeHints?.routing?.[key] ||
      messageLike?.done_payload?.[key] ||
      messageLike?.done_payload?.runtime_hints?.routing?.[key] ||
      ""
    );
  } catch {
    return "";
  }
}

function sanitizePublicAssistantSpeaker(messageLike, proposedName = "Orkio") {
  const proposed = canonicalizeSpeakerLabel(proposedName || "Orkio");
  const proposedKey = String(proposed || "").trim().toLowerCase();

  const blockedAgent = canonicalizeSpeakerLabel(
    readRuntimeRoutingField(messageLike, "blocked_agent") ||
    readRuntimeRoutingField(messageLike, "blockedAgent") ||
    messageLike?.blocked_agent ||
    messageLike?.blockedAgent ||
    ""
  );
  const resolvedAgent = canonicalizeSpeakerLabel(
    readRuntimeRoutingField(messageLike, "resolved_agent") ||
    readRuntimeRoutingField(messageLike, "resolvedAgent") ||
    messageLike?.resolved_agent ||
    messageLike?.resolvedAgent ||
    ""
  );
  const finalSpeaker = canonicalizeSpeakerLabel(
    messageLike?.final_speaker ||
    readRuntimeRoutingField(messageLike, "final_speaker") ||
    ""
  );
  const visibleAgent = canonicalizeSpeakerLabel(
    messageLike?.visible_agent ||
    readRuntimeRoutingField(messageLike, "visible_agent") ||
    ""
  );

  const blockedKey = String(blockedAgent || "").trim().toLowerCase();
  const resolvedKey = String(resolvedAgent || "").trim().toLowerCase();
  const finalKey = String(finalSpeaker || "").trim().toLowerCase();
  const visibleKey = String(visibleAgent || "").trim().toLowerCase();
  const contentText = String(
    messageLike?.answer ||
    messageLike?.message ||
    messageLike?.final_text ||
    messageLike?.content ||
    messageLike?.text ||
    ""
  ).toLowerCase();

  if (
    blockedKey === "orion" ||
    resolvedKey === "orkio" ||
    contentText.includes("orion é um agente interno") ||
    contentText.includes("orion faz parte da equipe interna") ||
    contentText.includes("orion e um agente interno")
  ) {
    return "Orkio";
  }
  if ((finalKey === "orkio" || visibleKey === "orkio") && proposedKey === "orion") {
    return "Orkio";
  }

  if (proposedKey === "orion" && !canSeeInternalOrionSpeaker()) {
    return "Orkio";
  }

  return proposed || "Orkio";
}


function inferSpeakerNameFromContent(content) {
  const text = String(content || "").trim();
  if (!text) return "";
  const lines = text
    .split(/\r?\n/)
    .map((line) => String(line || "").replace(/^[\s#>*-]+/, "").replace(/\s*[:：]\s*$/, "").trim())
    .filter(Boolean);

  if (!lines.length) return "";
  const first = lines[0];
  const inferred = canonicalizeSpeakerLabel(first);
  const normalizedInferred = String(inferred || "").trim().toLowerCase();
  const normalizedFirst = String(first || "").trim().toLowerCase();
  if (!inferred) return "";
  if (["agent", "assistant", "model", "agente"].includes(normalizedFirst)) return "Agent";
  if (inferred !== first) return inferred;
  return "";
}

function resolveAssistantDisplayName(messageLike, fallback = "Agent") {
  const rawName =
    messageLike?.agent_name ||
    messageLike?.final_speaker ||
    messageLike?.visible_agent ||
    messageLike?.speaker_name ||
    messageLike?.name ||
    "";

  const explicitFromContent = inferSpeakerNameFromContent(
    messageLike?.final_text || messageLike?.content || messageLike?.text || ""
  );

  const normalizedRaw = canonicalizeSpeakerLabel(rawName);
  const rawLower = String(normalizedRaw || "").trim().toLowerCase();

  let candidate = "";

  if (explicitFromContent && ["agent", "assistant", "model"].includes(rawLower)) {
    candidate = explicitFromContent;
  } else if (explicitFromContent && !rawName) {
    candidate = explicitFromContent;
  } else if (normalizedRaw) {
    candidate = normalizedRaw;
  } else if (explicitFromContent) {
    candidate = explicitFromContent;
  } else {
    candidate = fallback;
  }

  return sanitizePublicAssistantSpeaker(messageLike, candidate || fallback || "Orkio");
}

function normalizeMessageSpeaker(messageLike) {
  if (!messageLike || String(messageLike?.role || "").toLowerCase() !== "assistant") {
    return messageLike;
  }

  const displayName = resolveAssistantDisplayName(messageLike, "Orkio");

  return {
    ...messageLike,
    agent_name: displayName,
    final_speaker: displayName,
    visible_agent: displayName,
  };
}

// METATRON_CHAT_ORDER_STABILITY
// Mantém a ordem visual pergunta -> resposta mesmo quando o backend retorna mensagens
// fora de ordem, com timestamps empatados ou quando a reconciliação pós-stream substitui
// o histórico local pelo histórico persistido.
function coerceMessageTimestamp(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    // Backend pode retornar segundos; frontend local pode usar milissegundos.
    return value > 10_000_000_000 ? value : value * 1000;
  }

  const raw = String(value || "").trim();
  if (!raw) return null;

  const asNumber = Number(raw);
  if (Number.isFinite(asNumber)) {
    return asNumber > 10_000_000_000 ? asNumber : asNumber * 1000;
  }

  const parsed = Date.parse(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function roleOrderForChat(role) {
  const normalized = String(role || "").toLowerCase();
  if (normalized === "user") return 10;
  if (normalized === "assistant") return 20;
  if (normalized === "agent") return 20;
  if (normalized === "tool") return 30;
  if (normalized === "system") return 40;
  return 50;
}

function getMessageSortTimestamp(message, fallbackIndex = 0) {
  const candidates = [
    message?.client_created_at,
    message?.created_at,
    message?.createdAt,
    message?.timestamp,
    message?.updated_at,
    message?.updatedAt,
  ];

  for (const candidate of candidates) {
    const parsed = coerceMessageTimestamp(candidate);
    if (parsed != null) return parsed;
  }

  return fallbackIndex;
}

function orderChatMessages(input) {
  const list = Array.isArray(input) ? input : [];
  return list
    .map((message, index) => ({ message, index }))
    .sort((a, b) => {
      const ta = getMessageSortTimestamp(a.message, a.index);
      const tb = getMessageSortTimestamp(b.message, b.index);

      if (ta !== tb) return ta - tb;

      const roleDelta = roleOrderForChat(a.message?.role) - roleOrderForChat(b.message?.role);
      if (roleDelta !== 0) return roleDelta;

      const clientOrderA = Number(a.message?.client_order ?? a.message?.clientOrder ?? NaN);
      const clientOrderB = Number(b.message?.client_order ?? b.message?.clientOrder ?? NaN);
      if (Number.isFinite(clientOrderA) && Number.isFinite(clientOrderB) && clientOrderA !== clientOrderB) {
        return clientOrderA - clientOrderB;
      }

      return a.index - b.index;
    })
    .map((entry) => entry.message);
}

function logRealtimeStep(step, payload = undefined) {
  try {
    const stamp = new Date().toISOString();
    if (payload === undefined) {
      console.log(`[Realtime][${stamp}] ${step}`);
    } else {
      console.log(`[Realtime][${stamp}] ${step}`, payload);
    }
  } catch {}
}


function hasAdminAccess(userObj) {
  if (!userObj) return false;
  const role = String(userObj?.role || "").trim().toLowerCase();
  const email = String(userObj?.email || userObj?.user_email || "").trim().toLowerCase();

  const envAdminEmails = String(
    ORKIO_ENV.VITE_ADMIN_EMAILS ||
    import.meta.env.VITE_ADMIN_EMAILS ||
    "daniel@patroai.com"
  )
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return !!(
    role === "admin"
    || role === "owner"
    || role === "superadmin"
    || userObj?.is_admin === true
    || userObj?.admin === true
    || (email && envAdminEmails.includes(email))
  );
}



// Icons (inline SVG)
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconPaperclip = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21.44 11.05l-8.49 8.49a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.19 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49" />
  </svg>
);

const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconMessage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

function tryParseEvent(content) {
  try {
    if (!content || typeof content !== "string") return null;
    const idx = content.indexOf("ORKIO_EVENT:");
    if (idx < 0) return null;
    const jsonStr = content.slice(idx + "ORKIO_EVENT:".length);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function stripEventMarker(content) {
  if (!content || typeof content !== "string") return content;
  const idx = content.indexOf("ORKIO_EVENT:");
  if (idx < 0) return content;
  return content.slice(0, idx).trim();
}

function formatTs(ts) {
  try {
    if (!ts) return "";
    return formatDateTime(ts);
  } catch {
    return "";
  }
}

function formatDateTime(ts) {
  if (ts === null || ts === undefined || ts === "") return "";
  try {
    let ms;
    if (typeof ts === "number") {
      // If value looks like milliseconds (13 digits), keep; if seconds (10 digits), convert.
      ms = ts > 10_000_000_000 ? ts : ts * 1000;
    } else {
      // ISO string or numeric string
      const n = Number(ts);
      if (!Number.isNaN(n) && Number.isFinite(n)) {
        ms = n > 10_000_000_000 ? n : n * 1000;
      } else {
        ms = new Date(ts).getTime();
      }
    }
    const d = new Date(ms);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  } catch {
    return "";
  }
}

function fmtUsd(value) {
  const n = Number(value || 0);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}


function normalizeWalletErrorPayload(err) {
  const payload = err?.payload || err?.data || null;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    if (payload.code === "WALLET_INSUFFICIENT_BALANCE") return payload;
    if (payload.detail && typeof payload.detail === "object" && payload.detail.code === "WALLET_INSUFFICIENT_BALANCE") {
      return payload.detail;
    }
  }
  if (typeof payload === "string") {
    try {
      const parsed = JSON.parse(payload);
      if (parsed?.code === "WALLET_INSUFFICIENT_BALANCE") return parsed;
      if (parsed?.detail?.code === "WALLET_INSUFFICIENT_BALANCE") return parsed.detail;
    } catch {}
  }
  const message = String(err?.message || "").trim();
  if (message) {
    try {
      const parsed = JSON.parse(message);
      if (parsed?.code === "WALLET_INSUFFICIENT_BALANCE") return parsed;
      if (parsed?.detail?.code === "WALLET_INSUFFICIENT_BALANCE") return parsed.detail;
    } catch {}
  }
  return null;
}

function buildWalletBlockedMessage(detail) {
  if (!detail) return "Sua wallet não possui saldo suficiente para continuar.";
  const current = Number(detail.current_balance_usd || detail.wallet?.balance_usd || 0);
  const required = Number(detail.required_usd || 0);
  const missing = Number(
    detail.missing_usd != null
      ? detail.missing_usd
      : Math.max(required - current, 0)
  );
  if (missing > 0.0001) {
    return `Saldo insuficiente na wallet. Faltam ${fmtUsd(missing)} para continuar.`;
  }
  if (required > 0.0001) {
    return `Saldo insuficiente na wallet. É recomendado manter pelo menos ${fmtUsd(required)} disponível.`;
  }
  return "Sua wallet não possui saldo suficiente para continuar.";
}

function isWalletBlockedError(err) {
  if (!err) return false;
  if (String(err?.status || "") === "402") return true;
  return normalizeWalletErrorPayload(err)?.code === "WALLET_INSUFFICIENT_BALANCE";
}



function summarizeExecutionStatus(payload = {}) {
  const raw = String(payload?.status || payload?.message || "").trim();
  if (!raw) return "Executando etapa";
  return raw.length > 140 ? `${raw.slice(0, 137)}...` : raw;
}

// AO20K-HF4M_PREMIUM_EXECUTION_TRACE_UX
function formatExecutionRoutingSource(raw = "") {
  const source = String(raw || "").trim();
  if (!source) return "";
  const labels = {
    "stream_ao20k_hf4k_simple_status": "Status seguro",
    "stream_ao20k_hf4k_immediate_memory_recall": "Memória imediata",
    "stream_ao20k_hf4k_simulation_only_branch_pr_plan": "Plano simulado",
  };
  return labels[source] || source.replace(/^stream_/, "").replaceAll("_", " ");
}

// HF6R2A_PREFER_HF6R1_ROUTE_METADATA
function formatRouteBadgeLabel(raw = "") {
  const value = String(raw || "").trim();
  if (!value) return "";
  const labels = {
    multi_intent_readonly_splitter: "multi intent readonly",
    multi_intent_readonly: "multi intent readonly",
    checkpoint_ack_readonly: "checkpoint readonly",
    checkpoint_readonly: "checkpoint readonly",
    safe_agent_ping: "agent ping",
    agent_ping: "agent ping",
    safe_agent_greeting: "agent greeting",
    agent_greeting: "agent greeting",
    readonly_audit_light: "readonly audit light",
    internal_diagnostic_token_readonly: "internal diagnostic token readonly",
    simple_greeting: "simple greeting",
    system_status_readonly: "system status readonly",
    controlled_evolution_readonly: "controlled evolution readonly",
    governed_pipeline_inventory_readonly: "governed pipeline inventory readonly",
    issue_map_patch_plan_readonly: "issue map patch plan readonly",
    branch_pr_plan_simulated_readonly: "branch/pr simulated readonly",
    safe_fastpath_coverage: "safe fast-path",
    technical_audit: "technical audit",
    orchestration_audit: "orchestration audit",
    general: "general",
  };
  return labels[value] || value.replaceAll("_", " ");
}

function buildExecutionBadgesFromRouting(routing = {}) {
  const badges = [];
  if (routing?.fast_path_hit || routing?.runtime_bypassed) badges.push("Fast-path");
  if (routing?.simulation_only) badges.push("Somente simulação");
  if (routing?.write_executed === false || routing?.write_allowed === false) badges.push("Sem escrita");
  if (routing?.branch_created === false && routing?.pr_created === false) badges.push("Sem branch/PR");

  // AO44_TRACE_LABEL_COHERENCE
  const preferredRoute =
    routing?.display_label ||
    routing?.execution_lifecycle ||
    routing?.route_kind ||
    routing?.route_family ||
    routing?.routing_source ||
    "";

  const routeBadge = formatRouteBadgeLabel(preferredRoute);
  if (routeBadge) badges.push(routeBadge);

  if (routing?.route_matrix_version === "HF6R1" || routing?.metadata_normalized) {
    badges.push("HF6R1");
  }

  return Array.from(new Set(badges.filter(Boolean))).slice(0, 5);
}

function buildExecutionDoneDetail(payload = {}) {
  const routing = payload?.runtime_hints?.routing || {};
  const parts = [];
  const sourceLabel = formatExecutionRoutingSource(routing?.routing_source);
  if (sourceLabel) parts.push(sourceLabel);
  if (routing?.simulation_only) parts.push("simulação readonly");
  if (routing?.write_executed === false) parts.push("sem escrita");
  if (routing?.execution_cursor?.current_node) parts.push(`nó ${routing.execution_cursor.current_node}`);
  return parts.join(" • ");
}


function normalizeCapabilityPayload(payload = null) {
  if (!payload || typeof payload !== "object") return null;
  const multiagent = payload?.multiagent && typeof payload.multiagent === "object" ? payload.multiagent : {};
  const github = payload?.github && typeof payload.github === "object" ? payload.github : {};
  return {
    multiagent,
    github,
  };
}

function formatGithubRuntimeStatus(capabilities = null) {
  const normalized = normalizeCapabilityPayload(capabilities);
  const github = normalized?.github || {};
  if (!github?.available) return "sem acesso";
  const mode = String(github?.mode || "").trim().toLowerCase();
  if (mode === "governed_pr_only") return "PR-only";
  if (github?.read_enabled && !github?.write_enabled) return "read-only";
  if (github?.write_enabled) return "conectado";
  return "conectado";
}

function formatActiveAgentRuntime(agentName = "") {
  const slug = String(agentName || "").trim().toLowerCase();
  if (!slug) return "";
  if (slug.startsWith("orion")) return "Orion analisando";
  if (slug.startsWith("chris")) return "Chris validando";
  if (slug.startsWith("auditor")) return "Auditor revisando";
  return "Orkio respondendo";
}

function traceStepTone(kind = "status") {
  if (kind === "error") return { icon: "⚠️", color: "#fca5a5", border: "rgba(248,113,113,0.24)", background: "rgba(127,29,29,0.22)" };
  if (kind === "done") return { icon: "✅", color: "#86efac", border: "rgba(74,222,128,0.24)", background: "rgba(20,83,45,0.22)" };
  if (kind === "agent") return { icon: "🧩", color: "#bfdbfe", border: "rgba(96,165,250,0.24)", background: "rgba(30,64,175,0.16)" };
  if (kind === "system") return { icon: "⚙️", color: "#c4b5fd", border: "rgba(139,92,246,0.24)", background: "rgba(76,29,149,0.18)" };
  return { icon: "⏳", color: "#e5e7eb", border: "rgba(148,163,184,0.20)", background: "rgba(15,23,42,0.26)" };
}

function resolveRealtimeTranscriptionLanguage(languageProfile) {
  // AO68A-HF6R5 — AMCHAM bilingual STT.
  // Onboarding controls the hint; "auto" keeps provider auto-detection.
  const raw = String(languageProfile || "").trim();
  if (!raw) return null;

  const normalized = raw.toLowerCase().replace("_", "-");
  if (!normalized || normalized === "auto") return null;

  if (normalized === "pt" || normalized.startsWith("pt-")) return "pt";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  if (normalized === "es" || normalized.startsWith("es-")) return "es";
  if (normalized === "fr" || normalized.startsWith("fr-")) return "fr";

  return normalized.split("-")[0] || null;
}



const ONBOARDING_USER_TYPES = [
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Investor" },
  { value: "operator", label: "Operator" },
  { value: "partner", label: "Partner" },
  { value: "other", label: "Other" },
];

const ONBOARDING_INTENTS = [
  { value: "explore", label: "Explorar a plataforma" },
  { value: "meeting", label: "Agendar conversa" },
  { value: "pilot", label: "Avaliar piloto" },
  { value: "funding", label: "Discutir investimento" },
  { value: "other", label: "Outro" },
];

const ONBOARDING_COUNTRIES = [
  { value: "BR", label: "Brasil" },
  { value: "US", label: "Estados Unidos" },
  { value: "ES", label: "Espanha" },
  { value: "PT", label: "Portugal" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "CO", label: "Colômbia" },
  { value: "CL", label: "Chile" },
  { value: "UY", label: "Uruguai" },
  { value: "OTHER", label: "Outro" },
];

const ONBOARDING_LANGUAGES = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
  { value: "pt-PT", label: "Português (Portugal)" },
];

const DEFAULT_LANGUAGE_BY_COUNTRY = {
  BR: "pt-BR",
  PT: "pt-PT",
  ES: "es-ES",
  AR: "es-ES",
  MX: "es-ES",
  CO: "es-ES",
  CL: "es-ES",
  UY: "es-ES",
  US: "en-US",
  OTHER: "en-US",
};

function normalizeOnboardingUserType(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  const aliases = {
    founder: "founder",
    investor: "investor",
    operator: "operator",
    enterprise: "operator",
    developer: "operator",
    partner: "partner",
    other: "other",
  };
  return aliases[raw] || "";
}

function normalizeOnboardingIntent(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  const aliases = {
    explore: "explore",
    exploring: "explore",
    curious: "explore",
    meeting: "meeting",
    partnership: "meeting",
    pilot: "pilot",
    company_eval: "pilot",
    funding: "funding",
    investment: "funding",
    other: "other",
  };
  return aliases[raw] || "";
}

function suggestOnboardingLanguage(country) {
  const code = String(country || "").trim().toUpperCase();
  return DEFAULT_LANGUAGE_BY_COUNTRY[code] || "en-US";
}

// AO68A-HF5 — Realtime language propagation from onboarding.
// Keeps AMCHAM/PT-EN demos bilingual without forcing a global STT language.
function normalizeRealtimeLanguageProfile(raw) {
  const value = String(raw || "").trim();
  if (!value || value.toLowerCase() === "auto") return "auto";

  const normalized = value.toLowerCase().replace("_", "-");

  if (normalized === "pt" || normalized.startsWith("pt-")) return "pt";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  if (normalized === "es" || normalized.startsWith("es-")) return "es";

  return "auto";
}

function getUserOnboardingLanguage(userObj, formObj) {
  const candidates = [
    formObj?.language,
    userObj?.language,
    userObj?.preferred_language,
    userObj?.language_profile,
    userObj?.profile?.language,
    userObj?.profile?.preferred_language,
    userObj?.onboarding?.language,
    userObj?.onboarding_context?.language,
  ];

  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (value) return value;
  }

  return "auto";
}

function buildRealtimeVoiceInstruction(languageProfile, messageText = "") {
  const lang = normalizeRealtimeLanguageProfile(languageProfile);
  const msg = String(messageText || "").trim();

  const base =
    lang === "en"
      ? "Answer the user by voice in English, briefly, naturally and helpfully."
      : lang === "es"
        ? "Responde al usuario por voz en español, de forma breve, natural y útil."
        : lang === "pt"
          ? "Responda ao usuário por voz em português, de forma curta, natural, útil e humana."
          : "Answer in the same language the user is using. Be brief, natural, useful and human.";

  return msg ? `${base} Mensagem do usuário: ${msg}` : base;
}

function buildRealtimeActivationProbeInstruction(languageProfile) {
  const lang = normalizeRealtimeLanguageProfile(languageProfile);

  if (lang === "en") {
    return {
      inputText: "Say only: Hello, I am Orkio in real time.",
      instructions: "Answer by audio in English, saying only: Hello, I am Orkio in real time.",
    };
  }

  if (lang === "es") {
    return {
      inputText: "Di solamente: Hola, soy Orkio en tiempo real.",
      instructions: "Responde en audio en español, diciendo solamente: Hola, soy Orkio en tiempo real.",
    };
  }

  return {
    inputText: "Diga apenas: Olá, eu sou o Orkio em tempo real.",
    instructions: "Responda em áudio em português, dizendo apenas: Olá, eu sou o Orkio em tempo real.",
  };
}

function normalizeWhatsapp(value) {
  return String(value || "").replace(/[^\d+]/g, "").trim();
}

function sanitizeOnboardingForm(data) {
  const country = String(data?.country || "").trim().toUpperCase() || "BR";
  const language = String(data?.language || "").trim() || suggestOnboardingLanguage(country);
  return {
    company: String(data?.company || "").trim(),
    role: String(data?.role || data?.profile_role || "").trim(),
    user_type: normalizeOnboardingUserType(data?.user_type) || "other",
    intent: normalizeOnboardingIntent(data?.intent) || "explore",
    country,
    language,
    whatsapp: normalizeWhatsapp(data?.whatsapp || ""),
    notes: String(data?.notes || "").trim(),
  };
}

export default function AppConsole() {

  const SHOW_REALTIME_AUDIT = false;

  // ORKIO_AO60I_REALTIME_TIMEBOX_COOLDOWN_COUNTER
  // ORKIO_AO60J_HF1_PREMIUM_2MIN_10MIN_WAKE_COUNTER
  // Unified web/PWA default = 2min session + 10min cooldown; backend remains source of truth.
  const REALTIME_PUBLIC_BETA_TIMEBOX_SECONDS = 2 * 60;
  const REALTIME_PUBLIC_BETA_COOLDOWN_SECONDS = 10 * 60;
  // ORKIO_AO60K_HF5B_FRONTEND_ENDED_AT_SECONDS_TIMEBOX_VERIFY
  // Build marker used only for audit/debug so we can prove the active bundle contains HF5B.
  const ORKIO_AO60K_HF5B_BUILD_MARKER = "AO60K-HF5B_FRONTEND_ENDED_AT_SECONDS_TIMEBOX_VERIFY";
const ORKIO_AO61A_BUILD_MARKER = "AO61A_REALTIME_PREMIUM_UX_COOLDOWN_TRANSCRIPTION_LOCK";
const ORKIO_AO61A_HF3_BUILD_MARKER = "AO61A-HF3_TIMEBOX_COUNTER_AUTOSTOP_ASSISTANT_TRANSCRIPT";
const ORKIO_AO61A_HF4_BUILD_MARKER = "AO61A-HF4_FIXED_COUNTER_LONGEST_ASSISTANT_TRANSCRIPT";
const ORKIO_AO66R_HF4_BUILD_MARKER = "AO66R_REALTIME_ACTIVATION_REPAIR";

  const nav = useNavigate();


  async function confirmSessionExpired(reason = "unknown") {
    const t = getToken();
    const org = getTenant() || tenant || "public";

    if (!t) return true;

    try {
      await apiFetch("/api/me", {
        method: "GET",
        token: t,
        org,
        skipAuthRedirect: true,
      });
      return false;
    } catch (err) {
      if (err?.status === 401) {
        console.warn("session confirmed expired", { reason, code: err?.code });
        return true;
      }
      console.warn("session probe failed without confirmed expiry", {
        reason,
        status: err?.status,
        message: err?.message,
      });
      return false;
    }
  }

  async function logoutIfSessionReallyExpired(reason = "unknown") {
    const expired = await confirmSessionExpired(reason);
    if (expired) {
      clearSession();
      nav("/auth?session_expired=1");
      return true;
    }
    return false;
  }


  const [tenant, setTenant] = useState(getTenant() || "public");
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());
  const canAccessAdmin = hasAdminAccess(user);

  // Summit presence heartbeat (single source of truth).
  // EFATA777 v12: the app must not keep an inline heartbeat loop in parallel with
  // startSessionHeartbeat(). A duplicated loop can keep sending stale tokens and
  // create noisy 401 races while another tab/session is already valid.
  React.useEffect(() => {
    if (!token) return undefined;

    const stopHeartbeat = startSessionHeartbeat({
      intervalMs: 45000,
      onUnauthorized: () => {
        void logoutIfSessionReallyExpired("heartbeat");
      },
    });

    return () => {
      try { stopHeartbeat?.(); } catch {}
    };
  }, [token, tenant]);

  useEffect(() => {
    try {
      console.log("ADMIN_RUNTIME_USER", user);
      console.log("ADMIN_RUNTIME_CAN_ACCESS", canAccessAdmin);
    } catch {}
  }, [user, canAccessAdmin]);

const [onboardingChecked, setOnboardingChecked] = useState(false);
const [bootstrapFailOpen, setBootstrapFailOpen] = useState(false);
const [onboardingOpen, setOnboardingOpen] = useState(false);
const [onboardingBusy, setOnboardingBusy] = useState(false);
const [onboardingStatus, setOnboardingStatus] = useState("");
const [onboardingForm, setOnboardingForm] = useState(() => sanitizeOnboardingForm(user));
  const [health, setHealth] = useState("checking");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 820 : false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [threads, setThreads] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const agentsByNameRef = useRef(new Map());
  const activeThreadIdRef = useRef("");
  const activeThreadEpochRef = useRef(0);
  const messagesAbortRef = useRef(null);
  const messagesLoadRequestRef = useRef(0);
  const requestedThreadIdRef = useRef("");
  const threadSelectionLockUntilRef = useRef(0);
  const pinnedThreadIdRef = useRef("");
  const initialStoredThreadIdRef = useRef("");
  const storageBootstrapConsumedRef = useRef(false);
  const storageBootstrapInitializedRef = useRef(false);
  const THREAD_STORAGE_KEY = "orkio_active_thread_id";

  function readStoredThreadId() {
    if (typeof window === "undefined") return "";
    try { return String(window.localStorage?.getItem(THREAD_STORAGE_KEY) || "").trim(); } catch { return ""; }
  }

  function persistActiveThreadId(nextId) {
    const safeId = String(nextId || "").trim();
    if (typeof window === "undefined") return;
    try {
      if (safeId) window.localStorage?.setItem(THREAD_STORAGE_KEY, safeId);
      else window.localStorage?.removeItem(THREAD_STORAGE_KEY);
    } catch {}
  }

  function getBootstrapStoredThreadId() {
    if (storageBootstrapConsumedRef.current) return "";
    if (!storageBootstrapInitializedRef.current) {
      initialStoredThreadIdRef.current = readStoredThreadId();
      storageBootstrapInitializedRef.current = true;
    }
    return String(initialStoredThreadIdRef.current || "").trim();
  }