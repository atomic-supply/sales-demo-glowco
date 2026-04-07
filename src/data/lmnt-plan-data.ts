// ============================================================================
// LMNT PLAN DATA — Dual-component data for all 6 modules
// Each module returns: actionTable (top) + detail columns/rows (bottom)
// Point-in-time focused — time series lives in supply walk expanders only
// ============================================================================

import { seededRand } from "../utils/random"
import type { PlanColumn, PlanRow, ActionRow, ActionTableConfig, ActionStatus } from "../components/StageView/types"
import {
  FLAVORS,
  PACK_CONFIGS,
  CHANNELS,
  COMAN_SITES,
  WAREHOUSES,
  BOM_ITEMS,
  PRODUCTION_BATCH_SIZE,
  TARGET_WOS_WIP,
  TARGET_WOS_FG,
  getMonthlyDemand,
} from "./lmnt-master-data"

// ─── Helpers ────────────────────────────────────────────────────────────────

const WEIGHTED_STICKS_PER_UNIT =
  PACK_CONFIGS.reduce((s, p) => s + p.sticksPerUnit * p.demandShare, 0)

function sticksToUnits(sticks: number): number {
  return Math.round(sticks / WEIGHTED_STICKS_PER_UNIT)
}

function getFlavorMonthlySticks(): number[][] {
  return FLAVORS.map((f) =>
    Array.from({ length: 12 }, (_, mo) => getMonthlyDemand(f, mo)),
  )
}

function getTotalMonthlySticks(): number[] {
  const fm = getFlavorMonthlySticks()
  return Array.from({ length: 12 }, (_, mo) =>
    fm.reduce((s, arr) => s + arr[mo], 0),
  )
}

function pickStatus(rng: () => number): ActionStatus {
  const r = rng()
  if (r < 0.35) return "needs-review"
  if (r < 0.6) return "approved"
  if (r < 0.8) return "in-progress"
  return "on-track"
}

export interface DualTableData {
  actionTable: ActionTableConfig
  columns: PlanColumn[]
  rows: PlanRow[]
}

// ============================================================================
// 1. CONSUMPTION MODULE
// Action: Demand signals by channel (point-in-time for current month)
// Detail: Flavor × Channel
// ============================================================================

export function getConsumptionData(): DualTableData {
  const flavorSticks = getFlavorMonthlySticks()

  // --- Action Table: 1 row per channel ---
  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Channel", type: "label", sticky: true, width: 200 },
    { key: "forecast", label: "Forecast (units)", type: "number" },
    { key: "actual", label: "Actual (units)", type: "number" },
    { key: "variance", label: "Variance", type: "number" },
    { key: "var_pct", label: "Var %", type: "pct" },
    { key: "trend", label: "Trend", type: "badge" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const actionRows: ActionRow[] = []

  // --- Detail Table: Flavor × Channel (point-in-time current month) ---
  const detailColumns: PlanColumn[] = [
    { key: "label", label: "Flavor / Channel", type: "label", sticky: true, width: 220 },
    { key: "forecast", label: "Forecast", type: "number" },
    { key: "actual", label: "Actual", type: "number" },
    { key: "baseline", label: "Baseline", type: "number" },
    { key: "override", label: "Override", type: "number", editable: true },
    { key: "final", label: "Final", type: "number" },
    { key: "yoy", label: "YoY %", type: "pct" },
    { key: "attribution", label: "Source", type: "badge" },
  ]

  const detailRows: PlanRow[] = []

  for (const channel of CHANNELS) {
    const rng = seededRand(
      channel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 17,
    )

    let totalForecast = 0
    let totalActual = 0
    const childIds: string[] = []

    // Parent row for this channel in detail table
    const parentId = `cons-${channel.id}`
    const parentValues: Record<string, number | string | null> = {
      forecast: 0, actual: 0, baseline: 0, override: null, final: 0, yoy: 0, attribution: null,
    }

    for (let fi = 0; fi < FLAVORS.length; fi++) {
      const flavor = FLAVORS[fi]
      const childId = `cons-${channel.id}-${flavor.id}`
      childIds.push(childId)

      const stickDemand = Math.round(flavorSticks[fi][0] * channel.demandShare)
      const forecast = sticksToUnits(stickDemand)
      const histFactor = 0.88 + rng() * 0.07
      const actual = Math.round(forecast * histFactor)
      const baseline = forecast

      let override: number | null = null
      if (rng() < 0.15) {
        override = Math.round(baseline * (1.0 + (rng() - 0.4) * 0.3))
      }
      const final_ = override ?? baseline
      const yoy = actual > 0 ? (final_ - actual) / actual : 0

      detailRows.push({
        id: childId,
        label: flavor.name,
        type: "child",
        parentId,
        values: { forecast, actual, baseline, override, final: final_, yoy, attribution: override != null ? "override" : "engine" },
        attribution: override != null ? "override" : "engine",
      })

      totalForecast += forecast
      totalActual += actual
      parentValues.forecast = (parentValues.forecast as number) + forecast
      parentValues.actual = (parentValues.actual as number) + actual
      parentValues.baseline = (parentValues.baseline as number) + baseline
      parentValues.final = (parentValues.final as number) + final_
    }

    // Parent YoY
    const pActual = parentValues.actual as number
    const pFinal = parentValues.final as number
    parentValues.yoy = pActual > 0 ? (pFinal - pActual) / pActual : 0

    detailRows.push({
      id: parentId,
      label: channel.name,
      type: "parent",
      values: parentValues,
    })

    // Action row
    const variance = totalActual - totalForecast
    const varPct = totalForecast > 0 ? variance / totalForecast : 0
    const trend = variance > 0 ? "↑" : variance < -totalForecast * 0.03 ? "↓" : "→"

    actionRows.push({
      id: `action-cons-${channel.id}`,
      label: channel.name,
      values: {
        forecast: totalForecast,
        actual: totalActual,
        variance,
        var_pct: varPct,
        trend,
        status: null,
      },
      status: Math.abs(varPct) > 0.04 ? "needs-review" : "on-track",
      detailIds: [parentId, ...childIds],
    })
  }

  // Sort detail: parents first, children after
  const sorted: PlanRow[] = []
  for (const channel of CHANNELS) {
    const parent = detailRows.find((r) => r.id === `cons-${channel.id}`)!
    sorted.push(parent)
    sorted.push(...detailRows.filter((r) => r.parentId === parent.id))
  }

  return {
    actionTable: {
      title: "Demand Signals by Channel",
      description: "Current month forecast vs. actual by sales channel",
      columns: actionColumns,
      rows: actionRows,
    },
    columns: detailColumns,
    rows: sorted,
  }
}

// ============================================================================
// 2. SHIPMENTS MODULE
// Action: Shipment decisions by channel (point-in-time)
// Detail: Flavor × Warehouse
// ============================================================================

export function getShipmentsData(): DualTableData {
  const flavorSticks = getFlavorMonthlySticks()

  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Channel", type: "label", sticky: true, width: 220 },
    { key: "units_to_ship", label: "Units to Ship", type: "number" },
    { key: "fill_rate", label: "Fill Rate", type: "pct" },
    { key: "open_orders", label: "Open Orders", type: "number" },
    { key: "in_transit", label: "In Transit", type: "number" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const detailColumns: PlanColumn[] = [
    { key: "label", label: "Flavor / Warehouse", type: "label", sticky: true, width: 220 },
    { key: "demand", label: "Demand", type: "number" },
    { key: "curr_inv", label: "Current Inv", type: "number" },
    { key: "ss_target", label: "SS Target", type: "number" },
    { key: "ship_qty", label: "Ship Qty", type: "number", editable: true },
    { key: "end_inv", label: "End Inv", type: "number" },
    { key: "wos", label: "WOS", type: "wos" },
    { key: "attribution", label: "Source", type: "badge" },
  ]

  const actionRows: ActionRow[] = []
  const detailRows: PlanRow[] = []

  // Build per-channel aggregation
  const channelAgg: Record<string, { units: number; demand: number; orders: number; transit: number; childIds: string[] }> = {}
  for (const ch of CHANNELS) {
    channelAgg[ch.id] = { units: 0, demand: 0, orders: 0, transit: 0, childIds: [] }
  }

  // Map each warehouse to the channels it serves
  const warehousesByChannel: Record<string, typeof WAREHOUSES> = {}
  for (const ch of CHANNELS) {
    warehousesByChannel[ch.id] = WAREHOUSES.filter(wh => wh.servesChannels.includes(ch.id))
  }

  for (const channel of CHANNELS) {
    const chWarehouses = warehousesByChannel[channel.id]
    const totalWhShare = chWarehouses.reduce((s, wh) => s + wh.allocationShare, 0)

    for (let fi = 0; fi < FLAVORS.length; fi++) {
      const flavor = FLAVORS[fi]
      const parentId = `ship-${channel.id}-${flavor.id}`
      const parentValues: Record<string, number | string | null> = {
        demand: 0, curr_inv: 0, ss_target: 0, ship_qty: 0, end_inv: 0, wos: 0, attribution: null,
      }

      for (const wh of chWarehouses) {
        const childId = `ship-${channel.id}-${flavor.id}-${wh.id}`
        const rng = seededRand(
          flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 23 +
            wh.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 19 +
            channel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 13,
        )

        // Channel's share of this flavor, distributed across warehouses serving the channel
        const channelStickDemand = Math.round(flavorSticks[fi][0] * channel.demandShare)
        const whShareOfChannel = totalWhShare > 0 ? wh.allocationShare / totalWhShare : 1 / chWarehouses.length
        const whStickDemand = Math.round(channelStickDemand * whShareOfChannel)
        const weeklyUnitDemand = Math.round(sticksToUnits(whStickDemand) / 4)
        const ssTarget = weeklyUnitDemand * TARGET_WOS_FG
        const currInv = Math.round(ssTarget * (0.9 + rng() * 0.3))
        const demand = Math.round(weeklyUnitDemand * (0.9 + rng() * 0.2))
        const shipQty = Math.max(0, demand + ssTarget - currInv)
        const endInv = currInv + shipQty - demand
        const wos = demand > 0 ? Math.round((endInv / demand) * 10) / 10 : 0

        detailRows.push({
          id: childId,
          label: wh.name,
          type: "child",
          parentId,
          values: { demand, curr_inv: currInv, ss_target: ssTarget, ship_qty: shipQty, end_inv: endInv, wos, attribution: "engine" },
          attribution: "engine",
        })

        parentValues.demand = (parentValues.demand as number) + demand
        parentValues.curr_inv = (parentValues.curr_inv as number) + currInv
        parentValues.ss_target = (parentValues.ss_target as number) + ssTarget
        parentValues.ship_qty = (parentValues.ship_qty as number) + shipQty
        parentValues.end_inv = (parentValues.end_inv as number) + endInv

        channelAgg[channel.id].units += shipQty
        channelAgg[channel.id].demand += demand
        channelAgg[channel.id].orders += Math.round(3 + rng() * 5)
        channelAgg[channel.id].transit += Math.round(shipQty * (0.2 + rng() * 0.3))
        channelAgg[channel.id].childIds.push(childId)
      }

      // Parent WOS
      const d = parentValues.demand as number
      const e = parentValues.end_inv as number
      parentValues.wos = d > 0 ? Math.round((e / d) * 10) / 10 : 0

      detailRows.push({
        id: parentId,
        label: flavor.name,
        type: "parent",
        values: parentValues,
      })

      channelAgg[channel.id].childIds.push(parentId)
    }
  }

  // Build action rows from channel aggregation
  for (const ch of CHANNELS) {
    const agg = channelAgg[ch.id]
    const rng = seededRand(ch.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 31)
    const fillRate = agg.demand > 0 ? Math.min(100, Math.round((agg.units / agg.demand) * 100)) : 100

    actionRows.push({
      id: `action-ship-${ch.id}`,
      label: ch.name,
      values: {
        units_to_ship: agg.units,
        fill_rate: fillRate / 100,
        open_orders: agg.orders,
        in_transit: agg.transit,
        status: null,
      },
      status: fillRate < 90 ? "needs-review" : pickStatus(rng),
      detailIds: [...new Set(agg.childIds)],
    })
  }

  // Sort detail rows: group by channel, then flavor parent + warehouse children
  const sorted: PlanRow[] = []
  for (const channel of CHANNELS) {
    for (const flavor of FLAVORS) {
      const parentId = `ship-${channel.id}-${flavor.id}`
      const parent = detailRows.find((r) => r.id === parentId)
      if (parent) {
        sorted.push(parent)
        sorted.push(...detailRows.filter((r) => r.parentId === parentId))
      }
    }
  }

  return {
    actionTable: {
      title: "Shipment Decisions by Channel",
      description: "Current week shipment quantities by sales channel",
      columns: actionColumns,
      rows: actionRows,
    },
    columns: detailColumns,
    rows: sorted,
  }
}

// ============================================================================
// 3. PRODUCTION MODULE
// Action: Production decisions by co-man site (point-in-time)
// Detail: Flavor × Site with production mix
// ============================================================================

export function getProductionData(): DualTableData {
  const flavorSticks = getFlavorMonthlySticks()
  const tollingSites = COMAN_SITES.filter((s) => s.monthlyCapacity > 0)

  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Co-Man Site", type: "label", sticky: true, width: 260 },
    { key: "flavors", label: "Flavors", type: "number" },
    { key: "planned_sticks", label: "Planned Sticks", type: "number", editable: true },
    { key: "capacity_pct", label: "Capacity %", type: "pct" },
    { key: "min_volume", label: "Min Volume", type: "number" },
    { key: "priority", label: "Priority", type: "number" },
    { key: "mix_score", label: "Mix Score", type: "number" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const detailColumns: PlanColumn[] = [
    { key: "label", label: "Flavor / Site", type: "label", sticky: true, width: 240 },
    { key: "start_wip", label: "Start WIP", type: "number" },
    { key: "production", label: "Production", type: "number", editable: true },
    { key: "kit_demand", label: "Kit Demand", type: "number" },
    { key: "end_wip", label: "End WIP", type: "number" },
    { key: "wos", label: "WOS", type: "wos" },
    { key: "attribution", label: "Source", type: "badge" },
  ]

  const actionRows: ActionRow[] = []
  const detailRows: PlanRow[] = []

  // --- Pass 1: compute uncapped production per site-flavor, then scale to capacity ---
  interface SiteFlavorEntry {
    flavorIdx: number; siteId: string; kitDemand: number; uncappedProd: number; startWip: number; rng: () => number
  }
  const entries: SiteFlavorEntry[] = []
  const siteTotalUncapped: Record<string, number> = {}
  for (const site of tollingSites) siteTotalUncapped[site.id] = 0

  for (let fi = 0; fi < FLAVORS.length; fi++) {
    const flavor = FLAVORS[fi]
    const capableSites = tollingSites.filter((s) => s.flavorCapability.includes(flavor.id))
    const totalShare = capableSites.reduce((s, site) => s + site.productionShare, 0)

    for (const site of capableSites) {
      const siteFlavorShare = site.productionShare / totalShare
      const rng = seededRand(
        flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 29 +
          site.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 37,
      )
      const kitDemand = Math.round(flavorSticks[fi][0] * siteFlavorShare)
      const weeklyDemand = kitDemand / 4.33
      const startWip = Math.round(weeklyDemand * TARGET_WOS_WIP * (0.9 + rng() * 0.2))
      const uncappedProd = Math.ceil(kitDemand / PRODUCTION_BATCH_SIZE) * PRODUCTION_BATCH_SIZE

      entries.push({ flavorIdx: fi, siteId: site.id, kitDemand, uncappedProd, startWip, rng })
      siteTotalUncapped[site.id] += uncappedProd
    }
  }

  // Scale factor per site: target ~80% utilization
  const siteScale: Record<string, number> = {}
  for (const site of tollingSites) {
    const target = site.monthlyCapacity * 0.82
    siteScale[site.id] = siteTotalUncapped[site.id] > 0 ? Math.min(1, target / siteTotalUncapped[site.id]) : 1
  }

  // --- Pass 2: build rows with scaled production ---
  const siteAgg: Record<string, { flavors: number; planned: number; childIds: string[] }> = {}
  for (const site of tollingSites) {
    siteAgg[site.id] = { flavors: 0, planned: 0, childIds: [] }
  }

  // Group entries by flavor for parent rows
  const flavorEntries: Map<number, SiteFlavorEntry[]> = new Map()
  for (const e of entries) {
    if (!flavorEntries.has(e.flavorIdx)) flavorEntries.set(e.flavorIdx, [])
    flavorEntries.get(e.flavorIdx)!.push(e)
  }

  for (let fi = 0; fi < FLAVORS.length; fi++) {
    const flavor = FLAVORS[fi]
    const parentId = `prod-${flavor.id}`
    const parentValues: Record<string, number | string | null> = {
      start_wip: 0, production: 0, kit_demand: 0, end_wip: 0, wos: 0, attribution: null,
    }

    const feList = flavorEntries.get(fi) ?? []
    const capableSiteIds = feList.map(e => e.siteId)

    for (const entry of feList) {
      const childId = `prod-${flavor.id}-${entry.siteId}`
      const site = tollingSites.find(s => s.id === entry.siteId)!
      const scale = siteScale[entry.siteId]
      const production = Math.round((entry.uncappedProd * scale) / PRODUCTION_BATCH_SIZE) * PRODUCTION_BATCH_SIZE || PRODUCTION_BATCH_SIZE
      const endWip = entry.startWip + production - entry.kitDemand
      const weeklyDemand = entry.kitDemand / 4.33
      const wos = weeklyDemand > 0 ? Math.round((endWip / weeklyDemand) * 10) / 10 : 0

      detailRows.push({
        id: childId,
        label: site.name,
        type: "child",
        parentId,
        values: { start_wip: entry.startWip, production, kit_demand: entry.kitDemand, end_wip: endWip, wos, attribution: "engine" },
        attribution: entry.rng() < 0.2 ? "override" : "engine",
      })

      parentValues.start_wip = (parentValues.start_wip as number) + entry.startWip
      parentValues.production = (parentValues.production as number) + production
      parentValues.kit_demand = (parentValues.kit_demand as number) + entry.kitDemand
      parentValues.end_wip = (parentValues.end_wip as number) + endWip

      siteAgg[entry.siteId].flavors += 1
      siteAgg[entry.siteId].planned += production
      siteAgg[entry.siteId].childIds.push(childId)
    }

    // Parent WOS
    const totalKitDemand = parentValues.kit_demand as number
    const weeklyD = totalKitDemand / 4.33
    parentValues.wos = weeklyD > 0 ? Math.round(((parentValues.end_wip as number) / weeklyD) * 10) / 10 : 0

    detailRows.push({
      id: parentId,
      label: flavor.name,
      type: "parent",
      values: parentValues,
    })

    for (const siteId of capableSiteIds) {
      siteAgg[siteId].childIds.push(parentId)
    }
  }

  // Build action rows per tolling site
  for (const site of tollingSites) {
    const agg = siteAgg[site.id]
    const rng = seededRand(site.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 41)
    const capacityPct = site.monthlyCapacity > 0 ? agg.planned / site.monthlyCapacity : 0
    const minVolume = 500_000
    const priority = site.id === "site-a" ? 1 : 2
    const mixScore = Math.round(70 + rng() * 25)

    actionRows.push({
      id: `action-prod-${site.id}`,
      label: site.name,
      values: {
        flavors: agg.flavors,
        planned_sticks: agg.planned,
        capacity_pct: Math.round(capacityPct * 100) / 100,
        min_volume: minVolume,
        priority,
        mix_score: mixScore,
        status: null,
      },
      status: capacityPct > 0.9 ? "needs-review" : capacityPct > 0.75 ? "in-progress" : "on-track",
      detailIds: [...new Set(agg.childIds)],
    })
  }

  // Sort detail rows
  const sorted: PlanRow[] = []
  for (const flavor of FLAVORS) {
    const parent = detailRows.find((r) => r.id === `prod-${flavor.id}`)!
    sorted.push(parent)
    sorted.push(...detailRows.filter((r) => r.parentId === parent.id))
  }

  return {
    actionTable: {
      title: "Production Decisions by Co-Man Site",
      description: "Current month production plan and mix allocation by manufacturing site",
      columns: actionColumns,
      rows: actionRows,
    },
    columns: detailColumns,
    rows: sorted,
  }
}

// ============================================================================
// 4. KITTING MODULE
// Action: Kitting decisions by pack configuration (point-in-time)
// Detail: Flavor × Site for each pack config
// ============================================================================

export function getKittingData(): DualTableData {
  const flavorSticks = getFlavorMonthlySticks()
  const kittingSites = COMAN_SITES.filter((s) => s.capabilities.includes("kitting"))

  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Pack Configuration", type: "label", sticky: true, width: 260 },
    { key: "flavors", label: "Flavors", type: "number" },
    { key: "wip_in", label: "WIP In (sticks)", type: "number" },
    { key: "fg_out", label: "FG Out (units)", type: "number" },
    { key: "yield_pct", label: "Yield %", type: "pct" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const detailColumns: PlanColumn[] = [
    { key: "label", label: "Flavor / Site", type: "label", sticky: true, width: 240 },
    { key: "wip_sticks", label: "WIP Sticks", type: "number" },
    { key: "kit_qty", label: "Kit Qty (sticks)", type: "number" },
    { key: "fg_output", label: "FG Output (units)", type: "number" },
    { key: "channel_demand", label: "Channel Demand", type: "number" },
    { key: "end_fg", label: "End FG", type: "number" },
    { key: "wos", label: "WOS", type: "wos" },
    { key: "attribution", label: "Source", type: "badge" },
  ]

  const actionRows: ActionRow[] = []
  const detailRows: PlanRow[] = []

  // Kitting site shares for distributing work
  const kittingShares: Record<string, number> = { "site-a": 0.40, "site-b": 0.30, "site-c": 0.15, "site-d": 0.15 }

  // Build per-pack-config aggregation for action table
  for (const pack of PACK_CONFIGS) {
    let totalWipIn = 0
    let totalFgOut = 0
    const childIds: string[] = []

    for (let fi = 0; fi < FLAVORS.length; fi++) {
      const flavor = FLAVORS[fi]
      const parentId = `kit-${pack.id}-${flavor.id}`
      const parentValues: Record<string, number | string | null> = {
        wip_sticks: 0, kit_qty: 0, fg_output: 0, channel_demand: 0, end_fg: 0, wos: 0, attribution: null,
      }

      const monthlyStickDemand = Math.round(flavorSticks[fi][0] * pack.demandShare)
      const weeklyStickDemand = Math.round(monthlyStickDemand / 4)
      const weeklyUnitDemand = Math.round(weeklyStickDemand / pack.sticksPerUnit)

      for (const site of kittingSites) {
        const share = kittingShares[site.id] ?? 0.25
        const childId = `kit-${pack.id}-${flavor.id}-${site.id}`
        childIds.push(childId)

        const rng = seededRand(
          pack.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 41 +
            flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 43 +
            site.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 47,
        )

        const siteWeeklyStickDemand = Math.round(weeklyStickDemand * share)
        const siteWeeklyUnitDemand = Math.round(weeklyUnitDemand * share)

        const wipSticks = Math.round(siteWeeklyStickDemand * 3 * (0.9 + rng() * 0.2))
        const kitQty = Math.round(siteWeeklyStickDemand * (0.95 + rng() * 0.1))
        const fgOutput = Math.round(kitQty / pack.sticksPerUnit)
        const channelDemand = Math.round(siteWeeklyUnitDemand * (0.9 + rng() * 0.2))
        const carryFg = Math.round(siteWeeklyUnitDemand * TARGET_WOS_FG * (0.8 + rng() * 0.4))
        const endFg = carryFg + fgOutput - channelDemand
        const wos = channelDemand > 0 ? Math.round((endFg / channelDemand) * 10) / 10 : 0

        detailRows.push({
          id: childId,
          label: site.name,
          type: "child",
          parentId,
          values: { wip_sticks: wipSticks, kit_qty: kitQty, fg_output: fgOutput, channel_demand: channelDemand, end_fg: endFg, wos, attribution: "upstream" },
          attribution: "upstream",
        })

        parentValues.wip_sticks = (parentValues.wip_sticks as number) + wipSticks
        parentValues.kit_qty = (parentValues.kit_qty as number) + kitQty
        parentValues.fg_output = (parentValues.fg_output as number) + fgOutput
        parentValues.channel_demand = (parentValues.channel_demand as number) + channelDemand
        parentValues.end_fg = (parentValues.end_fg as number) + endFg

        totalWipIn += kitQty
        totalFgOut += fgOutput
      }

      // Parent WOS
      const cd = parentValues.channel_demand as number
      parentValues.wos = cd > 0 ? Math.round(((parentValues.end_fg as number) / cd) * 10) / 10 : 0

      detailRows.push({
        id: parentId,
        label: flavor.name,
        type: "parent",
        values: parentValues,
      })

      childIds.push(parentId)
    }

    // Action row per pack config
    const rng = seededRand(pack.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 53)
    const theoreticalFg = totalWipIn > 0 ? totalWipIn / pack.sticksPerUnit : 0
    const yieldPct = theoreticalFg > 0 ? Math.min(1, totalFgOut / theoreticalFg) : 1

    actionRows.push({
      id: `action-kit-${pack.id}`,
      label: pack.name,
      values: {
        flavors: FLAVORS.length,
        wip_in: totalWipIn,
        fg_out: totalFgOut,
        yield_pct: Math.round(yieldPct * 1000) / 1000,
        status: null,
      },
      status: yieldPct < 0.99 ? "needs-review" : pickStatus(rng),
      detailIds: [...new Set(childIds)],
    })
  }

  // Sort: group by pack config, then flavor parent + site children
  const sorted: PlanRow[] = []
  for (const pack of PACK_CONFIGS) {
    for (const flavor of FLAVORS) {
      const parentId = `kit-${pack.id}-${flavor.id}`
      const parent = detailRows.find((r) => r.id === parentId)
      if (parent) {
        sorted.push(parent)
        sorted.push(...detailRows.filter((r) => r.parentId === parentId))
      }
    }
  }

  return {
    actionTable: {
      title: "Kitting Decisions by Pack Configuration",
      description: "Current week kitting orders by pack configuration",
      columns: actionColumns,
      rows: actionRows,
    },
    columns: detailColumns,
    rows: sorted,
  }
}

// ============================================================================
// 5. MRP MODULE
// Action: Purchase orders by material (point-in-time)
// Detail: Material × Co-Man Site
// ============================================================================

export function getMRPData(): DualTableData {
  const totalSticks = getTotalMonthlySticks()
  const tollingSites = COMAN_SITES.filter((s) => s.monthlyCapacity > 0)

  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Material", type: "label", sticky: true, width: 220 },
    { key: "on_hand", label: "On Hand", type: "number" },
    { key: "on_order", label: "On Order", type: "number" },
    { key: "gross_req", label: "Gross Req", type: "number" },
    { key: "net_req", label: "Net Req", type: "number" },
    { key: "suggested_po", label: "Suggested PO", type: "number", editable: true },
    { key: "lead_time", label: "Lead Time (wks)", type: "number" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const detailColumns: PlanColumn[] = [
    { key: "label", label: "Material / Site", type: "label", sticky: true, width: 260 },
    { key: "on_hand", label: "On Hand", type: "number" },
    { key: "on_order", label: "On Order", type: "number" },
    { key: "gross_req", label: "Gross Req", type: "number" },
    { key: "net_req", label: "Net Req", type: "number" },
    { key: "planned_po", label: "Planned PO", type: "number", editable: true },
    { key: "end_inv", label: "End Inv", type: "number" },
    { key: "attribution", label: "Source", type: "badge" },
  ]

  const actionRows: ActionRow[] = []
  const detailRows: PlanRow[] = []

  for (const bom of BOM_ITEMS) {
    const parentId = `mrp-${bom.materialId}`
    const parentValues: Record<string, number | string | null> = {
      on_hand: 0, on_order: 0, gross_req: 0, net_req: 0, planned_po: 0, end_inv: 0, attribution: null,
    }

    let totalOnHand = 0, totalOnOrder = 0, totalGross = 0, totalNet = 0, totalPO = 0
    const childIds: string[] = []

    for (const site of tollingSites) {
      const childId = `mrp-${bom.materialId}-${site.id}`
      childIds.push(childId)
      const rng = seededRand(
        bom.materialId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 53 +
          site.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 59,
      )

      const grossReq = Math.round(totalSticks[0] * site.productionShare * bom.qtyPerStick)
      const onHand = Math.round(grossReq * (1.5 + rng() * 1.0))
      const onOrder = Math.round(grossReq * (0.3 + rng() * 0.4))
      const netReq = Math.max(0, grossReq - onHand - onOrder)
      const poQty = netReq > 0 ? Math.ceil(netReq / bom.moq) * bom.moq : 0
      const endInv = onHand + onOrder + poQty - grossReq

      detailRows.push({
        id: childId,
        label: site.name,
        type: "child",
        parentId,
        values: { on_hand: onHand, on_order: onOrder, gross_req: grossReq, net_req: netReq, planned_po: poQty, end_inv: endInv, attribution: "upstream" },
        attribution: "upstream",
      })

      totalOnHand += onHand
      totalOnOrder += onOrder
      totalGross += grossReq
      totalNet += netReq
      totalPO += poQty

      parentValues.on_hand = (parentValues.on_hand as number) + onHand
      parentValues.on_order = (parentValues.on_order as number) + onOrder
      parentValues.gross_req = (parentValues.gross_req as number) + grossReq
      parentValues.net_req = (parentValues.net_req as number) + netReq
      parentValues.planned_po = (parentValues.planned_po as number) + poQty
      parentValues.end_inv = (parentValues.end_inv as number) + endInv
    }

    detailRows.push({
      id: parentId,
      label: bom.materialName,
      type: "parent",
      values: parentValues,
    })

    actionRows.push({
      id: `action-mrp-${bom.materialId}`,
      label: bom.materialName,
      values: {
        on_hand: totalOnHand,
        on_order: totalOnOrder,
        gross_req: totalGross,
        net_req: totalNet,
        suggested_po: totalPO,
        lead_time: bom.leadTimeWeeks,
        status: null,
      },
      status: totalNet > 0 ? "needs-review" : "on-track",
      detailIds: [parentId, ...childIds],
    })
  }

  const sorted: PlanRow[] = []
  for (const bom of BOM_ITEMS) {
    const parent = detailRows.find((r) => r.id === `mrp-${bom.materialId}`)!
    sorted.push(parent)
    sorted.push(...detailRows.filter((r) => r.parentId === parent.id))
  }

  return {
    actionTable: {
      title: "Purchase Orders by Material",
      description: "Current month material requirements and suggested POs",
      columns: actionColumns,
      rows: actionRows,
    },
    columns: detailColumns,
    rows: sorted,
  }
}

// ============================================================================
// 6. ALLOCATION MODULE
// Action: Allocation decisions by warehouse (point-in-time)
// Detail: Flavor × Warehouse
// ============================================================================

export function getAllocationData(): DualTableData {
  const flavorSticks = getFlavorMonthlySticks()
  const boxPack = PACK_CONFIGS.find((p) => p.id === "30-count")!

  const actionColumns: PlanColumn[] = [
    { key: "label", label: "Warehouse", type: "label", sticky: true, width: 240 },
    { key: "channels", label: "Channels", type: "number" },
    { key: "inbound", label: "Inbound FG", type: "number" },
    { key: "outbound", label: "Outbound", type: "number" },
    { key: "ending_inv", label: "Ending Inv", type: "number" },
    { key: "wos", label: "WOS", type: "wos" },
    { key: "status", label: "Status", type: "badge" },
  ]

  const detailColumns: PlanColumn[] = [
    { key: "label", label: "Flavor / Warehouse", type: "label", sticky: true, width: 240 },
    { key: "start_fg", label: "Start FG", type: "number" },
    { key: "inbound", label: "Inbound", type: "number" },
    { key: "outbound", label: "Outbound", type: "number" },
    { key: "end_fg", label: "End FG", type: "number" },
    { key: "wos", label: "WOS", type: "wos" },
    { key: "attribution", label: "Source", type: "badge" },
  ]

  const actionRows: ActionRow[] = []
  const detailRows: PlanRow[] = []

  const warehouseAgg: Record<string, { inbound: number; outbound: number; ending: number; childIds: string[] }> = {}
  for (const wh of WAREHOUSES) {
    warehouseAgg[wh.id] = { inbound: 0, outbound: 0, ending: 0, childIds: [] }
  }

  for (let fi = 0; fi < FLAVORS.length; fi++) {
    const flavor = FLAVORS[fi]
    const parentId = `alloc-${flavor.id}`
    const parentValues: Record<string, number | string | null> = {
      start_fg: 0, inbound: 0, outbound: 0, end_fg: 0, wos: 0, attribution: null,
    }

    const monthlyStickDemand = Math.round(flavorSticks[fi][0] * boxPack.demandShare)
    const weeklyUnits = Math.round(monthlyStickDemand / boxPack.sticksPerUnit / 4)

    for (const wh of WAREHOUSES) {
      const childId = `alloc-${flavor.id}-${wh.id}`
      const rng = seededRand(
        flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 61 +
          wh.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 67,
      )

      const whWeeklyDemand = Math.round(weeklyUnits * wh.allocationShare)
      const startFg = Math.round(whWeeklyDemand * TARGET_WOS_FG * (0.7 + rng() * 0.6))
      const outbound = Math.round(whWeeklyDemand * (0.85 + rng() * 0.3))
      const inbound = Math.round(outbound * (0.9 + rng() * 0.25))
      const endFg = startFg + inbound - outbound
      const wos = outbound > 0 ? Math.round((endFg / outbound) * 10) / 10 : 0

      detailRows.push({
        id: childId,
        label: wh.name,
        type: "child",
        parentId,
        values: { start_fg: startFg, inbound, outbound, end_fg: endFg, wos, attribution: "upstream" },
        attribution: "upstream",
      })

      parentValues.start_fg = (parentValues.start_fg as number) + startFg
      parentValues.inbound = (parentValues.inbound as number) + inbound
      parentValues.outbound = (parentValues.outbound as number) + outbound
      parentValues.end_fg = (parentValues.end_fg as number) + endFg

      warehouseAgg[wh.id].inbound += inbound
      warehouseAgg[wh.id].outbound += outbound
      warehouseAgg[wh.id].ending += endFg
      warehouseAgg[wh.id].childIds.push(childId)
    }

    const out = parentValues.outbound as number
    parentValues.wos = out > 0 ? Math.round(((parentValues.end_fg as number) / out) * 10) / 10 : 0

    detailRows.push({
      id: parentId,
      label: `${flavor.name} - 30ct`,
      type: "parent",
      values: parentValues,
    })

    for (const wh of WAREHOUSES) {
      warehouseAgg[wh.id].childIds.push(parentId)
    }
  }

  // Action rows
  for (const wh of WAREHOUSES) {
    const agg = warehouseAgg[wh.id]
    const rng = seededRand(wh.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 71)
    const wos = agg.outbound > 0 ? Math.round((agg.ending / agg.outbound) * 10) / 10 : 0

    actionRows.push({
      id: `action-alloc-${wh.id}`,
      label: wh.name,
      values: {
        channels: wh.servesChannels.length,
        inbound: agg.inbound,
        outbound: agg.outbound,
        ending_inv: agg.ending,
        wos,
        status: null,
      },
      status: wos < 6 ? "needs-review" : pickStatus(rng),
      detailIds: [...new Set(agg.childIds)],
    })
  }

  const sorted: PlanRow[] = []
  for (const flavor of FLAVORS) {
    const parent = detailRows.find((r) => r.id === `alloc-${flavor.id}`)!
    sorted.push(parent)
    sorted.push(...detailRows.filter((r) => r.parentId === parent.id))
  }

  return {
    actionTable: {
      title: "Allocation Decisions by Warehouse",
      description: "Current week inventory allocation by fulfillment location",
      columns: actionColumns,
      rows: actionRows,
    },
    columns: detailColumns,
    rows: sorted,
  }
}
