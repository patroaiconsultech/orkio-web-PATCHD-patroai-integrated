// AO-14C — AdminEvolutionCenter.jsx integration snippet
// Path: src/routes/AdminEvolutionCenter.jsx
//
// Goal: when auth/admin guard fails, send user to login preserving /admin/evolution.
// Apply surgically; do not replace the whole file blindly.

import {
  buildLoginUrl,
  getCurrentReturnPath,
  rememberReturnTo,
} from "../lib/authReturn";

// Option A — for an "Ir para login" button/link:
const returnTo = getCurrentReturnPath(window.location) || "/admin/evolution";
const loginUrl = buildLoginUrl(rememberReturnTo(returnTo));

// Then use:
<a href={loginUrl}>Ir para login</a>

// Option B — for automatic redirect when not authenticated:
const returnTo = getCurrentReturnPath(window.location) || "/admin/evolution";
rememberReturnTo(returnTo);
window.location.assign(buildLoginUrl(returnTo));

// Important:
// Keep the existing Admin check. This patch only fixes return navigation.
