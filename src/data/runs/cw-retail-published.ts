// Current Week - Run 3: Retail Published (PCCCCC)
// Retail forecasts locked, production recalculated to meet published demand
import { cwRetailAdjustedData } from "./cw-retail-adjusted"
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
} from "./unified-data"

// Production recalculated based on published retail - higher demand flows through
const productionSKUData = {
  "OB24": {
    initialStartingInventory: 7700,
    productionPlanned: [570, 636, 580, 930, 138, 432, 338, 280, 480, 718, 648, 424, 592, 536, 500, 480],
    kittingDemand: [470, 702, 1224, 936, 1168, 1002, 1248, 930, 852, 936, 826, 684, 580, 578, 560, 550],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "MH24": {
    initialStartingInventory: 5900,
    productionPlanned: [426, 473, 440, 720, 108, 326, 266, 220, 365, 540, 484, 320, 446, 403, 380, 370],
    kittingDemand: [356, 530, 924, 710, 884, 756, 944, 702, 644, 708, 624, 516, 437, 437, 420, 410],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "TK24": {
    initialStartingInventory: 4430,
    productionPlanned: [318, 353, 328, 538, 81, 243, 198, 165, 272, 403, 361, 239, 333, 302, 283, 276],
    kittingDemand: [266, 396, 690, 530, 661, 566, 706, 525, 482, 530, 468, 386, 328, 326, 314, 307],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "HC24": {
    initialStartingInventory: 3784,
    productionPlanned: [274, 304, 283, 464, 69, 210, 171, 142, 235, 348, 312, 206, 287, 260, 244, 237],
    kittingDemand: [228, 342, 596, 458, 570, 488, 610, 453, 416, 457, 403, 333, 283, 280, 270, 263],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "VP12": {
    initialStartingInventory: 3136,
    productionPlanned: [226, 251, 234, 383, 57, 173, 141, 118, 194, 288, 258, 170, 238, 216, 202, 196],
    kittingDemand: [189, 282, 492, 378, 472, 404, 504, 374, 344, 378, 334, 276, 234, 234, 226, 220],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

const summaryMetrics = {
  demand: { value: "+3.2%", subtext: "102.6K vs 99.4K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$7.0K", subtext: "$257K vs $249K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.8 weeks", subtext: "5.2 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+3.0K", subtext: "102.6K vs 99.6K units", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+6%", subtext: "82% vs 76%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$1.36K", subtext: "$72.4K vs $71.0K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+1.2%", subtext: "69.2% vs 68.0%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "+3", subtext: "6 vs 3 SKUs", trend: "up" as const, type: "warning" as const },
}

export const cwRetailPublishedData = {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  retailDemandData: cwRetailAdjustedData.retailDemandData,
  productionSKUData,
  coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
  summaryMetrics,
}
