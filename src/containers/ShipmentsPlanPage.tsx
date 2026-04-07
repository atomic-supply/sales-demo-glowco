/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo } from "react"
import { theme } from "../styles/theme/theme"
import { ShipmentsFilterBar } from "../components/ShipmentsPlan/ShipmentsFilterBar"
import { WOSByChannelTable } from "../components/ShipmentsPlan/WOSByChannelTable"
import { SupplyWalkBySKUTable } from "../components/ShipmentsPlan/SupplyWalkBySKUTable"
import { getShipmentsPlanData } from "../data/glowco-shipments-data"

const pageStyles = css`
  display: flex;
  flex-direction: column;
  font-family: ${theme.typography.fontFamily};
  gap: ${theme.spacing.md};
  padding: 0 0 ${theme.spacing.lg};
`

const headerStyles = css`
  flex-shrink: 0;
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

export function ShipmentsPlanPage() {
  const [warehouseFilter, setWarehouseFilter] = useState("")
  const [channelFilter, setChannelFilter] = useState("")
  const [plannerFilter, setPlannerFilter] = useState("")
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)

  const hasFilters = warehouseFilter !== "" || channelFilter !== "" || plannerFilter !== ""

  const data = useMemo(
    () => getShipmentsPlanData(
      warehouseFilter || undefined,
      channelFilter || undefined,
      plannerFilter || undefined,
    ),
    [warehouseFilter, channelFilter, plannerFilter],
  )

  const clearAllFilters = () => {
    setWarehouseFilter("")
    setChannelFilter("")
    setPlannerFilter("")
    setSelectedChannelId(null)
  }

  return (
    <div css={pageStyles}>
      <div css={headerStyles}>
        <h2 css={titleStyles}>Shipments</h2>
        <p css={descStyles}>Customer shipment forecast and weekly supply health by channel</p>

        <ShipmentsFilterBar
          warehouseFilter={warehouseFilter}
          onWarehouseChange={setWarehouseFilter}
          channelFilter={channelFilter}
          onChannelChange={setChannelFilter}
          plannerFilter={plannerFilter}
          onPlannerChange={setPlannerFilter}
          onClearAll={clearAllFilters}
          hasFilters={hasFilters}
        />
      </div>

      <WOSByChannelTable
        periods={data.periods}
        rows={data.channelWOS}
        selectedChannelId={selectedChannelId}
        onChannelSelect={setSelectedChannelId}
      />

      <SupplyWalkBySKUTable
        periods={data.periods}
        rows={data.skuWalk}
        selectedChannelId={selectedChannelId}
        onClearChannelFilter={() => setSelectedChannelId(null)}
      />
    </div>
  )
}
