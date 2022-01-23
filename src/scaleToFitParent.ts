

function widthScaleNeededToFit(element: HTMLElement, margin: number = 0): number {
  if (!element.parentElement) {
    return 1
  }
  const parentWidth = element.parentElement.clientWidth - margin * 2
  return parentWidth / element.clientWidth
}

export function fitToParent(element: HTMLElement, margin: number) {
  const scale = widthScaleNeededToFit(element, margin)
  element.style.transformOrigin = "0 0"
  element.style.transform = `translate(${margin}px, ${margin}px) scale(${scale})`
}
