// ============================================================================
// GLOWCO INBOX DATA — Realistic alerts for each planning module
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
      "Wholesale (Ulta/Sephora) PO for Jun 2026 is 40% above baseline forecast. Incremental demand of ~45K units needs upstream capacity confirmation.",
    affectedItem: "SPF 50 Daily Sunscreen - Standard",
    module: "consumption",
  },
  {
    id: "cons-002",
    severity: "warning",
    message:
      "Amazon velocity dropped 18% WoW on Collagen Night Cream. Trailing 4-week trend suggests seasonal softening; recommend forecast override to avoid overproduction.",
    affectedItem: "Collagen Night Cream - All Packs",
    module: "consumption",
  },
  {
    id: "cons-003",
    severity: "info",
    message:
      "New Nordstrom pipeline fill request received for 6 SKUs (Hydrating Cream, Vitamin C Moisturizer, SPF 50 Daily, Shea Butter Lotion, Frizz Control, Volumizing Shampoo). Estimated one-time fill: 30K units across Standard and Value Set.",
    affectedItem: "Multiple SKUs",
    module: "consumption",
  },
  {
    id: "cons-004",
    severity: "warning",
    message:
      "B2B (Hotels & Spas) Q3 summer season lift not yet reflected in baseline. Historical lift is 22-28% for Body Care; planner override recommended for Jul-Aug.",
    affectedItem: "All Body Care - B2B",
    module: "consumption",
  },

  // ─── Shipments ────────────────────────────────────────────────────────────
  {
    id: "ship-001",
    severity: "critical",
    message:
      "SPF 50 Daily Sunscreen DTC inventory at 3PL East is at 3.2 WOS, below the 8-week safety stock target. Current burn rate will stock out in 16 days without expedited replenishment.",
    affectedItem: "SPF 50 Daily Sunscreen - E-Commerce",
    module: "shipments",
  },
  {
    id: "ship-002",
    severity: "warning",
    message:
      "Wholesale requesting early shipment for Vitamin C Moisturizer summer promo (2 weeks ahead of schedule). Ship date moved from Jun 15 to Jun 1; 8K units.",
    affectedItem: "Vitamin C Moisturizer - Wholesale",
    module: "shipments",
  },
  {
    id: "ship-003",
    severity: "info",
    message:
      "B2B new hotel chain onboarding adding 5 ship-to locations (Miami, Las Vegas, NYC, LA, Chicago). Initial fill of ~2K units per location required by Jul 1.",
    affectedItem: "All Formulations - B2B",
    module: "shipments",
  },
  {
    id: "ship-004",
    severity: "warning",
    message:
      "Wholesale channel ship quantities exceeding carrier capacity at 3PL West. Weekly shipments over 15K units require second trailer allocation.",
    affectedItem: "Multiple SKUs - Wholesale",
    module: "shipments",
  },

  // ─── Production ───────────────────────────────────────────────────────────
  {
    id: "prod-001",
    severity: "critical",
    message:
      "Site B at 95% capacity utilization for Jun-Jul. No buffer for demand spikes. Recommend shifting 50K units/month of Facial Care production to Site A.",
    affectedItem: "Site B - All Formulations",
    module: "production",
  },
  {
    id: "prod-002",
    severity: "warning",
    message:
      "Nourishing Body Oil production run delayed 1 week at Site A due to formulation changeover scheduling conflict. 25K units pushed from W2 Jun to W3 Jun.",
    affectedItem: "Nourishing Body Oil - Site A",
    module: "production",
  },
  {
    id: "prod-003",
    severity: "warning",
    message:
      "Expiration risk: 8K finished units of Sugar Body Scrub at 3PL East are within 60 days of shelf life limit. Recommend priority allocation to DTC and Amazon for fastest sell-through.",
    affectedItem: "Sugar Body Scrub - Standard",
    module: "production",
  },
  {
    id: "prod-004",
    severity: "info",
    message:
      "Site A maintenance window scheduled Jul 12-14. Production capacity reduced by ~75K units. Pre-build recommended in Jun W4.",
    affectedItem: "Site A - All Formulations",
    module: "production",
  },

  // ─── Kitting ──────────────────────────────────────────────────────────────
  {
    id: "kit-001",
    severity: "critical",
    message:
      "Value Set (3-pk) kitting backlog is 12K units behind schedule across Sites C and D. Root cause: bulk product shortfall from delayed SPF 50 Daily and Hydrating Cream production runs.",
    affectedItem: "Value Set (3-pk) - All Formulations",
    module: "kitting",
  },
  {
    id: "kit-002",
    severity: "warning",
    message:
      "Gift Set demand up 25% vs plan driven by Amazon Prime Day prep orders. Kitting capacity at Site C needs to increase from 20K to 25K units/week.",
    affectedItem: "Gift Set (5-pk)",
    module: "kitting",
  },
  {
    id: "kit-003",
    severity: "info",
    message:
      "Travel Size demand mix shifting: DTC share dropped from 60% to 40%, B2B share up to 35%. Kitting schedule needs rebalance from Site D (DTC-focused) to Site C (B2B-focused).",
    affectedItem: "Travel Size - All Formulations",
    module: "kitting",
  },
  {
    id: "kit-004",
    severity: "warning",
    message:
      "Standard pack Frizz Control Cream FG inventory building to 18 WOS (target: 12). Recommend pausing kitting for 2 weeks to draw down.",
    affectedItem: "Frizz Control Cream - Standard",
    module: "kitting",
  },

  // ─── MRP ──────────────────────────────────────────────────────────────────
  {
    id: "mrp-001",
    severity: "critical",
    message:
      "SPF 50 Daily active ingredient blend PO due Apr 15 has 3-day lead time risk. Supplier confirmed shipping Apr 12 but transit is 5 days. Expedited freight recommended to avoid production line stoppage.",
    affectedItem: "Active Ingredient Blend - SPF 50 Daily",
    module: "mrp",
  },
  {
    id: "mrp-002",
    severity: "warning",
    message:
      "Fragrance supplier allocation shift: Shea Butter Lotion essential oil lead time extended from 6 to 8 weeks due to shea butter shortage. Jun and Jul POs need to be placed by Apr 20.",
    affectedItem: "Fragrance / Essential Oil - Shea Butter Lotion",
    module: "mrp",
  },
  {
    id: "mrp-003",
    severity: "warning",
    message:
      "Container inventory at Site A is 18K units, below the 25K safety stock threshold. Next PO of 25K containers arrives May 8; gap of ~3 production days.",
    affectedItem: "Container (Jar/Bottle/Tube) - Site A",
    module: "mrp",
  },
  {
    id: "mrp-004",
    severity: "info",
    message:
      "Outer carton supplier offering 8% volume discount for orders over 50K cartons. Current quarterly run rate is 42K; consolidating Site A and Site B orders would qualify.",
    affectedItem: "Outer Carton - All Sites",
    module: "mrp",
  },

  // ─── Allocation ───────────────────────────────────────────────────────────
  {
    id: "alloc-001",
    severity: "warning",
    message:
      "Amazon FBA Collagen Night Cream inventory at 22 WOS (target: 12). Overstocked by ~5K units. Recommend reducing inbound transfers and letting sell-through absorb excess.",
    affectedItem: "Collagen Night Cream - Standard / Amazon FBA",
    module: "allocation",
  },
  {
    id: "alloc-002",
    severity: "critical",
    message:
      "3PL East below target WOS for 4 SKUs: SPF 50 Daily (3.2), Broad Spectrum SPF 30 (4.8), Sugar Scrub (5.1), Nourishing Body Oil (6.2). DTC and Wholesale fulfillment at risk.",
    affectedItem: "Multiple SKUs - 3PL East",
    module: "allocation",
  },
  {
    id: "alloc-003",
    severity: "info",
    message:
      "3PL Canada overstocked on Volumizing Shampoo Standard at 19 WOS (target: 12). E-Commerce velocity is flat; consider redirecting next 2 inbound shipments to 3PL East.",
    affectedItem: "Volumizing Shampoo - Standard / 3PL Canada",
    module: "allocation",
  },
  {
    id: "alloc-004",
    severity: "warning",
    message:
      "3PL West Hydrating Face Cream allocation share needs increase from 20% to 25% to support West Coast DTC demand growth. Current WOS trending down to 7.5 (target: 12).",
    affectedItem: "Hydrating Face Cream - Standard / 3PL West",
    module: "allocation",
  },
]

/**
 * Returns inbox alerts filtered by module ID.
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
