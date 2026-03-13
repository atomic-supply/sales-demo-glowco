// Last Week - Retail Adjusted (ACCCCC)
// Demand planner added promotional lifts
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
} from "./unified-data"
import {
  productionSKUData, coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
} from "./lw-initial"

export const retailDemandData = {
  Costco: {
    channels: {
      "Costco Stores": {
        skus: {
          "CO24": {
            baselineForecast: [380, 370, 360, 394, 405, 396, 412, 425, 416, 436, 449, 461, 474, 465, 482, 494],
            promotionalLift: [0, 57, 54, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [380, 427, 414, 394, 405, 396, 412, 425, 416, 436, 449, 461, 474, 465, 482, 494],
          },
          "CJ24": {
            baselineForecast: [324, 316, 310, 334, 342, 338, 346, 356, 352, 360, 368, 378, 386, 381, 392, 398],
            promotionalLift: [0, 47, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [324, 363, 357, 334, 342, 338, 346, 356, 352, 360, 368, 378, 386, 381, 392, 398],
          },
          "CB24": {
            baselineForecast: [171, 166, 162, 176, 180, 178, 184, 190, 186, 194, 198, 204, 208, 202, 210, 212],
            promotionalLift: [0, 25, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [171, 191, 186, 176, 180, 178, 184, 190, 186, 194, 198, 204, 208, 202, 210, 212],
          },
        },
      },
      "Costco.com": {
        skus: {
          "CO24": {
            baselineForecast: [128, 124, 120, 132, 136, 133, 138, 142, 140, 146, 150, 154, 158, 155, 162, 166],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [128, 124, 120, 132, 136, 133, 138, 142, 140, 146, 150, 154, 158, 155, 162, 166],
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
            baselineForecast: [580, 565, 550, 600, 620, 608, 634, 656, 642, 672, 695, 715, 738, 724, 750, 772],
            promotionalLift: [0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [580, 565, 550, 660, 620, 608, 634, 656, 642, 672, 695, 715, 738, 724, 750, 772],
          },
          "CJ24": {
            baselineForecast: [477, 464, 451, 497, 515, 505, 527, 545, 532, 558, 578, 595, 615, 602, 625, 642],
            promotionalLift: [0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [477, 464, 451, 547, 515, 505, 527, 545, 532, 558, 578, 595, 615, 602, 625, 642],
          },
          "CB24": {
            baselineForecast: [282, 275, 267, 293, 303, 297, 310, 321, 313, 328, 339, 349, 361, 354, 367, 377],
            promotionalLift: [0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [282, 275, 267, 323, 303, 297, 310, 321, 313, 328, 339, 349, 361, 354, 367, 377],
          },
        },
      },
      "Target.com": {
        skus: {
          "CO24": {
            baselineForecast: [88, 86, 83, 93, 96, 93, 98, 103, 101, 106, 108, 113, 116, 113, 118, 121],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [88, 86, 83, 93, 96, 93, 98, 103, 101, 106, 108, 113, 116, 113, 118, 121],
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
            baselineForecast: [237, 229, 224, 247, 254, 250, 260, 270, 262, 277, 287, 297, 305, 300, 312, 320],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [237, 229, 224, 247, 254, 250, 260, 270, 262, 277, 287, 297, 305, 300, 312, 320],
          },
          "CJ24": {
            baselineForecast: [197, 189, 184, 204, 212, 207, 217, 225, 219, 229, 240, 247, 255, 250, 260, 267],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [197, 189, 184, 204, 212, 207, 217, 225, 219, 229, 240, 247, 255, 250, 260, 267],
          },
          "COP12": {
            baselineForecast: [116, 113, 111, 121, 126, 123, 128, 134, 131, 136, 141, 146, 151, 149, 154, 159],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [116, 113, 111, 121, 126, 123, 128, 134, 131, 136, 141, 146, 151, 149, 154, 159],
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
            baselineForecast: [113, 110, 108, 117, 120, 119, 123, 126, 125, 129, 132, 135, 138, 137, 139, 141],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [113, 110, 108, 117, 120, 119, 123, 126, 125, 129, 132, 135, 138, 137, 139, 141],
          },
          "CJ24": {
            baselineForecast: [97, 94, 92, 100, 102, 101, 104, 107, 105, 108, 111, 113, 116, 115, 117, 119],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [97, 94, 92, 100, 102, 101, 104, 107, 105, 108, 111, 113, 116, 115, 117, 119],
          },
        },
      },
    },
  },
}

const summaryMetrics = {
  demand: { value: "+2.0%", subtext: "97.1K vs 95.2K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$5.8K", subtext: "$243K vs $237K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.9 weeks", subtext: "5.1 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+1.8K", subtext: "97.1K vs 95.3K units", trend: "up" as const, type: "neutral" as const },
  rawUtilization: { value: "+5%", subtext: "78% vs 73%", trend: "up" as const, type: "neutral" as const },
  totalCost: { value: "+$860", subtext: "$71.0K vs $70.1K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+0.5%", subtext: "68.5% vs 68.0%", trend: "up" as const, type: "neutral" as const },
  skusAtRisk: { value: "+2", subtext: "4 vs 2 SKUs", trend: "up" as const, type: "warning" as const },
}

export const lwRetailAdjustedData = {
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
