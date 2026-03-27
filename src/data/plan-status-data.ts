export interface Change {
  description: string
  status: "proposed" | "approved"
}

export const moduleDefaults: Record<string, { timestamp: string; owner: string }> = {
  C: { timestamp: "2025-01-08 10:15", owner: "Mike" },
  S: { timestamp: "2025-01-07 16:45", owner: "Mike" },
}

export const sampleChanges: Record<string, Change[]> = {
  C: [
    { description: "ADJ-C01: Override promotional lift for CO24 at velo.com +15% (Alex approved)", status: "approved" },
    { description: "ADJ-C02: Adjust baseline forecast for CB24 at Amazon -5% (pending leadership sign-off)", status: "proposed" },
  ],
  S: [
    { description: "ADJ-S01: CB24 to Distributor (Costco), 01/26/26, -180K sticks - Draw down inventory", status: "approved" },
    { description: "ADJ-S02: CB24 to Distributor (Costco), 02/23/26, -120K sticks - Normalize stock levels", status: "approved" },
    { description: "ADJ-S03: COP12 to Distributor (Target), 12/15/25, +500K sticks - Target promotion stock up", status: "proposed" },
    { description: "ADJ-S04: COP12 to 3PL (DTC), 12/22/25, +200K sticks - Peak holiday D2C volume", status: "proposed" },
  ],
}

export const planMetrics = [
  { section: "Demand", metric: "Total demand", value: 47760000, target: 48000000, status: "ok" },
  { section: "Demand", metric: "Forecast accuracy", value: 95.8, target: 95.0, status: "ok" },
  { section: "Revenue & Cost", metric: "Total revenue", value: 119400000, target: 115000000, status: "ok" },
  { section: "Revenue & Cost", metric: "Total cost", value: 35460000, target: 36000000, status: "ok" },
  { section: "Revenue & Cost", metric: "Gross margin %", value: 70.3, target: 68.0, status: "ok" },
  { section: "Revenue & Cost", metric: "Cost per unit", value: 0.74, target: 0.75, status: "ok" },
  { section: "Inventory", metric: "Finished goods WOS", value: 11.2, target: 12.0, status: "warning" },
  { section: "Inventory", metric: "Units WOS", value: 7.8, target: 8.0, status: "warning" },
  { section: "Inventory", metric: "Raw materials WOS", value: 8.2, target: 8.0, status: "ok" },
  { section: "Inventory", metric: "In-transit weeks", value: 1.5, target: 1.5, status: "ok" },
  { section: "Inventory", metric: "Total inventory value", value: 8890000, target: 9000000, status: "ok" },
]

export const comparisonPlanMetrics = [
  { section: "Demand", metric: "Total demand", value: 46200000, target: 48000000, status: "warning" },
  { section: "Demand", metric: "Forecast accuracy", value: 94.2, target: 95.0, status: "warning" },
  { section: "Revenue & Cost", metric: "Total revenue", value: 115500000, target: 115000000, status: "ok" },
  { section: "Revenue & Cost", metric: "Total cost", value: 35100000, target: 36000000, status: "ok" },
  { section: "Revenue & Cost", metric: "Gross margin %", value: 69.6, target: 68.0, status: "ok" },
  { section: "Revenue & Cost", metric: "Cost per unit", value: 0.76, target: 0.75, status: "warning" },
  { section: "Inventory", metric: "Finished goods WOS", value: 10.4, target: 12.0, status: "warning" },
  { section: "Inventory", metric: "Units WOS", value: 7.2, target: 8.0, status: "warning" },
  { section: "Inventory", metric: "Raw materials WOS", value: 7.9, target: 8.0, status: "warning" },
  { section: "Inventory", metric: "In-transit weeks", value: 1.8, target: 1.5, status: "warning" },
  { section: "Inventory", metric: "Total inventory value", value: 8540000, target: 9000000, status: "ok" },
]

export const demandByChannel = [
  { channel: "D2C - Shopify", demand: 12640000, pct: 26.5 },
  { channel: "D2C - Amazon", demand: 10080000, pct: 21.1 },
  { channel: "Retail - Target", demand: 8280000, pct: 17.3 },
  { channel: "Retail - Walmart", demand: 9120000, pct: 19.1 },
  { channel: "Retail - CVS", demand: 3840000, pct: 8.0 },
  { channel: "Retail - Costco CA", demand: 2400000, pct: 5.0 },
  { channel: "Wholesale", demand: 1400000, pct: 2.9 },
]

export const compDemandByChannel = [
  { channel: "D2C - Shopify", demand: 12100000, pct: 26.2 },
  { channel: "D2C - Amazon", demand: 9800000, pct: 21.2 },
  { channel: "Retail - Target", demand: 7900000, pct: 17.1 },
  { channel: "Retail - Walmart", demand: 8900000, pct: 19.3 },
  { channel: "Retail - CVS", demand: 3700000, pct: 8.0 },
  { channel: "Retail - Costco CA", demand: 2350000, pct: 5.1 },
  { channel: "Wholesale", demand: 1450000, pct: 3.1 },
]

export const productionByComan = [
  { coman: "San Bernardino Facility", production: 3700000, capacity: 4000000, utilization: 92.5 },
  { coman: "Midwest Meat Co", production: 2840000, capacity: 3200000, utilization: 88.8 },
  { coman: "Pacific Jerky Works", production: 1760000, capacity: 2000000, utilization: 88.0 },
]

export const compProductionByComan = [
  { coman: "San Bernardino Facility", production: 3500000, capacity: 4000000, utilization: 87.5 },
  { coman: "Midwest Meat Co", production: 2700000, capacity: 3200000, utilization: 84.4 },
  { coman: "Pacific Jerky Works", production: 1680000, capacity: 2000000, utilization: 84.0 },
]

export const inventoryBy3PL = [
  { location: "IDS Indianapolis B2B", units: 2450000, wos: 10.2, status: "ok" },
  { location: "Meridian Logistics", units: 3120000, wos: 8.4, status: "warning" },
  { location: "Greentop", units: 1680000, wos: 9.1, status: "ok" },
  { location: "In-Transit", units: 890000, wos: 1.5, status: "ok" },
]

export const compInventoryBy3PL = [
  { location: "IDS Indianapolis B2B", units: 2300000, wos: 9.6, status: "ok" },
  { location: "Meridian Logistics", units: 2980000, wos: 7.8, status: "warning" },
  { location: "Greentop", units: 1520000, wos: 8.2, status: "ok" },
  { location: "In-Transit", units: 920000, wos: 1.8, status: "warning" },
]

export const skuSummary = [
  { sku: "OB24", flavor: "Original Beef (24ct)", demand: 7420000, inventory: 8920000, wos: 4.8, status: "ok" },
  { sku: "MH24", flavor: "Jalapeno Beef (24ct)", demand: 6050000, inventory: 7140000, wos: 5.9, status: "ok" },
  { sku: "TK24", flavor: "Original Turkey (24ct)", demand: 4920000, inventory: 3740000, wos: 3.8, status: "warning" },
  { sku: "HC24", flavor: "Taco Original Turkey (24ct)", demand: 4190000, inventory: 4430000, wos: 5.3, status: "ok" },
  { sku: "VP12", flavor: "Original Beef (12ct)", demand: 3800000, inventory: 3120000, wos: 4.1, status: "warning" },
  { sku: "CSR24", flavor: "Salt & Pepper Venison (24ct)", demand: 2900000, inventory: 3560000, wos: 6.1, status: "ok" },
]

export const compSkuSummary = [
  { sku: "OB24", flavor: "Original Beef (24ct)", demand: 7200000, inventory: 8500000, wos: 4.5, status: "ok" },
  { sku: "MH24", flavor: "Jalapeno Beef (24ct)", demand: 5800000, inventory: 6800000, wos: 5.5, status: "ok" },
  { sku: "TK24", flavor: "Original Turkey (24ct)", demand: 4700000, inventory: 3400000, wos: 3.4, status: "warning" },
  { sku: "HC24", flavor: "Taco Original Turkey (24ct)", demand: 4000000, inventory: 4200000, wos: 5.0, status: "ok" },
  { sku: "VP12", flavor: "Original Beef (12ct)", demand: 3600000, inventory: 2900000, wos: 3.8, status: "warning" },
  { sku: "CSR24", flavor: "Salt & Pepper Venison (24ct)", demand: 2800000, inventory: 3300000, wos: 5.7, status: "ok" },
]
