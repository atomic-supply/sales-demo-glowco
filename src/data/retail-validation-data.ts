import { seededRand } from "../utils/random"

export type AdjustmentStatus = "needs-review" | "approved"

export type RetailPlanContextData = {
  weeks: string[]
  history2YAgo: number[]
  historyPriorYear: number[]
  baselineForecast: number[]
  promotionalLift: number[]
  modelForecast: number[]
  overrides: (number | null)[]
  overrideReasons: string[]
  adjustedForecast: number[]
  yoyPct: (number | null)[]
  targetWeekIndex: number
}

export function getRetailPlanData(
  retailer: string,
  sku: string,
  timePeriod: string,
  overrideValue: number,
  overrideReason: string,
): RetailPlanContextData | null {
  const match = timePeriod.match(/Week (\d+), (\d+)/)
  if (!match) return null
  const targetWeekNum = parseInt(match[1])
  const year = parseInt(match[2])

  const WINDOW = 11
  const half = Math.floor(WINDOW / 2)
  const targetWeekIndex = half
  const weekNums = Array.from({ length: WINDOW }, (_, i) => targetWeekNum - half + i)
  const weeks = weekNums.map((w) => {
    const normalized = ((w - 1 + 52) % 52) + 1
    const y = w < 1 ? year - 1 : w > 52 ? year + 1 : year
    return `Wk ${normalized} ${y}`
  })

  const seed =
    sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137 +
    retailer.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 53
  const rand = seededRand(seed)
  const skuHash = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseDemand = 150 + (skuHash % 300)
  const seasonality = [0.85, 0.90, 1.05, 1.15, 1.25, 1.30, 1.20, 1.10, 1.00, 0.95, 1.10, 1.35]
  const wToMonth = (w: number) => Math.min(11, Math.floor((((w - 1 + 52) % 52) / 52) * 12))

  const history2YAgo = weekNums.map((w) => {
    const m = wToMonth(w)
    return Math.round(baseDemand * 0.70 * seasonality[m] * (0.88 + rand() * 0.24))
  })
  const historyPriorYear = weekNums.map((w) => {
    const m = wToMonth(w)
    return Math.round(baseDemand * 0.85 * seasonality[m] * (0.88 + rand() * 0.24))
  })
  const baselineForecast = weekNums.map((w) => {
    const m = wToMonth(w)
    return Math.round(baseDemand * seasonality[m] * (0.93 + rand() * 0.14))
  })
  const promotionalLift = weekNums.map(() => {
    const r = rand()
    return r > 0.75 ? Math.round(baseDemand * 0.08 * (1 + rand() * 0.5)) : 0
  })
  const modelForecast = baselineForecast.map((b, i) => b + promotionalLift[i])
  const overrides: (number | null)[] = weekNums.map((_, i) => (i === targetWeekIndex ? overrideValue : null))
  const overrideReasons: string[] = weekNums.map((_, i) => (i === targetWeekIndex ? overrideReason : ""))
  const adjustedForecast = modelForecast.map((m, i) => overrides[i] ?? m)
  const yoyPct = adjustedForecast.map((f, i) => {
    const h = historyPriorYear[i]
    if (!h) return null
    return Math.round(((f / h) - 1) * 100)
  })

  return {
    weeks, history2YAgo, historyPriorYear, baselineForecast,
    promotionalLift, modelForecast, overrides, overrideReasons,
    adjustedForecast, yoyPct, targetWeekIndex,
  }
}

export interface RetailAdjustment {
  id: string
  sku: string
  retailer: string
  channel: string
  timePeriod: string
  originalValue: number
  overrideValue: number
  overrideReason: string
  planner: string
  status: AdjustmentStatus
  createdAt: string
}

export const generateSampleAdjustments = (skuList: string[]): RetailAdjustment[] => {
  const skus = skuList.length > 0 ? skuList.slice(0, 5) : ["CO24", "CJ24", "CB24", "COP12", "CTOTJ24"]
  return [
    { id: "adj-1", sku: skus[0] ?? "CO24", retailer: "Amazon.com (US)", channel: "Amazon.com", timePeriod: "Week 2, 2026", originalValue: 285, overrideValue: 340, overrideReason: "Holiday promotional event - increased ad spend", planner: "Jordan", status: "needs-review", createdAt: "2026-01-08T10:30:00.000Z" },
    { id: "adj-2", sku: skus[2] ?? "CB24", retailer: "Walmart", channel: "Walmart Stores", timePeriod: "Week 3, 2026", originalValue: 412, overrideValue: 480, overrideReason: "New store opening forecast - 6 additional locations", planner: "Jordan", status: "needs-review", createdAt: "2026-01-07T14:15:00.000Z" },
    { id: "adj-3", sku: skus[3] ?? "COP12", retailer: "Target", channel: "Target Stores", timePeriod: "Week 2, 2026", originalValue: 174, overrideValue: 220, overrideReason: "Regional marketing campaign - Southwest region", planner: "Jordan", status: "needs-review", createdAt: "2026-01-07T09:00:00.000Z" },
    { id: "adj-4", sku: skus[1] ?? "CJ24", retailer: "velo.com", channel: "Subscription", timePeriod: "Week 4, 2026", originalValue: 316, overrideValue: 380, overrideReason: "Subscription growth - new customer cohort", planner: "Jordan", status: "needs-review", createdAt: "2026-01-06T11:45:00.000Z" },
    { id: "adj-5", sku: skus[4] ?? "CTOTJ24", retailer: "CVS", channel: "CVS Stores", timePeriod: "Week 3, 2026", originalValue: 210, overrideValue: 175, overrideReason: "Seasonal demand adjustment - post-holiday dip", planner: "Jordan", status: "needs-review", createdAt: "2026-01-06T08:30:00.000Z" },
    { id: "adj-6", sku: skus[0] ?? "CO24", retailer: "Walmart", channel: "Walmart.com", timePeriod: "Week 5, 2026", originalValue: 198, overrideValue: 250, overrideReason: "Competitor out of stock - market share opportunity", planner: "Jordan", status: "needs-review", createdAt: "2026-01-05T16:20:00.000Z" },
    { id: "adj-7", sku: skus[2] ?? "CB24", retailer: "Amazon.com (US)", channel: "Amazon Subscribe & Save", timePeriod: "Week 4, 2026", originalValue: 246, overrideValue: 290, overrideReason: "Customer-specific forecast update - Subscribe & Save growth", planner: "Jordan", status: "needs-review", createdAt: "2026-01-05T10:00:00.000Z" },
    { id: "adj-8", sku: skus[3] ?? "COP12", retailer: "velo.com", channel: "Website", timePeriod: "Week 6, 2026", originalValue: 130, overrideValue: 165, overrideReason: "Prime Day preparation - buffer stock", planner: "Jordan", status: "needs-review", createdAt: "2026-01-04T14:00:00.000Z" },
    { id: "adj-9", sku: skus[1] ?? "CJ24", retailer: "Target", channel: "Target.com", timePeriod: "Week 5, 2026", originalValue: 158, overrideValue: 195, overrideReason: "Back to school promotion alignment", planner: "Jordan", status: "needs-review", createdAt: "2026-01-04T09:30:00.000Z" },
    { id: "adj-10", sku: skus[4] ?? "CTOTJ24", retailer: "Amazon.com (US)", channel: "Amazon.com", timePeriod: "Week 6, 2026", originalValue: 265, overrideValue: 230, overrideReason: "Inventory rebalancing - high DC stock levels", planner: "Jordan", status: "needs-review", createdAt: "2026-01-03T15:00:00.000Z" },
    { id: "adj-11", sku: skus[0] ?? "CO24", retailer: "CVS", channel: "CVS Stores", timePeriod: "Week 7, 2026", originalValue: 142, overrideValue: 180, overrideReason: "Retailer requested increase - endcap promotion", planner: "Jordan", status: "needs-review", createdAt: "2026-01-03T11:00:00.000Z" },
    { id: "adj-12", sku: skus[2] ?? "CB24", retailer: "Walmart", channel: "Walmart Stores", timePeriod: "Week 7, 2026", originalValue: 388, overrideValue: 350, overrideReason: "Demand forecast correction - overestimated seasonal lift", planner: "Jordan", status: "approved", createdAt: "2026-01-02T10:00:00.000Z" },
    { id: "adj-13", sku: skus[3] ?? "COP12", retailer: "Target", channel: "Target Stores", timePeriod: "Week 8, 2026", originalValue: 174, overrideValue: 200, overrideReason: "Shelf reset - increased facings allocation", planner: "Jordan", status: "approved", createdAt: "2026-01-02T08:00:00.000Z" },
    { id: "adj-14", sku: skus[1] ?? "CJ24", retailer: "velo.com", channel: "Website", timePeriod: "Week 8, 2026", originalValue: 225, overrideValue: 260, overrideReason: "Flash sale event - email campaign tie-in", planner: "Jordan", status: "approved", createdAt: "2026-01-01T12:00:00.000Z" },
  ]
}
