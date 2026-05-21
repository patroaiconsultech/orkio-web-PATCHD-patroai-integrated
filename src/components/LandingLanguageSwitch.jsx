import React, { useMemo } from "react";

/**
 * AO-05C — LandingLanguageSwitch
 *
 * Componente propositalmente autônomo e com estilo inline.
 * Motivo: o seletor de idioma precisa aparecer mesmo se o header,
 * as actions ou os estilos responsivos da landing forem alterados.
 */

const SUPPORTED_LANGS = ["pt", "en"];

function normalizeLang(value) {
  const raw = String(value || "").trim().toLowerCase();
  return SUPPORTED_LANGS.includes(raw) ? raw : "pt";
}

function getCurrentLang() {
  if (typeof window === "undefined") return "pt";

  try {
    const url = new URL(window.location.href);
    const fromUrl = normalizeLang(url.searchParams.get("lang"));
    if (url.searchParams.has("lang")) return fromUrl;

    const stored = normalizeLang(window.localStorage?.getItem("orkio_landing_lang"));
    return stored;
  } catch {
    return "pt";
  }
}

function buildNextHref(lang) {
  if (typeof window === "undefined") return `?lang=${lang}`;

  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return `?lang=${lang}`;
  }
}

export default function LandingLanguageSwitch() {
  const currentLang = getCurrentLang();

  const labels = useMemo(
    () => ({
      pt: currentLang === "en" ? "Portuguese" : "Português",
      en: currentLang === "en" ? "English" : "Inglês",
      aria: currentLang === "en" ? "Select landing language" : "Selecionar idioma da landing",
    }),
    [currentLang]
  );

  function selectLang(lang) {
    try {
      window.localStorage?.setItem("orkio_landing_lang", lang);
    } catch {}

    const href = buildNextHref(lang);
    window.location.assign(href);
  }

  const shellStyle = {
    position: "fixed",
    top: "max(14px, env(safe-area-inset-top))",
    right: "max(14px, env(safe-area-inset-right))",
    zIndex: 2147483647,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: 6,
    borderRadius: 999,
    border: "1px solid rgba(247,200,98,0.42)",
    background: "rgba(2,6,11,0.82)",
    boxShadow: "0 12px 34px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.045) inset",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    pointerEvents: "auto",
    isolation: "isolate",
  };

  const buttonBase = {
    minWidth: 44,
    minHeight: 32,
    border: 0,
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    pointerEvents: "auto",
    WebkitAppearance: "none",
    appearance: "none",
  };

  function buttonStyle(lang) {
    const active = currentLang === lang;
    return {
      ...buttonBase,
      color: active ? "#08111b" : "rgba(255,255,255,0.82)",
      background: active
        ? "linear-gradient(135deg, #fff0bd, #f7c862 54%, #a76f19)"
        : "rgba(255,255,255,0.07)",
      boxShadow: active ? "0 8px 20px rgba(247,200,98,0.22)" : "none",
    };
  }

  return (
    <nav style={shellStyle} aria-label={labels.aria} data-orkio-language-switch="true">
      <button type="button" style={buttonStyle("pt")} onClick={() => selectLang("pt")} aria-pressed={currentLang === "pt"}>
        PT
      </button>
      <button type="button" style={buttonStyle("en")} onClick={() => selectLang("en")} aria-pressed={currentLang === "en"}>
        EN
      </button>
    </nav>
  );
}

export { getCurrentLang, normalizeLang };
