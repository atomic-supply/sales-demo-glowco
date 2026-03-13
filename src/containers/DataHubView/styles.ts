import { css } from "@emotion/react"
import { theme, alpha } from "../../styles/theme/theme"

export const chevronStyle = css`color:${theme.colors.mutedForeground};flex-shrink:0;`

export const expandCollapseBtn = css`
  margin-left:auto;display:flex;align-items:center;gap:0.375rem;
  padding:0.25rem 0.625rem;border-radius:0.375rem;border:none;
  background:transparent;cursor:pointer;font-size:0.75rem;
  color:${theme.colors.mutedForeground};transition:all 0.15s;
  &:hover{color:${theme.colors.foreground};background:${theme.colors.gray100};}
`

export const actionBtnSize = css`width:1.75rem;height:1.75rem;`

export const spinAnimation = css`animation:spin 1s linear infinite;@keyframes spin{to{transform:rotate(360deg);}}`

export const issueChevron = css`position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:${theme.colors.foreground};`

export const s = {
  root: css`display:flex;height:100%;flex-direction:column;background:${theme.colors.background};overflow:hidden;`,
  shadcnTab: css`
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: 0.625rem 0.75rem;
    margin-bottom: -1px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${theme.colors.mutedForeground};
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    &:hover { color: ${theme.colors.foreground}; border-bottom-color: ${theme.colors.gray400}; }
    &:focus-visible { box-shadow: none; outline: none; border-color: transparent; border-bottom-color: ${theme.colors.foreground}; }
    &[data-state="active"] {
      font-weight: 600;
      color: ${theme.colors.foreground};
      border-bottom-color: ${theme.colors.foreground};
      background: transparent;
      box-shadow: none;
    }
  `,
  statusBtn: (active: boolean, dotColor: string) => css`
    display:flex;align-items:center;gap:0.375rem;padding:0.25rem 0.75rem;
    border-radius:9999px;cursor:pointer;
    font-size:0.75rem;font-weight:500;
    border:1px solid ${active ? dotColor : theme.colors.border};
    background:${active ? dotColor + "14" : theme.colors.background};
    color:${active ? dotColor : theme.colors.mutedForeground};
    transition:all 0.15s;
    &:hover{border-color:${dotColor};color:${dotColor};}
  `,
  statusDot: (color: string) => css`
    width:0.875rem;height:0.875rem;
    border-radius:9999px;background:${color};flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    font-size:0.5rem;font-weight:700;color:${theme.colors.white};
  `,
  statusCount: css`font-size:0.875rem;font-weight:600;`,
  statusLabel: css`font-size:0.875rem;color:${theme.colors.mutedForeground};`,
  tabsWrap: css`flex:1;overflow:hidden;display:flex;flex-direction:column;`,
  section: css`display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;`,
  sectionHeader: css`display:flex;align-items:center;gap:0.75rem;`,
  sectionTitle: css`font-size:1.0625rem;font-weight:600;margin:0;`,
  badge: css`
    display:inline-flex;align-items:center;padding:0.125rem 0.5rem;
    border-radius:9999px;font-size:0.6875rem;font-weight:500;
    background:${theme.colors.muted};color:${theme.colors.mutedForeground};border:1px solid ${theme.colors.border};
  `,
  groupCard: css`border:1px solid ${theme.colors.border};border-radius:0.5rem;overflow:hidden;`,
  groupHeader: css`
    display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;
    background:${theme.colors.gray200};text-align:left;width:100%;border:none;cursor:pointer;
  `,
  groupName: css`font-weight:600;font-size:0.875rem;`,
  groupMeta: css`font-size:0.75rem;color:${theme.colors.mutedForeground};`,
  groupRight: css`margin-left:auto;display:flex;align-items:center;gap:0.75rem;`,
  colHeaders: css`
    display:grid;grid-template-columns:1.5rem 1fr minmax(100px,1.2fr) 110px 110px 70px 150px 80px 3.5rem;
    gap:0.75rem;padding:0.5rem 1rem 0.5rem 3rem;
    background:${theme.colors.gray100};border-bottom:1px solid ${theme.colors.border};
    font-size:0.75rem;font-weight:500;color:${theme.colors.mutedForeground};
  `,
  sourceRow: css`
    position:relative;
    display:grid;grid-template-columns:1.5rem 1fr minmax(100px,1.2fr) 110px 110px 70px 150px 80px 3.5rem;
    gap:0.75rem;align-items:center;padding:0.75rem 1rem 0.75rem 3rem;
    border-bottom:1px solid ${theme.colors.border};
    background:transparent;
    &:hover{background:${theme.colors.muted};}
    transition:background 0.1s;
  `,
  sourceName: css`font-size:0.875rem;font-weight:500;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`,
  sourceMeta: css`font-size:0.75rem;color:${theme.colors.mutedForeground};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`,
  recordCount: css`font-size:0.75rem;color:${theme.colors.mutedForeground};`,
  actionBtns: css`display:flex;align-items:center;gap:0.25rem;`,
  issuePanel: css`
    background:${alpha(theme.colors.red50, 0.6)};border-top:1px solid ${theme.colors.red50};
    padding:0.75rem 1rem 0.75rem 4rem;
  `,
  issuePanelTitle: css`display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;font-weight:600;color:${theme.colors.status.error};margin-bottom:0.5rem;`,
  issueItem: css`
    border:1px solid ${theme.colors.red50};border-radius:0.375rem;background:${theme.colors.background};
    padding:0.5rem 0.75rem;margin-bottom:0.5rem;&:last-child{margin-bottom:0;}
  `,
  issueItemRow: css`display:flex;align-items:flex-start;gap:0.5rem;`,
  issueDot: css`
    width:0.5rem;height:0.5rem;border-radius:9999px;flex-shrink:0;margin-top:0.25rem;
    background:${theme.colors.status.error};
  `,
  issueDesc: css`font-size:0.75rem;font-weight:500;`,
  issueExample: css`font-size:0.75rem;color:${theme.colors.mutedForeground};font-family:monospace;background:${theme.colors.muted};border-radius:0.25rem;padding:0.125rem 0.5rem;margin-top:0.25rem;`,
  issueAffected: css`font-size:0.75rem;color:${theme.colors.mutedForeground};margin-top:0.25rem;`,
  staticGroupHeader: css`
    display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;
    background:${theme.colors.gray200};text-align:left;width:100%;border:none;cursor:pointer;
  `,
  staticColHeaders: css`
    display:grid;
    grid-template-columns:1.5rem 1fr minmax(100px,1.2fr) 80px 100px 100px 70px 120px 80px 3.5rem;
    gap:0.75rem;padding:0.5rem 1rem 0.5rem 3rem;
    background:${theme.colors.gray100};border-bottom:1px solid ${theme.colors.border};
    font-size:0.75rem;font-weight:500;color:${theme.colors.mutedForeground};
  `,
  staticRow: css`
    display:grid;
    grid-template-columns:1.5rem 1fr minmax(100px,1.2fr) 80px 100px 100px 70px 120px 80px 3.5rem;
    gap:0.75rem;align-items:center;padding:0.75rem 1rem 0.75rem 3rem;
    border-bottom:1px solid ${theme.colors.border};
    &:hover{background:${theme.colors.muted};}transition:background 0.1s;
  `,
  exportCard: css`border:1px solid ${theme.colors.border};border-radius:0.5rem;overflow:hidden;margin-bottom:1rem;`,
  exportCatHeader: css`background:${theme.colors.gray100};padding:0.75rem 1rem;font-weight:600;font-size:0.875rem;`,
  exportRow: css`
    display:flex;align-items:center;gap:1rem;padding:0.75rem 1rem;
    border-bottom:1px solid ${theme.colors.border};&:last-child{border-bottom:none;}
    &:hover{background:${theme.colors.muted};}
  `,
  exportName: css`font-size:0.875rem;font-weight:500;flex:1;`,
  exportCount: css`font-size:0.75rem;color:${theme.colors.mutedForeground};margin-left:0.5rem;`,
  syncRow: css`display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:${theme.colors.mutedForeground};`,
  clearBtn: css`
    display:flex;align-items:center;gap:0.25rem;padding:0.25rem 0.5rem;
    border-radius:9999px;border:1px solid ${theme.colors.border};
    background:${theme.colors.muted};cursor:pointer;font-size:0.75rem;
    color:${theme.colors.mutedForeground};
    &:hover{color:${theme.colors.foreground};}
  `,
}
