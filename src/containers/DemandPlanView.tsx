/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback } from "react"
import { theme, alpha } from "../styles/theme/theme"
import { tableStyles } from "../styles"
import { ChevronDown, ChevronRight, Download } from "lucide-react"
import { TableHead, TableCell } from "../components/ui/table"
import { ViewControls, type FilterEntry } from "../components/ViewControls"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { Button } from "../components/ui/button"
import { DataTable } from "../components/DataTable"
import { buildDemandRows, generateDemandWalkData, type MeasureRow } from "../data/consumption-plan-data"
import { terminology } from "../data/app-config"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateMonthColumns(fromStr: string, toStr: string): string[] {
  const cols: string[] = []
  const [fM, , fY] = fromStr.split("/").map(Number)
  const [tM, , tY] = toStr.split("/").map(Number)
  let m = fM
  let yFull = fY < 100 ? fY + 2000 : fY
  const tFull = tY < 100 ? tY + 2000 : tY
  while (yFull < tFull || (yFull === tFull && m <= tM)) {
    cols.push(`${String(m).padStart(2, "0")}/01/${String(yFull).slice(-2)}`)
    m++
    if (m > 12) { m = 1; yFull++ }
  }
  return cols
}

function fmt(v: number | null): string {
  if (v === null) return "-"
  return v.toLocaleString("en-US")
}

function fmtPct(v: number | null): string {
  if (v === null) return "-"
  return `${v}%`
}

// ─── Types ────────────────────────────────────────────────────────────────────

type DemandFlatRow =
  | { kind: "group"; groupKey: string; parts: string[]; finalValues: (number | null)[]; total: number; isExpanded: boolean }
  | { kind: "measure"; groupKey: string; measure: MeasureRow }

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${theme.colors.background};
  `,
  measureCategory: (isYoY: boolean, isOverride: boolean, isFinal: boolean, isHistory: boolean, isBaseline: boolean) => css`
    padding: 0.375rem 0.75rem;
    ${isHistory ? `color: ${theme.colors.mutedForeground};` : ""}
    ${isBaseline ? `font-weight: 500; color: ${theme.colors.foreground};` : ""}
    ${isOverride ? `font-weight: 500; color: #b45309;` : ""}
    ${isFinal ? `font-weight: 600; color: ${theme.colors.foreground};` : ""}
    ${isYoY ? `font-weight: 500; color: #15803d;` : ""}
  `,
  overrideInput: css`
    width: 100%;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    background: transparent;
    padding: 0.25rem 0.5rem;
    text-align: right;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    color: #b45309;
    outline: none;
    &::placeholder { color: ${alpha(theme.colors.mutedForeground, 0.4)}; }
    &:hover { border-color: ${alpha(theme.colors.border, 0.5)}; }
    &:focus { border-color: #f59e0b; }
  `,
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DemandPlanView() {
  const [segments, setSegments] = useState<string[]>(["channel", "sku"])
  const [aggregateBy, setAggregateBy] = useState("quantity")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [overrides, setOverrides] = useState<Record<string, number | null>>({})
  const [filters, setFilters] = useState<FilterEntry[]>([])

  const allRows = useMemo(() => buildDemandRows(), [])
  const allSkus = useMemo(() => [...new Set(allRows.map((r) => r.sku))].sort(), [allRows])
  const monthColumns = useMemo(() => generateMonthColumns("10/01/25", "06/01/26"), [])
  const allChannels = useMemo(() => [...new Set(allRows.map((r) => r.channel))].sort(), [allRows])

  const segmentOptions = useMemo(() => [
    { value: "channel", label: "Channel" },
    { value: "sku", label: "SKU" },
  ], [])

  const aggregateOptions = useMemo(() => [
    { value: "quantity", label: "Quantity" },
    { value: "revenue", label: "Revenue" },
  ], [])

  const filterColumns = useMemo(() => [
    { value: "sku", label: "SKU", options: allSkus },
    { value: "channel", label: "Channel", options: allChannels },
  ], [allSkus, allChannels])

  const filteredRows = useMemo(() => {
    let rows = allRows
    for (const [column, operator, values] of filters) {
      if (values.length === 0) continue
      const getter = (r: { sku: string; channel: string }): string =>
        column === "sku" ? r.sku : column === "channel" ? r.channel : ""

      if (operator === "in") {
        rows = rows.filter((r) => values.includes(getter(r)))
      } else if (operator === "not in") {
        rows = rows.filter((r) => !values.includes(getter(r)))
      } else if (operator === "contains") {
        const term = (values[0] ?? "").toLowerCase()
        if (term) rows = rows.filter((r) => getter(r).toLowerCase().includes(term))
      }
    }
    return rows
  }, [allRows, filters])

  const groupedData = useMemo(() => {
    const groups = new Map<string, { rows: typeof allRows }>()
    for (const row of filteredRows) {
      const key = segments.map((s) => s === "channel" ? row.channel : s === "sku" ? row.sku : "").join(" | ")
      if (!groups.has(key)) groups.set(key, { rows: [] })
      groups.get(key)!.rows.push(row)
    }
    return groups
  }, [filteredRows, segments])

  const groupMeasures = useMemo(() => {
    const result = new Map<string, MeasureRow[]>()
    for (const [key, { rows }] of groupedData) {
      const row = rows[0]
      const measures = generateDemandWalkData(row.sku, row.channel, monthColumns)

      const overrideRowIdx = measures.findIndex((m) => m.category === "Planner Override")
      if (overrideRowIdx >= 0) {
        const overrideRow = measures[overrideRowIdx]
        for (let i = 0; i < monthColumns.length; i++) {
          const oKey = `${key}|override|${i}`
          if (overrides[oKey] !== undefined) overrideRow.values[i] = overrides[oKey]
        }
        const baselineRow = measures.find((m) => m.category === "Baseline Forecast")!
        const finalRow = measures.find((m) => m.category === "Final Forecast")!
        const lastHistory = measures.filter((m) => m.category === "History").pop()!
        const yoyRow = measures.find((m) => m.category === "YoY%")!
        for (let i = 0; i < monthColumns.length; i++) {
          const ov = overrideRow.values[i]
          finalRow.values[i] = ov !== null ? ov : baselineRow.values[i]
          const h = lastHistory.values[i]
          const f = finalRow.values[i]
          yoyRow.values[i] = (f !== null && h !== null && h !== 0) ? Math.round(((f / h) - 1) * 100) : null
        }
      }
      result.set(key, measures)
    }
    return result
  }, [groupedData, monthColumns, overrides])

  const groupTotals = useMemo(() => {
    const result = new Map<string, number>()
    for (const [key, measures] of groupMeasures) {
      const finalRow = measures.find((m) => m.category === "Final Forecast")
      result.set(key, finalRow?.values.reduce((sum, v) => sum + (v ?? 0), 0) ?? 0)
    }
    return result
  }, [groupMeasures])

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleOverrideEdit = useCallback((groupKey: string, colIdx: number, value: string) => {
    const key = `${groupKey}|override|${colIdx}`
    if (value === "" || value === "-") {
      setOverrides((prev) => { const next = { ...prev }; delete next[key]; return next })
    } else {
      const num = parseInt(value, 10)
      if (!isNaN(num)) setOverrides((prev) => ({ ...prev, [key]: num }))
    }
  }, [])

  const flatRows = useMemo<DemandFlatRow[]>(() => {
    const result: DemandFlatRow[] = []
    for (const [groupKey] of groupedData) {
      const isExpanded = expandedGroups.has(groupKey)
      const measures = groupMeasures.get(groupKey) ?? []
      const total = groupTotals.get(groupKey) ?? 0
      const parts = groupKey.split(" | ")
      const finalRow = measures.find((m) => m.category === "Final Forecast")
      const finalValues = finalRow?.values ?? []
      result.push({ kind: "group", groupKey, parts, finalValues, total, isExpanded })
      if (isExpanded) {
        for (const measure of measures) {
          result.push({ kind: "measure", groupKey, measure })
        }
      }
    }
    return result
  }, [groupedData, expandedGroups, groupMeasures, groupTotals])

  const getRowBg = useCallback((row: DemandFlatRow): string => {
    if (row.kind === "group") return row.isExpanded ? theme.colors.muted : theme.colors.background
    const { category } = row.measure
    if (category === "YoY%") return "#f7fef9"
    if (category === "Planner Override") return "#fffef7"
    return theme.colors.background
  }, [])

  return (
    <div css={s.page}>
      <PageHeader
        title={terminology.plans.consumption}
        description="Forecast retail consumption by SKU and channel over the planning horizon"
        actions={
          <Button variant="tertiary" size="sm">
            <Download size={14} />
            Export
          </Button>
        }
      />

      <ViewControls>
        <ViewControls.SegmentBy
          segments={segments}
          onSegmentsChange={setSegments}
          options={segmentOptions}
        />
        <ViewControls.AggregateBy
          value={aggregateBy}
          onChange={setAggregateBy}
          options={aggregateOptions}
        />
        <ViewControls.FilterBy
          filters={filters}
          onFiltersChange={setFilters}
          columns={filterColumns}
        />
      </ViewControls>

      {/* Table */}
      <div css={tableStyles.wrap}>
        <DataTable<DemandFlatRow>
          data={flatRows}
          getRowBg={getRowBg}
          fixedHeaderContent={() => (
            <tr>
              <TableHead css={[tableStyles.th, tableStyles.stickyColHead]}>channel</TableHead>
              <TableHead css={[tableStyles.th, css`min-width: 100px;`]}>sku</TableHead>
              <TableHead css={[tableStyles.th, css`min-width: 140px;`]}>Category Type</TableHead>
              <TableHead css={[tableStyles.th, css`min-width: 70px;`]}>Year</TableHead>
              {monthColumns.map((col) => (
                <TableHead key={col} css={[tableStyles.th, tableStyles.right, css`min-width: 85px;`]}>{col}</TableHead>
              ))}
              <TableHead css={[tableStyles.th, tableStyles.right, tableStyles.thTotal, tableStyles.colMin]}>total</TableHead>
            </tr>
          )}
          itemContent={(_, row) => {
            if (row.kind === "group") {
              return (
                <>
                  <TableCell
                    css={css`
                      position: sticky; left: 0; z-index: 1; background: inherit;
                      padding: 0.5rem 0.75rem; font-weight: 500; color: ${theme.colors.foreground};
                      cursor: pointer;
                    `}
                    onClick={() => toggleGroup(row.groupKey)}
                  >
                    <div css={css`display: flex; align-items: center; gap: 0.375rem;`}>
                      {row.isExpanded
                        ? <ChevronDown size={14} css={css`color: ${theme.colors.mutedForeground}; flex-shrink: 0;`} />
                        : <ChevronRight size={14} css={css`color: ${theme.colors.mutedForeground}; flex-shrink: 0;`} />
                      }
                      <span>{row.parts[0] ?? ""}</span>
                    </div>
                  </TableCell>
                  <TableCell css={css`padding: 0.5rem 0.75rem;`}>{row.parts[1] ?? ""}</TableCell>
                  <TableCell css={css`padding: 0.5rem 0.75rem;`} />
                  <TableCell css={css`padding: 0.5rem 0.75rem;`} />
                  {monthColumns.map((col, ci) => (
                    <TableCell key={col} css={css`
                      padding: 0.5rem 0.5rem; text-align: right;
                      font-variant-numeric: tabular-nums;
                      color: ${theme.colors.mutedForeground};
                    `}>
                      {fmt(row.finalValues[ci])}
                    </TableCell>
                  ))}
                  <TableCell css={css`
                    padding: 0.5rem 0.75rem; text-align: right;
                    font-variant-numeric: tabular-nums; font-weight: 600;
                    color: ${theme.colors.foreground};
                  `}>
                    {row.total.toLocaleString("en-US")}
                  </TableCell>
                </>
              )
            }

            const { measure, groupKey } = row
            const isYoY = measure.category === "YoY%"
            const isOverride = measure.category === "Planner Override"
            const isFinal = measure.category === "Final Forecast"
            const isHistory = measure.category === "History"
            const isBaseline = measure.category === "Baseline Forecast"

            return (
              <>
                <TableCell css={css`
                  position: sticky; left: 0; z-index: 1; background: inherit;
                  padding: 0.375rem 0.75rem;
                `} />
                <TableCell css={css`padding: 0.375rem 0.75rem;`} />
                <TableCell css={s.measureCategory(isYoY, isOverride, isFinal, isHistory, isBaseline)}>
                  {measure.category}
                </TableCell>
                <TableCell css={css`padding: 0.375rem 0.75rem; color: ${theme.colors.mutedForeground};`}>
                  {measure.year || ""}
                </TableCell>
                {monthColumns.map((col, ci) => {
                  const v = measure.values[ci]
                  if (isOverride) {
                    return (
                      <TableCell key={col} css={css`padding: 0.25rem;`}>
                        <input
                          type="text"
                          defaultValue={v !== null ? v.toString() : ""}
                          placeholder="-"
                          css={s.overrideInput}
                          onBlur={(e) => handleOverrideEdit(groupKey, ci, e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                        />
                      </TableCell>
                    )
                  }
                  const cellStyle = isYoY
                    ? css`padding: 0.375rem 0.75rem; text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; color: #15803d;`
                    : isFinal
                    ? css`padding: 0.375rem 0.75rem; text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; color: ${theme.colors.foreground};`
                    : isHistory
                    ? css`padding: 0.375rem 0.75rem; text-align: right; font-variant-numeric: tabular-nums; color: ${theme.colors.mutedForeground};`
                    : css`padding: 0.375rem 0.75rem; text-align: right; font-variant-numeric: tabular-nums; color: ${theme.colors.foreground};`
                  return (
                    <TableCell key={col} css={cellStyle}>
                      {isYoY ? fmtPct(v) : fmt(v)}
                    </TableCell>
                  )
                })}
                <TableCell css={css`
                  padding: 0.375rem 0.75rem;
                  text-align: right;
                  font-variant-numeric: tabular-nums;
                  ${isFinal ? `font-weight: 600; color: ${theme.colors.foreground};` : ""}
                  ${isYoY ? `font-weight: 500; color: #15803d;` : ""}
                `}>
                  {isYoY
                    ? (() => {
                        const nonNull = measure.values.filter((val): val is number => val !== null)
                        return nonNull.length > 0 ? `${Math.round(nonNull.reduce((a, b) => a + b, 0) / nonNull.length)}%` : "-"
                      })()
                    : isOverride
                      ? "-"
                      : fmt(measure.values.reduce<number>((a, b) => a + (b ?? 0), 0))
                  }
                </TableCell>
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
