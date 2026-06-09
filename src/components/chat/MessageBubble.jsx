# AO64D-HF6D_PUBLIC_BETA_RENDER_GUARD
# DESTINO: orkio-web-PATCHD-patroai-integrated/src/components/chat/MessageBubble.jsx
# MODO: PATCH_MINIMUM / frontend-only
#
# Objetivo:
# Garantir que a sanitização pública aplicada por normalizeMessageSpeaker()
# seja usada também no texto renderizado e no TTS.
#
# Problema atual:
# MessageBubble chama normalizeMessageSpeaker(...), mas depois renderiza
# "visibleRaw || m.content", ignorando displayMessage.content já sanitizado.
#
# TROCAR dentro do bloco:
#
# {(() => {
#   const evt = tryParseEvent(m.content);
#   const isUser = m.role === "user";
#   const isSystem = m.role === "system";
#   const visibleRaw = stripEventMarker(m.content);
#   const displayMessage = !isUser && !isSystem ? normalizeMessageSpeaker({
#     ...m,
#     content: visibleRaw || m.content || "",
#     text: visibleRaw || m.text || m.content || "",
#   }) : m;
#   const name = ...
#   const visible = humanizeConsoleStatusMessage(normalizeUserFacingRuntimeMessage(visibleRaw || m.content));
#
# POR:
#
{
(() => {
  const evt = tryParseEvent(m.content);
  const isUser = m.role === "user";
  const isSystem = m.role === "system";
  const visibleRaw = stripEventMarker(m.content);

  const displayMessage = !isUser && !isSystem
    ? normalizeMessageSpeaker({
        ...m,
        content: visibleRaw || m.content || "",
        text: visibleRaw || m.text || m.content || "",
      })
    : m;

  const visibleSource = !isUser && !isSystem
    ? (
        displayMessage?.content ||
        displayMessage?.text ||
        visibleRaw ||
        m.content ||
        ""
      )
    : (visibleRaw || m.content || "");

  const name = isUser
    ? (m.user_name || meName)
    : (isSystem ? "Sistema" : resolveAssistantDisplayName(displayMessage, "Orkio"));

  const nameTone = isUser ? styles.nameUser : isSystem ? styles.nameSystem : styles.nameAgent;
  const created = formatDateTime(m.created_at);
  const visible = humanizeConsoleStatusMessage(normalizeUserFacingRuntimeMessage(visibleSource));

  return (
    <>
      {/* manter o JSX existente abaixo, mas trocar todos os usos de (visible || m.content)
          por (visible || visibleSource) dentro deste bloco */}
    </>
  );
})()
}

# Depois, ainda no mesmo bloco, trocar:
#
# renderMessageContentPremium(visible || m.content)
# por:
# renderMessageContentPremium(visible || visibleSource)
#
# trocar:
# playTts((visible || m.content), ...)
# por:
# playTts((visible || visibleSource), ...)
#
# trocar:
# extractPatchGovernanceMeta(visible || m.content)
# por:
# extractPatchGovernanceMeta(visible || visibleSource)
#
# trocar:
# extractPatchApprovalMeta(visible || m.content)
# por:
# extractPatchApprovalMeta(visible || visibleSource)

# Checklist:
# [ ] Build frontend passa.
# [ ] A frase "Chris (CFO) ou Orion (CTO)" não aparece mais no balão.
# [ ] TTS também lê o texto sanitizado, não o texto bruto.
# [ ] Orkio continua sendo speaker público.
# [ ] Backend não foi alterado.
