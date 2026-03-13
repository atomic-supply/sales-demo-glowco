export type AdjustmentStatus = "needs-review" | "approved"

export interface ShipmentAdjustment {
  id: string
  sku: string
  shipTo: string
  shipFrom: string
  timePeriod: string
  originalValue: number
  overrideValue: number
  overrideReason: string
  planner: string
  status: AdjustmentStatus
  createdAt: string
}

export type PlanContextData = {
  weeks: string[]
  startingInventory: number[]
  retailDemand: number[]
  arrivingInventory: number[]
  endingInventory: number[]
  targetWOS: number[]
  currentWOS: number[]
  wosStatus: string[]
  calculatedShipments: number[]
  overrides: (number | null)[]
  overrideReasons: string[]
  targetWeekIndex: number
}

export const LOCATION_OPTIONS = [
  { value: "velo.com - Pacific 3PL", label: "velo.com" },
  { value: "Amazon.com (US) - Pacific 3PL", label: "Amazon - Pacific 3PL" },
  { value: "Amazon.com (US) - Central 3PL", label: "Amazon - Central 3PL" },
  { value: "Target - Central 3PL", label: "Target - Central 3PL" },
  { value: "Walmart - Meridian Logistics", label: "Walmart - Central 3PL" },
  { value: "Whole Foods - East Coast 3PL", label: "Whole Foods - East Coast 3PL" },
]

export const PLANNER_OPTIONS = ["Alex", "Sam", "Jordan"]

export const generateSampleAdjustments = (): ShipmentAdjustment[] => {
  return [
    {
      id: "ADJ-001",
      sku: "CB24",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "12/15/25",
      originalValue: 185,
      overrideValue: 250,
      overrideReason: "Walmart promotion - stock up for Q1 demand",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:30",
    },
    {
      id: "ADJ-002",
      sku: "CB24",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "12/22/25",
      originalValue: 192,
      overrideValue: 280,
      overrideReason: "Walmart promotion - peak holiday volume, build buffer",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:32",
    },
    {
      id: "ADJ-003",
      sku: "CB24",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "12/29/25",
      originalValue: 178,
      overrideValue: 240,
      overrideReason: "Walmart promotion - end of year push, maintain coverage",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:33",
    },
    {
      id: "ADJ-004",
      sku: "CB24",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "01/26/26",
      originalValue: 190,
      overrideValue: 120,
      overrideReason: "Reduce Feb shipments - drawdown excess inventory from Q4 stock-up",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:35",
    },
    {
      id: "ADJ-005",
      sku: "COP12",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "12/15/25",
      originalValue: 130,
      overrideValue: 195,
      overrideReason: "Walmart promotion - stock up for Q1 demand",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:38",
    },
    {
      id: "ADJ-006",
      sku: "COP12",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "12/22/25",
      originalValue: 126,
      overrideValue: 210,
      overrideReason: "Walmart promotion - peak holiday volume, build buffer",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:39",
    },
    {
      id: "ADJ-007",
      sku: "COP12",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "01/26/26",
      originalValue: 135,
      overrideValue: 80,
      overrideReason: "Reduce Feb shipments - drawdown excess inventory from Q4 stock-up",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/12/25 09:40",
    },
    {
      id: "ADJ-008",
      sku: "CO24",
      shipTo: "Amazon.com (US) - Pacific 3PL",
      shipFrom: "Meridian Logistics",
      timePeriod: "12/22/25",
      originalValue: 245,
      overrideValue: 310,
      overrideReason: "Amazon holiday preparation - additional buffer stock requested",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/10/25 14:22",
    },
    {
      id: "ADJ-009",
      sku: "CJ24",
      shipTo: "Amazon.com (US) - Central 3PL",
      shipFrom: "Vertex B2B - Central",
      timePeriod: "01/05/26",
      originalValue: 158,
      overrideValue: 200,
      overrideReason: "Promotional push for new year campaign",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/15/25 10:00",
    },
    {
      id: "ADJ-010",
      sku: "CO24",
      shipTo: "velo.com - Pacific 3PL",
      shipFrom: "Vertex B2B - Central",
      timePeriod: "01/05/26",
      originalValue: 142,
      overrideValue: 175,
      overrideReason: "Market expansion - subscription growth",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/15/25 10:05",
    },
    {
      id: "ADJ-011",
      sku: "CTOTJ24",
      shipTo: "Target - Central 3PL",
      shipFrom: "Meridian Logistics",
      timePeriod: "01/12/26",
      originalValue: 168,
      overrideValue: 130,
      overrideReason: "Inventory rebalancing - excess stock at DC",
      planner: "Jordan",
      status: "needs-review",
      createdAt: "12/14/25 11:00",
    },
    {
      id: "ADJ-012",
      sku: "CO24",
      shipTo: "Whole Foods - East Coast 3PL",
      shipFrom: "Meridian Logistics",
      timePeriod: "01/12/26",
      originalValue: 114,
      overrideValue: 150,
      overrideReason: "Retailer requested increase - endcap promotion",
      planner: "Jordan",
      status: "approved",
      createdAt: "12/14/25 11:05",
    },
    {
      id: "ADJ-013",
      sku: "COP12",
      shipTo: "Walmart - Meridian Logistics",
      shipFrom: "Meridian Logistics",
      timePeriod: "01/19/26",
      originalValue: 132,
      overrideValue: 100,
      overrideReason: "Demand forecast correction",
      planner: "Jordan",
      status: "approved",
      createdAt: "12/12/25 13:05",
    },
  ]
}

export const getShipmentPlanData = (shipTo: string, sku: string, timePeriod: string): PlanContextData | null => {
  const weekDates = [
    "12/01/25", "12/08/25", "12/15/25", "12/22/25", "12/29/25",
    "01/05/26", "01/12/26", "01/19/26", "01/26/26", "02/02/26", "02/09/26",
  ]
  const targetWeekIndex = weekDates.indexOf(timePeriod)
  if (targetWeekIndex === -1) return null

  type SkuPlanRow = {
    startingInventory: number[]
    retailDemand: number[]
    arrivingInventory: number[]
    endingInventory: number[]
    targetWOS: number[]
    currentWOS: number[]
    wosStatus: string[]
    calculatedShipments: number[]
    overrides: (number | null)[]
    overrideReasons: string[]
  }

  const locationData: Record<string, Record<string, SkuPlanRow>> = {
    "Walmart - Meridian Logistics": {
      "CB24": {
        startingInventory: [820, 810, 850, 880, 860, 880, 870, 880, 885, 890, 895],
        retailDemand: [185, 192, 185, 192, 185, 192, 185, 185, 190, 185, 185],
        arrivingInventory: [175, 232, 215, 192, 210, 185, 195, 190, 190, 190, 185],
        endingInventory: [810, 850, 880, 880, 885, 873, 880, 885, 885, 895, 895],
        targetWOS: [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0],
        currentWOS: [5.8, 5.9, 6.2, 6.0, 6.2, 6.0, 6.2, 6.2, 6.2, 6.3, 6.3],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [175, 232, 215, 192, 210, 185, 195, 190, 190, 190, 185],
        overrides: [null, null, 250, 280, 240, null, null, null, 120, null, null],
        overrideReasons: ["", "", "Walmart promotion - stock up for Q1", "Walmart promotion - peak holiday volume", "Walmart promotion - end of year push", "", "", "", "Reduce Feb - drawdown excess inventory", "", ""],
      },
      "COP12": {
        startingInventory: [580, 570, 600, 620, 605, 620, 615, 620, 625, 630, 635],
        retailDemand: [130, 136, 130, 136, 130, 136, 130, 130, 135, 130, 130],
        arrivingInventory: [120, 166, 150, 121, 145, 131, 130, 135, 140, 135, 130],
        endingInventory: [570, 600, 620, 605, 620, 615, 615, 625, 630, 635, 635],
        targetWOS: [6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0],
        currentWOS: [5.7, 5.8, 6.1, 5.8, 6.1, 5.9, 6.0, 6.1, 6.2, 6.2, 6.2],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [120, 166, 150, 121, 145, 131, 130, 135, 140, 135, 130],
        overrides: [null, null, 195, 210, null, null, null, null, 80, null, null],
        overrideReasons: ["", "", "Walmart promotion - stock up for Q1", "Walmart promotion - peak holiday volume", "", "", "", "", "Reduce Feb - drawdown excess inventory", "", ""],
      },
    },
    "Amazon.com (US) - Pacific 3PL": {
      "CO24": {
        startingInventory: [520, 500, 530, 545, 530, 545, 540, 545, 548, 550, 555],
        retailDemand: [245, 250, 245, 250, 245, 250, 245, 245, 248, 245, 245],
        arrivingInventory: [225, 280, 260, 235, 260, 245, 250, 248, 250, 245, 240],
        endingInventory: [500, 530, 545, 530, 545, 540, 545, 548, 550, 550, 550],
        targetWOS: Array(11).fill(6.0),
        currentWOS: [5.4, 5.5, 5.8, 5.5, 5.8, 5.6, 5.8, 5.8, 5.8, 5.8, 5.8],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [225, 280, 260, 235, 260, 245, 250, 248, 250, 245, 240],
        overrides: [null, null, null, 310, null, null, null, null, null, null, null],
        overrideReasons: ["", "", "", "Amazon holiday prep - additional buffer stock", "", "", "", "", "", "", ""],
      },
    },
    "Amazon.com (US) - Central 3PL": {
      "CJ24": {
        startingInventory: [380, 365, 390, 400, 388, 400, 395, 400, 402, 405, 408],
        retailDemand: [158, 165, 158, 165, 158, 165, 158, 158, 160, 158, 158],
        arrivingInventory: [143, 190, 168, 153, 166, 160, 158, 160, 163, 158, 155],
        endingInventory: [365, 390, 400, 388, 396, 395, 395, 402, 405, 405, 405],
        targetWOS: Array(11).fill(6.0),
        currentWOS: [5.2, 5.3, 5.6, 5.3, 5.6, 5.4, 5.6, 5.6, 5.6, 5.6, 5.6],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [143, 190, 168, 153, 166, 160, 158, 160, 163, 158, 155],
        overrides: [null, null, null, null, 200, null, null, null, null, null, null],
        overrideReasons: ["", "", "", "", "Promotional push for new year campaign", "", "", "", "", "", ""],
      },
    },
    "velo.com - Pacific 3PL": {
      "CO24": {
        startingInventory: [290, 278, 295, 305, 295, 305, 300, 305, 308, 310, 312],
        retailDemand: [142, 148, 142, 148, 142, 148, 142, 142, 145, 142, 142],
        arrivingInventory: [130, 165, 152, 138, 152, 143, 147, 145, 147, 142, 140],
        endingInventory: [278, 295, 305, 295, 305, 300, 305, 308, 310, 310, 310],
        targetWOS: Array(11).fill(6.0),
        currentWOS: [4.8, 4.9, 5.2, 4.9, 5.2, 5.0, 5.2, 5.2, 5.2, 5.2, 5.2],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [130, 165, 152, 138, 152, 143, 147, 145, 147, 142, 140],
        overrides: [null, null, null, null, 175, null, null, null, null, null, null],
        overrideReasons: ["", "", "", "", "Subscription growth", "", "", "", "", "", ""],
      },
    },
    "Target - Central 3PL": {
      "CTOTJ24": {
        startingInventory: [340, 325, 345, 355, 345, 355, 350, 355, 358, 360, 362],
        retailDemand: [168, 172, 168, 172, 168, 172, 168, 168, 170, 168, 168],
        arrivingInventory: [153, 192, 178, 162, 178, 167, 173, 171, 170, 168, 165],
        endingInventory: [325, 345, 355, 345, 355, 350, 355, 358, 358, 360, 359],
        targetWOS: Array(11).fill(6.0),
        currentWOS: [4.6, 4.7, 5.0, 4.7, 5.0, 4.9, 5.0, 5.0, 5.0, 5.0, 5.0],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [153, 192, 178, 162, 178, 167, 173, 171, 170, 168, 165],
        overrides: [null, null, 130, null, null, null, null, null, null, null, null],
        overrideReasons: ["", "", "Inventory rebalancing - excess stock at DC", "", "", "", "", "", "", "", ""],
      },
    },
    "Whole Foods - East Coast 3PL": {
      "CO24": {
        startingInventory: [260, 250, 265, 275, 265, 275, 270, 275, 278, 280, 282],
        retailDemand: [114, 120, 114, 120, 114, 120, 114, 114, 116, 114, 114],
        arrivingInventory: [104, 135, 124, 110, 124, 115, 119, 117, 118, 114, 112],
        endingInventory: [250, 265, 275, 265, 275, 270, 275, 278, 280, 280, 280],
        targetWOS: Array(11).fill(6.0),
        currentWOS: [4.4, 4.5, 4.8, 4.5, 4.8, 4.6, 4.8, 4.8, 4.8, 4.8, 4.8],
        wosStatus: Array(11).fill("Medium"),
        calculatedShipments: [104, 135, 124, 110, 124, 115, 119, 117, 118, 114, 112],
        overrides: [null, null, 150, null, null, null, null, null, null, null, null],
        overrideReasons: ["", "", "Retailer requested increase - endcap promotion", "", "", "", "", "", "", "", ""],
      },
    },
  }

  const skuData = locationData[shipTo]?.[sku]
  if (!skuData) return null

  const startIndex = Math.max(0, targetWeekIndex - 2)
  const endIndex = Math.min(weekDates.length, targetWeekIndex + 11)

  return {
    weeks: weekDates.slice(startIndex, endIndex),
    startingInventory: skuData.startingInventory.slice(startIndex, endIndex),
    retailDemand: skuData.retailDemand.slice(startIndex, endIndex),
    arrivingInventory: skuData.arrivingInventory.slice(startIndex, endIndex),
    endingInventory: skuData.endingInventory.slice(startIndex, endIndex),
    targetWOS: skuData.targetWOS.slice(startIndex, endIndex),
    currentWOS: skuData.currentWOS.slice(startIndex, endIndex),
    wosStatus: skuData.wosStatus.slice(startIndex, endIndex),
    calculatedShipments: skuData.calculatedShipments.slice(startIndex, endIndex),
    overrides: skuData.overrides.slice(startIndex, endIndex),
    overrideReasons: skuData.overrideReasons.slice(startIndex, endIndex),
    targetWeekIndex: targetWeekIndex - startIndex,
  }
}
