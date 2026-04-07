/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC } from "react"
import { useNavigate } from "react-router"
import { ArrowRight, Check, Clock, Circle } from "lucide-react"
import { MODULES, type ModuleId } from "../data/app-config"
import { getAlertCounts } from "../data/glowco-inbox-data"
import { theme } from "../styles/theme/theme"

interface ModuleStatus {
  moduleId: ModuleId
  status: "published" | "in_review" | "pending" | "draft"
  lastRun: string
  metric: string
  alertCount: number
}

const moduleStatuses: ModuleStatus[] = [
  { moduleId: "consumption", status: "published", lastRun: "Apr 4, 2026 8:15 AM", metric: "Total demand: 22.4M sticks", alertCount: getAlertCounts("consumption") },
  { moduleId: "shipments", status: "published", lastRun: "Apr 4, 2026 8:22 AM", metric: "1,847 shipment lines", alertCount: getAlertCounts("shipments") },
  { moduleId: "production", status: "in_review", lastRun: "Apr 4, 2026 9:01 AM", metric: "18.2M sticks planned", alertCount: getAlertCounts("production") },
  { moduleId: "kitting", status: "pending", lastRun: "Apr 3, 2026 3:45 PM", metric: "842K units to kit", alertCount: getAlertCounts("kitting") },
  { moduleId: "mrp", status: "pending", lastRun: "Apr 3, 2026 3:52 PM", metric: "12 POs pending", alertCount: getAlertCounts("mrp") },
  { moduleId: "allocation", status: "pending", lastRun: "Apr 3, 2026 4:10 PM", metric: "5 locations balanced", alertCount: getAlertCounts("allocation") },
]

const statusConfig = {
  published: { label: "Published", color: "#22C55E", icon: Check, bg: "#F0FDF4" },
  in_review: { label: "In Review", color: "#F59E0B", icon: Clock, bg: "#FFFBEB" },
  pending: { label: "Pending", color: "#94A3B8", icon: Circle, bg: "#F8FAFC" },
  draft: { label: "Draft", color: "#64748B", icon: Circle, bg: "#F1F5F9" },
}

const s = {
  container: css`
    padding: 1.5rem 2rem;
    max-width: 1200px;
  `,
  title: css`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${theme.colors.foreground};
    margin-bottom: 0.25rem;
  `,
  subtitle: css`
    font-size: 0.8125rem;
    color: ${theme.colors.mutedForeground};
    margin-bottom: 1.5rem;
  `,
  pipeline: css`
    display: flex;
    align-items: stretch;
    gap: 0;
    margin-bottom: 2rem;
  `,
  arrow: css`
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
    color: ${theme.colors.mutedForeground};
    opacity: 0.4;
  `,
  card: (color: string, bg: string) => css`
    flex: 1;
    background: ${bg};
    border: 1px solid ${color}22;
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.15s;
    &:hover {
      border-color: ${color}66;
      box-shadow: 0 2px 8px ${color}18;
    }
  `,
  cardHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  `,
  moduleName: css`
    font-size: 0.8125rem;
    font-weight: 600;
    color: ${theme.colors.foreground};
  `,
  statusBadge: (color: string) => css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    font-weight: 500;
    color: ${color};
    background: ${color}15;
    padding: 0.125rem 0.5rem;
    border-radius: 1rem;
  `,
  lastRun: css`
    font-size: 0.6875rem;
    color: ${theme.colors.mutedForeground};
    margin-bottom: 0.375rem;
  `,
  metric: css`
    font-size: 0.75rem;
    color: ${theme.colors.foreground};
    font-weight: 500;
  `,
  alertBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    font-weight: 500;
    color: #F59E0B;
    margin-top: 0.375rem;
  `,
  summaryGrid: css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  `,
  summaryCard: css`
    background: ${theme.colors.background};
    border: 1px solid #E2E8F0;
    border-radius: 0.5rem;
    padding: 1rem;
  `,
  summaryLabel: css`
    font-size: 0.6875rem;
    color: ${theme.colors.mutedForeground};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  `,
  summaryValue: css`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${theme.colors.foreground};
  `,
  summaryDetail: css`
    font-size: 0.75rem;
    color: ${theme.colors.mutedForeground};
    margin-top: 0.25rem;
  `,
}

export const PlanStatusView: FC = () => {
  const navigate = useNavigate()

  return (
    <div css={s.container}>
      <div css={s.title}>Plan Status</div>
      <div css={s.subtitle}>
        GlowCo Planning Pipeline &mdash; Run #247 &middot; April 4, 2026
      </div>

      <div css={s.pipeline}>
        {moduleStatuses.map((ms, idx) => {
          const mod = MODULES.find(m => m.id === ms.moduleId)!
          const sc = statusConfig[ms.status]
          const StatusIcon = sc.icon
          return (
            <div key={ms.moduleId} css={css`display: flex; align-items: stretch;`}>
              {idx > 0 && (
                <div css={s.arrow}>
                  <ArrowRight size={14} />
                </div>
              )}
              <div
                css={s.card(sc.color, sc.bg)}
                onClick={() => navigate(`/plan/${ms.moduleId}`)}
              >
                <div css={s.cardHeader}>
                  <div css={s.moduleName}>{mod.shortName}</div>
                  <span css={s.statusBadge(sc.color)}>
                    <StatusIcon size={10} />
                    {sc.label}
                  </span>
                </div>
                <div css={s.lastRun}>{ms.lastRun}</div>
                <div css={s.metric}>{ms.metric}</div>
                {ms.alertCount > 0 && (
                  <div css={s.alertBadge}>
                    {ms.alertCount} alert{ms.alertCount > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div css={s.summaryGrid}>
        <div css={s.summaryCard}>
          <div css={s.summaryLabel}>Total Inventory</div>
          <div css={s.summaryValue}>$87.2M</div>
          <div css={s.summaryDetail}>16.4 weeks of cover</div>
        </div>
        <div css={s.summaryCard}>
          <div css={s.summaryLabel}>Target Inventory</div>
          <div css={s.summaryValue}>$45M</div>
          <div css={s.summaryDetail}>8-10 weeks of cover</div>
        </div>
        <div css={s.summaryCard}>
          <div css={s.summaryLabel}>Excess Working Capital</div>
          <div css={s.summaryValue}>~$42M</div>
          <div css={s.summaryDetail}>Opportunity identified across 4 levers</div>
        </div>
      </div>
    </div>
  )
}
