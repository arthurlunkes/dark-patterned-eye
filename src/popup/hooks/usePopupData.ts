import { useCallback } from "react"
import { sendRuntimeMessage } from "../../lib/services/message.service"
import { useDetectionStore } from "../../store/detection.store"
import type { RuntimeResponse } from "../../types/messages"

const getActiveTabId = async (): Promise<number> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  const tab = tabs[0]

  if (!tab?.id) {
    throw new Error("Nao foi possivel identificar a aba ativa")
  }

  return tab.id
}

export const usePopupData = () => {
  const {
    detections,
    loading,
    error,
    pageScore,
    selectedDetection,
    setDetections,
    setError,
    setLoading,
    setSelectedDetection,
    clear
  } = useDetectionStore()

  const fetchLatest = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const tabId = await getActiveTabId()
      const response = await sendRuntimeMessage<RuntimeResponse>({
        type: "POPUP_GET_LAST_RESULT",
        tabId
      })

      if (!response.ok) {
        clear()
        return
      }

      setDetections(response.result.detections, response.result.pageScore)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha ao carregar analise")
    } finally {
      setLoading(false)
    }
  }, [clear, setDetections, setError, setLoading])

  const runAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const tabId = await getActiveTabId()
      const response = await sendRuntimeMessage<RuntimeResponse>({
        type: "POPUP_RUN_ANALYSIS",
        tabId
      })

      if (!response.ok) {
        setError(response.error)
        return
      }

      setDetections(response.result.detections, response.result.pageScore)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha ao analisar pagina")
    } finally {
      setLoading(false)
    }
  }, [setDetections, setError, setLoading])

  return {
    detections,
    loading,
    error,
    pageScore,
    selectedDetection,
    setSelectedDetection,
    runAnalysis,
    fetchLatest
  }
}
