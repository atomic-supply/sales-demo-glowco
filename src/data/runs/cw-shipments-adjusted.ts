// Current Week - Run 4: Shipments Adjusted (PACCCC)
// Planner has adjusted shipment plans, production still calculated
import { cwRetailPublishedData } from "./cw-retail-published"
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  coManProductionData, materialsPlanData,
} from "./unified-data"

// Kitting adjusted to smooth demand and account for capacity constraints
const kittingPlanData = [
  {
    sku: "CO24",
    initialBulkInventory: 7900,
    kittingDemand: [470, 702, 1224, 936, 1168, 1002, 1248, 930, 852, 936, 826, 684, 580, 578, 560, 550],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    kitCenters: [
      {
        name: "Apex Kitting",
        weeklyCapacity: Array(16).fill(1100),
        weeklyPlanned: [420, 520, 900, 680, 840, 720, 900, 680, 630, 680, 600, 490, 420, 420, 410, 400],
      },
      {
        name: "Central Kitting",
        weeklyCapacity: Array(16).fill(700),
        weeklyPlanned: [50, 182, 324, 256, 328, 282, 348, 250, 222, 256, 226, 194, 160, 158, 150, 150],
      },
    ],
  },
  {
    sku: "CJ24",
    initialBulkInventory: 6600,
    kittingDemand: [356, 530, 924, 710, 884, 756, 944, 702, 644, 708, 624, 516, 437, 437, 420, 410],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      {
        name: "Apex Kitting",
        weeklyCapacity: Array(16).fill(800),
        weeklyPlanned: [280, 360, 640, 490, 610, 520, 650, 484, 444, 488, 430, 356, 300, 300, 290, 280],
      },
      {
        name: "Summit Kitting",
        weeklyCapacity: Array(16).fill(500),
        weeklyPlanned: [76, 170, 284, 220, 274, 236, 294, 218, 200, 220, 194, 160, 137, 137, 130, 130],
      },
    ],
  },
  {
    sku: "CB24",
    initialBulkInventory: 4400,
    kittingDemand: [266, 396, 690, 530, 661, 566, 706, 525, 482, 530, 468, 386, 328, 326, 314, 307],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      {
        name: "Apex Kitting",
        weeklyCapacity: Array(16).fill(600),
        weeklyPlanned: [266, 396, 690, 530, 661, 566, 706, 525, 482, 530, 468, 386, 328, 326, 314, 307],
      },
    ],
  },
  {
    sku: "CTOTJ24",
    initialBulkInventory: 3300,
    kittingDemand: [228, 342, 596, 458, 570, 488, 610, 453, 416, 457, 403, 333, 283, 280, 270, 263],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      {
        name: "Central Kitting",
        weeklyCapacity: Array(16).fill(500),
        weeklyPlanned: [228, 342, 596, 458, 570, 488, 610, 453, 416, 457, 403, 333, 283, 280, 270, 263],
      },
    ],
  },
  {
    sku: "COP12",
    initialBulkInventory: 2560,
    kittingDemand: [189, 282, 492, 378, 472, 404, 504, 374, 344, 378, 334, 276, 234, 234, 226, 220],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      {
        name: "Summit Kitting",
        weeklyCapacity: Array(16).fill(400),
        weeklyPlanned: [189, 282, 492, 378, 472, 404, 504, 374, 344, 378, 334, 276, 234, 234, 226, 220],
      },
    ],
  },
]

// Allocation adjusted - planner shifted inventory to East Coast 3PL for holiday
const allocationPlanData = [
  {
    sku: "CO24",
    startingNetworkInventory: 5700,
    inboundFG: [760, 740, 810, 780, 750, 790, 820, 760, 740, 810, 780, 750, 790, 820, 760, 740],
    warehouses: [
      {
        name: "IDS Indianapolis B2B",
        allocationPlanned: [310, 300, 330, 316, 296, 324, 340, 316, 300, 330, 316, 296, 324, 340, 316, 300],
        shipmentDemand: [276, 284, 296, 288, 292, 304, 316, 276, 284, 296, 288, 292, 304, 316, 276, 284],
        startingInventory: 2040,
        targetWOS: 6.0,
      },
      {
        name: "Meridian Logistics",
        allocationPlanned: [220, 216, 240, 228, 216, 234, 248, 220, 216, 240, 228, 216, 234, 248, 220, 216],
        shipmentDemand: [200, 208, 216, 210, 208, 220, 228, 200, 208, 216, 210, 208, 220, 228, 200, 208],
        startingInventory: 1680,
        targetWOS: 6.0,
      },
      {
        name: "Greentop",
        allocationPlanned: [150, 156, 164, 156, 148, 160, 170, 150, 156, 164, 156, 148, 160, 170, 150, 156],
        shipmentDemand: [140, 146, 152, 148, 144, 152, 160, 140, 146, 152, 148, 144, 152, 160, 140, 146],
        startingInventory: 1120,
        targetWOS: 5.5,
      },
    ],
  },
  {
    sku: "CB24",
    startingNetworkInventory: 4320,
    inboundFG: [660, 650, 690, 676, 640, 680, 710, 660, 650, 690, 676, 640, 680, 710, 660, 650],
    warehouses: [
      {
        name: "IDS Indianapolis B2B",
        allocationPlanned: [264, 256, 280, 270, 250, 276, 290, 264, 256, 280, 270, 250, 276, 290, 264, 256],
        shipmentDemand: [240, 248, 260, 252, 256, 266, 276, 240, 248, 260, 252, 256, 266, 276, 240, 248],
        startingInventory: 1640,
        targetWOS: 5.5,
      },
      {
        name: "Meridian Logistics",
        allocationPlanned: [200, 194, 214, 204, 190, 210, 220, 200, 194, 214, 204, 190, 210, 220, 200, 194],
        shipmentDemand: [184, 190, 200, 194, 196, 206, 212, 184, 190, 200, 194, 196, 206, 212, 184, 190],
        startingInventory: 1320,
        targetWOS: 5.5,
      },
    ],
  },
  {
    sku: "CTOTJ24",
    startingNetworkInventory: 3120,
    inboundFG: [440, 430, 470, 450, 420, 460, 480, 440, 430, 470, 450, 420, 460, 480, 440, 430],
    warehouses: [
      {
        name: "Greentop",
        allocationPlanned: [176, 170, 188, 180, 166, 184, 194, 176, 170, 188, 180, 166, 184, 194, 176, 170],
        shipmentDemand: [158, 164, 172, 168, 170, 176, 182, 158, 164, 172, 168, 170, 176, 182, 158, 164],
        startingInventory: 1080,
        targetWOS: 5.0,
      },
      {
        name: "Meridian Logistics",
        allocationPlanned: [132, 128, 144, 136, 126, 140, 148, 132, 128, 144, 136, 126, 140, 148, 132, 128],
        shipmentDemand: [120, 126, 132, 128, 130, 136, 142, 120, 126, 132, 128, 130, 136, 142, 120, 126],
        startingInventory: 920,
        targetWOS: 5.0,
      },
    ],
  },
]

const summaryMetrics = {
  demand: { value: "+3.8%", subtext: "106.5K vs 102.6K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$7.6K", subtext: "$266K vs $259K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.5 weeks", subtext: "5.5 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+3.6K", subtext: "106.5K vs 102.9K units", trend: "up" as const, type: "ok" as const },
  rawUtilization: { value: "+7%", subtext: "84% vs 77%", trend: "up" as const, type: "ok" as const },
  totalCost: { value: "+$1.44K", subtext: "$73.4K vs $72.0K", trend: "up" as const, type: "warning" as const },
  grossMargin: { value: "+1.5%", subtext: "70.0% vs 68.5%", trend: "up" as const, type: "ok" as const },
  skusAtRisk: { value: "+1", subtext: "4 vs 3 SKUs", trend: "up" as const, type: "warning" as const },
}

export const cwShipmentsAdjustedData = {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
  retailDemandData: cwRetailPublishedData.retailDemandData,
  productionSKUData: cwRetailPublishedData.productionSKUData,
  coManProductionData,
  kittingPlanData, materialsPlanData, allocationPlanData,
  summaryMetrics,
}
