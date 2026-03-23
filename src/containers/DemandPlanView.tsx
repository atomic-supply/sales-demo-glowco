/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMemo, useCallback } from "react"
import { theme } from "../styles/theme/theme"
import { tableStyles } from "../styles"
import { Download } from "lucide-react"
import { TableCell } from "../components/ui/table"
import { ViewControls, type FilterEntry } from "../components/ViewControls"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { Button } from "../components/ui/button"
import { DataTable, type ColumnDef } from "../components/DataTable"
import { terminology } from "../data/app-config"
import { currentYearStart, currentYearEnd, parseShortDate, dateToPeriod } from "../utils/date"
import { formatNumberOrNull } from "../utils/format"
import { useViewParams } from "../hooks/useViewParams"
import rawData from "../data/ui_retail_forecast.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawRecord {
  sku: string
  retailer: string
  date: string        // "YYYY-MM-DD"
  status: string      // "Actual" | "Forecast"
  quantity: number
  [key: string]: string | number
}

interface FlatDemandRow {
  id: string
  segmentLabel: string
  values: (number | null)[]
  total: number
  isTotal: boolean
}

// ─── Segment configuration ──────────────────────────────────────────────────

const SEGMENT_COLS = ["retailer", "sku"] as const

const SEGMENT_LABEL: Record<string, string> = {
  retailer: "Retailer",
  sku: "SKU",
}

const DISPLAY_OPTIONS = [
  { value: "Month", label: "Month" },
  { value: "Week", label: "Week" },
]

const STATUS_OPTIONS = [
  { value: "Forecast", label: "Forecast" },
  { value: "Actual", label: "Actual" },
]

// ─── Frozen column widths (px) ───────────────────────────────────────────────

const SEGMENT_MEASURE_W = 280

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${theme.colors.background};
  `,
}

// ─── Default view params ─────────────────────────────────────────────────────

const defaultViewParams = {
  segments: ["retailer", "sku"] as string[],
  displayBy: "Month",
  status: "Forecast",
  filters: [] as FilterEntry[],
  fromDate: currentYearStart(),
  toDate: currentYearEnd(),
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DemandPlanView() {
  const { params, setParam } = useViewParams(defaultViewParams)

  // Cast the JSON import to typed records
  const allRecords = useMemo(() => rawData as RawRecord[], [])

  // Segment options derived from the string columns in the data
  const segmentOptions = useMemo(() =>
    SEGMENT_COLS.map((k) => ({ value: k, label: SEGMENT_LABEL[k] ?? k })),
  [])

  // Unique values per segment column for filter dropdowns
  const filterColumns = useMemo(() =>
    SEGMENT_COLS.map((col) => ({
      value: col,
      label: SEGMENT_LABEL[col] ?? col,
      options: [...new Set(allRecords.map((r) => r[col] as string))].sort(),
    })),
  [allRecords])

  // ── Filter + status + date range → working set ────────────────────────────

  const fromDate = useMemo(() => parseShortDate(params.fromDate), [params.fromDate])
  const toDate = useMemo(() => parseShortDate(params.toDate), [params.toDate])

  const filtered = useMemo(() => {
    let rows = allRecords.filter((r) => {
      if (r.status !== params.status) return false
      const d = new Date(r.date + "T00:00:00")
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
  }, [allRecords, params.status, params.filters, fromDate, toDate])

  // ── Build period columns from the filtered data ───────────────────────────

  const periodColumns = useMemo(() => {
    const set = new Set<string>()
    for (const r of filtered) {
      set.add(dateToPeriod(r.date, params.displayBy))
    }
    return [...set].sort()
  }, [filtered, params.displayBy])

  const periodIndex = useMemo(() => {
    const map = new Map<string, number>()
    periodColumns.forEach((p, i) => map.set(p, i))
    return map
  }, [periodColumns])

  // ── Column definitions ────────────────────────────────────────────────────

  const columnDefs = useMemo(() => {
    const labelCols: ColumnDef[] = [{
      key: "segmentation",
      header: "segmentation",
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

    const dateCols = periodColumns.map((col) => ({
      key: col,
      header: col,
      css: [tableStyles.right, tableStyles.colMin] as import("@emotion/react").Interpolation<import("../styles").Theme>,
    }))

    return [
      ...labelCols,
      ...dateCols,
      {
        key: "_total",
        header: "Total",
        css: [tableStyles.right, tableStyles.thTotal, tableStyles.colMin] as import("@emotion/react").Interpolation<import("../styles").Theme>,
      },
    ]
  }, [periodColumns])

  // ── Group + aggregate ─────────────────────────────────────────────────────

  const rows = useMemo<FlatDemandRow[]>(() => {
    const groups = new Map<string, number[]>()

    for (const r of filtered) {
      const key = params.segments.map((seg) => r[seg] as string ?? "").join(" | ")
      if (!groups.has(key)) groups.set(key, new Array(periodColumns.length).fill(0))
      const bucket = groups.get(key)!
      const pi = periodIndex.get(dateToPeriod(r.date, params.displayBy))
      if (pi !== undefined) bucket[pi] += r.quantity
    }

    const totalValues = new Array(periodColumns.length).fill(0)
    const dataRows: FlatDemandRow[] = []

    for (const [groupKey, values] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const total = values.reduce((a, v) => a + v, 0)
      for (let i = 0; i < values.length; i++) totalValues[i] += values[i]
      dataRows.push({
        id: groupKey,
        segmentLabel: groupKey,
        values,
        total,
        isTotal: false,
      })
    }

    const grandTotal = totalValues.reduce((a, v) => a + v, 0)
    const totalRow: FlatDemandRow = {
      id: "__total__",
      segmentLabel: "Total",
      values: totalValues,
      total: grandTotal,
      isTotal: true,
    }

    return [totalRow, ...dataRows]
  }, [filtered, params.segments, params.displayBy, periodColumns, periodIndex])

  // ── Row styling ───────────────────────────────────────────────────────────

  const getRowBg = useCallback((row: FlatDemandRow): string => {
    if (row.isTotal) return theme.colors.gray50
    return theme.colors.background
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div css={s.page}>
      <PageHeader
        title={terminology.plans.consumption}
        description="Retail demand forecast by retailer and SKU"
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
        <ViewControls.SegmentBy
          segments={params.segments}
          onSegmentsChange={(v) => setParam("segments", v)}
          options={segmentOptions}
        />
        <ViewControls.AggregateBy
          label="Display by"
          value={params.status}
          onChange={(v) => setParam("status", v)}
          options={STATUS_OPTIONS}
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

      <div css={tableStyles.wrap}>
        <DataTable<FlatDemandRow>
          data={rows}
          columns={columnDefs}
          getRowBg={getRowBg}
          renderCells={(row) => {
            const isTotalRow = row.isTotal
            const weight = isTotalRow ? "600" : "400"
            const color = isTotalRow ? theme.colors.foreground : theme.colors.foreground
            const bg = isTotalRow ? theme.colors.gray50 : theme.colors.background

            return (
              <>
                <TableCell
                  css={css`
                    position: sticky;
                    left: 0;
                    z-index: 1;
                    min-width: ${SEGMENT_MEASURE_W}px;
                    max-width: ${SEGMENT_MEASURE_W}px;
                    background: ${bg};
                    padding: 0.5rem 0.75rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: ${theme.colors.foreground};
                    font-weight: ${isTotalRow ? "600" : "500"};
                    box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08);
                  `}
                >
                  {row.segmentLabel}
                </TableCell>

                {periodColumns.map((col, ci) => (
                  <TableCell
                    key={col}
                    css={css`
                      padding: 0.5rem 0.5rem;
                      text-align: right;
                      font-variant-numeric: tabular-nums;
                      color: ${color};
                      font-weight: ${weight};
                    `}
                  >
                    {formatNumberOrNull(row.values[ci])}
                  </TableCell>
                ))}

                <TableCell
                  css={css`
                    padding: 0.5rem 0.75rem;
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                    color: ${theme.colors.foreground};
                    font-weight: 600;
                  `}
                >
                  {formatNumberOrNull(row.total)}
                </TableCell>
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
