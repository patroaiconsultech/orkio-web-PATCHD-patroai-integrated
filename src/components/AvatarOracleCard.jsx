import React from "react";

export default function AvatarOracleCard({
  name = "Orkio",
  avatarSrc = "/assets/orkio-seraphic-feminine.png",
  online = true,
  onStartChat,
}) {
  const styles = {
    card: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 32,
      border: "1px solid rgba(255,224,156,0.22)",
      background:
        "radial-gradient(circle at 50% 0%, rgba(255,223,138,0.12), transparent 22%), linear-gradient(180deg, rgba(4,7,14,0.98), rgba(8,12,22,0.94))",
      boxShadow:
        "0 36px 110px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 90px rgba(255,206,107,0.12)",
      padding: 20,
      minHeight: 620,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backdropFilter: "blur(24px)",
      isolation: "isolate",
    },
    bgAura: {
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at 50% 14%, rgba(255,223,150,0.24) 0%, rgba(255,199,86,0.12) 20%, rgba(122,93,255,0.12) 44%, rgba(0,0,0,0) 72%)",
      pointerEvents: "none",
    },
    ring: {
      position: "absolute",
      inset: 18,
      borderRadius: 28,
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
      pointerEvents: "none",
    },
    portraitWrap: {
      position: "relative",
      zIndex: 1,
      minHeight: 390,
      borderRadius: 28,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.07)",
      background:
        "radial-gradient(circle at 50% 18%, rgba(255,219,136,0.34), rgba(28,32,56,0.88) 36%, rgba(8,10,18,1) 74%)",
      display: "grid",
      placeItems: "center",
    },
    haloOuter: {
      position: "absolute",
      width: 340,
      height: 340,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,229,163,0.64) 0%, rgba(255,206,112,0.24) 34%, rgba(118,144,255,0.14) 58%, rgba(0,0,0,0) 76%)",
      filter: "blur(8px)",
      opacity: 0.94,
    },
    haloInner: {
      position: "absolute",
      width: 190,
      height: 190,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,242,204,0.96) 0%, rgba(255,227,153,0.36) 34%, rgba(0,0,0,0) 68%)",
      filter: "blur(6px)",
      opacity: 0.96,
    },
    portrait: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      height: "100%",
      minHeight: 390,
      objectFit: "cover",
      objectPosition: "center top",
      mixBlendMode: "screen",
      opacity: 0.99,
    },
    badgeRow: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      zIndex: 3,
      flexWrap: "wrap",
    },
    status: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 13px",
      borderRadius: 999,
      background: "rgba(7,12,22,0.74)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "rgba(255,255,255,0.94)",
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.02em",
      backdropFilter: "blur(14px)",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: online ? "#7ef0b4" : "#ffcc79",
      boxShadow: online ? "0 0 14px rgba(126,240,180,0.8)" : "0 0 14px rgba(255,204,121,0.8)",
    },
    body: {
      position: "relative",
      zIndex: 2,
      paddingTop: 18,
    },
    kicker: {
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(255,224,156,0.88)",
      marginBottom: 8,
    },
    greeting: {
      fontSize: 19,
      fontWeight: 800,
      color: "#ffffff",
      marginBottom: 12,
    },
    title: {
      fontSize: 33,
      lineHeight: 1.06,
      fontWeight: 900,
      color: "#ffffff",
      margin: 0,
      letterSpacing: "-0.035em",
    },
    accent: {
      color: "#ffd975",
    },
    copy: {
      marginTop: 16,
      color: "rgba(255,255,255,0.76)",
      fontSize: 15,
      lineHeight: 1.68,
    },
    points: {
      display: "grid",
      gap: 10,
      marginTop: 18,
    },
    point: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "rgba(255,255,255,0.80)",
      fontSize: 14,
      lineHeight: 1.45,
    },
    pointDot: {
      width: 8,
      height: 8,
      flex: "0 0 auto",
      borderRadius: "50%",
      background: "linear-gradient(180deg, #ffe29c, #f7c862)",
      boxShadow: "0 0 16px rgba(247,200,98,0.45)",
    },
    action: {
      marginTop: 24,
      width: "100%",
      border: "none",
      borderRadius: 20,
      padding: "17px 18px",
      background:
        "linear-gradient(90deg, rgba(122,74,255,0.96), rgba(197,95,255,0.95) 50%, rgba(255,218,120,0.97))",
      color: "#fff",
      fontWeight: 900,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 18px 44px rgba(123,74,255,0.34)",
    },
    micro: {
      marginTop: 12,
      color: "rgba(255,255,255,0.56)",
      fontSize: 12,
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
    },
    microChip: {
      borderRadius: 999,
      padding: "7px 10px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
    },
  };

  return (
    <aside style={styles.card}>
      <div style={styles.bgAura} />
      <div style={styles.ring} />

      <div style={styles.portraitWrap}>
        <div style={styles.badgeRow}>
          <div style={styles.status}>
            <span style={styles.dot} />
            {online ? "Avatar guiado ativo" : "Modo observação"}
          </div>
          <div style={styles.status}>Onboarding premium</div>
        </div>

        <div style={styles.haloOuter} />
        <div style={styles.haloInner} />

        {avatarSrc ? (
          <img src={avatarSrc} alt={name} style={styles.portrait} />
        ) : (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: 230,
              height: 300,
              borderRadius: "48% 48% 42% 42% / 36% 36% 46% 46%",
              background:
                "linear-gradient(180deg, rgba(255,245,220,0.92), rgba(255,221,158,0.75) 28%, rgba(188,164,255,0.42) 62%, rgba(18,24,40,0.12))",
              boxShadow: "0 0 60px rgba(255,213,116,0.22)",
            }}
          />
        )}
      </div>

      <div style={styles.body}>
        <div style={styles.kicker}>Presença guiada</div>
        <div style={styles.greeting}>Olá. Eu sou o {name}.</div>
        <h3 style={styles.title}>
          Posso abrir seu <span style={styles.accent}>onboarding guiado</span> com contexto,
          voz e direção estratégica desde o primeiro clique.
        </h3>

        <div style={styles.copy}>
          Esta experiência aproxima a landing do console: o avatar conduz a entrada,
          preserva intenção, ativa o onboarding e prepara a primeira conversa com
          mais beleza, serenidade e clareza.
        </div>

        <div style={styles.points}>
          <div style={styles.point}><span style={styles.pointDot} />Entrada guiada pela Orkio com estética premium.</div>
          <div style={styles.point}><span style={styles.pointDot} />Onboarding escrito com presença visual do avatar.</div>
          <div style={styles.point}><span style={styles.pointDot} />Introdução falada para primeira experiência mais viva.</div>
        </div>

        <button type="button" style={styles.action} onClick={() => onStartChat?.()}>
          Iniciar onboarding com o avatar →
        </button>

        <div style={styles.micro}>
          <span style={styles.microChip}>Contexto preservado</span>
          <span style={styles.microChip}>Voz feminina</span>
          <span style={styles.microChip}>Primeira jornada guiada</span>
        </div>
      </div>
    </aside>
  );
}
