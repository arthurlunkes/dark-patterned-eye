import type { LLMClassification } from "../../types/detection"

const mockPool: LLMClassification[] = [
  {
    pattern: "fake_urgency",
    confidence: 0.91,
    severity: "high",
    explanation: "A interface utiliza pressão temporal para acelerar decisões."
  },
  {
    pattern: "confirmshaming",
    confidence: 0.84,
    severity: "medium",
    explanation: "O texto de recusa sugere culpa ou constrangimento para o usuário."
  },
  {
    pattern: "forced_action",
    confidence: 0.79,
    severity: "medium",
    explanation: "O fluxo incentiva uma ação obrigatória para concluir a tarefa."
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
