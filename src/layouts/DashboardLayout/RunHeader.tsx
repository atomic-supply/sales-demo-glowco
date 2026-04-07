/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC, useState } from "react"
import { Check, ChevronDown, Clock, Atom } from "lucide-react"
import { borders } from "../../styles"
import { theme, alpha } from "../../styles/theme/theme"
import { useNucleus } from "../../contexts/NucleusContext"

interface PlanRun {
  id: string
  label: string
  timestamp: string
  status: "complete" | "running" | "failed"
}

const MOCK_RUNS: PlanRun[] = [
  { id: "run-247", label: "Run #247", timestamp: "Apr 4, 2026 9:01 AM", status: "complete" },
  { id: "run-246", label: "Run #246", timestamp: "Apr 3, 2026 3:45 PM", status: "complete" },
  { id: "run-245", label: "Run #245", timestamp: "Apr 2, 2026 8:30 AM", status: "complete" },
]

const s = {
  header: css`
    flex-shrink: 0;
    z-index: 20;
    background-color: ${theme.colors.background};
    ${borders.bottom}
    padding: 0 ${theme.spacing.md};
    height: ${theme.spacing["2xl"]};
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  left: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
  `,
  orgLabel: css`
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.gray800};
  `,
  separator: css`
    color: ${theme.colors.gray300};
    font-size: ${theme.typography.fontSize.sm};
  `,
  right: css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
  `,
  runSelector: css`
    position: relative;
    display: inline-flex;
  `,
  runBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border: 1px solid ${theme.colors.gray200};
    border-radius: ${theme.borderRadius.md};
    background: ${theme.colors.background};
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.gray700};
    cursor: pointer;
    transition: border-color 0.15s;
    &:hover {
      border-color: ${theme.colors.gray400};
    }
  `,
  statusDot: (color: string) => css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${color};
  `,
  dropdown: css`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.gray200};
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.md};
    min-width: 220px;
    z-index: 50;
    overflow: hidden;
  `,
  dropdownItem: (isActive: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: ${theme.typography.fontSize.xs};
    color: ${isActive ? theme.colors.blue600 : theme.colors.gray700};
    background: ${isActive ? theme.colors.blue50 : "transparent"};
    cursor: pointer;
    border: none;
    width: 100%;
    text-align: left;
    &:hover {
      background: ${isActive ? theme.colors.blue50 : theme.colors.gray50};
    }
  `,
  dropdownMeta: css`
    font-size: 10px;
    color: ${theme.colors.gray400};
    margin-left: auto;
  `,
  updatedAt: css`
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.gray500};
  `,
  nucleusBtn: (active: boolean) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${active ? theme.colors.nucleus : theme.colors.gray200};
    background: ${active ? alpha(theme.colors.nucleus, 0.08) : theme.colors.background};
    cursor: pointer;
    color: ${active ? theme.colors.nucleus : theme.colors.gray500};
    transition: border-color 0.15s, background-color 0.15s, color 0.15s;
    &:hover {
      border-color: ${theme.colors.nucleus};
      color: ${theme.colors.nucleus};
      background: ${alpha(theme.colors.nucleus, 0.05)};
    }
  `,
}

export const RunHeader: FC = () => {
  const [activeRun, setActiveRun] = useState(MOCK_RUNS[0])
  const [open, setOpen] = useState(false)
  const { isOpen: nucleusOpen, toggle: toggleNucleus } = useNucleus()

  return (
    <header css={s.header}>
      <div css={s.left}>
        <span css={s.orgLabel}>GlowCo</span>
        <span css={s.separator}>/</span>
        <span css={s.updatedAt}>{activeRun.label} &mdash; {activeRun.timestamp}</span>
      </div>

      <div css={s.right}>
        <button
          css={s.nucleusBtn(nucleusOpen)}
          onClick={toggleNucleus}
          title={nucleusOpen ? "Close Nucleus" : "Open Nucleus"}
        >
          <Atom size={14} />
        </button>
        <div css={s.runSelector}>
          <button css={s.runBtn} onClick={() => setOpen(!open)}>
            <span css={s.statusDot("#22C55E")} />
            {activeRun.label}
            <ChevronDown size={12} />
          </button>
          {open && (
            <div css={s.dropdown}>
              {MOCK_RUNS.map((run) => {
                const isActive = run.id === activeRun.id
                return (
                  <button
                    key={run.id}
                    css={s.dropdownItem(isActive)}
                    onClick={() => { setActiveRun(run); setOpen(false) }}
                  >
                    {isActive ? <Check size={12} /> : <Clock size={12} />}
                    {run.label}
                    <span css={s.dropdownMeta}>{run.timestamp}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
