/** @jsxImportSource @emotion/react */
import { type FC, useMemo } from "react"
import { useParams } from "react-router"
import { StageView } from "../components/StageView"
import type { ModuleId } from "../data/app-config"
import { MODULES } from "../data/app-config"
import {
  getShipmentsData,
  getProductionData,
  getKittingData,
  getMRPData,
  getAllocationData,
} from "../data/glowco-plan-data"
import type { DualTableData } from "../data/glowco-plan-data"
import { getInboxAlerts } from "../data/glowco-inbox-data"
import type { ModuleConfig, WalkDataPoint } from "../components/StageView/types"
import { FORMULATIONS } from "../data/glowco-master-data"

const VALID_MODULES: ModuleId[] = ["shipments", "production", "kitting", "mrp", "allocation"]

function getModuleData(moduleId: ModuleId): DualTableData {
  switch (moduleId) {
    case "shipments": return getShipmentsData()
    case "production": return getProductionData()
    case "kitting": return getKittingData()
    case "mrp": return getMRPData()
    case "allocation": return getAllocationData()
    default: return getShipmentsData()
  }
}

/** All supply modules = 12 weekly buckets */
function generateWalkData(moduleId: ModuleId, rowId: string): WalkDataPoint[] {
  const periods = 12
  const points: WalkDataPoint[] = []

  const flavorIdx = FORMULATIONS.findIndex(f => rowId.includes(f.id))
  const base = flavorIdx >= 0 ? FORMULATIONS[flavorIdx].monthlyDemand : 2_000_000
  const weeklyBase = base / 4.33

  for (let p = 0; p < periods; p++) {
    const label = `Wk ${p + 1}`

    const seasonIdx = (4 + Math.floor(p / 4.33)) % 12
    const season = flavorIdx >= 0 ? FORMULATIONS[flavorIdx].seasonality[seasonIdx] : 1

    const periodBase = weeklyBase

    let inventory: number, safetyStock: number, targetMin: number, targetMax: number

    switch (moduleId) {
      case "shipments":
        inventory = Math.round(periodBase * season * 0.6 * (1 + Math.sin(p * 0.3) * 0.15))
        safetyStock = Math.round(periodBase * 0.3)
        targetMin = Math.round(periodBase * 0.4)
        targetMax = Math.round(periodBase * 0.8)
        break
      case "production":
        inventory = Math.round(periodBase * season * 2.5 * (1 + Math.cos(p * 0.4) * 0.1))
        safetyStock = Math.round(periodBase * 1.5)
        targetMin = Math.round(periodBase * 2)
        targetMax = Math.round(periodBase * 3)
        break
      case "kitting":
        inventory = Math.round(periodBase * season * 0.03 * (1 + Math.sin(p * 0.6) * 0.12))
        safetyStock = Math.round(periodBase * 0.015)
        targetMin = Math.round(periodBase * 0.02)
        targetMax = Math.round(periodBase * 0.04)
        break
      case "mrp":
        inventory = Math.round(periodBase * season * 3 * (1 - Math.cos(p * 0.35) * 0.08))
        safetyStock = Math.round(periodBase * 2)
        targetMin = Math.round(periodBase * 2.5)
        targetMax = Math.round(periodBase * 4)
        break
      case "allocation":
      default:
        inventory = Math.round(periodBase * season * 0.04 * (1 + Math.sin(p * 0.45) * 0.15))
        safetyStock = Math.round(periodBase * 0.02)
        targetMin = Math.round(periodBase * 0.025)
        targetMax = Math.round(periodBase * 0.05)
        break
    }
    points.push({ period: label, inventory, safetyStock, targetMin, targetMax })
  }
  return points
}

export const StageViewPage: FC = () => {
  const { moduleId: rawModuleId } = useParams<{ moduleId: string }>()
  const moduleId = (VALID_MODULES.includes(rawModuleId as ModuleId) ? rawModuleId : "shipments") as ModuleId

  const config: ModuleConfig = useMemo(() => {
    const { actionTable, rows, columns } = getModuleData(moduleId)
    const alerts = getInboxAlerts(moduleId)
    const mod = MODULES.find(m => m.id === moduleId)!

    // Pre-generate walk data for all rows
    const walkData: Record<string, WalkDataPoint[]> = {}
    for (const row of rows) {
      walkData[row.id] = generateWalkData(moduleId, row.id)
    }

    return {
      id: moduleId,
      label: mod.name,
      shortLabel: mod.shortName,
      description: mod.description,
      color: mod.color,
      actionTable,
      columns,
      rows,
      alerts,
      walkData,
    }
  }, [moduleId])

  return <StageView key={moduleId} moduleId={moduleId} config={config} />
}
