// ============================================================================
// LMNT INBOX DATA — Realistic alerts for each planning module
// ============================================================================

export interface InboxAlert {
  id: string
  severity: "warning" | "info" | "critical"
  message: string
  affectedItem: string
  module: string
}

const ALERTS: InboxAlert[] = [
  // ─── Consumption ──────────────────────────────────────────────────────────
  {
    id: "cons-001",
    severity: "critical",
    message:
      "Target / Walmart PO for Jun 2026 is 40% above baseline forecast. Incremental demand of ~72K units needs upstream capacity confirmation.",
    affectedItem: "Citrus Salt - 30ct",
    module: "consumption",
  },
  {
    id: "cons-002",
    severity: "warning",
    message:
      "Amazon velocity dropped 18% WoW on Chocolate Salt. Trailing 4-week trend suggests seasonal softening; recommend forecast override to avoid overproduction.",
    affectedItem: "Chocolate Salt - All Packs",
    module: "consumption",
  },
  {
    id: "cons-003",
    severity: "info",
    message:
      "New Costco pipeline fill request received for 6 SKUs (Citrus Salt, Raspberry Salt, Watermelon Salt, Raw Unflavored, Mango Chili, Orange Salt). Estimated one-time fill: 180K units across 30ct and Variety Pack.",
    affectedItem: "Multiple SKUs",
    module: "consumption",
  },
  {
    id: "cons-004",
    severity: "warning",
    message:
      "Vitamin Shoppe Q3 promo lift not yet reflected in baseline. Historical lift is 22-28%; planner override recommended for Aug-Sep.",
    affectedItem: "All Flavors - Vitamin Shoppe",
    module: "consumption",
  },

  // ─── Shipments ────────────────────────────────────────────────────────────
  {
    id: "ship-001",
    severity: "critical",
    message:
      "Watermelon Salt DTC inventory at 3PL East is at 3.2 WOS, below the 8-week safety stock target. Current burn rate will stock out in 16 days without expedited replenishment.",
    affectedItem: "Watermelon Salt - Shopify DTC",
    module: "shipments",
  },
  {
    id: "ship-002",
    severity: "warning",
    message:
      "Target DC requesting early shipment for Raspberry Salt summer promo (2 weeks ahead of schedule). Ship date moved from Jun 15 to Jun 1; 14K units.",
    affectedItem: "Raspberry Salt - Target",
    module: "shipments",
  },
  {
    id: "ship-003",
    severity: "info",
    message:
      "Vitamin Shoppe new store expansion adding 3 ship-to locations (Nashville, Austin, Denver). Initial fill of ~8K units per location required by Jul 1.",
    affectedItem: "All Flavors - Vitamin Shoppe",
    module: "shipments",
  },
  {
    id: "ship-004",
    severity: "warning",
    message:
      "Wholesale channel ship quantities exceeding carrier capacity at 3PL Central. Weekly shipments over 22K units require second trailer allocation.",
    affectedItem: "Multiple SKUs - Wholesale",
    module: "shipments",
  },

  // ─── Production ───────────────────────────────────────────────────────────
  {
    id: "prod-001",
    severity: "critical",
    message:
      "Site B at 95% capacity utilization for Jun-Jul. No buffer for demand spikes. Recommend shifting 1.5M sticks/month of Citrus Salt production to Site A.",
    affectedItem: "Site B - All Flavors",
    module: "production",
  },
  {
    id: "prod-002",
    severity: "warning",
    message:
      "Mango Chili production run delayed 1 week at Site A due to blend changeover scheduling conflict. 1M sticks pushed from W2 Jun to W3 Jun.",
    affectedItem: "Mango Chili - Site A",
    module: "production",
  },
  {
    id: "prod-003",
    severity: "warning",
    message:
      "Expiration risk: 15K finished units of Orange Salt at 3PL East are within 60 days of shelf life limit. Recommend priority allocation to DTC and Amazon for fastest sell-through.",
    affectedItem: "Orange Salt - 30ct",
    module: "production",
  },
  {
    id: "prod-004",
    severity: "info",
    message:
      "Site A maintenance window scheduled Jul 12-14. Production capacity reduced by ~1.5M sticks. Pre-build recommended in Jun W4.",
    affectedItem: "Site A - All Flavors",
    module: "production",
  },

  // ─── Kitting ──────────────────────────────────────────────────────────────
  {
    id: "kit-001",
    severity: "critical",
    message:
      "30-Count Box kitting backlog is 200K units behind schedule across Sites C and D. Root cause: WIP stick shortfall from delayed Citrus Salt and Raspberry Salt production runs.",
    affectedItem: "30-Count Box - All Flavors",
    module: "kitting",
  },
  {
    id: "kit-002",
    severity: "warning",
    message:
      "Variety Pack demand up 25% vs plan driven by Amazon Prime Day prep orders. Kitting capacity at Site C needs to increase from 800K to 1M units/week.",
    affectedItem: "10-Count Variety Pack",
    module: "kitting",
  },
  {
    id: "kit-003",
    severity: "info",
    message:
      "Sample Pack demand mix shifting: DTC share dropped from 60% to 40%, retail share up to 45%. Kitting schedule needs rebalance from Site D (DTC-focused) to Site C (retail-focused).",
    affectedItem: "Sample Pack (6 Count)",
    module: "kitting",
  },
  {
    id: "kit-004",
    severity: "warning",
    message:
      "8-Count Single Flavor Lemon Habanero FG inventory building to 18 WOS (target: 12). Recommend pausing kitting for 2 weeks to draw down.",
    affectedItem: "8-Count Lemon Habanero",
    module: "kitting",
  },

  // ─── MRP ──────────────────────────────────────────────────────────────────
  {
    id: "mrp-001",
    severity: "critical",
    message:
      "Raspberry Salt film PO due Apr 15 has 3-day lead time risk. Supplier confirmed shipping Apr 12 but transit is 5 days. Expedited freight recommended to avoid production line stoppage.",
    affectedItem: "Stick Film - Raspberry Salt",
    module: "mrp",
  },
  {
    id: "mrp-002",
    severity: "warning",
    message:
      "Blend supplier allocation shift: Citrus Salt electrolyte blend lead time extended from 6 to 8 weeks due to citric acid shortage. Jun and Jul POs need to be placed by Apr 20.",
    affectedItem: "Electrolyte Blend - Citrus Salt",
    module: "mrp",
  },
  {
    id: "mrp-003",
    severity: "warning",
    message:
      "Carton inventory at Site A is 42K units, below the 50K safety stock threshold. Next PO of 50K cartons arrives May 8; gap of ~3 production days.",
    affectedItem: "Carton / Box - Site A",
    module: "mrp",
  },
  {
    id: "mrp-004",
    severity: "info",
    message:
      "Inner wrap supplier offering 8% volume discount for orders over 200K liners. Current quarterly run rate is 185K; consolidating Site A and Site B orders would qualify.",
    affectedItem: "Inner Wrap / Liner - All Sites",
    module: "mrp",
  },

  // ─── Allocation ───────────────────────────────────────────────────────────
  {
    id: "alloc-001",
    severity: "warning",
    message:
      "Amazon FBA Chocolate Salt inventory at 22 WOS (target: 12). Overstocked by ~8.5K units. Recommend reducing inbound transfers and letting sell-through absorb excess.",
    affectedItem: "Chocolate Salt - 30ct / Amazon FBA",
    module: "allocation",
  },
  {
    id: "alloc-002",
    severity: "critical",
    message:
      "3PL East below target WOS for 4 SKUs: Watermelon Salt (3.2), Mango Chili (5.1), Lemon Habanero (4.8), Orange Salt (6.2). DTC and retail fulfillment at risk.",
    affectedItem: "Multiple SKUs - 3PL East",
    module: "allocation",
  },
  {
    id: "alloc-003",
    severity: "info",
    message:
      "Retail DC overstocked on Raw Unflavored 30ct at 19 WOS (target: 12). Walmart velocity is flat; consider redirecting next 2 inbound shipments to 3PL East.",
    affectedItem: "Raw Unflavored - 30ct / Retail DC",
    module: "allocation",
  },
  {
    id: "alloc-004",
    severity: "warning",
    message:
      "3PL West Citrus Salt allocation share needs increase from 15% to 20% to support West Coast DTC demand growth. Current WOS trending down to 7.5 (target: 12).",
    affectedItem: "Citrus Salt - 30ct / 3PL West",
    module: "allocation",
  },
]

/**
 * Returns inbox alerts filtered by module ID.
 * Module IDs: "consumption", "shipments", "production", "kitting", "mrp", "allocation"
 */
export function getInboxAlerts(moduleId: string): InboxAlert[] {
  return ALERTS.filter((a) => a.module === moduleId)
}

/**
 * Returns all inbox alerts across all modules.
 */
export function getAllInboxAlerts(): InboxAlert[] {
  return ALERTS
}

/**
 * Returns count of alerts by severity for a given module.
 */
export function getAlertCounts(moduleId: string): Record<InboxAlert["severity"], number> {
  const alerts = getInboxAlerts(moduleId)
  return {
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  }
}
