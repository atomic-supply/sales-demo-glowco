/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMemo } from "react"
import { Eye } from "lucide-react"
import { theme } from "../../styles/theme/theme"
import type { ShipmentsPeriod, ChannelWOSRow, ChannelStatus } from "../../data/glowco-shipments-data"

interface Props {
  periods: ShipmentsPeriod[]
  rows: ChannelWOSRow[]
  selectedChannelId: string | null
  onChannelSelect: (channelId: string | null) => void
}

/* ------------------------------------------------------------------ */
/*  WOS color helpers                                                   */
/* ------------------------------------------------------------------ */

function wosColor(val: number): string {
  if (val < 3) return "#DC2626"
  if (val < 5) return "#D97706"
  return "#1E293B"
}

function wosBg(val: number): string {
  if (val < 3) return "#FEF2F2"
  if (val < 5) return "#FFFBEB"
  return "transparent"
}

/* ------------------------------------------------------------------ */
/*  Status dot                                                          */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<ChannelStatus, string> = {
  "needs-review": "#F59E0B",
  "in-progress": "#3B82F6",
  ready: "#22C55E",
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const wrapStyles = css`
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.white};
  overflow: hidden;
  flex-shrink: 0;
`

const headerBar = css`
  padding: 12px 16px 8px;
  border-bottom: 1px solid ${theme.colors.gray100};
`

const titleStyles = css`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.gray900};
  margin: 0 0 2px;
  font-family: ${theme.typography.fontFamily};
`

const subtitleStyles = css`
  font-size: 12px;
  color: ${theme.colors.gray500};
  margin: 0;
  font-family: ${theme.typography.fontFamily};
`

const tableWrap = css`
  overflow-x: auto;
`

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.typography.fontFamily};
  font-size: 13px;
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
  min-width: 56px;
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
  min-width: 200px;
`

const rowStyles = (selected: boolean) => css`
  cursor: pointer;
  transition: background 0.1s;
  background: ${selected ? theme.colors.blue50 : theme.colors.white};
  &:hover {
    background: ${selected ? theme.colors.blue50 : theme.colors.gray50};
  }
`

const channelCell = css`
  padding: 8px 12px;
  position: sticky;
  left: 0;
  z-index: 2;
  background: inherit;
  border-bottom: 1px solid ${theme.colors.gray100};
  white-space: nowrap;
`

const channelInner = css`
  display: flex;
  align-items: center;
  gap: 8px;
`

const dotStyles = (status: ChannelStatus) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${STATUS_COLORS[status]};
  flex-shrink: 0;
`

const channelName = css`
  font-weight: 600;
  color: ${theme.colors.gray900};
  font-size: 13px;
`

const skuCount = css`
  font-size: 11px;
  color: ${theme.colors.gray400};
  margin-left: 4px;
`

const eyeIcon = css`
  color: ${theme.colors.gray300};
  margin-left: auto;
  flex-shrink: 0;
`

const wosCell = (val: number, type: "actual" | "forecast") => css`
  padding: 8px 8px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 600;
  color: ${wosColor(val)};
  background: ${wosBg(val) === "transparent"
    ? (type === "forecast" ? "#FAFFF8" : "transparent")
    : wosBg(val)};
  border-bottom: 1px solid ${theme.colors.gray100};
`

const footerStyles = css`
  padding: 6px 12px;
  font-size: 11px;
  color: ${theme.colors.gray500};
  border-top: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
  font-family: ${theme.typography.fontFamily};
`

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function WOSByChannelTable({ periods, rows, selectedChannelId, onChannelSelect }: Props) {
  const actualPeriods = useMemo(() => periods.filter(p => p.type === "actual"), [periods])
  const forecastPeriods = useMemo(() => periods.filter(p => p.type === "forecast"), [periods])

  return (
    <div css={wrapStyles}>
      <div css={headerBar}>
        <h3 css={titleStyles}>Weeks of Supply by Channel</h3>
        <p css={subtitleStyles}>Click a channel to filter the supply walk below</p>
      </div>

      <div css={tableWrap}>
        <table css={tableStyles}>
          <thead>
            {/* Tier 1: ACTUAL / FORECAST */}
            <tr>
              <th css={thChannel} rowSpan={2}>Channel</th>
              {actualPeriods.length > 0 && (
                <th css={thGroupStyles("actual")} colSpan={actualPeriods.length}>Actual</th>
              )}
              {forecastPeriods.length > 0 && (
                <th css={thGroupStyles("forecast")} colSpan={forecastPeriods.length}>Forecast</th>
              )}
            </tr>
            {/* Tier 2: period labels */}
            <tr>
              {periods.map((p, i) => (
                <th key={i} css={thPeriod(p.type)}>{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isSelected = row.channelId === selectedChannelId
              return (
                <tr
                  key={row.channelId}
                  css={rowStyles(isSelected)}
                  onClick={() => onChannelSelect(isSelected ? null : row.channelId)}
                >
                  <td css={channelCell}>
                    <div css={channelInner}>
                      <span css={dotStyles(row.status)} />
                      <span css={channelName}>{row.channelName}</span>
                      <span css={skuCount}>{row.skuCount} SKUs</span>
                      <Eye size={14} css={eyeIcon} />
                    </div>
                  </td>
                  {row.wosValues.map((val, pi) => (
                    <td key={pi} css={wosCell(val, periods[pi].type)}>
                      {val.toFixed(1)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div css={footerStyles}>
        {rows.length} channels{selectedChannelId ? " \u2022 Click again to clear filter" : ""}
      </div>
    </div>
  )
}
