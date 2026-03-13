export interface DemandMapping {
  id: string
  retailer: string
  shipToLocation: string
  percentSplit: number | null
  wosTarget: number | null
  planner: string
  leadTimeDays?: number
}

export const initialMappings: DemandMapping[] = [
  { id: "1", retailer: "velo.com", shipToLocation: "Vertex DTC - West", percentSplit: 100, wosTarget: 6, planner: "Alex", leadTimeDays: 0 },
  { id: "2", retailer: "Amazon.com (US)", shipToLocation: "Vertex B2B - Central", percentSplit: 100, wosTarget: 6, planner: "Sam", leadTimeDays: 3 },
  { id: "3", retailer: "Target", shipToLocation: "Meridian Logistics", percentSplit: 50, wosTarget: 4, planner: "Alex", leadTimeDays: 4 },
  { id: "4", retailer: "Target", shipToLocation: "Atlas Fulfillment", percentSplit: 50, wosTarget: 4, planner: "Alex", leadTimeDays: 4 },
  { id: "5", retailer: "Walmart", shipToLocation: "Meridian Logistics", percentSplit: null, wosTarget: 4, planner: "Sam", leadTimeDays: 4 },
  { id: "6", retailer: "Whole Foods", shipToLocation: "Atlas Fulfillment", percentSplit: null, wosTarget: 6, planner: "Alex", leadTimeDays: 5 },
  { id: "7", retailer: "Costco", shipToLocation: "Vertex B2B - Central", percentSplit: null, wosTarget: 6, planner: "Sam", leadTimeDays: 7 },
  { id: "8", retailer: "Amazon (Canada)", shipToLocation: "Atlas Fulfillment", percentSplit: 100, wosTarget: 6, planner: "Sam", leadTimeDays: 5 },
  { id: "9", retailer: "Sprouts", shipToLocation: "Meridian Logistics", percentSplit: null, wosTarget: 4, planner: "Alex", leadTimeDays: 5 },
]

export const availableRetailers = [
  "velo.com", "Amazon.com (US)", "Amazon (Canada)", "Target", "Walmart",
  "Costco", "Whole Foods", "Sprouts", "Kroger", "HEB",
]

export const availableShipToLocations = ["Vertex DTC - West", "Vertex B2B - Central", "Meridian Logistics", "Atlas Fulfillment"]

export const availablePlanners = ["Alex", "Sam"]
