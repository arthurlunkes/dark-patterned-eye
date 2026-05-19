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

    // Botão para mostrar código
    const codeBtn = document.createElement("button")
    codeBtn.textContent = "Ver código"
    codeBtn.style.marginLeft = "8px"
    codeBtn.style.background = "#22223b"
    codeBtn.style.color = "#a5b4fc"
    codeBtn.style.border = "none"
    codeBtn.style.borderRadius = "6px"
    codeBtn.style.fontSize = "10px"
    codeBtn.style.padding = "2px 8px"
    codeBtn.style.cursor = "pointer"
    codeBtn.style.pointerEvents = "all"

    // Popover
    const codePopover = document.createElement("pre")
    codePopover.style.position = "absolute"
    codePopover.style.top = "32px"
    codePopover.style.left = "0"
    codePopover.style.zIndex = "2147483647"
    codePopover.style.background = "#18181b"
    codePopover.style.color = "#f1f5f9"
    codePopover.style.fontSize = "11px"
    codePopover.style.padding = "10px"
    codePopover.style.borderRadius = "8px"
    codePopover.style.maxWidth = "420px"
    codePopover.style.maxHeight = "260px"
    codePopover.style.overflow = "auto"
    codePopover.style.boxShadow = "0 2px 16px #0008"
    codePopover.style.display = "none"
    codePopover.textContent = detection.elementHtml

    codeBtn.onclick = (e) => {
      e.stopPropagation()
      codePopover.style.display = codePopover.style.display === "none" ? "block" : "none"
    }

    badge.appendChild(codeBtn)

    const tooltip = document.createElement("div")
    tooltip.className = "dp-eye-tooltip"
    tooltip.textContent = `${detection.pattern} (${Math.round(detection.confidence * 100)}%): ${detection.explanation}`

    box.appendChild(badge)
    box.appendChild(tooltip)
    box.appendChild(codePopover)
    root.appendChild(box)
  }
}
