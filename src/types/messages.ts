import type { AnalysisResult } from "./detection"

export type RuntimeMessage =
  | {
      type: "POPUP_RUN_ANALYSIS"
      tabId: number
    }
  | {
      type: "POPUP_GET_LAST_RESULT"
      tabId: number
    }
  | {
      type: "CONTENT_ANALYZE"
    }

export interface RuntimeSuccessResponse {
  ok: true
  result: AnalysisResult
}

export interface RuntimeErrorResponse {
  ok: false
  error: string
}

export type RuntimeResponse = RuntimeSuccessResponse | RuntimeErrorResponse
