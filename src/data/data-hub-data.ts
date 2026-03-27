export type IngestionMethod = "API" | "Manual"
export type HealthStatus = "healthy" | "critical"
export type StaticDataType = "Mapping" | "Rules" | "Master Data" | "Config"

export interface DataIssue {
  id: string
  severity: "error"
  description: string
  affectedRecords?: number
  example?: string
}

export interface DataSource {
  id: string
  name: string
  description: string
  originalSource: string
  ingestionLocation: string
  method: IngestionMethod
  lastSync: string
  lastSyncDate: Date
  expectedSyncIntervalMinutes: number
  status: HealthStatus
  recordCount?: string
  issue?: string
  issues?: DataIssue[]
  hasNonBlockingErrors?: boolean
  modelBlocked?: boolean
  uploadedFileName?: string
  canRefresh?: boolean
}

export interface StaticDataSource {
  id: string
  name: string
  description: string
  originalSource: string
  ingestionLocation: string
  method: IngestionMethod
  lastUpdated: string
  lastUpdatedDate: Date
  type: StaticDataType
  recordCount: string
}

export interface DataSourceGroup { id: string; name: string; sources: DataSource[] }
export interface StaticDataGroup { id: string; name: string; sources: StaticDataSource[] }

export function calculateHealthStatus(source: Omit<DataSource, "status">): HealthStatus {
  const now = new Date()
  const timeSinceSync = (now.getTime() - source.lastSyncDate.getTime()) / (1000 * 60)
  const missedIntervals = Math.floor(timeSinceSync / source.expectedSyncIntervalMinutes)
  if (source.modelBlocked || missedIntervals > 1) return "critical"
  if (source.hasNonBlockingErrors || missedIntervals === 1 || (source.issues && source.issues.length > 0)) return "critical"
  return "healthy"
}

export function createDS(
  id: string, name: string, description: string, originalSource: string,
  ingestionLocation: string, method: IngestionMethod, lastSync: string,
  lastSyncDate: Date, expectedSyncIntervalMinutes: number, recordCount?: string,
  options?: { issue?: string; issues?: DataIssue[]; hasNonBlockingErrors?: boolean; modelBlocked?: boolean; uploadedFileName?: string; canRefresh?: boolean },
): DataSource {
  const src: Omit<DataSource, "status"> = { id, name, description, originalSource, ingestionLocation, method, lastSync, lastSyncDate, expectedSyncIntervalMinutes, recordCount, ...options }
  const status = calculateHealthStatus(src)
  const result: DataSource = { ...src, status }

  if (status !== "healthy" && (!result.issues || result.issues.length === 0)) {
    const timeSinceSync = (new Date().getTime() - lastSyncDate.getTime()) / (1000 * 60)
    const missedIntervals = Math.floor(timeSinceSync / expectedSyncIntervalMinutes)

    if (result.modelBlocked) {
      result.issue = result.issue ?? "Data quality issue blocking model execution"
      result.issues = [{ id: `${id}-auto`, severity: "error", description: `${name} has data quality issues that are blocking the planning model from running. Manual review required.`, affectedRecords: parseInt((recordCount ?? "0").replace(/,/g, "")) }]
    } else if (missedIntervals > 1) {
      result.issue = result.issue ?? `Sync overdue by ${missedIntervals} intervals`
      result.issues = [{ id: `${id}-auto`, severity: "error", description: `${name} has missed ${missedIntervals} expected sync intervals. Last sync: ${lastSync}.` }]
    } else if (missedIntervals === 1) {
      result.issue = result.issue ?? "Sync is 1 interval behind schedule"
      result.issues = [{ id: `${id}-auto`, severity: "error", description: `${name} is 1 sync interval behind expected schedule. Last sync: ${lastSync}.` }]
    } else if (result.hasNonBlockingErrors) {
      result.issue = result.issue ?? "Non-blocking data quality warnings detected"
      result.issues = [{ id: `${id}-auto`, severity: "error", description: `${name} has non-blocking data quality warnings that may affect downstream accuracy.` }]
    }
  }

  return result
}

export const now = new Date()
export const today = (h: number, m: number) => { const d = new Date(now); d.setHours(h, m, 0, 0); return d }

export const dynamicDataSourceGroups: DataSourceGroup[] = [
  {
    id: "fabric", name: "Fabric Tables",
    sources: [
      createDS("fabric-nexus-bridge-fr-netsuite", "nexus_bridge_first_receivers_to_netsuite_customers.csv", "First Receivers to Netsuite Customers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "1,240", { canRefresh: true }),
      createDS("fabric-nexus-bridge-fr-retailers", "nexus_bridge_first_receivers_to_retailers.csv", "First Receivers to Retailers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "890", { canRefresh: true }),
      createDS("fabric-nexus-dim-brokers", "nexus_dim_brokers.csv", "Brokers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "24", { canRefresh: true }),
      createDS("fabric-nexus-dim-dc", "nexus_dim_distribution_centers.csv", "Distribution Centers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "18", { canRefresh: true }),
      createDS("fabric-nexus-dim-fr", "nexus_dim_first_receivers.csv", "First Receivers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "156", { canRefresh: true }),
      createDS("fabric-nexus-dim-rc", "nexus_dim_reporting_customers.csv", "Reporting Customers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "312", { canRefresh: true }),
      createDS("fabric-nexus-dim-retailers", "nexus_dim_retailers.csv", "Retailers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "48", { canRefresh: true }),
      createDS("fabric-netsuite-dim-customers", "netsuite_dim_customers.csv", "Customers", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "2,450", { canRefresh: true }),
      createDS("fabric-netsuite-dim-items", "netsuite_dim_items.csv", "Items", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "892", { canRefresh: true, hasNonBlockingErrors: true, issue: "3 items missing category classification", issues: [
        { id: "fi-1", severity: "error", description: "SKU 'VZBAR-01' missing product category in netsuite_dim_items", affectedRecords: 1, example: "VZBAR-01 has no category mapped" },
        { id: "fi-2", severity: "error", description: "SKU 'SAMPLE-OAT' not found in forecast model", affectedRecords: 1, example: "SAMPLE-OAT appears in items but has no demand forecast" },
        { id: "fi-3", severity: "error", description: "SKU 'PROMO-HOLIDAY' missing location mapping in static data", affectedRecords: 1, example: "PROMO-HOLIDAY has no ship-from location in SKU mapping" },
      ]}),
      createDS("fabric-netsuite-dim-ship-from", "netsuite_dim_ship_from_locations.csv", "Ship From Locations", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "36", { canRefresh: true }),
      createDS("fabric-netsuite-dim-ship-to", "netsuite_dim_ship_to_locations.csv", "Ship To Locations", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "1,280", { canRefresh: true }),
      createDS("fabric-netsuite-dim-txn-status", "netsuite_dim_transaction_status.csv", "Transaction Statuses", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "18", { canRefresh: true }),
      createDS("fabric-netsuite-fact-deleted", "netsuite_fact_deleted_transaction_lines.csv", "Deleted Transaction Lines", "Fabric", "Fabric Data Pipeline", "API", "Today, 06:00 AM", today(6,0), 1440, "4,560", { canRefresh: true }),
    ],
  },
  {
    id: "netsuite", name: "Netsuite",
    sources: [
      createDS("ns-kitting-po", "Kitting POs", "Kitting purchase orders", "NetSuite", "Snowflake", "API", "Today, 08:15 AM", today(8,15), 1440, "1,860", { hasNonBlockingErrors: true, issue: "2 POs reference SKUs without forecast", issues: [
        { id: "kpo-1", severity: "error", description: "PO #KIT-4521 references SKU 'VZBAR-01' which has no demand forecast in the model", affectedRecords: 1, example: "KIT-4521: VZBAR-01 x 5,000 bars to SB Kitting" },
        { id: "kpo-2", severity: "error", description: "PO #KIT-4530 references location 'Summit-Test' not in SKU mapping static data", affectedRecords: 1, example: "KIT-4530: CB24 x 12,000 bars to Summit-Test" },
      ]}),
      createDS("ns-material-po", "Material POs", "Raw material purchase orders", "NetSuite", "Snowflake", "API", "Today, 08:15 AM", today(8,15), 1440, "3,240"),
      createDS("ns-transfer-po", "Transfer POs", "Inter-location transfer orders", "NetSuite", "Snowflake", "API", "Today, 08:15 AM", today(8,15), 1440, "2,120"),
    ],
  },
  {
    id: "distributor-inventory", name: "Distributor Inventory",
    sources: [
      createDS("inv-meridian", "Meridian Logistics Inventory", "Meridian distributor on-hand inventory", "Meridian", "Direct API", "API", "Today, 09:30 AM", today(9,30), 60, "34,560"),
      createDS("inv-amazon-fba", "Amazon FBA Inventory", "Amazon fulfillment center stock", "Amazon", "Snowflake", "API", "Today, 10:22 AM", today(10,22), 60, "45,670"),
      createDS("inv-alloy-dist", "Distributor & Retailer Inventory (All Others)", "All other distributor and retailer inventory via Alloy", "Alloy", "Alloy API", "API", "Today, 09:45 AM", today(9,45), 120, "128,900", { hasNonBlockingErrors: true, issue: "Costco inventory feed delayed by 4 hours", issues: [
        { id: "alloy-1", severity: "error", description: "Costco inventory data is stale - last refresh was 4 hours behind expected schedule", affectedRecords: 8400, example: "Costco DC inventory for CO24, CJ24, CB24 showing yesterday's counts" },
      ]}),
    ],
  },
  {
    id: "3pl-inventory", name: "3PL Inventory",
    sources: [
      createDS("inv-atlas", "Atlas Fulfillment Inventory", "Atlas 3PL warehouse inventory", "Atlas", "Direct API", "API", "Today, 09:55 AM", today(9,55), 60, "38,240"),
      createDS("inv-vertex", "Vertex 3PL Inventory", "Vertex 3PL warehouse inventory", "Vertex", "Direct API", "API", "Today, 10:05 AM", today(10,5), 60, "52,100"),
    ],
  },
  {
    id: "kitting-inventory", name: "Kitting Inventory",
    sources: [
      createDS("inv-summit-kit", "Midwest Kitting Inventory", "Summit kitting facility on-hand", "Summit Pack", "Manual Upload", "Manual", "Today, 07:15 AM", today(7,15), 1440, "12,340", { uploadedFileName: "Summit_Inventory_01_27_26.xlsx" }),
      createDS("inv-apex-kit", "SB Kitting Inventory", "Apex kitting facility on-hand", "San Bernardino Facility", "Manual Upload", "Manual", "Today, 07:30 AM", today(7,30), 1440, "18,560", { uploadedFileName: "Apex_Inventory_01_27_26.xlsx" }),
    ],
  },
  {
    id: "production-inventory", name: "Production Inventory",
    sources: [
      createDS("inv-apex-mfg", "San Bernardino Facility Inventory", "San Bernardino Facility production inventory", "San Bernardino Facility", "Manual Upload", "Manual", "Today, 11:40 AM", today(11,40), 10080, "8,900", { uploadedFileName: "Apex_Inventory_W04_2026.xlsx" }),
      createDS("inv-pinnacle", "Midwest Meat Co Inventory", "Midwest Meat Co production inventory", "Midwest Meat Co", "Manual Upload", "Manual", "Today, 10:15 AM", today(10,15), 10080, "14,200", { uploadedFileName: "Pinnacle_Inventory_01_27.xlsx" }),
      createDS("inv-cascade", "Pacific Jerky Works Inventory", "Pacific Jerky Works production inventory", "Pacific Jerky Works", "Manual Upload", "Manual", "Today, 09:30 AM", today(9,30), 10080, "6,780", { uploadedFileName: "Cascade_Inventory_2026W04.xlsx", hasNonBlockingErrors: true, issue: "1 SKU in inventory not found in SKU master", issues: [
        { id: "cn-1", severity: "error", description: "SKU 'OAT-RAW-BASE' in Cascade inventory report has no match in SKU master data", affectedRecords: 1, example: "OAT-RAW-BASE: 2,400 lbs on hand - not mapped to any finished good SKU" },
      ]}),
      createDS("inv-summit-mfg", "Summit Pack Inventory", "Summit Pack production inventory", "Summit Pack", "Manual Upload", "Manual", "Today, 08:45 AM", today(8,45), 10080, "5,340", { uploadedFileName: "Summit_Inventory_W04.xlsx" }),
    ],
  },
]

export const staticDataGroups: StaticDataGroup[] = [
  {
    id: "mappings", name: "Mapping Tables",
    sources: [
      { id: "channel-mapping", name: "Channel to 3PL Mapping", description: "Maps sales channels to 3PL fulfillment centers", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 01:15 PM", lastUpdatedDate: today(13,15), type: "Mapping", recordCount: "24" },
      { id: "retailer-dc-mapping", name: "Retailer to DC Mapping", description: "Maps retailers to distribution centers", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:45 PM", lastUpdatedDate: today(14,45), type: "Mapping", recordCount: "48" },
      { id: "product-line-map", name: "Product Line to SKU Map", description: "Maps product lines to individual SKUs", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:02 AM", lastUpdatedDate: today(2,2), type: "Mapping", recordCount: "36" },
      { id: "sku-location-map", name: "SKU Location Mapping", description: "Maps SKUs to ship-from and ship-to locations", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:15 AM", lastUpdatedDate: today(2,15), type: "Mapping", recordCount: "142" },
    ],
  },
  {
    id: "rules", name: "Business Rules & Config",
    sources: [
      { id: "allocation-rules", name: "Allocation Priority Rules", description: "Channel and retailer allocation priority rankings", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 12:00 PM", lastUpdatedDate: today(12,0), type: "Rules", recordCount: "42" },
      { id: "coman-routing", name: "Co-Man Production Routing", description: "SKU to co-manufacturer production assignments", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:10 AM", lastUpdatedDate: today(2,10), type: "Rules", recordCount: "18" },
      { id: "3pl-routing", name: "3PL Fulfillment Routing", description: "Retailer order routing to 3PL warehouses", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:12 AM", lastUpdatedDate: today(2,12), type: "Rules", recordCount: "36" },
      { id: "capacity-tables", name: "Co-Man Capacity Tables", description: "Weekly production capacity by co-manufacturer", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 03:13 AM", lastUpdatedDate: today(3,13), type: "Config", recordCount: "24" },
      { id: "product-boms", name: "Product BOMs", description: "Bill of materials for each finished good SKU", originalSource: "NetSuite", ingestionLocation: "Snowflake", method: "API", lastUpdated: "Today, 03:30 AM", lastUpdatedDate: today(3,30), type: "Config", recordCount: "156" },
    ],
  },
  {
    id: "master", name: "Master Data",
    sources: [
      { id: "sku-master", name: "SKU Master", description: "Master list of all active SKUs and attributes", originalSource: "NetSuite", ingestionLocation: "Snowflake", method: "API", lastUpdated: "Today, 02:00 AM", lastUpdatedDate: today(2,0), type: "Master Data", recordCount: "892" },
      { id: "variety-pack", name: "Kit Composition", description: "Variety pack and kit component breakdowns", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:05 AM", lastUpdatedDate: today(2,5), type: "Master Data", recordCount: "12" },
      { id: "coman-master", name: "Co-Man & 3PL Master", description: "Master list of co-manufacturers and 3PL partners", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:08 AM", lastUpdatedDate: today(2,8), type: "Master Data", recordCount: "8" },
    ],
  },
]

export const availableExports = [
  { category: "Demand Planning", tables: [
    { id: "retail-demand", name: "Retail Demand Pivot", recordCount: "12,450" },
    { id: "shipments-plan", name: "Shipments Walk", recordCount: "8,320" },
    { id: "shipments-pivot", name: "Shipments Pivot", recordCount: "15,670" },
  ]},
  { category: "Supply Planning", tables: [
    { id: "production-plan", name: "Production Plan", recordCount: "6,890" },
    { id: "production-pivot", name: "Production Pivot", recordCount: "9,120" },
    { id: "kitting-pivot", name: "Kitting Pivot", recordCount: "4,230" },
    { id: "material-pivot", name: "Material Purchasing Pivot", recordCount: "7,560" },
    { id: "allocation-pivot", name: "Allocation Plan Pivot", recordCount: "5,440" },
  ]},
  { category: "Reporting", tables: [
    { id: "network-planning", name: "Network Planning", recordCount: "3,280" },
    { id: "control-tower", name: "Control Tower Metrics", recordCount: "1,450" },
    { id: "forecast-accuracy", name: "Forecast Accuracy", recordCount: "8,920" },
  ]},
  { category: "Validations", tables: [
    { id: "shipments-validation", name: "Shipment Adjustments", recordCount: "21" },
    { id: "production-validation", name: "Production Adjustments", recordCount: "8" },
  ]},
]
