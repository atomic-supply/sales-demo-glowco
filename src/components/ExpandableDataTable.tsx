/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback, useRef, forwardRef, type ReactNode } from "react"
import { TableVirtuoso, type Components } from "react-virtuoso"
import { TableHead } from "./ui/table"
import { tableStyles } from "../styles/mixins/table"
import { theme, alpha } from "../styles/theme/theme"
import type { Interpolation } from "@emotion/react"
import type { Theme } from "../styles"

// ─── Types ────────────────────────────────────────────────────────────────────

type FlatRow<T> =
  | { kind: "data"; item: T; isExpanded: boolean }
  | { kind: "detail"; item: T }

export interface ColumnDef {
  key: string
  header: ReactNode
  css?: Interpolation<Theme>
}

export interface ExpandableDataTableProps<T> {
  /** Rows to display */
  data: T[]
  /** Column header definitions */
  columns: ColumnDef[]
  /** Return a stable unique id for each row */
  getRowId: (item: T) => string
  /**
   * Render the cells for a data row.
   * `toggle` flips the expanded state for this row.
   */
  renderCells: (item: T, isExpanded: boolean, toggle: () => void) => ReactNode
  /** Render the full expanded detail (typically a single <td colSpan={N}>) */
  renderExpandedContent: (item: T) => ReactNode
  /** When true, the row gets a blue50 highlight (selection state) */
  isRowSelected?: (item: T) => boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ExpandableDataTable<T>({
  data,
  columns,
  getRowId,
  renderCells,
  renderExpandedContent,
  isRowSelected,
}: ExpandableDataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleExpand = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // Ref so tableComponents (memoized once) always sees latest selection state
  const isRowSelectedRef = useRef(isRowSelected)
  isRowSelectedRef.current = isRowSelected

  const flatRows = useMemo<FlatRow<T>[]>(() => {
    const rows: FlatRow<T>[] = []
    for (const item of data) {
      const id = getRowId(item)
      const isExpanded = expandedRows.has(id)
      rows.push({ kind: "data", item, isExpanded })
      if (isExpanded) rows.push({ kind: "detail", item })
    }
    return rows
  }, [data, expandedRows, getRowId])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableComponents = useMemo<Components<FlatRow<T>>>(() => ({
    Scroller: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      ({ style, ...props }, ref) => (
        <div ref={ref} style={{ ...style, overflow: "auto" }} {...props} />
      ),
    ),
    Table: ({ style, ...props }) => (
      <table style={style} css={tableStyles.table} {...props} />
    ),
    TableHead: forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
      (props, ref) => <thead ref={ref} css={tableStyles.thead} {...props} />,
    ),
    TableBody: forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
      (props, ref) => <tbody ref={ref} {...props} />,
    ),
    TableRow: ({ item, ...props }) => {
      const row = item as FlatRow<T>
      if (row.kind === "detail") {
        return <tr {...props} css={css`background: ${theme.colors.muted};`} />
      }
      const selected = isRowSelectedRef.current?.(row.item) ?? false
      return (
        <tr
          {...props}
          css={css`
            border-bottom: 1px solid ${theme.colors.border};
            background: ${selected ? theme.colors.blue50 : theme.colors.background};
            &:hover { background: ${selected ? theme.colors.blue50 : theme.colors.muted}; }
          `}
        />
      )
    },
  }), []) // stable — callbacks accessed via refs

  return (
    <TableVirtuoso<FlatRow<T>>
      style={{ height: "100%" }}
      data={flatRows}
      fixedHeaderContent={() => (
        <tr>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              css={col.css ? [tableStyles.th, col.css] : tableStyles.th}
            >
              {col.header}
            </TableHead>
          ))}
        </tr>
      )}
      components={tableComponents}
      itemContent={(_, row) => {
        if (row.kind === "detail") return renderExpandedContent(row.item)
        const toggle = () => toggleExpand(getRowId(row.item))
        return renderCells(row.item, row.isExpanded, toggle)
      }}
    />
  )
}
