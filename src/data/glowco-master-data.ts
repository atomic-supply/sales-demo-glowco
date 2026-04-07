// ============================================================================
// GLOWCO MASTER DATA — Central source of truth for all GlowCo-specific constants
// GlowCo is a beauty brand with contract manufacturers producing skincare,
// sunscreen, body care, and haircare products.
// ============================================================================

import { seededRand } from "../utils/random"

// ─── Formulations (analogous to LMNT Flavors) ──────────────────────────────
// Base products before packaging — the core "recipe" that gets filled & packed

export type FormulationCategory = "Facial Care" | "Sunscreen" | "Body Care" | "Haircare"

export interface Formulation {
  id: string
  name: string
  category: FormulationCategory
  /** Supplier responsible for this formulation */
  supplierId: string
  /** Average monthly unit demand (across all packs) */
  monthlyDemand: number
  /** Seasonality multipliers by month index (0 = Jan) */
  seasonality: number[]
}

export const FORMULATIONS: Formulation[] = [
  // ─── Facial Care (Supplier A) ─────────────────────────────────────────────
  { id: "hydrating-cream",      name: "Hydrating Face Cream",       category: "Facial Care", supplierId: "supplier-a", monthlyDemand: 180_000, seasonality: [1.05, 1.10, 1.15, 1.10, 1.00, 0.85, 0.80, 0.82, 0.90, 1.00, 1.10, 1.15] },
  { id: "collagen-night-cream", name: "Collagen Night Cream",       category: "Facial Care", supplierId: "supplier-a", monthlyDemand: 140_000, seasonality: [1.10, 1.15, 1.10, 1.05, 0.95, 0.82, 0.78, 0.80, 0.88, 1.00, 1.12, 1.20] },
  { id: "vitamin-c-moisturizer",name: "Vitamin C Moisturizer",      category: "Facial Care", supplierId: "supplier-a", monthlyDemand: 160_000, seasonality: [0.95, 1.00, 1.05, 1.10, 1.15, 1.10, 1.05, 1.00, 0.95, 0.90, 0.88, 0.92] },
  { id: "gentle-cleanser",      name: "Gentle Hydrating Cleanser",  category: "Facial Care", supplierId: "supplier-a", monthlyDemand: 120_000, seasonality: [1.00, 1.00, 1.02, 1.05, 1.05, 1.00, 0.98, 0.95, 0.98, 1.00, 1.00, 1.02] },

  // ─── Sunscreen (Supplier A) ───────────────────────────────────────────────
  { id: "spf50-daily",          name: "SPF 50 Daily Sunscreen",     category: "Sunscreen",   supplierId: "supplier-a", monthlyDemand: 200_000, seasonality: [0.60, 0.65, 0.85, 1.10, 1.35, 1.50, 1.45, 1.30, 1.05, 0.80, 0.60, 0.55] },
  { id: "broad-spectrum-spf30", name: "Broad Spectrum SPF 30",      category: "Sunscreen",   supplierId: "supplier-a", monthlyDemand: 150_000, seasonality: [0.55, 0.60, 0.80, 1.05, 1.30, 1.48, 1.42, 1.28, 1.00, 0.75, 0.58, 0.52] },

  // ─── Body Care (Supplier B) ───────────────────────────────────────────────
  { id: "shea-butter-lotion",   name: "Shea Butter Body Lotion",    category: "Body Care",   supplierId: "supplier-b", monthlyDemand: 170_000, seasonality: [1.20, 1.15, 1.05, 0.95, 0.85, 0.78, 0.75, 0.78, 0.88, 1.00, 1.15, 1.25] },
  { id: "sugar-scrub",          name: "Sugar Body Scrub",           category: "Body Care",   supplierId: "supplier-b", monthlyDemand: 100_000, seasonality: [1.10, 1.05, 1.00, 0.95, 0.90, 0.88, 0.85, 0.88, 0.95, 1.05, 1.15, 1.18] },
  { id: "nourishing-body-oil",  name: "Nourishing Body Oil",        category: "Body Care",   supplierId: "supplier-b", monthlyDemand: 90_000,  seasonality: [1.18, 1.12, 1.05, 0.92, 0.82, 0.75, 0.72, 0.78, 0.90, 1.05, 1.20, 1.28] },

  // ─── Haircare (Supplier C) ────────────────────────────────────────────────
  { id: "frizz-control-cream",  name: "Frizz Control Cream",        category: "Haircare",    supplierId: "supplier-c", monthlyDemand: 130_000, seasonality: [0.85, 0.88, 0.95, 1.05, 1.15, 1.25, 1.22, 1.15, 1.05, 0.95, 0.88, 0.82] },
  { id: "heat-protection-spray",name: "Heat Protection Spray",      category: "Haircare",    supplierId: "supplier-c", monthlyDemand: 110_000, seasonality: [1.00, 1.00, 1.02, 1.05, 1.05, 1.00, 0.98, 0.98, 1.00, 1.02, 1.00, 0.95] },
  { id: "volumizing-shampoo",   name: "Volumizing Shampoo",         category: "Haircare",    supplierId: "supplier-c", monthlyDemand: 150_000, seasonality: [0.95, 0.95, 1.00, 1.02, 1.05, 1.08, 1.05, 1.02, 1.00, 0.98, 0.95, 0.92] },
]

// ─── Pack Configurations ─────────────────────────────────────────────────────

export interface PackConfig {
  id: string
  name: string
  unitsPerPack: number
  /** Fraction of total demand this pack represents */
  demandShare: number
}

export const PACK_CONFIGS: PackConfig[] = [
  { id: "standard",    name: "Standard",         unitsPerPack: 1, demandShare: 0.45 },
  { id: "travel-size", name: "Travel Size",       unitsPerPack: 1, demandShare: 0.20 },
  { id: "value-set",   name: "Value Set (3-pk)",  unitsPerPack: 3, demandShare: 0.25 },
  { id: "gift-set",    name: "Gift Set (5-pk)",   unitsPerPack: 5, demandShare: 0.10 },
]

// ─── Channels ────────────────────────────────────────────────────────────────

export type ChannelType = "online" | "retail"

export interface Channel {
  id: string
  name: string
  /** Fraction of total demand from this channel */
  demandShare: number
  /** Default safety stock in weeks of supply */
  safetyStockWOS: number
  /** Lead time in days from 3PL to customer */
  fulfillmentLeadDays: number
  /** Online vs retail — determines UPSPW methodology applicability */
  channelType: ChannelType
  /** Number of retail stores carrying GlowCo (retail channels only) */
  storeCount: number
  /** Order cadence for this channel */
  orderCadence: "weekly" | "monthly"
}

export const CHANNELS: Channel[] = [
  { id: "amazon",     name: "Amazon",                demandShare: 0.30, safetyStockWOS: 10, fulfillmentLeadDays: 7,  channelType: "online", storeCount: 0,     orderCadence: "monthly" },
  { id: "ecommerce",  name: "E-Commerce (DTC)",      demandShare: 0.25, safetyStockWOS: 8,  fulfillmentLeadDays: 3,  channelType: "online", storeCount: 0,     orderCadence: "monthly" },
  { id: "wholesale",  name: "Wholesale (Ulta/Sephora)", demandShare: 0.25, safetyStockWOS: 12, fulfillmentLeadDays: 14, channelType: "retail", storeCount: 2_800, orderCadence: "weekly" },
  { id: "b2b",        name: "B2B (Hotels & Spas)",   demandShare: 0.20, safetyStockWOS: 10, fulfillmentLeadDays: 10, channelType: "retail", storeCount: 1_200, orderCadence: "monthly" },
]

// ─── Co-Manufacturer Sites ───────────────────────────────────────────────────

export interface CoManSite {
  id: string
  name: string
  capabilities: ("filling" | "kitting")[]
  /** Which formulation IDs this site can produce */
  formulationCapability: string[]
  /** Monthly unit capacity */
  monthlyCapacity: number
  /** Share of total production */
  productionShare: number
}

export const COMAN_SITES: CoManSite[] = [
  {
    id: "site-a",
    name: "Site A - Fill & Pack (Primary)",
    capabilities: ["filling", "kitting"],
    formulationCapability: FORMULATIONS.map(f => f.id), // all formulations
    monthlyCapacity: 800_000,
    productionShare: 0.45,
  },
  {
    id: "site-b",
    name: "Site B - Fill & Pack",
    capabilities: ["filling", "kitting"],
    formulationCapability: ["hydrating-cream", "collagen-night-cream", "vitamin-c-moisturizer", "gentle-cleanser", "spf50-daily", "broad-spectrum-spf30"],
    monthlyCapacity: 500_000,
    productionShare: 0.30,
  },
  {
    id: "site-c",
    name: "Site C - Kitting Only",
    capabilities: ["kitting"],
    formulationCapability: FORMULATIONS.map(f => f.id),
    monthlyCapacity: 0, // no production
    productionShare: 0,
  },
  {
    id: "site-d",
    name: "Site D - Kitting Only",
    capabilities: ["kitting"],
    formulationCapability: FORMULATIONS.map(f => f.id),
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
  { id: "3pl-east",   name: "3PL East (US-East)",  servesChannels: ["ecommerce", "wholesale", "b2b"], allocationShare: 0.35 },
  { id: "3pl-west",   name: "3PL West (US-West)",  servesChannels: ["ecommerce", "wholesale"],        allocationShare: 0.20 },
  { id: "amazon-fba", name: "Amazon FBA",           servesChannels: ["amazon"],                        allocationShare: 0.25 },
  { id: "3pl-canada", name: "3PL Canada",           servesChannels: ["ecommerce", "b2b"],              allocationShare: 0.10 },
  { id: "3pl-europe", name: "3PL Europe",           servesChannels: ["ecommerce", "b2b"],              allocationShare: 0.10 },
]

// ─── BOM (Bill of Materials) ─────────────────────────────────────────────────

export interface BOMItem {
  materialId: string
  materialName: string
  category: "blend" | "fragrance" | "container" | "label" | "carton"
  /** Quantity per unit */
  qtyPerUnit: number
  unit: string
  /** Whether this material is formulation-specific */
  formulationSpecific: boolean
  /** Lead time in weeks */
  leadTimeWeeks: number
  /** Minimum order quantity */
  moq: number
}

export const BOM_ITEMS: BOMItem[] = [
  { materialId: "blend",     materialName: "Active Ingredient Blend", category: "blend",     qtyPerUnit: 1,    unit: "doses",   formulationSpecific: true,  leadTimeWeeks: 8, moq: 100_000 },
  { materialId: "fragrance", materialName: "Fragrance / Essential Oil", category: "fragrance", qtyPerUnit: 1, unit: "doses",   formulationSpecific: true,  leadTimeWeeks: 6, moq: 50_000 },
  { materialId: "container", materialName: "Container (Jar/Bottle/Tube)", category: "container", qtyPerUnit: 1, unit: "units", formulationSpecific: false, leadTimeWeeks: 4, moq: 25_000 },
  { materialId: "label",     materialName: "Label / Sleeve",          category: "label",     qtyPerUnit: 1,    unit: "units",   formulationSpecific: true,  leadTimeWeeks: 3, moq: 25_000 },
  { materialId: "carton",    materialName: "Outer Carton",            category: "carton",    qtyPerUnit: 0.5,  unit: "cartons", formulationSpecific: false, leadTimeWeeks: 4, moq: 10_000 },
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

/** Total monthly unit demand across all formulations (approx) */
export const TOTAL_MONTHLY_UNITS = FORMULATIONS.reduce((sum, f) => sum + f.monthlyDemand, 0) // ~1.7M

/** Production batch size (units) */
export const PRODUCTION_BATCH_SIZE = 25_000

/** Target weeks of supply for WIP (bulk product) */
export const TARGET_WOS_WIP = 10

/** Target weeks of supply for finished goods */
export const TARGET_WOS_FG = 12

/** Average cost per unit (bulk, pre-packaging) */
export const COST_PER_UNIT = 12.50

/** Average cost per finished good unit (packaged) */
export const COST_PER_FG_UNIT = 18.00

/** Lead time in days for all SKUs (from GlowCo reference) */
export const LEAD_TIME_DAYS = 91

/** Minimum days on hand target (from GlowCo reference) */
export const MIN_DOH_TARGET = 60

// ─── Utility ─────────────────────────────────────────────────────────────────

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest
}

/**
 * Generate a seeded demand value for a formulation in a given month.
 * Applies seasonality + small random variation.
 */
export function getMonthlyDemand(formulation: Formulation, monthOffset: number): number {
  const monthIdx = (PLAN_START_MONTH + monthOffset) % 12
  const rand = seededRand(
    formulation.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 31 + monthOffset * 7,
  )
  const base = formulation.monthlyDemand * formulation.seasonality[monthIdx]
  const variation = 0.92 + rand() * 0.16 // ±8% variation
  return Math.round(base * variation)
}
