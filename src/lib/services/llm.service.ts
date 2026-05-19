import type { LLMClassification } from "../../types/detection"
import { mockLLMClassifier } from "../mocks/llm.mock"

export interface AnalyzePagePayload {
  screenshotBase64?: string
  promptContext?: string
  patternHints?: string[]
}

export class LlmService {
  async classifyDarkPattern(patternHint?: string): Promise<LLMClassification> {
    return mockLLMClassifier(patternHint)
  }

  async sendScreenshot(_screenshotBase64: string): Promise<{ id: string }> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { id: "mock-screenshot-id" }
  }

  async analyzePage(payload: AnalyzePagePayload): Promise<LLMClassification[]> {
    const hints = payload.patternHints && payload.patternHints.length > 0 ? payload.patternHints : [undefined]

    return Promise.all(hints.map((hint) => this.classifyDarkPattern(hint)))
  }
}

export const llmService = new LlmService()
