@patroaiconsultech ➜ /workspaces/orkio-web-PATCHD-patroai-integrated (main) $ echo "=== CONFIRMANDO ARQUIVO ATUAL ==="
wc -l src/lib/adminEvolutionDryRun.js
nl -ba src/lib/adminEvolutionDryRun.js | sed -n '1,140p'

echo "=== GARANTINDO QUE NÃO HÁ JSX ==="
grep -n "function Pill" src/lib/adminEvolutionDryRun.js || echo "OK: sem function Pill"
grep -n "return <span" src/lib/adminEvolutionDryRun.js || echo "OK: sem JSX span"

npm run buildLD LIMPO APÓS PATCH ==="
=== CONFIRMANDO ARQUIVO ATUAL ===
90 src/lib/adminEvolutionDryRun.js
     1  // AO-16D-R4 — src/lib/adminEvolutionDryRun.js
     2  // Dry-run governado: chama somente o endpoint de simulação.
     3  // Não habilita execução real, commit, deploy ou migration.
     4
     5  function getApiBase() {
     6    return (
     7      import.meta?.env?.VITE_API_BASE_URL ||
     8      import.meta?.env?.VITE_API_URL ||
     9      ""
    10    ).replace(/\/$/, "");
    11  }
    12
    13  function getStoredToken() {
    14    return (
    15      localStorage.getItem("orkio_token") ||
    16      localStorage.getItem("access_token") ||
    17      localStorage.getItem("token") ||
    18      sessionStorage.getItem("orkio_token") ||
    19      sessionStorage.getItem("access_token") ||
    20      sessionStorage.getItem("token") ||
    21      ""
    22    );
    23  }
    24
    25  async function parseResponse(response) {
    26    const text = await response.text();
    27    let data = {};
    28
    29    try {
    30      data = text ? JSON.parse(text) : {};
    31    } catch {
    32      data = { raw: text };
    33    }
    34
    35    if (!response.ok) {
    36      const message =
    37        data?.detail ||
    38        data?.message ||
    39        data?.error ||
    40        `Falha HTTP ${response.status}`;
    41
    42      const err = new Error(message);
    43      err.status = response.status;
    44      err.data = data;
    45      err.payload = data;
    46      throw err;
    47    }
    48
    49    return data;
    50  }
    51
    52  export async function runEvolutionDryRun(proposalId, options = {}) {
    53    if (!proposalId) {
    54      throw new Error("proposal_id ausente para dry-run.");
    55    }
    56
    57    const token = options.token || getStoredToken();
    58    const headers = { "Content-Type": "application/json" };
    59
    60    if (token) {
    61      headers.Authorization = `Bearer ${token}`;
    62    }
    63
    64    if (options.org) {
    65      headers["X-Orkio-Org"] = options.org;
    66    }
    67
    68    const url = `${getApiBase()}/api/admin/evolution/proposals/${encodeURIComponent(
    69      proposalId
    70    )}/dry-run`;
    71
    72    const response = await fetch(url, {
    73      method: "POST",
    74      credentials: "include",
    75      headers,
    76      body: JSON.stringify({ dry_run: true }),
    77    });
    78
    79    const data = await parseResponse(response);
    80
    81    if (data?.execution_enabled !== false) {
    82      throw new Error("Dry-run retornou execution_enabled diferente de false.");
    83    }
    84
    85    if (data?.can_execute_real !== false) {
    86      throw new Error("Dry-run retornou can_execute_real diferente de false.");
    87    }
    88
    89    return data;
    90  }
=== GARANTINDO QUE NÃO HÁ JSX ===
OK: sem function Pill
OK: sem JSX span
=== BUILD LIMPO APÓS PATCH ===

> build
> node node_modules/vite/bin/vite.js build

vite v5.4.21 building for production...
✓ 67 modules transformed.
x Build failed in 947ms
error during build:
src/App.jsx (6:7): "default" is not exported by "src/routes/AuthPage.jsx", imported by "src/App.jsx".
file: /workspaces/orkio-web-PATCHD-patroai-integrated/src/App.jsx:6:7

4: import PatroaiLanding from "./routes/PatroaiLanding.jsx";
5: import Landing from "./routes/Landing.jsx";
6: import AuthPage from "./routes/AuthPage.jsx";
          ^
7: import AppConsole from "./routes/AppConsole.jsx";
8: import AdminConsole from "./routes/AdminConsole.jsx";

    at getRollupError (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/parseAst.js:402:41)
    at error (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/parseAst.js:398:42)
    at Module.error (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:17040:16)
    at Module.traceVariable (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:17452:29)
    at ModuleScope.findVariable (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:15070:39)
    at FunctionScope.findVariable (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:5673:38)
    at FunctionBodyScope.findVariable (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:5673:38)
    at Identifier.bind (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:5447:40)
    at CallExpression.bind (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:2825:28)
    at CallExpression.bind (file:///workspaces/orkio-web-PATCHD-patroai-integrated/node_modules/rollup/dist/es/shared/node-entry.js:12179:15)
@patroaiconsultech ➜ /workspaces/orkio-web-PATCHD-patroai-integrated (main) $ echo "=== EXPORTS DE AuthPage.jsx ==="
grep -n "export\|function\|const .*Auth\|function .*Auth" src/routes/AuthPage.jsx | head -120

echo "=== INICIO DO ARQUIVO ==="
sed -n '1,180p' src/routes/AuthPage.jsx
=== EXPORTS DE AuthPage.jsx ===
=== INICIO DO ARQUIVO ===
// AO-14C — AuthPage.jsx integration snippet
// Path: src/routes/AuthPage.jsx
//
// Apply this surgically to your existing login success handler.
// Do NOT replace the whole file blindly.

import { consumeReturnTo, DEFAULT_AFTER_LOGIN_PATH } from "../lib/authReturn";

// Inside AuthPage component:
const location = useLocation();
const navigate = useNavigate();

// In the existing login success block, replace the hardcoded navigation
// that currently sends Admin to console/chat with:

const destination = consumeReturnTo(location) || DEFAULT_AFTER_LOGIN_PATH;
navigate(destination, { replace: true });

// If your project uses window.location instead of react-router navigate,
// use:
//
// const destination = consumeReturnTo(window.location) || DEFAULT_AFTER_LOGIN_PATH;
// window.location.assign(destination);
@patroaiconsultech ➜ /workspaces/orkio-web-PATCHD-patroai-integrated (main) $ echo "=== BUSCANDO TELAS DE LOGIN/AUTH ==="
find src -maxdepth 4 -type f | sort | grep -Ei "auth|login|signin|sign-in|entrar" || true

echo "=== BUSCANDO USO DE /api/auth/login ==="
grep -R "api/auth/login\|/auth/login\|LOGIN\|login" src -n | head -120
=== BUSCANDO TELAS DE LOGIN/AUTH ===
src/lib/auth.js
src/lib/authReturn.js
src/routes/AuthPage.jsx
=== BUSCANDO USO DE /api/auth/login ===
src/routes/PatroaiLanding.jsx:56:    safeNavigateToAuth({ mode: "login" });
src/routes/AppConsole.jsx:4851:          alert("Sessão expirada. Faça login novamente.");
src/routes/AuthPage.jsx:4:// Apply this surgically to your existing login success handler.
src/routes/AuthPage.jsx:7:import { consumeReturnTo, DEFAULT_AFTER_LOGIN_PATH } from "../lib/authReturn";
src/routes/AuthPage.jsx:13:// In the existing login success block, replace the hardcoded navigation
src/routes/AuthPage.jsx:16:const destination = consumeReturnTo(location) || DEFAULT_AFTER_LOGIN_PATH;
src/routes/AuthPage.jsx:22:// const destination = consumeReturnTo(window.location) || DEFAULT_AFTER_LOGIN_PATH;
src/routes/AdminEvolutionCenter.jsx:326:              Faça login com uma conta Admin para governar propostas de evolução.
src/routes/AdminEvolutionCenter.jsx:329:              Ir para login
src/ui/TermsModal.jsx:6: * Blocking modal for first-login Terms acceptance.
src/ui/TermsModal.jsx:28:          if (!url.searchParams.get("mode")) url.searchParams.set("mode", "login");
src/lib/authReturn.js:5: * Preserve a safe in-app return path when a protected route sends the user to login.
src/lib/authReturn.js:15:export const DEFAULT_AFTER_LOGIN_PATH = "/app";
src/lib/authReturn.js:61:  if (!safeReturnTo) return "/login";
src/lib/authReturn.js:62:  return `/login?returnTo=${encodeURIComponent(safeReturnTo)}`;
src/lib/auth.js:243: * COMPLETE OTP LOGIN
src/lib/auth.js:249:    throw new Error("Invalid OTP login response");
@patroaiconsultech ➜ /workspaces/orkio-web-PATCHD-patroai-integrated (main) $ ^C
