// Central voice registry for Orkio (Admin + App must stay consistent)
// id: the value sent to the realtime API

// Realtime voices supported in current Orkio environment:
// alloy, ash, ballad, coral, echo, sage, shimmer, verse, marin, cedar
export const ORKIO_DEFAULT_VOICE_ID = "shimmer";
export const ORKIO_DEFAULT_TTS_SPEED = 0.9;

// Curadoria de experiência:
// - shimmer: padrãOrkio, feminina, suave e acolhedora para avatar/PWA
// - marin/coral/sage: boas alternativas naturais e próximas
// - cedar/echo: mantidas para perfis mais graves, mas não são default
export const ORKIO_VOICES = [
  { id: "shimmer", label: "Shimmer (Orkio, feminina e acolhedora)" },
  { id: "marin", label: "Marin (natural, suave)" },
  { id: "coral", label: "Coral (clara, próxima)" },
  { id: "sage", label: "Sage (calma, consultiva)" },
  { id: "verse", label: "Verse (expressiva)" },
  { id: "ballad", label: "Ballad (narrativa)" },
  { id: "alloy", label: "Alloy (neutra)" },
  { id: "ash", label: "Ash" },
  { id: "cedar", label: "Cedar (grave)" },
  { id: "echo", label: "Echo (masculina)" },
];

// Backward-compatible aliases (legacy -> supported)
const VOICE_ALIASES = {
  nova: "shimmer",
  onyx: "echo",
  fable: "sage",
  marine: "marin",
};

export const ORKIO_VOICE_IDS = new Set(ORKIO_VOICES.map((v) => v.id));

export function coerceVoiceId(value, fallback = ORKIO_DEFAULT_VOICE_ID) {
  const v0 = (value || "").toString().trim().toLowerCase();
  const v = VOICE_ALIASES[v0] || v0;
  return ORKIO_VOICE_IDS.has(v) ? v : fallback;
}

export function coerceTtsSpeed(value, fallback = ORKIO_DEFAULT_TTS_SPEED) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0.75, Math.min(1.12, n));
}
