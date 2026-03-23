import { seededRand } from "../utils/random"
import { shipToLocations, skus, coManSites } from "./runs/unified-data"

export interface ForecastRow {
  shipFrom: string
  customer: string
  sku: string
  skuName: string
}

export function generateForecastData(
  shipFrom: string,
  customer: string,
  sku: string,
  columns: string[],
): { quantity: number[]; splitPct: number[] } {
  const rand = seededRand(
    shipFrom.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137 +
    customer.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 53 +
    sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  )

  const skuHash = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const customerHash = customer.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseQty = 5000 + (skuHash % 15000) + (customerHash % 5000)

  const seasonality = [0.85, 0.90, 1.05, 1.15, 1.25, 1.30, 1.20, 1.10, 1.00, 0.95, 1.10, 1.35]

  const quantity = columns.map((col) => {
    const [mStr] = col.split("/")
    const month = Number(mStr)
    const season = seasonality[(month - 1) % 12]
    const noise = 0.85 + rand() * 0.3
    return Math.round(baseQty * season * noise)
  })

  const baseSplit = 15 + Math.round(rand() * 40)
  const splitPct = columns.map(() => baseSplit + Math.round((rand() - 0.5) * 10))

  return { quantity, splitPct }
}

export function buildForecastRows(): ForecastRow[] {
  const rows: ForecastRow[] = []
  const shipFroms = coManSites.map((s) => s.name)
  const customers = [...new Set(shipToLocations.map((l) => l.customer))]

  for (const shipFrom of shipFroms) {
    for (const customer of customers) {
      const skuSubset = skus.filter((_, i) => {
        const hash = (shipFrom.charCodeAt(0) + customer.charCodeAt(0) + i) % 5
        return hash < 3
      }).slice(0, 5)

      for (const sku of skuSubset) {
        rows.push({
          shipFrom,
          customer,
          sku: sku.code,
          skuName: sku.name,
        })
      }
    }
  }
  return rows
}

