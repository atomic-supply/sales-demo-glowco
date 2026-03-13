// All TypeScript interfaces and run definitions for the Velo Foods planning app

// Types for run metadata
export interface RunMetadata {
  id: string
  weekDate: string
  planStatus: string // RSPKMA status code
  tag: string
  runTime: string
  isCurrent: boolean
  dataSetId: string
  isPlanOfRecord?: boolean
}

// Types for planning data
export interface RetailDemandEntry {
  channels: Record<
    string,
    {
      skus: Record<
        string,
        {
          baselineForecast: number[]
          promotionalLift: number[]
          adjustedForecast: number[]
        }
      >
    }
  >
}

export interface ProductionSKUEntry {
  initialStartingInventory: number
  productionPlanned: number[]
  kittingDemand: number[]
  targetWOS: number[]
}

export interface CoManProductionEntry {
  capacity: number[]
  planned: number[]
  overrides: (number | null)[]
}

export interface KittingPlanEntry {
  sku: string
  initialBulkInventory: number
  kittingDemand: number[]
  targetWOS: number[]
  kitCenters: {
    name: string
    weeklyCapacity: number[]
    weeklyPlanned: number[]
  }[]
}

export interface MaterialsPlanEntry {
  material: string
  canonicalUnit: string
  coManConsumption: {
    coMan: string
    materialRequirement: number[]
  }[]
  suppliers: {
    name: string
    coMansServed: string[]
    materialRequirement: number[]
    yieldFactor: number
  }[]
  onHandInventory: number[]
  inboundMaterial: number[]
  plannedSupply: number[]
}

export interface AllocationPlanEntry {
  sku: string
  startingNetworkInventory: number
  inboundFG: number[]
  warehouses: {
    name: string
    allocationPlanned: number[]
    shipmentDemand: number[]
    startingInventory: number
    targetWOS: number
  }[]
}

export interface SKU {
  id: string
  code: string
  name: string
  flavor: string
  format: string
  productCategory: string
  planner: string
  casePack: number
  palletTi: number
  palletHi: number
}

export interface CoManSite {
  id: string
  name: string
  code: string
  region: string
  address: string
  capacityPerWeek: number
  capabilities: string[]
}

export interface KitCenter {
  id: string
  name: string
  code: string
  region: string
  address: string
  capacityPerWeek: number
}

export interface ShipToLocation {
  id: string
  name: string
  code: string
  customer: string
  channel: string
  region: string
  transitTimeDays: number
}

export interface Supplier {
  id: string
  name: string
  code: string
  materialCategories: string[]
  leadTimeDays: number
  minOrderQty: number
  orderMultiple: number
}

export interface Material {
  id: string
  name: string
  code: string
  category: string
  supplierUnit: string
  yieldPerThousandSticks: number
  suppliers: string[]
}

export interface SummaryMetrics {
  demand: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  revenue: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  networkInventory: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  productionPlan: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  rawUtilization: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  totalCost: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  grossMargin: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
  skusAtRisk: { value: string; subtext: string; trend: "up" | "down" | "flat"; type: "ok" | "warning" | "critical" | "neutral" }
}

export interface RunData {
  // Master data
  skus: SKU[]
  coManSites: CoManSite[]
  kitCenters: KitCenter[]
  shipToLocations: ShipToLocation[]
  suppliers: Supplier[]
  materials: Material[]
  coManPartners: string[]
  COMAN_SITES: string[]

  // Planning data
  retailDemandData: Record<string, RetailDemandEntry>
  productionSKUData: Record<string, ProductionSKUEntry>
  coManProductionData: Record<string, Record<string, CoManProductionEntry>>
  kittingPlanData: KittingPlanEntry[]
  materialsPlanData: MaterialsPlanEntry[]
  allocationPlanData: AllocationPlanEntry[]

  // Reporting data
  summaryMetrics: SummaryMetrics
}

// All available runs - 14 total (6 current week, 8 last week)
export const allRuns: RunMetadata[] = [
  // Current Week - 2025 12/8 (6 runs showing in-progress RSPKMA workflow)
  {
    id: "cw-run-006",
    weekDate: "2025 12/8",
    planStatus: "PPACCC",
    tag: "Production Adjusted",
    runTime: "12/09/25 09:03",
    isCurrent: true,
    dataSetId: "cw-production-adjusted",
  },
  {
    id: "cw-run-005",
    weekDate: "2025 12/8",
    planStatus: "PPCCCC",
    tag: "Shipments Published",
    runTime: "12/08/25 18:12",
    isCurrent: false,
    dataSetId: "cw-shipments-published",
  },
  {
    id: "cw-run-004",
    weekDate: "2025 12/8",
    planStatus: "PACCCC",
    tag: "Shipments Adjusted",
    runTime: "12/08/25 14:30",
    isCurrent: false,
    dataSetId: "cw-shipments-adjusted",
  },
  {
    id: "cw-run-003",
    weekDate: "2025 12/8",
    planStatus: "PCCCCC",
    tag: "Retail Published",
    runTime: "12/08/25 10:00",
    isCurrent: false,
    dataSetId: "cw-retail-published",
  },
  {
    id: "cw-run-002",
    weekDate: "2025 12/8",
    planStatus: "ACCCCC",
    tag: "Retail Adjusted",
    runTime: "12/08/25 08:00",
    isCurrent: false,
    dataSetId: "cw-retail-adjusted",
  },
  {
    id: "cw-run-001",
    weekDate: "2025 12/8",
    planStatus: "CCCCCC",
    tag: "Initial Weekly Run",
    runTime: "12/08/25 06:00",
    isCurrent: false,
    dataSetId: "cw-initial",
  },
  // Last Week - 2025 12/1 (8 runs showing completed RSPKMA workflow)
  {
    id: "lw-run-008",
    weekDate: "2025 12/1",
    planStatus: "PPPPPP",
    tag: "All Published - Week Complete",
    runTime: "12/01/25 18:00",
    isCurrent: false,
    dataSetId: "lw-complete",
    isPlanOfRecord: true,
  },
  {
    id: "lw-run-007",
    weekDate: "2025 12/1",
    planStatus: "PPPCCC",
    tag: "Production Published",
    runTime: "12/01/25 13:15",
    isCurrent: false,
    dataSetId: "lw-production-published",
  },
  {
    id: "lw-run-006",
    weekDate: "2025 12/1",
    planStatus: "PPACCC",
    tag: "Production Adjusted",
    runTime: "12/01/25 11:00",
    isCurrent: false,
    dataSetId: "lw-production-adjusted",
  },
  {
    id: "lw-run-005",
    weekDate: "2025 12/1",
    planStatus: "PPCCCC",
    tag: "Shipments Published",
    runTime: "12/01/25 10:00",
    isCurrent: false,
    dataSetId: "lw-shipments-published",
  },
  {
    id: "lw-run-004",
    weekDate: "2025 12/1",
    planStatus: "PACCCC",
    tag: "Shipments Adjusted",
    runTime: "12/01/25 08:30",
    isCurrent: false,
    dataSetId: "lw-shipments-adjusted",
  },
  {
    id: "lw-run-003",
    weekDate: "2025 12/1",
    planStatus: "PCCCCC",
    tag: "Retail Published",
    runTime: "12/01/25 07:30",
    isCurrent: false,
    dataSetId: "lw-retail-published",
  },
  {
    id: "lw-run-002",
    weekDate: "2025 12/1",
    planStatus: "ACCCCC",
    tag: "Retail Adjusted",
    runTime: "12/01/25 06:30",
    isCurrent: false,
    dataSetId: "lw-retail-adjusted",
  },
  {
    id: "lw-run-001",
    weekDate: "2025 12/1",
    planStatus: "CCCCCC",
    tag: "Initial Weekly Run",
    runTime: "12/01/25 06:00",
    isCurrent: false,
    dataSetId: "lw-initial",
  },
]
