/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback, useRef, forwardRef, type ReactNode } from "react"
import { TableVirtuoso, type Components } from "react-virtuoso"
import { TableHead } from "./ui/table"
import { tableStyles } from "../styles/mixins/table"
import { theme, alpha } from "../styles/theme/theme"
import type { Theme } from "../styles"

type ThemeCss = import("@emotion/react").Interpolation<Theme>

// ─── Types ────────────────────────────────────────────────────────────────────

type FlatRow<T> =
  | { kind: "data"; item: T; isExpanded: boolean }
  | { kind: "detail"; item: T }

export interface ColumnDef {
  key: string
  header: ReactNode
  css?: ThemeCss
}

/**
 * Build ColumnDef[] for time-series tables: label columns → date columns → total.
 * Used by planning views (DemandPlan, ShipmentForecast, SupplyWalk).
 */
export function buildTimeSeriesColumns(
  labelColumns: ColumnDef[],
  dateColumns: string[],
): ColumnDef[] {
  return [
    ...labelColumns,
    ...dateColumns.map((col) => ({
      key: col,
      header: col,
      css: [tableStyles.right, tableStyles.colMin] as ThemeCss,
    })),
    {
      key: "_total",
      header: "Total",
      css: [tableStyles.right, tableStyles.thTotal, tableStyles.colMin] as ThemeCss,
    },
  ]
}

/**
 * Unified virtualized data table with optional expand/collapse.
 *
 * **Flat mode** (no expansion):
 *   Provide `data`, `columns`, `renderCells`. Omit `getRowId`/`renderExpandedContent`.
 *
 * **Expandable mode** (detail row per item):
 *   Also provide `getRowId` and `renderExpandedContent`. Each row can expand
 *   to show a detail section (single <td colSpan={N}> or arbitrary content).
 *
 * **Accordion mode** (group → sub-items):
 *   Use expandable mode. In `renderExpandedContent`, render your sub-items as
 *   a nested <table> inside a single <td colSpan={N}>.
 */
export interface DataTableProps<T> {
  /** Rows to display */
  data: T[]
  /** Column header definitions (renders structured <th> elements) */
  columns?: ColumnDef[]
  /** Custom header row (alternative to `columns` for full control) */
  renderHeader?: () => ReactNode
  /** Render the cells for a data row. If expandable, receives toggle function. */
  renderCells: (item: T, isExpanded: boolean, toggle: () => void) => ReactNode
  /**
   * Return a stable unique id for each row. Required for expand/collapse.
   * When omitted, the table is flat (no expand/collapse).
   */
  getRowId?: (item: T) => string
  /**
   * Render the full expanded detail row content.
   * Typically a single <td colSpan={N}> wrapping a nested table or arbitrary content.
   * Only called for expanded rows. Requires `getRowId` to be set.
   */
  renderExpandedContent?: (item: T) => ReactNode
  /** Custom background per row */
  getRowBg?: (item: T, isExpanded: boolean) => string
  /** Custom background for detail/expanded rows (default: theme.colors.muted) */
  getDetailRowBg?: (item: T) => string
  /** When true, the row gets a blue50 highlight (selection state) */
  isRowSelected?: (item: T) => boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  data,
  columns,
  renderHeader,
  renderCells,
  getRowId,
  renderExpandedContent,
  getRowBg,
  getDetailRowBg,
  isRowSelected,
}: DataTableProps<T>) {
  const isExpandable = getRowId != null && renderExpandedContent != null
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleExpand = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Refs so memoized tableComponents always sees latest callbacks
  const isRowSelectedRef = useRef(isRowSelected)
  isRowSelectedRef.current = isRowSelected
  const getRowBgRef = useRef(getRowBg)
  getRowBgRef.current = getRowBg
  const getDetailRowBgRef = useRef(getDetailRowBg)
  getDetailRowBgRef.current = getDetailRowBg

  const flatRows = useMemo<FlatRow<T>[]>(() => {
    if (!isExpandable) {
      return data.map((item) => ({ kind: "data" as const, item, isExpanded: false }))
    }
    const rows: FlatRow<T>[] = []
    for (const item of data) {
      const id = getRowId!(item)
      const isExpanded = expandedRows.has(id)
      rows.push({ kind: "data", item, isExpanded })
      if (isExpanded) rows.push({ kind: "detail", item })
    }
    return rows
  }, [data, expandedRows, getRowId, isExpandable])

  const tableComponents = useMemo<Components<FlatRow<T>>>(() => ({
    Scroller: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ style, ...props }, ref) => (
        <div ref={ref} style={{ ...style, overflow: "auto" }} {...props} />
      ),
    ),
    Table: ({ style, ...props }: React.HTMLAttributes<HTMLTableElement> & { style?: React.CSSProperties }) => (
      <table style={style} css={tableStyles.table} {...props} />
    ),
    TableHead: forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
      (props, ref) => <thead ref={ref} css={tableStyles.thead} {...props} />,
    ),
    TableBody: forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
      (props, ref) => <tbody ref={ref} {...props} />,
    ),
    TableRow: ({ item, ...props }: { item?: FlatRow<T> } & React.HTMLAttributes<HTMLTableRowElement>) => {
      const row = item as FlatRow<T>
      if (row.kind === "detail") {
        const bg = getDetailRowBgRef.current?.(row.item) ?? theme.colors.muted
        return <tr {...props} css={css`background: ${bg};`} />
      }
      const selected = isRowSelectedRef.current?.(row.item) ?? false
      const customBg = getRowBgRef.current?.(row.item, row.isExpanded)
      const bg = selected
        ? theme.colors.blue50
        : customBg ?? theme.colors.background
      const hoverBg = selected
        ? theme.colors.blue50
        : customBg
          ? alpha(customBg, 0.8)
          : theme.colors.muted
      return (
        <tr
          {...props}
          css={css`
            border-bottom: 1px solid ${theme.colors.border};
            background: ${bg};
            transition: background-color 0.1s;
            &:hover { background: ${hoverBg}; }
          `}
        />
      )
    },
  }), []) // stable — all callbacks accessed via refs

  const noop = useCallback(() => {}, [])

  return (
    <TableVirtuoso<FlatRow<T>>
      style={{ height: "100%" }}
      data={flatRows}
      fixedHeaderContent={
        renderHeader ??
        (columns
          ? () => (
              <tr>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    css={col.css ? [tableStyles.th, col.css] as any : tableStyles.th}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </tr>
            )
          : () => null)
      }
      components={tableComponents}
      itemContent={(_, row) => {
        if (row.kind === "detail") return renderExpandedContent!(row.item)
        const toggle = isExpandable
          ? () => toggleExpand(getRowId!(row.item))
          : noop
        return renderCells(row.item, row.isExpanded, toggle)
      }}
    />
  )
}
