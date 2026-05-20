import type { AnalysisResult, Detection } from "../../types/detection"
import { runHeuristics } from "../heuristics/pattern-rules"
import { llmService } from "../services/llm.service"
import { analyzePageElements } from "./element-analyzer"

export const analyzeCurrentPage = async (): Promise<AnalysisResult> => {
  const elements = analyzePageElements()
  const heuristicResult = runHeuristics(elements)

  if (heuristicResult.possiblePatterns.length === 0) {
    return {
      detections: [],
      pageScore: heuristicResult.suspicionScore,
      scannedAt: Date.now()
    }
  }

  const classification = await llmService.analyzePage({
    patternHints: heuristicResult.possiblePatterns
  })

  const classificationByPattern = new Map(classification.map((item) => [item.pattern, item]))

  const detections: Detection[] = []
  const maxElementsPerPattern = 3
  const now = Date.now()

  for (const pattern of heuristicResult.possiblePatterns) {
    const classifiedPattern = classificationByPattern.get(pattern)
    if (!classifiedPattern) {
      continue
    }

    const elementIdsForPattern = Array.from(new Set(heuristicResult.matchedElementIdsByPattern[pattern] || []))
    const candidateElementIds =
      elementIdsForPattern.length > 0
        ? elementIdsForPattern.slice(0, maxElementsPerPattern)
        : heuristicResult.matchedElementIds.slice(0, 1)

    for (const [localIndex, elementId] of candidateElementIds.entries()) {
      const matchedElement = elements.find((el) => el.id === elementId) || elements[0]

      let elementHtml = ""
      if (matchedElement?.selector) {
        const domEl = document.querySelector(matchedElement.selector)
        if (domEl) {
          elementHtml = domEl.outerHTML
        }
      }

      detections.push({
        id: `${classifiedPattern.pattern}_${localIndex}_${elementId}_${now}`,
        pattern: classifiedPattern.pattern,
        confidence: classifiedPattern.confidence,
        severity: classifiedPattern.severity,
        explanation: classifiedPattern.explanation,
        suspicionScore: heuristicResult.suspicionScore,
        elementId,
        selector: matchedElement?.selector || "body",
        createdAt: now,
        elementHtml
      })
    }
  }

  return {
    detections,
    pageScore: heuristicResult.suspicionScore,
    scannedAt: Date.now()
  }
}
