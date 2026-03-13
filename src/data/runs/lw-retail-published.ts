// Last Week - Retail Published (PCCCCC)
// Retail forecast locked, production recalculated to meet published demand
import {
  skus, coManSites, kitCenters, shipToLocations, suppliers, materials, coManPartners, COMAN_SITES,
} from "./unified-data"
import { retailDemandData } from "./lw-retail-adjusted"
import { coManProductionData, kittingPlanData, materialsPlanData, allocationPlanData } from "./lw-initial"

export const productionSKUData = {
  "CO24": {
    initialStartingInventory: 6400,
    productionPlanned: [462, 451, 441, 479, 487, 481, 500, 515, 506, 525, 538, 550, 563, 557, 567, 578],
    kittingDemand: [396, 590, 1029, 788, 982, 842, 1050, 781, 716, 788, 694, 574, 486, 486, 504, 515],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CJ24": {
    initialStartingInventory: 4800,
    productionPlanned: [357, 397, 368, 605, 90, 274, 224, 186, 307, 454, 406, 269, 374, 338, 347, 357],
    kittingDemand: [298, 444, 775, 596, 741, 635, 792, 590, 541, 593, 524, 434, 368, 368, 378, 389],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CB24": {
    initialStartingInventory: 3700,
    productionPlanned: [278, 310, 288, 472, 71, 214, 174, 145, 238, 354, 317, 210, 292, 265, 273, 282],
    kittingDemand: [232, 347, 604, 464, 579, 496, 617, 460, 422, 463, 409, 338, 287, 286, 294, 302],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CTOTJ24": {
    initialStartingInventory: 3160,
    productionPlanned: [238, 265, 246, 403, 61, 183, 149, 124, 204, 302, 271, 180, 249, 227, 233, 242],
    kittingDemand: [198, 296, 518, 397, 496, 424, 529, 394, 361, 397, 350, 290, 246, 245, 252, 258],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "COP12": {
    initialStartingInventory: 2620,
    productionPlanned: [197, 219, 204, 334, 50, 151, 124, 103, 169, 250, 225, 149, 207, 188, 193, 200],
    kittingDemand: [165, 246, 428, 330, 411, 352, 439, 327, 300, 330, 291, 242, 205, 204, 210, 216],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

const summaryMetrics = {
  demand: { value: "+2.5%", subtext: "97.5K vs 95.1K units", trend: "up" as const, type: "neutral" as const },
  revenue: { value: "+$6.1K", subtext: "$244K vs $238K", trend: "up" as const, type: "ok" as const },
  networkInventory: { value: "-0.8 weeks", subtext: "5.2 vs 6.0 weeks", trend: "down" as const, type: "warning" as const },
  productionPlan: { value: "+2.3K", subtext: "97.5K vs 95.2K units", trend: "up" as const, type: "neutral" as const },
  rawUtilization: { value: "+6%", subtext: "79% vs 73%", trend: "up" as const, type: "neutral" as const },
  totalCost: { value: "+$880", subtext: "$71.1K vs $70.2K", trend: "up" as const, type: "neutral" as const },
  grossMargin: { value: "+0.4%", subtext: "68.4% vs 68.0%", trend: "up" as const, type: "neutral" as const },
  skusAtRisk: { value: "+2", subtext: "4 vs 2 SKUs", trend: "up" as const, type: "warning" as const },
}

export const lwRetailPublishedData = {
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
