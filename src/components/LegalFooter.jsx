import React from "react";

export default function LegalFooter({ compact = false }) {
  return (
    <section className={`orkio-legal-footer ${compact ? "is-compact" : ""}`} aria-label="Termos legais da PatroAI">
      <style>{`
        .orkio-legal-footer {
          width: min(1560px, calc(100% - 40px));
          margin: 54px auto 0;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 26px;
          background:
            radial-gradient(580px 220px at 0% 0%, rgba(245,196,81,0.10), transparent 58%),
            rgba(255,255,255,0.035);
          padding: 18px 20px;
          color: rgba(248,250,252,0.74);
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
        }

        .orkio-legal-footer.is-compact {
          margin-top: 34px;
        }

        .orkio-legal-footer strong {
          display: block;
          color: #f8dfa3;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .orkio-legal-footer p {
          margin: 0;
          font-size: 13px;
          line-height: 1.55;
        }

        .orkio-legal-footer__links {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 10px;
        }

        .orkio-legal-footer__links a {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(245,196,81,0.22);
          padding: 0 14px;
          color: #f8dfa3;
          background: rgba(0,0,0,0.22);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .orkio-legal-footer__links a:hover {
          border-color: rgba(245,196,81,0.44);
        }

        @media (max-width: 760px) {
          .orkio-legal-footer {
            width: min(100% - 24px, 1560px);
            grid-template-columns: 1fr;
            align-items: start;
          }

          .orkio-legal-footer__links {
            justify-content: flex-start;
          }
        }
      `}</style>

      <div>
        <strong>Transparência, consentimento e governança</strong>
        <p>
          Ao iniciar sua jornada, você poderá revisar os termos de uso, a política de privacidade
          e as condições de tratamento de dados conforme a LGPD.
        </p>
      </div>

      <nav className="orkio-legal-footer__links" aria-label="Links legais">
        <a href="/legal/terms.html" target="_blank" rel="noreferrer">Termos de uso</a>
        <a href="/legal/privacy.html" target="_blank" rel="noreferrer">Privacidade</a>
        <a href="/auth?mode=register&legal=1">Aceite e cadastro</a>
      </nav>
    </section>
  );
}
