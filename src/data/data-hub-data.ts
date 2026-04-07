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
    id: "sales-data", name: "Sales Data",
    sources: [
      createDS("shopify-dtc", "Shopify DTC Orders", "Direct-to-consumer order data from Shopify", "Shopify", "Snowflake", "API", "Today, 06:00 AM", today(6,0), 1440, "142,580", { canRefresh: true }),
      createDS("amazon-seller", "Amazon Seller Central", "Amazon marketplace sales and inventory", "Amazon", "Snowflake", "API", "Today, 06:15 AM", today(6,15), 1440, "89,320", { canRefresh: true }),
      createDS("target-pos", "Target POS Data", "Target point-of-sale via Emerson/Snowflake", "Target (via Emerson)", "Snowflake", "API", "Today, 07:00 AM", today(7,0), 1440, "34,200", { canRefresh: true }),
      createDS("walmart-pos", "Walmart POS Data", "Walmart point-of-sale via Emerson/Snowflake", "Walmart (via Emerson)", "Snowflake", "API", "Today, 07:00 AM", today(7,0), 1440, "28,450", { canRefresh: true }),
      createDS("wholesale-orders", "Wholesale Orders", "Wholesale and distribution orders from QuickBooks", "QuickBooks", "Manual Upload", "Manual", "Today, 08:30 AM", today(8,30), 1440, "4,890", { uploadedFileName: "Wholesale_Orders_Apr_2026.csv" }),
      createDS("vitamin-shoppe", "Vitamin Shoppe Orders", "Vitamin Shoppe order data", "Vitamin Shoppe EDI", "Snowflake", "API", "Today, 07:30 AM", today(7,30), 1440, "12,670", { canRefresh: true }),
    ],
  },
  {
    id: "inventory-data", name: "Inventory & 3PL",
    sources: [
      createDS("stord-dtc", "Stord 3PL Inventory (DTC + Retail)", "Stord warehouse on-hand and in-transit", "Stord", "Direct API", "API", "Today, 09:00 AM", today(9,0), 60, "56,780", { canRefresh: true }),
      createDS("amazon-fba", "Amazon FBA Inventory", "Amazon fulfillment center stock levels", "Amazon", "Snowflake", "API", "Today, 09:15 AM", today(9,15), 60, "38,420"),
      createDS("retail-3pl", "Retail 3PL Inventory", "Retail distribution center inventory", "Retail 3PL", "Direct API", "API", "Today, 09:30 AM", today(9,30), 60, "22,340"),
    ],
  },
  {
    id: "coman-data", name: "Co-Manufacturer Data",
    sources: [
      createDS("site-a-inv", "Site A Inventory (Tolling & Kitting)", "Primary co-man WIP and raw material inventory", "Site A", "Manual Upload", "Manual", "Today, 07:00 AM", today(7,0), 1440, "18,900", { uploadedFileName: "SiteA_Inventory_Apr4.xlsx" }),
      createDS("site-b-inv", "Site B Inventory (Tolling & Kitting)", "Secondary co-man inventory", "Site B", "Manual Upload", "Manual", "Today, 07:15 AM", today(7,15), 1440, "12,340", { uploadedFileName: "SiteB_Inventory_Apr4.xlsx" }),
      createDS("site-c-inv", "Site C Inventory (Kitting Only)", "Kitting-only facility inventory", "Site C", "Manual Upload", "Manual", "Today, 07:30 AM", today(7,30), 1440, "8,560", { uploadedFileName: "SiteC_Inventory_Apr4.xlsx" }),
      createDS("site-d-inv", "Site D Inventory (Kitting Only)", "Kitting-only facility inventory", "Site D", "Manual Upload", "Manual", "Today, 07:45 AM", today(7,45), 1440, "6,780", { uploadedFileName: "SiteD_Inventory_Apr4.xlsx" }),
    ],
  },
  {
    id: "snowflake", name: "Snowflake (Data Warehouse)",
    sources: [
      createDS("snowflake-sales", "Snowflake Sales Tables", "Consolidated sales data across all channels", "Snowflake", "Snowflake", "API", "Today, 06:00 AM", today(6,0), 1440, "324,560", { canRefresh: true }),
      createDS("snowflake-supply", "Snowflake Supply Chain Tables", "Supply chain and inventory data", "Snowflake", "Snowflake", "API", "In Progress", today(6,0), 1440, "--", { hasNonBlockingErrors: true, issue: "Supply chain tables not yet fully modeled in Snowflake. Target: Q3 2026.", issues: [
        { id: "sf-1", severity: "error", description: "Snowflake supply chain data integration is in progress. Sales data available; supply chain tables targeting Q3 2026 completion.", affectedRecords: 0 },
      ]}),
    ],
  },
]

export const staticDataGroups: StaticDataGroup[] = [
  {
    id: "mappings", name: "Mapping Tables",
    sources: [
      { id: "channel-3pl-map", name: "Channel to 3PL Mapping", description: "Maps sales channels to fulfillment locations", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:00 AM", lastUpdatedDate: today(2,0), type: "Mapping", recordCount: "18" },
      { id: "sku-formulation-map", name: "SKU to Formulation Mapping", description: "Maps finished good SKUs to base formulations", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:05 AM", lastUpdatedDate: today(2,5), type: "Mapping", recordCount: "64" },
      { id: "site-formulation-map", name: "Co-Man Site Formulation Capability", description: "Which formulations each co-man site can produce", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:10 AM", lastUpdatedDate: today(2,10), type: "Mapping", recordCount: "24" },
    ],
  },
  {
    id: "rules", name: "Business Rules & Config",
    sources: [
      { id: "safety-stock-rules", name: "Safety Stock Targets", description: "Channel-specific safety stock targets in weeks of supply", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:15 AM", lastUpdatedDate: today(2,15), type: "Rules", recordCount: "48" },
      { id: "coman-allocation", name: "Co-Man Allocation Rules", description: "Production allocation split across co-man sites", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:20 AM", lastUpdatedDate: today(2,20), type: "Rules", recordCount: "12" },
      { id: "kitting-rules", name: "Kitting Configuration", description: "Pack format rules: sticks per unit, site assignments", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:25 AM", lastUpdatedDate: today(2,25), type: "Config", recordCount: "32" },
      { id: "capacity-tables", name: "Co-Man Capacity Tables", description: "Monthly production capacity by co-man site", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:30 AM", lastUpdatedDate: today(2,30), type: "Config", recordCount: "16" },
      { id: "expiration-rules", name: "Expiration Rules", description: "Shelf life constraints by channel and product category", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:35 AM", lastUpdatedDate: today(2,35), type: "Config", recordCount: "24" },
    ],
  },
  {
    id: "master", name: "Master Data",
    sources: [
      { id: "sku-master", name: "SKU Master", description: "All active SKUs: formulations, pack configs, categories", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:00 AM", lastUpdatedDate: today(2,0), type: "Master Data", recordCount: "64" },
      { id: "bom-master", name: "Bill of Materials", description: "BOM definitions: blend, film, carton per stick", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:05 AM", lastUpdatedDate: today(2,5), type: "Master Data", recordCount: "32" },
      { id: "coman-master", name: "Co-Man & 3PL Master", description: "Sites, capabilities, contacts", originalSource: "Internal", ingestionLocation: "Manual Upload", method: "Manual", lastUpdated: "Today, 02:08 AM", lastUpdatedDate: today(2,8), type: "Master Data", recordCount: "9" },
    ],
  },
]

export const availableExports = [
  { category: "Demand Planning", tables: [
    { id: "consumption-forecast", name: "Consumption Forecast", recordCount: "4,320" },
    { id: "shipments-plan", name: "Shipments Plan", recordCount: "8,640" },
  ]},
  { category: "Supply Planning", tables: [
    { id: "production-plan", name: "Production Plan", recordCount: "3,840" },
    { id: "kitting-plan", name: "Kitting Plan", recordCount: "2,560" },
    { id: "mrp-plan", name: "MRP / Material Requirements", recordCount: "5,120" },
    { id: "allocation-plan", name: "Allocation Plan", recordCount: "4,480" },
  ]},
  { category: "Reporting", tables: [
    { id: "inventory-health", name: "Inventory Health Dashboard", recordCount: "1,280" },
    { id: "forecast-accuracy", name: "Forecast Accuracy", recordCount: "6,400" },
    { id: "wos-report", name: "Weeks of Supply Report", recordCount: "960" },
  ]},
]
