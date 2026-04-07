/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { theme } from "../../styles/theme/theme"
import { CHANNELS } from "../../data/lmnt-master-data"

interface Props {
  displayBy: "week" | "month"
  onDisplayByChange: (v: "week" | "month") => void
  retailerFilter: string
  onRetailerFilterChange: (v: string) => void
  unitOfMeasure: string
  onUnitOfMeasureChange: (v: string) => void
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

export function ConsumptionFilterBar({
  displayBy,
  onDisplayByChange,
  retailerFilter,
  onRetailerFilterChange,
  unitOfMeasure,
  onUnitOfMeasureChange,
}: Props) {
  return (
    <div css={barStyles}>
      <div css={groupStyles}>
        <span css={labelStyles}>Display</span>
        <select css={selectStyles} value={displayBy} onChange={e => onDisplayByChange(e.target.value as "week" | "month")}>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>

      <div css={groupStyles}>
        <span css={labelStyles}>Retailer</span>
        <select css={selectStyles} value={retailerFilter} onChange={e => onRetailerFilterChange(e.target.value)}>
          <option value="">All Retailers</option>
          {CHANNELS.filter(c => c.channelType === "retail").map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <optgroup label="Online">
            {CHANNELS.filter(c => c.channelType === "online").map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div css={groupStyles}>
        <span css={labelStyles}>UOM</span>
        <select css={selectStyles} value={unitOfMeasure} onChange={e => onUnitOfMeasureChange(e.target.value)}>
          <option value="units">Units</option>
          <option value="sticks">Sticks</option>
        </select>
      </div>
    </div>
  )
}
