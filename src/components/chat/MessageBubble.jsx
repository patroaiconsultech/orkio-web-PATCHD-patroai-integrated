import React from "react";

/**
 * AO65A — MessageBubble
 *
 * Refactor-only component extracted from AppConsole.jsx.
 *
 * Keep this component presentation-focused:
 * - no chat stream state
 * - no realtime state
 * - no fetch
 * - no backend calls except callbacks already provided by AppConsole
 * - no governance execution logic beyond rendering the existing buttons/callbacks
 */
export default function MessageBubble({
  message,
  styles,
  meName,
  lastAgentInfo,
  tryParseEvent,
  stripEventMarker,
  normalizeMessageSpeaker,
  resolveAssistantDisplayName,
  formatDateTime,
  formatTs,
  humanizeConsoleStatusMessage,
  normalizeUserFacingRuntimeMessage,
  renderMessageContentPremium,
  playTts,
  stopTts,
  ttsPlaying,
  ttsPlayingMessageId,
  extractPatchGovernanceMeta,
  openPatchApprovalModal,
  extractPatchApprovalMeta,
  executeApprovedPatchFromMessage,
  canAccessAdmin,
}) {
  const m = message || {};
  const isAssistant = m.role === "assistant";

  return (
    <div
      style={{
        ...styles.messageRow,
        justifyContent: m.role === "user" ? "flex-end" : (m.role === "system" ? "center" : "flex-start"),
      }}
    >
      {/* PATCH0100_14: Agent avatar */}
      {isAssistant && lastAgentInfo?.avatar_url && (
        <div style={{ marginRight: 8, flexShrink: 0, alignSelf: "flex-start", marginTop: 4 }}>
          <img
            src={lastAgentInfo.avatar_url}
            alt={resolveAssistantDisplayName(normalizeMessageSpeaker(m), "Orkio")}
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.15)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      )}
      <div
        style={{
          ...styles.messageBubble,
          ...(m.role === "user"
            ? styles.userBubble
            : m.role === "system"
            ? styles.systemBubble
            : styles.agentBubble),
        }}
      >
        {(() => {
          const evt = tryParseEvent(m.content);
          const isUser = m.role === "user";
          const isSystem = m.role === "system";
          const visibleRaw = stripEventMarker(m.content);
          const displayMessage =
            !isUser && !isSystem
              ? normalizeMessageSpeaker({
                  ...m,
                  content: visibleRaw || m.content || "",
                  text: visibleRaw || m.text || m.content || "",
                })
              : m;
          const name = isUser
            ? (m.user_name || meName)
            : (isSystem ? "Sistema" : resolveAssistantDisplayName(displayMessage, "Orkio"));
          const nameTone = isUser ? styles.nameUser : isSystem ? styles.nameSystem : styles.nameAgent;
          const created = formatDateTime(m.created_at);
          const visible = humanizeConsoleStatusMessage(normalizeUserFacingRuntimeMessage(visibleRaw || m.content));

          return (
            <>
              <div style={styles.bubbleHeaderRow}>
                <div style={{ ...styles.bubbleHeaderName, ...nameTone }}>{name}</div>
                <div style={styles.bubbleHeaderTime}>{created}</div>
              </div>

              {evt && evt.type === "file_upload" ? (
                <div style={styles.messageContent}>
                  <div style={{ fontWeight: 900 }}>📎 Upload registrado</div>
                  <div style={{ marginTop: 6 }}>{evt.filename || "arquivo"}</div>
                  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.78 }}>
                    {evt.text || `por ${evt.uploader_name || evt.uploader_email || "Usuário"} • ${formatTs(evt.ts || evt.created_at)}`}
                  </div>
                </div>
              ) : (
                <div style={styles.messageContent}>
                  {renderMessageContentPremium(visible || m.content)}
                  {!isUser && !isSystem && (visible || m.content) && (() => {
                    // AO65A-HF6: if any classic TTS is active, the next click must stop it immediately.
                    // Relying on message_id equality caused double-click stop failures when the active
                    // playback had a normalized/null/manual id.
                    const isAnyTtsPlaying = Boolean(ttsPlaying || ttsPlayingMessageId);
                    const isThisTtsPlaying = isAnyTtsPlaying;
                    const handleTtsClick = (event) => {
                      event?.preventDefault?.();
                      event?.stopPropagation?.();

                      if (isAnyTtsPlaying) {
                        stopTts?.("user_toggle");
                        return;
                      }

                      playTts((visible || m.content), (m.agent_id || null), {
                        messageId: m.id || null,
                        userInitiated: true,
                        // AO65A-HF7: do not pass message/agent voice as override; AppConsole resolves the same source used by Realtime.
                        voiceOverride: null,
                      });
                    };

                    return (
                      <button
                        type="button"
                        onClick={handleTtsClick}
                        style={{
                          marginLeft: "8px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          opacity: isThisTtsPlaying ? 0.95 : 0.6,
                          fontSize: "14px",
                          padding: "2px",
                        }}
                        title={isThisTtsPlaying ? "Parar áudio" : "Ouvir esta mensagem"}
                        aria-label={isThisTtsPlaying ? "Parar áudio" : "Ouvir esta mensagem"}
                      >
                        {isThisTtsPlaying ? "⏹️" : "🔊"}
                      </button>
                    );
                  })()}
                  {canAccessAdmin && !isUser && !isSystem && extractPatchGovernanceMeta(visible || m.content)?.can_approve && (
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        onClick={() => openPatchApprovalModal(m)}
                        style={{
                          border: "1px solid rgba(16,185,129,0.45)",
                          borderRadius: 999,
                          padding: "8px 12px",
                          background: "rgba(16,185,129,0.12)",
                          color: "#d1fae5",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                        title="Aprovar este patch com confirmação por senha"
                      >
                        Aprovar patch com senha
                      </button>
                    </div>
                  )}
                  {canAccessAdmin && !isUser && !isSystem && extractPatchApprovalMeta(visible || m.content)?.can_execute && (
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        data-patch-execute-button="true"
                        onClick={() => executeApprovedPatchFromMessage(m)}
                        style={{
                          border: "1px solid rgba(59,130,246,0.55)",
                          borderRadius: 999,
                          padding: "8px 12px",
                          background: "rgba(59,130,246,0.14)",
                          color: "#dbeafe",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                        title="Executar o fluxo governado aprovado sem passar pelo chat"
                      >
                        Executar patch aprovado
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
