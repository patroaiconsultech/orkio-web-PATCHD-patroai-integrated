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
      borderRadius: 30,
      border: "1px solid rgba(255,220,140,0.22)",
      background: "linear-gradient(180deg, rgba(5,8,16,0.97), rgba(7,11,20,0.92))",
      boxShadow:
        "0 32px 90px rgba(0,0,0,0.46), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 90px rgba(255,207,102,0.10)",
      padding: 18,
      minHeight: 560,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backdropFilter: "blur(20px)",
    },
    bgAura: {
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at 50% 14%, rgba(255,223,150,0.24) 0%, rgba(255,199,86,0.10) 18%, rgba(122,93,255,0.10) 40%, rgba(0,0,0,0) 68%)",
      pointerEvents: "none",
    },
    ring: {
      position: "absolute",
      inset: "18px",
      borderRadius: 26,
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
      pointerEvents: "none",
    },
    portraitWrap: {
      position: "relative",
      zIndex: 1,
      minHeight: 370,
      borderRadius: 26,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.06)",
      background:
        "radial-gradient(circle at 50% 18%, rgba(255,219,136,0.30), rgba(28,32,56,0.88) 36%, rgba(8,10,18,1) 72%)",
      display: "grid",
      placeItems: "center",
    },
    haloOuter: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,229,163,0.62) 0%, rgba(255,206,112,0.22) 32%, rgba(118,144,255,0.12) 54%, rgba(0,0,0,0) 72%)",
      filter: "blur(8px)",
      opacity: 0.92,
    },
    haloInner: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,242,204,0.94) 0%, rgba(255,227,153,0.34) 32%, rgba(0,0,0,0) 66%)",
      filter: "blur(5px)",
      opacity: 0.95,
    },
    portrait: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      height: "100%",
      minHeight: 370,
      objectFit: "cover",
      objectPosition: "center top",
      mixBlendMode: "screen",
      opacity: 0.985,
    },
    badgeRow: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 3,
    },
    status: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 999,
      background: "rgba(7,12,22,0.72)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "rgba(255,255,255,0.92)",
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.02em",
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
    greeting: {
      fontSize: 18,
      fontWeight: 800,
      color: "#ffffff",
      marginBottom: 10,
    },
    title: {
      fontSize: 30,
      lineHeight: 1.08,
      fontWeight: 900,
      color: "#ffffff",
      margin: 0,
      letterSpacing: "-0.03em",
    },
    accent: {
      color: "#ffd975",
    },
    copy: {
      marginTop: 14,
      color: "rgba(255,255,255,0.74)",
      fontSize: 15,
      lineHeight: 1.65,
    },
    action: {
      marginTop: 22,
      width: "100%",
      border: "none",
      borderRadius: 18,
      padding: "16px 18px",
      background:
        "linear-gradient(90deg, rgba(122,74,255,0.96), rgba(197,95,255,0.95) 54%, rgba(255,218,120,0.97))",
      color: "#fff",
      fontWeight: 900,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 18px 42px rgba(123,74,255,0.34)",
    },
    micro: {
      marginTop: 10,
      color: "rgba(255,255,255,0.54)",
      fontSize: 12,
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
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
            {online ? "Orkio online" : "Modo observação"}
          </div>
          <div style={styles.status}>Presença serafim</div>
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
        <div style={styles.greeting}>Olá. Eu sou o {name}.</div>
        <h3 style={styles.title}>
          Uma presença <span style={styles.accent}>feminina, serena e luminosa</span> para conversar com sua empresa.
        </h3>
        <div style={styles.copy}>
          O Orkio pode se apresentar com uma estética mais acolhedora, espiritualizada e premium,
          sem perder autoridade técnica. Esta versão transmite inteligência com doçura,
          clareza e confiança.
        </div>

        <button type="button" style={styles.action} onClick={onStartChat}>
          Conversar agora
        </button>

        <div style={styles.micro}>
          <span>Voz sugerida: shimmer</span>
          <span>•</span>
          <span>Perfil: feminino etéreo</span>
          <span>•</span>
          <span>Ritmo: 0.90</span>
        </div>
      </div>
    </aside>
  );
}
