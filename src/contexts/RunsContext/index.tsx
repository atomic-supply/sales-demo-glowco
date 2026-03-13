import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

import type { RunMetadata, RunData } from "../../data/runs-data"
import { allRuns } from "../../data/runs-data"

// Import all run data sets
import { lwInitialData } from "../../data/runs/lw-initial"
import { lwRetailAdjustedData } from "../../data/runs/lw-retail-adjusted"
import { lwRetailPublishedData } from "../../data/runs/lw-retail-published"
import { lwShipmentsAdjustedData } from "../../data/runs/lw-shipments-adjusted"
import { lwShipmentsPublishedData } from "../../data/runs/lw-shipments-published"
import { lwProductionAdjustedData } from "../../data/runs/lw-production-adjusted"
import { lwProductionPublishedData } from "../../data/runs/lw-production-published"
import { lwCompleteData } from "../../data/runs/lw-complete"
import { cwInitialData } from "../../data/runs/cw-initial"
import { cwRetailAdjustedData } from "../../data/runs/cw-retail-adjusted"
import { cwRetailPublishedData } from "../../data/runs/cw-retail-published"
import { cwShipmentsAdjustedData } from "../../data/runs/cw-shipments-adjusted"
import { cwShipmentsPublishedData } from "../../data/runs/cw-shipments-published"
import { cwProductionAdjustedData } from "../../data/runs/cw-production-adjusted"

// Data sets mapping - all run snapshots
const dataSets: Record<string, RunData> = {
  "lw-initial": lwInitialData as RunData,
  "lw-retail-adjusted": lwRetailAdjustedData as RunData,
  "lw-retail-published": lwRetailPublishedData as RunData,
  "lw-shipments-adjusted": lwShipmentsAdjustedData as RunData,
  "lw-shipments-published": lwShipmentsPublishedData as RunData,
  "lw-production-adjusted": lwProductionAdjustedData as RunData,
  "lw-production-published": lwProductionPublishedData as RunData,
  "lw-complete": lwCompleteData as RunData,
  "cw-initial": cwInitialData as RunData,
  "cw-retail-adjusted": cwRetailAdjustedData as RunData,
  "cw-retail-published": cwRetailPublishedData as RunData,
  "cw-shipments-adjusted": cwShipmentsAdjustedData as RunData,
  "cw-shipments-published": cwShipmentsPublishedData as RunData,
  "cw-production-adjusted": cwProductionAdjustedData as RunData,
}

// Context type
interface RunsContextType {
  currentRun: RunMetadata
  currentData: RunData
  planOfRecord: RunMetadata | null
  allRuns: RunMetadata[]
  setCurrentRun: (run: RunMetadata) => void
  setCurrentRunById: (id: string) => void
  updateRunTag: (id: string, tag: string) => void
  setPlanOfRecord: (id: string) => void
  getRunsForWeek: (weekDate: string) => RunMetadata[]
  getUniqueWeeks: () => string[]
  getRunDataById: (id: string) => RunData | null
}

const RunsContext = createContext<RunsContextType | undefined>(undefined)

interface RunsProviderProps {
  children: ReactNode
}

export function RunsProvider({ children }: RunsProviderProps) {
  const [runs, setRuns] = useState<RunMetadata[]>(allRuns)
  const [currentRunId, setCurrentRunId] = useState<string>(
    allRuns.find((r) => r.isCurrent)?.id || allRuns[0].id
  )

  const currentRun = useMemo(
    () => runs.find((r) => r.id === currentRunId) || runs[0],
    [runs, currentRunId]
  )

  const planOfRecord = useMemo(
    () => runs.find((r) => r.isPlanOfRecord) || null,
    [runs]
  )

  const currentData = useMemo(() => {
    return dataSets[currentRun.dataSetId] || dataSets["lw-initial"]
  }, [currentRun.dataSetId])

  const setCurrentRun = useCallback((run: RunMetadata) => {
    setCurrentRunId(run.id)
  }, [])

  const setCurrentRunById = useCallback((id: string) => {
    setCurrentRunId(id)
  }, [])

  const updateRunTag = useCallback((id: string, tag: string) => {
    setRuns((prev) => prev.map((run) => (run.id === id ? { ...run, tag } : run)))
  }, [])

  const setPlanOfRecord = useCallback((id: string) => {
    setRuns((prev) =>
      prev.map((run) => ({
        ...run,
        isPlanOfRecord: run.id === id,
      }))
    )
  }, [])

  const getRunsForWeek = useCallback(
    (weekDate: string) => {
      return runs.filter((r) => r.weekDate === weekDate)
    },
    [runs]
  )

  const getUniqueWeeks = useCallback(() => {
    return [...new Set(runs.map((r) => r.weekDate))]
  }, [runs])

  const getRunDataById = useCallback(
    (id: string): RunData | null => {
      const run = runs.find((r) => r.id === id)
      if (!run) return null
      return dataSets[run.dataSetId] || null
    },
    [runs]
  )

  const value: RunsContextType = {
    currentRun,
    currentData,
    planOfRecord,
    allRuns: runs,
    setCurrentRun,
    setCurrentRunById,
    updateRunTag,
    setPlanOfRecord,
    getRunsForWeek,
    getUniqueWeeks,
    getRunDataById,
  }

  return <RunsContext.Provider value={value}>{children}</RunsContext.Provider>
}

export function useRuns() {
  const context = useContext(RunsContext)
  if (context === undefined) {
    throw new Error("useRuns must be used within a RunsProvider")
  }
  return context
}

export function useRunData() {
  const { currentData } = useRuns()
  return currentData
}

export type { RunMetadata, RunData }
