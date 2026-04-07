/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState, useMemo, useCallback } from "react"
import { theme } from "../styles/theme/theme"
import { ActionTable } from "../components/StageView/ActionTable"
import { getConsumptionValidationData } from "../data/glowco-consumption-data"
import type { ValidationOverride } from "../data/glowco-consumption-data"
import { Check, X, Pencil } from "lucide-react"

const pageStyles = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${theme.typography.fontFamily};
  gap: ${theme.spacing.md};
`

const titleRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const publishBtn = css`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: ${theme.typography.fontFamily};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.blue600};
  color: ${theme.colors.white};
  cursor: pointer;
  &:hover {
    background: ${theme.colors.blue700};
  }
`

const tabBar = css`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`

const tabBtn = (active: boolean) => css`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: ${theme.typography.fontFamily};
  border: 1px solid ${active ? theme.colors.blue500 : theme.colors.gray200};
  border-radius: ${theme.borderRadius.md};
  background: ${active ? theme.colors.blue50 : theme.colors.white};
  color: ${active ? theme.colors.blue700 : theme.colors.gray600};
  cursor: pointer;
  &:hover {
    border-color: ${theme.colors.blue500};
  }
`

const tableWrap = css`
  flex: 1;
  overflow: auto;
  min-height: 0;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.white};
`

const detailTable = css`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`

const dtHead = css`
  padding: 8px 10px;
  text-align: left;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${theme.colors.gray500};
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.gray50};
  white-space: nowrap;
`

const dtCell = css`
  padding: 6px 10px;
  border-bottom: 1px solid ${theme.colors.gray100};
  color: ${theme.colors.gray900};
  white-space: nowrap;
`

const deltaCell = (positive: boolean) => css`
  ${dtCell};
  color: ${positive ? "#059669" : "#DC2626"};
  font-weight: 500;
`

const actionBtn = css`
  background: none;
  border: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.sm};
  padding: 3px 6px;
  cursor: pointer;
  color: ${theme.colors.gray500};
  margin-right: 4px;
  &:hover {
    border-color: ${theme.colors.blue500};
    color: ${theme.colors.blue600};
  }
`

const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })
const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function ConsumptionValidationPage() {
  const { actionTable, overrides } = useMemo(() => getConsumptionValidationData(), [])
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null)
  const [tab, setTab] = useState<"needs-review" | "approved">("needs-review")

  const needsReviewCount = overrides.filter(o => o.status === "needs-review").length
  const approvedCount = overrides.filter(o => o.status === "approved").length

  const filteredOverrides = useMemo(() => {
    let list = overrides.filter(o => o.status === tab)

    if (selectedActionId) {
      const actionRow = actionTable.rows.find(r => r.id === selectedActionId)
      if (actionRow?.detailIds) {
        const detailSet = new Set(actionRow.detailIds)
        list = list.filter(o => detailSet.has(o.id))
      }
    }

    return list
  }, [overrides, tab, selectedActionId, actionTable.rows])

  const handleActionSelect = useCallback((id: string | null) => {
    setSelectedActionId(id)
  }, [])

  return (
    <div css={pageStyles}>
      <div css={titleRow}>
        <div>
          <h2 css={titleStyles}>Consumption Validation</h2>
          <p css={descStyles}>Review and approve planner overrides before publishing</p>
        </div>
        <button css={publishBtn}>Publish Plan</button>
      </div>

      <div css={tabBar}>
        <button css={tabBtn(tab === "needs-review")} onClick={() => setTab("needs-review")}>
          Needs Review ({needsReviewCount})
        </button>
        <button css={tabBtn(tab === "approved")} onClick={() => setTab("approved")}>
          Approved ({approvedCount})
        </button>
      </div>

      <ActionTable
        config={actionTable}
        selectedActionId={selectedActionId}
        onActionSelect={handleActionSelect}
      />

      <div css={tableWrap}>
        <table css={detailTable}>
          <thead>
            <tr>
              <th css={dtHead}>SKU</th>
              <th css={dtHead}>Retailer</th>
              <th css={dtHead}>Channel</th>
              <th css={dtHead}>Period</th>
              <th css={dtHead}>Original</th>
              <th css={dtHead}>Override</th>
              <th css={dtHead}>Delta</th>
              <th css={dtHead}>Delta %</th>
              <th css={dtHead}>Planner</th>
              <th css={dtHead}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOverrides.map(ov => (
              <tr key={ov.id}>
                <td css={dtCell}>{ov.sku}</td>
                <td css={dtCell}>{ov.retailer}</td>
                <td css={dtCell}>{ov.channel}</td>
                <td css={dtCell}>{ov.timePeriod}</td>
                <td css={dtCell}>{numFmt.format(ov.original)}</td>
                <td css={dtCell}>{numFmt.format(ov.override)}</td>
                <td css={deltaCell(ov.delta >= 0)}>
                  {ov.delta >= 0 ? "+" : ""}{numFmt.format(ov.delta)}
                </td>
                <td css={deltaCell(ov.deltaPct >= 0)}>
                  {ov.deltaPct >= 0 ? "+" : ""}{pctFmt.format(ov.deltaPct)}
                </td>
                <td css={dtCell}>{ov.planner}</td>
                <td css={dtCell}>
                  <button css={actionBtn} title="Edit"><Pencil size={12} /></button>
                  <button css={actionBtn} title="Approve"><Check size={12} /></button>
                  <button css={actionBtn} title="Reject"><X size={12} /></button>
                </td>
              </tr>
            ))}
            {filteredOverrides.length === 0 && (
              <tr>
                <td css={dtCell} colSpan={10} style={{ textAlign: "center", color: theme.colors.gray400, padding: "24px" }}>
                  No overrides to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
