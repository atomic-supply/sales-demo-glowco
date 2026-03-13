/** @jsxImportSource @emotion/react */
import { css, type SerializedStyles } from "@emotion/react"
import type { FC, ReactNode } from "react"
import { theme, alpha } from "../styles/theme/theme"

export interface ContextTableCell {
  value: ReactNode
  css?: SerializedStyles | SerializedStyles[]
  title?: string
}

export interface ContextTableRow {
  label: ReactNode
  labelCss?: SerializedStyles
  cells: ContextTableCell[]
  /** When false the row has no bottom border (default true) */
  borderBottom?: boolean
}

export interface ContextTableProps {
  title: string
  weeks: string[]
  targetWeekIndex: number
  rows: ContextTableRow[]
}

const thBase = css`
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${theme.colors.mutedForeground};
  border-bottom: 1px solid ${theme.colors.border};
  white-space: nowrap;
`

const thLeft = css`
  ${thBase};
  text-align: left;
  position: sticky;
  left: 0;
  background: ${theme.colors.muted};
`

const thWeek = (isTarget: boolean) => css`
  ${thBase};
  text-align: right;
  color: ${isTarget ? theme.colors.blue600 : theme.colors.mutedForeground};
  ${isTarget ? `background: ${theme.colors.blue50};` : ""}
`

const tdLeft = css`
  padding: 0.375rem 0.75rem;
  color: ${theme.colors.mutedForeground};
  position: sticky;
  left: 0;
  background: ${theme.colors.background};
  white-space: nowrap;
`

const tdBase = (isTarget: boolean) => css`
  text-align: right;
  padding: 0.375rem 0.75rem;
  font-variant-numeric: tabular-nums;
  ${isTarget ? `background: ${theme.colors.blue50};` : ""}
`

const trBorder = css`
  border-bottom: 1px solid ${theme.colors.border};
  &:hover { background: ${alpha(theme.colors.muted, 0.3)}; }
`

const trNoBorder = css`
  &:hover { background: ${alpha(theme.colors.muted, 0.3)}; }
`

export const ContextTable: FC<ContextTableProps> = ({
  title,
  weeks,
  targetWeekIndex,
  rows,
}) => (
  <div css={css`margin-top: 1rem; border-top: 1px solid ${theme.colors.border}; padding-top: 0.75rem;`}>
    <p css={css`font-size: 0.875rem; font-weight: 500; margin: 0 0 0.75rem 2rem;`}>
      {title}
    </p>
    <div css={css`overflow-x: auto;`}>
      <table css={css`width: 100%; border-collapse: collapse; font-size: 0.75rem;`}>
        <thead>
          <tr css={css`border-bottom: 1px solid ${theme.colors.border}; background: ${theme.colors.muted};`}>
            <th css={thLeft}>Metric</th>
            {weeks.map((week, idx) => (
              <th key={week} css={thWeek(idx === targetWeekIndex)}>{week}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} css={row.borderBottom === false ? trNoBorder : trBorder}>
              <td css={row.labelCss ? [tdLeft, row.labelCss] : tdLeft}>{row.label}</td>
              {row.cells.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  css={cell.css ? [tdBase(cellIdx === targetWeekIndex), cell.css] : tdBase(cellIdx === targetWeekIndex)}
                  title={cell.title}
                >
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)
