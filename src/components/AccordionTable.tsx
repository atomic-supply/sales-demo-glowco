/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback, useRef, forwardRef, type ReactNode } from "react"
import { TableVirtuoso, type Components } from "react-virtuoso"
import { tableStyles } from "../styles/mixins/table"
import { theme, alpha } from "../styles/theme/theme"

// ─── Types ────────────────────────────────────────────────────────────────────

type FlatRow<G, I> =
  | { kind: "group"; group: G; isExpanded: boolean; hasItems: boolean }
  | { kind: "item"; group: G; item: I; itemIndex: number }

export interface AccordionTableProps<G, I> {
  /** Top-level accordion groups */
  groups: G[]
  /** Return a stable unique id for a group */
  getGroupId: (group: G) => string
  /** Return the items shown when a group is expanded */
  getItems: (group: G) => I[]
  /** Render the fixed <thead> row */
  renderHeader: () => ReactNode
  /**
   * Render cells for a group row.
   * `isExpanded` reflects current expansion state.
   * `toggle` flips the expanded state for this group.
   */
  renderGroupCells: (group: G, isExpanded: boolean, toggle: () => void) => ReactNode
  /** Render cells for an expanded item sub-row */
  renderItemCells: (item: I, group: G, itemIndex: number) => ReactNode
  /** Background for group rows (default: gray200 when expanded, transparent otherwise) */
  getGroupRowBg?: (group: G, isExpanded: boolean) => string
  /** Background for item sub-rows (default: transparent) */
  getItemRowBg?: (item: I, group: G) => string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AccordionTable<G, I>({
  groups,
  getGroupId,
  getItems,
  renderHeader,
  renderGroupCells,
  renderItemCells,
  getGroupRowBg,
  getItemRowBg,
}: AccordionTableProps<G, I>) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // Refs so memoized tableComponents always sees latest callbacks/values
  const getGroupRowBgRef = useRef(getGroupRowBg)
  getGroupRowBgRef.current = getGroupRowBg
  const getItemRowBgRef = useRef(getItemRowBg)
  getItemRowBgRef.current = getItemRowBg
  const getGroupIdRef = useRef(getGroupId)
  getGroupIdRef.current = getGroupId
  const toggleGroupRef = useRef(toggleGroup)
  toggleGroupRef.current = toggleGroup

  const flatRows = useMemo<FlatRow<G, I>[]>(() => {
    const rows: FlatRow<G, I>[] = []
    for (const group of groups) {
      const id = getGroupId(group)
      const isExpanded = expandedGroups.has(id)
      const items = getItems(group)
      rows.push({ kind: "group", group, isExpanded, hasItems: items.length > 0 })
      if (isExpanded) {
        items.forEach((item, itemIndex) => {
          rows.push({ kind: "item", group, item, itemIndex })
        })
      }
    }
    return rows
  }, [groups, expandedGroups, getGroupId, getItems])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableComponents = useMemo<Components<FlatRow<G, I>>>(() => ({
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
      const row = item as FlatRow<G, I>

      if (row.kind === "group") {
        const bg =
          getGroupRowBgRef.current?.(row.group, row.isExpanded) ??
          (row.isExpanded ? theme.colors.muted : theme.colors.background)
        return (
          <tr
            {...props}
            css={css`
              border-bottom: 1px solid ${alpha(theme.colors.border, 0.5)};
              background: ${bg};
              transition: background-color 0.1s;
            `}
          />
        )
      }

      const bg = getItemRowBgRef.current?.(row.item, row.group) ?? theme.colors.background
      return (
        <tr
          {...props}
          css={css`
            border-bottom: 1px solid ${alpha(theme.colors.border, 0.25)};
            background: ${bg};
          `}
        />
      )
    },
  }), []) // stable — all callbacks accessed via refs

  return (
    <TableVirtuoso<FlatRow<G, I>>
      style={{ height: "100%" }}
      data={flatRows}
      fixedHeaderContent={renderHeader}
      components={tableComponents}
      itemContent={(_, row) => {
        if (row.kind === "group") {
          const toggle = () => toggleGroupRef.current(getGroupIdRef.current(row.group))
          return renderGroupCells(row.group, row.isExpanded, toggle)
        }
        return renderItemCells(row.item, row.group, row.itemIndex)
      }}
    />
  )
}
