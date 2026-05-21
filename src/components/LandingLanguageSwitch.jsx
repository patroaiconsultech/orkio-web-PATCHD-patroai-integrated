import React from "react";
import { LANDING_LOCALES, normalizeLandingLocale } from "../lib/landingLocale.js";

export default function LandingLanguageSwitch({
  locale = "pt",
  onChange,
  compact = false,
  tone = "dark",
  fixed = false,
}) {
  const activeLocale = normalizeLandingLocale(locale);

  return (
    <div
      className={`landing-language-switch ${compact ? "is-compact" : ""} ${fixed ? "is-fixed" : ""} is-${tone}`}
      aria-label={activeLocale === "en" ? "Language selector" : "Seletor de idioma"}
      role="group"
    >
      <style>{`
        .landing-language-switch {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          border-radius: 999px;
          border: 1px solid rgba(245,196,81,0.22);
          background: rgba(0,0,0,0.24);
          backdrop-filter: blur(12px);
        }

        .landing-language-switch.is-fixed {
          position: fixed;
          top: max(14px, env(safe-area-inset-top));
          right: max(14px, env(safe-area-inset-right));
          z-index: 9999;
          box-shadow: 0 18px 50px rgba(0,0,0,0.34);
        }

        .landing-language-switch.is-light {
          border-color: rgba(37,99,235,0.18);
          background: rgba(255,255,255,0.72);
        }

        .landing-language-switch button {
          min-width: 42px;
          min-height: 34px;
          border: 0;
          border-radius: 999px;
          padding: 0 10px;
          color: rgba(255,255,255,0.72);
          background: transparent;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .landing-language-switch.is-light button {
          color: rgba(15,23,42,0.70);
        }

        .landing-language-switch button:hover {
          transform: translateY(-1px);
          color: #f8dfa3;
        }

        .landing-language-switch.is-light button:hover {
          color: #1d4ed8;
        }

        .landing-language-switch button.is-active {
          color: #080807;
          background: linear-gradient(135deg, #f8dfa3 0%, #f2bf42 52%, #a76b14 100%);
          box-shadow: 0 10px 24px rgba(245,196,81,0.18);
        }

        .landing-language-switch.is-compact button {
          min-width: 38px;
          min-height: 30px;
          font-size: 11px;
        }

        @media (max-width: 760px) {
          .landing-language-switch {
            order: -1;
          }

          .landing-language-switch.is-fixed {
            top: max(10px, env(safe-area-inset-top));
            right: max(10px, env(safe-area-inset-right));
          }
        }
      `}</style>

      {LANDING_LOCALES.map((item) => (
        <button
          key={item.value}
          type="button"
          title={item.title}
          aria-pressed={activeLocale === item.value}
          className={activeLocale === item.value ? "is-active" : ""}
          onClick={() => onChange?.(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
