import clsx from "clsx"
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
  return (
    <button className="w-full text-left" onClick={onClick} type="button">
      <Card
        className={clsx(
          "transition-all duration-200 hover:border-accent-400/40 hover:bg-white/[0.06]",
          selected && "border-accent-400/60 bg-accent-500/10"
        )}>
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-100">{detection.pattern}</h3>
          <SeverityBadge severity={detection.severity} />
        </div>

        <p className="mb-3 text-xs leading-5 text-slate-300">{detection.explanation}</p>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Confianca: {Math.round(detection.confidence * 100)}%</span>
          <span>Score: {detection.suspicionScore}</span>
        </div>
      </Card>
    </button>
  )
}
