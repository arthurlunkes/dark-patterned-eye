import type { AnalyzedElement } from "../../types/detection"

let idCounter = 0

export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  waitMs = 300
) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => fn(...args), waitMs)
  }
}

const getElementSelector = (element: Element): string => {
  if (element.id) {
    return `#${element.id}`
  }

  const parts: string[] = []
  let current: Element | null = element

  while (current && current.tagName.toLowerCase() !== "html") {
    const tag = current.tagName.toLowerCase()
    const parent = current.parentElement

    if (!parent) {
      parts.unshift(tag)
      break
    }

    const siblings = Array.from(parent.children).filter(
      (child) => child.tagName.toLowerCase() === tag
    )

    if (siblings.length === 1) {
      parts.unshift(tag)
    } else {
      const index = siblings.indexOf(current) + 1
      parts.unshift(`${tag}:nth-of-type(${index})`)
    }

    current = parent
  }

  return parts.join(" > ")
}

export const toAnalyzedElement = (element: HTMLElement): AnalyzedElement => {
  const rect = element.getBoundingClientRect()
  const styles = window.getComputedStyle(element)
  const zIndex = Number.parseInt(styles.zIndex, 10)

  idCounter += 1

  return {
    id: `el_${idCounter}`,
    selector: getElementSelector(element),
    tagName: element.tagName.toLowerCase(),
    text: element.textContent?.trim().replace(/\s+/g, " ") || "",
    role: element.getAttribute("role") || undefined,
    type: (element as HTMLInputElement).type || undefined,
    visible:
      rect.width > 0 &&
      rect.height > 0 &&
      styles.visibility !== "hidden" &&
      styles.display !== "none",
    isChecked:
      element instanceof HTMLInputElement ? Boolean(element.checked) : undefined,
    zIndex: Number.isNaN(zIndex) ? 0 : zIndex,
    rect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    },
    styles: {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: Number.parseFloat(styles.fontSize) || 0,
      fontWeight: Number.parseInt(styles.fontWeight, 10) || 400,
      opacity: Number.parseFloat(styles.opacity) || 1
    }
  }
}
