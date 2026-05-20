import { useCallback } from "react"
import { sendRuntimeMessage } from "../../lib/services/message.service"
import { useDetectionStore } from "../../store/detection.store"
import type { Detection } from "../../types/detection"
import type { RuntimeBasicResponse, RuntimeResponse } from "../../types/messages"

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

  const executeAnalysis = useCallback(async (tabId: number) => {
    const response = await sendRuntimeMessage<RuntimeResponse>({
      type: "POPUP_RUN_ANALYSIS",
      tabId
    })

    if (!response.ok && "error" in response) {
      setError(response.error)
      return
    }

    setDetections(response.result.detections, response.result.pageScore)
  }, [setDetections, setError])

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
        await executeAnalysis(tabId)
        return
      }

      setDetections(response.result.detections, response.result.pageScore)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha ao carregar analise")
    } finally {
      setLoading(false)
    }
  }, [clear, executeAnalysis, setDetections, setError, setLoading])

  const runAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const tabId = await getActiveTabId()
      await executeAnalysis(tabId)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha ao analisar pagina")
    } finally {
      setLoading(false)
    }
  }, [executeAnalysis, setError, setLoading])

  const focusDetectionInPage = useCallback(async (detection: Detection) => {
    setSelectedDetection(detection)

    try {
      const tabId = await getActiveTabId()
      const response = await sendRuntimeMessage<RuntimeBasicResponse>({
        type: "POPUP_FOCUS_DETECTION",
        tabId,
        selector: detection.selector
      })

      if (!response.ok && "error" in response) {
        setError(response.error)
      }
    } catch {
      // Falhas de foco nao devem quebrar a experiencia do popup.
    }
  }, [setError, setSelectedDetection])

  return {
    detections,
    loading,
    error,
    pageScore,
    selectedDetection,
    setSelectedDetection: focusDetectionInPage,
    runAnalysis,
    fetchLatest
  }
}
