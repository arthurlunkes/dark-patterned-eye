import type { AnalyzedElement, HeuristicResult } from "../../types/detection"

const urgencyRegex = /(ultima chance|somente hoje|apenas hoje|last chance|limited time)/i
const timerRegex = /(\d{1,2}:\d{2}(:\d{2})?|termina em|ends in|countdown)/i

export const runHeuristics = (elements: AnalyzedElement[]): HeuristicResult => {
  let score = 0
  const patterns = new Set<string>()
  const reasons = new Set<string>()
  const matchedElementIds = new Set<string>()

  const visibleElements = elements.filter((el) => el.visible)

  for (const element of visibleElements) {
    const text = element.text.toLowerCase()

    if (urgencyRegex.test(text)) {
      score += 22
      patterns.add("fake_urgency")
      reasons.add("Texto com pressão temporal detectado")
      matchedElementIds.add(element.id)
    }

    if (timerRegex.test(text)) {
      score += 18
      patterns.add("countdown_pressure")
      reasons.add("Indicador de contagem regressiva encontrado")
      matchedElementIds.add(element.id)
    }

    if (element.tagName === "input" && element.type === "checkbox" && element.isChecked) {
      score += 20
      patterns.add("preselected_checkbox")
      reasons.add("Checkbox pre-marcado em área de decisão")
      matchedElementIds.add(element.id)
    }

    const area = element.rect.width * element.rect.height
    if (area > 75000 && element.zIndex >= 999) {
      score += 14
      patterns.add("attention_grabbing_overlay")
      reasons.add("Overlay dominante com alto z-index")
      matchedElementIds.add(element.id)
    }

    if (element.tagName === "button" && element.styles.fontWeight >= 700 && element.rect.width >= 280) {
      score += 12
      patterns.add("disproportionate_cta")
      reasons.add("CTA visualmente desproporcional")
      matchedElementIds.add(element.id)
    }
  }

  return {
    suspicionScore: Math.min(100, score),
    possiblePatterns: Array.from(patterns),
    reasons: Array.from(reasons),
    matchedElementIds: Array.from(matchedElementIds)
  }
}
