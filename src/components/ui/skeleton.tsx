import clsx from "clsx"

interface SkeletonProps {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={clsx("animate-pulse rounded-lg bg-white/10", className)} />
}
