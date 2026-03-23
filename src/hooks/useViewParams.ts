import { useCallback, useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "react-router"

/**
 * Syncs view-level params (segments, filters, dates, etc.) to URL search params.
 *
 * Each key in `defaults` becomes a URL param. Strings are stored as-is;
 * arrays/objects are JSON-serialized. All params are always present in the URL.
 *
 * Pass a **stable** `defaults` object (module-level const) to avoid
 * unnecessary recomputations.
 */
export function useViewParams<T extends Record<string, unknown>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultsRef = useRef(defaults)

  // Write any missing default params into the URL on mount
  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const missing: [string, string][] = []
    for (const key of Object.keys(defaultsRef.current)) {
      if (!searchParams.has(key)) {
        const val = defaultsRef.current[key]
        missing.push([key, typeof val === "string" ? val : JSON.stringify(val)])
      }
    }
    if (missing.length > 0) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [k, v] of missing) next.set(k, v)
        return next
      }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const params = useMemo<T>(() => {
    const result = {} as Record<string, unknown>
    for (const key of Object.keys(defaultsRef.current)) {
      const raw = searchParams.get(key)
      if (raw === null) {
        result[key] = defaultsRef.current[key]
      } else if (typeof defaultsRef.current[key] === "string") {
        result[key] = raw
      } else {
        try { result[key] = JSON.parse(raw) }
        catch { result[key] = defaultsRef.current[key] }
      }
    }
    return result as T
  }, [searchParams])

  const setParam = useCallback(<K extends keyof T & string>(key: K, value: T[K]) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set(key, typeof value === "string" ? value : JSON.stringify(value))
      return next
    }, { replace: true })
  }, [setSearchParams])

  return { params, setParam } as const
}
