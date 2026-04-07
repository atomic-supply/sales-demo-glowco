/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo } from "react"
import { theme } from "../styles/theme/theme"
import { ConsumptionTable } from "../components/ConsumptionPlan/ConsumptionTable"
import { ConsumptionFilterBar } from "../components/ConsumptionPlan/ConsumptionFilterBar"
import { getConsumptionPlanData } from "../data/lmnt-consumption-data"

const pageStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${theme.typography.fontFamily};
`

const headerStyles = css`
  flex-shrink: 0;
`

const titleRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  margin: 0;
`

const editBtnStyles = css`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: ${theme.typography.fontFamily};
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  cursor: pointer;
  &:hover {
    border-color: ${theme.colors.blue500};
    color: ${theme.colors.blue600};
  }
`

export function ConsumptionPlanPage() {
  const [displayBy, setDisplayBy] = useState<"week" | "month">("month")
  const [retailerFilter, setRetailerFilter] = useState("")
  const [unitOfMeasure, setUnitOfMeasure] = useState("units")

  const data = useMemo(
    () => getConsumptionPlanData(displayBy, retailerFilter || undefined),
    [displayBy, retailerFilter],
  )

  return (
    <div css={pageStyles}>
      <div css={headerStyles}>
        <div css={titleRow}>
          <div>
            <h2 css={titleStyles}>Consumption Plan</h2>
            <p css={descStyles}>UPSPW-based demand forecast by SKU and retailer</p>
          </div>
          <button css={editBtnStyles}>Edit Inputs</button>
        </div>

        <ConsumptionFilterBar
          displayBy={displayBy}
          onDisplayByChange={setDisplayBy}
          retailerFilter={retailerFilter}
          onRetailerFilterChange={setRetailerFilter}
          unitOfMeasure={unitOfMeasure}
          onUnitOfMeasureChange={setUnitOfMeasure}
        />
      </div>

      <ConsumptionTable data={data} />
    </div>
  )
}
