import { theme } from "../../styles/theme/theme"
import type { HealthStatus, DataSource, StaticDataSource, DataSourceGroup } from "../../data/data-hub-data"

export function statusDotColor(status: HealthStatus) {
  return status === "healthy"
    ? theme.colors.status.success
    : theme.colors.status.error
}

export function getGroupStatus(group: DataSourceGroup): HealthStatus {
  if (group.sources.some((s) => s.status === "critical")) return "critical"
  return "healthy"
}

export function getGroupLastUpdate(
  sources: { lastSyncDate?: Date; lastUpdatedDate?: Date; lastSync?: string; lastUpdated?: string }[],
): string {
  const sorted = [...sources].sort((a, b) => {
    const da = a.lastSyncDate || a.lastUpdatedDate || new Date(0)
    const db = b.lastSyncDate || b.lastUpdatedDate || new Date(0)
    return db.getTime() - da.getTime()
  })
  const m = sorted[0]
  return (m as DataSource).lastSync || (m as StaticDataSource).lastUpdated || "Unknown"
}
