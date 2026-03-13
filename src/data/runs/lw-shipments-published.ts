// Last Week - Run 5: Shipments Published (PPCCCC)
// Shipments published, Production/Kitting/Materials/Allocation recalculated based on published shipments

import { lwShipmentsAdjustedData } from "./lw-shipments-adjusted"
import {
  productionSKUData as baseProduction,
  coManProductionData as baseCoManProduction,
  kittingPlanData as baseKitting,
  materialsPlanData as baseMaterials,
  allocationPlanData as baseAllocation,
} from "./unified-data"

// Production recalculated based on published shipment demand
// Using all Velo Foods SKUs from base production with adjustments
const recalculatedProduction: Record<string, { initialStartingInventory: number; productionPlanned: number[]; kittingDemand: number[]; targetWOS: number[] }> = {}

// Dynamically build production data for all SKUs in base production
for (const [sku, data] of Object.entries(baseProduction)) {
  if (data && data.productionPlanned && data.kittingDemand) {
    recalculatedProduction[sku] = {
      initialStartingInventory: Math.round(data.initialStartingInventory * 0.88), // Slightly lower starting inventory
      productionPlanned: data.productionPlanned.map((v) => Math.round(v * 1.06)), // 6% increase
      kittingDemand: data.kittingDemand.map((v) => Math.round(v * 1.04)), // 4% increase
      targetWOS: data.targetWOS,
    }
  }
}

// Summary metrics for this run state - Shipments Published (PPCCCC)
const summaryMetrics = {
  demand: { value: "+3.0%", subtext: "4.82M vs 4.68M units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$320K", subtext: "$12.05M vs $11.73M", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.6 weeks", subtext: "5.4 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+180K", subtext: "4.86M vs 4.68M units", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+7%", subtext: "82% vs 75%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$65K", subtext: "$3.56M vs $3.50M", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.2%", subtext: "68.7% vs 67.5%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "+2", subtext: "5 vs 3 SKUs", trend: "up" as const, type: "warning" as const },
}

export const lwShipmentsPublishedData = {
  ...lwShipmentsAdjustedData,

  // Production recalculated
  productionSKUData: recalculatedProduction,
  coManProductionData: baseCoManProduction,

  // Kitting recalculated based on new production plan
  kittingPlanData: baseKitting.map(item => ({
    ...item,
    kittingDemand: item.kittingDemand.map((v) => Math.round(v * 1.05)),
  })),

  // Materials recalculated
  materialsPlanData: baseMaterials.map(item => ({
    ...item,
    plannedSupply: item.plannedSupply.map((v) => Math.round(v * 1.04)),
  })),

  // Allocation recalculated
  allocationPlanData: baseAllocation.map(item => ({
    ...item,
    inboundFG: item.inboundFG.map((v) => Math.round(v * 1.06)),
  })),

  // Reporting data
  summaryMetrics,
}
