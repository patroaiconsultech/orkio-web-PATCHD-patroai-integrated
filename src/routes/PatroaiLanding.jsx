import React, { useMemo, useState } from "react";
import AvatarOracleCard from "../components/AvatarOracleCard.jsx";
import AvatarPrechatModal from "../components/AvatarPrechatModal.jsx";
import OrkioVoiceHero from "../components/OrkioVoiceHero.jsx";

function safeNavigateToAuth(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    query.set(key, String(value));
  });
  window.location.href = `/auth${query.toString() ? `?${query.toString()}` : ""}`;
}

export default function PatroaiLanding() {
  const [prechatOpen, setPrechatOpen] = useState(false);

  const heroSubtitle = useMemo(
    () =>
      "Uma jornada de ativação guiada por avatar, com conversa inicial antes do cadastro para gerar contexto, presença e encantamento.",
    []
  );

  function handleStartAvatarJourney() {
    setPrechatOpen(true);
  }

  function handleContinueAfterPrechat() {
    setPrechatOpen(false);
    safeNavigateToAuth({ entry: "avatar", onboarding: 1, prechat: 1 });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(191,219,254,0.55), rgba(248,250,252,1) 38%, rgba(238,242,255,1) 100%)",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "48px 20px 72px",
          display: "grid",
          gap: 28,
        }}
      >
        <div style={{ display: "grid", gap: 18, maxWidth: 820 }}>
          <div style={{ fontSize: 13, letterSpacing: "0.12em", fontWeight: 800, color: "#31508e", textTransform: "uppercase" }}>
            Orkio • Landing Premium
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(40px, 6vw, 74px)", lineHeight: 0.98, letterSpacing: "-0.04em" }}>
            A primeira conversa começa antes do cadastro.
          </h1>
          <p style={{ margin: 0, maxWidth: 760, fontSize: 18, lineHeight: 1.7, color: "#334155" }}>
            {heroSubtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <OrkioVoiceHero onPrimaryAction={handleStartAvatarJourney} />

          <AvatarOracleCard
            title="Entrar com a Orkio"
            subtitle="Comece com uma microconversa guiada antes do login."
            ctaLabel="Iniciar conversa com avatar"
            onAction={handleStartAvatarJourney}
          />
        </div>
      </section>

      <AvatarPrechatModal
        open={prechatOpen}
        onClose={() => setPrechatOpen(false)}
        onContinue={handleContinueAfterPrechat}
        autoSpeak={true}
      />
    </div>
  );
}
