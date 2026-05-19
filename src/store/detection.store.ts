import { create } from "zustand"
import type { Detection } from "../types/detection"

interface DetectionStoreState {
  detections: Detection[]
  loading: boolean
  error: string | null
  pageScore: number
  selectedDetection: Detection | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setDetections: (detections: Detection[], pageScore: number) => void
  setSelectedDetection: (detection: Detection | null) => void
  clear: () => void
}

export const useDetectionStore = create<DetectionStoreState>((set) => ({
  detections: [],
  loading: false,
  error: null,
  pageScore: 0,
  selectedDetection: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDetections: (detections, pageScore) =>
    set({
      detections,
      pageScore,
      selectedDetection: detections[0] || null,
      error: null
    }),
  setSelectedDetection: (selectedDetection) => set({ selectedDetection }),
  clear: () =>
    set({ detections: [], pageScore: 0, selectedDetection: null, error: null })
}))
