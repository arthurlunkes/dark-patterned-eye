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

  const detections: Detection[] = classification.map((item, index) => {
    const elementId = heuristicResult.matchedElementIds[index] || heuristicResult.matchedElementIds[0]
    const matchedElement = elements.find((el) => el.id === elementId) || elements[0]

    return {
      id: `${item.pattern}_${index}_${Date.now()}`,
      pattern: item.pattern,
      confidence: item.confidence,
      severity: item.severity,
      explanation: item.explanation,
      suspicionScore: heuristicResult.suspicionScore,
      elementId,
      selector: matchedElement?.selector || "body",
      createdAt: Date.now()
    }
  })

  return {
    detections,
    pageScore: heuristicResult.suspicionScore,
    scannedAt: Date.now()
  }
}
