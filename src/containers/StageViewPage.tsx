/** @jsxImportSource @emotion/react */
import { type FC, useMemo } from "react"
import { useParams } from "react-router"
import { StageView } from "../components/StageView"
import type { ModuleId } from "../data/app-config"
import { MODULES } from "../data/app-config"
import {
  getConsumptionData,
  getShipmentsData,
  getProductionData,
  getKittingData,
  getMRPData,
  getAllocationData,
} from "../data/lmnt-plan-data"
import { getInboxAlerts } from "../data/lmnt-inbox-data"
import type { ModuleConfig, WalkDataPoint } from "../components/StageView/types"
import { FLAVORS, getMonthLabel, PLAN_MONTHS } from "../data/lmnt-master-data"

const VALID_MODULES: ModuleId[] = ["consumption", "shipments", "production", "kitting", "mrp", "allocation"]

function getModuleData(moduleId: ModuleId) {
  switch (moduleId) {
    case "consumption": return getConsumptionData()
    case "shipments": return getShipmentsData()
    case "production": return getProductionData()
    case "kitting": return getKittingData()
    case "mrp": return getMRPData()
    case "allocation": return getAllocationData()
  }
}

function generateWalkData(moduleId: ModuleId, rowId: string): WalkDataPoint[] {
  const points: WalkDataPoint[] = []
  for (let m = 0; m < PLAN_MONTHS; m++) {
    const label = getMonthLabel(m)
    const flavorIdx = FLAVORS.findIndex(f => rowId.includes(f.id))
    const base = flavorIdx >= 0 ? FLAVORS[flavorIdx].monthlyDemand : 2_000_000
    const seasonIdx = (4 + m) % 12
    const season = flavorIdx >= 0 ? FLAVORS[flavorIdx].seasonality[seasonIdx] : 1

    let inventory: number, safetyStock: number, targetMin: number, targetMax: number

    switch (moduleId) {
      case "consumption":
        inventory = Math.round(base * season * (0.95 + Math.sin(m * 0.5) * 0.1))
        safetyStock = 0
        targetMin = Math.round(base * 0.85)
        targetMax = Math.round(base * 1.15)
        break
      case "shipments":
        inventory = Math.round(base * season * 0.6 * (1 + Math.sin(m * 0.3) * 0.15))
        safetyStock = Math.round(base * 0.3)
        targetMin = Math.round(base * 0.4)
        targetMax = Math.round(base * 0.8)
        break
      case "production":
        inventory = Math.round(base * season * 2.5 * (1 + Math.cos(m * 0.4) * 0.1))
        safetyStock = Math.round(base * 1.5)
        targetMin = Math.round(base * 2)
        targetMax = Math.round(base * 3)
        break
      case "kitting":
        inventory = Math.round(base * season * 0.03 * (1 + Math.sin(m * 0.6) * 0.12))
        safetyStock = Math.round(base * 0.015)
        targetMin = Math.round(base * 0.02)
        targetMax = Math.round(base * 0.04)
        break
      case "mrp":
        inventory = Math.round(base * season * 3 * (1 - Math.cos(m * 0.35) * 0.08))
        safetyStock = Math.round(base * 2)
        targetMin = Math.round(base * 2.5)
        targetMax = Math.round(base * 4)
        break
      case "allocation":
      default:
        inventory = Math.round(base * season * 0.04 * (1 + Math.sin(m * 0.45) * 0.15))
        safetyStock = Math.round(base * 0.02)
        targetMin = Math.round(base * 0.025)
        targetMax = Math.round(base * 0.05)
        break
    }
    points.push({ period: label, inventory, safetyStock, targetMin, targetMax })
  }
  return points
}

export const StageViewPage: FC = () => {
  const { moduleId: rawModuleId } = useParams<{ moduleId: string }>()
  const moduleId = (VALID_MODULES.includes(rawModuleId as ModuleId) ? rawModuleId : "consumption") as ModuleId

  const config: ModuleConfig = useMemo(() => {
    const { rows, columns } = getModuleData(moduleId)
    const alerts = getInboxAlerts(moduleId)
    const mod = MODULES.find(m => m.id === moduleId)!

    // Pre-generate walk data for all parent rows
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
      columns,
      rows,
      alerts,
      walkData,
    }
  }, [moduleId])

  return <StageView moduleId={moduleId} config={config} />
}
