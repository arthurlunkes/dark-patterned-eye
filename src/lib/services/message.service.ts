import type { RuntimeMessage, RuntimeResponse } from "../../types/messages"

export const sendRuntimeMessage = <T extends RuntimeResponse>(
  message: RuntimeMessage
): Promise<T> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: T) => {
      const runtimeError = chrome.runtime.lastError

      if (runtimeError) {
        reject(new Error(runtimeError.message))
        return
      }

      resolve(response)
    })
  })
}
