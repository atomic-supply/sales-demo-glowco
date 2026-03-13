import { seededRand } from "../utils/random"
import { retailerSkuMapping } from "./runs/unified-data"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DemandRow {
  channel: string
  sku: string
  skuName: string
}

export type CategoryType = "History" | "Baseline Forecast" | "Planner Override" | "Final Forecast" | "YoY%"

export interface MeasureRow {
  category: CategoryType
  year: string
  values: (number | null)[]
}

export interface SkuDemandData {
  baselineForecast: number[]
  promotionalLift: number[]
  adjustedForecast: number[]
}

export interface RetailDemandData {
  [retailer: string]: {
    channels: Record<string, { skus: Record<string, SkuDemandData> }>
  }
}

// ─── Default date range ───────────────────────────────────────────────────────

export const DEFAULT_FROM_DATE = "12/01/2025"
export const DEFAULT_TO_DATE = "03/31/2026"

// ─── Deterministic data generation ───────────────────────────────────────────

export function generateDemandWalkData(sku: string, channel: string, monthColumns: string[]): MeasureRow[] {
  const rand = seededRand(
    sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137 +
    channel.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  )
  const colMonths = monthColumns.map((col) => {
    const [m, , y] = col.split("/").map(Number)
    return { month: m, year: y + 2000 }
  })
  const skuHash = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseDemand = 200 + (skuHash % 800)
  const seasonality = [0.85, 0.90, 1.05, 1.15, 1.25, 1.30, 1.20, 1.10, 1.00, 0.95, 1.10, 1.35]
  const years = ["2022-23", "2023-24", "2024-25"]
  const growthRates = [1.0, 1.25, 1.40]

  const historyRows: MeasureRow[] = years.map((yr, yi) => ({
    category: "History",
    year: yr,
    values: colMonths.map(({ month }) => {
      if (yi === 0 && month < 10) return null
      const base = baseDemand * growthRates[yi] * seasonality[month - 1]
      return Math.round(base * (0.85 + rand() * 0.3))
    }),
  }))

  const baselineGrowth = 1.32 + rand() * 0.08
  const baselineRow: MeasureRow = {
    category: "Baseline Forecast",
    year: "2025-26",
    values: colMonths.map(({ month }) =>
      Math.round(baseDemand * growthRates[2] * baselineGrowth * seasonality[month - 1] * (0.95 + rand() * 0.1))
    ),
  }

  const overrideRow: MeasureRow = { category: "Planner Override", year: "", values: colMonths.map(() => null) }

  const finalRow: MeasureRow = {
    category: "Final Forecast",
    year: "",
    values: baselineRow.values.map((v, i) => {
      const ov = overrideRow.values[i]
      return ov !== null ? ov : v
    }),
  }

  const lastHistory = historyRows[historyRows.length - 1]
  const yoyRow: MeasureRow = {
    category: "YoY%",
    year: "",
    values: finalRow.values.map((f, i) => {
      const h = lastHistory.values[i]
      if (f === null || h === null || h === 0) return null
      return Math.round(((f / h) - 1) * 100)
    }),
  }

  return [...historyRows, baselineRow, overrideRow, finalRow, yoyRow]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getChannel(retailer: string): string {
  return ["velo.com", "Amazon.com (US)", "Amazon (Canada)"].includes(retailer) ? "E-Commerce" : "Retail"
}

export function buildDemandRows(): DemandRow[] {
  const rows: DemandRow[] = []
  for (const [retailer, skus] of Object.entries(retailerSkuMapping)) {
    const channel = getChannel(retailer)
    for (const { sku, name } of skus) {
      rows.push({ channel, sku, skuName: name })
    }
  }
  return rows
}

// ─── Retail demand data (Retailer → Channel → SKU) ────────────────────────────

export function buildRetailDemandData(dateColumns: string[]): RetailDemandData {
  const result: RetailDemandData = {}
  const seasonality = [0.85, 0.90, 1.05, 1.15, 1.25, 1.30, 1.20, 1.10, 1.00, 0.95, 1.10, 1.35]

  for (const [retailer, skuList] of Object.entries(retailerSkuMapping)) {
    result[retailer] = { channels: {} }
    const channelSkus: Record<string, SkuDemandData> = {}

    for (const { sku } of skuList) {
      const seed = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137 +
        retailer.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 53
      const rand = seededRand(seed)
      const skuHash = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      const baseDemand = 300 + (skuHash % 1200)

      const baselineForecast = dateColumns.map((col) => {
        const m = Number(col.split("/")[0])
        const season = seasonality[(m - 1) % 12]
        return Math.round(baseDemand * season * (0.9 + rand() * 0.2))
      })

      const promotionalLift = dateColumns.map(() => {
        const r = rand()
        return r > 0.8 ? Math.round(baseDemand * 0.12 * (1 + rand())) : 0
      })

      const adjustedForecast = baselineForecast.map((b, i) => b + promotionalLift[i])
      channelSkus[sku] = { baselineForecast, promotionalLift, adjustedForecast }
    }

    result[retailer].channels[retailer] = { skus: channelSkus }
  }

  return result
}
