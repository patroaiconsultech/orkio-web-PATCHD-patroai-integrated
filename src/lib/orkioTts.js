const DEFAULT_VOICE_ID = "shimmer";
const DEFAULT_TTS_SPEED = 0.9;

export function getOrkioVoiceId() {
  const fromEnv =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_ORKIO_TTS_VOICE
      : "";
  return String(fromEnv || DEFAULT_VOICE_ID).trim() || DEFAULT_VOICE_ID;
}

export function getOrkioTtsSpeed() {
  const fromEnv =
    typeof import.meta !== "undefined" && import.meta.env
      ? Number(import.meta.env.VITE_ORKIO_TTS_SPEED)
      : NaN;
  return Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : DEFAULT_TTS_SPEED;
}

export function getApiRoot() {
  const runtimeEnv =
    typeof window !== "undefined" && window.__ORKIO_ENV__
      ? window.__ORKIO_ENV__
      : {};
  const base = String(
    runtimeEnv.VITE_API_BASE_URL ||
      (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_API_BASE_URL : "") ||
      ""
  )
    .trim()
    .replace(/\/$/, "");

  return base.endsWith("/api") ? base.slice(0, -4) : base;
}

export function cleanupAudioUrl(audio) {
  try {
    if (audio?.dataset?.blobUrl) URL.revokeObjectURL(audio.dataset.blobUrl);
  } catch {}
}

function buildTtsPayload({ text, locale = "pt-BR", voice, speed } = {}) {
  return {
    text: String(text || ""),
    voice: voice || getOrkioVoiceId(),
    speed: speed || getOrkioTtsSpeed(),
    locale,
  };
}

async function postTts(endpoint, { text, token = "", tenant = "public", locale = "pt-BR", voice, speed } = {}) {
  const res = await fetch(`${getApiRoot()}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenant ? { "X-Org-Slug": tenant } : {}),
    },
    body: JSON.stringify(buildTtsPayload({ text, locale, voice, speed })),
  });

  if (!res.ok) throw new Error(`${endpoint} ${res.status}`);
  return res.blob();
}

export async function requestOrkioTtsBlob({
  text,
  token = "",
  tenant = "public",
  locale = "pt-BR",
  voice,
  speed,
} = {}) {
  if (!String(text || "").trim()) throw new Error("TTS_EMPTY_TEXT");

  const endpoints = token
    ? ["/api/tts"]
    : ["/api/public/tts", "/api/tts/public", "/api/tts"];

  let lastError;
  for (const endpoint of endpoints) {
    try {
      return await postTts(endpoint, { text, token, tenant, locale, voice, speed });
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("TTS_REQUEST_FAILED");
}

function pickBrowserVoice(locale = "pt-BR") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices?.() || [];
  const normalizedLocale = String(locale || "pt-BR").toLowerCase();

  const preferredPt = [
    "francisca",
    "maria",
    "helena",
    "luciana",
    "google português",
    "portuguese",
    "brasil",
    "female",
  ];
  const preferredEn = [
    "samantha",
    "victoria",
    "karen",
    "zira",
    "aria",
    "jenny",
    "google us english",
    "google uk english female",
    "female",
  ];

  const names = normalizedLocale.startsWith("en") ? preferredEn : preferredPt;

  return (
    voices.find((voice) => names.some((name) => voice.name.toLowerCase().includes(name))) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(normalizedLocale)) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(normalizedLocale.slice(0, 2))) ||
    null
  );
}

export function speakWithOrkioBrowserVoice(
  text,
  {
    locale = "pt-BR",
    rate = 0.92,
    pitch = 1.08,
    volume = 1,
    onStart,
    onEnd,
    onError,
  } = {}
) {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    !("SpeechSynthesisUtterance" in window)
  ) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text || ""));
    const voice = pickBrowserVoice(locale);
    if (voice) utterance.voice = voice;
    utterance.lang = locale;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onError?.();
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
