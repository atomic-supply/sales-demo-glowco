/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useState } from "react"
import { theme } from "../../styles/theme/theme"
import { tabBar } from "../../styles/mixins/common"
import {
  ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown,
  RefreshCw, Eye, Database, Loader2, CheckCircle2, Clock,
  FileText, X, AlertTriangle, Download,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  type HealthStatus,
  dynamicDataSourceGroups,
  staticDataGroups,
  availableExports,
} from "../../data/data-hub-data"
import { PageHeader } from "../../layouts/DashboardLayout/PageHeader"
import { statusDotColor, getGroupStatus, getGroupLastUpdate } from "./utils"
import { OutlineBadge, StaticTypeIcon } from "./components"
import {
  s, chevronStyle, expandCollapseBtn, actionBtnSize,
  spinAnimation, issueChevron,
} from "./styles"

export const DataHubView = () => {
  const [expandedDynamic, setExpandedDynamic] = useState<Set<string>>(new Set(dynamicDataSourceGroups.map((g) => g.id)))
  const [expandedStatic, setExpandedStatic] = useState<Set<string>>(new Set(staticDataGroups.map((g) => g.id)))
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  const [exportingCSV, setExportingCSV] = useState<string | null>(null)
  const [exportedCSV, setExportedCSV] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<HealthStatus | null>(null)
  const [bulkExporting, setBulkExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("sources")

  const toggle = (set: Set<string>, setFn: (s: Set<string>) => void, id: string) => {
    const next = new Set(set)
    next.has(id) ? next.delete(id) : next.add(id)
    setFn(next)
  }

  const handleCSVExport = async (tableId: string, tableName: string) => {
    setExportingCSV(tableId)
    await new Promise((r) => setTimeout(r, 1500))
    const link = document.createElement("a")
    link.href = encodeURI(`data:text/csv;charset=utf-8,${tableName} Export\nCol1,Col2\nVal1,Val2`)
    link.download = `${tableId}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setExportingCSV(null)
    setExportedCSV((p) => new Set([...p, tableId]))
  }

  const handleBulkExport = async () => {
    setBulkExporting(true)
    await new Promise((r) => setTimeout(r, 2500))
    setBulkExporting(false)
  }

  const handleSourceDownload = async (sourceId: string, sourceName: string) => {
    setExportingCSV(sourceId)
    await new Promise((r) => setTimeout(r, 1200))
    const link = document.createElement("a")
    link.href = encodeURI(`data:text/csv;charset=utf-8,${sourceName} Export\nCol1,Col2\nVal1,Val2`)
    link.download = `${sourceId}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setExportingCSV(null)
    setExportedCSV((p) => new Set([...p, sourceId]))
  }

  const allDynamic = dynamicDataSourceGroups.flatMap((g) => g.sources)
  const healthyCount = allDynamic.filter((src) => src.status === "healthy").length
  const criticalCount = allDynamic.filter((src) => src.status === "critical").reduce((sum, src) => sum + (src.issues?.length ?? 0), 0)
  const allStatic = staticDataGroups.flatMap((g) => g.sources)
  const totalStaticRecords = allStatic.reduce((sum, src) => sum + parseInt(src.recordCount.replace(/,/g, "")), 0).toLocaleString()

  const downloadIcon = (id: string) =>
    exportingCSV === id
      ? <Loader2 size={13} css={spinAnimation} />
      : exportedCSV.has(id)
        ? <CheckCircle2 size={13} css={css`color:${theme.colors.status.success};`} />
        : <Download size={13} />

  return (
    <div css={s.root}>
      <PageHeader
        title="Data Hub"
        description="Monitor data source health, manage master data, and export planning data"
        actions={
          activeTab === "sources" ? (
            <Button variant="tertiary" size="sm">
              <RefreshCw size={14} /> Refresh All
            </Button>
          ) : undefined
        }
      />

      <div css={s.tabsWrap}>
        <Tabs value={activeTab} onValueChange={setActiveTab} css={css`display:flex;flex-direction:column;flex:1;overflow:hidden;`}>
          <div css={tabBar.container}>
            <TabsList css={css`background:transparent;gap:0;padding:0;height:auto;`}>
              <TabsTrigger value="sources" css={s.shadcnTab}>Data Sources</TabsTrigger>
              <TabsTrigger value="exports" css={s.shadcnTab}>Data Exports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sources" css={css`flex:1;overflow:hidden;display:flex;flex-direction:column;margin:0;`}>
            {/* Status filter bar */}
            <div css={css`display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1.5rem;flex-shrink:0;`}>
              {(["healthy", "critical"] as HealthStatus[]).map((status) => {
                const count = status === "healthy" ? healthyCount : criticalCount
                const color = statusDotColor(status)
                return (
                  <button key={status} css={s.statusBtn(statusFilter === status, color)} onClick={() => setStatusFilter(statusFilter === status ? null : status)}>
                    <div css={s.statusDot(color)} />
                    <span css={s.statusCount}>{count}</span>
                    <span css={s.statusLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </button>
                )
              })}
              {statusFilter && (
                <button css={s.clearBtn} onClick={() => setStatusFilter(null)}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            <div css={css`flex:1;overflow-y:auto;padding:1.5rem;`}>
              <div css={css`max-width:72rem;margin:0 auto;`}>
                {/* ── Dynamic Data Sources ── */}
                <div css={s.section}>
                  <div css={s.sectionHeader}>
                    <h2 css={s.sectionTitle}>Dynamic Data Sources</h2>
                    <span css={s.badge}>{allDynamic.length} sources</span>
                    <button
                      css={expandCollapseBtn}
                      onClick={() => {
                        const allIds = dynamicDataSourceGroups.map((g) => g.id)
                        setExpandedDynamic(allIds.every((id) => expandedDynamic.has(id)) ? new Set() : new Set(allIds))
                      }}
                    >
                      {dynamicDataSourceGroups.every((g) => expandedDynamic.has(g.id))
                        ? <><ChevronsDownUp size={13} /> Collapse All</>
                        : <><ChevronsUpDown size={13} /> Expand All</>}
                    </button>
                  </div>

                  {dynamicDataSourceGroups.map((group) => {
                    const visibleSources = statusFilter ? group.sources.filter((src) => src.status === statusFilter) : group.sources
                    if (statusFilter && visibleSources.length === 0) return null
                    const groupStatus = getGroupStatus(group)
                    const healthyInGroup = group.sources.filter((src) => src.status === "healthy").length
                    const issueCount = group.sources.reduce((sum, src) => sum + (src.issues?.length ?? 0), 0)
                    const isExpanded = expandedDynamic.has(group.id)

                    return (
                      <div key={group.id} css={s.groupCard}>
                        <button css={s.groupHeader} onClick={() => toggle(expandedDynamic, setExpandedDynamic, group.id)}>
                          {isExpanded ? <ChevronDown size={18} css={chevronStyle} /> : <ChevronRight size={18} css={chevronStyle} />}
                          <div css={s.statusDot(statusDotColor(statusFilter ?? groupStatus))}>
                            {statusFilter
                              ? statusFilter === "healthy"
                                ? visibleSources.length
                                : visibleSources.reduce((sum, src) => sum + (src.issues?.length ?? 0), 0)
                              : issueCount > 0 ? issueCount : healthyInGroup}
                          </div>
                          <span css={s.groupName}>{group.name}</span>
                          <span css={s.groupMeta}>{healthyInGroup}/{group.sources.length} sources healthy</span>
                          <div css={s.groupRight}>
                            <span css={s.groupMeta}>Last update: {getGroupLastUpdate(group.sources)}</span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div>
                            <div css={s.colHeaders}>
                              <div css={css`width:0.625rem;`} />
                              <div>Name</div><div>Description</div><div>Original Source</div>
                              <div>Ingestion From</div><div>Method</div><div>File / Last Sync</div>
                              <div>Records</div><div>Actions</div>
                            </div>

                            {visibleSources.map((source) => {
                              const hasIssues = (source.issues?.length ?? 0) > 0
                              const isIssueExpanded = expandedIssues.has(source.id)
                              return (
                                <div key={source.id}>
                                  <div
                                    css={s.sourceRow}
                                    onClick={hasIssues ? () => toggle(expandedIssues, setExpandedIssues, source.id) : undefined}
                                    style={{ cursor: hasIssues ? "pointer" : "default" }}
                                  >
                                    <div css={s.statusDot(statusDotColor(source.status))}>
                                      {source.issues?.length || null}
                                    </div>
                                    {hasIssues && (isIssueExpanded
                                      ? <ChevronDown size={14} css={issueChevron} />
                                      : <ChevronRight size={14} css={issueChevron} />
                                    )}
                                    <span css={s.sourceName} title={source.name}>{source.name}</span>
                                    <span css={s.sourceMeta} title={source.description}>{source.description}</span>
                                    <span css={s.sourceMeta} title={source.originalSource}>{source.originalSource}</span>
                                    <span css={s.sourceMeta} title={source.ingestionLocation}>{source.ingestionLocation}</span>
                                    <OutlineBadge>{source.method}</OutlineBadge>
                                    <div css={css`min-width:0;`}>
                                      {source.uploadedFileName
                                        ? <span css={s.sourceMeta} title={source.uploadedFileName}>{source.uploadedFileName}</span>
                                        : <div css={s.syncRow}><Clock size={13} /><span>{source.lastSync}</span></div>
                                      }
                                    </div>
                                    <span css={s.recordCount}>{source.recordCount || "-"}</span>
                                    <div css={s.actionBtns} onClick={(e) => e.stopPropagation()}>
                                      <Button variant="ghost" size="icon" css={actionBtnSize} title="Download" disabled={exportingCSV === source.id} onClick={() => handleSourceDownload(source.id, source.name)}>
                                        {downloadIcon(source.id)}
                                      </Button>
                                      <Button variant="ghost" size="icon" css={actionBtnSize} title="Preview" onClick={() => {}}>
                                        <Eye size={13} />
                                      </Button>
                                    </div>
                                  </div>

                                  {hasIssues && isIssueExpanded && (
                                    <div css={s.issuePanel}>
                                      <div css={s.issuePanelTitle}>
                                        <AlertTriangle size={13} />
                                        {source.issues!.length} issue{source.issues!.length > 1 ? "s" : ""} detected
                                      </div>
                                      {source.issues!.map((issue) => (
                                        <div key={issue.id} css={s.issueItem}>
                                          <div css={s.issueItemRow}>
                                            <div css={s.issueDot} />
                                            <div css={css`flex:1;min-width:0;`}>
                                              <p css={s.issueDesc}>{issue.description}</p>
                                              {issue.example && <p css={s.issueExample}>{issue.example}</p>}
                                              {issue.affectedRecords && <p css={s.issueAffected}>Affected records: {issue.affectedRecords.toLocaleString()}</p>}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* ── Static Data ── */}
                <div css={s.section}>
                  <div css={s.sectionHeader}>
                    <h2 css={s.sectionTitle}>Static Data</h2>
                    <span css={s.badge}>{allStatic.length} tables</span>
                    <span css={css`font-size:0.75rem;color:${theme.colors.mutedForeground};`}>{totalStaticRecords} total records</span>
                    <button
                      css={expandCollapseBtn}
                      onClick={() => {
                        const allIds = staticDataGroups.map((g) => g.id)
                        setExpandedStatic(allIds.every((id) => expandedStatic.has(id)) ? new Set() : new Set(allIds))
                      }}
                    >
                      {staticDataGroups.every((g) => expandedStatic.has(g.id))
                        ? <><ChevronsDownUp size={13} /> Collapse All</>
                        : <><ChevronsUpDown size={13} /> Expand All</>}
                    </button>
                  </div>

                  {staticDataGroups.map((group) => {
                    const isExpanded = expandedStatic.has(group.id)
                    return (
                      <div key={group.id} css={s.groupCard}>
                        <button css={s.staticGroupHeader} onClick={() => toggle(expandedStatic, setExpandedStatic, group.id)}>
                          {isExpanded ? <ChevronDown size={18} css={chevronStyle} /> : <ChevronRight size={18} css={chevronStyle} />}
                          <FileText size={16} css={css`color:${theme.colors.gray500};flex-shrink:0;`} />
                          <span css={s.groupName}>{group.name}</span>
                          <span css={s.groupMeta}>{group.sources.length} tables</span>
                          <div css={s.groupRight}>
                            <span css={s.groupMeta}>Last update: {getGroupLastUpdate(group.sources)}</span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div>
                            <div css={s.staticColHeaders}>
                              <div css={css`width:0.875rem;`} />
                              <div>Name</div><div>Description</div><div>Type</div><div>Original Source</div>
                              <div>Ingestion From</div><div>Method</div><div>Last Updated</div>
                              <div>Records</div><div>Actions</div>
                            </div>

                            {group.sources.map((source) => (
                              <div key={source.id} css={s.staticRow}>
                                <StaticTypeIcon type={source.type} />
                                <span css={s.sourceName} title={source.name}>{source.name}</span>
                                <span css={s.sourceMeta} title={source.description}>{source.description}</span>
                                <OutlineBadge>{source.type}</OutlineBadge>
                                <span css={s.sourceMeta} title={source.originalSource}>{source.originalSource}</span>
                                <span css={s.sourceMeta} title={source.ingestionLocation}>{source.ingestionLocation}</span>
                                <OutlineBadge>{source.method}</OutlineBadge>
                                <div css={s.syncRow}><Clock size={13} /><span>{source.lastUpdated}</span></div>
                                <span css={s.recordCount}>{source.recordCount}</span>
                                <div css={s.actionBtns}>
                                  <Button variant="ghost" size="icon" css={actionBtnSize} title="Download" disabled={exportingCSV === source.id} onClick={() => handleSourceDownload(source.id, source.name)}>
                                    {downloadIcon(source.id)}
                                  </Button>
                                  <Button variant="ghost" size="icon" css={actionBtnSize} title="Preview" onClick={() => {}}>
                                    <Eye size={13} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Data Exports Tab ── */}
          <TabsContent value="exports" css={css`flex:1;overflow-y:auto;padding:1.5rem;margin:0;`}>
            <div css={css`max-width:48rem;margin:0 auto;`}>
              {availableExports.map((category) => (
                <div key={category.category} css={s.exportCard}>
                  <div css={s.exportCatHeader}>{category.category}</div>
                  {category.tables.map((table) => (
                    <div key={table.id} css={s.exportRow}>
                      <Database size={16} css={css`color:${theme.colors.mutedForeground};flex-shrink:0;`} />
                      <div css={css`flex:1;`}>
                        <span css={s.exportName}>{table.name}</span>
                        <span css={s.exportCount}>{table.recordCount} rows</span>
                      </div>
                      <Button variant="outline" size="sm" css={css`height:2rem;gap:0.375rem;`} disabled={exportingCSV === table.id} onClick={() => handleCSVExport(table.id, table.name)}>
                        {downloadIcon(table.id)}
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
