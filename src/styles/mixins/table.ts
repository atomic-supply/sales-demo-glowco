/**
 * Shared Table Style Tokens
 *
 * Canonical styles for all data tables in the app.
 * Import from here to ensure visual consistency across views.
 */

import { css } from "@emotion/react"
import { theme, alpha } from "../theme/theme"

export const tableStyles = {
  /** Wrapper: fill remaining space, clip overflow for Virtuoso */
  wrap: css`
    flex: 1;
    overflow: hidden;
    min-height: 0;
  `,

  /** The <table> element */
  table: css`
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  `,

  /** <thead> — sticky with opaque background so content doesn't bleed through */
  thead: css`
    background: ${theme.colors.muted};
    position: sticky;
    top: 0;
    z-index: 1;
  `,

  /** Standard header cell (<th>) */
  th: css`
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${theme.colors.mutedForeground};
    border-bottom: 1px solid ${theme.colors.border};
    white-space: nowrap;
  `,

  /** Standard body cell (<td>) */
  td: css`
    padding: 0.5rem 0.75rem;
    color: ${theme.colors.foreground};
    white-space: nowrap;
  `,

  /** Standard table row */
  tr: css`
    border-bottom: 1px solid ${theme.colors.border};
    transition: background-color 0.1s;
    &:hover { background: ${alpha(theme.colors.muted, 0.3)}; }
  `,

  // ── Modifier classes ──────────────────────────────────────────────────────

  /** Right-align a cell */
  right: css`text-align: right;`,

  /** Center-align a cell */
  center: css`text-align: center;`,

  /** Muted text color */
  muted: css`color: ${theme.colors.mutedForeground};`,

  /** Tabular (monospaced) numbers */
  numeric: css`font-variant-numeric: tabular-nums;`,

  /** Sticky left column (frozen) — opaque so scrolled content doesn't show through */
  stickyCol: css`
    position: sticky;
    left: 0;
    z-index: 1;
    background: ${theme.colors.background};
  `,

  /** Sticky left column inside <thead> — matches the thead background */
  stickyColHead: css`
    position: sticky;
    left: 0;
    z-index: 2;
    background: ${theme.colors.muted};
  `,

  /** Total/summary column header (foreground, bolder) */
  thTotal: css`
    color: ${theme.colors.foreground};
    font-weight: 700;
  `,

  /** Minimum width for date/value columns */
  colMin: css`min-width: 5rem;`,
}
