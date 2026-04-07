// ============================================================================
// GLOWCO CONSUMPTION PLAN DATA — UPSPW time-series for demand forecasting
// Generates per-SKU × per-retailer data with UPSPW (retail) and growth (online)
// ============================================================================

import { seededRand } from "../utils/random"
import { FORMULATIONS, PACK_CONFIGS, CHANNELS } from "./glowco-master-data"
import type { ActionRow, ActionTableConfig, PlanColumn, PlanRow, ActionStatus } from "../components/StageView/types"

// ─── Constants ──────────────────────────────────────────────────────────────

/** Reference date: April 2026. Actuals go back, forecasts go forward. */
const REF_YEAR = 2026
const REF_MONTH = 3 // April (0-indexed)

const ACTUAL_MONTHS = 3
const FORECAST_MONTHS = 6

const ACTUAL_WEEKS = 12
const FORECAST_WEEKS = 12

// ─── Types ──────────────────────────────────────────────────────────────────

export type PeriodType = "actual" | "forecast"

export interface ConsumptionPeriod {
  label: string
  type: PeriodType
  monthIndex: number
  weekIndex?: number
}

export interface ConsumptionMeasure {
  key: string
  label: string
  color: string
  bg: string
  bold?: boolean
  editable?: boolean
  actualsOnly?: boolean
}

export interface ConsumptionSkuData {
  id: string
  skuName: string
  formulationId: string
  packId: string
  retailerId: string
  retailerName: string
  channelType: "online" | "retail"
  /** Values per measure per period: measureKey → periodIndex → value */
  measures: Record<string, (number | null)[]>
}

export interface ConsumptionDataSet {
  periods: ConsumptionPeriod[]
  skus: ConsumptionSkuData[]
  measures: ConsumptionMeasure[]
}

// ─── Retail measure definitions ─────────────────────────────────────────────

export const RETAIL_MEASURES: ConsumptionMeasure[] = [
  { key: "projected_pos", label: "Projected POS", color: "#1E293B", bg: "transparent", bold: true },
  { key: "seasonality", label: "Seasonality Index", color: "#6B7280", bg: "transparent" },
  { key: "baseline_upspw", label: "Baseline UPSPW", color: "#1E293B", bg: "transparent", editable: true },
  { key: "offshelf_upspw", label: "Off-Shelf UPSPW", color: "#1E293B", bg: "transparent", editable: true },
  { key: "stores_tracked", label: "Stores Tracked", color: "#6B7280", bg: "transparent" },
  { key: "forecasted_upspw", label: "Forecasted UPSPW", color: "#059669", bg: "#F0FDF4" },
  { key: "stockin_assumption", label: "Stock-in Order Assumption", color: "#1E293B", bg: "transparent", editable: true },
  { key: "actuals_orders", label: "Actuals - Orders", color: "#D97706", bg: "#FEF3C7", actualsOnly: true },
  { key: "actuals_pos", label: "Actuals - POS", color: "#D97706", bg: "#FEF3C7", actualsOnly: true },
  { key: "upspw_orders", label: "UPSPW - Orders", color: "#6B7280", bg: "transparent" },
  { key: "upspw_pos", label: "UPSPW - POS", color: "#6B7280", bg: "transparent" },
  { key: "retail_wos", label: "Retail WOS", color: "#1E293B", bg: "transparent", bold: true },
]

export const ONLINE_MEASURES: ConsumptionMeasure[] = [
  { key: "projected_pos", label: "Forecast", color: "#1E293B", bg: "transparent", bold: true },
  { key: "actuals_orders", label: "Actuals", color: "#D97706", bg: "#FEF3C7", actualsOnly: true },
  { key: "baseline", label: "Baseline", color: "#6B7280", bg: "transparent" },
  { key: "growth_rate", label: "Growth Rate", color: "#6B7280", bg: "transparent" },
  { key: "seasonality", label: "Seasonality", color: "#6B7280", bg: "transparent" },
  { key: "override", label: "Override", color: "#1E293B", bg: "transparent", editable: true },
]

// ─── Period generation ──────────────────────────────────────────────────────

function generateMonthlyPeriods(): ConsumptionPeriod[] {
  const periods: ConsumptionPeriod[] = []
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let i = ACTUAL_MONTHS; i > 0; i--) {
    const mo = (REF_MONTH - i + 12) % 12
    const yr = REF_YEAR - (REF_MONTH - i < 0 ? 1 : 0)
    periods.push({
      label: `${monthNames[mo]} ${String(yr).slice(2)}`,
      type: "actual",
      monthIndex: mo,
    })
  }

  for (let i = 0; i < FORECAST_MONTHS; i++) {
    const mo = (REF_MONTH + i) % 12
    const yr = REF_YEAR + Math.floor((REF_MONTH + i) / 12)
    periods.push({
      label: `${monthNames[mo]} ${String(yr).slice(2)}`,
      type: "forecast",
      monthIndex: mo,
    })
  }

  return periods
}

function generateWeeklyPeriods(): ConsumptionPeriod[] {
  const periods: ConsumptionPeriod[] = []
  const baseDate = new Date(REF_YEAR, REF_MONTH, 1)

  for (let i = ACTUAL_WEEKS; i > 0; i--) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - i * 7)
    const mo = d.getMonth()
    const label = `${String(mo + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`
    periods.push({ label, type: "actual", monthIndex: mo, weekIndex: ACTUAL_WEEKS - i })
  }

  for (let i = 0; i < FORECAST_WEEKS; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i * 7)
    const mo = d.getMonth()
    const label = `${String(mo + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`
    periods.push({ label, type: "forecast", monthIndex: mo, weekIndex: i })
  }

  return periods
}

// ─── Data generation ────────────────────────────────────────────────────────

function hashStr(s: string): number {
  return s.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
}

function generateRetailSkuData(
  formulation: typeof FORMULATIONS[number],
  pack: typeof PACK_CONFIGS[number],
  channel: typeof CHANNELS[number],
  periods: ConsumptionPeriod[],
): ConsumptionSkuData {
  const seed = hashStr(formulation.id) * 31 + hashStr(pack.id) * 47 + hashStr(channel.id) * 67
  const rng = seededRand(seed)

  const id = `cons-${channel.id}-${formulation.id}-${pack.id}`
  const skuName = `GlowCo ${formulation.name} (${pack.name})`

  const baseUpspw = 6 + Math.round(rng() * 8)
  const offshelfUpspw = rng() < 0.3 ? Math.round(2 + rng() * 5) : 0

  const measures: Record<string, (number | null)[]> = {}

  const seasonality: number[] = []
  const baselineUpspw: number[] = []
  const offshelfValues: number[] = []
  const storesTracked: number[] = []
  const forecastedUpspw: number[] = []
  const stockinAssumption: (number | null)[] = []
  const actualsOrders: (number | null)[] = []
  const actualsPOS: (number | null)[] = []
  const upspwOrders: (number | null)[] = []
  const upspwPOS: (number | null)[] = []
  const projectedPOS: number[] = []
  const retailWOS: number[] = []

  for (let pi = 0; pi < periods.length; pi++) {
    const p = periods[pi]
    const season = formulation.seasonality[p.monthIndex]

    seasonality.push(Math.round(season * 100) / 100)
    baselineUpspw.push(Math.round(baseUpspw * (0.95 + rng() * 0.1) * 100) / 100)
    offshelfValues.push(offshelfUpspw > 0 && rng() < 0.2 ? Math.round(offshelfUpspw * (0.8 + rng() * 0.4) * 100) / 100 : 0)
    storesTracked.push(channel.storeCount)

    const fUpspw = baselineUpspw[pi] * season + offshelfValues[pi]
    forecastedUpspw.push(Math.round(fUpspw * 100) / 100)

    stockinAssumption.push(rng() < 0.05 ? Math.round(channel.storeCount * baseUpspw * 2) : 0)

    const projPOS = Math.round(fUpspw * channel.storeCount)
    projectedPOS.push(projPOS)

    if (p.type === "actual") {
      const noise = 0.88 + rng() * 0.14
      const actualOrder = Math.round(projPOS * noise * (0.95 + rng() * 0.1))
      const actualPOS_ = Math.round(projPOS * noise)
      actualsOrders.push(actualOrder)
      actualsPOS.push(actualPOS_)
      upspwOrders.push(Math.round((actualOrder / channel.storeCount) * 100) / 100)
      upspwPOS.push(Math.round((actualPOS_ / channel.storeCount) * 100) / 100)
    } else {
      actualsOrders.push(null)
      actualsPOS.push(null)
      upspwOrders.push(null)
      upspwPOS.push(null)
    }

    const onHandWeeks = 4 + rng() * 4
    retailWOS.push(Math.round(onHandWeeks * 10) / 10)
  }

  measures.projected_pos = projectedPOS
  measures.seasonality = seasonality
  measures.baseline_upspw = baselineUpspw
  measures.offshelf_upspw = offshelfValues
  measures.stores_tracked = storesTracked
  measures.forecasted_upspw = forecastedUpspw
  measures.stockin_assumption = stockinAssumption
  measures.actuals_orders = actualsOrders
  measures.actuals_pos = actualsPOS
  measures.upspw_orders = upspwOrders
  measures.upspw_pos = upspwPOS
  measures.retail_wos = retailWOS

  return {
    id,
    skuName,
    formulationId: formulation.id,
    packId: pack.id,
    retailerId: channel.id,
    retailerName: channel.name,
    channelType: "retail" as const,
    measures,
  }
}

function generateOnlineSkuData(
  formulation: typeof FORMULATIONS[number],
  pack: typeof PACK_CONFIGS[number],
  channel: typeof CHANNELS[number],
  periods: ConsumptionPeriod[],
): ConsumptionSkuData {
  const seed = hashStr(formulation.id) * 31 + hashStr(pack.id) * 47 + hashStr(channel.id) * 67
  const rng = seededRand(seed)

  const id = `cons-${channel.id}-${formulation.id}-${pack.id}`
  const skuName = `GlowCo ${formulation.name} (${pack.name})`

  const baseDemand = Math.round(formulation.monthlyDemand * channel.demandShare * pack.demandShare / pack.unitsPerPack)
  const growthRate = 1.02 + rng() * 0.03

  const measures: Record<string, (number | null)[]> = {}

  const projectedPOS: number[] = []
  const actualsOrders: (number | null)[] = []
  const baseline: number[] = []
  const growthRates: number[] = []
  const seasonality: number[] = []
  const override: (number | null)[] = []

  for (let pi = 0; pi < periods.length; pi++) {
    const p = periods[pi]
    const season = formulation.seasonality[p.monthIndex]
    const monthsFromStart = pi - ACTUAL_MONTHS
    const compoundGrowth = Math.pow(growthRate, monthsFromStart)

    const baseValue = Math.round(baseDemand * compoundGrowth)
    baseline.push(baseValue)
    growthRates.push(Math.round((growthRate - 1) * 10000) / 100)
    seasonality.push(Math.round(season * 100) / 100)

    const forecast = Math.round(baseValue * season)
    projectedPOS.push(forecast)

    if (p.type === "actual") {
      const noise = 0.9 + rng() * 0.2
      actualsOrders.push(Math.round(forecast * noise))
    } else {
      actualsOrders.push(null)
    }

    override.push(rng() < 0.08 ? Math.round(forecast * (1 + (rng() - 0.3) * 0.3)) : null)
  }

  measures.projected_pos = projectedPOS
  measures.actuals_orders = actualsOrders
  measures.baseline = baseline
  measures.growth_rate = growthRates
  measures.seasonality = seasonality
  measures.override = override

  return {
    id,
    skuName,
    formulationId: formulation.id,
    packId: pack.id,
    retailerId: channel.id,
    retailerName: channel.name,
    channelType: "online" as const,
    measures,
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function getConsumptionPlanData(display: "week" | "month", retailerFilter?: string): ConsumptionDataSet {
  const periods = display === "week" ? generateWeeklyPeriods() : generateMonthlyPeriods()
  const skus: ConsumptionSkuData[] = []

  const channels = retailerFilter
    ? CHANNELS.filter(c => c.id === retailerFilter)
    : [...CHANNELS].sort((a, b) => {
        if (a.channelType === "retail" && b.channelType === "online") return -1
        if (a.channelType === "online" && b.channelType === "retail") return 1
        return 0
      })

  for (const channel of channels) {
    const packs = channel.channelType === "retail"
      ? PACK_CONFIGS.slice(0, 4)
      : PACK_CONFIGS.slice(0, 2)

    for (const formulation of FORMULATIONS) {
      for (const pack of packs) {
        if (channel.channelType === "retail") {
          skus.push(generateRetailSkuData(formulation, pack, channel, periods))
        } else {
          skus.push(generateOnlineSkuData(formulation, pack, channel, periods))
        }
      }
    }
  }

  const measures = retailerFilter
    ? (CHANNELS.find(c => c.id === retailerFilter)?.channelType === "retail" ? RETAIL_MEASURES : ONLINE_MEASURES)
    : RETAIL_MEASURES

  return { periods, skus, measures }
}

// ─── Pivot data ─────────────────────────────────────────────────────────────

export interface PivotRow {
  channel: string
  subChannel: string
  values: number[]
}

export function getConsumptionPivotData(): { periods: ConsumptionPeriod[]; rows: PivotRow[] } {
  const periods = generateMonthlyPeriods()
  const rows: PivotRow[] = []

  const channelGroups: Record<string, string[]> = {
    "D2C": ["amazon", "ecommerce"],
    "Retail": ["wholesale"],
    "B2B": ["b2b"],
  }

  for (const [groupName, channelIds] of Object.entries(channelGroups)) {
    for (const chId of channelIds) {
      const ch = CHANNELS.find(c => c.id === chId)!
      const values = periods.map((p) => {
        let total = 0
        for (const formulation of FORMULATIONS) {
          const season = formulation.seasonality[p.monthIndex]
          total += Math.round(formulation.monthlyDemand * ch.demandShare * season)
        }
        return total
      })
      rows.push({ channel: groupName, subChannel: ch.name, values })
    }
  }

  return { periods, rows }
}

// ─── Validation data ────────────────────────────────────────────────────────

export interface ValidationOverride {
  id: string
  sku: string
  retailer: string
  retailerId: string
  channel: string
  timePeriod: string
  original: number
  override: number
  delta: number
  deltaPct: number
  planner: string
  status: "needs-review" | "approved"
}

export interface ValidationData {
  actionTable: ActionTableConfig
  overrides: ValidationOverride[]
}

export function getConsumptionValidationData(): ValidationData {
  const rng = seededRand(9999)
  const overrides: ValidationOverride[] = []
  const periods = generateMonthlyPeriods()

  const retailChannels = CHANNELS.filter(c => c.channelType === "retail")
  const onlineChannels = CHANNELS.filter(c => c.channelType === "online")
  const allChannels = [...retailChannels, ...onlineChannels]

  let overrideId = 0
  for (const ch of allChannels) {
    const numOverrides = 2 + Math.floor(rng() * 4)
    for (let i = 0; i < numOverrides; i++) {
      const formulation = FORMULATIONS[Math.floor(rng() * FORMULATIONS.length)]
      const pack = PACK_CONFIGS[Math.floor(rng() * PACK_CONFIGS.length)]
      const period = periods[Math.floor(ACTUAL_MONTHS + rng() * FORECAST_MONTHS)]
      const skuName = `GlowCo ${formulation.name} (${pack.name})`

      const baseDemand = Math.round(formulation.monthlyDemand * ch.demandShare * pack.demandShare / pack.unitsPerPack)
      const season = formulation.seasonality[period.monthIndex]
      const original = Math.round(baseDemand * season)
      const direction = rng() > 0.4 ? 1 : -1
      const magnitude = 0.05 + rng() * 0.25
      const override = Math.round(original * (1 + direction * magnitude))
      const delta = override - original
      const deltaPct = original > 0 ? delta / original : 0

      overrides.push({
        id: `val-${overrideId++}`,
        sku: skuName,
        retailer: ch.name,
        retailerId: ch.id,
        channel: ch.channelType === "retail" ? "Retail" : "D2C",
        timePeriod: period.label,
        original,
        override,
        delta,
        deltaPct,
        planner: "Sarah",
        status: rng() < 0.35 ? "approved" : "needs-review",
      })
    }
  }

  const channelAgg: Record<string, { count: number; totalDelta: number; overrideIds: string[]; needsReview: number }> = {}
  for (const ch of allChannels) {
    channelAgg[ch.id] = { count: 0, totalDelta: 0, overrideIds: [], needsReview: 0 }
  }
  for (const ov of overrides) {
    const agg = channelAgg[ov.retailerId]
    if (agg) {
      agg.count++
      agg.totalDelta += ov.delta
      agg.overrideIds.push(ov.id)
      if (ov.status === "needs-review") agg.needsReview++
    }
  }

  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Channel", type: "label", sticky: true, width: 200 },
    { key: "overrides", label: "Overrides", type: "number" },
    { key: "needs_review", label: "Needs Review", type: "number" },
    { key: "total_delta", label: "Total Delta", type: "number" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const actionRows: ActionRow[] = allChannels.map(ch => {
    const agg = channelAgg[ch.id]
    const status: ActionStatus = agg.needsReview > 0 ? "needs-review" : "approved"
    return {
      id: `action-val-${ch.id}`,
      label: ch.name,
      values: {
        overrides: agg.count,
        needs_review: agg.needsReview,
        total_delta: agg.totalDelta,
        status: null,
      },
      status,
      detailIds: agg.overrideIds,
    }
  })

  return {
    actionTable: {
      title: "Override Summary by Channel",
      description: "Planner overrides grouped by sales channel",
      columns: actionColumns,
      rows: actionRows,
    },
    overrides,
  }
}
