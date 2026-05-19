import clsx from "clsx"
import * as React from "react"
import type { Detection } from "../types/detection"
import { SeverityBadge } from "./ui/badge"
import { Card } from "./ui/card"

interface DetectionCardProps {
  detection: Detection
  selected?: boolean
  onClick?: () => void
}

export const DetectionCard = ({
  detection,
  selected = false,
  onClick
}: DetectionCardProps) => {
  const [showCode, setShowCode] = React.useState(false)
  return (
    <div className="w-full text-left">
      <Card
        className={clsx(
          "transition-all duration-200 hover:border-accent-400/40 hover:bg-white/[0.06]",
          selected && "border-accent-400/60 bg-accent-500/10"
        )}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : undefined }}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-100">{detection.pattern}</h3>
          <SeverityBadge severity={detection.severity} />
        </div>

        <p className="mb-3 text-xs leading-5 text-slate-300">{detection.explanation}</p>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Confianca: {Math.round(detection.confidence * 100)}%</span>
          <span>Score: {detection.suspicionScore}</span>
        </div>

        {detection.elementHtml && (
          <div className="mt-3">
            <button
              className="rounded bg-zinc-800 px-2 py-1 text-xs text-accent-300 hover:bg-zinc-700 border border-zinc-700"
              type="button"
              onClick={e => {
                e.stopPropagation()
                setShowCode(v => !v)
              }}
            >
              {showCode ? "Ocultar código" : "Ver código"}
            </button>
            {showCode && (
              <pre className="mt-2 max-h-48 overflow-auto rounded bg-zinc-900 p-2 text-xs text-slate-100 border border-zinc-700 whitespace-pre-wrap break-all">
                {detection.elementHtml}
              </pre>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
