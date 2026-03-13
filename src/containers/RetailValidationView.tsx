/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback, type FC } from "react"
import { theme } from "../styles/theme/theme"
import { tableStyles } from "../styles/mixins/table"
import { ChevronDown, ChevronRight, CheckCircle, X, Edit2 } from "lucide-react"
import { ViewControls } from "../components/ViewControls"
import { TableCell } from "../components/ui/table"
import { Checkbox } from "../components/ui/checkbox"
import { Button } from "../components/ui/button"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { useRunData } from "../contexts/RunsContext"
import { formatNumber as fmt } from "../utils/format"
import {
  type AdjustmentStatus,
  type RetailAdjustment,
  generateSampleAdjustments,
  getRetailPlanData,
} from "../data/retail-validation-data"
import { ExpandableDataTable, type ColumnDef } from "../components/ExpandableDataTable"
import { ContextTable, type ContextTableRow } from "../components/ContextTable"

const STATUS_DISPLAY: Record<AdjustmentStatus, string> = {
  "needs-review": "Needs Review",
  "approved": "Approved",
}

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${theme.colors.background};
  `,
  skuBtn: css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: ${theme.colors.foreground};
  `,
  actionsGroup: css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
  `,
  editInput: css`
    width: 6rem;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    text-align: right;
    background: ${theme.colors.background};
    outline: none;
    &:focus { border-color: ${theme.colors.blue600}; }
  `,
  editTextarea: css`
    width: 100%;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    background: ${theme.colors.background};
    outline: none;
    resize: vertical;
    margin-top: 0.25rem;
    &:focus { border-color: ${theme.colors.blue600}; }
  `,
}

const approveBtn = css`background: ${theme.colors.green600}; color: ${theme.colors.white}; &:hover { background: ${theme.colors.green700}; }`

const deltaColor = (delta: number) =>
  delta > 0 ? css`color: ${theme.colors.status.success}; font-weight: 500;`
    : delta < 0 ? css`color: ${theme.colors.status.error}; font-weight: 500;`
    : css``

export const RetailValidationView: FC = () => {
  const data = useRunData()
  const skuList = useMemo(() => data.skus.map((s) => s.code), [data.skus])
  const initialAdjustments = useMemo(() => generateSampleAdjustments(skuList), [skuList])

  const [adjustments, setAdjustments] = useState<RetailAdjustment[]>(initialAdjustments)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ overrideValue: "", overrideReason: "" })
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({
    status: ["Needs Review"],
    sku: [],
    retailer: [],
    planner: [],
  })

  const approvedCount = useMemo(() => adjustments.filter((a) => a.status === "approved").length, [adjustments])

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((adj) => {
      if (filterValues.status.length > 0 && !filterValues.status.includes(STATUS_DISPLAY[adj.status])) return false
      if (filterValues.sku.length > 0 && !filterValues.sku.includes(adj.sku)) return false
      if (filterValues.retailer.length > 0 && !filterValues.retailer.includes(adj.retailer)) return false
      if (filterValues.planner.length > 0 && !filterValues.planner.includes(adj.planner)) return false
      return true
    })
  }, [adjustments, filterValues])

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAdjustments.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filteredAdjustments.map((a) => a.id)))
  }
  const handleApprove = (ids: string[]) => {
    setAdjustments((prev) => prev.map((adj) => (ids.includes(adj.id) ? { ...adj, status: "approved" as const } : adj)))
    setSelectedIds(new Set())
  }
  const handleReject = (ids: string[]) => {
    setAdjustments((prev) => prev.filter((adj) => !ids.includes(adj.id)))
    setSelectedIds(new Set())
  }
  const handlePublish = () => {
    const approvedIds = adjustments.filter((a) => a.status === "approved").map((a) => a.id)
    setAdjustments((prev) => prev.filter((adj) => !approvedIds.includes(adj.id)))
    setShowPublishDialog(false)
  }
  const startEditing = (adj: RetailAdjustment) => {
    setEditingId(adj.id)
    setEditValues({ overrideValue: adj.overrideValue.toString(), overrideReason: adj.overrideReason })
  }
  const saveEdit = () => {
    if (!editingId) return
    setAdjustments((prev) =>
      prev.map((adj) =>
        adj.id === editingId
          ? { ...adj, overrideValue: parseInt(editValues.overrideValue) || adj.overrideValue, overrideReason: editValues.overrideReason }
          : adj,
      ),
    )
    setEditingId(null)
  }
  const cancelEdit = () => { setEditingId(null); setEditValues({ overrideValue: "", overrideReason: "" }) }

  const uniqueSkus = useMemo(() => [...new Set(adjustments.map((a) => a.sku))].sort(), [adjustments])
  const uniqueRetailers = useMemo(() => [...new Set(adjustments.map((a) => a.retailer))].sort(), [adjustments])
  const uniquePlanners = useMemo(() => [...new Set(adjustments.map((a) => a.planner))].sort(), [adjustments])

  const statusOpts = useMemo(() => Object.values(STATUS_DISPLAY).map((v) => ({ value: v, label: v })), [])
  const skuOpts = useMemo(() => uniqueSkus.map((v) => ({ value: v, label: v })), [uniqueSkus])
  const retailerOpts = useMemo(() => uniqueRetailers.map((v) => ({ value: v, label: v })), [uniqueRetailers])
  const plannerOpts = useMemo(() => uniquePlanners.map((v) => ({ value: v, label: v })), [uniquePlanners])

  const handleFilterChange = useCallback((key: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [key]: values }))
  }, [])

  // ─── Column definitions ────────────────────────────────────────────────────

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo<ColumnDef[]>(() => [
    {
      key: "select",
      header: (
        <Checkbox
          size="sm"
          checked={selectedIds.size === filteredAdjustments.length && filteredAdjustments.length > 0}
          onCheckedChange={toggleSelectAll}
        />
      ),
      css: css`width: 2.5rem;`,
    },
    { key: "sku", header: "SKU", css: css`min-width: 7rem;` },
    { key: "retailer", header: "Retailer", css: css`min-width: 9rem;` },
    { key: "channel", header: "Channel", css: css`min-width: 8rem;` },
    { key: "time-period", header: "Time Period", css: css`min-width: 8rem;` },
    { key: "original", header: "Original", css: [tableStyles.right, css`min-width: 5rem;`] },
    { key: "override", header: "Override", css: [tableStyles.right, css`min-width: 5rem;`] },
    { key: "delta", header: "Delta", css: [tableStyles.right, css`min-width: 7rem;`] },
    { key: "planner", header: "Planner", css: css`min-width: 5rem;` },
    { key: "actions", header: "Actions", css: css`min-width: 7rem;` },
  ], [filteredAdjustments.length, selectedIds.size])

  // ─── Row renderers ─────────────────────────────────────────────────────────

  const renderCells = (adj: RetailAdjustment, isExpanded: boolean, toggle: () => void) => {
    const isEditing = editingId === adj.id
    const delta = adj.overrideValue - adj.originalValue
    const deltaPercent = ((delta / adj.originalValue) * 100).toFixed(1)

    return (
      <>
        <TableCell css={css`width: 2.5rem;`}>
          <Checkbox size="sm" checked={selectedIds.has(adj.id)} onCheckedChange={() => toggleSelected(adj.id)} />
        </TableCell>
        <TableCell>
          <button css={s.skuBtn} onClick={toggle}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {adj.sku}
          </button>
        </TableCell>
        <TableCell>{adj.retailer}</TableCell>
        <TableCell css={css`color: ${theme.colors.mutedForeground};`}>{adj.channel}</TableCell>
        <TableCell>{adj.timePeriod}</TableCell>
        <TableCell css={css`text-align: right; color: ${theme.colors.mutedForeground};`}>{fmt(adj.originalValue)}</TableCell>
        <TableCell css={css`text-align: right; font-weight: 500;`}>
          {isEditing ? (
            <input
              type="number"
              css={s.editInput}
              value={editValues.overrideValue}
              onChange={(e) => setEditValues((prev) => ({ ...prev, overrideValue: e.target.value }))}
            />
          ) : (
            fmt(adj.overrideValue)
          )}
        </TableCell>
        <TableCell css={[css`text-align: right;`, deltaColor(delta)]}>
          {delta > 0 ? "+" : ""}{fmt(delta)} ({delta > 0 ? "+" : ""}{deltaPercent}%)
        </TableCell>
        <TableCell>{adj.planner}</TableCell>
        <TableCell>
          <div css={s.actionsGroup}>
            {isEditing ? (
              <>
                <Button size="sm" variant="ghost" onClick={saveEdit} css={css`height: 1.75rem; padding: 0 0.5rem; font-size: 0.75rem;`}>Save</Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit} css={css`height: 1.75rem; padding: 0 0.5rem; font-size: 0.75rem;`}>Cancel</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => startEditing(adj)} css={css`height: 1.75rem; width: 1.75rem; padding: 0;`}>
                  <Edit2 size={14} />
                </Button>
                {adj.status === "needs-review" && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => handleApprove([adj.id])} css={css`height: 1.75rem; width: 1.75rem; padding: 0; color: ${theme.colors.green600};`}>
                      <CheckCircle size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleReject([adj.id])} css={css`height: 1.75rem; width: 1.75rem; padding: 0; color: ${theme.colors.status.error};`}>
                      <X size={14} />
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </TableCell>
      </>
    )
  }

  const renderExpandedContent = (adj: RetailAdjustment) => {
    const isEditing = editingId === adj.id
    const delta = adj.overrideValue - adj.originalValue
    const deltaPct = ((delta / adj.originalValue) * 100).toFixed(1)
    const planData = getRetailPlanData(adj.retailer, adj.sku, adj.timePeriod, adj.overrideValue, adj.overrideReason)

    return (
      <td
        colSpan={10}
        css={css`padding: 0.75rem 1.5rem 1rem; border-bottom: 1px solid ${theme.colors.border};`}
      >
        <div css={css`margin-left: 2rem; display: flex; flex-direction: column; gap: 0.5rem;`}>
          <div css={css`display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem;`}>
            <span css={css`font-weight: 500; color: ${theme.colors.mutedForeground}; min-width: 9rem;`}>Override Reason:</span>
            {isEditing ? (
              <textarea
                css={s.editTextarea}
                value={editValues.overrideReason}
                onChange={(e) => setEditValues((prev) => ({ ...prev, overrideReason: e.target.value }))}
                rows={2}
              />
            ) : (
              <span>{adj.overrideReason}</span>
            )}
          </div>
          <div css={css`display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem;`}>
            <span css={css`font-weight: 500; color: ${theme.colors.mutedForeground}; min-width: 9rem;`}>Impact:</span>
            <span>
              This adjustment will {delta > 0 ? "increase" : "decrease"} demand by{" "}
              {Math.abs(delta).toLocaleString()} units ({Math.abs(Number(deltaPct))}%) for {adj.timePeriod}
            </span>
          </div>
        </div>

        {planData && (() => {
          const contextRows: ContextTableRow[] = [
            ...[
              { label: "History (2Y Ago)", data: planData.history2YAgo.map((v) => v.toLocaleString()), color: theme.colors.mutedForeground },
              { label: "History (PY)", data: planData.historyPriorYear.map((v) => v.toLocaleString()), color: theme.colors.mutedForeground },
              { label: "Baseline Forecast", data: planData.baselineForecast.map((v) => v.toLocaleString()), color: "" },
              { label: "+ Promotional Lift", data: planData.promotionalLift.map((v) => v > 0 ? `+${v.toLocaleString()}` : "—"), color: theme.colors.status.success },
              { label: "= Model Forecast", data: planData.modelForecast.map((v) => v.toLocaleString()), color: "" },
              { label: "Calculated Demand", data: planData.modelForecast.map((v) => v.toLocaleString()), color: "" },
            ].map(({ label, data, color }) => ({
              label,
              cells: data.map((val) => ({
                value: val,
                ...(color ? { css: css`color: ${color};` } : {}),
              })),
            })),
            {
              label: "Overrides",
              cells: planData.overrides.map((val, idx) => ({
                value: val !== null ? (val > planData.modelForecast[idx] ? `+${(val - planData.modelForecast[idx]).toLocaleString()}` : (val - planData.modelForecast[idx]).toLocaleString()) : "—",
                css: val !== null && val > planData.modelForecast[idx] ? css`color: ${theme.colors.blue600}; font-weight: 500;`
                  : val !== null && val < planData.modelForecast[idx] ? css`color: ${theme.colors.status.error}; font-weight: 500;`
                  : undefined,
              })),
            },
            {
              label: "Override Reason",
              labelCss: css`font-style: italic;`,
              cells: planData.overrideReasons.map((reason) => ({
                value: reason || "—",
                css: css`font-style: italic; max-width: 9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`,
                title: reason,
              })),
            },
            {
              label: "Adjusted Forecast",
              labelCss: css`font-weight: 500; color: ${theme.colors.foreground};`,
              cells: planData.adjustedForecast.map((val, idx) => ({
                value: val.toLocaleString(),
                css: idx === planData.targetWeekIndex ? css`color: ${theme.colors.blue700}; font-weight: 500;` : css`font-weight: 500;`,
              })),
            },
            {
              label: "YoY %",
              borderBottom: false,
              cells: planData.yoyPct.map((val) => ({
                value: val !== null ? `${val > 0 ? "+" : ""}${val}%` : "—",
                css: val !== null && val > 0 ? css`color: ${theme.colors.status.success}; font-weight: 500;`
                  : val !== null && val < 0 ? css`color: ${theme.colors.status.error}; font-weight: 500;`
                  : undefined,
              })),
            },
          ]
          return (
            <ContextTable
              title="Consumption Plan Context"
              weeks={planData.weeks}
              targetWeekIndex={planData.targetWeekIndex}
              rows={contextRows}
            />
          )
        })()}
      </td>
    )
  }

  return (
    <div css={s.page}>
      <PageHeader
        title="Consumption Validation"
        description="Review, approve, or reject retail demand adjustments before publishing"
        actions={
          <>
            {selectedIds.size > 0 && filteredAdjustments.some((a) => selectedIds.has(a.id) && a.status === "needs-review") && (
              <>
                <Button variant="tertiary" size="sm" onClick={() => handleReject([...selectedIds])}>
                  <X size={14} />
                  Reject ({selectedIds.size})
                </Button>
                <Button size="sm" css={approveBtn} onClick={() => handleApprove([...selectedIds])}>
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
        <ViewControls.FilterDropdown label="Status" values={filterValues.status} onChange={(v) => handleFilterChange("status", v)} options={statusOpts} clearable={false} />
        <ViewControls.FilterDropdown label="SKU" values={filterValues.sku} onChange={(v) => handleFilterChange("sku", v)} options={skuOpts} />
        <ViewControls.FilterDropdown label="Retailer" values={filterValues.retailer} onChange={(v) => handleFilterChange("retailer", v)} options={retailerOpts} />
        <ViewControls.FilterDropdown label="Planner" values={filterValues.planner} onChange={(v) => handleFilterChange("planner", v)} options={plannerOpts} />
      </ViewControls>

      {/* Table */}
      <div css={tableStyles.wrap}>
        <ExpandableDataTable<RetailAdjustment>
          data={filteredAdjustments}
          columns={columns}
          getRowId={(adj) => adj.id}
          isRowSelected={(adj) => selectedIds.has(adj.id)}
          renderCells={renderCells}
          renderExpandedContent={renderExpandedContent}
        />
      </div>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Consumption Plan</DialogTitle>
            <DialogDescription>
              You are about to publish {approvedCount} approved adjustment(s) to the retail demand plan. This
              action will update the forecast values and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="tertiary" size="sm" onClick={() => setShowPublishDialog(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handlePublish}>Publish Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
