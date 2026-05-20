import type { RuntimeMessage } from "../../types/messages"

export const sendRuntimeMessage = <T>(
  message: RuntimeMessage
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: T) => {
      const runtimeError = chrome.runtime.lastError

      if (runtimeError) {
        reject(new Error(runtimeError.message))
        return
      }

      if (typeof response === "undefined") {
        reject(new Error("Sem resposta do background"))
        return
      }

      resolve(response)
    })
  })
}
