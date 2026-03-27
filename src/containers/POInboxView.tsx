/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useMemo, useState, useCallback } from "react"
import { theme } from "../styles/theme/theme"
import { Download, Check } from "lucide-react"
import { PageHeader } from "../layouts/DashboardLayout/PageHeader"
import { Button } from "../components/ui/button"
import rawData from "../data/ui_po_inbox.json"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PORecord {
  purchase_order_id: string
  sku: string
  sku_name: string
  location: string
  supplier: string
  status: string
  quantity: number
  unit_cost: number
  total_cost: number
  order_placed_date: string
  order_delivery_date: string
}

type StatusTab = "needs_review" | "approved" | "open" | "delivered"

const STATUS_LABELS: Record<StatusTab, string> = {
  needs_review: "Needs Review",
  approved: "Approved",
  open: "Open",
  delivered: "Delivered",
}

const STATUS_ORDER: StatusTab[] = ["needs_review", "approved", "open", "delivered"]

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    background: ${theme.colors.background};
  `,
  statusBar: css`
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid ${theme.colors.border};
  `,
  statusBtn: (isActive: boolean) => css`
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid ${isActive ? theme.colors.blue600 : theme.colors.border};
    background: ${isActive ? theme.colors.blue600 + "10" : "transparent"};
    color: ${isActive ? theme.colors.blue600 : theme.colors.mutedForeground};
    font-size: 0.8125rem;
    font-weight: ${isActive ? "600" : "400"};
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      border-color: ${theme.colors.blue600};
    }
  `,
  count: css`
    margin-left: 0.375rem;
    font-weight: 700;
  `,
  filterBar: css`
    display: flex;
    gap: 0.75rem;
    padding: 0.5rem 1.5rem;
    border-bottom: 1px solid ${theme.colors.border};
    align-items: center;
    flex-wrap: wrap;
  `,
  filterLabel: css`
    font-size: 0.75rem;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  `,
  filterSelect: css`
    padding: 0.375rem 0.75rem;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    background: ${theme.colors.background};
    color: ${theme.colors.foreground};
    min-width: 140px;
    &:focus {
      outline: none;
      border-color: ${theme.colors.blue600};
    }
  `,
  tableWrap: css`
    flex: 1;
    overflow: auto;
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  `,
  th: css`
    position: sticky;
    top: 0;
    z-index: 2;
    background: ${theme.colors.muted};
    padding: 0.625rem 0.75rem;
    text-align: left;
    font-weight: 600;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${theme.colors.border};
    white-space: nowrap;
  `,
  thRight: css`
    text-align: right;
  `,
  td: css`
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid ${theme.colors.border}40;
    white-space: nowrap;
    color: ${theme.colors.foreground};
  `,
  tdRight: css`
    text-align: right;
    font-variant-numeric: tabular-nums;
  `,
  tdCost: css`
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: ${theme.colors.mutedForeground};
  `,
  checkbox: css`
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: ${theme.colors.blue600};
  `,
  approveBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${theme.colors.green500};
    background: ${theme.colors.green50};
    color: ${theme.colors.green700};
    font-size: 0.75rem;
    cursor: pointer;
    font-weight: 500;
    &:hover {
      background: ${theme.colors.green100};
    }
  `,
  statusBadge: (status: string) => {
    const colors: Record<string, { bg: string; fg: string }> = {
      needs_review: { bg: theme.colors.orange100, fg: theme.colors.orange600 },
      approved: { bg: theme.colors.green100, fg: theme.colors.green700 },
      open: { bg: theme.colors.blue600 + "15", fg: theme.colors.blue600 },
      delivered: { bg: theme.colors.gray100 ?? "#f3f4f6", fg: theme.colors.mutedForeground },
    }
    const c = colors[status] ?? { bg: "#f3f4f6", fg: "#666" }
    return css`
      display: inline-block;
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
      font-size: 0.6875rem;
      font-weight: 600;
      background: ${c.bg};
      color: ${c.fg};
      text-transform: uppercase;
      letter-spacing: 0.03em;
    `
  },
  emptyState: css`
    padding: 3rem;
    text-align: center;
    color: ${theme.colors.mutedForeground};
    font-size: 0.875rem;
  `,
}

// ─── Component ────────────────────────────────────────────────────────────────

export const POInboxView = () => {
  const allRecords = useMemo(() => rawData as PORecord[], [])
  const [activeTab, setActiveTab] = useState<StatusTab>("needs_review")
  const [approvedSet, setApprovedSet] = useState<Set<string>>(new Set())
  const [filterSku, setFilterSku] = useState("")
  const [filterSupplier, setFilterSupplier] = useState("")
  const [filterLocation, setFilterLocation] = useState("")

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { needs_review: 0, approved: 0, open: 0, delivered: 0 }
    for (const r of allRecords) {
      if (counts[r.status] !== undefined) counts[r.status]++
    }
    // Add approved ones from our local state
    counts.approved += approvedSet.size
    counts.needs_review -= approvedSet.size
    return counts
  }, [allRecords, approvedSet])

  // Filter options
  const skuOptions = useMemo(() => [...new Set(allRecords.map(r => r.sku))].sort(), [allRecords])
  const supplierOptions = useMemo(() => [...new Set(allRecords.map(r => r.supplier))].sort(), [allRecords])
  const locationOptions = useMemo(() => [...new Set(allRecords.map(r => r.location))].sort(), [allRecords])

  // Filtered data
  const filteredRecords = useMemo(() => {
    return allRecords.filter(r => {
      // Status filter (account for local approval state)
      const effectiveStatus = approvedSet.has(r.purchase_order_id) ? "approved" : r.status
      if (effectiveStatus !== activeTab) return false
      if (filterSku && r.sku !== filterSku) return false
      if (filterSupplier && r.supplier !== filterSupplier) return false
      if (filterLocation && r.location !== filterLocation) return false
      return true
    })
  }, [allRecords, activeTab, filterSku, filterSupplier, filterLocation, approvedSet])

  const handleApprove = useCallback((poId: string) => {
    setApprovedSet(prev => {
      const next = new Set(prev)
      if (next.has(poId)) {
        next.delete(poId)
      } else {
        next.add(poId)
      }
      return next
    })
  }, [])

  const formatCurrency = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div css={s.page}>
      <PageHeader
        title="Purchase Order Inbox"
        description=""
        actions={
          <Button variant="tertiary" size="sm">
            <Download size={14} />
            Export
          </Button>
        }
      />

      {/* Status tabs */}
      <div css={s.statusBar}>
        {STATUS_ORDER.map(st => (
          <button
            key={st}
            css={s.statusBtn(activeTab === st)}
            onClick={() => setActiveTab(st)}
          >
            {STATUS_LABELS[st]}
            <span css={s.count}>{statusCounts[st]}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div css={s.filterBar}>
        <span css={s.filterLabel}>Filters</span>
        <select css={s.filterSelect} value={filterSku} onChange={e => setFilterSku(e.target.value)}>
          <option value="">All SKUs</option>
          {skuOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select css={s.filterSelect} value={filterSupplier} onChange={e => setFilterSupplier(e.target.value)}>
          <option value="">All Suppliers</option>
          {supplierOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select css={s.filterSelect} value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
          <option value="">All Locations</option>
          {locationOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div css={s.tableWrap}>
        {filteredRecords.length === 0 ? (
          <div css={s.emptyState}>No purchase orders match the current filters.</div>
        ) : (
          <table css={s.table}>
            <thead>
              <tr>
                {activeTab === "needs_review" && <th css={s.th}>Approve</th>}
                <th css={s.th}>PO ID</th>
                <th css={s.th}>SKU</th>
                <th css={s.th}>SKU Name</th>
                <th css={s.th}>Supplier</th>
                <th css={s.th}>Location</th>
                <th css={[s.th, s.thRight]}>Quantity</th>
                <th css={[s.th, s.thRight]}>Unit Cost</th>
                <th css={[s.th, s.thRight]}>Total Cost</th>
                <th css={s.th}>PO Date</th>
                <th css={s.th}>ETA</th>
                <th css={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const isLocallyApproved = approvedSet.has(r.purchase_order_id)
                return (
                  <tr
                    key={r.purchase_order_id}
                    css={css`
                      &:hover { background: ${theme.colors.gray50}; }
                      ${isLocallyApproved ? `background: ${theme.colors.green50};` : ""}
                    `}
                  >
                    {activeTab === "needs_review" && (
                      <td css={s.td}>
                        <button css={s.approveBtn} onClick={() => handleApprove(r.purchase_order_id)}>
                          <Check size={12} />
                          Approve
                        </button>
                      </td>
                    )}
                    <td css={css`${s.td}; font-weight: 600; color: ${theme.colors.blue600};`}>{r.purchase_order_id}</td>
                    <td css={s.td}>{r.sku}</td>
                    <td css={s.td}>{r.sku_name}</td>
                    <td css={s.td}>{r.supplier}</td>
                    <td css={s.td}>{r.location}</td>
                    <td css={css`${s.td}; ${s.tdRight}`}>{r.quantity.toLocaleString()}</td>
                    <td css={css`${s.td}; ${s.tdCost}`}>{formatCurrency(r.unit_cost)}</td>
                    <td css={css`${s.td}; ${s.tdRight}; font-weight: 500;`}>{formatCurrency(r.total_cost)}</td>
                    <td css={s.td}>{r.order_placed_date}</td>
                    <td css={s.td}>{r.order_delivery_date}</td>
                    <td css={s.td}>
                      <span css={s.statusBadge(isLocallyApproved ? "approved" : r.status)}>
                        {isLocallyApproved ? "Approved" : STATUS_LABELS[r.status as StatusTab] ?? r.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
