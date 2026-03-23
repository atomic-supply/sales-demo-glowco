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
import { currentYearStart, currentYearEnd, parseShortDate, sortPeriods } from "../utils/date"
import { formatNumberOrNull } from "../utils/format"
import { useViewParams } from "../hooks/useViewParams"
import rawData from "../data/ui_supply_walk.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawRecord {
  sku: string
  retailer: string | null
  period: string      // "MM/01/YY"
  starting_inventory: number
  open_shipments_received: number
  simulated_shipments_received: number
  forecast_sales: number
  net_supply_balance: number
  ending_inventory: number
  [key: string]: string | number | null
}

interface SupplyGroupRow {
  id: string
  segmentLabel: string
  measures: Record<string, number[]>
}

// ─── Measure configuration ──────────────────────────────────────────────────

const MEASURE_KEYS = [
  "starting_inventory",
  "open_shipments_received",
  "simulated_shipments_received",
  "forecast_sales",
  "net_supply_balance",
  "ending_inventory",
] as const

const MEASURE_LABEL: Record<string, string> = {
  starting_inventory: "Starting Inventory",
  open_shipments_received: "Open Shipments",
  simulated_shipments_received: "Simulated Shipments",
  forecast_sales: "Forecast Sales",
  net_supply_balance: "Net Supply Balance",
  ending_inventory: "Ending Inventory",
}

// ─── Segment configuration ──────────────────────────────────────────────────

const SEGMENT_COLS = ["retailer", "sku"] as const

const SEGMENT_LABEL: Record<string, string> = {
  retailer: "Retailer",
  sku: "SKU",
}

const DISPLAY_OPTIONS = [
  { value: "Month", label: "Month" },
]

const AGGREGATE_OPTIONS = MEASURE_KEYS.map((k) => ({
  value: k,
  label: MEASURE_LABEL[k],
}))

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
  aggregateBy: "ending_inventory",
  filters: [] as FilterEntry[],
  fromDate: currentYearStart(),
  toDate: currentYearEnd(),
}

// ─── Component ────────────────────────────────────────────────────────────────

export const SupplyWalkView = () => {
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

  // ── Build period columns from the filtered data ───────────────────────────

  const periodColumns = useMemo(() => {
    const set = new Set<string>()
    for (const r of filtered) set.add(r.period)
    return sortPeriods([...set])
  }, [filtered])

  const periodIndex = useMemo(() => {
    const map = new Map<string, number>()
    periodColumns.forEach((p, i) => map.set(p, i))
    return map
  }, [periodColumns])

  // ── Column definitions ────────────────────────────────────────────────────

  const columnDefs = useMemo(() => {
    const labelCols: ColumnDef[] = [{
      key: "segmentation_measure",
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

  // ── Group + aggregate measures ────────────────────────────────────────────

  const groups = useMemo<SupplyGroupRow[]>(() => {
    const grouped = new Map<string, Map<string, number[]>>()

    for (const r of filtered) {
      const key = params.segments.map((seg) => (r[seg] as string) ?? "").join(" | ")
      if (!grouped.has(key)) {
        const measures = new Map<string, number[]>()
        for (const mk of MEASURE_KEYS) {
          measures.set(mk, new Array(periodColumns.length).fill(0))
        }
        grouped.set(key, measures)
      }
      const measures = grouped.get(key)!
      const pi = periodIndex.get(r.period)
      if (pi !== undefined) {
        for (const mk of MEASURE_KEYS) {
          measures.get(mk)![pi] += r[mk] as number
        }
      }
    }

    const result: SupplyGroupRow[] = []
    for (const [groupKey, measures] of [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      const measuresObj: Record<string, number[]> = {}
      for (const [mk, vals] of measures.entries()) {
        measuresObj[mk] = vals
      }
      result.push({
        id: groupKey,
        segmentLabel: groupKey,
        measures: measuresObj,
      })
    }
    return result
  }, [filtered, params.segments, periodColumns, periodIndex])

  // ── DataTable callbacks ───────────────────────────────────────────────────

  const getRowId = useCallback((row: SupplyGroupRow) => row.id, [])

  const renderCells = useCallback((row: SupplyGroupRow, isExpanded: boolean, toggle: () => void) => {
    const aggValues = row.measures[params.aggregateBy] ?? []
    const aggTotal = aggValues.reduce((a, v) => a + v, 0)

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

        {aggValues.map((v, ci) => (
          <TableCell
            key={ci}
            css={css`
              padding: 0.5rem 0.5rem;
              text-align: right;
              font-variant-numeric: tabular-nums;
              color: ${theme.colors.mutedForeground};
            `}
          >
            {formatNumberOrNull(v)}
          </TableCell>
        ))}

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
      </>
    )
  }, [params.aggregateBy])

  const renderExpandedContent = useCallback((row: SupplyGroupRow) => (
    <td colSpan={columnDefs.length} css={css`padding: 0;`}>
      <table css={css`width: 100%; border-collapse: collapse;`}>
        <tbody>
          {MEASURE_KEYS.map((mk) => {
            const values = row.measures[mk] ?? []
            const total = values.reduce((a, v) => a + v, 0)
            const isActive = mk === params.aggregateBy

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
                  {MEASURE_LABEL[mk]}
                </td>
                {values.map((v, ci) => (
                  <td
                    key={ci}
                    css={css`
                      padding: 0.375rem 0.5rem;
                      text-align: right;
                      font-variant-numeric: tabular-nums;
                      font-size: 0.8125rem;
                      color: ${isActive ? theme.colors.foreground : theme.colors.mutedForeground};
                      font-weight: ${isActive ? "500" : "400"};
                    `}
                  >
                    {formatNumberOrNull(v)}
                  </td>
                ))}
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
                  {formatNumberOrNull(total)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </td>
  ), [columnDefs.length, params.aggregateBy])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div css={s.page}>
      <PageHeader
        title="Shipments"
        description="Supply walk by retailer and SKU"
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
          value={params.aggregateBy}
          onChange={(v) => setParam("aggregateBy", v)}
          options={AGGREGATE_OPTIONS}
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
        <DataTable<SupplyGroupRow>
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
