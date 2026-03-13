// Current Week - Run 2: Retail Adjusted (ACCCCC)
// Planner has adjusted retail demand forecasts based on new marketing intel
import { lwCompleteData } from "./lw-complete"
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
} from "./unified-data"

// Retail demand with planner adjustments
const retailDemandData = {
  Costco: {
    channels: {
      "Costco Stores": {
        skus: {
          "CO24": {
            baselineForecast: [399, 388, 378, 414, 425, 416, 433, 446, 437, 458, 471, 484, 498, 488, 506, 519],
            promotionalLift: [0, 0, 76, 0, 0, 0, 0, 89, 0, 0, 0, 0, 100, 0, 0, 0],
            adjustedForecast: [399, 388, 454, 414, 425, 416, 433, 535, 437, 458, 471, 484, 598, 488, 506, 519],
          },
          "CJ24": {
            baselineForecast: [340, 332, 326, 351, 359, 355, 363, 374, 370, 378, 386, 397, 405, 400, 412, 418],
            promotionalLift: [0, 0, 65, 0, 0, 0, 0, 75, 0, 0, 0, 0, 81, 0, 0, 0],
            adjustedForecast: [340, 332, 391, 351, 359, 355, 363, 449, 370, 378, 386, 397, 486, 400, 412, 418],
          },
        },
      },
      "Costco.com": {
        skus: {
          "CO24": {
            baselineForecast: [134, 130, 126, 139, 143, 140, 145, 149, 147, 153, 158, 162, 166, 163, 170, 174],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [134, 130, 126, 139, 143, 140, 145, 149, 147, 153, 158, 162, 166, 163, 170, 174],
          },
        },
      },
    },
  },
  Target: {
    channels: {
      "Target Stores": {
        skus: {
          "CO24": {
            baselineForecast: [609, 593, 578, 630, 651, 638, 666, 689, 674, 706, 730, 751, 775, 760, 788, 811],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [609, 593, 578, 630, 651, 638, 666, 689, 674, 706, 730, 751, 775, 760, 788, 811],
          },
          "CJ24": {
            baselineForecast: [501, 487, 474, 522, 541, 530, 553, 572, 559, 586, 607, 625, 646, 632, 656, 674],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [501, 487, 474, 522, 541, 530, 553, 572, 559, 586, 607, 625, 646, 632, 656, 674],
          },
        },
      },
    },
  },
  Walmart: {
    channels: {
      "Walmart Stores": {
        skus: {
          "CO24": {
            baselineForecast: [249, 241, 235, 259, 267, 263, 273, 284, 275, 291, 301, 312, 320, 315, 328, 336],
            promotionalLift: [0, 0, 0, 0, 0, 66, 0, 0, 0, 0, 0, 78, 0, 0, 0, 0],
            adjustedForecast: [249, 241, 235, 259, 267, 329, 273, 284, 275, 291, 301, 390, 320, 315, 328, 336],
          },
          "CJ24": {
            baselineForecast: [207, 198, 193, 214, 223, 217, 228, 236, 230, 241, 252, 259, 268, 263, 273, 280],
            promotionalLift: [0, 0, 0, 0, 0, 54, 0, 0, 0, 0, 0, 65, 0, 0, 0, 0],
            adjustedForecast: [207, 198, 193, 214, 223, 271, 228, 236, 230, 241, 252, 324, 268, 263, 273, 280],
          },
        },
      },
    },
  },
  DTC: {
    channels: {
      "velo.com": {
        skus: {
          "CO24": {
            baselineForecast: [119, 116, 113, 123, 126, 125, 129, 132, 131, 135, 139, 142, 145, 144, 146, 148],
            promotionalLift: [0, 0, 29, 0, 0, 0, 0, 33, 0, 0, 0, 0, 36, 0, 0, 0],
            adjustedForecast: [119, 116, 142, 123, 126, 125, 129, 165, 131, 135, 139, 142, 181, 144, 146, 148],
          },
        },
      },
    },
  },
}

const summaryMetrics = {
  demand: { value: "+3.2%", subtext: "102.6K vs 99.4K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$7.0K", subtext: "$257K vs $249K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-1.0 weeks", subtext: "5.0 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+1.6K", subtext: "99.4K vs 97.8K units", trend: "up" as const, type: "neutral" as const },
  rawUtilization: { value: "+5%", subtext: "78% vs 73%", trend: "up" as const, type: "neutral" as const },
  totalCost: { value: "+$1.04K", subtext: "$72.0K vs $71.0K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+0.8%", subtext: "68.8% vs 68.0%", trend: "up" as const, type: "neutral" as const },
  skusAtRisk: { value: "+4", subtext: "7 vs 3 SKUs", trend: "up" as const, type: "warning" as const },
}

export const cwRetailAdjustedData = {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  retailDemandData,
  productionSKUData: lwCompleteData.productionSKUData,
  coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
  summaryMetrics,
}
