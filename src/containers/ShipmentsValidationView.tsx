/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { theme, alpha } from "../styles/theme/theme"
import { tableStyles } from "../styles/mixins/table"
import { useState, useMemo, useCallback } from "react"
import { useViewParams } from "../hooks/useViewParams"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { Input } from "../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { TableCell } from "../components/ui/table"
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Pencil } from "lucide-react"
import { ViewControls } from "../components/ViewControls"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import {
  type AdjustmentStatus,
  type ShipmentAdjustment,
  generateSampleAdjustments,
  getShipmentPlanData,
  LOCATION_OPTIONS,
} from "../data/shipments-validation-data"
import { DataTable, type ColumnDef } from "../components/DataTable"
import { ContextTable, type ContextTableRow } from "../components/ContextTable"

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_DISPLAY: Record<AdjustmentStatus, string> = {
  "needs-review": "Needs Review",
  "approved": "Approved",
}

// ─── styles ───────────────────────────────────────────────────────────────────

const s = {
  root: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${theme.colors.background};
  `,
  deltaPositive: css`
    color: ${theme.colors.status.success};
    font-weight: 500;
  `,
  deltaNegative: css`
    color: ${theme.colors.status.error};
    font-weight: 500;
  `,
  actionBtns: css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
  `,
  expandToggleBtn: css`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: ${theme.colors.mutedForeground};
    display: flex;
    align-items: center;
    &:hover { color: ${theme.colors.foreground}; }
  `,
  checkboxCell: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `,
  wosStatus: (status: string) => css`
    font-size: 0.75rem;
    font-weight: 500;
    color: ${status === "Low" ? theme.colors.status.error : status === "Medium" ? theme.colors.status.success : theme.colors.blue600};
  `,
  statRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    border: 1px solid ${theme.colors.border};
    background-color: ${alpha(theme.colors.muted, 0.5)};
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
  `,
  statLabel: css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.colors.foreground};
  `,
  statValue: (color?: string) => css`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${color ?? theme.colors.foreground};
  `,
  editForm: css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-left: 2rem;
  `,
  editRow: css`
    display: flex;
    align-items: center;
    gap: 1rem;
  `,
  editField: css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  `,
  editFieldWide: css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 2;
  `,
  editLabel: css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.colors.mutedForeground};
  `,
  editActions: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `,
  expandedField: css`
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  `,
  expandedLabel: css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.colors.mutedForeground};
    min-width: 7.5rem;
  `,
  expandedValue: css`
    font-size: 0.875rem;
    color: ${theme.colors.foreground};
  `,
}

// ─── component ────────────────────────────────────────────────────────────────

const defaultViewParams = {
  filterStatus: ["Needs Review"] as string[],
  filterSku: [] as string[],
  filterLocation: [] as string[],
  filterPlanner: [] as string[],
}

export function ShipmentsValidationView() {
  const [adjustments, setAdjustments] = useState<ShipmentAdjustment[]>(generateSampleAdjustments())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ overrideValue: string; overrideReason: string }>({
    overrideValue: "",
    overrideReason: "",
  })
  const { params, setParam } = useViewParams(defaultViewParams)

  const approvedCount = useMemo(() => adjustments.filter((a) => a.status === "approved").length, [adjustments])

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((adj) => {
      if (params.filterStatus.length > 0 && !params.filterStatus.includes(STATUS_DISPLAY[adj.status])) return false
      if (params.filterSku.length > 0 && !params.filterSku.includes(adj.sku)) return false
      if (params.filterLocation.length > 0 && !params.filterLocation.includes(adj.shipTo)) return false
      if (params.filterPlanner.length > 0 && !params.filterPlanner.includes(adj.planner)) return false
      return true
    })
  }, [adjustments, params.filterStatus, params.filterSku, params.filterLocation, params.filterPlanner])

  const toggleSelected = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAdjustments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAdjustments.map((a) => a.id)))
    }
  }

  const handleApprove = (ids: string[]) => {
    setAdjustments((prev) =>
      prev.map((adj) => (ids.includes(adj.id) ? { ...adj, status: "approved" as const } : adj)),
    )
    setSelectedIds(new Set())
  }

  const handleUnapprove = (ids: string[]) => {
    setAdjustments((prev) =>
      prev.map((adj) => (ids.includes(adj.id) ? { ...adj, status: "needs-review" as const } : adj)),
    )
    setSelectedIds(new Set())
  }

  const handlePublish = () => {
    setShowPublishDialog(false)
  }

  const startEditing = (adj: ShipmentAdjustment) => {
    setEditingId(adj.id)
    setEditValues({ overrideValue: adj.overrideValue.toString(), overrideReason: adj.overrideReason })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValues({ overrideValue: "", overrideReason: "" })
  }

  const saveEdit = (id: string) => {
    const overrideValue = parseInt(editValues.overrideValue, 10)
    if (isNaN(overrideValue) || overrideValue < 0) {
      alert("Please enter a valid positive number for override value")
      return
    }
    if (!editValues.overrideReason.trim()) {
      alert("Please enter a reason for the override")
      return
    }
    setAdjustments((prev) =>
      prev.map((adj) =>
        adj.id === id ? { ...adj, overrideValue, overrideReason: editValues.overrideReason } : adj,
      ),
    )
    cancelEditing()
  }

  // ─── Filter options ────────────────────────────────────────────────────────

  const uniqueSkus = useMemo(() => [...new Set(adjustments.map((a) => a.sku))].sort(), [adjustments])
  const uniqueLocations = useMemo(() => [...new Set(adjustments.map((a) => a.shipTo))].sort(), [adjustments])
  const uniquePlanners = useMemo(() => [...new Set(adjustments.map((a) => a.planner))].sort(), [adjustments])

  const statusOpts = useMemo(() => Object.values(STATUS_DISPLAY).map((v) => ({ value: v, label: v })), [])
  const skuOpts = useMemo(() => uniqueSkus.map((v) => ({ value: v, label: v })), [uniqueSkus])
  const locationOpts = useMemo(() => uniqueLocations.map((loc) => {
    const opt = LOCATION_OPTIONS.find((o) => o.value === loc)
    return { value: loc, label: opt?.label ?? loc }
  }), [uniqueLocations])
  const plannerOpts = useMemo(() => uniquePlanners.map((v) => ({ value: v, label: v })), [uniquePlanners])


  // ─── Column definitions ────────────────────────────────────────────────────

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo<ColumnDef[]>(() => [
    {
      key: "select",
      header: (
        <Checkbox
          size="sm"
          checked={filteredAdjustments.length > 0 && selectedIds.size === filteredAdjustments.length}
          onCheckedChange={toggleSelectAll}
        />
      ),
      css: css`width: 2.5rem;`,
    },
    { key: "id", header: "ID" },
    { key: "sku", header: "SKU" },
    { key: "ship-to", header: "Ship To" },
    { key: "ship-from", header: "Ship From" },
    { key: "time-period", header: "Time Period" },
    { key: "original", header: "Original", css: tableStyles.right },
    { key: "override", header: "Override", css: tableStyles.right },
    { key: "variance", header: "Variance", css: tableStyles.right },
    { key: "planner", header: "Planner" },
    { key: "created", header: "Created" },
    { key: "actions", header: "Actions" },
  ], [filteredAdjustments.length, selectedIds.size])

  // ─── Row renderers ─────────────────────────────────────────────────────────

  const renderCells = (adj: ShipmentAdjustment, isExpanded: boolean, toggle: () => void) => {
    const isEditing = editingId === adj.id
    const isSelected = selectedIds.has(adj.id)
    const delta = adj.overrideValue - adj.originalValue
    const deltaPercent = ((delta / adj.originalValue) * 100).toFixed(1)

    return (
      <>
        <TableCell css={tableStyles.td}>
          <Checkbox size="sm" checked={isSelected} onCheckedChange={() => toggleSelected(adj.id)} />
        </TableCell>
        <TableCell css={[tableStyles.td, css`font-weight: 500;`]}>
          <div css={s.checkboxCell}>
            <button css={s.expandToggleBtn} onClick={toggle}>
              {isExpanded
                ? <ChevronDown css={css`width: 1rem; height: 1rem;`} />
                : <ChevronRight css={css`width: 1rem; height: 1rem;`} />
              }
            </button>
            {adj.id}
          </div>
        </TableCell>
        <TableCell css={tableStyles.td}>{adj.sku}</TableCell>
        <TableCell css={tableStyles.td}>{adj.shipTo}</TableCell>
        <TableCell css={tableStyles.td}>{adj.shipFrom}</TableCell>
        <TableCell css={tableStyles.td}>{adj.timePeriod}</TableCell>
        <TableCell css={[tableStyles.td, tableStyles.right]}>{adj.originalValue.toLocaleString()}</TableCell>
        <TableCell css={[tableStyles.td, tableStyles.right, css`font-weight: 500;`]}>
          {adj.overrideValue.toLocaleString()}
        </TableCell>
        <TableCell
          css={[
            tableStyles.td,
            tableStyles.right,
            delta > 0 ? s.deltaPositive : delta < 0 ? s.deltaNegative : undefined,
          ]}
        >
          {delta > 0 ? "+" : ""}{delta.toLocaleString()} ({deltaPercent}%)
        </TableCell>
        <TableCell css={tableStyles.td}>{adj.planner}</TableCell>
        <TableCell css={[tableStyles.td, tableStyles.muted]}>{adj.createdAt.split(" ")[0]}</TableCell>
        <TableCell css={tableStyles.td}>
          <div css={s.actionBtns}>
            {adj.status === "needs-review" && !isEditing && (
              <Button
                size="sm"
                variant="ghost"
                css={css`color: ${theme.colors.blue600}; &:hover { color: ${theme.colors.blue700}; background-color: ${theme.colors.blue50}; }`}
                onClick={() => startEditing(adj)}
              >
                <Pencil css={css`width: 1rem; height: 1rem;`} />
              </Button>
            )}
            {adj.status === "needs-review" && (
              <Button
                size="sm"
                variant="ghost"
                css={css`color: ${theme.colors.green600}; &:hover { color: ${theme.colors.green700}; background-color: #f0fdfa; }`}
                disabled={isEditing}
                onClick={() => handleApprove([adj.id])}
              >
                <CheckCircle css={css`width: 1rem; height: 1rem;`} />
              </Button>
            )}
            {adj.status === "approved" && (
              <Button
                size="sm"
                variant="ghost"
                css={css`color: ${theme.colors.orange600}; &:hover { color: #c2410c; background-color: ${theme.colors.orange50}; }`}
                onClick={() => handleUnapprove([adj.id])}
              >
                <XCircle css={css`width: 1rem; height: 1rem;`} />
              </Button>
            )}
          </div>
        </TableCell>
      </>
    )
  }

  const renderExpandedContent = (adj: ShipmentAdjustment) => {
    const isEditing = editingId === adj.id
    const delta = adj.overrideValue - adj.originalValue
    const deltaPercent = ((delta / adj.originalValue) * 100).toFixed(1)

    return (
      <td
        colSpan={12}
        css={css`padding: 0.75rem 1.5rem; background: ${alpha(theme.colors.muted, 0.3)};`}
      >
        {isEditing ? (
          <div css={s.editForm}>
            <div css={s.editRow}>
              <div css={s.editField}>
                <label css={s.editLabel}>Override Value</label>
                <Input
                  type="number"
                  value={editValues.overrideValue}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, overrideValue: e.target.value }))}
                  placeholder="Enter override value"
                />
              </div>
              <div css={s.editFieldWide}>
                <label css={s.editLabel}>Override Reason</label>
                <Input
                  type="text"
                  value={editValues.overrideReason}
                  onChange={(e) => setEditValues((prev) => ({ ...prev, overrideReason: e.target.value }))}
                  placeholder="Enter reason for override"
                />
              </div>
            </div>
            <div css={s.editActions}>
              <Button
                size="sm"
                css={css`background-color: #0d9488; &:hover { background-color: #0f766e; }`}
                onClick={() => saveEdit(adj.id)}
              >
                Save Changes
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div css={css`margin-left: 2rem;`}>
            <div css={s.expandedField}>
              <span css={s.expandedLabel}>Override Reason:</span>
              <span css={s.expandedValue}>{adj.overrideReason}</span>
            </div>
            <div css={s.expandedField}>
              <span css={s.expandedLabel}>Impact:</span>
              <span css={s.expandedValue}>
                This adjustment will {delta > 0 ? "increase" : "decrease"} shipments by{" "}
                {Math.abs(delta).toLocaleString()} units ({Math.abs(Number(deltaPercent))}%) for{" "}
                {adj.timePeriod}
              </span>
            </div>
            {(() => {
              const planData = getShipmentPlanData(adj.shipTo, adj.sku, adj.timePeriod)
              if (!planData) return null
              const contextRows: ContextTableRow[] = [
                ...[
                  { label: "Starting Inventory", data: planData.startingInventory.map((v) => v.toLocaleString()), color: "" },
                  { label: "- Retail Demand", data: planData.retailDemand.map((v) => `-${v.toLocaleString()}`), color: theme.colors.status.error },
                  { label: "+ Arriving Inventory", data: planData.arrivingInventory.map((v) => v.toLocaleString()), color: theme.colors.status.success },
                  { label: "= Ending Inventory", data: planData.endingInventory.map((v) => v.toLocaleString()), color: "" },
                  { label: "Target WOS", data: planData.targetWOS.map((v) => v.toFixed(1)), color: "" },
                  { label: "Current WOS", data: planData.currentWOS.map((v) => v.toFixed(1)), color: "" },
                  { label: "Calculated Shipments", data: planData.calculatedShipments.map((v) => v.toLocaleString()), color: "" },
                ].map(({ label, data, color }) => ({
                  label,
                  cells: data.map((val) => ({
                    value: val,
                    ...(color ? { css: css`color: ${color};` } : {}),
                  })),
                })),
                {
                  label: "WOS Status",
                  cells: planData.wosStatus.map((status) => ({
                    value: <span css={s.wosStatus(status)}>{status}</span>,
                  })),
                },
                {
                  label: "Overrides",
                  cells: planData.overrides.map((val) => ({
                    value: val !== null ? (val > 0 ? `+${val.toLocaleString()}` : val.toLocaleString()) : "—",
                    css: val !== null && val > 0 ? css`color: ${theme.colors.blue600}; font-weight: 500;`
                      : val !== null && val < 0 ? css`color: ${theme.colors.status.error}; font-weight: 500;`
                      : undefined,
                  })),
                },
                {
                  label: "Override Reason",
                  labelCss: css`font-style: italic;`,
                  cells: planData.overrideReasons.map((reason) => ({
                    value: reason || "—",
                    css: css`font-style: italic; max-width: 9.375rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`,
                    title: reason,
                  })),
                },
                {
                  label: "Adjusted Shipment",
                  labelCss: css`font-weight: 500; color: ${theme.colors.foreground};`,
                  borderBottom: false,
                  cells: planData.calculatedShipments.map((calc, idx) => {
                    const override = planData.overrides[idx]
                    const adjusted = override !== null ? calc + override : calc
                    return {
                      value: adjusted.toLocaleString(),
                      css: idx === planData.targetWeekIndex ? css`color: ${theme.colors.blue700}; font-weight: 500;` : css`font-weight: 500;`,
                    }
                  }),
                },
              ]
              return (
                <ContextTable
                  title="Shipments Walk Context"
                  weeks={planData.weeks}
                  targetWeekIndex={planData.targetWeekIndex}
                  rows={contextRows}
                />
              )
            })()}
          </div>
        )}
      </td>
    )
  }

  return (
    <div css={s.root}>
      <PageHeader
        title="Shipment Validation"
        description="Review and publish shipment plan adjustments across all channels"
        actions={
          <>
            {selectedIds.size > 0 && filteredAdjustments.some((a) => selectedIds.has(a.id) && a.status === "needs-review") && (
              <>
                <Button
                  variant="tertiary"
                  size="sm"
                  css={css`border-color: ${theme.colors.orange600}; color: ${theme.colors.orange600};`}
                  onClick={() => handleUnapprove([...selectedIds])}
                >
                  <XCircle size={14} />
                  Unapprove ({selectedIds.size})
                </Button>
                <Button
                  size="sm"
                  css={css`background: ${theme.colors.green600}; color: ${theme.colors.white}; &:hover { background: ${theme.colors.green700}; }`}
                  onClick={() => handleApprove([...selectedIds])}
                >
                  <CheckCircle size={14} />
                  Approve ({selectedIds.size})
                </Button>
              </>
            )}
            <Button variant="secondary" size="sm" disabled={approvedCount === 0} onClick={() => setShowPublishDialog(true)}>
              <CheckCircle size={14} />
              Publish Plan
            </Button>
          </>
        }
      />

      {/* Filters */}
      <ViewControls>
        <ViewControls.FilterDropdown label="Status" values={params.filterStatus} onChange={(v) => setParam("filterStatus", v)} options={statusOpts} multiple={false} />
        <ViewControls.FilterDropdown label="SKU" values={params.filterSku} onChange={(v) => setParam("filterSku", v)} options={skuOpts} />
        <ViewControls.FilterDropdown label="Location" values={params.filterLocation} onChange={(v) => setParam("filterLocation", v)} options={locationOpts} />
        <ViewControls.FilterDropdown label="Planner" values={params.filterPlanner} onChange={(v) => setParam("filterPlanner", v)} options={plannerOpts} />
      </ViewControls>

      {/* Table */}
      <div css={tableStyles.wrap}>
        <DataTable<ShipmentAdjustment>
          data={filteredAdjustments}
          columns={columns}
          getRowId={(adj) => adj.id}
          isRowSelected={(adj) => selectedIds.has(adj.id)}
          renderCells={renderCells}
          renderExpandedContent={renderExpandedContent}
        />
      </div>

      {/* Publish dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Shipment Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this as the official Shipment Plan? This will make the plan available to
              all downstream systems and stakeholders.
            </DialogDescription>
          </DialogHeader>
          <div css={css`padding: 1rem 0;`}>
            <div css={s.statRow}>
              <span css={s.statLabel}>Total Adjustments:</span>
              <span css={s.statValue()}>{adjustments.length}</span>
            </div>
            <div css={s.statRow}>
              <span css={s.statLabel}>Approved:</span>
              <span css={s.statValue(theme.colors.status.success)}>{approvedCount}</span>
            </div>
            <div css={s.statRow}>
              <span css={s.statLabel}>Pending Review:</span>
              <span css={s.statValue(theme.colors.orange600)}>{adjustments.length - approvedCount}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button
              css={css`background-color: #0d9488; &:hover { background-color: #0f766e; }`}
              onClick={handlePublish}
            >
              Confirm &amp; Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
