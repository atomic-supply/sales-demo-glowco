/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMemo } from "react"
import { theme } from "../styles/theme/theme"
import { getConsumptionPivotData } from "../data/lmnt-consumption-data"

const pageStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${theme.typography.fontFamily};
`

const titleStyles = css`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray900};
  margin: 0 0 2px;
`

const descStyles = css`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray500};
  margin: 0 0 12px;
`

const wrapStyles = css`
  flex: 1;
  overflow: auto;
  min-height: 0;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.white};
`

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

const thStyles = css`
  padding: 8px 10px;
  text-align: right;
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.gray500};
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
  white-space: nowrap;
  min-width: 90px;
`

const thLabelStyles = css`
  padding: 8px 12px;
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
  min-width: 160px;
`

const thSubLabelStyles = css`
  ${thLabelStyles};
  left: 160px;
  min-width: 160px;
`

const tdLabel = css`
  padding: 8px 12px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  position: sticky;
  left: 0;
  z-index: 2;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray100};
  white-space: nowrap;
`

const tdSubLabel = css`
  padding: 8px 12px;
  color: ${theme.colors.gray600};
  font-size: 12px;
  position: sticky;
  left: 160px;
  z-index: 2;
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray100};
  white-space: nowrap;
`

const tdValue = (type: "actual" | "forecast") => css`
  padding: 8px 10px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: ${theme.colors.gray900};
  border-bottom: 1px solid ${theme.colors.gray100};
  background: ${type === "forecast" ? "#FAFFF8" : "transparent"};
`

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

const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

const footerStyles = css`
  padding: 8px 12px;
  font-size: 12px;
  color: ${theme.colors.gray500};
  border-top: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
`

export function ConsumptionPivotPage() {
  const { periods, rows } = useMemo(() => getConsumptionPivotData(), [])

  const actualPeriods = periods.filter(p => p.type === "actual")
  const forecastPeriods = periods.filter(p => p.type === "forecast")

  return (
    <div css={pageStyles}>
      <h2 css={titleStyles}>Consumption Pivot</h2>
      <p css={descStyles}>Aggregated demand view across channels and time periods</p>

      <div css={wrapStyles}>
        <table css={tableStyles}>
          <thead>
            <tr>
              <th css={thLabelStyles} rowSpan={2}>Channel</th>
              <th css={thSubLabelStyles} rowSpan={2}>Sub-Channel</th>
              {actualPeriods.length > 0 && (
                <th css={thGroupStyles("actual")} colSpan={actualPeriods.length}>Actual</th>
              )}
              {forecastPeriods.length > 0 && (
                <th css={thGroupStyles("forecast")} colSpan={forecastPeriods.length}>Forecast</th>
              )}
            </tr>
            <tr>
              {periods.map((p, i) => (
                <th key={i} css={thStyles}>{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td css={tdLabel}>{row.channel}</td>
                <td css={tdSubLabel}>{row.subChannel}</td>
                {row.values.map((v, vi) => (
                  <td key={vi} css={tdValue(periods[vi].type)}>
                    {numFmt.format(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div css={footerStyles}>
          Showing {rows.length} channels across {periods.length} periods
        </div>
      </div>
    </div>
  )
}
