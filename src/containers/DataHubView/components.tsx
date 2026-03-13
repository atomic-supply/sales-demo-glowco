/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import React from "react"
import { theme } from "../../styles/theme/theme"
import { Database, FileText, Settings, Table2 } from "lucide-react"
import type { StaticDataType } from "../../data/data-hub-data"

export function OutlineBadge({ children, color = theme.colors.mutedForeground }: { children: React.ReactNode; color?: string }) {
  return (
    <span css={css`
      display: inline-flex; align-items: center; padding: 0.0625rem 0.375rem;
      border-radius: 9999px; font-size: 0.6875rem; font-weight: 500;
      background: transparent; color: ${color}; border: 1px solid ${theme.colors.border};
      white-space: nowrap; width: fit-content;
    `}>{children}</span>
  )
}

export function StaticTypeIcon({ type }: { type: StaticDataType }) {
  const sz = 14
  switch (type) {
    case "Mapping": return <Table2 size={sz} />
    case "Rules": return <Settings size={sz} />
    case "Master Data": return <Database size={sz} />
    case "Config": return <FileText size={sz} />
  }
}
