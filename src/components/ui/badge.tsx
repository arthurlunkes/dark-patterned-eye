import clsx from "clsx"
import type { PatternSeverity } from "../../types/detection"

interface SeverityBadgeProps {
  severity: PatternSeverity
}

const styles: Record<PatternSeverity, string> = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
  medium: "bg-amber-500/15 text-amber-300 border-amber-400/25",
  high: "bg-rose-500/15 text-rose-300 border-rose-400/25"
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.11em]",
        styles[severity]
      )}>
      {severity}
    </span>
  )
}
