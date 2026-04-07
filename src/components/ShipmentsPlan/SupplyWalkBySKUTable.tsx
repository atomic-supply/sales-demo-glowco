/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useCallback, useMemo, Fragment } from "react"
import { ChevronDown, ChevronRight, X, Save } from "lucide-react"
import { theme } from "../../styles/theme/theme"
import type { ShipmentsPeriod, SkuSupplyWalkRow } from "../../data/lmnt-shipments-data"
import { SUPPLY_WALK_MEASURES } from "../../data/lmnt-shipments-data"

interface Props {
  periods: ShipmentsPeriod[]
  rows: SkuSupplyWalkRow[]
  selectedChannelId: string | null
  onClearChannelFilter: () => void
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                          */
/* ------------------------------------------------------------------ */

const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
const decFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function fmtValue(val: number | null, key: string): string {
  if (val === null || val === undefined) return ""
  if (val === 0 && !key.includes("wos") && !key.includes("inventory")) return "\u2014"
  if (key === "starting_wos" || key === "ending_wos") return decFmt.format(val)
  return numFmt.format(val)
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const wrapStyles = css`
  overflow: hidden;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.white};
  font-family: ${theme.typography.fontFamily};
  display: flex;
  flex-direction: column;
`

const headerBar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  border-bottom: 1px solid ${theme.colors.gray100};
  flex-shrink: 0;
`

const titleStyles = css`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin: 0 0 2px;
`

const subtitleStyles = css`
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin: 0;
`

const headerRight = css`
  display: flex;
  align-items: center;
  gap: 8px;
`

const chipStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  color: ${theme.colors.blue700};
  background: ${theme.colors.blue50};
  border: 1px solid ${theme.colors.blue200};
  border-radius: 4px;
  font-family: ${theme.typography.fontFamily};
`

const chipClose = css`
  cursor: pointer;
  color: ${theme.colors.blue500};
  &:hover { color: ${theme.colors.blue700}; }
`

const saveBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  font-family: ${theme.typography.fontFamily};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.gray400};
  cursor: default;
`

const tableScrollWrap = css`
  overflow: auto;
  max-height: 500px;
`

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

/* --- Header --- */

const thGroupStyles = (type: "actual" | "forecast") => css`
  padding: 6px 10px;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${type === "actual" ? theme.colors.gray100 : "#ECFDF5"};
  color: ${type === "actual" ? theme.colors.gray500 : "#059669"};
`

const thPeriod = (type: "actual" | "forecast") => css`
  padding: 6px 8px;
  text-align: right;
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.gray500};
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${type === "actual" ? theme.colors.gray50 : "#F0FDF4"};
  white-space: nowrap;
  min-width: 64px;
`

const thChannel = css`
  padding: 6px 12px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${theme.colors.gray500};
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.white};
  position: sticky;
  left: 0;
  z-index: 3;
  min-width: 140px;
`

const thSku = css`
  padding: 6px 10px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${theme.colors.gray500};
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.white};
  position: sticky;
  left: 140px;
  z-index: 3;
  min-width: 220px;
`

/* --- Parent row --- */

const parentRow = (expanded: boolean) => css`
  cursor: pointer;
  &:hover td { background: ${theme.colors.gray50}; }
  ${expanded ? `td { background: ${theme.colors.blue50}; }` : ""}
`

const parentChannelCell = css`
  padding: 8px 12px;
  font-weight: 500;
  color: ${theme.colors.gray600};
  font-size: 12px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: inherit;
  border-bottom: 1px solid ${theme.colors.gray100};
  white-space: nowrap;
`

const parentSkuCell = css`
  padding: 8px 10px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  position: sticky;
  left: 140px;
  z-index: 2;
  background: inherit;
  border-bottom: 1px solid ${theme.colors.gray100};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
`

const parentValueCell = (type: "actual" | "forecast") => css`
  padding: 8px 8px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  color: ${theme.colors.gray700};
  border-bottom: 1px solid ${theme.colors.gray100};
  background: ${type === "actual" ? "transparent" : "#FAFFF8"};
`

const chevronWrap = css`
  display: inline-flex;
  color: ${theme.colors.gray400};
`

/* --- Measure row --- */

const measureLabelCell = (color: string, bold?: boolean) => css`
  padding: 4px 12px 4px 28px;
  text-align: left;
  white-space: nowrap;
  position: sticky;
  left: 0;
  z-index: 2;
  background: ${theme.colors.white};
  color: ${color};
  font-weight: ${bold ? 600 : 400};
  font-size: 12px;
  border-bottom: 1px solid ${theme.colors.gray50};
  min-width: 140px;
`

const measureRowCell = css`
  padding: 4px 10px;
  position: sticky;
  left: 140px;
  z-index: 2;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray50};
`

const measureValueCell = (type: "actual" | "forecast", editable?: boolean, isRed?: boolean) => css`
  padding: 4px 8px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  border-bottom: 1px solid ${theme.colors.gray50};
  background: ${type === "forecast" ? "#FAFFF8" : "transparent"};
  ${editable && type === "forecast" ? `
    border: 1px dashed #86EFAC;
    cursor: text;
  ` : ""}
`

const measureValText = (color: string, bold?: boolean) => css`
  color: ${color};
  font-weight: ${bold ? 600 : 400};
`

const prefixSpan = css`
  display: inline-block;
  width: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 500;
`

/* --- Footer --- */

const footerStyles = css`
  padding: 8px 12px;
  font-size: 12px;
  color: ${theme.colors.gray500};
  border-top: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
  flex-shrink: 0;
`

const legendStyles = css`
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  font-size: 11px;
  color: ${theme.colors.gray500};
  border-top: 1px solid ${theme.colors.gray100};
  flex-shrink: 0;
`

const legendDot = (color: string) => css`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${color};
  margin-right: 4px;
`

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function SupplyWalkBySKUTable({ periods, rows, selectedChannelId, onClearChannelFilter }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleExpand = useCallback((rowId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(rowId)) next.delete(rowId)
      else next.add(rowId)
      return next
    })
  }, [])

  const filteredRows = useMemo(() => {
    if (!selectedChannelId) return rows
    return rows.filter(r => r.channelId === selectedChannelId)
  }, [rows, selectedChannelId])

  const actualPeriods = useMemo(() => periods.filter(p => p.type === "actual"), [periods])
  const forecastPeriods = useMemo(() => periods.filter(p => p.type === "forecast"), [periods])

  const selectedChannelName = selectedChannelId
    ? rows.find(r => r.channelId === selectedChannelId)?.channelName
    : null

  return (
    <div css={wrapStyles}>
      <div css={headerBar}>
        <div>
          <h3 css={titleStyles}>Supply Walk by SKU</h3>
          <p css={subtitleStyles}>Expand a row to see the full supply walk breakdown</p>
        </div>
        <div css={headerRight}>
          {selectedChannelName && (
            <span css={chipStyles}>
              {selectedChannelName}
              <X size={12} css={chipClose} onClick={onClearChannelFilter} />
            </span>
          )}
          <button css={saveBtn}>
            <Save size={12} />
            Save
          </button>
        </div>
      </div>

      <div css={tableScrollWrap}>
        <table css={tableStyles}>
          <thead>
            {/* Tier 1 */}
            <tr>
              <th css={thChannel} rowSpan={2}>Channel</th>
              <th css={thSku} rowSpan={2}>SKU</th>
              {actualPeriods.length > 0 && (
                <th css={thGroupStyles("actual")} colSpan={actualPeriods.length}>Actual</th>
              )}
              {forecastPeriods.length > 0 && (
                <th css={thGroupStyles("forecast")} colSpan={forecastPeriods.length}>Forecast</th>
              )}
            </tr>
            {/* Tier 2 */}
            <tr>
              {periods.map((p, i) => (
                <th key={i} css={thPeriod(p.type)}>{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => {
              const isExpanded = expandedRows.has(row.id)
              return (
                <Fragment key={row.id}>
                  {/* Parent SKU row */}
                  <tr css={parentRow(isExpanded)} onClick={() => toggleExpand(row.id)}>
                    <td css={parentChannelCell}>{row.channelName}</td>
                    <td css={parentSkuCell}>
                      <span css={chevronWrap}>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                      {row.skuName}
                    </td>
                    {row.shipmentValues.map((val, pi) => (
                      <td key={pi} css={parentValueCell(periods[pi].type)}>
                        {val > 0 ? numFmt.format(val) : "\u2014"}
                      </td>
                    ))}
                  </tr>

                  {/* Expanded measure rows */}
                  {isExpanded && SUPPLY_WALK_MEASURES.map(measure => {
                    const values = row.measures[measure.key]
                    if (!values) return null
                    return (
                      <tr key={`${row.id}-${measure.key}`}>
                        <td css={measureLabelCell(measure.color, measure.bold)}>
                          <span css={prefixSpan}>{measure.prefix}</span>
                          {measure.label}
                        </td>
                        <td css={measureRowCell} />
                        {periods.map((p, pi) => (
                          <td key={pi} css={measureValueCell(p.type, measure.editable, measure.isRed)}>
                            <span css={measureValText(measure.isRed ? "#DC2626" : measure.color, measure.bold)}>
                              {fmtValue(values[pi], measure.key)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div css={footerStyles}>
        Showing {filteredRows.length} SKUs across {periods.length} periods
      </div>

      {/* Legend */}
      <div css={legendStyles}>
        <span><span css={legendDot(theme.colors.gray300)} />Actual</span>
        <span><span css={legendDot("#86EFAC")} />Forecast</span>
        <span><span css={legendDot("#059669")} />Editable Input</span>
      </div>
    </div>
  )
}
