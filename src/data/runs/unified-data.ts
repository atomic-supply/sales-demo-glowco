// ============================================================================
// UNIFIED DATA - Master reference entities and planning data
// Archer Meat Snacks Demo
// ============================================================================

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SKU {
  id: string
  code: string
  name: string
  flavor: string
  species: string
  productCategory: string
  protein: string
  size: string
  planner: string
  sellableUnitType: string
  productionUnitType: string
  casePack: number
  palletTi: number
  palletHi: number
  isActive: boolean
}

export interface CoManSite {
  id: string
  name: string
  code: string
  region: string
  address: string
  capacityPerWeek: number
  capabilities: string[]
  isActive: boolean
}

export interface KitCenter {
  id: string
  name: string
  code: string
  region: string
  address: string
  capacityPerWeek: number
  isActive: boolean
}

export interface ShipToLocation {
  id: string
  name: string
  code: string
  customer: string
  channel: string
  region: string
  address: string
  transitTimeDays: number
  isActive: boolean
}

export interface Supplier {
  id: string
  name: string
  code: string
  materialCategories: string[]
  leadTimeDays: number
  minOrderQty: number
  orderMultiple: number
  contactEmail: string
  isActive: boolean
}

export interface Material {
  id: string
  name: string
  code: string
  category: string
  supplierUnit: string
  yieldPerThousandSticks: number
  suppliers: string[]
  isActive: boolean
}

// ============================================================================
// MASTER DATA - Core Reference Entities
// ============================================================================

export const skus: SKU[] = [
  // Beef Jerky SKUs
  { id: "sku-001", code: "OB24", name: "Original Beef Jerky 2.5oz 24ct Shipper", flavor: "Original", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "2.5oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-002", code: "OB144", name: "Original Beef Jerky 2.5oz 144ct Master Case", flavor: "Original", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "2.5oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 144, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-003", code: "MH24", name: "Mango Habanero Jerky 2.5oz 24ct Shipper", flavor: "Mango Habanero", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "2.5oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-004", code: "TK24", name: "Teriyaki Jerky 2.5oz 24ct Shipper", flavor: "Teriyaki", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "2.5oz", planner: "Sam", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-005", code: "HC24", name: "Hatch Chile Jerky 2.5oz 24ct Shipper", flavor: "Hatch Chile", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "2.5oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  // Turkey Jerky
  { id: "sku-006", code: "HS24", name: "Hickory Smoke Turkey Jerky 2.5oz 24ct Shipper", flavor: "Hickory Smoke", species: "Turkey", productCategory: "Turkey Jerky", protein: "Turkey", size: "2.5oz", planner: "Sam", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  // Mini Sticks
  { id: "sku-007", code: "OBS16", name: "Original Beef Mini Sticks 16ct Bag", flavor: "Original", species: "Beef", productCategory: "Mini Sticks", protein: "Beef", size: "0.5oz", planner: "Sam", sellableUnitType: "Bag", productionUnitType: "Stick", casePack: 16, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-008", code: "BCS16", name: "Beef & Cheese Mini Sticks 16ct Bag", flavor: "Beef & Cheese", species: "Beef", productCategory: "Mini Sticks", protein: "Beef", size: "0.5oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Stick", casePack: 16, palletTi: 12, palletHi: 8, isActive: true },
  // Full-Size Sticks
  { id: "sku-009", code: "JBS10", name: "Jalapeno Beef Stick 1oz 10ct Box", flavor: "Jalapeno", species: "Beef", productCategory: "Sticks", protein: "Beef", size: "1oz", planner: "Sam", sellableUnitType: "Stick", productionUnitType: "Stick", casePack: 10, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-010", code: "RTS10", name: "Rosemary Turkey Stick 1oz 10ct Box", flavor: "Rosemary", species: "Turkey", productCategory: "Sticks", protein: "Turkey", size: "1oz", planner: "Sam", sellableUnitType: "Stick", productionUnitType: "Stick", casePack: 10, palletTi: 12, palletHi: 8, isActive: true },
  // Large Format Jerky
  { id: "sku-011", code: "OB7", name: "Original Beef Jerky 7oz Bag", flavor: "Original", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "7oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 12, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-012", code: "OB16", name: "Original Beef Jerky 16oz Bag", flavor: "Original", species: "Beef", productCategory: "Jerky", protein: "Beef", size: "16oz", planner: "Sam", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 6, palletTi: 12, palletHi: 8, isActive: true },
  // Cowboy Cut
  { id: "sku-013", code: "CW12", name: "Cowboy Cut Old Fashioned 2oz 12ct Shipper", flavor: "Cowboy Cut", species: "Beef", productCategory: "Cowboy Cut", protein: "Beef", size: "2oz", planner: "Alex", sellableUnitType: "Bag", productionUnitType: "Piece", casePack: 12, palletTi: 12, palletHi: 8, isActive: true },
  // Variety Packs
  { id: "sku-014", code: "VP12", name: "Best Sellers Variety 12ct Club Pack", flavor: "Variety", species: "Mixed", productCategory: "Variety", protein: "Mixed", size: "Mixed", planner: "Sam", sellableUnitType: "Pack", productionUnitType: "Piece", casePack: 12, palletTi: 12, palletHi: 8, isActive: true },
]

export const coManSites: CoManSite[] = [
  { id: "coman-001", name: "San Bernardino Facility", code: "SB-MAIN", region: "West", address: "San Bernardino, CA", capacityPerWeek: 600000, capabilities: ["Jerky Slicing", "Marinating", "Drying", "Original", "Mango Habanero", "Teriyaki", "Hatch Chile", "Cowboy Cut"], isActive: true },
  { id: "coman-002", name: "Midwest Meat Co", code: "MW-MEAT", region: "Midwest", address: "Midwest, USA", capacityPerWeek: 450000, capabilities: ["Stick Extrusion", "Sausage Production", "Mini Sticks", "Full-Size Sticks", "High Volume"], isActive: true },
  { id: "coman-003", name: "Pacific Jerky Works", code: "PAC-JW", region: "West", address: "West, USA", capacityPerWeek: 300000, capabilities: ["Jerky Overflow", "Cowboy Cut", "Specialty Runs", "Small Batch"], isActive: true },
  { id: "coman-004", name: "Southeast Protein Processing", code: "SE-PROT", region: "Southeast", address: "Southeast, USA", capacityPerWeek: 350000, capabilities: ["Turkey Processing", "Turkey Jerky", "Turkey Sticks", "Mini Sticks"], isActive: true },
]

export const kitCenters: KitCenter[] = [
  { id: "kit-001", name: "SB Kitting", code: "SB-KIT", region: "West", address: "San Bernardino, CA", capacityPerWeek: 400000, isActive: true },
  { id: "kit-002", name: "Midwest Kitting", code: "MW-KIT", region: "Midwest", address: "Midwest, USA", capacityPerWeek: 300000, isActive: true },
  { id: "kit-003", name: "Central Kitting", code: "CENTRAL-KIT", region: "Central", address: "Central, USA", capacityPerWeek: 250000, isActive: true },
]

export const shipToLocations: ShipToLocation[] = [
  // Convenience & Gas
  { id: "ship-001", name: "7-Eleven", code: "7-ELEVEN", customer: "Convenience", channel: "Convenience", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-002", name: "Circle K", code: "CIRCLE-K", customer: "Convenience", channel: "Convenience", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-003", name: "Pilot/Flying J", code: "PILOT-FJ", customer: "Convenience", channel: "Convenience", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  // Grocery / Retail
  { id: "ship-004", name: "Kroger", code: "KROGER", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-005", name: "Target", code: "TARGET", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-006", name: "Target.com", code: "TARGET-COM", customer: "Grocery", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-007", name: "Walmart", code: "WALMART", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-008", name: "Whole Foods", code: "WFM", customer: "Natural", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-009", name: "Sprouts", code: "SPROUTS", customer: "Natural", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-010", name: "HEB", code: "HEB", customer: "Grocery", channel: "Retail", region: "Texas", address: "Texas", transitTimeDays: 3, isActive: true },
  { id: "ship-011", name: "Albertsons/Safeway", code: "ABS-SWY", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-012", name: "Natural Grocers", code: "NAT-GROC", customer: "Natural", channel: "Retail", region: "West", address: "West", transitTimeDays: 3, isActive: true },
  // Club
  { id: "ship-013", name: "Costco", code: "COSTCO", customer: "Club", channel: "Club", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-014", name: "Sam's Club", code: "SAMS", customer: "Club", channel: "Club", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  // Distributors
  { id: "ship-015", name: "Core-Mark", code: "COREMARK", customer: "Distributor", channel: "Distribution", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-016", name: "McLane", code: "MCLANE", customer: "Distributor", channel: "Distribution", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-017", name: "KeHE", code: "KEHE", customer: "Distributor", channel: "Distribution", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-018", name: "UNFI", code: "UNFI", customer: "Distributor", channel: "Distribution", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  // Ecommerce / DTC
  { id: "ship-019", name: "Shopify B2B", code: "SHOPIFY-B2B", customer: "DTC", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-020", name: "Shopify D2C", code: "SHOPIFY-D2C", customer: "DTC", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-021", name: "Amazon", code: "AMAZON", customer: "Ecommerce", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-022", name: "Amazon Fresh", code: "AMAZON-FRESH", customer: "Ecommerce", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-023", name: "Hudson News", code: "HUDSON", customer: "Travel", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
]

export const suppliers: Supplier[] = [
  { id: "sup-001", name: "Premium Beef Supply", code: "BEEF-PBS", materialCategories: ["Grass-Fed Beef", "Beef Trim"], leadTimeDays: 7, minOrderQty: 20000, orderMultiple: 5000, contactEmail: "orders@premiumbeef.com", isActive: true },
  { id: "sup-002", name: "Heritage Turkey Farms", code: "TURK-HTF", materialCategories: ["All-Natural Turkey", "Turkey Breast"], leadTimeDays: 10, minOrderQty: 10000, orderMultiple: 2500, contactEmail: "orders@heritageturkey.com", isActive: true },
  { id: "sup-003", name: "Spice & Marinade Co", code: "SPICE-SM", materialCategories: ["Marinades", "Seasoning Blends", "Spice Mixes"], leadTimeDays: 14, minOrderQty: 5000, orderMultiple: 1000, contactEmail: "orders@spicemarinade.com", isActive: true },
  { id: "sup-004", name: "FlexPak Solutions", code: "PKG-FP", materialCategories: ["Bags", "Pouches", "Shippers", "Boxes"], leadTimeDays: 12, minOrderQty: 10000, orderMultiple: 5000, contactEmail: "orders@flexpaksolutions.com", isActive: true },
]

export const materials: Material[] = [
  { id: "mat-001", name: "Grass-Fed Beef", code: "BEEF-GF", category: "Raw Protein", supplierUnit: "lbs", yieldPerThousandSticks: 120, suppliers: ["sup-001"], isActive: true },
  { id: "mat-002", name: "All-Natural Turkey", code: "TURK-AN", category: "Raw Protein", supplierUnit: "lbs", yieldPerThousandSticks: 95, suppliers: ["sup-002"], isActive: true },
  { id: "mat-003", name: "Original Marinade Blend", code: "MAR-ORIG", category: "Marinades", supplierUnit: "lbs", yieldPerThousandSticks: 18, suppliers: ["sup-003"], isActive: true },
  { id: "mat-004", name: "Teriyaki Marinade", code: "MAR-TERI", category: "Marinades", supplierUnit: "lbs", yieldPerThousandSticks: 20, suppliers: ["sup-003"], isActive: true },
  { id: "mat-005", name: "Mango Habanero Seasoning", code: "SEA-MHAB", category: "Seasonings", supplierUnit: "lbs", yieldPerThousandSticks: 12, suppliers: ["sup-003"], isActive: true },
  { id: "mat-006", name: "Collagen Casings", code: "CAS-COL", category: "Casings", supplierUnit: "units", yieldPerThousandSticks: 1000, suppliers: ["sup-004"], isActive: true },
  { id: "mat-007", name: "2.5oz Resealable Bag", code: "BAG-2.5", category: "Packaging", supplierUnit: "units", yieldPerThousandSticks: 1000, suppliers: ["sup-004"], isActive: true },
  { id: "mat-008", name: "24ct Shipper Box", code: "BOX-24CT", category: "Packaging", supplierUnit: "units", yieldPerThousandSticks: 42, suppliers: ["sup-004"], isActive: true },
]

// ============================================================================
// PLANNING DATA
// ============================================================================

export const PLANNING_PERIODS = 16

export const planningDateRange = {
  from: "12/01/25",
  to: "03/31/26",
}

export const productionSKUData: Record<string, { initialStartingInventory: number; productionPlanned: number[]; kittingDemand: number[]; targetWOS: number[] }> = {
  "OB24": {
    initialStartingInventory: 520000,
    productionPlanned: [348000, 390000, 355000, 568000, 85000, 264000, 207000, 172000, 294000, 440000, 397000, 259000, 362000, 328000, 338000, 352000],
    kittingDemand: [288000, 430000, 750000, 574000, 715000, 614000, 765000, 570000, 522000, 574000, 506000, 419000, 355000, 354000, 365000, 358000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "MH24": {
    initialStartingInventory: 392000,
    productionPlanned: [260000, 290000, 269000, 441000, 66000, 200000, 163000, 135000, 223000, 331000, 296000, 196000, 273000, 247000, 255000, 266000],
    kittingDemand: [218000, 324000, 565000, 434000, 540000, 463000, 578000, 430000, 394000, 433000, 382000, 316000, 267000, 267000, 276000, 272000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "TK24": {
    initialStartingInventory: 305000,
    productionPlanned: [203000, 226000, 210000, 343000, 52000, 156000, 127000, 106000, 174000, 258000, 232000, 153000, 212000, 193000, 203000, 211000],
    kittingDemand: [170000, 252000, 441000, 339000, 422000, 361000, 451000, 335000, 308000, 338000, 298000, 247000, 210000, 208000, 217000, 214000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "HC24": {
    initialStartingInventory: 261000,
    productionPlanned: [174000, 193000, 179000, 294000, 44000, 134000, 109000, 90000, 149000, 221000, 198000, 131000, 182000, 165000, 176000, 183000],
    kittingDemand: [145000, 217000, 378000, 290000, 361000, 309000, 386000, 287000, 264000, 290000, 255000, 211000, 179000, 178000, 186000, 183000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "VP12": {
    initialStartingInventory: 216000,
    productionPlanned: [143000, 160000, 149000, 243000, 37000, 110000, 90000, 74000, 123000, 182000, 164000, 108000, 150000, 137000, 145000, 152000],
    kittingDemand: [120000, 179000, 313000, 240000, 299000, 256000, 320000, 237000, 218000, 240000, 211000, 175000, 149000, 147000, 155000, 152000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

export const coManProductionData: Record<string, Record<string, { capacity: number[]; planned: number[]; overrides: (number | null)[] }>> = {
  "San Bernardino Facility": {
    "OB24": {
      capacity: [420000, 448000, 434000, 630000, 210000, 350000, 280000, 252000, 392000, 490000, 448000, 350000, 420000, 392000, 406000, 420000],
      planned: [209000, 234000, 213000, 341000, 51000, 158000, 124000, 103000, 176000, 264000, 238000, 155000, 217000, 197000, 203000, 211000],
      overrides: Array(16).fill(null),
    },
    "MH24": {
      capacity: [350000, 378000, 364000, 532000, 168000, 294000, 238000, 210000, 336000, 420000, 378000, 294000, 350000, 322000, 336000, 350000],
      planned: [156000, 174000, 161000, 265000, 40000, 120000, 98000, 81000, 134000, 199000, 178000, 118000, 164000, 148000, 153000, 160000],
      overrides: Array(16).fill(null),
    },
  },
  "Midwest Meat Co": {
    "TK24": {
      capacity: [252000, 280000, 266000, 392000, 126000, 210000, 168000, 154000, 238000, 294000, 266000, 210000, 252000, 238000, 245000, 252000],
      planned: [105000, 117000, 107000, 171000, 26000, 79000, 62000, 52000, 88000, 132000, 119000, 78000, 109000, 99000, 103000, 107000],
      overrides: Array(16).fill(null),
    },
    "HC24": {
      capacity: [210000, 238000, 224000, 336000, 105000, 182000, 147000, 133000, 210000, 259000, 231000, 182000, 210000, 196000, 203000, 210000],
      planned: [78000, 87000, 81000, 132000, 20000, 60000, 49000, 41000, 67000, 99000, 89000, 59000, 82000, 74000, 78000, 82000],
      overrides: Array(16).fill(null),
    },
  },
  "Pacific Jerky Works": {
    "VP12": {
      capacity: [168000, 196000, 182000, 252000, 84000, 140000, 112000, 98000, 154000, 196000, 182000, 140000, 168000, 154000, 161000, 168000],
      planned: [35000, 39000, 36000, 57000, 9000, 26000, 21000, 17000, 30000, 44000, 40000, 26000, 37000, 33000, 35000, 36000],
      overrides: Array(16).fill(null),
    },
  },
}

export const coManPartners = ["San Bernardino Facility", "Midwest Meat Co", "Pacific Jerky Works"]

export const kittingPlanData = [
  {
    sku: "OB24",
    initialBulkInventory: 480000,
    kittingDemand: [288000, 430000, 750000, 574000, 715000, 614000, 765000, 570000, 522000, 574000, 506000, 419000, 355000, 354000, 365000, 358000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    kitCenters: [
      { name: "SB Kitting", weeklyCapacity: Array(16).fill(620000), weeklyPlanned: [248000, 303000, 524000, 400000, 496000, 428000, 538000, 400000, 372000, 400000, 358000, 290000, 248000, 248000, 255000, 252000] },
      { name: "Central Kitting", weeklyCapacity: Array(16).fill(420000), weeklyPlanned: [40000, 127000, 226000, 174000, 219000, 186000, 227000, 170000, 150000, 174000, 148000, 129000, 107000, 106000, 110000, 106000] },
    ],
  },
  {
    sku: "MH24",
    initialBulkInventory: 386000,
    kittingDemand: [241000, 290000, 393000, 331000, 407000, 358000, 427000, 345000, 317000, 352000, 331000, 290000, 262000, 255000, 266000, 261000],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      { name: "SB Kitting", weeklyCapacity: Array(16).fill(480000), weeklyPlanned: [165000, 200000, 269000, 228000, 276000, 248000, 290000, 234000, 221000, 241000, 228000, 200000, 179000, 173000, 179000, 176000] },
      { name: "Midwest Kitting", weeklyCapacity: Array(16).fill(280000), weeklyPlanned: [76000, 90000, 124000, 103000, 131000, 110000, 137000, 111000, 96000, 111000, 103000, 90000, 83000, 82000, 87000, 85000] },
    ],
  },
  {
    sku: "TK24",
    initialBulkInventory: 303000,
    kittingDemand: [193000, 232000, 314000, 265000, 325000, 287000, 342000, 276000, 254000, 281000, 265000, 232000, 210000, 204000, 214000, 210000],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      { name: "Central Kitting", weeklyCapacity: Array(16).fill(350000), weeklyPlanned: [124000, 149000, 201000, 170000, 208000, 184000, 219000, 177000, 163000, 180000, 170000, 149000, 135000, 131000, 137000, 135000] },
      { name: "Midwest Kitting", weeklyCapacity: Array(16).fill(210000), weeklyPlanned: [69000, 83000, 113000, 95000, 117000, 103000, 123000, 99000, 91000, 101000, 95000, 83000, 75000, 73000, 77000, 75000] },
    ],
  },
]

export const materialsPlanData = [
  {
    material: "Grass-Fed Beef",
    canonicalUnit: "lbs",
    coManConsumption: [
      { coMan: "San Bernardino Facility", materialRequirement: [84000, 81000, 87000, 86000, 82000, 84000, 89000, 86000, 81000, 86000, 87000, 84000, 82000, 86000, 84000, 87000] },
      { coMan: "Midwest Meat Co", materialRequirement: [72000, 69000, 75000, 74000, 71000, 72000, 77000, 74000, 69000, 74000, 75000, 72000, 71000, 74000, 72000, 75000] },
      { coMan: "Pacific Jerky Works", materialRequirement: [48000, 46000, 50000, 49000, 47000, 48000, 52000, 49000, 46000, 49000, 50000, 48000, 47000, 49000, 48000, 50000] },
    ],
    suppliers: [
      { name: "Premium Beef Supply", coMansServed: ["San Bernardino Facility", "Midwest Meat Co", "Pacific Jerky Works"], materialRequirement: [204000, 196000, 212000, 209000, 200000, 204000, 218000, 209000, 196000, 209000, 212000, 204000, 200000, 209000, 204000, 212000], yieldFactor: 0.92 },
    ],
    onHandInventory: [280000, 272000, 264000, 260000, 256000, 248000, 244000, 240000, 236000, 232000, 228000, 224000, 220000, 216000, 212000, 208000],
    inboundMaterial: [160000, 154000, 166000, 163000, 158000, 160000, 170000, 164000, 156000, 163000, 166000, 160000, 158000, 163000, 160000, 164000],
    plannedSupply: [240000, 232000, 248000, 244000, 236000, 240000, 254000, 246000, 234000, 244000, 248000, 240000, 236000, 244000, 240000, 246000],
  },
  {
    material: "All-Natural Turkey",
    canonicalUnit: "lbs",
    coManConsumption: [
      { coMan: "Southeast Protein Processing", materialRequirement: [4200, 4000, 4500, 4400, 4200, 4200, 4700, 4400, 4000, 4400, 4500, 4200, 4200, 4400, 4200, 4500] },
    ],
    suppliers: [
      { name: "Heritage Turkey Farms", coMansServed: ["Southeast Protein Processing"], materialRequirement: [4200, 4000, 4500, 4400, 4200, 4200, 4700, 4400, 4000, 4400, 4500, 4200, 4200, 4400, 4200, 4500], yieldFactor: 0.94 },
    ],
    onHandInventory: [10200, 9800, 9400, 9100, 8800, 8400, 8000, 7600, 7300, 6900, 6500, 6100, 5800, 5400, 5000, 4600],
    inboundMaterial: [3400, 3200, 3600, 3500, 3400, 3400, 3800, 3500, 3200, 3500, 3600, 3400, 3400, 3500, 3400, 3600],
    plannedSupply: [4600, 4400, 4900, 4700, 4500, 4600, 5100, 4800, 4400, 4700, 4900, 4600, 4500, 4700, 4600, 4800],
  },
]

export const allocationPlanData = [
  {
    sku: "OB24",
    startingNetworkInventory: 338000,
    inboundFG: [44000, 43000, 47000, 45000, 43000, 46000, 48000, 44000, 43000, 47000, 45000, 43000, 46000, 48000, 44000, 43000],
    warehouses: [
      { name: "Costco", allocationPlanned: [17000, 17000, 18000, 17000, 16000, 18000, 19000, 17000, 17000, 18000, 17000, 16000, 18000, 19000, 17000, 17000], shipmentDemand: [16000, 16000, 17000, 16000, 17000, 17000, 18000, 16000, 16000, 17000, 16000, 17000, 17000, 18000, 16000, 16000], startingInventory: 117000, targetWOS: 6.0 },
      { name: "Target", allocationPlanned: [13000, 13000, 14000, 13000, 12000, 14000, 14000, 13000, 13000, 14000, 13000, 12000, 14000, 14000, 13000, 13000], shipmentDemand: [12000, 13000, 13000, 12000, 13000, 13000, 14000, 12000, 13000, 13000, 12000, 13000, 13000, 14000, 12000, 13000], startingInventory: 99000, targetWOS: 6.0 },
      { name: "Whole Foods", allocationPlanned: [9000, 9000, 10000, 9000, 9000, 10000, 10000, 9000, 9000, 10000, 9000, 9000, 10000, 10000, 9000, 9000], shipmentDemand: [8000, 9000, 9000, 9000, 8000, 9000, 9000, 8000, 9000, 9000, 9000, 8000, 9000, 9000, 8000, 9000], startingInventory: 66000, targetWOS: 5.5 },
    ],
  },
  {
    sku: "TK24",
    startingNetworkInventory: 255000,
    inboundFG: [39000, 38000, 40000, 39000, 37000, 39000, 41000, 39000, 38000, 40000, 39000, 37000, 39000, 41000, 39000, 38000],
    warehouses: [
      { name: "Costco", allocationPlanned: [15000, 14000, 16000, 15000, 14000, 15000, 16000, 15000, 14000, 16000, 15000, 14000, 15000, 16000, 15000, 14000], shipmentDemand: [14000, 14000, 15000, 14000, 15000, 15000, 15000, 14000, 14000, 15000, 14000, 15000, 15000, 15000, 14000, 14000], startingInventory: 94000, targetWOS: 5.5 },
      { name: "Target", allocationPlanned: [12000, 11000, 12000, 12000, 11000, 12000, 13000, 12000, 11000, 12000, 12000, 11000, 12000, 13000, 12000, 11000], shipmentDemand: [11000, 11000, 12000, 11000, 11000, 12000, 12000, 11000, 11000, 12000, 11000, 11000, 12000, 12000, 11000, 11000], startingInventory: 76000, targetWOS: 5.5 },
    ],
  },
]

export const COMAN_SITES = ["San Bernardino Facility", "Midwest Meat Co", "Pacific Jerky Works"]

// Consumption Plan - Retailer SKU Mapping
export const retailerSkuMapping: Record<string, Array<{ sku: string; name: string }>> = {
  Target: [
    { sku: "OB24", name: "Original Beef Jerky 2.5oz 24ct Shipper" },
    { sku: "MH24", name: "Mango Habanero Jerky 2.5oz 24ct Shipper" },
    { sku: "HC24", name: "Hatch Chile Jerky 2.5oz 24ct Shipper" },
  ],
  Walmart: [
    { sku: "OB24", name: "Original Beef Jerky 2.5oz 24ct Shipper" },
    { sku: "MH24", name: "Mango Habanero Jerky 2.5oz 24ct Shipper" },
    { sku: "TK24", name: "Teriyaki Jerky 2.5oz 24ct Shipper" },
    { sku: "OBS16", name: "Original Beef Mini Sticks 16ct Bag" },
  ],
  Costco: [
    { sku: "VP12", name: "Best Sellers Variety 12ct Club Pack" },
    { sku: "OB16", name: "Original Beef Jerky 16oz Bag" },
  ],
}

export const consumptionPlanRetailers = ["Target", "Walmart", "Costco"]

// ============================================================================
// DERIVED CONSTANTS - used by ShipmentsValidation and other views
// ============================================================================

export const allSKUCodes: string[] = skus.map((s) => s.code)

export const thirdPLNames: string[] = [
  "Vertex DTC - West",
  "Vertex B2B - Central",
  "Meridian Logistics",
  "Atlas Fulfillment",
  "Pacific 3PL",
  "Central 3PL",
  "East Coast 3PL",
]

export const coManNames: string[] = coManSites.map((c) => c.name)
