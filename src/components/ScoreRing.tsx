interface ScoreRingProps {
  score: number
}

export const ScoreRing = ({ score }: ScoreRingProps) => {
  const safeScore = Math.max(0, Math.min(100, score))
  const progress = (safeScore / 100) * 283
  const color = safeScore >= 70 ? "#f43f5e" : safeScore >= 40 ? "#f59e0b" : "#34d399"

  return (
    <div className="relative h-24 w-24">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="8"
          strokeDasharray="283"
          strokeDashoffset={283 - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <div className="text-lg font-bold text-slate-100">{safeScore}</div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Risco</div>
        </div>
      </div>
    </div>
  )
}
