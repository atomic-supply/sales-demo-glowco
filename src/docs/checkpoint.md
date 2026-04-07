# LMNT Sales Demo — Checkpoint (Apr 7, 2026)

## Project Overview
Sales demo for LMNT (electrolyte drink mix company, late-stage $800K deal). Built with Vite + React 19 + TypeScript + Emotion CSS-in-JS. Simulates a full supply chain planning tool with mock data.

## Current Architecture

### Pages & Routes (`src/routes.tsx`)

| Route | Page Component | Status |
|---|---|---|
| `/` | Redirects to `/consumption/plan` | Done |
| `/data-hub` | `DataHubView` | Pre-existing |
| `/plan-status` | `PlanStatusView` | Pre-existing |
| `/consumption/plan` | `ConsumptionPlanPage` | Done |
| `/consumption/pivot` | `ConsumptionPivotPage` | Done |
| `/consumption/validation` | `ConsumptionValidationPage` | Done |
| `/plan/shipments` | `ShipmentsPlanPage` | **Done (this session)** |
| `/plan/production` | `StageViewPage` | Legacy StageView |
| `/plan/kitting` | `StageViewPage` | Legacy StageView |
| `/plan/mrp` | `StageViewPage` | Legacy StageView |
| `/plan/allocation` | `StageViewPage` | Legacy StageView |
| `/nucleus` | `NucleusChatView` | Pre-existing |

### Sidebar (`src/layouts/DashboardLayout/Sidebar.tsx`)
- **Overview**: Data Hub, Plan Status
- **Demand**: Consumption Plan, Pivot, Validation
- **Supply**: Shipments, Production, Kitting, MRP, Allocation
- **AI Assistant**: Nucleus

### Layout (`src/layouts/DashboardLayout/index.tsx`)
- Fixed 148px sidebar
- RunHeader at top
- `pageContent` div: `flex: 1; overflow-y: auto` — this is the scroll container for all page content

---

## Completed Work

### Consumption Plan View (3 pages)
Separated from StageView into dedicated pages with their own data generators.

**`src/containers/ConsumptionPlanPage.tsx`**
- State: displayBy (week/month), retailerFilter, unitOfMeasure
- Composes: ConsumptionFilterBar + ConsumptionTable

**`src/containers/ConsumptionPivotPage.tsx`**
- Aggregated demand view: Channel x Sub-Channel rows across 9 monthly periods
- Two-tier ACTUAL/FORECAST headers

**`src/containers/ConsumptionValidationPage.tsx`**
- Override review page with ActionTable (channel summary) + detail table (individual overrides)
- Tab toggle: Needs Review / Approved

**`src/data/lmnt-consumption-data.ts`**
- UPSPW-based methodology for retail channels
- Growth-rate-based methodology for online channels
- Monthly and weekly period generation from REF_YEAR=2026, REF_MONTH=3
- `getConsumptionPlanData()`, `getConsumptionPivotData()`, `getConsumptionValidationData()`

**`src/components/ConsumptionPlan/ConsumptionTable.tsx`**
- Two-tier headers (ACTUAL gray / FORECAST green)
- Expandable SKU rows with per-channel-type measure sets (RETAIL_MEASURES / ONLINE_MEASURES)
- Sticky columns, editable cells (green dashed borders), color-coded values

**`src/components/ConsumptionPlan/ConsumptionFilterBar.tsx`**
- Display (Week/Month), Retailer, UOM dropdowns

### StageView Unwinding (5 modules → individual sidebar links)
Removed the module-selector pills from StageView. Each supply module is now a direct sidebar link at `/plan/{moduleId}`. The StageView component itself still renders for Production, Kitting, MRP, and Allocation via the wildcard route `plan/:moduleId`.

**Key files:**
- `src/containers/StageViewPage.tsx` — Validates moduleId, generates walk data, passes config to StageView
- `src/components/StageView/StageView.tsx` — MODULE_META, DEFAULT_SEGMENTS, renders InboxBanner + ActionTable + DetailTable

### Shipments Rebuild — Time-Series WOS View (NEW)
Replaced the StageView ActionTable/DetailTable pattern with a full time-series WOS grid based on Neal's Chomps prototype.

**`src/data/lmnt-shipments-data.ts`**
- 16 weekly periods: 4 actual + 12 forecast (MM/DD labels)
- 96 SKU rows: 8 flavors x 2 top pack configs x 6 channels
- Forward-walking supply math: Starting Inv + Inbound - Sales = Ending Inv
- WOS = Ending Inventory / Weekly Demand
- Channel WOS aggregation (weighted average across SKUs)
- Status derivation: needs-review (<3 WOS), in-progress (3-5), ready (5+)
- Planner assignment: Mike T. → online (Shopify, Amazon, Wholesale), Dan O. → retail (Target, Walmart, Vitamin Shoppe)
- Filters: warehouse, channel, planner

**`src/components/ShipmentsPlan/WOSByChannelTable.tsx`**
- Top panel: 6 channel rows with status dots, SKU counts, eye icons
- Two-tier ACTUAL/FORECAST headers
- WOS values color-coded: red (<3), yellow (3-5), default (5+)
- Click row → sets selectedChannelId (filters bottom panel)

**`src/components/ShipmentsPlan/SupplyWalkBySKUTable.tsx`**
- Bottom panel: Channel x SKU rows with sparse shipment values
- Expandable rows → 10 supply walk measures with prefix indicators (+, -, =, .)
- Editable cells (green dashed borders) on Simulated Shipment Arrivals and Simulated Shipment Qty
- Filter chip showing selected channel with X to clear
- Save button (visual only, not wired)
- Legend: Actual, Forecast, Editable Input

**`src/components/ShipmentsPlan/ShipmentsFilterBar.tsx`**
- Warehouse, Channel, Planner dropdowns
- Clear all link (visible when any filter active)
- Status legend (dots: yellow=Needs Review, blue=In Progress, green=Ready)
- Export button

**`src/containers/ShipmentsPlanPage.tsx`**
- State: warehouseFilter, channelFilter, plannerFilter, selectedChannelId
- useMemo data generation on filter changes
- Composes: header → ShipmentsFilterBar → WOSByChannelTable → SupplyWalkBySKUTable

**`src/docs/shipments.md`** — Intent documentation

---

## Master Data (`src/data/lmnt-master-data.ts`)

| Entity | Count | Key Fields |
|---|---|---|
| FLAVORS | 8 | monthlyDemand (1.2M-4.5M sticks), seasonality[12] |
| PACK_CONFIGS | 4 | 30-count (45%), 10-variety (25%), 8-single (20%), sample-6 (10%) |
| CHANNELS | 6 | 3 online (Shopify 30%, Amazon 25%, Wholesale 10%), 3 retail (Target 15%, Walmart 12%, Vitamin Shoppe 8%) |
| WAREHOUSES | 5 | 3PL East/West/Central, Amazon FBA, Retail DC |
| COMAN_SITES | 4 | 2 tolling+kitting (Site A, B), 2 kitting-only (Site C, D) |

---

## Remaining Work

### Rebuild other 4 supply modules (same pattern as Shipments)
Each module should follow the Shipments pattern: dedicated data generator, WOS top panel, expandable detail bottom panel, filter bar. The specific measures and terminology will differ per module:

- **Production**: WOS by Co-Man Site, production walk by flavor/line (measures: planned batches, capacity, WIP inventory, etc.)
- **Kitting**: WOS by Pack Config, kitting walk by kit SKU (measures: components on hand, kitting orders, assembled inventory)
- **MRP**: WOS by Material, material requirements walk (measures: gross requirements, scheduled receipts, planned orders, on-hand)
- **Allocation**: WOS by Warehouse, allocation walk by channel/warehouse (measures: available inventory, allocated qty, in-transit, shortfall)

### Intent documentation for other pages
Create `src/docs/` files for: consumption-plan.md, consumption-pivot.md, consumption-validation.md, production.md, kitting.md, mrp.md, allocation.md

### Known issues / polish items
- WOS color coding: all channels currently show healthy WOS (5+) due to generous safety stock. May want to tune data generator to create some red/yellow cells for demo impact.
- Save button on Supply Walk is visual only — not wired to any state management.
- Export button is visual only.
- Editable cells don't actually capture input — they have the dashed border styling but no onChange handler.

---

## Key Patterns to Reuse

| Pattern | Reference File | Description |
|---|---|---|
| Two-tier headers | `ConsumptionTable.tsx:289-305` | ACTUAL (gray) / FORECAST (green) group headers |
| Expandable rows | `ConsumptionTable.tsx:308-330` | Chevron toggle, Set<string> state, Fragment wrapping |
| Editable cells | `ConsumptionTable.tsx:183-196` | `border: 1px dashed #86EFAC; cursor: text;` on forecast periods |
| Sticky columns | `ConsumptionTable.tsx:81-111` | `position: sticky; left: 0; z-index: 2-3;` |
| Seeded data | `lmnt-consumption-data.ts:147-149` | `hashStr()` + `seededRand()` for deterministic mock data |
| Filter bar | `ConsumptionFilterBar.tsx` | Label + select groups, uppercase labels, gray200 borders |
| WOS color coding | `WOSByChannelTable.tsx:20-28` | `<3 red, 3-5 yellow, 5+ default` |
| Supply walk math | `lmnt-shipments-data.ts:105-170` | Forward-walking loop, ending_inv carries to next period |

## Tech Stack
- Vite + React 19 + TypeScript
- Emotion CSS-in-JS (`@emotion/react`, `css` prop)
- react-router v7 (`createBrowserRouter`)
- lucide-react for icons
- No external table library — all tables are hand-built `<table>` elements
- `seededRand()` utility for deterministic PRNG (`src/utils/random.ts`)
