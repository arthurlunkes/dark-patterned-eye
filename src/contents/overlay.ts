import type { Detection } from "../types/detection"

const ROOT_ID = "dp-eye-root"

const clearOverlay = () => {
  const root = document.getElementById(ROOT_ID)
  if (root) {
    root.remove()
  }
}

const ensureOverlayRoot = () => {
  let root = document.getElementById(ROOT_ID)

  if (!root) {
    root = document.createElement("div")
    root.id = ROOT_ID
    document.body.appendChild(root)
  }

  return root
}

export const renderOverlay = (detections: Detection[]) => {
  clearOverlay()

  if (detections.length === 0) {
    return
  }

  const root = ensureOverlayRoot()

  for (const detection of detections) {
    const target = document.querySelector(detection.selector) as HTMLElement | null
    if (!target) {
      continue
    }

    const rect = target.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      continue
    }

    const box = document.createElement("div")
    box.className = "dp-eye-highlight"
    box.style.left = `${rect.left + window.scrollX}px`
    box.style.top = `${rect.top + window.scrollY}px`
    box.style.width = `${rect.width}px`
    box.style.height = `${rect.height}px`

    const badge = document.createElement("div")
    badge.className = "dp-eye-badge"
    badge.textContent = "Possivel Dark Pattern"

    const tooltip = document.createElement("div")
    tooltip.className = "dp-eye-tooltip"
    tooltip.textContent = `${detection.pattern} (${Math.round(detection.confidence * 100)}%): ${detection.explanation}`

    box.appendChild(badge)
    box.appendChild(tooltip)
    root.appendChild(box)
  }
}
