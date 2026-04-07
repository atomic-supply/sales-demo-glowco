/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useCallback, useMemo, Fragment } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { theme } from "../../styles/theme/theme"
import type { ConsumptionDataSet, ConsumptionSkuData, ConsumptionMeasure } from "../../data/glowco-consumption-data"
import { RETAIL_MEASURES, ONLINE_MEASURES } from "../../data/glowco-consumption-data"

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface Props {
  data: ConsumptionDataSet
}

/* ------------------------------------------------------------------ */
/*  Formatting                                                          */
/* ------------------------------------------------------------------ */

const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
const decFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function fmtValue(value: number | null, measureKey: string): string {
  if (value === null) return ""
  if (measureKey === "seasonality" || measureKey === "baseline_upspw" || measureKey === "offshelf_upspw" ||
      measureKey === "forecasted_upspw" || measureKey === "upspw_orders" || measureKey === "upspw_pos" ||
      measureKey === "retail_wos" || measureKey === "growth_rate") {
    return decFmt.format(value)
  }
  return numFmt.format(value)
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const wrapStyles = css`
  flex: 1;
  overflow: auto;
  min-height: 0;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.white};
  font-family: ${theme.typography.fontFamily};
`

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

/* --- Header styles --- */

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

const thStyles = (type: "actual" | "forecast") => css`
  padding: 6px 10px;
  text-align: right;
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.gray500};
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${type === "actual" ? theme.colors.gray50 : "#F0FDF4"};
  white-space: nowrap;
  min-width: 80px;
`

const thNameStyles = css`
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
  min-width: 260px;
`

const thRowStyles = css`
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
  left: 260px;
  z-index: 3;
  min-width: 120px;
`

/* --- Row styles --- */

const parentRowStyles = (expanded: boolean) => css`
  cursor: pointer;
  &:hover td { background: ${theme.colors.gray50}; }
  ${expanded ? `td { background: ${theme.colors.blue50}; }` : ""}
`

const parentNameCell = css`
  padding: 8px 12px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  position: sticky;
  left: 0;
  z-index: 2;
  background: inherit;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid ${theme.colors.gray100};
`

const parentRowCell = css`
  padding: 8px 10px;
  color: ${theme.colors.gray500};
  font-size: 12px;
  position: sticky;
  left: 260px;
  z-index: 2;
  background: inherit;
  border-bottom: 1px solid ${theme.colors.gray100};
`

const parentValueCell = (type: "actual" | "forecast") => css`
  padding: 8px 10px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: ${theme.colors.gray900};
  border-bottom: 1px solid ${theme.colors.gray100};
  background: ${type === "actual" ? "transparent" : "#FAFFF8"};
`

/* --- Measure row styles --- */

const measureLabelCell = (bg: string, color: string, bold?: boolean) => css`
  padding: 4px 12px 4px 40px;
  text-align: left;
  white-space: nowrap;
  position: sticky;
  left: 0;
  z-index: 2;
  background: ${bg === "transparent" ? theme.colors.white : bg};
  color: ${color};
  font-weight: ${bold ? 600 : 400};
  font-size: 12px;
  border-bottom: 1px solid ${theme.colors.gray50};
  min-width: 260px;
`

const measureRowCell = css`
  padding: 4px 10px;
  position: sticky;
  left: 260px;
  z-index: 2;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray50};
`

const measureValueCell = (bg: string, type: "actual" | "forecast", editable?: boolean) => css`
  padding: 4px 10px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  border-bottom: 1px solid ${theme.colors.gray50};
  background: ${bg === "transparent"
    ? (type === "forecast" ? "#FAFFF8" : "transparent")
    : bg};
  ${editable && type === "forecast" ? `
    border: 1px dashed #86EFAC;
    cursor: text;
  ` : ""}
`

const valueText = (color: string, bold?: boolean) => css`
  color: ${color};
  font-weight: ${bold ? 600 : 400};
`

const chevronWrap = css`
  display: inline-flex;
  color: ${theme.colors.gray400};
`

const footerStyles = css`
  padding: 8px 12px;
  font-size: 12px;
  color: ${theme.colors.gray500};
  border-top: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
`

const legendStyles = css`
  display: flex;
  gap: 16px;
  padding: 8px 12px;
  font-size: 11px;
  color: ${theme.colors.gray500};
  border-top: 1px solid ${theme.colors.gray100};
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

export function ConsumptionTable({ data }: Props) {
  const { periods, skus, measures } = data
  const [expandedSkus, setExpandedSkus] = useState<Set<string>>(new Set())

  const toggleExpand = useCallback((skuId: string) => {
    setExpandedSkus(prev => {
      const next = new Set(prev)
      if (next.has(skuId)) next.delete(skuId)
      else next.add(skuId)
      return next
    })
  }, [])

  // Group actual/forecast periods for the two-tier header
  const actualPeriods = useMemo(() => periods.filter(p => p.type === "actual"), [periods])
  const forecastPeriods = useMemo(() => periods.filter(p => p.type === "forecast"), [periods])

  const renderMeasureRows = useCallback((sku: ConsumptionSkuData, measureList: ConsumptionMeasure[]) => {
    return measureList.map(measure => {
      const values = sku.measures[measure.key]
      if (!values) return null

      return (
        <tr key={`${sku.id}-${measure.key}`}>
          <td css={measureLabelCell(measure.bg, measure.color, measure.bold)}>
            {measure.label}
          </td>
          <td css={measureRowCell} />
          {periods.map((p, pi) => {
            const val = values[pi]
            // Hide actuals-only measures in forecast periods
            if (measure.actualsOnly && p.type === "forecast") {
              return <td key={pi} css={measureValueCell("transparent", p.type)} />
            }
            return (
              <td key={pi} css={measureValueCell(measure.bg, p.type, measure.editable)}>
                <span css={valueText(measure.color, measure.bold)}>
                  {fmtValue(val, measure.key)}
                </span>
              </td>
            )
          })}
        </tr>
      )
    })
  }, [periods])

  return (
    <div css={wrapStyles}>
      <table css={tableStyles}>
        <thead>
          {/* Tier 1: ACTUAL / FORECAST group headers */}
          <tr>
            <th css={thNameStyles} rowSpan={2}>Name</th>
            <th css={thRowStyles} rowSpan={2}>Row</th>
            {actualPeriods.length > 0 && (
              <th css={thGroupStyles("actual")} colSpan={actualPeriods.length}>Actual</th>
            )}
            {forecastPeriods.length > 0 && (
              <th css={thGroupStyles("forecast")} colSpan={forecastPeriods.length}>Forecast</th>
            )}
          </tr>
          {/* Tier 2: individual period labels */}
          <tr>
            {periods.map((p, i) => (
              <th key={i} css={thStyles(p.type)}>{p.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {skus.map(sku => {
            const isExpanded = expandedSkus.has(sku.id)
            const projectedPOS = sku.measures.projected_pos
            return (
              <Fragment key={sku.id}>
                {/* Parent SKU row */}
                <tr css={parentRowStyles(isExpanded)} onClick={() => toggleExpand(sku.id)}>
                  <td css={parentNameCell}>
                    <span css={chevronWrap}>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                    {sku.skuName}
                  </td>
                  <td css={parentRowCell}>Projected POS</td>
                  {periods.map((p, pi) => (
                    <td key={pi} css={parentValueCell(p.type)}>
                      {projectedPOS?.[pi] != null ? numFmt.format(projectedPOS[pi] as number) : ""}
                    </td>
                  ))}
                </tr>
                {/* Expanded measure rows */}
                {isExpanded && renderMeasureRows(sku, sku.channelType === "retail" ? RETAIL_MEASURES : ONLINE_MEASURES)}
              </Fragment>
            )
          })}
        </tbody>
      </table>

      {/* Footer */}
      <div css={footerStyles}>
        Showing {skus.length} SKUs across {periods.length} periods
      </div>

      {/* Legend */}
      <div css={legendStyles}>
        <span><span css={legendDot(theme.colors.gray300)} />Actual</span>
        <span><span css={legendDot("#86EFAC")} />Forecast</span>
        <span><span css={legendDot("#FCD34D")} />Actuals Data</span>
        <span><span css={legendDot("#FCA5A5")} />Editable Input</span>
      </div>
    </div>
  )
}
