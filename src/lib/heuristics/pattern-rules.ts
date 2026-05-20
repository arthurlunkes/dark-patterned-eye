import type { AnalyzedElement, HeuristicResult } from "../../types/detection"

const urgencyRegex = /(ultima chance|somente hoje|apenas hoje|last chance|limited time)/i
const marketingPressureRegex = /(aposte|registre-se|baixe|assine|comece|garanta|economize|aproveite|inscreva-se|experimente|teste|descubra|vender|vendas|crescer|converta|ganhe|promo)/i
const countdownKeywordRegex =
  /(termina em|ends in|countdown|tempo restante|restam|faltam|expira|expires)/i
const timerClockRegex = /\b\d{1,2}:\d{2}(:\d{2})?\b/
const likelyDateOrClockRegex =
  /(\b(19|20)\d{2}\b|janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|\b(am|pm|gmt|utc)\b|horario|server time)/i
const countdownContextRegex = /(countdown|promo|offer|deal|flash|sale|expires|expira|remaining)/i

const isLikelyCountdown = (element: AnalyzedElement, text: string): boolean => {
  if (countdownKeywordRegex.test(text)) {
    return true
  }

  if (!timerClockRegex.test(text)) {
    return false
  }

  if (likelyDateOrClockRegex.test(text)) {
    return false
  }

  return countdownContextRegex.test(element.selector)
}

export const runHeuristics = (elements: AnalyzedElement[]): HeuristicResult => {
  let score = 0
  const patterns = new Set<string>()
  const reasons = new Set<string>()
  const matchedElementIds = new Set<string>()
  const matchedElementIdsByPattern: Record<string, string[]> = {}

  const registerPatternMatch = (pattern: string, reason: string, elementId: string, points: number) => {
    score += points
    patterns.add(pattern)
    reasons.add(reason)
    matchedElementIds.add(elementId)

    if (!matchedElementIdsByPattern[pattern]) {
      matchedElementIdsByPattern[pattern] = []
    }

    matchedElementIdsByPattern[pattern].push(elementId)
  }

  const visibleElements = elements.filter((el) => el.visible)

  for (const element of visibleElements) {
    const text = element.text.toLowerCase()

    if (urgencyRegex.test(text)) {
      registerPatternMatch("fake_urgency", "Texto com pressão temporal detectado", element.id, 22)
    }

    if (isLikelyCountdown(element, text)) {
      registerPatternMatch(
        "countdown_pressure",
        "Indicador de contagem regressiva encontrado",
        element.id,
        18
      )
    }

    if (element.tagName === "input" && element.type === "checkbox" && element.isChecked) {
      registerPatternMatch(
        "preselected_checkbox",
        "Checkbox pre-marcado em área de decisão",
        element.id,
        20
      )
    }

    const area = element.rect.width * element.rect.height
    if (area > 75000 && element.zIndex >= 999) {
      registerPatternMatch(
        "attention_grabbing_overlay",
        "Overlay dominante com alto z-index",
        element.id,
        14
      )
    }

    if (element.tagName === "button" && element.styles.fontWeight >= 700 && element.rect.width >= 280) {
      registerPatternMatch(
        "disproportionate_cta",
        "CTA visualmente desproporcional",
        element.id,
        12
      )
    }

    const isButtonLike =
      element.tagName === "button" ||
      element.role === "button" ||
      (element.tagName === "a" && /button|cta|call-to-action/i.test(element.selector))

    if (
      isButtonLike &&
      element.visible &&
      element.styles.fontWeight >= 600 &&
      element.rect.width >= 140 &&
      element.rect.height >= 34 &&
      element.rect.y < 900
    ) {
      const text = element.text.toLowerCase()

      if (marketingPressureRegex.test(text)) {
        registerPatternMatch(
          "disproportionate_cta",
          "CTA de marketing com forte apelo visual",
          element.id,
          12
        )
      }
    }

    if (
      element.tagName === "h1" ||
      element.tagName === "h2" ||
      element.tagName === "strong"
    ) {
      const text = element.text.toLowerCase()

      if (marketingPressureRegex.test(text) && element.rect.width >= 260) {
        registerPatternMatch(
          "attention_grabbing_overlay",
          "Hero com linguagem persuasiva destacada",
          element.id,
          8
        )
      }
    }
  }

  return {
    suspicionScore: Math.min(100, score),
    possiblePatterns: Array.from(patterns),
    reasons: Array.from(reasons),
    matchedElementIds: Array.from(matchedElementIds),
    matchedElementIdsByPattern
  }
}
