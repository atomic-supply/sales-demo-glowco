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
import rawData from "../data/ui_mrp_inventory.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RawRecord {
  component_code: string
  component_name: string
  category: string
  period: string
  starting_inventory: number
  total_demand: number
  scrap: number
  purchase_order_arrival: number
  ending_inventory: number
  purchase_order_to_place: number
  [key: string]: string | number | null
}

interface MRPGroupRow {
  id: string
  segmentLabel: string
  measures: Record<string, number[]>
  /** Demand breakdown by PO number per period */
  demandLines: Map<string, number[]>
}

// ─── Measure configuration ──────────────────────────────────────────────────

const MEASURE_KEYS = [
  "starting_inventory",
  "total_demand",
  "scrap",
  "purchase_order_arrival",
  "ending_inventory",
  "purchase_order_to_place",
] as const

const MEASURE_LABEL: Record<string, string> = {
  starting_inventory: "starting inventory",
  total_demand: "total demand",
  scrap: "scrap",
  purchase_order_arrival: "purchase order arrival",
  ending_inventory: "ending inventory",
  purchase_order_to_place: "purchase order to place",
}

// ─── Segment + filter configuration ─────────────────────────────────────────

const SEGMENT_COLS = ["component_code", "component_name", "category"] as const

const SEGMENT_LABEL: Record<string, string> = {
  component_code: "Code",
  component_name: "Name",
  category: "Category",
}

const DISPLAY_OPTIONS = [
  { value: "Week", label: "Week" },
]

const AGGREGATE_OPTIONS = MEASURE_KEYS.map((k) => ({
  value: k,
  label: MEASURE_LABEL[k],
}))

// ─── Frozen column widths (px) ───────────────────────────────────────────────

const SEGMENT_MEASURE_W = 340

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
  segments: ["component_code", "component_name"] as string[],
  displayBy: "Week",
  aggregateBy: "purchase_order_to_place",
  filters: [] as FilterEntry[],
  fromDate: "01/01/2025",
  toDate: "07/31/2026",
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InventoryHealthMRPView = () => {
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

    return [...labelCols, ...dateCols]
  }, [periodColumns])

  // ── Group + aggregate measures ────────────────────────────────────────────

  const groups = useMemo<MRPGroupRow[]>(() => {
    const grouped = new Map<string, { measures: Map<string, number[]>; demandLines: Map<string, number[]> }>()

    for (const r of filtered) {
      const key = params.segments.map((seg) => (r[seg] as string) ?? "").join(" | ")
      if (!grouped.has(key)) {
        const measures = new Map<string, number[]>()
        for (const mk of MEASURE_KEYS) {
          measures.set(mk, new Array(periodColumns.length).fill(0))
        }
        grouped.set(key, { measures, demandLines: new Map() })
      }
      const entry = grouped.get(key)!
      const pi = periodIndex.get(r.period)
      if (pi !== undefined) {
        for (const mk of MEASURE_KEYS) {
          entry.measures.get(mk)![pi] += r[mk] as number
        }

        // Extract individual demand PO lines
        for (const [k, v] of Object.entries(r)) {
          if (k.startsWith("demand_") && typeof v === "number" && v !== 0) {
            const poKey = k.replace("demand_", "demand: ")
            if (!entry.demandLines.has(poKey)) {
              entry.demandLines.set(poKey, new Array(periodColumns.length).fill(0))
            }
            entry.demandLines.get(poKey)![pi] += v
          }
        }
      }
    }

    const result: MRPGroupRow[] = []
    const sortedEntries = [...grouped.entries()].sort((a, b) => {
      // Sort by first period aggregate value descending
      const aggKey = params.aggregateBy
      const aVal = a[1].measures.get(aggKey)?.[0] ?? 0
      const bVal = b[1].measures.get(aggKey)?.[0] ?? 0
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
        demandLines: entry.demandLines,
      })
    }
    return result
  }, [filtered, params.segments, periodColumns, periodIndex, params.aggregateBy])

  // ── DataTable callbacks ───────────────────────────────────────────────────

  const getRowId = useCallback((row: MRPGroupRow) => row.id, [])

  const renderCells = useCallback((row: MRPGroupRow, isExpanded: boolean, toggle: () => void) => {
    const aggValues = row.measures[params.aggregateBy] ?? []

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
      </>
    )
  }, [params.aggregateBy])

  const renderExpandedContent = useCallback((row: MRPGroupRow) => {
    // Build ordered list of detail rows matching production layout:
    // starting inventory, demand lines (individual POs), scrap, purchase order arrival, ending inventory, purchase order to place
    const detailRows: { label: string; values: number[]; isBold?: boolean }[] = []

    // Starting inventory
    detailRows.push({ label: "starting inventory", values: row.measures["starting_inventory"] ?? [], isBold: false })

    // Individual demand lines — only show POs that have at least one non-zero value
    for (const [poKey, vals] of row.demandLines.entries()) {
      if (vals.some((v) => v !== 0)) {
        detailRows.push({ label: poKey, values: vals })
      }
    }

    // Scrap
    detailRows.push({ label: "scrap", values: row.measures["scrap"] ?? [] })

    // Purchase order arrival
    detailRows.push({ label: "purchase order arrival", values: row.measures["purchase_order_arrival"] ?? [] })

    // Ending inventory
    detailRows.push({ label: "ending inventory", values: row.measures["ending_inventory"] ?? [], isBold: false })

    // Purchase order to place
    detailRows.push({ label: "purchase order to place", values: row.measures["purchase_order_to_place"] ?? [], isBold: false })

    return (
      <td colSpan={columnDefs.length} css={css`padding: 0;`}>
        <table css={css`width: 100%; border-collapse: collapse; table-layout: fixed;`}>
          <colgroup>
            <col css={css`width: ${SEGMENT_MEASURE_W}px;`} />
            {detailRows[0]?.values.map((_, ci) => (
              <col key={ci} />
            ))}
          </colgroup>
          <tbody>
            {detailRows.map((dr, di) => {
              const isActive = dr.label === params.aggregateBy ||
                (params.aggregateBy === "total_demand" && dr.label.startsWith("demand:")) ||
                dr.label === MEASURE_LABEL[params.aggregateBy]

              return (
                <tr
                  key={di}
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
                      width: ${SEGMENT_MEASURE_W}px;
                      min-width: ${SEGMENT_MEASURE_W}px;
                      max-width: ${SEGMENT_MEASURE_W}px;
                      box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08);
                      color: ${theme.colors.mutedForeground};
                      font-weight: 400;
                      font-size: 0.8125rem;
                    `}
                  >
                    {dr.label}
                  </td>
                  {dr.values.map((v, ci) => (
                    <td
                      key={ci}
                      css={css`
                        padding: 0.375rem 0.5rem;
                        text-align: right;
                        font-variant-numeric: tabular-nums;
                        font-size: 0.8125rem;
                        color: ${v < 0 ? theme.colors.red600 ?? "#dc2626" : theme.colors.mutedForeground};
                        font-weight: 400;
                      `}
                    >
                      {formatNumberOrNull(v)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </td>
    )
  }, [columnDefs.length, params.aggregateBy])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div css={s.page}>
      <PageHeader
        title="Inventory Health - MRP"
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

      <div css={s.note}>
        *Starting inventory in this view is inventory on hand + open purchase orders
      </div>

      <div css={tableStyles.wrap}>
        <DataTable<MRPGroupRow>
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
