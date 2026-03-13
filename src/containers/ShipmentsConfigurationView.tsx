/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { theme } from "../styles/theme/theme"
import { tableStyles } from "../styles/mixins/table"
import { useState } from "react"
import { TableHead, TableCell } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Plus, Pencil, Save, X, Trash2, Info } from "lucide-react"
import {
  type DemandMapping,
  initialMappings,
  availableRetailers,
  availableShipToLocations,
  availablePlanners,
} from "../data/shipments-config-data"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip"
import { DataTable } from "../components/DataTable"

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  `,
  thWithInfo: css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
  `,
  infoIcon: css`
    color: ${theme.colors.gray400};
    cursor: help;
    flex-shrink: 0;
  `,
  select: css`
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    color: ${theme.colors.foreground};
    outline: none;
    &:focus { border-color: ${theme.colors.mutedForeground}; }
  `,
  iconBtn: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.mutedForeground};
    transition: background-color 0.1s, color 0.1s;
    &:hover { background: ${theme.colors.border}; color: ${theme.colors.foreground}; }
  `,
  iconBtnDanger: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.status.error};
    &:hover { background: ${theme.colors.red50}; }
  `,
  inputNarrow: css`
    width: 5rem;
    text-align: center;
    font-size: 0.875rem;
  `,
  iconSm: css`
    width: 1rem;
    height: 1rem;
  `,
}

export function ShipmentsConfigurationView() {
  const [mappings, setMappings] = useState<DemandMapping[]>(initialMappings)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<DemandMapping | null>(null)

  const handleEdit = (mapping: DemandMapping) => {
    setEditingId(mapping.id)
    setEditValues({ ...mapping })
  }
  const handleSave = () => {
    if (editValues && editingId) {
      setMappings(mappings.map((m) => (m.id === editingId ? editValues : m)))
      setEditingId(null)
      setEditValues(null)
    }
  }
  const handleCancel = () => { setEditingId(null); setEditValues(null) }
  const handleDelete = (id: string) => setMappings(mappings.filter((m) => m.id !== id))
  const handleAdd = () => {
    const newMapping: DemandMapping = {
      id: Date.now().toString(),
      retailer: availableRetailers[0],
      shipToLocation: availableShipToLocations[0],
      percentSplit: null,
      wosTarget: null,
      planner: availablePlanners[0],
      leadTimeDays: 7,
    }
    setMappings([...mappings, newMapping])
    setEditingId(newMapping.id)
    setEditValues(newMapping)
  }
  const updateEditValue = (field: keyof DemandMapping, value: string | number | null) => {
    if (editValues) setEditValues({ ...editValues, [field]: value })
  }

  return (
    <div css={s.page}>
      <PageHeader
        title="Shipments Configuration"
        description="Define where each channel ships from, WOS targets, and lead times"
        actions={
          <Button variant="secondary" size="sm" onClick={handleAdd}>
            <Plus size={14} />
            Add Mapping
          </Button>
        }
      />

      {/* Table */}
      <div css={tableStyles.wrap}>
        <DataTable<DemandMapping>
          data={mappings}
          fixedHeaderContent={() => (
            <tr>
              <TableHead css={tableStyles.th}>Retailer</TableHead>
              <TableHead css={tableStyles.th}>
                <div css={s.thWithInfo}>
                  Ship To Location
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={12} css={s.infoIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">The 3PL or fulfillment center receiving shipments (IDS Indianapolis DTC for D2C, RJW Logistics for Retail, Greentop)</TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead css={[tableStyles.th, tableStyles.right]}>
                <div css={[s.thWithInfo, css`justify-content: flex-end;`]}>
                  % Split
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={12} css={s.infoIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Allocation percentage for multi-DC retailers (must sum to 100% per retailer)</TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead css={[tableStyles.th, tableStyles.right]}>
                <div css={[s.thWithInfo, css`justify-content: flex-end;`]}>
                  WOS Target
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={12} css={s.infoIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Weeks of Supply target at the Ship-To location</TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead css={[tableStyles.th, tableStyles.right]}>
                <div css={[s.thWithInfo, css`justify-content: flex-end;`]}>
                  Lead Time (Days)
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={12} css={s.infoIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Expected days from ship-from node to DC receipt</TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead css={tableStyles.th}>
                <div css={s.thWithInfo}>
                  Planner
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={12} css={s.infoIcon} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Owner responsible for shipment demand planning</TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead css={tableStyles.th}>Actions</TableHead>
            </tr>
          )}
          itemContent={(_, mapping) => {
            const isEditing = editingId === mapping.id
            const values = isEditing && editValues ? editValues : mapping
            return (
              <>
                <TableCell>
                  {isEditing ? (
                    <select css={s.select} value={values.retailer} onChange={(e) => updateEditValue("retailer", e.target.value)}>
                      {availableRetailers.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span>{values.retailer}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <select css={s.select} value={values.shipToLocation} onChange={(e) => updateEditValue("shipToLocation", e.target.value)}>
                      {availableShipToLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  ) : (
                    <span>{values.shipToLocation}</span>
                  )}
                </TableCell>
                <TableCell css={css`text-align: right;`}>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={values.percentSplit ?? ""}
                      onChange={(e) => updateEditValue("percentSplit", e.target.value ? Number(e.target.value) : null)}
                      css={s.inputNarrow}
                      placeholder="-"
                    />
                  ) : (
                    <span>{values.percentSplit ? `${values.percentSplit}%` : "-"}</span>
                  )}
                </TableCell>
                <TableCell css={css`text-align: right;`}>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      value={values.wosTarget ?? ""}
                      onChange={(e) => updateEditValue("wosTarget", e.target.value ? Number(e.target.value) : null)}
                      css={s.inputNarrow}
                      placeholder="-"
                    />
                  ) : (
                    <span>{values.wosTarget ?? "-"}</span>
                  )}
                </TableCell>
                <TableCell css={css`text-align: right;`}>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      value={values.leadTimeDays ?? ""}
                      onChange={(e) => updateEditValue("leadTimeDays", e.target.value ? Number(e.target.value) : null)}
                      css={s.inputNarrow}
                      placeholder="-"
                    />
                  ) : (
                    <span>{values.leadTimeDays ?? "-"}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <select css={s.select} value={values.planner} onChange={(e) => updateEditValue("planner", e.target.value)}>
                      {availablePlanners.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ) : (
                    <span>{values.planner}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div css={css`display: flex; gap: 0.25rem;`}>
                    {isEditing ? (
                      <>
                        <button css={s.iconBtn} onClick={handleSave} title="Save"><Save css={s.iconSm} /></button>
                        <button css={s.iconBtn} onClick={handleCancel} title="Cancel"><X css={s.iconSm} /></button>
                      </>
                    ) : (
                      <>
                        <button css={s.iconBtn} onClick={() => handleEdit(mapping)} title="Edit"><Pencil css={s.iconSm} /></button>
                        <button css={s.iconBtnDanger} onClick={() => handleDelete(mapping.id)} title="Delete"><Trash2 css={s.iconSm} /></button>
                      </>
                    )}
                  </div>
                </TableCell>
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
