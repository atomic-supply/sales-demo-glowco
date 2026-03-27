/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMemo, useCallback } from "react"
import { theme } from "../styles/theme/theme"
import { tableStyles } from "../styles"
import { ChevronDown, ChevronRight, Download } from "lucide-react"
import { TableCell } from "../components/ui/table"
import { ViewControls, type FilterEntry } from "../components/ViewControls"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { Button } from "../components/ui/button"
import { DataTable, type ColumnDef } from "../components/DataTable"
import { parseShortDate, sortPeriods } from "../utils/date"
import { formatNumberOrNull } from "../utils/format"
import { useViewParams } from "../hooks/useViewParams"
import rawData from "../data/ui_inventory_health.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawRecord {
  sku: string
  sku_name: string
  location: string
  period: string
  starting_inventory: number
  forecasted_sales: number
  po_arrivals: number
  ending_inventory: number
  starting_wos: number
  ending_wos: number
  target_wos: number
  unfulfilled_demand: number
  in_stock_rate: number
  purchase_order_to_place: number
  [key: string]: string | number | null
}

interface HealthGroupRow {
  id: string
  segmentLabel: string
  measures: Record<string, number[]>
  targetWos: number
}

// ─── Measure configuration ──────────────────────────────────────────────────

const MEASURE_KEYS = [
  "starting_inventory",
  "forecasted_sales",
  "po_arrivals",
  "ending_inventory",
  "starting_wos",
  "ending_wos",
  "unfulfilled_demand",
  "in_stock_rate",
  "purchase_order_to_place",
] as const

const MEASURE_LABEL_BASE: Record<string, string> = {
  starting_inventory: "Starting Inventory",
  forecasted_sales: "Forecasted Sales",
  po_arrivals: "PO Arrivals",
  ending_inventory: "Ending Inventory",
  starting_wos: "Starting Weeks of Supply",
  ending_wos: "Ending Weeks of Supply",
  unfulfilled_demand: "Unfulfilled Demand",
  in_stock_rate: "In Stock Rate",
  purchase_order_to_place: "Purchase Order to Place",
}

/** WOS/supply label adapts to display period */
function getMeasureLabel(key: string, displayBy: string): string {
  const periodWord = displayBy === "Day" ? "Days" : displayBy === "Month" ? "Months" : "Weeks"
  if (key === "starting_wos") return `Starting ${periodWord} of Supply`
  if (key === "ending_wos") return `Ending ${periodWord} of Supply`
  return MEASURE_LABEL_BASE[key] ?? key
}

/** Scale target_wos (always stored in weeks) to the current display period */
function scaleTargetWos(targetWos: number, displayBy: string): number {
  if (displayBy === "Day") return targetWos * 7
  if (displayBy === "Month") return targetWos / 4.33
  return targetWos // Week
}

// Measures that show a TOTAL column
const TOTAL_MEASURES = new Set([
  "purchase_order_to_place",
  "forecasted_sales",
  "po_arrivals",
  "unfulfilled_demand",
])

// ─── Segment + filter configuration ─────────────────────────────────────────

const SEGMENT_COLS = ["sku", "sku_name", "location"] as const

const SEGMENT_LABEL: Record<string, string> = {
  sku: "SKU",
  sku_name: "Name",
  location: "Location",
}

const DISPLAY_OPTIONS = [
  { value: "Day", label: "Day" },
  { value: "Week", label: "Week" },
  { value: "Month", label: "Month" },
]

// Flow measures are summed when aggregating; stock measures use first/last snapshot
const FLOW_MEASURES = new Set([
  "forecasted_sales",
  "po_arrivals",
  "unfulfilled_demand",
  "purchase_order_to_place",
])

/** Bucket a "MM/DD/YY" date string into a period key based on display granularity */
function bucketPeriod(shortDate: string, displayBy: string): string {
  if (displayBy === "Day") return shortDate
  const d = parseShortDate(shortDate)
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = String(d.getFullYear()).slice(2)
  if (displayBy === "Month") return `${mm}/01/${yy}`
  // Week — truncate to Monday
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  const wMm = String(monday.getMonth() + 1).padStart(2, "0")
  const wDd = String(monday.getDate()).padStart(2, "0")
  const wYy = String(monday.getFullYear()).slice(2)
  return `${wMm}/${wDd}/${wYy}`
}

function getAggregateOptions(displayBy: string) {
  return MEASURE_KEYS.map((k) => ({
    value: k,
    label: getMeasureLabel(k, displayBy),
  }))
}

// ─── WOS color coding ───────────────────────────────────────────────────────

function getWosCellBg(value: number, targetWos: number): string | undefined {
  if (targetWos <= 0) return undefined
  const ratio = value / targetWos
  if (ratio >= 0.8) return theme.colors.green100   // Healthy
  if (ratio >= 0.5) return theme.colors.yellow100   // Caution
  if (ratio >= 0.2) return theme.colors.orange100   // Low
  return theme.colors.red50                          // Critical
}

function getWosCellColor(value: number, targetWos: number): string {
  if (targetWos <= 0) return theme.colors.mutedForeground
  const ratio = value / targetWos
  if (ratio >= 0.8) return theme.colors.green700
  if (ratio >= 0.5) return theme.colors.yellow600
  if (ratio >= 0.2) return theme.colors.orange600
  return theme.colors.red700
}

// ─── Frozen column widths (px) ───────────────────────────────────────────────

const SEGMENT_MEASURE_W = 320

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${theme.colors.background};
  `,
  note: css`
    padding: 0.5rem 1.5rem;
    color: ${theme.colors.mutedForeground};
    font-size: 0.8125rem;
    font-style: italic;
  `,
}

// ─── Default view params ─────────────────────────────────────────────────────

const defaultViewParams = {
  segments: ["sku", "sku_name"] as string[],
  displayBy: "Week",
  aggregateBy: "starting_wos",
  filters: [] as FilterEntry[],
  fromDate: "01/01/2025",
  toDate: "07/31/2026",
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InventoryHealthView = () => {
  const { params, setParam } = useViewParams(defaultViewParams)

  const allRecords = useMemo(() => rawData as RawRecord[], [])

  const segmentOptions = useMemo(() =>
    SEGMENT_COLS.map((k) => ({ value: k, label: SEGMENT_LABEL[k] ?? k })),
  [])

  const filterColumns = useMemo(() =>
    SEGMENT_COLS.map((col) => ({
      value: col,
      label: SEGMENT_LABEL[col] ?? col,
      options: [...new Set(allRecords.map((r) => r[col] as string).filter(Boolean))].sort(),
    })),
  [allRecords])

  const isWosMeasure = params.aggregateBy === "starting_wos" || params.aggregateBy === "ending_wos"
  const showTotal = TOTAL_MEASURES.has(params.aggregateBy)

  // ── Filter + date range → working set ─────────────────────────────────────

  const fromDate = useMemo(() => parseShortDate(params.fromDate), [params.fromDate])
  const toDate = useMemo(() => parseShortDate(params.toDate), [params.toDate])

  const filtered = useMemo(() => {
    let rows = allRecords.filter((r) => {
      const d = parseShortDate(r.period)
      return d >= fromDate && d <= toDate
    })
    for (const [column, operator, values] of params.filters) {
      if (values.length === 0) continue
      if (operator === "in") {
        rows = rows.filter((r) => values.includes(r[column] as string))
      } else if (operator === "not in") {
        rows = rows.filter((r) => !values.includes(r[column] as string))
      } else if (operator === "contains") {
        const term = (values[0] ?? "").toLowerCase()
        if (term) rows = rows.filter((r) => (r[column] as string)?.toLowerCase().includes(term))
      }
    }
    return rows
  }, [allRecords, params.filters, fromDate, toDate])

  // ── Pre-aggregate daily records into display periods ────────────────────

  /** Pre-aggregated record: flows summed, stocks from first/last day */
  interface AggRecord extends RawRecord {
    _bucket: string
  }

  const bucketedRecords = useMemo<AggRecord[]>(() => {
    if (params.displayBy === "Day") {
      // Recompute WOS as days of supply: SI / daily_sales
      return filtered.map((r) => {
        const dailySales = Math.max(r.forecasted_sales, 1)
        return {
          ...r,
          _bucket: r.period,
          starting_wos: Math.round((r.starting_inventory / dailySales) * 10) / 10,
          ending_wos: Math.round((r.ending_inventory / dailySales) * 10) / 10,
        }
      })
    }

    // Group by (segmentation key fields + bucket)
    const segKey = (r: RawRecord) =>
      `${r.sku}|${r.sku_name}|${r.location}`

    type BucketAcc = {
      flowSums: Record<string, number>
      firstSI: number
      lastEI: number
      firstDate: Date
      lastDate: Date
      count: number
      sample: RawRecord
    }

    const buckets = new Map<string, BucketAcc>()

    for (const r of filtered) {
      const bucket = bucketPeriod(r.period, params.displayBy)
      const key = `${segKey(r)}||${bucket}`
      const d = parseShortDate(r.period)

      if (!buckets.has(key)) {
        const flowSums: Record<string, number> = {}
        for (const mk of MEASURE_KEYS) {
          if (FLOW_MEASURES.has(mk)) flowSums[mk] = 0
        }
        buckets.set(key, {
          flowSums,
          firstSI: r.starting_inventory,
          lastEI: r.ending_inventory,
          firstDate: d,
          lastDate: d,
          count: 0,
          sample: r,
        })
      }

      const acc = buckets.get(key)!
      acc.count++

      // Sum flow measures
      for (const mk of MEASURE_KEYS) {
        if (FLOW_MEASURES.has(mk)) {
          acc.flowSums[mk] += r[mk] as number
        }
      }

      // Track first/last for stock snapshots
      if (d.getTime() < acc.firstDate.getTime()) {
        acc.firstSI = r.starting_inventory
        acc.firstDate = d
      }
      if (d.getTime() >= acc.lastDate.getTime()) {
        acc.lastEI = r.ending_inventory
        acc.lastDate = d
      }
    }

    const result: AggRecord[] = []
    for (const [, acc] of buckets) {
      const bucket = bucketPeriod(acc.sample.period, params.displayBy)
      // Compute demand rate in the display unit's period
      // For Week: total_sales / num_weeks  → "weeks of supply"
      // For Month: total_sales / num_months → "months of supply"
      const numPeriods = params.displayBy === "Month"
        ? acc.count / 30.44  // avg days per month
        : acc.count / 7      // weeks
      const periodDemand = acc.flowSums["forecasted_sales"]
        ? acc.flowSums["forecasted_sales"] / Math.max(numPeriods, 0.1)
        : 1

      result.push({
        ...acc.sample,
        _bucket: bucket,
        period: bucket,
        starting_inventory: acc.firstSI,
        ending_inventory: acc.lastEI,
        forecasted_sales: acc.flowSums["forecasted_sales"],
        po_arrivals: acc.flowSums["po_arrivals"],
        unfulfilled_demand: acc.flowSums["unfulfilled_demand"],
        purchase_order_to_place: acc.flowSums["purchase_order_to_place"],
        starting_wos: Math.round((acc.firstSI / Math.max(periodDemand, 1)) * 10) / 10,
        ending_wos: Math.round((acc.lastEI / Math.max(periodDemand, 1)) * 10) / 10,
        in_stock_rate: Math.min(1, Math.round(((acc.firstSI + acc.flowSums["po_arrivals"]) / Math.max(acc.flowSums["forecasted_sales"], 1)) * 100) / 100),
      })
    }
    return result
  }, [filtered, params.displayBy])

  // ── Build period columns from bucketed data ───────────────────────────────

  const periodColumns = useMemo(() => {
    const set = new Set<string>()
    for (const r of bucketedRecords) set.add(r._bucket)
    return sortPeriods([...set])
  }, [bucketedRecords])

  const periodIndex = useMemo(() => {
    const map = new Map<string, number>()
    periodColumns.forEach((p, i) => map.set(p, i))
    return map
  }, [periodColumns])

  // ── Column definitions ────────────────────────────────────────────────────

  const columnDefs = useMemo(() => {
    const labelCols: ColumnDef[] = [{
      key: "segmentation_measure",
      header: "segmentation / measure",
      css: css`
        position: sticky;
        left: 0;
        z-index: 3;
        min-width: ${SEGMENT_MEASURE_W}px;
        max-width: ${SEGMENT_MEASURE_W}px;
        background: ${theme.colors.muted};
        box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08);
      `,
    }]

    const dateCols = periodColumns.map((col, idx) => ({
      key: col,
      header: `${col} \u25BC (${idx + 1})`,
      css: [tableStyles.right, tableStyles.colMin] as import("@emotion/react").Interpolation<import("../styles").Theme>,
    }))

    const cols = [...labelCols, ...dateCols]

    if (showTotal) {
      cols.push({
        key: "_total",
        header: "Total",
        css: [tableStyles.right, tableStyles.thTotal, tableStyles.colMin] as import("@emotion/react").Interpolation<import("../styles").Theme>,
      })
    }

    return cols
  }, [periodColumns, showTotal])

  // ── Group + aggregate measures ────────────────────────────────────────────

  const groups = useMemo<HealthGroupRow[]>(() => {
    const grouped = new Map<string, { measures: Map<string, number[]>; targetWos: number; count: number }>()

    for (const r of bucketedRecords) {
      const key = params.segments.map((seg) => (r[seg] as string) ?? "").join(" | ")
      if (!grouped.has(key)) {
        const measures = new Map<string, number[]>()
        for (const mk of MEASURE_KEYS) {
          measures.set(mk, new Array(periodColumns.length).fill(0))
        }
        grouped.set(key, { measures, targetWos: r.target_wos, count: 0 })
      }
      const entry = grouped.get(key)!
      entry.count++
      const pi = periodIndex.get(r._bucket)
      if (pi !== undefined) {
        for (const mk of MEASURE_KEYS) {
          entry.measures.get(mk)![pi] += r[mk] as number
        }
      }
    }

    // Recompute derived ratios from summed absolutes
    for (const [, entry] of grouped) {
      const startInv = entry.measures.get("starting_inventory")!
      const endInv = entry.measures.get("ending_inventory")!
      const sales = entry.measures.get("forecasted_sales")!
      const poArr = entry.measures.get("po_arrivals")!
      const swos = entry.measures.get("starting_wos")!
      const ewos = entry.measures.get("ending_wos")!
      const isr = entry.measures.get("in_stock_rate")!

      for (let i = 0; i < periodColumns.length; i++) {
        const weeklyDemand = sales[i] || 1
        swos[i] = Math.round((startInv[i] / weeklyDemand) * 10) / 10
        ewos[i] = Math.round((endInv[i] / weeklyDemand) * 10) / 10
        isr[i] = Math.min(1, Math.round(((startInv[i] + poArr[i]) / weeklyDemand) * 100) / 100)
      }
    }

    const result: HealthGroupRow[] = []
    const sortedEntries = [...grouped.entries()].sort((a, b) => {
      const aggKey = params.aggregateBy
      const aVal = a[1].measures.get(aggKey)?.[0] ?? 0
      const bVal = b[1].measures.get(aggKey)?.[0] ?? 0
      // WOS measures: ascending (lower = worse = top); others: descending
      if (aggKey === "starting_wos" || aggKey === "ending_wos" || aggKey === "in_stock_rate") {
        return aVal - bVal
      }
      return bVal - aVal
    })
    for (const [groupKey, entry] of sortedEntries) {
      const measuresObj: Record<string, number[]> = {}
      for (const [mk, vals] of entry.measures.entries()) {
        measuresObj[mk] = vals
      }
      result.push({
        id: groupKey,
        segmentLabel: groupKey,
        measures: measuresObj,
        targetWos: entry.targetWos,
      })
    }
    return result
  }, [bucketedRecords, params.segments, periodColumns, periodIndex, params.aggregateBy])

  // ── DataTable callbacks ───────────────────────────────────────────────────

  const getRowId = useCallback((row: HealthGroupRow) => row.id, [])

  const formatValue = useCallback((value: number, measure: string) => {
    if (measure === "in_stock_rate") return `${Math.round(value * 100)}%`
    if (measure === "starting_wos" || measure === "ending_wos") return value.toFixed(1)
    return formatNumberOrNull(value)
  }, [])

  const renderCells = useCallback((row: HealthGroupRow, isExpanded: boolean, toggle: () => void) => {
    const aggValues = row.measures[params.aggregateBy] ?? []
    const aggTotal = aggValues.reduce((a, v) => a + v, 0)
    const scaledTarget = scaleTargetWos(row.targetWos, params.displayBy)

    return (
      <>
        <TableCell
          css={css`
            position: sticky;
            left: 0;
            z-index: 1;
            min-width: ${SEGMENT_MEASURE_W}px;
            max-width: ${SEGMENT_MEASURE_W}px;
            background: inherit;
            padding: 0.5rem 0.75rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: ${theme.colors.foreground};
            font-weight: 500;
            cursor: pointer;
            box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08);
          `}
          onClick={toggle}
        >
          <div css={css`display: flex; align-items: center; gap: 0.375rem;`}>
            {isExpanded
              ? <ChevronDown css={css`width: 0.875rem; height: 0.875rem; flex-shrink: 0; color: ${theme.colors.mutedForeground};`} />
              : <ChevronRight css={css`width: 0.875rem; height: 0.875rem; flex-shrink: 0; color: ${theme.colors.mutedForeground};`} />
            }
            <span>{row.segmentLabel}</span>
          </div>
        </TableCell>

        {aggValues.map((v, ci) => {
          const bg = isWosMeasure ? getWosCellBg(v, scaledTarget) : undefined
          const fg = isWosMeasure ? getWosCellColor(v, scaledTarget) : theme.colors.mutedForeground

          return (
            <TableCell
              key={ci}
              css={css`
                padding: 0.5rem 0.5rem;
                text-align: right;
                font-variant-numeric: tabular-nums;
                color: ${fg};
                background: ${bg ?? "inherit"};
                font-weight: ${isWosMeasure ? "500" : "400"};
              `}
            >
              {formatValue(v, params.aggregateBy)}
            </TableCell>
          )
        })}

        {showTotal && (
          <TableCell
            css={css`
              padding: 0.5rem 0.75rem;
              text-align: right;
              font-variant-numeric: tabular-nums;
              font-weight: 600;
              color: ${theme.colors.foreground};
            `}
          >
            {formatNumberOrNull(aggTotal)}
          </TableCell>
        )}
      </>
    )
  }, [params.aggregateBy, params.displayBy, isWosMeasure, showTotal, formatValue])

  const renderExpandedContent = useCallback((row: HealthGroupRow) => {
    const scaledTarget = scaleTargetWos(row.targetWos, params.displayBy)
    return (
    <td colSpan={columnDefs.length} css={css`padding: 0;`}>
      <table css={css`width: 100%; border-collapse: collapse;`}>
        <tbody>
          {MEASURE_KEYS.map((mk) => {
            const values = row.measures[mk] ?? []
            const total = values.reduce((a, v) => a + v, 0)
            const isActive = mk === params.aggregateBy
            const isMkWos = mk === "starting_wos" || mk === "ending_wos"

            return (
              <tr
                key={mk}
                css={css`
                  background: ${isActive ? theme.colors.gray50 : "transparent"};
                  border-bottom: 1px solid ${theme.colors.border}20;
                `}
              >
                <td
                  css={css`
                    position: sticky;
                    left: 0;
                    z-index: 1;
                    background: inherit;
                    padding: 0.375rem 0.75rem 0.375rem 2.5rem;
                    white-space: nowrap;
                    min-width: ${SEGMENT_MEASURE_W}px;
                    max-width: ${SEGMENT_MEASURE_W}px;
                    box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08);
                    color: ${isActive ? theme.colors.foreground : theme.colors.mutedForeground};
                    font-weight: ${isActive ? "500" : "400"};
                    font-size: 0.8125rem;
                  `}
                >
                  {getMeasureLabel(mk, params.displayBy)}
                </td>
                {values.map((v, ci) => {
                  const bg = isMkWos ? getWosCellBg(v, scaledTarget) : undefined
                  const fg = isMkWos ? getWosCellColor(v, scaledTarget) : (isActive ? theme.colors.foreground : theme.colors.mutedForeground)

                  return (
                    <td
                      key={ci}
                      css={css`
                        padding: 0.375rem 0.5rem;
                        text-align: right;
                        font-variant-numeric: tabular-nums;
                        font-size: 0.8125rem;
                        color: ${fg};
                        font-weight: ${isActive || isMkWos ? "500" : "400"};
                        background: ${bg ?? "inherit"};
                      `}
                    >
                      {formatValue(v, mk)}
                    </td>
                  )
                })}
                {showTotal && (
                  <td
                    css={css`
                      padding: 0.375rem 0.75rem;
                      text-align: right;
                      font-variant-numeric: tabular-nums;
                      font-size: 0.8125rem;
                      font-weight: ${isActive ? "600" : "400"};
                      color: ${isActive ? theme.colors.foreground : theme.colors.mutedForeground};
                    `}
                  >
                    {TOTAL_MEASURES.has(mk) ? formatNumberOrNull(total) : ""}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </td>
  )}, [columnDefs.length, params.aggregateBy, params.displayBy, showTotal, formatValue])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div css={s.page}>
      <PageHeader
        title="Inventory Health"
        description=""
        actions={
          <Button variant="tertiary" size="sm">
            <Download size={14} />
            Export
          </Button>
        }
      />

      <ViewControls>
        <ViewControls.DisplayBy
          value={params.displayBy}
          onChange={(v) => setParam("displayBy", v)}
          options={DISPLAY_OPTIONS}
        />
        <ViewControls.AggregateBy
          value={params.aggregateBy}
          onChange={(v) => setParam("aggregateBy", v)}
          options={getAggregateOptions(params.displayBy)}
        />
        <ViewControls.FilterBy
          filters={params.filters}
          onFiltersChange={(v) => setParam("filters", v)}
          columns={filterColumns}
        />
        <ViewControls.DateRange
          from={params.fromDate}
          to={params.toDate}
          onFromChange={(v) => setParam("fromDate", v)}
          onToChange={(v) => setParam("toDate", v)}
        />
      </ViewControls>

      <div css={s.note}>
        *Starting inventory in this view is inventory on hand + open purchase orders
      </div>

      <div css={tableStyles.wrap}>
        <DataTable<HealthGroupRow>
          data={groups}
          getRowId={getRowId}
          columns={columnDefs}
          renderCells={renderCells}
          renderExpandedContent={renderExpandedContent}
          getRowBg={(_, isExpanded) => isExpanded ? theme.colors.gray200 : theme.colors.background}
          getDetailRowBg={() => "transparent"}
        />
      </div>
    </div>
  )
}
