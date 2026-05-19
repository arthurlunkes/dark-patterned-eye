import { useEffect } from "react"
import { DetectionCard } from "../components/DetectionCard"
import { EmptyState } from "../components/EmptyState"
import { ScoreRing } from "../components/ScoreRing"
import { Card } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { debounce } from "../lib/utils/dom"
import "../styles/tailwind.css"
import { usePopupData } from "./hooks/usePopupData"

const debouncedAnalysis = debounce((fn: () => void) => fn(), 180)

const PopupApp = () => {
  const {
    detections,
    loading,
    error,
    pageScore,
    selectedDetection,
    setSelectedDetection,
    runAnalysis,
    fetchLatest
  } = usePopupData()

  useEffect(() => {
    void fetchLatest()
  }, [fetchLatest])

  return (
    <main className="dark min-h-[560px] w-[380px] bg-[radial-gradient(120%_120%_at_90%_0%,rgba(45,212,191,0.22),transparent_45%),radial-gradient(90%_80%_at_0%_100%,rgba(244,63,94,0.16),transparent_50%),linear-gradient(150deg,#090b12_0%,#111827_60%,#1f2937_100%)] px-4 py-5 text-slate-100">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Dark Patterned Eye</p>
          <h1 className="text-lg font-semibold">Scanner Heuristico</h1>
        </div>
        <ScoreRing score={pageScore} />
      </header>

      <Card className="mb-4 animate-fadeIn">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-300">Deteccoes</p>
            <p className="text-sm font-semibold text-white">{detections.length} encontradas</p>
          </div>

          <button
            className="rounded-xl bg-accent-500 px-3 py-2 text-xs font-semibold text-ink-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            onClick={() => debouncedAnalysis(runAnalysis)}
            type="button">
            {loading ? "Analisando..." : "Analisar pagina"}
          </button>
        </div>
      </Card>

      <section className="space-y-3">
        {error ? (
          <Card className="border-danger-500/30 bg-danger-500/10">
            <p className="text-xs text-rose-200">{error}</p>
          </Card>
        ) : null}

        {loading && detections.length === 0 ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : detections.length === 0 ? (
          <EmptyState />
        ) : (
          detections.map((detection) => (
            <DetectionCard
              detection={detection}
              key={detection.id}
              onClick={() => setSelectedDetection(detection)}
              selected={selectedDetection?.id === detection.id}
            />
          ))
        )}
      </section>

      {selectedDetection ? (
        <Card className="mt-4 animate-fadeIn border-danger-500/20 bg-danger-500/10">
          <p className="text-xs text-slate-300">Detalhe selecionado</p>
          <p className="mt-1 text-xs leading-5 text-slate-200">{selectedDetection.explanation}</p>
          <p className="mt-2 text-[11px] text-slate-400">
            Confianca {Math.round(selectedDetection.confidence * 100)}%.
          </p>
          {selectedDetection.elementHtml && (
            <details className="mt-3">
              <summary className="cursor-pointer text-accent-300 text-xs">Ver código do elemento</summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded bg-zinc-900 p-2 text-xs text-slate-100 border border-zinc-700 whitespace-pre-wrap break-all">
                {selectedDetection.elementHtml}
              </pre>
            </details>
          )}
        </Card>
      ) : null}
    </main>
  )
}

export default PopupApp
