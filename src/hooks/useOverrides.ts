import { useState, useCallback } from "react"

/**
 * Shared override-editing state for forecast views.
 * Manages a `Record<string, number | null>` keyed by `"groupKey|override|colIdx"`.
 */
export function useOverrides() {
  const [overrides, setOverrides] = useState<Record<string, number | null>>({})

  const handleOverrideEdit = useCallback((groupKey: string, colIdx: number, value: string) => {
    const key = `${groupKey}|override|${colIdx}`
    if (value === "" || value === "-") {
      setOverrides((prev) => { const next = { ...prev }; delete next[key]; return next })
    } else {
      const num = Number.parseInt(value, 10)
      if (!Number.isNaN(num)) setOverrides((prev) => ({ ...prev, [key]: num }))
    }
  }, [])

  return { overrides, handleOverrideEdit } as const
}
