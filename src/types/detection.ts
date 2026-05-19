export type PatternSeverity = "low" | "medium" | "high"

export interface AnalyzedElement {
  id: string
  selector: string
  tagName: string
  text: string
  role?: string
  type?: string
  visible: boolean
  isChecked?: boolean
  zIndex: number
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  styles: {
    color: string
    backgroundColor: string
    fontSize: number
    fontWeight: number
    opacity: number
  }
}

export interface HeuristicResult {
  suspicionScore: number
  possiblePatterns: string[]
  reasons: string[]
  matchedElementIds: string[]
}

export interface LLMClassification {
  pattern: string
  confidence: number
  severity: PatternSeverity
  explanation: string
}

export interface Detection {
  id: string
  pattern: string
  confidence: number
  severity: PatternSeverity
  explanation: string
  suspicionScore: number
  elementId: string
  selector: string
  createdAt: number
}

export interface AnalysisResult {
  detections: Detection[]
  pageScore: number
  scannedAt: number
}
