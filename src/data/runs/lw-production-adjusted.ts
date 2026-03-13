// Last Week - Run 6: Production Adjusted (PPACCC)
// Planner adjusted production plan - shifted volumes between co-mans, smoothed capacity

import { lwShipmentsPublishedData } from "./lw-shipments-published"
import { coManProductionData as baseCoManProduction } from "./unified-data"

// Production manually adjusted by planner
// Dynamically build adjusted production for all SKUs
const adjustedProduction: Record<string, { initialStartingInventory: number; productionPlanned: number[]; kittingDemand: number[]; targetWOS: number[] }> = {}

for (const [sku, data] of Object.entries(lwShipmentsPublishedData.productionSKUData)) {
  if (data && data.productionPlanned && data.kittingDemand) {
    // Planner smoothed production - slight adjustments
    adjustedProduction[sku] = {
      initialStartingInventory: data.initialStartingInventory,
      productionPlanned: data.productionPlanned.map((v, i) => {
        // Smooth production: reduce spikes in weeks 3-4, increase in weeks 1-2
        if (i < 2) return Math.round(v * 1.02) // Slight increase early
        if (i >= 2 && i < 4) return Math.round(v * 0.98) // Reduce spike
        return v // Keep same for later weeks
      }),
      kittingDemand: data.kittingDemand,
      targetWOS: data.targetWOS,
    }
  }
}

// Co-man allocation adjusted - shifted volume to balance capacity
// Build adjusted co-man production dynamically
const adjustedCoManProduction: Record<string, Record<string, { capacity: number[]; planned: number[]; overrides: (number | null)[] }>> = {}

for (const [coMan, skuData] of Object.entries(baseCoManProduction)) {
  adjustedCoManProduction[coMan] = {}
  for (const [sku, data] of Object.entries(skuData)) {
    if (data && data.capacity && data.planned) {
      adjustedCoManProduction[coMan][sku] = {
        capacity: data.capacity,
        planned: data.planned.map((v, i) => {
          // Shift volume to balance capacity - increase utilization at underutilized sites
          if (i < 2) return Math.round(v * 1.03)
          if (i >= 2 && i < 4) return Math.round(v * 0.97)
          return v
        }),
        overrides: data.overrides || Array(data.planned.length).fill(null),
      }
    }
  }
}

// Summary metrics for this run state - Production Adjusted (PPACCC)
const summaryMetrics = {
  demand: { value: "+3.0%", subtext: "4.82M vs 4.68M units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$320K", subtext: "$12.05M vs $11.73M", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.5 weeks", subtext: "5.5 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+200K", subtext: "4.88M vs 4.68M units", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+8%", subtext: "84% vs 76%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$68K", subtext: "$3.57M vs $3.50M", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.3%", subtext: "68.8% vs 67.5%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "+2", subtext: "5 vs 3 SKUs", trend: "up" as const, type: "warning" as const },
}

export const lwProductionAdjustedData = {
  ...lwShipmentsPublishedData,
  productionSKUData: adjustedProduction,
  coManProductionData: adjustedCoManProduction,
  summaryMetrics,
}
