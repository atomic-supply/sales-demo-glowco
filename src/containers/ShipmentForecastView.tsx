/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback } from "react"
import { theme } from "../styles/theme/theme"
import { tableStyles } from "../styles/mixins/table"
import { ChevronDown, ChevronRight } from "lucide-react"
import { TableHead, TableCell } from "../components/ui/table"
import { ViewControls } from "../components/ViewControls"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { DataTable } from "../components/DataTable"
import { seededRand } from "../utils/random"
import { skus, shipToLocations } from "../data/runs/unified-data"
import {
  DEFAULT_FROM_DATE,
  DEFAULT_TO_DATE,
} from "../data/shipment-forecast-data"
import { generateMonthColumns, generateWeekColumns } from "../utils/date"

// =============================================================================
// Types
// =============================================================================

type CategoryType = "History" | "Baseline Forecast" | "Planner Override" | "Final Forecast" | "YoY%"

interface MeasureRow {
  category: CategoryType
  year: string
  values: (number | null)[]
}

type FlatRow =
  | { kind: "primary"; primary: string; aggregates: number[]; hasChildren: boolean; isExpanded: boolean }
  | { kind: "measure"; primary: string; secondary: string; measure: MeasureRow; measureIdx: number; isFirstMeasure: boolean; hasSecondary: boolean }

// =============================================================================
// Data generation
// =============================================================================

function generateForecastMeasures(shipTo: string, sku: string, monthColumns: string[]): MeasureRow[] {
  const rand = seededRand(
    shipTo.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 137 +
    sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  )

  const colMonths = monthColumns.map((col) => {
    const parts = col.split("/").map(Number)
    const m = parts[0]
    const y = parts[2] !== undefined ? (parts[2] < 100 ? parts[2] + 2000 : parts[2]) : parts[1]
    return { month: m, year: y }
  })

  const skuHash = sku.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const baseDemand = 200 + (skuHash % 800)
  const seasonality = [0.85, 0.90, 1.05, 1.15, 1.25, 1.30, 1.20, 1.10, 1.00, 0.95, 1.10, 1.35]

  const years = ["2022-23", "2023-24", "2024-25"]
  const growthRates = [1.0, 1.25, 1.40]

  const historyRows: MeasureRow[] = years.map((yr, yi) => {
    const growth = growthRates[yi]
    const values = colMonths.map(({ month }, i) => {
      const base = baseDemand * growth * seasonality[month - 1]
      const noise = 0.85 + rand() * 0.3
      const val = Math.round(base * noise)
      if (yi === 0 && i < 3) return null
      return val
    })
    return { category: "History" as CategoryType, year: yr, values }
  })

  const baselineGrowth = 1.32 + rand() * 0.08
  const baselineRow: MeasureRow = {
    category: "Baseline Forecast",
    year: "2025-26",
    values: colMonths.map(({ month }) => {
      const base = baseDemand * growthRates[2] * baselineGrowth * seasonality[month - 1]
      const noise = 0.95 + rand() * 0.1
      return Math.round(base * noise)
    }),
  }

  const overrideRow: MeasureRow = {
    category: "Planner Override",
    year: "",
    values: colMonths.map(() => null),
  }

  const finalRow: MeasureRow = {
    category: "Final Forecast",
    year: "",
    values: baselineRow.values.map((v, i) => {
      const ov = overrideRow.values[i]
      return ov !== null ? ov : v
    }),
  }

  const lastHistory = historyRows[historyRows.length - 1]
  const yoyRow: MeasureRow = {
    category: "YoY%",
    year: "",
    values: finalRow.values.map((f, i) => {
      const h = lastHistory.values[i]
      if (f === null || h === null || h === 0) return null
      return Math.round(((f / h) - 1) * 100)
    }),
  }

  return [...historyRows, baselineRow, overrideRow, finalRow, yoyRow]
}

// =============================================================================
// Segment options and helpers
// =============================================================================

const SEGMENT_OPTIONS = [
  { value: "First Receiver", label: "First Receiver" },
  { value: "DC Name", label: "DC Name" },
  { value: "Customer Name", label: "Customer Name" },
  { value: "SKU", label: "SKU" },
  { value: "Protein", label: "Protein" },
  { value: "Size", label: "Size" },
]

const DISPLAY_OPTIONS = [
  { value: "Week", label: "Week" },
  { value: "Month", label: "Month" },
]

function getSegmentValue(segment: string, shipToName: string, skuCode: string): string {
  const loc = shipToLocations.find((l) => l.name === shipToName)
  const skuObj = skus.find((s) => s.code === skuCode)
  switch (segment) {
    case "First Receiver": return shipToName
    case "DC Name": return loc?.address || "Unknown"
    case "Customer Name": return loc?.customer || "Unknown"
    case "SKU": return skuCode
    case "Protein": return skuObj?.protein || "Unknown"
    case "Size": return skuObj?.size || "Unknown"
    default: return shipToName
  }
}

function fmt(v: number | null): string {
  if (v === null) return "-"
  return v.toLocaleString("en-US")
}

function fmtPct(v: number | null): string {
  if (v === null) return "-"
  return `${v}%`
}

// =============================================================================
// Styles
// =============================================================================

const s = {
  page: css`display: flex; flex-direction: column; height: 100%; overflow: hidden;`,
}

// =============================================================================
// Component
// =============================================================================

export const ShipmentForecastView = () => {
  const [displayBy, setDisplayBy] = useState("Month")
  const [fromDate, setFromDate] = useState(DEFAULT_FROM_DATE)
  const [toDate, setToDate] = useState(DEFAULT_TO_DATE)
  const [segments, setSegments] = useState<string[]>(["First Receiver"])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [overrides, setOverrides] = useState<Record<string, number | null>>({})
  const [filterShipTo, setFilterShipTo] = useState<string[]>([])
  const [filterSku, setFilterSku] = useState<string[]>([])

  const allShipTos = useMemo(() => [...new Set(shipToLocations.map((l) => l.name))].sort(), [])
  const allSkus = useMemo(() => skus.map((s) => s.code).sort(), [])

  const columns = useMemo(() => {
    return displayBy === "Week"
      ? generateWeekColumns(fromDate, toDate)
      : generateMonthColumns(fromDate, toDate)
  }, [displayBy, fromDate, toDate])

  const primarySegmentLabel = segments[0] || "First Receiver"
  const secondarySegmentLabel = segments.length > 1 ? segments[1] : null

  // Build hierarchical data
  const hierarchicalData = useMemo(() => {
    const primarySegment = segments[0] || "First Receiver"
    const secondarySegment = segments.length > 1 ? segments[1] : null
    const primaryGroups = new Map<string, Set<string>>()

    for (const loc of shipToLocations) {
      if (filterShipTo.length > 0 && !filterShipTo.includes(loc.name)) continue
      const filteredSkuList = skus.filter((s) => filterSku.length === 0 || filterSku.includes(s.code))
      for (const sku of filteredSkuList) {
        const primaryVal = getSegmentValue(primarySegment, loc.name, sku.code)
        const secondaryVal = secondarySegment ? getSegmentValue(secondarySegment, loc.name, sku.code) : null
        if (!primaryGroups.has(primaryVal)) primaryGroups.set(primaryVal, new Set())
        if (secondaryVal) primaryGroups.get(primaryVal)!.add(secondaryVal)
      }
    }

    const result = new Map<string, string[]>()
    for (const [primary, secondarySet] of primaryGroups) {
      result.set(primary, secondarySet.size > 0 ? [...secondarySet].sort() : [])
    }
    return result
  }, [segments, filterShipTo, filterSku])

  // Generate measure data
  const measureData = useMemo(() => {
    const result = new Map<string, MeasureRow[]>()
    for (const [primary, secondaryList] of hierarchicalData) {
      if (secondaryList.length === 0) {
        const measures = generateForecastMeasures(primary, primary, columns)
        result.set(`${primary}|`, measures)
      } else {
        for (const secondary of secondaryList) {
          const key = `${primary}|${secondary}`
          const measures = generateForecastMeasures(primary, secondary, columns)
          // Apply overrides
          const overrideRow = measures.find((m) => m.category === "Planner Override")!
          const baselineRow = measures.find((m) => m.category === "Baseline Forecast")!
          const finalRow = measures.find((m) => m.category === "Final Forecast")!
          const lastHistory = measures.filter((m) => m.category === "History").pop()!
          const yoyRow = measures.find((m) => m.category === "YoY%")!
          for (let i = 0; i < columns.length; i++) {
            const oKey = `${key}|override|${i}`
            if (overrides[oKey] !== undefined) overrideRow.values[i] = overrides[oKey]
          }
          for (let i = 0; i < columns.length; i++) {
            const ov = overrideRow.values[i]
            finalRow.values[i] = ov !== null ? ov : baselineRow.values[i]
            const h = lastHistory.values[i]
            const f = finalRow.values[i]
            yoyRow.values[i] = (f !== null && h !== null && h !== 0) ? Math.round(((f / h) - 1) * 100) : null
          }
          result.set(key, measures)
        }
      }
    }
    return result
  }, [hierarchicalData, columns, overrides])

  // Compute primary aggregates (Final Forecast summed across secondaries)
  const primaryAggregates = useMemo(() => {
    const result = new Map<string, number[]>()
    for (const [primary, secondaryList] of hierarchicalData) {
      if (secondaryList.length === 0) {
        const measures = measureData.get(`${primary}|`)
        const finalRow = measures?.find((m) => m.category === "Final Forecast")
        result.set(primary, finalRow?.values.map((v) => v ?? 0) || columns.map(() => 0))
      } else {
        const totals = columns.map((_, ci) =>
          secondaryList.reduce((sum, secondary) => {
            const measures = measureData.get(`${primary}|${secondary}`)
            const finalRow = measures?.find((m) => m.category === "Final Forecast")
            return sum + (finalRow?.values[ci] ?? 0)
          }, 0),
        )
        result.set(primary, totals)
      }
    }
    return result
  }, [hierarchicalData, measureData, columns])

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleOverrideEdit = useCallback((primary: string, secondary: string, colIdx: number, value: string) => {
    const key = `${primary}|${secondary}|override|${colIdx}`
    if (value === "" || value === "-") {
      setOverrides((prev) => { const next = { ...prev }; delete next[key]; return next })
    } else {
      const num = Number.parseInt(value, 10)
      if (!Number.isNaN(num)) setOverrides((prev) => ({ ...prev, [key]: num }))
    }
  }, [])

  // Build flat rows for Virtuoso
  const flatRows = useMemo<FlatRow[]>(() => {
    const result: FlatRow[] = []
    for (const [primary, secondaryList] of hierarchicalData) {
      const aggregates = primaryAggregates.get(primary) || []
      const hasChildren = secondaryList.length > 0
      const isExpanded = expandedGroups.has(primary)
      result.push({ kind: "primary", primary, aggregates, hasChildren, isExpanded })
      if (isExpanded && hasChildren) {
        for (const secondary of secondaryList) {
          const key = `${primary}|${secondary}`
          const measures = measureData.get(key) || []
          measures.forEach((measure, measureIdx) => {
            result.push({ kind: "measure", primary, secondary, measure, measureIdx, isFirstMeasure: measureIdx === 0, hasSecondary: !!secondarySegmentLabel })
          })
        }
      }
    }
    return result
  }, [hierarchicalData, primaryAggregates, expandedGroups, measureData, secondarySegmentLabel])

  const rowBg = (row: FlatRow): string => {
    if (row.kind === "primary") return row.isExpanded ? theme.colors.muted : theme.colors.background
    if (row.kind === "measure") {
      if (row.measure.category === "Planner Override") return "#fffef7"
      if (row.measure.category === "Final Forecast") return theme.colors.gray50
      if (row.measure.category === "YoY%") return theme.colors.gray50
    }
    return theme.colors.background
  }

  const getRowBg = useCallback((row: FlatRow): string => rowBg(row), [])

  return (
    <div css={s.page}>
      <PageHeader title="Shipment Plans" description="Compare shipment forecasts across SKUs, locations, and time periods" />

      <ViewControls>
        <ViewControls.SegmentBy
          segments={segments}
          onSegmentsChange={setSegments}
          options={SEGMENT_OPTIONS}
        />
        <ViewControls.DisplayBy
          value={displayBy}
          onChange={setDisplayBy}
          options={DISPLAY_OPTIONS}
        />
        <ViewControls.FilterDropdown
          label="Ship To"
          values={filterShipTo}
          onChange={setFilterShipTo}
          options={allShipTos.map((v) => ({ value: v, label: v }))}
        />
        <ViewControls.FilterDropdown
          label="SKU"
          values={filterSku}
          onChange={setFilterSku}
          options={allSkus.map((v) => ({ value: v, label: v }))}
        />
        <ViewControls.DateRange
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      </ViewControls>

      {/* Table */}
      <div css={tableStyles.wrap}>
        <DataTable<FlatRow>
          data={flatRows}
          getRowBg={getRowBg}
          fixedHeaderContent={() => (
            <tr>
              <TableHead css={[tableStyles.th, tableStyles.stickyColHead]}>
                {primarySegmentLabel}
              </TableHead>
              {secondarySegmentLabel && (
                <TableHead css={[tableStyles.th, css`min-width: 7rem;`]}>
                  {secondarySegmentLabel}
                </TableHead>
              )}
              <TableHead css={[tableStyles.th, css`min-width: 7.5rem;`]}>Measure</TableHead>
              <TableHead css={[tableStyles.th, css`min-width: 4.5rem;`]}>Year</TableHead>
              {columns.map((col) => (
                <TableHead key={col} css={[tableStyles.th, tableStyles.right, tableStyles.colMin]}>{col}</TableHead>
              ))}
              <TableHead css={[tableStyles.th, tableStyles.right, tableStyles.thTotal, tableStyles.colMin]}>Total</TableHead>
            </tr>
          )}
          itemContent={(_, row) => {
            if (row.kind === "primary") {
              const total = row.aggregates.reduce((acc, v) => acc + v, 0)
              return (
                <>
                  <TableCell
                    css={css`
                      position: sticky; left: 0; z-index: 1; background: inherit;
                      padding: 0.5rem 0.75rem; font-weight: 500; color: ${theme.colors.foreground};
                      ${row.hasChildren ? "cursor: pointer;" : ""}
                    `}
                    onClick={row.hasChildren ? () => toggleGroup(row.primary) : undefined}
                  >
                    <div css={css`display: flex; align-items: center; gap: 0.375rem;`}>
                      {row.hasChildren ? (
                        row.isExpanded
                          ? <ChevronDown css={css`width: 0.875rem; height: 0.875rem; flex-shrink: 0; color: ${theme.colors.mutedForeground};`} />
                          : <ChevronRight css={css`width: 0.875rem; height: 0.875rem; flex-shrink: 0; color: ${theme.colors.mutedForeground};`} />
                      ) : (
                        <span css={css`width: 0.875rem; display: inline-block;`} />
                      )}
                      <span>{row.primary}</span>
                    </div>
                  </TableCell>
                  {secondarySegmentLabel && <TableCell css={css`padding: 0.5rem 0.75rem;`} />}
                  <TableCell css={css`padding: 0.5rem 0.75rem; color: ${theme.colors.mutedForeground};`}>
                    Final Forecast
                  </TableCell>
                  <TableCell css={css`padding: 0.5rem 0.75rem;`} />
                  {row.aggregates.map((v, i) => (
                    <TableCell key={i} css={css`
                      padding: 0.5rem 0.5rem; text-align: right;
                      font-variant-numeric: tabular-nums;
                      color: ${theme.colors.mutedForeground};
                    `}>
                      {fmt(v)}
                    </TableCell>
                  ))}
                  <TableCell css={css`
                    padding: 0.5rem 0.75rem; text-align: right;
                    font-variant-numeric: tabular-nums; font-weight: 600;
                    color: ${theme.colors.foreground};
                  `}>
                    {fmt(total)}
                  </TableCell>
                </>
              )
            }

            if (row.kind === "measure") {
              const { measure, secondary, primary, measureIdx, isFirstMeasure, hasSecondary } = row
              const total = measure.values.reduce<number>((acc, v) => acc + (v ?? 0), 0)
              const isOverride = measure.category === "Planner Override"
              const isFinal = measure.category === "Final Forecast"
              const isYoy = measure.category === "YoY%"

              return (
                <>
                  <TableCell css={css`
                    position: sticky; left: 0; z-index: 1; background: inherit;
                    padding: ${isFirstMeasure ? "0.5rem" : "0.375rem"} 0.75rem 0.375rem 2rem;
                  `} />
                  {hasSecondary && (
                    <TableCell css={css`padding: 0.375rem 0.75rem; color: ${theme.colors.mutedForeground};`}>
                      {measureIdx === 0 ? secondary : ""}
                    </TableCell>
                  )}
                  <TableCell css={css`padding: 0.375rem 0.75rem; color: ${theme.colors.mutedForeground};`}>
                    {measure.category}
                  </TableCell>
                  <TableCell css={css`padding: 0.375rem 0.75rem; color: ${theme.colors.mutedForeground};`}>
                    {measure.year}
                  </TableCell>
                  {measure.values.map((v, ci) => (
                    <TableCell key={ci} css={css`padding: 0.375rem 0.5rem; text-align: right; font-variant-numeric: tabular-nums;`}>
                      {isOverride ? (
                        <input
                          type="text"
                          css={css`
                            width: 100%;
                            background: transparent;
                            text-align: right;
                            font-size: 0.75rem;
                            font-variant-numeric: tabular-nums;
                            border: none;
                            outline: none;
                            color: ${theme.colors.foreground};
                            &:focus { background: rgba(254, 240, 138, 0.5); border-radius: 0.25rem; }
                          `}
                          defaultValue={v !== null ? String(v) : ""}
                          placeholder="-"
                          onBlur={(e) => handleOverrideEdit(primary, secondary, ci, e.target.value)}
                        />
                      ) : isYoy ? (
                        <span css={css`
                          color: ${v !== null && v > 0 ? "#16a34a" : v !== null && v < 0 ? "#dc2626" : theme.colors.mutedForeground};
                        `}>
                          {fmtPct(v)}
                        </span>
                      ) : (
                        <span css={css`
                          color: ${isFinal ? theme.colors.foreground : theme.colors.mutedForeground};
                          font-weight: ${isFinal ? 500 : "inherit"};
                        `}>
                          {fmt(v)}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell css={css`padding: 0.375rem 0.75rem; text-align: right; font-variant-numeric: tabular-nums;`}>
                    {isYoy ? (
                      <span css={css`color: ${theme.colors.mutedForeground};`}>-</span>
                    ) : (
                      <span css={css`
                        font-weight: ${isFinal ? 600 : "inherit"};
                        color: ${isFinal ? theme.colors.foreground : theme.colors.mutedForeground};
                      `}>
                        {fmt(total)}
                      </span>
                    )}
                  </TableCell>
                </>
              )
            }

            return null
          }}
        />
      </div>
    </div>
  )
}

