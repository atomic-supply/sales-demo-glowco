// ============================================================================
// NUCLEUS DEMO RESPONSES — Context-aware mock AI responses
// Keyed by (page pathname pattern, query keyword match)
// ============================================================================

interface DemoResponse {
  /** Keywords to match in the user's query (case-insensitive). Empty = fallback. */
  keywords: string[]
  /** Page path prefix to match. Empty = any page. */
  pagePrefix: string
  /** The demo response text */
  response: string
}

const RESPONSES: DemoResponse[] = [
  // ─── Global (any page) ─────────────────────────────────────────────────────

  {
    keywords: ["at-risk", "at risk", "risk"],
    pagePrefix: "",
    response: `Based on current inventory levels, here are the top at-risk SKUs:

**Critical (< 3 WOS):**
• SPF 50 Daily Sunscreen — E-Commerce: **3.2 WOS** (target: 8)
• Broad Spectrum SPF 30 — Wholesale: **2.8 WOS** (target: 12)

**Warning (3–5 WOS):**
• Vitamin C Moisturizer — Amazon: **4.1 WOS** (target: 10)
• Sugar Body Scrub — B2B: **4.6 WOS** (target: 10)

Both sunscreen SKUs are trending into stockout within 16 days at current sell-through. Recommend expedited replenishment from Site A.`,
  },

  {
    keywords: ["diagnose", "deep dive", "drill down"],
    pagePrefix: "",
    response: `Let me pull the supply walk for that SKU.

**SPF 50 Daily Sunscreen — E-Commerce (DTC)**
| Measure | W1 Apr | W2 Apr | W3 Apr | W4 Apr |
|---------|--------|--------|--------|--------|
| Starting Inv | 4,200 | 3,100 | 1,800 | 2,600 |
| Inbound | 0 | 0 | 2,400 | 0 |
| Sales | -1,100 | -1,300 | -1,600 | -1,400 |
| Ending Inv | 3,100 | 1,800 | 2,600 | 1,200 |
| WOS | 2.8 | 1.4 | 1.6 | 0.9 |

⚠️ Without additional inbound by W3, this SKU stocks out at 3PL East. The open PO for 2,400 units arrives W3 but doesn't cover the demand ramp.`,
  },

  {
    keywords: ["latest run", "run delta", "changed", "what changed"],
    pagePrefix: "",
    response: `Comparing Run #247 vs Run #246:

**Demand Changes:**
• Total demand up +3.2% (+54K units) driven by Wholesale channel summer pre-orders
• Sunscreen category up +18% (seasonal ramp)
• Body Care down -4% (expected seasonal softening)

**Supply Changes:**
• 2 new POs generated: SPF 50 Daily (25K units) + Broad Spectrum (15K units)
• Site B utilization increased from 88% → 95% — approaching capacity ceiling
• 3 allocation transfers proposed: redirect inventory from 3PL Canada → 3PL East

**New Alerts:** 2 critical, 3 warnings (see Inbox for details)`,
  },

  {
    keywords: ["data", "setup", "data setup", "sources"],
    pagePrefix: "",
    response: `Here's the current data pipeline status:

**Connected Sources:**
✅ Forecast Engine — Last sync: 2 hours ago
✅ ERP (NetSuite) — Last sync: 6 hours ago
✅ Amazon Seller Central — Last sync: 4 hours ago
✅ Shopify — Last sync: 1 hour ago
⚠️ Wholesale EDI — Last sync: 2 days ago (stale)

**Master Data:** 12 formulations × 4 pack configs = 48 SKUs across 4 channels and 5 warehouses.

The Wholesale EDI feed hasn't updated since Friday. This may affect demand signals for Ulta/Sephora. Recommend checking the Data Hub for connection status.`,
  },

  // ─── Shipments page ────────────────────────────────────────────────────────

  {
    keywords: ["attention", "need", "review", "help"],
    pagePrefix: "/plan/shipments",
    response: `Looking at the Shipments view, here are the channels needing attention:

🔴 **E-Commerce (DTC)** — 3 SKUs below safety stock WOS
  • SPF 50 Daily: 3.2 WOS (target: 8)
  • Nourishing Body Oil: 4.8 WOS (target: 8)
  • Broad Spectrum SPF 30: 2.8 WOS (target: 8)

🟡 **Amazon** — Collagen Night Cream overstocked at 22 WOS
  Recommend reducing next inbound by 5K units

✅ **Wholesale** and **B2B** are on track.

Would you like me to simulate shipment adjustments for the E-Commerce shortfalls?`,
  },

  {
    keywords: ["supply walk", "walk"],
    pagePrefix: "/plan/shipments",
    response: `Here's the supply walk summary for the highest-priority SKU:

**SPF 50 Daily Sunscreen — E-Commerce**
Current inventory at 3PL East is critically low. The forward walk shows:
• Week 1–2: Inventory depletes to ~1,800 units
• Week 3: Open PO of 2,400 arrives but only covers 1.6 weeks
• Week 4+: Back below safety stock

**Recommendation:** Create a simulated shipment of 5,000 units for Week 2 to bridge the gap. This would bring WOS back to 4.5 by end of April.

Click "Simulated Shipment Arrivals" in the supply walk to enter the override.`,
  },

  // ─── Consumption page ──────────────────────────────────────────────────────

  {
    keywords: ["variance", "forecast", "driving"],
    pagePrefix: "/consumption",
    response: `Analyzing forecast variance across channels:

**Wholesale (Ulta/Sephora)** — Biggest variance driver
• Sunscreen category: +40% above baseline (summer pre-buy)
• This is a known seasonal pattern; recommend approving the lift

**Amazon** — Downward pressure
• Collagen Night Cream: -18% WoW velocity decline
• Trailing 4-week trend confirms seasonal softening
• Recommend forecast override to reduce by 12% for May–Jun

**E-Commerce (DTC)** — Stable
• Tracking within ±3% of baseline across all formulations

**B2B** — Upside not captured
• Hotel chain onboarding adding 5 locations; +10K units not in baseline
• Recommend planner override for Jul–Aug Body Care SKUs`,
  },

  {
    keywords: ["override", "adjust"],
    pagePrefix: "/consumption",
    response: `There are 14 active overrides across channels:

**Needs Review (9):**
• 4 in Wholesale — summer promo lifts pending approval
• 3 in Amazon — seasonal adjustments
• 2 in B2B — new hotel chain fills

**Approved (5):**
• 3 in E-Commerce — Q2 marketing campaign alignment
• 2 in Wholesale — confirmed retailer POs

The Wholesale overrides have the largest impact: +45K units total. These should be reviewed first as they cascade to Production and MRP.

Navigate to the Validation tab to review and approve.`,
  },

  // ─── Production page ───────────────────────────────────────────────────────

  {
    keywords: ["capacity", "utilization", "constraint"],
    pagePrefix: "/plan/production",
    response: `Production capacity analysis:

**Site A — Fill & Pack (Primary):** 720K / 800K units = **90% utilized**
• Running all 12 formulations
• Buffer of 80K units/month — sufficient for normal demand variation
• Maintenance window Jul 12–14 reduces capacity by ~75K units

**Site B — Fill & Pack:** 440K / 500K units = **95% utilized** ⚠️
• Running Facial Care + Sunscreen only
• Only 60K units of buffer — insufficient for sunscreen summer ramp
• **Recommend shifting 50K units of Facial Care to Site A** to free capacity

**Sites C & D — Kitting Only:** Assembly capacity adequate
• Currently running at 80% for Value Sets and Gift Sets`,
  },

  // ─── MRP page ──────────────────────────────────────────────────────────────

  {
    keywords: ["material", "shortage", "lead time", "procurement"],
    pagePrefix: "/plan/mrp",
    response: `Material requirements analysis:

**⚠️ At-Risk Materials:**
1. **Active Ingredient Blend (SPF 50 Daily)** — PO due Apr 15
   • Supplier confirmed ship Apr 12 but 5-day transit = arrives Apr 17
   • 3-day gap could halt Site B production line
   • **Recommend expedited freight ($2,400 premium)**

2. **Fragrance/Essential Oil (Shea Butter Lotion)** — Lead time extended
   • Supplier moved from 6 → 8 weeks due to shea butter shortage
   • Jun/Jul POs must be placed by Apr 20 to avoid stockout

**✅ Healthy Materials:**
• Containers: 18K on hand (above 25K MOQ threshold in 2 weeks)
• Labels: Adequate inventory through Q3
• Outer Cartons: Volume discount opportunity at 50K+ (current: 42K quarterly)`,
  },

  // ─── Allocation page ──────────────────────────────────────────────────────

  {
    keywords: ["imbalance", "redistribute", "transfer", "overstock"],
    pagePrefix: "/plan/allocation",
    response: `Allocation imbalance analysis across 3PLs:

**Overstocked:**
• 3PL Canada: Volumizing Shampoo at 19 WOS (target: 12)
  → Redirect next 2 inbound shipments to 3PL East
• Amazon FBA: Collagen Night Cream at 22 WOS (target: 12)
  → Reduce inbound by 5K units; let sell-through absorb

**Understocked:**
• 3PL East: 4 SKUs below target WOS
  → SPF 50 Daily (3.2), Broad Spectrum (4.8), Sugar Scrub (5.1), Body Oil (6.2)
  → Transfer 8K units from 3PL West to cover immediate gap
• 3PL West: Hydrating Face Cream needs allocation increase (20% → 25%)

**Proposed Transfers:**
1. 3PL Canada → 3PL East: 3K units Volumizing Shampoo
2. 3PL West → 3PL East: 5K units SPF 50 Daily
3. Amazon FBA: hold next Collagen Night Cream inbound`,
  },
]

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Find the best demo response matching the user's query and current page.
 * Tries page-specific matches first, then global matches, then a fallback.
 */
export function getDemoResponse(currentPage: string, userQuery: string): string {
  const q = userQuery.toLowerCase()

  // 1. Try page-specific matches first
  const pageMatch = RESPONSES.find(
    r => r.pagePrefix && currentPage.startsWith(r.pagePrefix) && r.keywords.some(kw => q.includes(kw)),
  )
  if (pageMatch) return pageMatch.response

  // 2. Try global matches (no pagePrefix)
  const globalMatch = RESPONSES.find(
    r => !r.pagePrefix && r.keywords.length > 0 && r.keywords.some(kw => q.includes(kw)),
  )
  if (globalMatch) return globalMatch.response

  // 3. Fallback
  const pageLabel = PAGE_LABEL_MAP[currentPage] ?? "this view"
  return `I can help you analyze ${pageLabel}. Try asking about:
• **At-risk SKUs** — which products need immediate attention
• **Forecast variance** — what's driving changes in demand
• **Capacity concerns** — co-man utilization and constraints
• **Material shortages** — procurement lead time risks
• **Allocation imbalances** — inventory distribution across 3PLs

Or click one of the quick actions above to get started.`
}

const PAGE_LABEL_MAP: Record<string, string> = {
  "/data-hub": "your data sources",
  "/plan-status": "the planning pipeline",
  "/consumption/plan": "the consumption forecast",
  "/consumption/pivot": "the demand pivot",
  "/consumption/validation": "forecast overrides",
  "/plan/shipments": "shipment plans",
  "/plan/production": "production planning",
  "/plan/kitting": "kitting operations",
  "/plan/mrp": "material requirements",
  "/plan/allocation": "inventory allocation",
}
