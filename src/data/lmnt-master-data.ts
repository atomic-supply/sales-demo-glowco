// ============================================================================
// LMNT MASTER DATA — Central source of truth for all LMNT-specific constants
// ============================================================================

import { seededRand } from "../utils/random"

// ─── Flavors ─────────────────────────────────────────────────────────────────

export interface Flavor {
  id: string
  name: string
  category: "Drink Mix" | "RTD"
  /** Average monthly stick demand */
  monthlyDemand: number
  /** Seasonality multipliers by month index (0 = Jan) */
  seasonality: number[]
}

export const FLAVORS: Flavor[] = [
  { id: "citrus-salt", name: "Citrus Salt", category: "Drink Mix", monthlyDemand: 4_500_000, seasonality: [0.85, 0.90, 1.00, 1.10, 1.25, 1.35, 1.30, 1.20, 1.05, 0.95, 0.90, 1.00] },
  { id: "raspberry-salt", name: "Raspberry Salt", category: "Drink Mix", monthlyDemand: 3_500_000, seasonality: [0.85, 0.88, 0.98, 1.08, 1.22, 1.32, 1.28, 1.18, 1.02, 0.93, 0.88, 0.98] },
  { id: "chocolate-salt", name: "Chocolate Salt", category: "Drink Mix", monthlyDemand: 2_500_000, seasonality: [1.15, 1.10, 1.00, 0.90, 0.80, 0.75, 0.78, 0.85, 0.95, 1.05, 1.15, 1.25] },
  { id: "raw-unflavored", name: "Raw Unflavored", category: "Drink Mix", monthlyDemand: 2_500_000, seasonality: [0.95, 0.95, 1.00, 1.00, 1.05, 1.10, 1.10, 1.05, 1.00, 0.95, 0.95, 0.95] },
  { id: "watermelon-salt", name: "Watermelon Salt", category: "Drink Mix", monthlyDemand: 2_200_000, seasonality: [0.75, 0.80, 0.95, 1.10, 1.30, 1.40, 1.35, 1.25, 1.05, 0.90, 0.78, 0.72] },
  { id: "mango-chili", name: "Mango Chili", category: "Drink Mix", monthlyDemand: 1_800_000, seasonality: [0.82, 0.85, 0.95, 1.08, 1.25, 1.35, 1.30, 1.20, 1.05, 0.92, 0.85, 0.80] },
  { id: "orange-salt", name: "Orange Salt", category: "Drink Mix", monthlyDemand: 1_600_000, seasonality: [0.90, 0.92, 1.00, 1.05, 1.15, 1.20, 1.18, 1.10, 1.00, 0.95, 0.90, 0.88] },
  { id: "lemon-habanero", name: "Lemon Habanero", category: "Drink Mix", monthlyDemand: 1_200_000, seasonality: [0.80, 0.85, 0.95, 1.05, 1.20, 1.30, 1.28, 1.15, 1.02, 0.92, 0.82, 0.78] },
]

// ─── Pack Configurations ─────────────────────────────────────────────────────

export interface PackConfig {
  id: string
  name: string
  sticksPerUnit: number
  /** Fraction of total demand this pack represents */
  demandShare: number
}

export const PACK_CONFIGS: PackConfig[] = [
  { id: "30-count", name: "30 Count Box", sticksPerUnit: 30, demandShare: 0.45 },
  { id: "10-variety", name: "10 Count Variety Pack", sticksPerUnit: 10, demandShare: 0.25 },
  { id: "8-single", name: "8 Count Single Flavor", sticksPerUnit: 8, demandShare: 0.20 },
  { id: "sample-6", name: "Sample Pack (6 Count)", sticksPerUnit: 6, demandShare: 0.10 },
]

// ─── Channels ────────────────────────────────────────────────────────────────

export interface Channel {
  id: string
  name: string
  /** Fraction of total demand from this channel */
  demandShare: number
  /** Default safety stock in weeks of supply */
  safetyStockWOS: number
  /** Lead time in days from 3PL to customer */
  fulfillmentLeadDays: number
}

export const CHANNELS: Channel[] = [
  { id: "shopify-dtc", name: "Shopify DTC", demandShare: 0.30, safetyStockWOS: 8, fulfillmentLeadDays: 3 },
  { id: "amazon", name: "Amazon", demandShare: 0.25, safetyStockWOS: 10, fulfillmentLeadDays: 7 },
  { id: "target", name: "Target", demandShare: 0.15, safetyStockWOS: 12, fulfillmentLeadDays: 14 },
  { id: "walmart", name: "Walmart", demandShare: 0.12, safetyStockWOS: 12, fulfillmentLeadDays: 14 },
  { id: "wholesale", name: "Wholesale", demandShare: 0.10, safetyStockWOS: 10, fulfillmentLeadDays: 7 },
  { id: "vitamin-shoppe", name: "Vitamin Shoppe", demandShare: 0.08, safetyStockWOS: 10, fulfillmentLeadDays: 10 },
]

// ─── Co-Manufacturer Sites ───────────────────────────────────────────────────

export interface CoManSite {
  id: string
  name: string
  capabilities: ("tolling" | "kitting")[]
  /** Which flavor IDs this site can produce */
  flavorCapability: string[]
  /** Monthly stick capacity */
  monthlyCapacity: number
  /** Share of total production */
  productionShare: number
}

export const COMAN_SITES: CoManSite[] = [
  {
    id: "site-a",
    name: "Site A - Tolling & Kitting (Primary)",
    capabilities: ["tolling", "kitting"],
    flavorCapability: FLAVORS.map(f => f.id), // all flavors
    monthlyCapacity: 12_000_000,
    productionShare: 0.45,
  },
  {
    id: "site-b",
    name: "Site B - Tolling & Kitting",
    capabilities: ["tolling", "kitting"],
    flavorCapability: ["citrus-salt", "raspberry-salt", "raw-unflavored", "orange-salt"],
    monthlyCapacity: 8_000_000,
    productionShare: 0.30,
  },
  {
    id: "site-c",
    name: "Site C - Kitting Only",
    capabilities: ["kitting"],
    flavorCapability: FLAVORS.map(f => f.id),
    monthlyCapacity: 0, // no production
    productionShare: 0,
  },
  {
    id: "site-d",
    name: "Site D - Kitting Only",
    capabilities: ["kitting"],
    flavorCapability: FLAVORS.map(f => f.id),
    monthlyCapacity: 0, // no production
    productionShare: 0,
  },
]

// ─── Warehouses / 3PLs ──────────────────────────────────────────────────────

export interface Warehouse {
  id: string
  name: string
  /** Which channels this warehouse serves */
  servesChannels: string[]
  /** Share of finished goods flowing here */
  allocationShare: number
}

export const WAREHOUSES: Warehouse[] = [
  { id: "3pl-east", name: "3PL East (DTC + Retail)", servesChannels: ["shopify-dtc", "target", "walmart", "vitamin-shoppe"], allocationShare: 0.40 },
  { id: "3pl-west", name: "3PL West (DTC)", servesChannels: ["shopify-dtc"], allocationShare: 0.15 },
  { id: "3pl-central", name: "3PL Central (DTC)", servesChannels: ["shopify-dtc", "wholesale"], allocationShare: 0.15 },
  { id: "amazon-fba", name: "Amazon FBA", servesChannels: ["amazon"], allocationShare: 0.20 },
  { id: "retail-dc", name: "Retail Distribution Center", servesChannels: ["target", "walmart", "vitamin-shoppe"], allocationShare: 0.10 },
]

// ─── BOM (Bill of Materials) ─────────────────────────────────────────────────

export interface BOMItem {
  materialId: string
  materialName: string
  category: "blend" | "film" | "carton" | "inner-wrap"
  /** Quantity per stick */
  qtyPerStick: number
  unit: string
  /** Whether this material is flavor-specific */
  flavorSpecific: boolean
  /** Lead time in weeks */
  leadTimeWeeks: number
  /** Minimum order quantity */
  moq: number
}

export const BOM_ITEMS: BOMItem[] = [
  { materialId: "blend", materialName: "Electrolyte Blend", category: "blend", qtyPerStick: 1, unit: "doses", flavorSpecific: true, leadTimeWeeks: 6, moq: 500_000 },
  { materialId: "film", materialName: "Stick Film", category: "film", qtyPerStick: 1, unit: "wraps", flavorSpecific: true, leadTimeWeeks: 8, moq: 250_000 },
  { materialId: "carton", materialName: "Carton / Box", category: "carton", qtyPerStick: 0.033, unit: "cartons", flavorSpecific: false, leadTimeWeeks: 4, moq: 50_000 },
  { materialId: "inner-wrap", materialName: "Inner Wrap / Liner", category: "inner-wrap", qtyPerStick: 0.033, unit: "liners", flavorSpecific: false, leadTimeWeeks: 3, moq: 50_000 },
]

// ─── Time Periods ────────────────────────────────────────────────────────────

export const PLAN_START_MONTH = 4 // May 2026 (0-indexed: 0=Jan)
export const PLAN_START_YEAR = 2026
export const PLAN_MONTHS = 12

export function getMonthLabel(monthOffset: number): string {
  const m = (PLAN_START_MONTH + monthOffset) % 12
  const y = PLAN_START_YEAR + Math.floor((PLAN_START_MONTH + monthOffset) / 12)
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${names[m]} ${y}`
}

export function getWeekLabels(monthOffset: number): string[] {
  const m = (PLAN_START_MONTH + monthOffset) % 12
  const y = PLAN_START_YEAR + Math.floor((PLAN_START_MONTH + monthOffset) / 12)
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return [`W1 ${names[m]}`, `W2 ${names[m]}`, `W3 ${names[m]}`, `W4 ${names[m]}`].map(w => `${w} '${String(y).slice(2)}`)
}

// ─── Scale Constants ─────────────────────────────────────────────────────────

/** Total monthly stick demand across all flavors (approx) */
export const TOTAL_MONTHLY_STICKS = FLAVORS.reduce((sum, f) => sum + f.monthlyDemand, 0) // ~19.8M

/** Production batch size (sticks) */
export const PRODUCTION_BATCH_SIZE = 500_000

/** Target weeks of supply for WIP sticks */
export const TARGET_WOS_WIP = 10

/** Target weeks of supply for finished goods */
export const TARGET_WOS_FG = 12

/** Average cost per stick (used for $ calculations) */
export const COST_PER_STICK = 0.35

/** Average cost per finished good unit */
export const COST_PER_FG_UNIT = 8.50

// ─── Utility ─────────────────────────────────────────────────────────────────

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest
}

/**
 * Generate a seeded demand value for a flavor in a given month.
 * Applies seasonality + small random variation.
 */
export function getMonthlyDemand(flavor: Flavor, monthOffset: number): number {
  const monthIdx = (PLAN_START_MONTH + monthOffset) % 12
  const rand = seededRand(
    flavor.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 31 + monthOffset * 7,
  )
  const base = flavor.monthlyDemand * flavor.seasonality[monthIdx]
  const variation = 0.92 + rand() * 0.16 // ±8% variation
  return Math.round(base * variation)
}
