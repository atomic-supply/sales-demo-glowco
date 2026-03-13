// ============================================================================
// UNIFIED DATA - Master reference entities and planning data
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
  // Original Oat SKUs
  { id: "sku-001", code: "CO24", name: "Original Oat Bar 24ct Box", flavor: "Original Oat", species: "Plant-Based", productCategory: "Original Oat", protein: "Oat Protein", size: "Full Size", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-002", code: "CO144", name: "Original Oat Bar 144ct Master Case", flavor: "Original Oat", species: "Plant-Based", productCategory: "Original Oat", protein: "Oat Protein", size: "Full Size", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 144, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-003", code: "COP8", name: "Original Oat Bar 8ct Pouch", flavor: "Original Oat", species: "Plant-Based", productCategory: "Original Oat", protein: "Oat Protein", size: "Full Size", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 8, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-004", code: "COP12", name: "Original Oat Bar 12ct Club Pouch", flavor: "Original Oat", species: "Plant-Based", productCategory: "Original Oat", protein: "Oat Protein", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 12, palletTi: 12, palletHi: 8, isActive: true },
  // Dark Chocolate SKUs
  { id: "sku-005", code: "CJ24", name: "Dark Chocolate Bar 24ct Box", flavor: "Dark Chocolate", species: "Plant-Based", productCategory: "Dark Chocolate", protein: "Pea Protein", size: "Full Size", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-006", code: "CH24", name: "Hazelnut Crunch Bar 24ct Box", flavor: "Hazelnut Crunch", species: "Plant-Based", productCategory: "Dark Chocolate", protein: "Pea Protein", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-007", code: "CIB24", name: "Cinnamon Roll Bar 24ct Box", flavor: "Cinnamon Roll", species: "Plant-Based", productCategory: "Original Oat", protein: "Oat Protein", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-008", code: "CB24", name: "Peanut Butter Bar 24ct Box", flavor: "Peanut Butter", species: "Plant-Based", productCategory: "Peanut Butter", protein: "Oat Protein", size: "Full Size", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  // Vanilla Almond SKUs
  { id: "sku-009", code: "CTOTJ24", name: "Vanilla Almond Bar 24ct Box", flavor: "Vanilla Almond", species: "Plant-Based", productCategory: "Vanilla Almond", protein: "Almond Protein", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  { id: "sku-010", code: "CTOTJP12", name: "Vanilla Almond Bar 12ct Club Pouch", flavor: "Vanilla Almond", species: "Plant-Based", productCategory: "Vanilla Almond", protein: "Almond Protein", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 12, palletTi: 12, palletHi: 8, isActive: true },
  // Mixed Berry SKUs
  { id: "sku-011", code: "COV24", name: "Mixed Berry Bar 24ct Box", flavor: "Mixed Berry", species: "Plant-Based", productCategory: "Mixed Berry", protein: "Oat Protein", size: "Full Size", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  // Lemon Zest SKUs
  { id: "sku-012", code: "CKO24", name: "Lemon Zest Bar 24ct Box", flavor: "Lemon Zest", species: "Plant-Based", productCategory: "Lemon Zest", protein: "Oat Protein", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  // Mini Bites SKUs
  { id: "sku-013", code: "LCO24", name: "Mini Original Oat Bites 24ct", flavor: "Original Oat", species: "Plant-Based", productCategory: "Bites", protein: "Oat Protein", size: "Mini", planner: "Alex", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 24, palletTi: 12, palletHi: 8, isActive: true },
  // Variety Packs
  { id: "sku-014", code: "BSB10", name: "Best Sellers Variety 10ct", flavor: "Variety", species: "Plant-Based", productCategory: "Variety", protein: "Mixed", size: "Full Size", planner: "Sam", sellableUnitType: "Bar", productionUnitType: "Bar", casePack: 10, palletTi: 12, palletHi: 8, isActive: true },
]

export const coManSites: CoManSite[] = [
  { id: "coman-001", name: "Apex Manufacturing", code: "APEX", region: "Midwest", address: "Midwest, USA", capacityPerWeek: 8000000, capabilities: ["Original Oat", "Dark Chocolate", "Vanilla Almond", "Box Assembly"], isActive: true },
  { id: "coman-002", name: "Summit Pack", code: "SUMMIT", region: "Midwest", address: "Midwest, USA", capacityPerWeek: 6000000, capabilities: ["Pouch Kitting", "Club Packs", "Costco"], isActive: true },
  { id: "coman-003", name: "Cascade Nutrition", code: "CASCADE", region: "West", address: "West, USA", capacityPerWeek: 4000000, capabilities: ["Lemon Zest", "Mixed Berry", "Pouch Assembly"], isActive: true },
  { id: "coman-004", name: "Pinnacle Foods", code: "PINNACLE", region: "Southeast", address: "Southeast, USA", capacityPerWeek: 10000000, capabilities: ["Peanut Butter", "Vanilla Almond", "High Volume"], isActive: true },
]

export const kitCenters: KitCenter[] = [
  { id: "kit-001", name: "Apex Kitting", code: "APEX-KIT", region: "Midwest", address: "Midwest, USA", capacityPerWeek: 5000000, isActive: true },
  { id: "kit-002", name: "Summit Kitting", code: "SUMMIT-KIT", region: "Midwest", address: "Midwest, USA", capacityPerWeek: 4000000, isActive: true },
  { id: "kit-003", name: "Central Kitting", code: "CENTRAL-KIT", region: "West", address: "West, USA", capacityPerWeek: 3000000, isActive: true },
]

export const shipToLocations: ShipToLocation[] = [
  // Convenience & Gas
  { id: "ship-001", name: "EG America", code: "EG-AMERICA", customer: "Convenience", channel: "Convenience", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-002", name: "Family Express", code: "FAMILY-EXP", customer: "Convenience", channel: "Convenience", region: "Midwest", address: "Midwest", transitTimeDays: 2, isActive: true },
  { id: "ship-003", name: "Sheetz", code: "SHEETZ", customer: "Convenience", channel: "Convenience", region: "East", address: "East", transitTimeDays: 2, isActive: true },
  // Grocery / Natural
  { id: "ship-004", name: "Kroger", code: "KROGER", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-005", name: "Target", code: "TARGET", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-006", name: "Target.com", code: "TARGET-COM", customer: "Grocery", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
  { id: "ship-007", name: "Walmart Seller", code: "WMT-SELLER", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-008", name: "Whole Foods", code: "WFM", customer: "Natural", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-009", name: "Sprouts", code: "SPROUTS", customer: "Natural", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
  { id: "ship-010", name: "HEB", code: "HEB", customer: "Grocery", channel: "Retail", region: "Texas", address: "Texas", transitTimeDays: 3, isActive: true },
  { id: "ship-011", name: "Hy-Vee", code: "HYVEE", customer: "Grocery", channel: "Retail", region: "Midwest", address: "Midwest", transitTimeDays: 3, isActive: true },
  { id: "ship-012", name: "Trader Joe's", code: "TJS", customer: "Grocery", channel: "Retail", region: "National", address: "National", transitTimeDays: 3, isActive: true },
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
  { id: "ship-023", name: "Thrive Market", code: "THRIVE", customer: "Ecommerce", channel: "Ecommerce", region: "National", address: "National", transitTimeDays: 2, isActive: true },
]

export const suppliers: Supplier[] = [
  { id: "sup-001", name: "Harvest Grain Co", code: "GRAIN-HG", materialCategories: ["Oat Base", "Grain Blends"], leadTimeDays: 14, minOrderQty: 50000, orderMultiple: 5000, contactEmail: "orders@harvestgraingo.com", isActive: true },
  { id: "sup-002", name: "Pure Blends Inc", code: "BLEND-PB", materialCategories: ["Protein Blends", "Flavor Mixes"], leadTimeDays: 10, minOrderQty: 5000, orderMultiple: 1000, contactEmail: "orders@pureblendsinc.com", isActive: true },
  { id: "sup-003", name: "GreenPack Solutions", code: "PKG-GP", materialCategories: ["Boxes", "Pouches", "Shippers"], leadTimeDays: 12, minOrderQty: 10000, orderMultiple: 5000, contactEmail: "orders@greenpacksolutions.com", isActive: true },
]

export const materials: Material[] = [
  { id: "mat-001", name: "Organic Oat Base", code: "OAT-BASE", category: "Grain Bases", supplierUnit: "lbs", yieldPerThousandSticks: 72, suppliers: ["sup-001"], isActive: true },
  { id: "mat-002", name: "Plant Protein Blend", code: "PROT-BLEND", category: "Protein Blends", supplierUnit: "lbs", yieldPerThousandSticks: 3, suppliers: ["sup-002"], isActive: true },
  { id: "mat-003", name: "Biodegradable Film Wrap", code: "WRAP-BIO", category: "Packaging", supplierUnit: "units", yieldPerThousandSticks: 1000, suppliers: ["sup-003"], isActive: true },
  { id: "mat-004", name: "24ct Display Box", code: "BOX-24CT", category: "Packaging", supplierUnit: "units", yieldPerThousandSticks: 42, suppliers: ["sup-003"], isActive: true },
  { id: "mat-005", name: "Foil Wrapper", code: "WRAP-FOIL", category: "Packaging", supplierUnit: "units", yieldPerThousandSticks: 1000, suppliers: ["sup-003"], isActive: true },
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
  "CO24": {
    initialStartingInventory: 758000,
    productionPlanned: [505000, 565000, 515000, 825000, 123000, 384000, 300000, 249000, 427000, 638000, 576000, 376000, 526000, 476000, 490000, 510000],
    kittingDemand: [418000, 624000, 1088000, 833000, 1038000, 891000, 1110000, 827000, 758000, 833000, 734000, 608000, 515000, 514000, 530000, 520000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CJ24": {
    initialStartingInventory: 569000,
    productionPlanned: [378000, 420000, 390000, 640000, 96000, 290000, 236000, 196000, 324000, 480000, 430000, 284000, 396000, 358000, 370000, 385000],
    kittingDemand: [316000, 470000, 820000, 630000, 784000, 672000, 838000, 624000, 572000, 628000, 554000, 458000, 388000, 388000, 400000, 395000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CB24": {
    initialStartingInventory: 443000,
    productionPlanned: [294000, 328000, 304000, 498000, 75000, 226000, 184000, 153000, 252000, 374000, 336000, 222000, 308000, 280000, 295000, 305000],
    kittingDemand: [246000, 366000, 640000, 492000, 612000, 524000, 654000, 486000, 446000, 490000, 432000, 358000, 304000, 302000, 315000, 310000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "CTOTJ24": {
    initialStartingInventory: 378400,
    productionPlanned: [252000, 280000, 260000, 426000, 64000, 194000, 158000, 131000, 216000, 320000, 288000, 190000, 264000, 240000, 255000, 265000],
    kittingDemand: [210000, 314000, 548000, 420000, 524000, 448000, 560000, 416000, 382000, 420000, 370000, 306000, 260000, 258000, 270000, 265000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
  "COP12": {
    initialStartingInventory: 313600,
    productionPlanned: [208000, 232000, 216000, 352000, 53000, 160000, 130000, 108000, 178000, 264000, 238000, 157000, 218000, 198000, 210000, 220000],
    kittingDemand: [174000, 260000, 454000, 348000, 434000, 372000, 464000, 344000, 316000, 348000, 306000, 254000, 216000, 214000, 225000, 220000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  },
}

export const coManProductionData: Record<string, Record<string, { capacity: number[]; planned: number[]; overrides: (number | null)[] }>> = {
  "Apex Manufacturing": {
    "CO24": {
      capacity: [600000, 640000, 620000, 900000, 300000, 500000, 400000, 360000, 560000, 700000, 640000, 500000, 600000, 560000, 580000, 600000],
      planned: [303000, 339000, 309000, 495000, 74000, 230000, 180000, 150000, 256000, 383000, 346000, 226000, 316000, 286000, 295000, 305000],
      overrides: Array(16).fill(null),
    },
    "CJ24": {
      capacity: [500000, 540000, 520000, 760000, 240000, 420000, 340000, 300000, 480000, 600000, 540000, 420000, 500000, 460000, 480000, 500000],
      planned: [227000, 252000, 234000, 384000, 58000, 174000, 142000, 118000, 194000, 288000, 258000, 170000, 238000, 215000, 222000, 231000],
      overrides: Array(16).fill(null),
    },
  },
  "Pinnacle Foods": {
    "CB24": {
      capacity: [360000, 400000, 380000, 560000, 180000, 300000, 240000, 220000, 340000, 420000, 380000, 300000, 360000, 340000, 350000, 360000],
      planned: [152000, 169000, 155000, 248000, 37000, 115000, 90000, 75000, 128000, 191000, 173000, 113000, 158000, 143000, 148000, 153000],
      overrides: Array(16).fill(null),
    },
    "CTOTJ24": {
      capacity: [300000, 340000, 320000, 480000, 150000, 260000, 210000, 190000, 300000, 370000, 330000, 260000, 300000, 280000, 290000, 300000],
      planned: [113000, 126000, 117000, 192000, 29000, 87000, 71000, 59000, 97000, 144000, 129000, 85000, 119000, 107000, 113000, 118000],
      overrides: Array(16).fill(null),
    },
  },
  "Cascade Nutrition": {
    "COP12": {
      capacity: [240000, 280000, 260000, 360000, 120000, 200000, 160000, 140000, 220000, 280000, 260000, 200000, 240000, 220000, 230000, 240000],
      planned: [51000, 56000, 52000, 83000, 12000, 38000, 30000, 25000, 43000, 64000, 58000, 38000, 53000, 48000, 50000, 52000],
      overrides: Array(16).fill(null),
    },
  },
}

export const coManPartners = ["Apex Manufacturing", "Pinnacle Foods", "Cascade Nutrition"]

export const kittingPlanData = [
  {
    sku: "CO24",
    initialBulkInventory: 700000,
    kittingDemand: [418000, 624000, 1088000, 833000, 1038000, 891000, 1110000, 827000, 758000, 833000, 734000, 608000, 515000, 514000, 530000, 520000],
    targetWOS: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    kitCenters: [
      { name: "Apex Kitting", weeklyCapacity: Array(16).fill(900000), weeklyPlanned: [360000, 440000, 760000, 580000, 720000, 620000, 780000, 580000, 540000, 580000, 520000, 420000, 360000, 360000, 370000, 365000] },
      { name: "Central Kitting", weeklyCapacity: Array(16).fill(600000), weeklyPlanned: [58000, 184000, 328000, 253000, 318000, 271000, 330000, 247000, 218000, 253000, 214000, 188000, 155000, 154000, 160000, 155000] },
    ],
  },
  {
    sku: "CJ24",
    initialBulkInventory: 560000,
    kittingDemand: [350000, 420000, 570000, 480000, 590000, 520000, 620000, 500000, 460000, 510000, 480000, 420000, 380000, 370000, 385000, 378000],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      { name: "Apex Kitting", weeklyCapacity: Array(16).fill(700000), weeklyPlanned: [240000, 290000, 390000, 330000, 400000, 360000, 420000, 340000, 320000, 350000, 330000, 290000, 260000, 250000, 260000, 255000] },
      { name: "Summit Kitting", weeklyCapacity: Array(16).fill(400000), weeklyPlanned: [110000, 130000, 180000, 150000, 190000, 160000, 200000, 160000, 140000, 160000, 150000, 130000, 120000, 120000, 125000, 123000] },
    ],
  },
  {
    sku: "CB24",
    initialBulkInventory: 440000,
    kittingDemand: [280000, 336000, 456000, 384000, 472000, 416000, 496000, 400000, 368000, 408000, 384000, 336000, 304000, 296000, 310000, 305000],
    targetWOS: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    kitCenters: [
      { name: "Central Kitting", weeklyCapacity: Array(16).fill(500000), weeklyPlanned: [180000, 216000, 292000, 246000, 302000, 266000, 318000, 256000, 236000, 262000, 246000, 216000, 196000, 190000, 198000, 195000] },
      { name: "Summit Kitting", weeklyCapacity: Array(16).fill(300000), weeklyPlanned: [100000, 120000, 164000, 138000, 170000, 150000, 178000, 144000, 132000, 146000, 138000, 120000, 108000, 106000, 112000, 110000] },
    ],
  },
]

export const materialsPlanData = [
  {
    material: "Organic Oat Base",
    canonicalUnit: "lbs",
    coManConsumption: [
      { coMan: "Apex Manufacturing", materialRequirement: [104000, 100000, 108000, 106000, 102000, 104000, 110000, 106000, 100000, 106000, 108000, 104000, 102000, 106000, 104000, 108000] },
      { coMan: "Pinnacle Foods", materialRequirement: [96000, 92000, 100000, 98000, 94000, 96000, 102000, 98000, 92000, 98000, 100000, 96000, 94000, 98000, 96000, 100000] },
      { coMan: "Cascade Nutrition", materialRequirement: [70000, 68000, 74000, 72000, 70000, 70000, 76000, 72000, 68000, 72000, 74000, 70000, 70000, 72000, 70000, 74000] },
    ],
    suppliers: [
      { name: "Harvest Grain Co", coMansServed: ["Apex Manufacturing", "Pinnacle Foods"], materialRequirement: [200000, 192000, 208000, 204000, 196000, 200000, 212000, 204000, 192000, 204000, 208000, 200000, 196000, 204000, 200000, 208000], yieldFactor: 0.98 },
    ],
    onHandInventory: [360000, 350000, 340000, 336000, 330000, 320000, 316000, 310000, 304000, 300000, 296000, 290000, 286000, 280000, 276000, 270000],
    inboundMaterial: [190000, 184000, 196000, 192000, 188000, 190000, 200000, 194000, 186000, 192000, 196000, 190000, 188000, 192000, 190000, 194000],
    plannedSupply: [300000, 290000, 310000, 304000, 296000, 300000, 316000, 308000, 292000, 304000, 310000, 300000, 296000, 304000, 300000, 308000],
  },
  {
    material: "Plant Protein Blend",
    canonicalUnit: "lbs",
    coManConsumption: [
      { coMan: "Apex Manufacturing", materialRequirement: [5600, 5400, 6000, 5800, 5600, 5600, 6200, 5800, 5400, 5800, 6000, 5600, 5600, 5800, 5600, 6000] },
      { coMan: "Pinnacle Foods", materialRequirement: [4800, 4600, 5000, 4800, 4600, 4800, 5000, 5000, 4600, 4800, 5000, 4800, 4600, 4800, 4800, 4800] },
    ],
    suppliers: [
      { name: "Pure Blends Inc", coMansServed: ["Apex Manufacturing", "Pinnacle Foods"], materialRequirement: [10400, 10000, 11000, 10600, 10200, 10400, 11200, 10800, 10000, 10600, 11000, 10400, 10200, 10600, 10400, 10800], yieldFactor: 0.96 },
    ],
    onHandInventory: [13600, 13000, 12400, 12000, 11600, 11000, 10400, 10000, 9600, 9000, 8400, 8000, 7600, 7000, 6400, 6000],
    inboundMaterial: [8400, 8000, 8800, 8600, 8200, 8400, 9000, 8600, 8000, 8600, 8800, 8400, 8200, 8600, 8400, 8600],
    plannedSupply: [11000, 10600, 11600, 11200, 10800, 11000, 12000, 11400, 10600, 11200, 11600, 11000, 10800, 11200, 11000, 11400],
  },
]

export const allocationPlanData = [
  {
    sku: "CO24",
    startingNetworkInventory: 490000,
    inboundFG: [64000, 62000, 68000, 65000, 63000, 66000, 69000, 64000, 62000, 68000, 65000, 63000, 66000, 69000, 64000, 62000],
    warehouses: [
      { name: "Costco", allocationPlanned: [25000, 24000, 26000, 25000, 23600, 25600, 27000, 25000, 24000, 26000, 25000, 23600, 25600, 27000, 25000, 24000], shipmentDemand: [23000, 23600, 24400, 23800, 24200, 25000, 25600, 23000, 23600, 24400, 23800, 24200, 25000, 25600, 23000, 23600], startingInventory: 170000, targetWOS: 6.0 },
      { name: "Target", allocationPlanned: [19000, 18400, 20000, 19200, 18000, 19600, 21000, 19000, 18400, 20000, 19200, 18000, 19600, 21000, 19000, 18400], shipmentDemand: [17600, 18200, 18800, 18000, 18400, 19200, 19800, 17600, 18200, 18800, 18000, 18400, 19200, 19800, 17600, 18200], startingInventory: 144000, targetWOS: 6.0 },
      { name: "Whole Foods", allocationPlanned: [13000, 13600, 14000, 13400, 12800, 13800, 14400, 13000, 13600, 14000, 13400, 12800, 13800, 14400, 13000, 13600], shipmentDemand: [12000, 12400, 13000, 12600, 12200, 12800, 13400, 12000, 12400, 13000, 12600, 12200, 12800, 13400, 12000, 12400], startingInventory: 96000, targetWOS: 5.5 },
    ],
  },
  {
    sku: "CB24",
    startingNetworkInventory: 370000,
    inboundFG: [56000, 55000, 58000, 57000, 54000, 57000, 59000, 56000, 55000, 58000, 57000, 54000, 57000, 59000, 56000, 55000],
    warehouses: [
      { name: "Costco", allocationPlanned: [22000, 21000, 23000, 22000, 20400, 22400, 23600, 22000, 21000, 23000, 22000, 20400, 22400, 23600, 22000, 21000], shipmentDemand: [20000, 20600, 21400, 20800, 21200, 21800, 22400, 20000, 20600, 21400, 20800, 21200, 21800, 22400, 20000, 20600], startingInventory: 136000, targetWOS: 5.5 },
      { name: "Target", allocationPlanned: [17000, 16400, 18000, 17200, 16000, 17600, 18400, 17000, 16400, 18000, 17200, 16000, 17600, 18400, 17000, 16400], shipmentDemand: [15600, 16000, 16600, 16200, 16400, 17000, 17400, 15600, 16000, 16600, 16200, 16400, 17000, 17400, 15600, 16000], startingInventory: 110000, targetWOS: 5.5 },
    ],
  },
]

export const COMAN_SITES = ["Apex Manufacturing", "Pinnacle Foods", "Cascade Nutrition"]

// Consumption Plan - Retailer SKU Mapping
export const retailerSkuMapping: Record<string, Array<{ sku: string; name: string }>> = {
  Target: [
    { sku: "CO24", name: "Original Oat Bar 24ct Box" },
    { sku: "CJ24", name: "Dark Chocolate Bar 24ct Box" },
    { sku: "CB24", name: "Peanut Butter Bar 24ct Box" },
  ],
  Walmart: [
    { sku: "CO24", name: "Original Oat Bar 24ct Box" },
    { sku: "CJ24", name: "Dark Chocolate Bar 24ct Box" },
    { sku: "CTOTJ24", name: "Vanilla Almond Bar 24ct Box" },
  ],
  Costco: [
    { sku: "COP12", name: "Original Oat Bar 12ct Club Pouch" },
    { sku: "CTOTJP12", name: "Vanilla Almond Bar 12ct Club Pouch" },
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
