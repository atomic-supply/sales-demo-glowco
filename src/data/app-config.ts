// ============================================================================
// CENTRALIZED APPLICATION CONFIGURATION — LMNT
// ============================================================================

export const terminology = {
  consumption: "Sales Forecast",
  consumptionPlan: "Sales Forecast (Consumption)",
  shipments: "Demand Plan",
  shipmentsPlan: "Demand Plan (Shipments)",
  shipmentsPivot: "Demand Pivot",
  shipmentsAdjustmentsReview: "Demand Adjustments Review",
  shipmentsConfiguration: "Safety Stock Configuration",

  modules: {
    retailers: "Sales Forecast",
    shipments: "Demand Plan",
    production: "Production",
    kitting: "Kitting",
    materials: "MRP",
    allocation: "Allocation",
  },

  plans: {
    consumption: "Consumption Forecast",
    shipments: "Shipments Plan",
    production: "Production Plan",
    kitting: "Kitting Plan",
    materials: "Materials Plan",
    allocation: "Allocation Plan",
  },
}

// ─── Module definitions for StageView ─────────────────────────────────────

export type ModuleId = "consumption" | "shipments" | "production" | "kitting" | "mrp" | "allocation"

export interface ModuleDefinition {
  id: ModuleId
  name: string
  shortName: string
  description: string
  unit: string
  color: string
}

export const MODULES: ModuleDefinition[] = [
  { id: "consumption", name: "Sales Forecast (Consumption)", shortName: "Sales Forecast", description: "Channel-level demand signal with override capability", unit: "Units", color: "#3B82F6" },
  { id: "shipments", name: "Demand Plan (Shipments)", shortName: "Demand Plan", description: "Shipment requirements by SKU and ship-to location", unit: "Units", color: "#8B5CF6" },
  { id: "production", name: "Production Planning", shortName: "Production", description: "Stick production by flavor across co-man sites", unit: "Sticks", color: "#F59E0B" },
  { id: "kitting", name: "Kitting", shortName: "Kitting", description: "WIP sticks to finished goods conversion", unit: "Units", color: "#10B981" },
  { id: "mrp", name: "MRP (Material Requirements)", shortName: "MRP", description: "BOM explosion and raw material procurement", unit: "Units", color: "#EF4444" },
  { id: "allocation", name: "Allocation", shortName: "Allocation", description: "Finished goods distribution across 3PL network", unit: "Units", color: "#06B6D4" },
]

export const getModule = (id: ModuleId): ModuleDefinition =>
  MODULES.find(m => m.id === id) ?? MODULES[0]
