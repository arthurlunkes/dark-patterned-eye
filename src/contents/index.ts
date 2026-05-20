import type { PlasmoCSConfig } from "plasmo"
import { analyzeCurrentPage } from "../lib/analyzer/page-analyzer"
import type { RuntimeBasicResponse, RuntimeMessage, RuntimeResponse } from "../types/messages"
import { focusDetection, renderOverlay } from "./overlay"
import "./overlay.css"

const isContextInvalidatedError = (value: unknown): boolean => {
  const message =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : ""

  return /extension context invalidated/i.test(message)
}

// During extension reload/update, stale content script promises may reject with
// "Extension context invalidated". Ignore only this known transient case.
window.addEventListener("unhandledrejection", (event) => {
  if (isContextInvalidatedError(event.reason)) {
    event.preventDefault()
  }
})

window.addEventListener("error", (event) => {
  const targetError = event.error ?? event.message

  if (isContextInvalidatedError(targetError)) {
    event.preventDefault()
  }
})

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false,
  run_at: "document_idle"
}

chrome.runtime.onMessage.addListener(
  (
    message: RuntimeMessage,
    _sender,
    sendResponse: (response: RuntimeResponse | RuntimeBasicResponse) => void
  ) => {
    if (message.type === "CONTENT_FOCUS_DETECTION") {
      const found = focusDetection(message.selector)

      if (!found) {
        sendResponse({ ok: false, error: "Elemento nao encontrado para foco" })
        return false
      }

      sendResponse({
        ok: true
      })
      return false
    }

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
