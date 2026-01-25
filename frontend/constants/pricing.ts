import { TAX_RATE } from "./tax"

export function calculateFinalTotal(total?: number) {
  const safeTotal = total ?? 0
  const tax = Math.round(safeTotal * TAX_RATE)
  return safeTotal + tax
}
