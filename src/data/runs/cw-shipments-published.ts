// Current Week - Run 5: Shipments Published (PPCCCC)
// Shipments locked, production recalculated based on kitting demand
import { cwShipmentsAdjustedData } from "./cw-shipments-adjusted"
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  materialsPlanData,
} from "./unified-data"

// Production recalculated with locked shipment/kitting demand
const productionSKUData = {
  "OB24": {
    initialStartingInventory: 7700,
    productionPlanned: [590, 656, 600, 950, 150, 452, 358, 300, 500, 738, 668, 444, 612, 556, 520, 500],
    kittingDemand: [470, 702, 1224, 936, 1168, 1002, 1248, 930, 852, 936, 826, 684, 580, 578, 560, 550],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "MH24": {
    initialStartingInventory: 5900,
    productionPlanned: [446, 493, 460, 740, 120, 346, 286, 240, 385, 560, 504, 340, 466, 423, 400, 390],
    kittingDemand: [356, 530, 924, 710, 884, 756, 944, 702, 644, 708, 624, 516, 437, 437, 420, 410],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "TK24": {
    initialStartingInventory: 4430,
    productionPlanned: [338, 373, 348, 558, 84, 252, 208, 174, 286, 424, 380, 252, 350, 318, 298, 290],
    kittingDemand: [266, 396, 690, 530, 661, 566, 706, 525, 482, 530, 468, 386, 328, 326, 314, 307],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "HC24": {
    initialStartingInventory: 3784,
    productionPlanned: [290, 318, 296, 484, 72, 218, 178, 148, 244, 362, 324, 216, 300, 272, 256, 250],
    kittingDemand: [228, 342, 596, 458, 570, 488, 610, 453, 416, 457, 403, 333, 283, 280, 270, 263],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "VP12": {
    initialStartingInventory: 3136,
    productionPlanned: [240, 263, 246, 398, 62, 180, 152, 124, 200, 298, 270, 178, 248, 226, 214, 208],
    kittingDemand: [189, 282, 492, 378, 472, 404, 504, 374, 344, 378, 334, 276, 234, 234, 226, 220],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

// Co-man production recalculated to meet increased demand
const coManProductionData = {
  "San Bernardino Facility": {
    "OB24": {
      capacity: Array(16).fill(700),
      planned: [354, 394, 360, 570, 90, 271, 215, 180, 300, 443, 401, 266, 367, 334, 312, 300],
      overrides: Array(16).fill(null),
    },
    "MH24": {
      capacity: Array(16).fill(580),
      planned: [268, 296, 276, 444, 72, 208, 172, 144, 231, 336, 302, 204, 280, 254, 240, 234],
      overrides: Array(16).fill(null),
    },
  },
  "Midwest Meat Co": {
    "TK24": {
      capacity: Array(16).fill(430),
      planned: [203, 224, 209, 335, 50, 151, 125, 104, 172, 254, 228, 151, 210, 191, 179, 174],
      overrides: Array(16).fill(null),
    },
    "HC24": {
      capacity: Array(16).fill(370),
      planned: [174, 191, 178, 290, 43, 131, 107, 89, 146, 217, 194, 130, 180, 163, 154, 150],
      overrides: Array(16).fill(null),
    },
  },
  "Pacific Jerky Works": {
    "VP12": {
      capacity: Array(16).fill(280),
      planned: [144, 158, 148, 239, 37, 108, 91, 74, 120, 179, 162, 107, 149, 136, 128, 125],
      overrides: Array(16).fill(null),
    },
  },
}

const summaryMetrics = {
  demand: { value: "+4.2%", subtext: "106.9K vs 102.6K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$8.0K", subtext: "$267K vs $259K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.4 weeks", subtext: "5.6 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+4.6K", subtext: "107.2K vs 102.6K units", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+8%", subtext: "86% vs 78%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$1.56K", subtext: "$73.6K vs $72.0K", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.6%", subtext: "70.4% vs 68.8%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "+1", subtext: "3 vs 2 SKUs", trend: "up" as const, type: "ok" as const },
}

export const cwShipmentsPublishedData = {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  retailDemandData: cwShipmentsAdjustedData.retailDemandData,
  productionSKUData, coManProductionData,
  kittingPlanData: cwShipmentsAdjustedData.kittingPlanData,
  materialsPlanData,
  allocationPlanData: cwShipmentsAdjustedData.allocationPlanData,
  summaryMetrics,
}
