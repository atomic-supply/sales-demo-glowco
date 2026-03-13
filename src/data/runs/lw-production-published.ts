// Last Week - Run 7: Production Published (PPPCCC)
// Production published, Kitting/Materials/Allocation recalculated

import { lwProductionAdjustedData } from "./lw-production-adjusted"

// Kitting recalculated based on published production
const recalculatedKitting = lwProductionAdjustedData.kittingPlanData.map(item => ({
  ...item,
  // Kitting demand now driven by published production output
  kittingDemand: item.kittingDemand.map((v) => Math.round(v * 1.08)),
  kitCenters: item.kitCenters.map(kc => ({
    ...kc,
    weeklyPlanned: kc.weeklyPlanned.map((v) => Math.round(v * 1.06)),
  })),
}))

// Materials recalculated based on published production requirements
const recalculatedMaterials = lwProductionAdjustedData.materialsPlanData.map(item => ({
  ...item,
  coManConsumption: item.coManConsumption.map(c => ({
    ...c,
    materialRequirement: c.materialRequirement.map((v) => Math.round(v * 1.07)),
  })),
  plannedSupply: item.plannedSupply.map((v) => Math.round(v * 1.06)),
}))

// Allocation recalculated
const recalculatedAllocation = lwProductionAdjustedData.allocationPlanData.map(item => ({
  ...item,
  inboundFG: item.inboundFG.map((v) => Math.round(v * 1.08)),
  warehouses: item.warehouses.map(wh => ({
    ...wh,
    allocationPlanned: wh.allocationPlanned.map((v) => Math.round(v * 1.05)),
  })),
}))

// Summary metrics for this run state - Production Published (PPPCCC)
const summaryMetrics = {
  demand: { value: "+3.2%", subtext: "48.5M vs 47.0M sticks", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$3.5M", subtext: "$121.3M vs $117.8M", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.4 weeks", subtext: "5.6 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+2.1M", subtext: "49.1M vs 47.0M sticks", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+9%", subtext: "85% vs 76%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$0.72M", subtext: "$35.9M vs $35.18M", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.5%", subtext: "69.0% vs 67.5%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "+1", subtext: "4 vs 3 SKUs", trend: "up" as const, type: "ok" as const },
}

export const lwProductionPublishedData = {
  ...lwProductionAdjustedData,
  kittingPlanData: recalculatedKitting,
  materialsPlanData: recalculatedMaterials,
  allocationPlanData: recalculatedAllocation,
  summaryMetrics,
}
