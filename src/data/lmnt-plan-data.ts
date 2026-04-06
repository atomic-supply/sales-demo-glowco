// ============================================================================
// LMNT PLAN DATA — Cascading plan data for all 6 modules
// Numbers cascade: Consumption -> Shipments -> Production -> Kitting -> MRP -> Allocation
// ============================================================================

import { seededRand } from "../utils/random"
import {
  FLAVORS,
  PACK_CONFIGS,
  CHANNELS,
  COMAN_SITES,
  WAREHOUSES,
  BOM_ITEMS,
  PLAN_MONTHS,
  PRODUCTION_BATCH_SIZE,
  TARGET_WOS_WIP,
  TARGET_WOS_FG,
  getMonthLabel,
  getWeekLabels,
  getMonthlyDemand,
  roundToNearest,
} from "./lmnt-master-data"

// ─── Shared Types ───────────────────────────────────────────────────────────

export interface PlanColumn {
  key: string
  label: string
  type: "label" | "number" | "wos" | "badge" | "pct"
  sticky?: boolean
  width?: number
}

export interface PlanRow {
  id: string
  label: string
  type: "parent" | "child"
  parentId?: string
  values: Record<string, number | string | null>
  attribution?: "engine" | "override" | "upstream"
}

// ─── Weighted average sticks-per-unit (used to convert sticks <-> units) ────

const WEIGHTED_STICKS_PER_UNIT =
  PACK_CONFIGS.reduce((s, p) => s + p.sticksPerUnit * p.demandShare, 0)
// ~30*0.45 + 10*0.25 + 8*0.20 + 6*0.10 = 13.5 + 2.5 + 1.6 + 0.6 = 18.2

function sticksToUnits(sticks: number): number {
  return Math.round(sticks / WEIGHTED_STICKS_PER_UNIT)
}

// ─── Pre-compute shared monthly stick demand per flavor (the "spine") ───────

function getFlavorMonthlySticks(): number[][] {
  // [flavorIdx][monthOffset] = sticks
  return FLAVORS.map((f) =>
    Array.from({ length: PLAN_MONTHS }, (_, mo) => getMonthlyDemand(f, mo)),
  )
}

function getTotalMonthlySticks(): number[] {
  const fm = getFlavorMonthlySticks()
  return Array.from({ length: PLAN_MONTHS }, (_, mo) =>
    fm.reduce((s, arr) => s + arr[mo], 0),
  )
}

// ============================================================================
// 1. CONSUMPTION MODULE
// ============================================================================

export function getConsumptionData(): { rows: PlanRow[]; columns: PlanColumn[] } {
  const columns: PlanColumn[] = [
    { key: "label", label: "Item", type: "label", sticky: true, width: 220 },
  ]

  for (let mo = 0; mo < PLAN_MONTHS; mo++) {
    const ml = getMonthLabel(mo)
    columns.push(
      { key: `hist_${mo}`, label: `${ml} History`, type: "number" },
      { key: `base_${mo}`, label: `${ml} Baseline`, type: "number" },
      { key: `override_${mo}`, label: `${ml} Override`, type: "number" },
      { key: `final_${mo}`, label: `${ml} Final`, type: "number" },
      { key: `yoy_${mo}`, label: `${ml} YoY%`, type: "pct" },
    )
  }

  const rows: PlanRow[] = []
  const flavorSticks = getFlavorMonthlySticks()

  for (const channel of CHANNELS) {
    const parentId = `cons-${channel.id}`
    const parentValues: Record<string, number | string | null> = {}

    // accumulate parent totals
    for (let mo = 0; mo < PLAN_MONTHS; mo++) {
      parentValues[`hist_${mo}`] = 0
      parentValues[`base_${mo}`] = 0
      parentValues[`override_${mo}`] = null
      parentValues[`final_${mo}`] = 0
      parentValues[`yoy_${mo}`] = 0
    }

    for (let fi = 0; fi < FLAVORS.length; fi++) {
      const flavor = FLAVORS[fi]
      const childId = `cons-${channel.id}-${flavor.id}`
      const childValues: Record<string, number | string | null> = {}
      const rng = seededRand(
        channel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 17 +
          flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 13,
      )

      for (let mo = 0; mo < PLAN_MONTHS; mo++) {
        // Channel's share of this flavor's stick demand, converted to units
        const stickDemand = Math.round(flavorSticks[fi][mo] * channel.demandShare)
        const units = sticksToUnits(stickDemand)
        const baseline = units

        // History = prior year (no seasonality shift, ~5-12% less)
        const histFactor = 0.88 + rng() * 0.07
        const history = Math.round(baseline * histFactor)

        // Planner override: apply sparingly (~15% of cells)
        let override: number | null = null
        if (rng() < 0.15) {
          const adj = 1.0 + (rng() - 0.4) * 0.3 // -12% to +18%
          override = Math.round(baseline * adj)
        }

        const final_ = override ?? baseline
        const yoy = history > 0 ? Math.round(((final_ - history) / history) * 100) : 0

        childValues[`hist_${mo}`] = history
        childValues[`base_${mo}`] = baseline
        childValues[`override_${mo}`] = override
        childValues[`final_${mo}`] = final_
        childValues[`yoy_${mo}`] = yoy

        parentValues[`hist_${mo}`] = (parentValues[`hist_${mo}`] as number) + history
        parentValues[`base_${mo}`] = (parentValues[`base_${mo}`] as number) + baseline
        parentValues[`final_${mo}`] = (parentValues[`final_${mo}`] as number) + final_
      }

      rows.push({
        id: childId,
        label: flavor.name,
        type: "child",
        parentId,
        values: childValues,
        attribution: childValues[`override_0`] != null ? "override" : "engine",
      })
    }

    // Compute parent YoY
    for (let mo = 0; mo < PLAN_MONTHS; mo++) {
      const h = parentValues[`hist_${mo}`] as number
      const f = parentValues[`final_${mo}`] as number
      parentValues[`yoy_${mo}`] = h > 0 ? Math.round(((f - h) / h) * 100) : 0
    }

    rows.push({
      id: parentId,
      label: channel.name,
      type: "parent",
      values: parentValues,
    })
  }

  // Sort: parents first in channel order, then children after their parent
  const sorted: PlanRow[] = []
  for (const channel of CHANNELS) {
    const parent = rows.find((r) => r.id === `cons-${channel.id}`)!
    sorted.push(parent)
    sorted.push(...rows.filter((r) => r.parentId === parent.id))
  }

  return { rows: sorted, columns }
}

// ============================================================================
// 2. SHIPMENTS MODULE
// ============================================================================

export function getShipmentsData(): { rows: PlanRow[]; columns: PlanColumn[] } {
  // Show 4 weeks of the first plan month
  const weekLabels = getWeekLabels(0)
  const columns: PlanColumn[] = [
    { key: "label", label: "Item", type: "label", sticky: true, width: 220 },
  ]

  for (let w = 0; w < 4; w++) {
    const wl = weekLabels[w]
    columns.push(
      { key: `demand_${w}`, label: `${wl} Demand`, type: "number" },
      { key: `inv_${w}`, label: `${wl} Curr Inv`, type: "number" },
      { key: `ss_${w}`, label: `${wl} SS Target`, type: "number" },
      { key: `ship_${w}`, label: `${wl} Ship Qty`, type: "number" },
      { key: `end_${w}`, label: `${wl} End Inv`, type: "number" },
      { key: `wos_${w}`, label: `${wl} WOS`, type: "wos" },
    )
  }

  const rows: PlanRow[] = []
  const flavorSticks = getFlavorMonthlySticks()

  for (let fi = 0; fi < FLAVORS.length; fi++) {
    const flavor = FLAVORS[fi]
    const parentId = `ship-${flavor.id}`
    const parentValues: Record<string, number | string | null> = {}

    for (let w = 0; w < 4; w++) {
      parentValues[`demand_${w}`] = 0
      parentValues[`inv_${w}`] = 0
      parentValues[`ss_${w}`] = 0
      parentValues[`ship_${w}`] = 0
      parentValues[`end_${w}`] = 0
      parentValues[`wos_${w}`] = 0
    }

    for (const channel of CHANNELS) {
      const childId = `ship-${flavor.id}-${channel.id}`
      const childValues: Record<string, number | string | null> = {}
      const rng = seededRand(
        flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 23 +
          channel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 19,
      )

      // Monthly stick demand for this flavor-channel, divided by 4 for weekly
      const monthlyStickDemand = Math.round(flavorSticks[fi][0] * channel.demandShare)
      const weeklyUnitDemand = Math.round(sticksToUnits(monthlyStickDemand) / 4)
      const ssWeeks = channel.safetyStockWOS
      const ssTarget = weeklyUnitDemand * ssWeeks

      let carryInv = Math.round(ssTarget * (0.9 + rng() * 0.3)) // start near SS

      for (let w = 0; w < 4; w++) {
        const demandVariation = 0.9 + rng() * 0.2
        const demand = Math.round(weeklyUnitDemand * demandVariation)
        const currInv = carryInv
        const shipQty = Math.max(0, demand + ssTarget - currInv)
        const endInv = currInv + shipQty - demand
        const wos = demand > 0 ? Math.round((endInv / demand) * 10) / 10 : 0

        childValues[`demand_${w}`] = demand
        childValues[`inv_${w}`] = currInv
        childValues[`ss_${w}`] = ssTarget
        childValues[`ship_${w}`] = shipQty
        childValues[`end_${w}`] = endInv
        childValues[`wos_${w}`] = wos

        parentValues[`demand_${w}`] = (parentValues[`demand_${w}`] as number) + demand
        parentValues[`inv_${w}`] = (parentValues[`inv_${w}`] as number) + currInv
        parentValues[`ss_${w}`] = (parentValues[`ss_${w}`] as number) + ssTarget
        parentValues[`ship_${w}`] = (parentValues[`ship_${w}`] as number) + shipQty
        parentValues[`end_${w}`] = (parentValues[`end_${w}`] as number) + endInv

        carryInv = endInv
      }

      rows.push({
        id: childId,
        label: channel.name,
        type: "child",
        parentId,
        values: childValues,
        attribution: "engine",
      })
    }

    // Parent WOS
    for (let w = 0; w < 4; w++) {
      const d = parentValues[`demand_${w}`] as number
      const e = parentValues[`end_${w}`] as number
      parentValues[`wos_${w}`] = d > 0 ? Math.round((e / d) * 10) / 10 : 0
    }

    rows.push({
      id: parentId,
      label: flavor.name,
      type: "parent",
      values: parentValues,
    })
  }

  const sorted: PlanRow[] = []
  for (const flavor of FLAVORS) {
    const parent = rows.find((r) => r.id === `ship-${flavor.id}`)!
    sorted.push(parent)
    sorted.push(...rows.filter((r) => r.parentId === parent.id))
  }

  return { rows: sorted, columns }
}

// ============================================================================
// 3. PRODUCTION MODULE
// ============================================================================

export function getProductionData(): { rows: PlanRow[]; columns: PlanColumn[] } {
  const columns: PlanColumn[] = [
    { key: "label", label: "Item", type: "label", sticky: true, width: 240 },
  ]

  for (let mo = 0; mo < PLAN_MONTHS; mo++) {
    const ml = getMonthLabel(mo)
    columns.push(
      { key: `start_${mo}`, label: `${ml} Start WIP`, type: "number" },
      { key: `prod_${mo}`, label: `${ml} Prod Plan`, type: "number" },
      { key: `kit_demand_${mo}`, label: `${ml} Kit Demand`, type: "number" },
      { key: `end_${mo}`, label: `${ml} End WIP`, type: "number" },
      { key: `twos_${mo}`, label: `${ml} Target WOS`, type: "wos" },
      { key: `awos_${mo}`, label: `${ml} Actual WOS`, type: "wos" },
    )
  }

  const rows: PlanRow[] = []
  const flavorSticks = getFlavorMonthlySticks()

  // Tolling sites (sites with production capacity)
  const tollingSites = COMAN_SITES.filter((s) => s.monthlyCapacity > 0)

  for (let fi = 0; fi < FLAVORS.length; fi++) {
    const flavor = FLAVORS[fi]
    const parentId = `prod-${flavor.id}`
    const parentValues: Record<string, number | string | null> = {}

    // Initialize parent accumulators
    for (let mo = 0; mo < PLAN_MONTHS; mo++) {
      parentValues[`start_${mo}`] = 0
      parentValues[`prod_${mo}`] = 0
      parentValues[`kit_demand_${mo}`] = 0
      parentValues[`end_${mo}`] = 0
      parentValues[`twos_${mo}`] = TARGET_WOS_WIP
      parentValues[`awos_${mo}`] = 0
    }

    // Determine which tolling sites handle this flavor
    const capableSites = tollingSites.filter((s) =>
      s.flavorCapability.includes(flavor.id),
    )
    const totalShare = capableSites.reduce((s, site) => s + site.productionShare, 0)

    for (const site of capableSites) {
      const childId = `prod-${flavor.id}-${site.id}`
      const childValues: Record<string, number | string | null> = {}
      const siteFlavorShare = site.productionShare / totalShare
      const rng = seededRand(
        flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 29 +
          site.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 37,
      )

      // Starting WIP for month 0: ~10 weeks of supply
      const weeklyDemandM0 = flavorSticks[fi][0] / 4.33
      let carryWip = Math.round(weeklyDemandM0 * TARGET_WOS_WIP * siteFlavorShare)

      for (let mo = 0; mo < PLAN_MONTHS; mo++) {
        const kitDemand = Math.round(flavorSticks[fi][mo] * siteFlavorShare)
        const weeklyDemand = kitDemand / 4.33

        const startWip = carryWip

        // Production planned in batch increments, targeting 10 WOS
        const targetEnd = Math.round(weeklyDemand * TARGET_WOS_WIP)
        const rawNeed = Math.max(0, kitDemand + targetEnd - startWip)
        const prodPlanned =
          Math.ceil(rawNeed / PRODUCTION_BATCH_SIZE) * PRODUCTION_BATCH_SIZE

        const endWip = startWip + prodPlanned - kitDemand
        const actualWos =
          weeklyDemand > 0 ? Math.round((endWip / weeklyDemand) * 10) / 10 : 0

        childValues[`start_${mo}`] = startWip
        childValues[`prod_${mo}`] = prodPlanned
        childValues[`kit_demand_${mo}`] = kitDemand
        childValues[`end_${mo}`] = endWip
        childValues[`twos_${mo}`] = TARGET_WOS_WIP
        childValues[`awos_${mo}`] = actualWos

        parentValues[`start_${mo}`] =
          (parentValues[`start_${mo}`] as number) + startWip
        parentValues[`prod_${mo}`] =
          (parentValues[`prod_${mo}`] as number) + prodPlanned
        parentValues[`kit_demand_${mo}`] =
          (parentValues[`kit_demand_${mo}`] as number) + kitDemand
        parentValues[`end_${mo}`] = (parentValues[`end_${mo}`] as number) + endWip

        carryWip = endWip
      }

      rows.push({
        id: childId,
        label: site.name,
        type: "child",
        parentId,
        values: childValues,
        attribution: "engine",
      })
    }

    // Parent actual WOS
    for (let mo = 0; mo < PLAN_MONTHS; mo++) {
      const totalKitDemand = parentValues[`kit_demand_${mo}`] as number
      const weeklyDemand = totalKitDemand / 4.33
      const endWip = parentValues[`end_${mo}`] as number
      parentValues[`awos_${mo}`] =
        weeklyDemand > 0 ? Math.round((endWip / weeklyDemand) * 10) / 10 : 0
    }

    rows.push({
      id: parentId,
      label: flavor.name,
      type: "parent",
      values: parentValues,
    })
  }

  const sorted: PlanRow[] = []
  for (const flavor of FLAVORS) {
    const parent = rows.find((r) => r.id === `prod-${flavor.id}`)!
    sorted.push(parent)
    sorted.push(...rows.filter((r) => r.parentId === parent.id))
  }

  return { rows: sorted, columns }
}

// ============================================================================
// 4. KITTING MODULE
// ============================================================================

export function getKittingData(): { rows: PlanRow[]; columns: PlanColumn[] } {
  const weekLabels = getWeekLabels(0)
  const columns: PlanColumn[] = [
    { key: "label", label: "Item", type: "label", sticky: true, width: 240 },
  ]

  for (let w = 0; w < 4; w++) {
    const wl = weekLabels[w]
    columns.push(
      { key: `wip_${w}`, label: `${wl} WIP Sticks`, type: "number" },
      { key: `kit_${w}`, label: `${wl} Kit Qty`, type: "number" },
      { key: `fg_out_${w}`, label: `${wl} FG Output`, type: "number" },
      { key: `ch_demand_${w}`, label: `${wl} Ch Demand`, type: "number" },
      { key: `end_fg_${w}`, label: `${wl} End FG`, type: "number" },
      { key: `wos_${w}`, label: `${wl} WOS`, type: "wos" },
    )
  }

  const rows: PlanRow[] = []
  const flavorSticks = getFlavorMonthlySticks()
  const totalMonthlySticks = getTotalMonthlySticks()

  for (const pack of PACK_CONFIGS) {
    const parentId = `kit-${pack.id}`
    const parentValues: Record<string, number | string | null> = {}

    for (let w = 0; w < 4; w++) {
      parentValues[`wip_${w}`] = 0
      parentValues[`kit_${w}`] = 0
      parentValues[`fg_out_${w}`] = 0
      parentValues[`ch_demand_${w}`] = 0
      parentValues[`end_fg_${w}`] = 0
      parentValues[`wos_${w}`] = 0
    }

    for (let fi = 0; fi < FLAVORS.length; fi++) {
      const flavor = FLAVORS[fi]
      const childId = `kit-${pack.id}-${flavor.id}`
      const childValues: Record<string, number | string | null> = {}
      const rng = seededRand(
        pack.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 41 +
          flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 43,
      )

      // This pack-flavor's weekly stick demand
      const monthlyStickDemand = Math.round(flavorSticks[fi][0] * pack.demandShare)
      const weeklyStickDemand = Math.round(monthlyStickDemand / 4)
      const weeklyUnitDemand = Math.round(weeklyStickDemand / pack.sticksPerUnit)

      // Starting WIP sticks available = ~3 weeks of kitting demand
      let carryWipSticks = Math.round(weeklyStickDemand * 3 * (0.9 + rng() * 0.2))
      // Starting FG inventory
      let carryFg = Math.round(weeklyUnitDemand * TARGET_WOS_FG * (0.8 + rng() * 0.4))

      for (let w = 0; w < 4; w++) {
        const demVar = 0.9 + rng() * 0.2
        const chDemand = Math.round(weeklyUnitDemand * demVar)
        const kitSticks = Math.round(weeklyStickDemand * (0.95 + rng() * 0.1))
        const fgOutput = Math.round(kitSticks / pack.sticksPerUnit)
        const endFg = carryFg + fgOutput - chDemand
        const wos = chDemand > 0 ? Math.round((endFg / chDemand) * 10) / 10 : 0

        childValues[`wip_${w}`] = carryWipSticks
        childValues[`kit_${w}`] = kitSticks
        childValues[`fg_out_${w}`] = fgOutput
        childValues[`ch_demand_${w}`] = chDemand
        childValues[`end_fg_${w}`] = endFg
        childValues[`wos_${w}`] = wos

        parentValues[`wip_${w}`] = (parentValues[`wip_${w}`] as number) + carryWipSticks
        parentValues[`kit_${w}`] = (parentValues[`kit_${w}`] as number) + kitSticks
        parentValues[`fg_out_${w}`] = (parentValues[`fg_out_${w}`] as number) + fgOutput
        parentValues[`ch_demand_${w}`] =
          (parentValues[`ch_demand_${w}`] as number) + chDemand
        parentValues[`end_fg_${w}`] = (parentValues[`end_fg_${w}`] as number) + endFg

        // Roll forward
        carryWipSticks = Math.max(
          0,
          carryWipSticks - kitSticks + Math.round(weeklyStickDemand * (0.9 + rng() * 0.2)),
        )
        carryFg = endFg
      }

      rows.push({
        id: childId,
        label: flavor.name,
        type: "child",
        parentId,
        values: childValues,
        attribution: "upstream",
      })
    }

    // Parent WOS
    for (let w = 0; w < 4; w++) {
      const d = parentValues[`ch_demand_${w}`] as number
      const e = parentValues[`end_fg_${w}`] as number
      parentValues[`wos_${w}`] = d > 0 ? Math.round((e / d) * 10) / 10 : 0
    }

    rows.push({
      id: parentId,
      label: pack.name,
      type: "parent",
      values: parentValues,
    })
  }

  const sorted: PlanRow[] = []
  for (const pack of PACK_CONFIGS) {
    const parent = rows.find((r) => r.id === `kit-${pack.id}`)!
    sorted.push(parent)
    sorted.push(...rows.filter((r) => r.parentId === parent.id))
  }

  return { rows: sorted, columns }
}

// ============================================================================
// 5. MRP MODULE
// ============================================================================

export function getMRPData(): { rows: PlanRow[]; columns: PlanColumn[] } {
  const columns: PlanColumn[] = [
    { key: "label", label: "Material / Site", type: "label", sticky: true, width: 260 },
  ]

  for (let mo = 0; mo < PLAN_MONTHS; mo++) {
    const ml = getMonthLabel(mo)
    columns.push(
      { key: `oh_${mo}`, label: `${ml} On Hand`, type: "number" },
      { key: `oo_${mo}`, label: `${ml} On Order`, type: "number" },
      { key: `gross_${mo}`, label: `${ml} Gross Req`, type: "number" },
      { key: `net_${mo}`, label: `${ml} Net Req`, type: "number" },
      { key: `po_${mo}`, label: `${ml} Planned PO`, type: "number" },
      { key: `end_${mo}`, label: `${ml} End Inv`, type: "number" },
    )
  }

  const rows: PlanRow[] = []
  const totalSticks = getTotalMonthlySticks()
  const tollingSites = COMAN_SITES.filter((s) => s.monthlyCapacity > 0)

  for (const bom of BOM_ITEMS) {
    const parentId = `mrp-${bom.materialId}`
    const parentValues: Record<string, number | string | null> = {}

    for (let mo = 0; mo < PLAN_MONTHS; mo++) {
      parentValues[`oh_${mo}`] = 0
      parentValues[`oo_${mo}`] = 0
      parentValues[`gross_${mo}`] = 0
      parentValues[`net_${mo}`] = 0
      parentValues[`po_${mo}`] = 0
      parentValues[`end_${mo}`] = 0
    }

    for (const site of tollingSites) {
      const childId = `mrp-${bom.materialId}-${site.id}`
      const childValues: Record<string, number | string | null> = {}
      const rng = seededRand(
        bom.materialId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 53 +
          site.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 59,
      )

      // This site's share of total production sticks
      const siteShare = site.productionShare

      // Starting on-hand: ~2 months of gross requirement
      const m0Gross = Math.round(totalSticks[0] * siteShare * bom.qtyPerStick)
      let carryOnHand = Math.round(m0Gross * (1.5 + rng() * 1.0))

      for (let mo = 0; mo < PLAN_MONTHS; mo++) {
        const grossReq = Math.round(totalSticks[mo] * siteShare * bom.qtyPerStick)

        // On order: POs placed lead-time-weeks ago that arrive this month
        const onOrder =
          mo > 0
            ? Math.round(grossReq * (0.3 + rng() * 0.4))
            : Math.round(grossReq * 0.5)

        const onHand = carryOnHand
        const netReq = Math.max(0, grossReq - onHand - onOrder)
        const poQty =
          netReq > 0 ? Math.ceil(netReq / bom.moq) * bom.moq : 0
        const endInv = onHand + onOrder + poQty - grossReq

        childValues[`oh_${mo}`] = onHand
        childValues[`oo_${mo}`] = onOrder
        childValues[`gross_${mo}`] = grossReq
        childValues[`net_${mo}`] = netReq
        childValues[`po_${mo}`] = poQty
        childValues[`end_${mo}`] = endInv

        parentValues[`oh_${mo}`] = (parentValues[`oh_${mo}`] as number) + onHand
        parentValues[`oo_${mo}`] = (parentValues[`oo_${mo}`] as number) + onOrder
        parentValues[`gross_${mo}`] = (parentValues[`gross_${mo}`] as number) + grossReq
        parentValues[`net_${mo}`] = (parentValues[`net_${mo}`] as number) + netReq
        parentValues[`po_${mo}`] = (parentValues[`po_${mo}`] as number) + poQty
        parentValues[`end_${mo}`] = (parentValues[`end_${mo}`] as number) + endInv

        carryOnHand = endInv
      }

      rows.push({
        id: childId,
        label: site.name,
        type: "child",
        parentId,
        values: childValues,
        attribution: "upstream",
      })
    }

    rows.push({
      id: parentId,
      label: bom.materialName,
      type: "parent",
      values: parentValues,
    })
  }

  const sorted: PlanRow[] = []
  for (const bom of BOM_ITEMS) {
    const parent = rows.find((r) => r.id === `mrp-${bom.materialId}`)!
    sorted.push(parent)
    sorted.push(...rows.filter((r) => r.parentId === parent.id))
  }

  return { rows: sorted, columns }
}

// ============================================================================
// 6. ALLOCATION MODULE
// ============================================================================

export function getAllocationData(): { rows: PlanRow[]; columns: PlanColumn[] } {
  const weekLabels = getWeekLabels(0)
  const columns: PlanColumn[] = [
    { key: "label", label: "SKU / Warehouse", type: "label", sticky: true, width: 260 },
  ]

  for (let w = 0; w < 4; w++) {
    const wl = weekLabels[w]
    columns.push(
      { key: `start_${w}`, label: `${wl} Start FG`, type: "number" },
      { key: `inbound_${w}`, label: `${wl} Inbound`, type: "number" },
      { key: `outbound_${w}`, label: `${wl} Outbound`, type: "number" },
      { key: `end_${w}`, label: `${wl} End FG`, type: "number" },
      { key: `wos_${w}`, label: `${wl} WOS`, type: "wos" },
    )
  }

  const rows: PlanRow[] = []
  const flavorSticks = getFlavorMonthlySticks()

  // Top 8 flavors in 30-count box format
  const boxPack = PACK_CONFIGS.find((p) => p.id === "30-count")!

  for (let fi = 0; fi < FLAVORS.length; fi++) {
    const flavor = FLAVORS[fi]
    const skuLabel = `${flavor.name} - 30ct`
    const parentId = `alloc-${flavor.id}`
    const parentValues: Record<string, number | string | null> = {}

    for (let w = 0; w < 4; w++) {
      parentValues[`start_${w}`] = 0
      parentValues[`inbound_${w}`] = 0
      parentValues[`outbound_${w}`] = 0
      parentValues[`end_${w}`] = 0
      parentValues[`wos_${w}`] = 0
    }

    // Total weekly demand for this flavor in 30-count boxes
    const monthlyStickDemand = Math.round(flavorSticks[fi][0] * boxPack.demandShare)
    const weeklyUnits = Math.round(monthlyStickDemand / boxPack.sticksPerUnit / 4)

    for (const wh of WAREHOUSES) {
      const childId = `alloc-${flavor.id}-${wh.id}`
      const childValues: Record<string, number | string | null> = {}
      const rng = seededRand(
        flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 61 +
          wh.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 67,
      )

      const whWeeklyDemand = Math.round(weeklyUnits * wh.allocationShare)
      let carryFg = Math.round(
        whWeeklyDemand * TARGET_WOS_FG * (0.7 + rng() * 0.6),
      )

      for (let w = 0; w < 4; w++) {
        const startFg = carryFg
        const outbound = Math.round(whWeeklyDemand * (0.85 + rng() * 0.3))
        // Inbound from kitting, roughly matching outbound + some replenishment
        const inbound = Math.round(outbound * (0.9 + rng() * 0.25))
        const endFg = startFg + inbound - outbound
        const wos =
          outbound > 0 ? Math.round((endFg / outbound) * 10) / 10 : 0

        childValues[`start_${w}`] = startFg
        childValues[`inbound_${w}`] = inbound
        childValues[`outbound_${w}`] = outbound
        childValues[`end_${w}`] = endFg
        childValues[`wos_${w}`] = wos

        parentValues[`start_${w}`] =
          (parentValues[`start_${w}`] as number) + startFg
        parentValues[`inbound_${w}`] =
          (parentValues[`inbound_${w}`] as number) + inbound
        parentValues[`outbound_${w}`] =
          (parentValues[`outbound_${w}`] as number) + outbound
        parentValues[`end_${w}`] = (parentValues[`end_${w}`] as number) + endFg

        carryFg = endFg
      }

      rows.push({
        id: childId,
        label: wh.name,
        type: "child",
        parentId,
        values: childValues,
        attribution: "upstream",
      })
    }

    // Parent WOS
    for (let w = 0; w < 4; w++) {
      const out = parentValues[`outbound_${w}`] as number
      const e = parentValues[`end_${w}`] as number
      parentValues[`wos_${w}`] = out > 0 ? Math.round((e / out) * 10) / 10 : 0
    }

    rows.push({
      id: parentId,
      label: skuLabel,
      type: "parent",
      values: parentValues,
    })
  }

  const sorted: PlanRow[] = []
  for (const flavor of FLAVORS) {
    const parent = rows.find((r) => r.id === `alloc-${flavor.id}`)!
    sorted.push(parent)
    sorted.push(...rows.filter((r) => r.parentId === parent.id))
  }

  return { rows: sorted, columns }
}
