import type { AnalyzedElement } from "../../types/detection"
import { toAnalyzedElement } from "../utils/dom"

export const analyzeButtons = (): AnalyzedElement[] => {
  const elements = Array.from(document.querySelectorAll("button, [role='button'], a[role='button']"))
  return elements.map((el) => toAnalyzedElement(el as HTMLElement))
}

export const analyzeCheckboxes = (): AnalyzedElement[] => {
  const elements = Array.from(document.querySelectorAll("input[type='checkbox']"))
  return elements.map((el) => toAnalyzedElement(el as HTMLElement))
}

export const analyzeTimers = (): AnalyzedElement[] => {
  const elements = Array.from(
    document.querySelectorAll(
      "[class*='timer'], [id*='timer'], [class*='countdown'], [id*='countdown'], time"
    )
  )
  return elements.map((el) => toAnalyzedElement(el as HTMLElement))
}

export const analyzeModals = (): AnalyzedElement[] => {
  const elements = Array.from(
    document.querySelectorAll(
      "[role='dialog'], dialog, [class*='modal'], [id*='modal'], [class*='overlay'], [id*='overlay']"
    )
  )
  return elements.map((el) => toAnalyzedElement(el as HTMLElement))
}

export const analyzeTextBlocks = (): AnalyzedElement[] => {
  const elements = Array.from(document.querySelectorAll("p, span, strong, h1, h2, h3"))
    .filter((el) => (el.textContent?.trim().length || 0) > 15)
    .slice(0, 120)

  return elements.map((el) => toAnalyzedElement(el as HTMLElement))
}

export const analyzePageElements = (): AnalyzedElement[] => {
  const all = [
    ...analyzeButtons(),
    ...analyzeCheckboxes(),
    ...analyzeTimers(),
    ...analyzeModals(),
    ...analyzeTextBlocks()
  ]

  const unique = new Map<string, AnalyzedElement>()
  for (const item of all) {
    unique.set(item.selector, item)
  }

  return Array.from(unique.values())
}
