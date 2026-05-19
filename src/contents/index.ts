import type { PlasmoCSConfig } from "plasmo"
import { analyzeCurrentPage } from "../lib/analyzer/page-analyzer"
import type { RuntimeMessage, RuntimeResponse } from "../types/messages"
import { renderOverlay } from "./overlay"
import "./overlay.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false,
  run_at: "document_idle"
}

chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, _sender, sendResponse: (response: RuntimeResponse) => void) => {
    if (message.type !== "CONTENT_ANALYZE") {
      return false
    }

    ;(async () => {
      try {
        const result = await analyzeCurrentPage()
        renderOverlay(result.detections)
        sendResponse({ ok: true, result })
      } catch (error) {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : "Falha ao analisar pagina"
        })
      }
    })()

    return true
  }
)
