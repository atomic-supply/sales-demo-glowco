// ============================================================================
// LMNT SHIPMENTS PLAN DATA — Time-series WOS view with supply walk by SKU
// Generates weekly WOS by channel + expandable supply walk measures
// ============================================================================

import { seededRand } from "../utils/random"
import { FLAVORS, PACK_CONFIGS, CHANNELS, WAREHOUSES } from "./lmnt-master-data"
import type { Channel } from "./lmnt-master-data"

// ─── Constants ──────────────────────────────────────────────────────────────

const REF_YEAR = 2026
const REF_MONTH = 3 // April (0-indexed)

const ACTUAL_WEEKS = 4
const FORECAST_WEEKS = 12
const TOTAL_WEEKS = ACTUAL_WEEKS + FORECAST_WEEKS

/** Top 2 pack configs used per channel to keep row count manageable */
const TOP_PACKS = PACK_CONFIGS.slice(0, 2) // 30-count + 10-variety

// ─── Planner assignment ────────────────────────────────────────────────────

const PLANNER_MAP: Record<string, string> = {
  "shopify-dtc": "Mike T.",
  "amazon": "Mike T.",
  "wholesale": "Mike T.",
  "target": "Dan O.",
  "walmart": "Dan O.",
  "vitamin-shoppe": "Dan O.",
}

export const PLANNERS = ["Mike T.", "Dan O."]

// ─── Types ─────────────────────────────────────────────────────────────────

export type PeriodType = "actual" | "forecast"

export interface ShipmentsPeriod {
  label: string
  type: PeriodType
  weekIndex: number
  monthIndex: number // for seasonality lookup
}

export type ChannelStatus = "needs-review" | "in-progress" | "ready"

export interface ChannelWOSRow {
  channelId: string
  channelName: string
  channelType: "online" | "retail"
  skuCount: number
  status: ChannelStatus
  planner: string
  wosValues: number[]
}

export interface SupplyWalkMeasure {
  key: string
  label: string
  prefix: string    // "+", "−", "=", "·"
  color: string
  bold?: boolean
  editable?: boolean
  isRed?: boolean
}

export const SUPPLY_WALK_MEASURES: SupplyWalkMeasure[] = [
  { key: "open_shipment_arrivals", label: "Open Shipment Arrivals", prefix: "+", color: "#1E293B" },
  { key: "sim_shipment_arrivals", label: "Simulated Shipment Arrivals", prefix: "+", color: "#059669", editable: true },
  { key: "forecast_sales", label: "Forecast Sales", prefix: "\u2212", color: "#DC2626", isRed: true },
  { key: "unfulfilled_demand", label: "Unfulfilled Demand", prefix: "+", color: "#D97706" },
  { key: "net_supply_balance", label: "Net Supply Balance", prefix: "=", color: "#1E293B" },
  { key: "ending_inventory", label: "Ending Inventory", prefix: "=", color: "#1E293B", bold: true },
  { key: "promotions", label: "Promotions", prefix: "\u00B7", color: "#6B7280" },
  { key: "starting_wos", label: "Starting Weeks of Supply", prefix: "=", color: "#6B7280" },
  { key: "ending_wos", label: "Ending Weeks of Supply", prefix: "=", color: "#1E293B", bold: true },
  { key: "sim_shipment_qty", label: "Simulated Shipment Qty", prefix: "=", color: "#059669", editable: true },
]

export interface SkuSupplyWalkRow {
  id: string
  channelId: string
  channelName: string
  skuName: string
  flavorId: string
  packId: string
  /** Sparse shipment values per period (0 = no shipment) */
  shipmentValues: number[]
  /** Measure key → values per period */
  measures: Record<string, (number | null)[]>
}

export interface ShipmentsPlanData {
  periods: ShipmentsPeriod[]
  channelWOS: ChannelWOSRow[]
  skuWalk: SkuSupplyWalkRow[]
}

// ─── Period generation ─────────────────────────────────────────────────────

function generateWeeklyPeriods(): ShipmentsPeriod[] {
  const periods: ShipmentsPeriod[] = []
  const baseDate = new Date(REF_YEAR, REF_MONTH, 1) // April 1, 2026

  // Actual weeks: 4 weeks back from base
  for (let i = ACTUAL_WEEKS; i > 0; i--) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - i * 7)
    const mo = d.getMonth()
    const label = `${String(mo + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
    periods.push({ label, type: "actual", weekIndex: ACTUAL_WEEKS - i, monthIndex: mo })
  }

  // Forecast weeks: 12 weeks forward from base
  for (let i = 0; i < FORECAST_WEEKS; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i * 7)
    const mo = d.getMonth()
    const label = `${String(mo + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
    periods.push({ label, type: "forecast", weekIndex: i, monthIndex: mo })
  }

  return periods
}

// ─── Seed utility ──────────────────────────────────────────────────────────

function hashStr(s: string): number {
  return s.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
}

// ─── SKU-level supply walk generation ──────────────────────────────────────

function generateSkuWalk(
  flavor: typeof FLAVORS[number],
  pack: typeof PACK_CONFIGS[number],
  channel: Channel,
  periods: ShipmentsPeriod[],
): SkuSupplyWalkRow {
  const seed = hashStr(flavor.id) * 31 + hashStr(pack.id) * 47 + hashStr(channel.id) * 67 + 1000
  const rng = seededRand(seed)

  const id = `ship-${channel.id}-${flavor.id}-${pack.id}`
  const skuName = `LMNT DM ${flavor.name} (${pack.name})`

  // Base weekly demand for this SKU at this channel
  const monthlySticks = flavor.monthlyDemand * channel.demandShare * pack.demandShare
  const weeklyUnits = monthlySticks / pack.sticksPerUnit / 4.33

  const shipmentValues: number[] = []
  const openShipments: number[] = []
  const simShipments: (number | null)[] = []
  const forecastSales: number[] = []
  const unfulfilledDemand: number[] = []
  const netSupplyBalance: number[] = []
  const endingInventory: number[] = []
  const promotions: (number | null)[] = []
  const startingWOS: number[] = []
  const endingWOS: number[] = []
  const simShipmentQty: (number | null)[] = []

  // Starting inventory: ~channel.safetyStockWOS weeks of demand
  let currentInventory = Math.round(weeklyUnits * channel.safetyStockWOS * (0.8 + rng() * 0.4))

  for (let pi = 0; pi < periods.length; pi++) {
    const p = periods[pi]
    const season = flavor.seasonality[p.monthIndex]
    const weeklyDemand = Math.round(weeklyUnits * season)

    // Starting WOS
    const sWOS = weeklyDemand > 0 ? Math.round((currentInventory / weeklyDemand) * 10) / 10 : 0
    startingWOS.push(sWOS)

    // Open shipment arrivals (actual periods have confirmed orders; forecast has planned)
    let openShip = 0
    if (p.type === "actual") {
      // Actual shipments arrive on roughly 40% of weeks
      openShip = rng() < 0.4 ? Math.round(weeklyDemand * (1.5 + rng() * 2)) : 0
    } else {
      // Forecast: planned replenishment when inventory drops below safety
      const safetyUnits = Math.round(weeklyUnits * channel.safetyStockWOS * 0.5)
      if (currentInventory < safetyUnits) {
        openShip = Math.round(weeklyDemand * (2 + rng() * 3))
      } else if (rng() < 0.25) {
        openShip = Math.round(weeklyDemand * (1 + rng() * 1.5))
      }
    }
    openShipments.push(openShip)

    // Simulated shipment arrivals (forecast only, editable)
    let simShip: number | null = null
    if (p.type === "forecast" && rng() < 0.15) {
      simShip = Math.round(weeklyDemand * (1.5 + rng() * 2))
    }
    simShipments.push(simShip)

    // Forecast sales
    const noise = 0.85 + rng() * 0.3
    const sales = Math.round(weeklyDemand * noise)
    forecastSales.push(sales)

    // Unfulfilled demand (only when inventory can't cover sales)
    const totalInbound = openShip + (simShip ?? 0)
    const availableSupply = currentInventory + totalInbound
    const unfulfilled = Math.max(0, sales - availableSupply)
    unfulfilledDemand.push(unfulfilled)

    // Net supply balance
    const netBalance = totalInbound - sales
    netSupplyBalance.push(netBalance)

    // Ending inventory (forward walk)
    const endInv = Math.max(0, currentInventory + totalInbound - sales)
    endingInventory.push(endInv)

    // Promotions (sparse)
    promotions.push(rng() < 0.08 ? Math.round(weeklyDemand * (0.1 + rng() * 0.3)) : null)

    // Ending WOS
    const eWOS = weeklyDemand > 0 ? Math.round((endInv / weeklyDemand) * 10) / 10 : 0
    endingWOS.push(eWOS)

    // Simulated shipment qty (editable forecast field)
    simShipmentQty.push(p.type === "forecast" && simShip != null ? simShip : null)

    // Shipment value for parent row (total inbound)
    shipmentValues.push(totalInbound > 0 ? totalInbound : 0)

    // Carry forward
    currentInventory = endInv
  }

  return {
    id,
    channelId: channel.id,
    channelName: channel.name,
    skuName,
    flavorId: flavor.id,
    packId: pack.id,
    shipmentValues,
    measures: {
      open_shipment_arrivals: openShipments,
      sim_shipment_arrivals: simShipments,
      forecast_sales: forecastSales,
      unfulfilled_demand: unfulfilledDemand,
      net_supply_balance: netSupplyBalance,
      ending_inventory: endingInventory,
      promotions,
      starting_wos: startingWOS,
      ending_wos: endingWOS,
      sim_shipment_qty: simShipmentQty,
    },
  }
}

// ─── Channel WOS aggregation ───────────────────────────────────────────────

function computeChannelWOS(
  channel: Channel,
  skuRows: SkuSupplyWalkRow[],
  periods: ShipmentsPeriod[],
): ChannelWOSRow {
  const channelSkus = skuRows.filter(s => s.channelId === channel.id)

  // Aggregate ending WOS across all SKUs per period (weighted average)
  const wosValues: number[] = []
  for (let pi = 0; pi < periods.length; pi++) {
    let totalEndInv = 0
    let totalWeeklyDemand = 0
    for (const sku of channelSkus) {
      const endInv = sku.measures.ending_inventory[pi] ?? 0
      const sales = sku.measures.forecast_sales[pi] ?? 1
      totalEndInv += endInv as number
      totalWeeklyDemand += sales as number
    }
    const wos = totalWeeklyDemand > 0 ? Math.round((totalEndInv / totalWeeklyDemand) * 10) / 10 : 0
    wosValues.push(wos)
  }

  // Status based on forecast WOS values
  const forecastWOS = wosValues.slice(ACTUAL_WEEKS)
  let status: ChannelStatus = "ready"
  if (forecastWOS.some(w => w < 3)) status = "needs-review"
  else if (forecastWOS.some(w => w < 5)) status = "in-progress"

  return {
    channelId: channel.id,
    channelName: channel.name,
    channelType: channel.channelType,
    skuCount: channelSkus.length,
    status,
    planner: PLANNER_MAP[channel.id] ?? "Unassigned",
    wosValues,
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

export function getShipmentsPlanData(
  warehouseFilter?: string,
  channelFilter?: string,
  plannerFilter?: string,
): ShipmentsPlanData {
  const periods = generateWeeklyPeriods()

  // Determine which channels to include based on filters
  let channels = [...CHANNELS]

  if (warehouseFilter) {
    const wh = WAREHOUSES.find(w => w.id === warehouseFilter)
    if (wh) {
      channels = channels.filter(c => wh.servesChannels.includes(c.id))
    }
  }

  if (channelFilter) {
    channels = channels.filter(c => c.id === channelFilter)
  }

  if (plannerFilter) {
    channels = channels.filter(c => PLANNER_MAP[c.id] === plannerFilter)
  }

  // Generate SKU-level supply walk rows
  const skuWalk: SkuSupplyWalkRow[] = []
  for (const channel of channels) {
    for (const flavor of FLAVORS) {
      for (const pack of TOP_PACKS) {
        skuWalk.push(generateSkuWalk(flavor, pack, channel, periods))
      }
    }
  }

  // Compute channel-level WOS aggregation
  const channelWOS: ChannelWOSRow[] = channels.map(ch =>
    computeChannelWOS(ch, skuWalk, periods),
  )

  return { periods, channelWOS, skuWalk }
}
