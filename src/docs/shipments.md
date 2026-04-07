# Shipments Plan View

## Purpose
The Shipments page is the first stage of the LMNT supply chain, focused on customer-facing shipment planning. It answers: "Do we have enough finished goods in the right warehouses to fulfill demand across all channels for the next 12 weeks?"

## User Flow
1. **Planner opens Shipments** from the sidebar — sees the WOS (Weeks of Supply) health dashboard across all 6 channels.
2. **Scans for red/yellow cells** in the top panel — these indicate channels where supply is critically low (<3 WOS) or at risk (3-5 WOS).
3. **Clicks a channel row** to filter the bottom panel to that channel's SKUs only.
4. **Expands a SKU row** to see the full supply walk: how inventory flows from beginning to ending each week, including open shipments, simulated arrivals, forecast sales, and resulting WOS.
5. **Edits simulated shipment values** (green dashed cells) to model "what if" scenarios — e.g., pulling forward a shipment to cover a low-WOS week.
6. **Uses filters** (Warehouse, Channel, Planner) to focus on their assigned portion of the plan.

## Key Concepts

### Weeks of Supply (WOS)
WOS = Ending Inventory / Weekly Demand. This is the core metric. Color thresholds:
- **Red (<3)**: Critical — risk of stockout within 3 weeks
- **Yellow (3-5)**: At risk — needs attention
- **Default (5+)**: Healthy supply position

### Supply Walk
A forward-walking inventory calculation per SKU per week:
- Starting Inventory (= prior week's Ending Inventory)
- `+` Open Shipment Arrivals (confirmed inbound)
- `+` Simulated Shipment Arrivals (planner-modeled, editable)
- `−` Forecast Sales
- `+` Unfulfilled Demand (demand that couldn't be fulfilled)
- `=` Net Supply Balance (inbound − outbound)
- `=` Ending Inventory (Starting + Net Balance)
- `·` Promotions (promotional lift, sparse)
- `=` Starting / Ending WOS

### Channel Status
Derived from forecast-period WOS values:
- **Needs Review** (yellow dot): Any forecast week has WOS < 3
- **In Progress** (blue dot): Any forecast week has WOS 3-5, none < 3
- **Ready** (green dot): All forecast weeks have WOS >= 5

## Data Mapping (from Neal's Chomps prototype)
| Neal's Chomps Term | LMNT Term | Source |
|---|---|---|
| Retailer | Channel | `CHANNELS` in `lmnt-master-data.ts` |
| Product / SKU | Flavor × Pack Config | `FLAVORS` × `PACK_CONFIGS` |
| Warehouse | Warehouse / 3PL | `WAREHOUSES` in `lmnt-master-data.ts` |
| Planner | Planner | Mike T. (online) / Dan O. (retail) |

## Layout
- **Top Panel**: "Weeks of Supply by Channel" — 6 rows × 16 weekly columns, click-to-filter
- **Bottom Panel**: "Supply Walk by SKU" — expandable rows with 10 measure child rows
- **Filter Bar**: Warehouse, Channel, Planner dropdowns + status legend + Export

## Time Horizon
- 4 actual weeks (historical) + 12 forecast weeks = 16 total weekly columns
- Reference date: April 1, 2026
- Period labels: MM/DD format (e.g., "03/11", "04/01")
