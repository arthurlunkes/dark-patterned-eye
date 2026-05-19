import type { AnalysisResult } from "../types/detection"
import type { RuntimeMessage, RuntimeResponse } from "../types/messages"

const resultByTab = new Map<number, AnalysisResult>()

const runAnalysisInTab = async (tabId: number): Promise<RuntimeResponse> => {
  const response = (await chrome.tabs.sendMessage(tabId, {
    type: "CONTENT_ANALYZE"
  } satisfies RuntimeMessage)) as RuntimeResponse | undefined

  if (!response) {
    return {
      ok: false,
      error: "Sem resposta do content script"
    }
  }

  if (response.ok) {
    resultByTab.set(tabId, response.result)
  }

  return response
}

chrome.runtime.onMessage.addListener(
  (
    message: RuntimeMessage,
    _sender,
    sendResponse: (response: RuntimeResponse) => void
  ) => {
    if (message.type === "POPUP_RUN_ANALYSIS") {
      ;(async () => {
        try {
          const response = await runAnalysisInTab(message.tabId)
          sendResponse(response)
        } catch (error) {
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "Erro ao executar analise"
          })
        }
      })()

      return true
    }

    if (message.type === "POPUP_GET_LAST_RESULT") {
      const cached = resultByTab.get(message.tabId)

      if (!cached) {
        sendResponse({
          ok: false,
          error: "Ainda nao ha analise para esta aba"
        })
        return false
      }

      sendResponse({ ok: true, result: cached })
      return false
    }

    return false
  }
)
