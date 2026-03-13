// Current Week - Run 6: Production Adjusted (PPACCC) - Most recent / current state
// Planner has adjusted production to account for co-man maintenance windows
import { cwShipmentsPublishedData } from "./cw-shipments-published"
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  materialsPlanData,
} from "./unified-data"

// Production with planner overrides - shifted production away from maintenance weeks
const productionSKUData = {
  "CO24": {
    initialStartingInventory: 7700,
    productionPlanned: [620, 680, 560, 990, 120, 480, 380, 270, 530, 770, 700, 420, 640, 580, 540, 520],
    kittingDemand: [470, 702, 1224, 936, 1168, 1002, 1248, 930, 852, 936, 826, 684, 580, 578, 560, 550],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CJ24": {
    initialStartingInventory: 5900,
    productionPlanned: [470, 516, 430, 770, 96, 370, 304, 220, 410, 590, 536, 320, 490, 444, 420, 410],
    kittingDemand: [356, 530, 924, 710, 884, 756, 944, 702, 644, 708, 624, 516, 437, 437, 420, 410],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CB24": {
    initialStartingInventory: 4430,
    productionPlanned: [356, 390, 322, 578, 76, 282, 234, 174, 312, 444, 400, 244, 372, 338, 318, 310],
    kittingDemand: [266, 396, 690, 530, 661, 566, 706, 525, 482, 530, 468, 386, 328, 326, 314, 307],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CTOTJ24": {
    initialStartingInventory: 3784,
    productionPlanned: [304, 334, 276, 494, 58, 242, 200, 150, 268, 380, 346, 210, 320, 290, 274, 268],
    kittingDemand: [228, 342, 596, 458, 570, 488, 610, 453, 416, 457, 403, 333, 283, 280, 270, 263],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "COP12": {
    initialStartingInventory: 3136,
    productionPlanned: [252, 276, 228, 408, 54, 200, 170, 128, 222, 314, 286, 178, 264, 240, 226, 222],
    kittingDemand: [189, 282, 492, 378, 472, 404, 504, 374, 344, 378, 334, 276, 234, 234, 226, 220],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

// Co-man production with overrides for maintenance windows
const coManProductionData = {
  "Apex Manufacturing": {
    "CO24": {
      capacity: Array(16).fill(700),
      planned: [372, 408, 336, 594, 72, 288, 228, 162, 318, 462, 420, 252, 384, 348, 324, 312],
      overrides: [null, null, 336, null, 72, null, null, 162, null, null, null, null, null, null, null, null],
    },
    "CJ24": {
      capacity: Array(16).fill(580),
      planned: [282, 310, 258, 462, 58, 222, 182, 132, 246, 354, 322, 192, 294, 266, 252, 246],
      overrides: [null, null, 258, null, 58, null, null, 132, null, null, null, null, null, null, null, null],
    },
  },
  "Pinnacle Foods": {
    "CB24": {
      capacity: Array(16).fill(430),
      planned: [214, 234, 193, 347, 46, 169, 140, 104, 187, 266, 240, 146, 223, 203, 191, 186],
      overrides: [null, null, 193, null, 46, null, null, 104, null, null, null, null, null, null, null, null],
    },
    "CTOTJ24": {
      capacity: Array(16).fill(370),
      planned: [182, 200, 166, 296, 35, 145, 120, 90, 161, 228, 208, 126, 192, 174, 164, 161],
      overrides: [null, null, 166, null, 35, null, null, 90, null, null, null, null, null, null, null, null],
    },
  },
  "Cascade Nutrition": {
    "COP12": {
      capacity: Array(16).fill(280),
      planned: [151, 166, 137, 245, 32, 120, 102, 77, 133, 188, 172, 107, 158, 144, 136, 133],
      overrides: Array(16).fill(null),
    },
  },
}

const summaryMetrics = {
  demand: { value: "+4.8%", subtext: "107.5K vs 102.6K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$8.4K", subtext: "$269K vs $260K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.3 weeks", subtext: "5.7 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+5.6K", subtext: "108.2K vs 102.6K units", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+8%", subtext: "89% vs 81%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$1.70K", subtext: "$73.7K vs $72.0K", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.8%", subtext: "70.8% vs 69.0%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "0", subtext: "2 vs 2 SKUs", trend: "flat" as const, type: "ok" as const },
}

export const cwProductionAdjustedData = {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  retailDemandData: cwShipmentsPublishedData.retailDemandData,
  productionSKUData, coManProductionData,
  kittingPlanData: cwShipmentsPublishedData.kittingPlanData,
  materialsPlanData,
  allocationPlanData: cwShipmentsPublishedData.allocationPlanData,
  summaryMetrics,
}
