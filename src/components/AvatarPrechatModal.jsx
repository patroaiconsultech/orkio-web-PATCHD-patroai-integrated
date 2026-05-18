import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "orkio_prechat_context";
const TTL_MS = 15 * 60 * 1000;

const QUESTIONS = [
  {
    id: "name",
    label: "Como posso te chamar?",
    placeholder: "Seu nome",
    type: "text",
  },
  {
    id: "challenge",
    label: "Qual é o principal desafio que você quer resolver hoje?",
    placeholder: "Ex.: organizar operação, vender mais, integrar sistemas...",
    type: "textarea",
  },
  {
    id: "goal",
    label: "Se a Orkio te ajudasse muito bem, o que mudaria nos próximos 90 dias?",
    placeholder: "Ex.: ganhar velocidade, melhorar gestão, automatizar processos...",
    type: "textarea",
  },
];

function safeSpeak(text, enabled = true) {
  if (!enabled) return;
  try {
    const synth = window?.speechSynthesis;
    if (!synth || typeof window?.SpeechSynthesisUtterance !== "function") return;
    synth.cancel?.();
    const utter = new window.SpeechSynthesisUtterance(String(text || ""));
    utter.lang = "pt-BR";
    utter.rate = 0.96;
    utter.pitch = 1.02;
    synth.speak(utter);
  } catch {}
}

function buildDiagnosis(answers) {
  const challenge = String(answers?.challenge || "").trim();
  const goal = String(answers?.goal || "").trim();

  if (/integra|api|crm|erp|sistema|autom/i.test(`${challenge} ${goal}`)) {
    return "Há sinal de necessidade de integração e ganho operacional com ativação guiada.";
  }
  if (/venda|cliente|comercial|pipeline|receita/i.test(`${challenge} ${goal}`)) {
    return "Há sinal de foco em crescimento comercial e aceleração da operação.";
  }
  return "Há sinal de busca por clareza estratégica, organização e execução assistida.";
}

function persistPrechatContext(answers) {
  const payload = {
    version: 1,
    source: "avatar_public_prechat",
    created_at: Date.now(),
    expires_at: Date.now() + TTL_MS,
    trial_days: 7,
    answers,
    diagnosis: buildDiagnosis(answers),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
  return payload;
}

export default function AvatarPrechatModal({
  open,
  onClose,
  onContinue,
  autoSpeak = true,
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    name: "",
    challenge: "",
    goal: "",
  });

  const activeQuestion = QUESTIONS[step] || QUESTIONS[0];
  const introSpokenRef = useRef(false);

  const completionPreview = useMemo(() => {
    return buildDiagnosis(answers);
  }, [answers]);

  useEffect(() => {
    if (!open) return;
    if (introSpokenRef.current) return;
    introSpokenRef.current = true;
    safeSpeak(
      "Olá. Eu sou a Orkio. Antes do seu cadastro, quero entender rapidamente o seu momento para iniciar uma jornada mais inteligente com você.",
      autoSpeak
    );
  }, [open, autoSpeak]);

  useEffect(() => {
    if (!open) return;
    safeSpeak(activeQuestion?.label, autoSpeak);
  }, [open, step, activeQuestion, autoSpeak]);

  useEffect(() => {
    if (!open) {
      introSpokenRef.current = false;
    }
  }, [open]);

  if (!open) return null;

  const value = answers[activeQuestion.id] || "";
  const isLast = step === QUESTIONS.length - 1;

  function setField(nextValue) {
    setAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: nextValue,
    }));
  }

  function handleNext() {
    if (!String(value || "").trim()) return;
    if (!isLast) {
      setStep((prev) => prev + 1);
      return;
    }
    const payload = persistPrechatContext(answers);
    safeSpeak(
      "Perfeito. Já tenho um diagnóstico inicial. Agora vamos continuar sua jornada com o cadastro para que eu personalize a sua experiência.",
      autoSpeak
    );
    onContinue?.(payload);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        background: "rgba(5,8,18,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          borderRadius: 28,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(245,248,255,0.98) 0%, rgba(235,241,255,0.98) 100%)",
          boxShadow: "0 28px 80px rgba(15,23,42,0.26)",
          border: "1px solid rgba(148,163,184,0.25)",
        }}
      >
        <div
          style={{
            padding: "24px 24px 12px",
            background:
              "radial-gradient(circle at top left, rgba(191,219,254,0.95), rgba(255,255,255,0.98))",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: "0.12em", fontWeight: 800, color: "#31508e", textTransform: "uppercase" }}>
            Jornada do Avatar
          </div>
          <h2 style={{ margin: "10px 0 8px", fontSize: 30, lineHeight: 1.1, color: "#0f172a" }}>
            Antes do cadastro, deixe a Orkio te conhecer.
          </h2>
          <p style={{ margin: 0, color: "#334155", fontSize: 15, lineHeight: 1.6 }}>
            Vou te fazer algumas perguntas rápidas para começar com mais contexto, clareza e presença.
          </p>
        </div>

        <div style={{ padding: 24, display: "grid", gap: 18 }}>
          <div
            style={{
              display: "grid",
              gap: 8,
              padding: 18,
              borderRadius: 22,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(148,163,184,0.22)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, color: "#31508e" }}>
              Pergunta {step + 1} de {QUESTIONS.length}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{activeQuestion.label}</div>

            {activeQuestion.type === "textarea" ? (
              <textarea
                value={value}
                onChange={(e) => setField(e.target.value)}
                placeholder={activeQuestion.placeholder}
                rows={4}
                style={{
                  width: "100%",
                  borderRadius: 18,
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  padding: "14px 16px",
                  fontSize: 15,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            ) : (
              <input
                value={value}
                onChange={(e) => setField(e.target.value)}
                placeholder={activeQuestion.placeholder}
                style={{
                  width: "100%",
                  borderRadius: 18,
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  color: "#0f172a",
                  padding: "14px 16px",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 20,
              background: "rgba(15,23,42,0.04)",
              border: "1px solid rgba(148,163,184,0.2)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#31508e", marginBottom: 8 }}>
              Diagnóstico inicial
            </div>
            <div style={{ color: "#1e293b", fontSize: 14, lineHeight: 1.6 }}>
              {completionPreview}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                border: "1px solid rgba(148,163,184,0.35)",
                background: "#fff",
                color: "#0f172a",
                borderRadius: 999,
                padding: "12px 18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Fechar por agora
            </button>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                  style={{
                    border: "1px solid rgba(148,163,184,0.35)",
                    background: "#fff",
                    color: "#0f172a",
                    borderRadius: 999,
                    padding: "12px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Voltar
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!String(value || "").trim()}
                style={{
                  border: "none",
                  background: !String(value || "").trim()
                    ? "linear-gradient(135deg, #94a3b8, #94a3b8)"
                    : "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "12px 18px",
                  fontWeight: 800,
                  cursor: !String(value || "").trim() ? "not-allowed" : "pointer",
                }}
              >
                {isLast ? "Continuar jornada" : "Próxima pergunta"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
