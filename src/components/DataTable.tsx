/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMemo, forwardRef, type ReactNode } from "react"
import { TableVirtuoso, type Components } from "react-virtuoso"
import { tableStyles } from "../styles/mixins/table"
import { theme, alpha } from "../styles/theme/theme"

export interface DataTableProps<T> {
  data: T[]
  fixedHeaderContent: () => ReactNode
  itemContent: (index: number, item: T) => ReactNode
  getRowBg?: (item: T) => string
}

/**
 * Simple flat virtualized data table.
 *
 * Use `ExpandableDataTable` when rows need expand/collapse detail,
 * or `AccordionTable` when rows are grouped with sub-items.
 */
export function DataTable<T>({
  data,
  fixedHeaderContent,
  itemContent,
  getRowBg,
}: DataTableProps<T>) {
  const getRowBgRef = { current: getRowBg }
  getRowBgRef.current = getRowBg

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableComponents = useMemo<Components<T>>(() => ({
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
      const row = item as T
      const bg = getRowBgRef.current?.(row) ?? theme.colors.background
      return (
        <tr
          {...props}
          css={css`
            border-bottom: 1px solid ${theme.colors.border};
            background: ${bg};
            transition: background-color 0.1s;
            &:hover { background: ${alpha(theme.colors.muted, 0.3)}; }
          `}
        />
      )
    },
  }), [])

  return (
    <TableVirtuoso<T>
      style={{ height: "100%" }}
      data={data}
      fixedHeaderContent={fixedHeaderContent}
      components={tableComponents}
      itemContent={itemContent}
    />
  )
}
