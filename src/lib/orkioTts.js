/**
 * Orkio shared TTS runtime.
 *
 * Keeps avatar, onboarding and voice hero using the same voice contract.
 * This file is intentionally small and frontend-only.
 */

const DEFAULT_VOICE = "shimmer";
const DEFAULT_SPEED = 0.9;

export function getOrkioVoiceId() {
  return DEFAULT_VOICE;
}

export function getOrkioTtsSpeed() {
  return DEFAULT_SPEED;
}

export function cleanupAudioUrl(audio) {
  try {
    if (audio?.dataset?.blobUrl) {
      URL.revokeObjectURL(audio.dataset.blobUrl);
      delete audio.dataset.blobUrl;
    }
  } catch {}
}

function getApiRoot() {
  if (typeof window === "undefined") return "";

  const env = window.__ORKIO_ENV__ || {};
  const base = String(env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "")
    .trim()
    .replace(/\/$/, "");

  return base.endsWith("/api") ? base.slice(0, -4) : base;
}

async function postTts(endpoint, payload, headers) {
  const res = await fetch(`${getApiRoot()}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`${endpoint} ${res.status}`);
  }

  const blob = await res.blob();
  if (!blob || blob.size <= 0) {
    throw new Error(`${endpoint} returned empty audio`);
  }

  return blob;
}

export async function requestOrkioTtsBlob({
  text,
  token = "",
  tenant = "public",
  locale = "pt-BR",
  voice = DEFAULT_VOICE,
  speed = DEFAULT_SPEED,
} = {}) {
  const cleanText = String(text || "").trim();
  if (!cleanText) throw new Error("TTS text is empty");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(tenant ? { "X-Org-Slug": tenant } : {}),
  };

  const payload = {
    text: cleanText,
    voice,
    speed,
    locale,
  };

  const endpoints = token
    ? ["/api/tts", "/api/public/tts", "/api/tts/public"]
    : ["/api/public/tts", "/api/tts/public", "/api/tts"];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      return await postTts(endpoint, payload, headers);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("TTS failed");
}

function pickBrowserVoice(locale = "pt-BR") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices?.() || [];
  const lang = String(locale || "pt-BR").toLowerCase();

  const preferredPt = [
    "francisca",
    "maria",
    "helena",
    "luciana",
    "google português",
    "portuguese",
    "brasil",
    "brazil",
    "female",
  ];

  const preferredEn = [
    "samantha",
    "victoria",
    "karen",
    "moira",
    "tessa",
    "zira",
    "google us english",
    "google uk english female",
    "female",
  ];

  const preferred = lang.startsWith("en") ? preferredEn : preferredPt;

  return (
    voices.find((voice) => preferred.some((name) => voice.name.toLowerCase().includes(name))) ||
    voices.find((voice) => voice.lang?.toLowerCase() === lang) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith(lang.slice(0, 2))) ||
    null
  );
}

export function speakWithOrkioBrowserVoice(
  text,
  { locale = "pt-BR", onStart, onEnd, onError } = {}
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
    utterance.rate = locale === "en-US" ? 0.94 : 0.9;
    utterance.pitch = 1.08;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (typeof onStart === "function") onStart();
    };

    utterance.onend = () => {
      if (typeof onEnd === "function") onEnd();
    };

    utterance.onerror = () => {
      if (typeof onError === "function") onError();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    if (typeof onError === "function") onError(err);
    return false;
  }
}
