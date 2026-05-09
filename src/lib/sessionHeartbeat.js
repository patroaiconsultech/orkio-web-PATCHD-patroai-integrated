import { getToken, getTenant } from "./auth.js";
import { heartbeat } from "../ui/api.js";

export function startSessionHeartbeat({
  intervalMs = 20000,
  onUnauthorized = null,
} = {}) {
  let alive = true;
  let timer = null;
  let consecutiveFailures = 0;

  async function tick() {
    const token = getToken();
    const org = getTenant();

    if (!token) return;

    try {
      await heartbeat({ token, org });
      consecutiveFailures = 0;
    } catch (err) {
      consecutiveFailures += 1;
      // EFATA777 v8:
      // heartbeat is an online-presence probe, not the canonical auth decision.
      // Do not clear session from here. App bootstrap must confirm /api/me first.
      if (err?.status === 401) {
        console.warn("sessionHeartbeat non-fatal 401", {
          consecutiveFailures,
          code: err?.code,
        });
        return;
      }

      if (consecutiveFailures >= 3 && typeof onUnauthorized === "function") {
        try {
          onUnauthorized(err);
        } catch {}
      }
    }
  }

  tick();
  timer = setInterval(() => {
    if (alive) tick();
  }, intervalMs);

  return () => {
    alive = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
