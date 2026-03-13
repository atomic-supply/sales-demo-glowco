// Last Week - Run 8: All Published - Week Complete (PPPPPP)
// Full planning cycle complete - all modules adjusted and published

import { lwProductionPublishedData } from "./lw-production-published"

// Kitting adjusted and published
const finalKitting = lwProductionPublishedData.kittingPlanData.map(item => ({
  ...item,
  // Final kitting plan after planner review
  kitCenters: item.kitCenters.map(kc => ({
    ...kc,
    weeklyPlanned: kc.weeklyPlanned.map((v, i) => {
      // Smoothed allocation across kit centers
      const adjustment = i < 4 ? 1.02 : i < 8 ? 1.05 : 1.03
      return Math.round(v * adjustment)
    }),
  })),
}))

// Materials adjusted and published
const finalMaterials = lwProductionPublishedData.materialsPlanData.map(item => ({
  ...item,
  // Final material orders placed
  plannedSupply: item.plannedSupply.map((v) => {
    // Extra buffer added for lead time coverage
    return Math.round(v * 1.05)
  }),
  suppliers: item.suppliers.map(s => ({
    ...s,
    materialRequirement: s.materialRequirement.map((v) => Math.round(v * 1.04)),
  })),
}))

// Allocation adjusted and published
const finalAllocation = lwProductionPublishedData.allocationPlanData.map(item => ({
  ...item,
  warehouses: item.warehouses.map(wh => ({
    ...wh,
    // Final allocation balancing WOS across warehouses
    allocationPlanned: wh.allocationPlanned.map((v) => {
      const wosAdjustment = wh.targetWOS > 5.5 ? 1.08 : 1.04
      return Math.round(v * wosAdjustment)
    }),
  })),
}))

// Summary metrics for this run state - All Published - Week Complete (PPPPPP)
const summaryMetrics = {
  demand: { value: "+3.5%", subtext: "48.9M vs 47.2M sticks", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$3.8M", subtext: "$122.3M vs $118.5M", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.2 weeks", subtext: "5.8 vs 6.0 weeks", trend: "down" as const, type: "ok" as const },
  productionPlan: { value: "+2.3M", subtext: "49.5M vs 47.2M sticks", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+10%", subtext: "87% vs 77%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$0.82M", subtext: "$36.2M vs $35.38M", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.8%", subtext: "69.3% vs 67.5%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "0", subtext: "3 vs 3 SKUs", trend: "flat" as const, type: "ok" as const },
}

export const lwCompleteData = {
  ...lwProductionPublishedData,
  kittingPlanData: finalKitting,
  materialsPlanData: finalMaterials,
  allocationPlanData: finalAllocation,
  summaryMetrics,
}
