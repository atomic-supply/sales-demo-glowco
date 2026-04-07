export interface Change {
  description: string
  status: "proposed" | "approved"
}

export const moduleDefaults: Record<string, { timestamp: string; owner: string }> = {
  C: { timestamp: "2025-01-08 10:15", owner: "Sarah" },
  S: { timestamp: "2025-01-07 16:45", owner: "Sarah" },
}

export const sampleChanges: Record<string, Change[]> = {
  C: [
    { description: "ADJ-C01: Override promotional lift for SPF 50 Daily at Wholesale +15% (James approved)", status: "approved" },
    { description: "ADJ-C02: Adjust baseline forecast for Collagen Night Cream at Amazon -5% (pending leadership sign-off)", status: "proposed" },
  ],
  S: [
    { description: "ADJ-S01: Shea Butter Lotion to B2B (Hotels & Spas), 01/26/26, -8K units - Draw down inventory", status: "approved" },
    { description: "ADJ-S02: Shea Butter Lotion to B2B (Hotels & Spas), 02/23/26, -5K units - Normalize stock levels", status: "approved" },
    { description: "ADJ-S03: SPF 50 Daily to Wholesale (Ulta/Sephora), 12/15/25, +20K units - Summer promotion stock up", status: "proposed" },
    { description: "ADJ-S04: Hydrating Face Cream to 3PL East (DTC), 12/22/25, +10K units - Peak holiday D2C volume", status: "proposed" },
  ],
}

export const planMetrics = [
  { section: "Demand", metric: "Total demand", value: 1740000, target: 1800000, status: "ok" },
  { section: "Demand", metric: "Forecast accuracy", value: 95.8, target: 95.0, status: "ok" },
  { section: "Revenue & Cost", metric: "Total revenue", value: 31320000, target: 30000000, status: "ok" },
  { section: "Revenue & Cost", metric: "Total cost", value: 21750000, target: 22500000, status: "ok" },
  { section: "Revenue & Cost", metric: "Gross margin %", value: 30.5, target: 28.0, status: "ok" },
  { section: "Revenue & Cost", metric: "Cost per unit", value: 12.50, target: 12.75, status: "ok" },
  { section: "Inventory", metric: "Finished goods WOS", value: 11.2, target: 12.0, status: "warning" },
  { section: "Inventory", metric: "Units WOS", value: 7.8, target: 8.0, status: "warning" },
  { section: "Inventory", metric: "Raw materials WOS", value: 8.2, target: 8.0, status: "ok" },
  { section: "Inventory", metric: "In-transit weeks", value: 1.5, target: 1.5, status: "ok" },
  { section: "Inventory", metric: "Total inventory value", value: 3890000, target: 4000000, status: "ok" },
]

export const comparisonPlanMetrics = [
  { section: "Demand", metric: "Total demand", value: 1680000, target: 1800000, status: "warning" },
  { section: "Demand", metric: "Forecast accuracy", value: 94.2, target: 95.0, status: "warning" },
  { section: "Revenue & Cost", metric: "Total revenue", value: 30240000, target: 30000000, status: "ok" },
  { section: "Revenue & Cost", metric: "Total cost", value: 21420000, target: 22500000, status: "ok" },
  { section: "Revenue & Cost", metric: "Gross margin %", value: 29.2, target: 28.0, status: "ok" },
  { section: "Revenue & Cost", metric: "Cost per unit", value: 12.75, target: 12.75, status: "warning" },
  { section: "Inventory", metric: "Finished goods WOS", value: 10.4, target: 12.0, status: "warning" },
  { section: "Inventory", metric: "Units WOS", value: 7.2, target: 8.0, status: "warning" },
  { section: "Inventory", metric: "Raw materials WOS", value: 7.9, target: 8.0, status: "warning" },
  { section: "Inventory", metric: "In-transit weeks", value: 1.8, target: 1.5, status: "warning" },
  { section: "Inventory", metric: "Total inventory value", value: 3540000, target: 4000000, status: "ok" },
]

export const demandByChannel = [
  { channel: "E-Commerce (DTC)", demand: 435000, pct: 25.0 },
  { channel: "Amazon", demand: 522000, pct: 30.0 },
  { channel: "Wholesale (Ulta/Sephora)", demand: 435000, pct: 25.0 },
  { channel: "B2B (Hotels & Spas)", demand: 348000, pct: 20.0 },
]

export const compDemandByChannel = [
  { channel: "E-Commerce (DTC)", demand: 420000, pct: 25.0 },
  { channel: "Amazon", demand: 504000, pct: 30.0 },
  { channel: "Wholesale (Ulta/Sephora)", demand: 420000, pct: 25.0 },
  { channel: "B2B (Hotels & Spas)", demand: 336000, pct: 20.0 },
]

export const productionByComan = [
  { coman: "Site A - Fill & Pack (Primary)", production: 720000, capacity: 800000, utilization: 90.0 },
  { coman: "Site B - Fill & Pack", production: 440000, capacity: 500000, utilization: 88.0 },
  { coman: "Site C - Kitting Only", production: 280000, capacity: 350000, utilization: 80.0 },
]

export const compProductionByComan = [
  { coman: "Site A - Fill & Pack (Primary)", production: 680000, capacity: 800000, utilization: 85.0 },
  { coman: "Site B - Fill & Pack", production: 420000, capacity: 500000, utilization: 84.0 },
  { coman: "Site C - Kitting Only", production: 260000, capacity: 350000, utilization: 74.3 },
]

export const inventoryBy3PL = [
  { location: "3PL East (US-East)", units: 245000, wos: 10.2, status: "ok" },
  { location: "3PL West (US-West)", units: 168000, wos: 8.4, status: "warning" },
  { location: "Amazon FBA", units: 210000, wos: 9.1, status: "ok" },
  { location: "3PL Canada", units: 84000, wos: 8.8, status: "ok" },
  { location: "3PL Europe", units: 78000, wos: 7.5, status: "warning" },
]

export const compInventoryBy3PL = [
  { location: "3PL East (US-East)", units: 230000, wos: 9.6, status: "ok" },
  { location: "3PL West (US-West)", units: 152000, wos: 7.8, status: "warning" },
  { location: "Amazon FBA", units: 198000, wos: 8.2, status: "ok" },
  { location: "3PL Canada", units: 78000, wos: 8.0, status: "ok" },
  { location: "3PL Europe", units: 72000, wos: 6.8, status: "warning" },
]

export const skuSummary = [
  { sku: "SKU-001", formulation: "Hydrating Face Cream (Standard)", demand: 180000, inventory: 210000, wos: 4.8, status: "ok" },
  { sku: "SKU-005", formulation: "SPF 50 Daily Sunscreen (Standard)", demand: 200000, inventory: 180000, wos: 3.6, status: "warning" },
  { sku: "SKU-007", formulation: "Shea Butter Body Lotion (Standard)", demand: 170000, inventory: 200000, wos: 5.9, status: "ok" },
  { sku: "SKU-012", formulation: "Volumizing Shampoo (Standard)", demand: 150000, inventory: 160000, wos: 5.3, status: "ok" },
  { sku: "SKU-003", formulation: "Vitamin C Moisturizer (Value Set)", demand: 160000, inventory: 130000, wos: 4.1, status: "warning" },
  { sku: "SKU-010", formulation: "Frizz Control Cream (Standard)", demand: 130000, inventory: 160000, wos: 6.1, status: "ok" },
]

export const compSkuSummary = [
  { sku: "SKU-001", formulation: "Hydrating Face Cream (Standard)", demand: 175000, inventory: 200000, wos: 4.5, status: "ok" },
  { sku: "SKU-005", formulation: "SPF 50 Daily Sunscreen (Standard)", demand: 195000, inventory: 165000, wos: 3.4, status: "warning" },
  { sku: "SKU-007", formulation: "Shea Butter Body Lotion (Standard)", demand: 165000, inventory: 190000, wos: 5.5, status: "ok" },
  { sku: "SKU-012", formulation: "Volumizing Shampoo (Standard)", demand: 145000, inventory: 150000, wos: 5.0, status: "ok" },
  { sku: "SKU-003", formulation: "Vitamin C Moisturizer (Value Set)", demand: 155000, inventory: 120000, wos: 3.8, status: "warning" },
  { sku: "SKU-010", formulation: "Frizz Control Cream (Standard)", demand: 125000, inventory: 150000, wos: 5.7, status: "ok" },
]
