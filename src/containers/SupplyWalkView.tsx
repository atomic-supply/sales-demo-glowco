/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback, type FC } from "react"
import { theme, alpha } from "../styles/theme/theme"
import { tableStyles } from "../styles"
import { ChevronDown, ChevronRight, Download } from "lucide-react"
import { useRunData } from "../contexts/RunsContext"
import { shipToLocations, skus, allocationPlanData } from "../data/runs/unified-data"
import { Button } from "../components/ui/button"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { ViewControls } from "../components/ViewControls"
import { TableHead, TableCell } from "../components/ui/table"
import { formatNumber, formatRate, formatWOS } from "../utils/format"
import { seededRand } from "../utils/random"
import { DC_NAMES, CUSTOMER_NAMES, DEFAULT_FROM_DATE, DEFAULT_TO_DATE, PROTEIN_TYPES, SIZE_TYPES } from "../data/supply-walk-data"
import { AccordionTable } from "../components/AccordionTable"

// =============================================================================
// Types
// =============================================================================

interface MeasureDef {
  key: string
  label: string
  indent: number
  isBold?: boolean
  isEditable?: boolean
  isReadOnly?: boolean
  isWOS?: boolean
  isRate?: boolean
  isNegative?: boolean
  isParent?: boolean
}

interface GroupData {
  groupKey: string
  label: string
  measures: Record<string, number[]>
  wosTarget: number
}

// =============================================================================
// Constants
// =============================================================================

const shipmentMeasures: MeasureDef[] = [
  { key: "startingInventory", label: "starting inventory on hand", indent: 0 },
  { key: "forecastedSales", label: "forecasted sales", indent: 0, isNegative: true },
  { key: "shipmentArrivals", label: "shipment arrivals", indent: 0, isParent: true },
  { key: "openShipments", label: "open", indent: 1, isReadOnly: true },
  { key: "simulated", label: "simulated", indent: 1, isEditable: true },
  { key: "endingInventory", label: "ending inventory on hand", indent: 0 },
  { key: "unfulfilled", label: "unfulfilled demand", indent: 0 },
  { key: "shipmentToPlace", label: "shipment order to place", indent: 0, isBold: true },
  { key: "targetWOS", label: "target weeks of supply", indent: 0 },
  { key: "startingWOS", label: "starting weeks of supply", indent: 0, isWOS: true },
  { key: "endingWOS", label: "ending weeks of supply", indent: 0, isWOS: true },
  { key: "inStockRate", label: "in stock rate", indent: 0, isRate: true },
]

const segmentOptions = [
  { value: "First Receiver", label: "First Receiver" },
  { value: "DC Name", label: "DC Name" },
  { value: "Customer Name", label: "Customer Name" },
  { value: "SKU", label: "SKU" },
  { value: "Protein", label: "Protein" },
  { value: "Size", label: "Size" },
]

const aggregateOptions = [
  { value: "Shipment Order to Place", label: "Shipment Order to Place" },
  { value: "Starting Inventory", label: "Starting Inventory" },
  { value: "Forecasted Sales", label: "Forecasted Sales" },
  { value: "Shipment Arrivals", label: "Shipment Arrivals" },
  { value: "Ending Inventory", label: "Ending Inventory" },
  { value: "Ending WOS", label: "Ending WOS" },
]

const displayByOptions = [
  { value: "Week", label: "Week" },
  { value: "Month", label: "Month" },
]

// =============================================================================
// Helpers
// =============================================================================

const parseDate = (dateStr: string): Date => {
  const [month, day, year] = dateStr.split("/").map(Number)
  return new Date(year < 100 ? 2000 + year : year, month - 1, day)
}

const formatDateColumn = (date: Date, format: string): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  if (format === "Month") {
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
  }
  return `${month}/${day}`
}

function generateDateColumns(from: string, to: string, granularity: string): string[] {
  const startDate = parseDate(from)
  const endDate = parseDate(to)
  const columns: string[] = []
  const current = new Date(startDate)
  while (current <= endDate) {
    columns.push(formatDateColumn(current, granularity))
    if (granularity === "Week") current.setDate(current.getDate() + 7)
    else if (granularity === "Month") current.setMonth(current.getMonth() + 1)
    else current.setDate(current.getDate() + 1)
    if (columns.length > 60) break
  }
  return columns
}

function getWOSColor(value: number, target: number): string {
  if (target <= 0) return ""
  const ratio = value / target
  if (ratio >= 1) return alpha(theme.colors.status.success, 0.15)
  if (ratio >= 0.5) return alpha(theme.colors.status.warning, 0.15)
  return alpha(theme.colors.status.error, 0.15)
}

function aggregateKeyForOption(option: string): string {
  switch (option) {
    case "Shipment Order to Place": return "shipmentToPlace"
    case "Starting Inventory": return "startingInventory"
    case "Forecasted Sales": return "forecastedSales"
    case "Shipment Arrivals": return "shipmentArrivals"
    case "Ending Inventory": return "endingInventory"
    case "Ending WOS": return "endingWOS"
    default: return "shipmentToPlace"
  }
}

// =============================================================================
// Styles
// =============================================================================

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: ${theme.colors.background};
  `,
}

// =============================================================================
// Main Component
// =============================================================================

export const SupplyWalkView: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const runData = useRunData()
  // allocationPlanData is available from unified-data (static)

  const [segments, setSegments] = useState<string[]>(["First Receiver"])
  const [aggregateBy, setAggregateBy] = useState("Shipment Order to Place")
  const [displayBy, setDisplayBy] = useState("Week")
  const [fromDate, setFromDate] = useState(DEFAULT_FROM_DATE)
  const [toDate, setToDate] = useState(DEFAULT_TO_DATE)
  const [editingMode] = useState(false)
  const [shipmentOverrides, setShipmentOverrides] = useState<Record<string, number>>({})

  const dateColumns = useMemo(() => generateDateColumns(fromDate, toDate, displayBy), [fromDate, toDate, displayBy])
  const numCols = dateColumns.length

  const getSegmentValues = useCallback((segment: string): string[] => {
    switch (segment) {
      case "First Receiver": return shipToLocations.map((l) => l.name)
      case "DC Name": return DC_NAMES.slice(0, 20)
      case "Customer Name": return CUSTOMER_NAMES.slice(0, 20)
      case "SKU": return skus.map((s) => s.code)
      case "Protein": return PROTEIN_TYPES
      case "Size": return SIZE_TYPES
      default: return shipToLocations.map((l) => l.name)
    }
  }, [])

  const groups = useMemo<GroupData[]>(() => {
    const result: GroupData[] = []
    const primarySegment = segments[0] || "First Receiver"
    const primaryValues = getSegmentValues(primarySegment)

    for (const primaryVal of primaryValues) {
      const seed = primaryVal.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
      const rand = seededRand(seed)
      const baseDemand = 8000 + (seed % 12000)
      const targetWOS = 4 + (seed % 3)
      const startingInvBase = baseDemand * targetWOS * 0.8
      const totalDemand: number[] = []
      const totalAllocation: number[] = []
      for (let i = 0; i < numCols; i++) {
        const seasonality = 0.85 + Math.sin((i / numCols) * Math.PI * 2) * 0.3
        const noise = 0.9 + rand() * 0.2
        totalDemand.push(Math.round(baseDemand * seasonality * noise))
        totalAllocation.push(Math.round(baseDemand * seasonality * noise * (1 + rand() * 0.1)))
      }
      const totalStartingInv = Math.round(startingInvBase)
      const openShipments = totalAllocation.map((v) => Math.round(v * 0.7))
      const simulated = totalAllocation.map((v, idx) => {
        const key = `${primaryVal}|${idx}`
        if (shipmentOverrides[key] !== undefined) return shipmentOverrides[key]
        return Math.round(v * 0.3)
      })
      const shipmentArrivals = openShipments.map((o, i) => o + simulated[i])
      const startingInv: number[] = []
      const endingInv: number[] = []
      for (let i = 0; i < numCols; i++) {
        const starting = i === 0 ? totalStartingInv : endingInv[i - 1]
        startingInv.push(starting)
        endingInv.push(starting + shipmentArrivals[i] - totalDemand[i])
      }
      const unfulfilled = totalDemand.map((d, i) => Math.max(0, d - shipmentArrivals[i] - startingInv[i]))
      const shipmentToPlace = simulated.map((v) => v)
      const avgDemand = totalDemand.reduce((s, v) => s + v, 0) / Math.max(numCols, 1)
      const startingWOS = startingInv.map((v) => (avgDemand > 0 ? v / avgDemand : 0))
      const endingWOS = endingInv.map((v) => (avgDemand > 0 ? v / avgDemand : 0))
      const inStockRate = endingInv.map((v) => (v > 0 ? 100 : 0))
      result.push({
        groupKey: primaryVal,
        label: primaryVal,
        wosTarget: targetWOS,
        measures: {
          startingInventory: startingInv, forecastedSales: totalDemand,
          shipmentArrivals, openShipments, simulated, endingInventory: endingInv,
          unfulfilled, shipmentToPlace, targetWOS: Array(numCols).fill(targetWOS),
          startingWOS, endingWOS, inStockRate,
          "Shipment Order to Place": shipmentToPlace, "Starting Inventory": startingInv,
          "Forecasted Sales": totalDemand, "Shipment Arrivals": shipmentArrivals,
          "Ending Inventory": endingInv, "Ending WOS": endingWOS,
        },
      })
    }
    return result
  }, [numCols, shipmentOverrides, segments, getSegmentValues])

  const aggregateMeasureKey = useMemo(() => aggregateKeyForOption(aggregateBy), [aggregateBy])

  const handleCellEdit = useCallback((groupKey: string, colIndex: number, value: number) => {
    setShipmentOverrides((prev) => ({ ...prev, [`${groupKey}|${colIndex}`]: value }))
  }, [])

  // =========================================================================
  // AccordionTable callbacks
  // =========================================================================

  const getItems = useCallback((_group: GroupData) => shipmentMeasures, [])

  const renderHeader = useCallback(() => (
    <tr>
      <TableHead css={[tableStyles.th, tableStyles.stickyColHead]}>
        {segments[0] || "Segment"} / Measure
      </TableHead>
      {dateColumns.map((col) => (
        <TableHead key={col} css={[tableStyles.th, tableStyles.right, tableStyles.colMin]}>{col}</TableHead>
      ))}
      <TableHead css={[tableStyles.th, tableStyles.right, tableStyles.thTotal, tableStyles.colMin]}>Total</TableHead>
    </tr>
  ), [segments, dateColumns])

  const renderGroupCells = useCallback((group: GroupData, isExpanded: boolean, toggle: () => void) => {
    const isNegAgg = aggregateMeasureKey === "forecastedSales"
    const aggValues = group.measures[aggregateMeasureKey] || []
    const aggTotal = aggValues.reduce((s, v) => s + v, 0)
    return (
      <>
        <TableCell
          css={css`position: sticky; left: 0; z-index: 1; background: inherit; font-weight: 500; color: ${theme.colors.foreground}; padding: 0.5rem 0.75rem; white-space: nowrap; cursor: pointer;`}
          onClick={toggle}
        >
          <div css={css`display: flex; align-items: center; gap: 0.375rem;`}>
            {isExpanded ? <ChevronDown size={14} color={theme.colors.mutedForeground} /> : <ChevronRight size={14} color={theme.colors.mutedForeground} />}
            <span>{group.label}</span>
          </div>
        </TableCell>
        {aggValues.map((v, idx) => (
          <TableCell key={idx} css={css`text-align: right; font-variant-numeric: tabular-nums; color: ${theme.colors.mutedForeground}; padding: 0.5rem 0.5rem; min-width: 5rem;`}>
            {isNegAgg && v > 0 ? `-${formatNumber(v)}` : formatNumber(v)}
          </TableCell>
        ))}
        <TableCell css={css`text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; color: ${theme.colors.foreground}; padding: 0.5rem 0.75rem; min-width: 5rem;`}>
          {isNegAgg && aggTotal > 0 ? `-${formatNumber(aggTotal)}` : formatNumber(aggTotal)}
        </TableCell>
      </>
    )
  }, [aggregateMeasureKey])

  const renderItemCells = useCallback((measure: MeasureDef, group: GroupData) => {
    const values = group.measures[measure.key] || []
    const total = values.reduce((s, v) => s + v, 0)
    const indentPx = (measure.indent + 1) * 16 + 20
    const totalFormatted = measure.isRate
      ? formatRate(total / Math.max(dateColumns.length, 1))
      : measure.isWOS
        ? formatWOS(total / Math.max(dateColumns.length, 1))
        : measure.isNegative && total > 0
          ? `-${formatNumber(total)}`
          : formatNumber(total)

    return (
      <>
        <TableCell css={css`position: sticky; left: 0; z-index: 1; background: inherit; padding: 0.375rem 0.75rem 0.375rem 0; white-space: nowrap; color: ${measure.isBold ? theme.colors.foreground : theme.colors.mutedForeground}; font-weight: ${measure.isBold ? "600" : "400"};`}>
          <span css={css`padding-left: ${indentPx}px; font-size: 0.75rem;`}>{measure.label}</span>
        </TableCell>
        {values.map((val, idx) => {
          const wosBg = measure.isWOS && group.wosTarget > 0 ? getWOSColor(val, group.wosTarget) : ""
          const isOverridden = shipmentOverrides[`${group.groupKey}|${idx}`] !== undefined

          if (measure.isEditable && editingMode) {
            return (
              <TableCell key={idx} css={css`text-align: right; padding: 0.125rem 0.25rem; min-width: 5rem; ${wosBg ? `background: ${wosBg};` : ""}`}>
                <input
                  type="number"
                  defaultValue={Math.round(val)}
                  css={css`width: 100%; text-align: right; background: ${alpha(theme.colors.status.warning, 0.15)}; border: 1px solid ${alpha(theme.colors.border, 0.5)}; border-radius: 0.25rem; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-variant-numeric: tabular-nums; outline: none; &:focus { background: ${alpha(theme.colors.status.warning, 0.3)}; }`}
                  onBlur={(e) => {
                    const newVal = Number(e.target.value)
                    if (!Number.isNaN(newVal) && newVal !== Math.round(val)) handleCellEdit(group.groupKey, idx, newVal)
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
            )
          }

          const displayVal = measure.isNegative && val > 0
            ? `-${measure.isRate ? formatRate(val) : measure.isWOS ? formatWOS(val) : formatNumber(val)}`
            : measure.isRate ? formatRate(val) : measure.isWOS ? formatWOS(val) : formatNumber(val)

          return (
            <TableCell key={idx} css={css`text-align: right; font-variant-numeric: tabular-nums; font-size: 0.75rem; padding: 0.375rem 0.5rem; min-width: 5rem; color: ${isOverridden ? "#b45309" : measure.isBold ? theme.colors.foreground : theme.colors.mutedForeground}; font-weight: ${measure.isBold ? "600" : "400"}; ${wosBg ? `background: ${wosBg};` : ""}`}>
              {displayVal}
            </TableCell>
          )
        })}
        <TableCell css={css`text-align: right; font-variant-numeric: tabular-nums; font-size: 0.75rem; padding: 0.375rem 0.75rem; min-width: 5rem; color: ${measure.isBold ? theme.colors.foreground : theme.colors.mutedForeground}; font-weight: ${measure.isBold ? "600" : "400"};`}>
          {totalFormatted}
        </TableCell>
      </>
    )
  }, [shipmentOverrides, editingMode, handleCellEdit, dateColumns])

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div css={s.page}>
      <PageHeader
        title="Shipments"
        description="View shipment demand by SKU, channel, and week with supply walk details"
        actions={
          <Button variant="tertiary" size="sm">
            <Download size={14} />
            Export
          </Button>
        }
      />

      {/* Toolbar */}
      <ViewControls>
        <ViewControls.SegmentBy
          segments={segments}
          onSegmentsChange={setSegments}
          options={segmentOptions}
        />
        <ViewControls.AggregateBy
          value={aggregateBy}
          onChange={setAggregateBy}
          options={aggregateOptions}
        />
        <ViewControls.DisplayBy
          value={displayBy}
          onChange={setDisplayBy}
          options={displayByOptions}
        />
        <ViewControls.DateRange
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      </ViewControls>

      {/* Table */}
      <div css={[tableStyles.wrap, css`border: 1px solid ${theme.colors.border};`]}>
        <AccordionTable<GroupData, MeasureDef>
          groups={groups}
          getGroupId={(g) => g.groupKey}
          getItems={getItems}
          renderHeader={renderHeader}
          renderGroupCells={renderGroupCells}
          renderItemCells={renderItemCells}
          getGroupRowBg={(_, isExpanded) => isExpanded ? theme.colors.gray200 : theme.colors.background}
          getItemRowBg={(measure) => measure.isBold ? theme.colors.gray50 : theme.colors.background}
        />
      </div>
    </div>
  )
}
