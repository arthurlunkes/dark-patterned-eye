import clsx from "clsx"
import type { PropsWithChildren } from "react"

interface CardProps extends PropsWithChildren {
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-glow backdrop-blur",
        className
      )}>
      {children}
    </div>
  )
}
