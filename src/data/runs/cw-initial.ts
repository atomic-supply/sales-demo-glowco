// Current Week - Run 1: Initial Weekly Run (CCCCCC)
// Fresh system calculation based on last week's ending positions
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
} from "./unified-data"
import { lwCompleteData } from "./lw-complete"

// Starting inventory rolls forward from last week's ending position
const initialProduction = {
  "CO24": {
    initialStartingInventory: 7700,
    productionPlanned: [530, 580, 540, 840, 130, 400, 320, 270, 440, 660, 600, 396, 550, 500, 460, 420],
    kittingDemand: [440, 650, 1130, 870, 1080, 930, 1160, 860, 790, 870, 766, 636, 540, 536, 500, 480],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CJ24": {
    initialStartingInventory: 5900,
    productionPlanned: [396, 440, 410, 670, 102, 304, 248, 206, 340, 504, 452, 298, 416, 376, 346, 316],
    kittingDemand: [330, 490, 856, 656, 818, 702, 874, 650, 596, 656, 578, 478, 406, 404, 376, 360],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CB24": {
    initialStartingInventory: 4430,
    productionPlanned: [294, 328, 304, 498, 75, 226, 184, 153, 252, 374, 336, 222, 308, 280, 258, 236],
    kittingDemand: [246, 366, 640, 492, 612, 524, 654, 486, 446, 490, 432, 358, 304, 302, 280, 268],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CTOTJ24": {
    initialStartingInventory: 3784,
    productionPlanned: [252, 280, 260, 426, 64, 194, 158, 131, 216, 320, 288, 190, 264, 240, 222, 204],
    kittingDemand: [210, 314, 548, 420, 524, 448, 560, 416, 382, 420, 370, 306, 260, 258, 242, 232],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "COP12": {
    initialStartingInventory: 3136,
    productionPlanned: [208, 232, 216, 352, 53, 160, 130, 108, 178, 264, 238, 157, 218, 198, 184, 168],
    kittingDemand: [174, 260, 454, 348, 434, 372, 464, 344, 316, 348, 306, 254, 216, 214, 200, 192],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

// Retail demand - system forecast (no adjustments yet)
const initialRetailDemand = {
  Costco: {
    channels: {
      "Costco Stores": {
        skus: {
          "CO24": {
            baselineForecast: [399, 388, 378, 414, 425, 416, 433, 446, 437, 458, 471, 484, 498, 488, 506, 519],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [399, 388, 378, 414, 425, 416, 433, 446, 437, 458, 471, 484, 498, 488, 506, 519],
          },
          "CJ24": {
            baselineForecast: [340, 332, 326, 351, 359, 355, 363, 374, 370, 378, 386, 397, 405, 400, 412, 418],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [340, 332, 326, 351, 359, 355, 363, 374, 370, 378, 386, 397, 405, 400, 412, 418],
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
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [249, 241, 235, 259, 267, 263, 273, 284, 275, 291, 301, 312, 320, 315, 328, 336],
          },
          "CJ24": {
            baselineForecast: [207, 198, 193, 214, 223, 217, 228, 236, 230, 241, 252, 259, 268, 263, 273, 280],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [207, 198, 193, 214, 223, 217, 228, 236, 230, 241, 252, 259, 268, 263, 273, 280],
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
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [119, 116, 113, 123, 126, 125, 129, 132, 131, 135, 139, 142, 145, 144, 146, 148],
          },
        },
      },
    },
  },
}

const summaryMetrics = {
  demand: { value: "+2.1%", subtext: "99.4K vs 97.4K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$5.6K", subtext: "$249K vs $243K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-1.2 weeks", subtext: "4.8 vs 6.0 weeks", trend: "down" as const, type: "critical" as const },
  productionPlan: { value: "+1.6K", subtext: "99.4K vs 97.8K units", trend: "up" as const, type: "neutral" as const },
  rawUtilization: { value: "+5%", subtext: "78% vs 73%", trend: "up" as const, type: "neutral" as const },
  totalCost: { value: "+$840", subtext: "$71.6K vs $70.8K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+0.5%", subtext: "68.5% vs 68.0%", trend: "up" as const, type: "neutral" as const },
  skusAtRisk: { value: "+5", subtext: "8 vs 3 SKUs", trend: "up" as const, type: "critical" as const },
}

// Reference lwCompleteData to suppress unused import warning
void lwCompleteData

export const cwInitialData = {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  retailDemandData: initialRetailDemand,
  productionSKUData: initialProduction,
  coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData,
  summaryMetrics,
}
