// Last Week - Initial Weekly Run (CCCCCC)
// System-calculated baseline - no adjustments, no promotional lifts
import {
  skus,
  coManSites,
  kitCenters,
  shipToLocations,
  suppliers,
  materials,
  coManPartners,
  COMAN_SITES,
} from "./unified-data"

// Starting inventories for last week (plant-based bar brand scale)
const LW_STARTING_INV = {
  "CO24": 6400,
  "CJ24": 4800,
  "CB24": 3700,
  "CTOTJ24": 3160,
  "COP12": 2620,
}

// Retail demand - system forecast (no adjustments yet)
export const retailDemandData = {
  Costco: {
    channels: {
      "Costco Stores": {
        skus: {
          "CO24": {
            baselineForecast: [380, 370, 360, 394, 405, 396, 412, 425, 416, 436, 449, 461, 474, 465, 482, 494],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [380, 370, 360, 394, 405, 396, 412, 425, 416, 436, 449, 461, 474, 465, 482, 494],
          },
          "CJ24": {
            baselineForecast: [324, 316, 310, 334, 342, 338, 346, 356, 352, 360, 368, 378, 386, 381, 392, 398],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [324, 316, 310, 334, 342, 338, 346, 356, 352, 360, 368, 378, 386, 381, 392, 398],
          },
          "CB24": {
            baselineForecast: [171, 166, 162, 176, 180, 178, 184, 190, 186, 194, 198, 204, 208, 202, 210, 212],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [171, 166, 162, 176, 180, 178, 184, 190, 186, 194, 198, 204, 208, 202, 210, 212],
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
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [580, 565, 550, 600, 620, 608, 634, 656, 642, 672, 695, 715, 738, 724, 750, 772],
          },
          "CJ24": {
            baselineForecast: [477, 464, 451, 497, 515, 505, 527, 545, 532, 558, 578, 595, 615, 602, 625, 642],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [477, 464, 451, 497, 515, 505, 527, 545, 532, 558, 578, 595, 615, 602, 625, 642],
          },
          "CB24": {
            baselineForecast: [282, 275, 267, 293, 303, 297, 310, 321, 313, 328, 339, 349, 361, 354, 367, 377],
            promotionalLift: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            adjustedForecast: [282, 275, 267, 293, 303, 297, 310, 321, 313, 328, 339, 349, 361, 354, 367, 377],
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

export const productionSKUData = {
  "CO24": {
    initialStartingInventory: LW_STARTING_INV["CO24"],
    productionPlanned: [440, 430, 420, 456, 464, 458, 476, 490, 482, 500, 512, 524, 536, 530, 540, 550],
    kittingDemand: [377, 562, 980, 750, 935, 802, 1000, 744, 682, 750, 661, 547, 463, 463, 480, 490],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CJ24": {
    initialStartingInventory: LW_STARTING_INV["CJ24"],
    productionPlanned: [340, 378, 351, 576, 86, 261, 213, 177, 292, 432, 387, 256, 356, 322, 330, 340],
    kittingDemand: [284, 423, 738, 567, 706, 605, 754, 562, 515, 565, 499, 413, 350, 350, 360, 370],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CB24": {
    initialStartingInventory: LW_STARTING_INV["CB24"],
    productionPlanned: [265, 295, 274, 449, 68, 204, 166, 138, 227, 337, 302, 200, 278, 252, 260, 268],
    kittingDemand: [221, 330, 575, 442, 551, 472, 588, 438, 402, 441, 389, 322, 273, 272, 280, 288],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CTOTJ24": {
    initialStartingInventory: LW_STARTING_INV["CTOTJ24"],
    productionPlanned: [227, 252, 234, 384, 58, 174, 142, 118, 194, 288, 258, 171, 237, 216, 222, 230],
    kittingDemand: [189, 282, 493, 378, 472, 404, 504, 375, 344, 378, 333, 276, 234, 233, 240, 246],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "COP12": {
    initialStartingInventory: LW_STARTING_INV["COP12"],
    productionPlanned: [188, 209, 194, 318, 48, 144, 118, 98, 161, 238, 214, 142, 197, 179, 184, 190],
    kittingDemand: [157, 234, 408, 314, 391, 335, 418, 311, 286, 314, 277, 230, 195, 194, 200, 206],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

export const coManProductionData = {
  "Apex Manufacturing": {
    "CO24": {
      capacity: [540, 580, 560, 810, 270, 450, 360, 324, 504, 630, 576, 450, 540, 504, 520, 540],
      planned: [264, 258, 252, 274, 278, 275, 286, 294, 289, 300, 307, 314, 322, 318, 324, 330],
      overrides: Array(16).fill(null),
    },
    "CJ24": {
      capacity: [450, 486, 468, 684, 216, 378, 306, 270, 432, 540, 486, 378, 450, 414, 430, 450],
      planned: [204, 227, 211, 346, 52, 157, 128, 106, 175, 259, 232, 154, 214, 193, 198, 204],
      overrides: Array(16).fill(null),
    },
  },
  "Pinnacle Foods": {
    "CB24": {
      capacity: [324, 360, 342, 504, 162, 270, 216, 198, 306, 378, 342, 270, 324, 306, 315, 324],
      planned: [159, 177, 164, 270, 41, 122, 100, 83, 136, 202, 181, 120, 167, 151, 156, 161],
      overrides: Array(16).fill(null),
    },
    "CTOTJ24": {
      capacity: [270, 306, 288, 432, 135, 234, 189, 171, 270, 333, 297, 234, 270, 252, 261, 270],
      planned: [136, 151, 140, 230, 35, 104, 85, 71, 116, 173, 155, 103, 142, 130, 133, 138],
      overrides: Array(16).fill(null),
    },
  },
  "Cascade Nutrition": {
    "COP12": {
      capacity: [216, 252, 234, 324, 108, 180, 144, 126, 198, 252, 234, 180, 216, 198, 207, 216],
      planned: [113, 125, 116, 191, 29, 86, 71, 59, 97, 143, 128, 85, 118, 107, 110, 114],
      overrides: Array(16).fill(null),
    },
  },
}

export const kittingPlanData = [
  {
    sku: "CO24",
    initialBulkInventory: 6300,
    kittingDemand: [377, 562, 980, 750, 935, 802, 1000, 744, 682, 750, 661, 547, 463, 463, 480, 490],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    kitCenters: [
      { name: "Apex Kitting", weeklyCapacity: Array(16).fill(810), weeklyPlanned: [264, 394, 686, 525, 655, 561, 700, 521, 477, 525, 463, 383, 324, 324, 336, 343] },
      { name: "Central Kitting", weeklyCapacity: Array(16).fill(540), weeklyPlanned: [113, 168, 294, 225, 280, 241, 300, 223, 205, 225, 198, 164, 139, 139, 144, 147] },
    ],
  },
  {
    sku: "CJ24",
    initialBulkInventory: 5040,
    kittingDemand: [284, 423, 738, 567, 706, 605, 754, 562, 515, 565, 499, 413, 350, 350, 360, 370],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      { name: "Apex Kitting", weeklyCapacity: Array(16).fill(630), weeklyPlanned: [199, 296, 517, 397, 494, 424, 528, 393, 361, 396, 349, 289, 245, 245, 252, 259] },
      { name: "Summit Kitting", weeklyCapacity: Array(16).fill(360), weeklyPlanned: [85, 127, 221, 170, 212, 181, 226, 169, 154, 169, 150, 124, 105, 105, 108, 111] },
    ],
  },
  {
    sku: "CB24",
    initialBulkInventory: 3960,
    kittingDemand: [221, 330, 575, 442, 551, 472, 588, 438, 402, 441, 389, 322, 273, 272, 280, 288],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      { name: "Central Kitting", weeklyCapacity: Array(16).fill(450), weeklyPlanned: [155, 231, 403, 309, 386, 330, 412, 307, 281, 309, 272, 225, 191, 190, 196, 202] },
      { name: "Summit Kitting", weeklyCapacity: Array(16).fill(270), weeklyPlanned: [66, 99, 172, 133, 165, 142, 176, 131, 121, 132, 117, 97, 82, 82, 84, 86] },
    ],
  },
]

export const materialsPlanData = [
  {
    material: "Organic Oat Base",
    canonicalUnit: "liters",
    coManConsumption: [
      { coMan: "Apex Manufacturing", materialRequirement: [936, 900, 972, 954, 918, 936, 990, 954, 900, 954, 972, 936, 918, 954, 936, 972] },
      { coMan: "Pinnacle Foods", materialRequirement: [864, 828, 900, 882, 846, 864, 918, 882, 828, 882, 900, 864, 846, 882, 864, 900] },
      { coMan: "Cascade Nutrition", materialRequirement: [630, 612, 666, 648, 630, 630, 684, 648, 612, 648, 666, 630, 630, 648, 630, 666] },
    ],
    suppliers: [
      { name: "Harvest Grain Co", coMansServed: ["Apex Manufacturing", "Pinnacle Foods"], materialRequirement: [1800, 1728, 1872, 1836, 1764, 1800, 1908, 1836, 1728, 1836, 1872, 1800, 1764, 1836, 1800, 1872], yieldFactor: 0.98 },
      { name: "Pure Blends Inc", coMansServed: ["Cascade Nutrition"], materialRequirement: [630, 612, 666, 648, 630, 630, 684, 648, 612, 648, 666, 630, 630, 648, 630, 666], yieldFactor: 0.97 },
    ],
    onHandInventory: [3240, 3150, 3060, 3024, 2970, 2880, 2844, 2790, 2736, 2700, 2664, 2610, 2574, 2520, 2484, 2430],
    inboundMaterial: [1710, 1656, 1764, 1728, 1692, 1710, 1800, 1746, 1674, 1728, 1764, 1710, 1692, 1728, 1710, 1746],
    plannedSupply: [2700, 2610, 2790, 2736, 2664, 2700, 2844, 2772, 2628, 2736, 2790, 2700, 2664, 2736, 2700, 2772],
  },
  {
    material: "Plant Protein Blend",
    canonicalUnit: "kg",
    coManConsumption: [
      { coMan: "Apex Manufacturing", materialRequirement: [504, 486, 540, 522, 504, 504, 558, 522, 486, 522, 540, 504, 504, 522, 504, 540] },
      { coMan: "Pinnacle Foods", materialRequirement: [432, 414, 450, 432, 414, 432, 450, 450, 414, 432, 450, 432, 414, 432, 432, 432] },
    ],
    suppliers: [
      { name: "Harvest Grain Co", coMansServed: ["Apex Manufacturing", "Pinnacle Foods"], materialRequirement: [936, 900, 990, 954, 918, 936, 1008, 972, 900, 954, 990, 936, 918, 954, 936, 972], yieldFactor: 0.96 },
    ],
    onHandInventory: [1224, 1170, 1116, 1080, 1044, 990, 936, 900, 864, 810, 756, 720, 684, 630, 576, 540],
    inboundMaterial: [756, 720, 792, 774, 738, 756, 810, 774, 720, 774, 792, 756, 738, 774, 756, 774],
    plannedSupply: [990, 954, 1044, 1008, 972, 990, 1080, 1026, 954, 1008, 1044, 990, 972, 1008, 990, 1026],
  },
]

export const allocationPlanData = [
  {
    sku: "CO24",
    startingNetworkInventory: 4410,
    inboundFG: [576, 558, 540, 529, 518, 508, 497, 487, 477, 467, 457, 447, 437, 427, 417, 407],
    warehouses: [
      { name: "IDS Indianapolis B2B", allocationPlanned: [225, 217, 210, 206, 202, 198, 194, 190, 186, 182, 178, 174, 170, 166, 162, 158], shipmentDemand: [207, 212, 219, 214, 218, 224, 230, 207, 212, 219, 214, 218, 224, 230, 207, 212], startingInventory: 1530, targetWOS: 6.0 },
      { name: "Meridian Logistics", allocationPlanned: [171, 165, 160, 157, 154, 151, 148, 145, 142, 139, 136, 133, 130, 127, 124, 121], shipmentDemand: [158, 164, 169, 162, 165, 173, 178, 158, 164, 169, 162, 165, 173, 178, 158, 164], startingInventory: 1296, targetWOS: 6.0 },
      { name: "Greentop", allocationPlanned: [117, 122, 126, 120, 115, 124, 130, 117, 122, 126, 120, 115, 124, 130, 117, 122], shipmentDemand: [108, 112, 117, 113, 110, 115, 120, 108, 112, 117, 113, 110, 115, 120, 108, 112], startingInventory: 864, targetWOS: 5.5 },
    ],
  },
  {
    sku: "CB24",
    startingNetworkInventory: 3330,
    inboundFG: [504, 495, 486, 477, 468, 459, 450, 441, 432, 423, 414, 405, 396, 387, 378, 369],
    warehouses: [
      { name: "IDS Indianapolis B2B", allocationPlanned: [198, 189, 207, 198, 184, 202, 212, 198, 189, 207, 198, 184, 202, 212, 198, 189], shipmentDemand: [180, 185, 193, 187, 191, 196, 202, 180, 185, 193, 187, 191, 196, 202, 180, 185], startingInventory: 1224, targetWOS: 5.5 },
      { name: "Meridian Logistics", allocationPlanned: [153, 148, 162, 155, 144, 158, 166, 153, 148, 162, 155, 144, 158, 166, 153, 148], shipmentDemand: [140, 144, 149, 146, 148, 153, 157, 140, 144, 149, 146, 148, 153, 157, 140, 144], startingInventory: 990, targetWOS: 5.5 },
    ],
  },
]

const summaryMetrics = {
  demand: { value: "+1.8%", subtext: "95.2K vs 93.5K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$5.6K", subtext: "$238K vs $232K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-1.0 weeks", subtext: "5.0 vs 6.0 weeks", trend: "down" as const, type: "critical" as const },
  productionPlan: { value: "+1.6K", subtext: "95.2K vs 93.6K units", trend: "up" as const, type: "neutral" as const },
  rawUtilization: { value: "+5%", subtext: "78% vs 73%", trend: "up" as const, type: "neutral" as const },
  totalCost: { value: "+$840", subtext: "$70.8K vs $70.0K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+0.5%", subtext: "68.5% vs 68.0%", trend: "up" as const, type: "neutral" as const },
  skusAtRisk: { value: "+2", subtext: "4 vs 2 SKUs", trend: "up" as const, type: "critical" as const },
}

export const lwInitialData = {
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
