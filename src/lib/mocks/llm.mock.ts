import type { LLMClassification } from "../../types/detection"

const mockPool: LLMClassification[] = [
  {
    pattern: "fake_urgency",
    confidence: 0.91,
    severity: "high",
    explanation: "A interface utiliza pressão temporal para acelerar decisões."
  },
  {
    pattern: "countdown_pressure",
    confidence: 0.82,
    severity: "medium",
    explanation: "Há sinal de contagem regressiva para apressar a decisão do usuário."
  },
  {
    pattern: "preselected_checkbox",
    confidence: 0.87,
    severity: "medium",
    explanation: "Uma opção relevante aparece pré-selecionada antes da escolha do usuário."
  },
  {
    pattern: "attention_grabbing_overlay",
    confidence: 0.76,
    severity: "medium",
    explanation: "Um overlay dominante pode direcionar a atenção de forma desproporcional."
  },
  {
    pattern: "disproportionate_cta",
    confidence: 0.74,
    severity: "low",
    explanation: "A CTA principal é visualmente muito mais forte que as alternativas."
  }
]

export const mockLLMClassifier = async (
  patternHint?: string
): Promise<LLMClassification> => {
  await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 600))

  const fallback = mockPool[Math.floor(Math.random() * mockPool.length)]

  if (!patternHint) {
    return fallback
  }

  const exact = mockPool.find((item) => item.pattern === patternHint)
  return exact || fallback
}
