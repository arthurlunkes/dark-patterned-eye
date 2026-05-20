import type { AnalysisResult } from "../types/detection";
import type { RuntimeBasicResponse, RuntimeMessage, RuntimeResponse } from "../types/messages";

const resultByTab = new Map<number, AnalysisResult>()

const isTransientTabMessageError = (message: string): boolean => {
  return /back\/forward cache|context invalidated|receiving end does not exist|message channel is closed/i.test(
    message
  )
}

const sendMessageToTab = <T>(tabId: number, message: RuntimeMessage): Promise<{ response?: T; error?: string }> => {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response: T | undefined) => {
      const runtimeError = chrome.runtime.lastError

      if (runtimeError) {
        resolve({ error: runtimeError.message })
        return
      }

      resolve({ response })
    })
  })
}

const sendMessageToTabWithRetry = async <T>(
  tabId: number,
  message: RuntimeMessage,
  retries = 1
): Promise<{ response?: T; error?: string }> => {
  const firstAttempt = await sendMessageToTab<T>(tabId, message)

  if (!firstAttempt.error) {
    return firstAttempt
  }

  if (retries <= 0 || !isTransientTabMessageError(firstAttempt.error)) {
    return firstAttempt
  }

  return sendMessageToTab<T>(tabId, message)
}

const runAnalysisInTab = async (tabId: number): Promise<RuntimeResponse> => {
  const { response, error } = await sendMessageToTabWithRetry<RuntimeResponse>(tabId, {
    type: "CONTENT_ANALYZE"
  } satisfies RuntimeMessage)

  if (error) {
    return {
      ok: false,
      error
    }
  }

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
    sendResponse: (response: RuntimeResponse | RuntimeBasicResponse) => void
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

    if (message.type === "POPUP_FOCUS_DETECTION") {
      ;(async () => {
        try {
          const { response, error } = await sendMessageToTabWithRetry<RuntimeBasicResponse>(
            message.tabId,
            {
              type: "CONTENT_FOCUS_DETECTION",
              selector: message.selector
            }
          )

          if (error) {
            sendResponse({ ok: false, error })
            return
          }

          if (!response?.ok) {
            sendResponse({ ok: false, error: "Falha ao focar deteccao" })
            return
          }

          sendResponse({ ok: true })
        } catch (error) {
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : "Erro ao focar deteccao"
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
