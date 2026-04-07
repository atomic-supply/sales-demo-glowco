/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { theme } from "../../styles/theme/theme"
import { CHANNELS, WAREHOUSES } from "../../data/glowco-master-data"
import { PLANNERS } from "../../data/glowco-shipments-data"
import type { ChannelStatus } from "../../data/glowco-shipments-data"
import { Download } from "lucide-react"

interface Props {
  warehouseFilter: string
  onWarehouseChange: (v: string) => void
  channelFilter: string
  onChannelChange: (v: string) => void
  plannerFilter: string
  onPlannerChange: (v: string) => void
  onClearAll: () => void
  hasFilters: boolean
}

const barStyles = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0 12px;
  flex-shrink: 0;
  font-family: ${theme.typography.fontFamily};
`

const groupStyles = css`
  display: flex;
  align-items: center;
  gap: 6px;
`

const labelStyles = css`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const selectStyles = css`
  font-size: ${theme.typography.fontSize.sm};
  font-family: ${theme.typography.fontFamily};
  padding: 4px 8px;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${theme.colors.blue500};
  }
`

const clearLink = css`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.blue600};
  cursor: pointer;
  background: none;
  border: none;
  font-family: ${theme.typography.fontFamily};
  &:hover { text-decoration: underline; }
`

const spacer = css`
  flex: 1;
`

const legendStyles = css`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: ${theme.colors.gray500};
`

const statusDot = (status: ChannelStatus) => {
  const colors: Record<ChannelStatus, string> = {
    "needs-review": "#F59E0B",
    "in-progress": "#3B82F6",
    ready: "#22C55E",
  }
  return css`
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors[status]};
    margin-right: 4px;
  `
}

const exportBtn = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-family: ${theme.typography.fontFamily};
  font-weight: 500;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.gray600};
  cursor: pointer;
  &:hover {
    border-color: ${theme.colors.gray400};
    color: ${theme.colors.gray800};
  }
`

export function ShipmentsFilterBar({
  warehouseFilter,
  onWarehouseChange,
  channelFilter,
  onChannelChange,
  plannerFilter,
  onPlannerChange,
  onClearAll,
  hasFilters,
}: Props) {
  return (
    <div css={barStyles}>
      <div css={groupStyles}>
        <span css={labelStyles}>Warehouse</span>
        <select css={selectStyles} value={warehouseFilter} onChange={e => onWarehouseChange(e.target.value)}>
          <option value="">All Warehouses</option>
          {WAREHOUSES.map(w => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      <div css={groupStyles}>
        <span css={labelStyles}>Channel</span>
        <select css={selectStyles} value={channelFilter} onChange={e => onChannelChange(e.target.value)}>
          <option value="">All Channels</option>
          {CHANNELS.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div css={groupStyles}>
        <span css={labelStyles}>Planner</span>
        <select css={selectStyles} value={plannerFilter} onChange={e => onPlannerChange(e.target.value)}>
          <option value="">All Planners</option>
          {PLANNERS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button css={clearLink} onClick={onClearAll}>Clear all</button>
      )}

      <div css={spacer} />

      <div css={legendStyles}>
        <span><span css={statusDot("needs-review")} />Needs Review</span>
        <span><span css={statusDot("in-progress")} />In Progress</span>
        <span><span css={statusDot("ready")} />Ready</span>
      </div>

      <button css={exportBtn}>
        <Download size={12} />
        Export
      </button>
    </div>
  )
}
