// Last Week - Shipments Adjusted (PACCCC)
// Logistics planner shifted shipment timing for holiday delays
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
} from "./unified-data"
import { retailDemandData } from "./lw-retail-adjusted"
import { productionSKUData } from "./lw-retail-published"
import { coManProductionData, kittingPlanData, materialsPlanData } from "./lw-initial"

export const allocationPlanData = [
  {
    sku: "OB24",
    startingNetworkInventory: 4410,
    inboundFG: [576, 558, 540, 529, 518, 508, 497, 487, 477, 467, 457, 447, 437, 427, 417, 407],
    warehouses: [
      { name: "IDS Indianapolis B2B", allocationPlanned: [243, 234, 202, 198, 202, 198, 194, 190, 186, 182, 178, 174, 170, 166, 162, 158], shipmentDemand: [207, 212, 219, 214, 218, 224, 230, 207, 212, 219, 214, 218, 224, 230, 207, 212], startingInventory: 1530, targetWOS: 6.0 },
      { name: "Meridian Logistics", allocationPlanned: [185, 178, 154, 151, 154, 151, 148, 145, 142, 139, 136, 133, 130, 127, 124, 121], shipmentDemand: [158, 164, 169, 162, 165, 173, 178, 158, 164, 169, 162, 165, 173, 178, 158, 164], startingInventory: 1296, targetWOS: 6.0 },
      { name: "East Coast 3PL", allocationPlanned: [126, 132, 121, 115, 115, 124, 130, 117, 122, 126, 120, 115, 124, 130, 117, 122], shipmentDemand: [108, 112, 117, 113, 110, 115, 120, 108, 112, 117, 113, 110, 115, 120, 108, 112], startingInventory: 864, targetWOS: 5.5 },
    ],
  },
  {
    sku: "TK24",
    startingNetworkInventory: 3330,
    inboundFG: [504, 495, 486, 477, 468, 459, 450, 441, 432, 423, 414, 405, 396, 387, 378, 369],
    warehouses: [
      { name: "IDS Indianapolis B2B", allocationPlanned: [214, 204, 199, 190, 184, 202, 212, 198, 189, 207, 198, 184, 202, 212, 198, 189], shipmentDemand: [180, 185, 193, 187, 191, 196, 202, 180, 185, 193, 187, 191, 196, 202, 180, 185], startingInventory: 1224, targetWOS: 5.5 },
      { name: "Meridian Logistics", allocationPlanned: [163, 155, 153, 148, 142, 154, 162, 150, 144, 158, 151, 140, 152, 163, 149, 144], shipmentDemand: [140, 144, 149, 146, 148, 153, 157, 140, 144, 149, 146, 148, 153, 157, 140, 144], startingInventory: 990, targetWOS: 5.5 },
    ],
  },
]

const summaryMetrics = {
  demand: { value: "+2.5%", subtext: "97.5K vs 95.1K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$6.1K", subtext: "$244K vs $238K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.7 weeks", subtext: "5.3 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+2.3K", subtext: "97.5K vs 95.2K units", trend: "up" as const, type: "neutral" as const },
  rawUtilization: { value: "+6%", subtext: "79% vs 73%", trend: "up" as const, type: "neutral" as const },
  totalCost: { value: "+$900", subtext: "$71.2K vs $70.3K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+0.4%", subtext: "68.4% vs 68.0%", trend: "up" as const, type: "neutral" as const },
  skusAtRisk: { value: "+2", subtext: "4 vs 2 SKUs", trend: "up" as const, type: "warning" as const },
}

export const lwShipmentsAdjustedData = {
  skus,
  coManSites,
  kitCenters,
  shipToLocations,
  suppliers,
  materials,
  coManPartners,
  COMAN_SITES,
  retailDemandData,
  productionSKUData,
  coManProductionData,
  kittingPlanData,
  materialsPlanData,
  allocationPlanData,
  summaryMetrics,
}
