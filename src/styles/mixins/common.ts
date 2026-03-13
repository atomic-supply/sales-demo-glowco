/**
 * Common Style Mixins
 *
 * Reusable style patterns that can be composed in components.
 * These use theme values and provide consistent styling across the app.
 */

import { css, type Interpolation } from "@emotion/react";
import { theme, type Theme } from "../theme/theme";

/**
 * Card-like container styling
 * Use for cards, panels, and elevated containers
 */
export const cardStyle: Interpolation<Theme> = css`
  background-color: ${theme.colors.card};
  color: ${theme.colors.cardForeground};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.md};
`;

/**
 * Focus ring for accessible focus states
 * Use on interactive elements
 */
export const focusRing: Interpolation<Theme> = css`
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${theme.colors.ring};
  }
`;

/**
 * Hover state for interactive elements
 */
export const hoverable: Interpolation<Theme> = css`
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: ${theme.colors.accent};
    color: ${theme.colors.accentForeground};
  }
`;

/**
 * Disabled state styling
 */
export const disabled: Interpolation<Theme> = css`
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
`;

/**
 * Truncate text with ellipsis
 */
export const truncate: Interpolation<Theme> = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * Multi-line truncate (clamp to 2 lines by default)
 */
export const truncateLines = (lines: number = 2): Interpolation<Theme> => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/**
 * Flexbox centering utility
 */
export const flexCenter: Interpolation<Theme> = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Flexbox space-between utility
 */
export const flexBetween: Interpolation<Theme> = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/**
 * Scrollable container
 */
export const scrollable: Interpolation<Theme> = css`
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;
  }
`;

/**
 * Border utilities - common border patterns
 * Uses gray200 as the standard border color (1px)
 */
export const borders = {
  // Full borders
  standard: css`
    border: 1px solid ${theme.colors.gray200};
  `,

  // Top borders
  top: css`
    border-top: 1px solid ${theme.colors.gray200};
  `,

  // Right borders
  right: css`
    border-right: 1px solid ${theme.colors.gray200};
  `,

  // Bottom borders
  bottom: css`
    border-bottom: 1px solid ${theme.colors.gray200};
  `,

  // Left borders
  left: css`
    border-left: 1px solid ${theme.colors.gray200};
  `,
};

/**
 * Border styling - uses gray200 as the standard border color
 * Alias for borders.standard
 */
export const border = borders.standard;

/**
 * Border radius utilities
 */
export const rounded = {
  sm: css`
    border-radius: ${theme.borderRadius.sm};
  `,
  md: css`
    border-radius: ${theme.borderRadius.md};
  `,
  lg: css`
    border-radius: ${theme.borderRadius.lg};
  `,
  xl: css`
    border-radius: ${theme.borderRadius.xl};
  `,
  full: css`
    border-radius: 9999px;
  `,
};

/**
 * Spacing utilities (padding)
 */
export const padding = {
  xs: css`
    padding: ${theme.spacing.xs};
  `,
  sm: css`
    padding: ${theme.spacing.sm};
  `,
  md: css`
    padding: ${theme.spacing.md};
  `,
  lg: css`
    padding: ${theme.spacing.lg};
  `,
  xl: css`
    padding: ${theme.spacing.xl};
  `,
  "2xl": css`
    padding: ${theme.spacing["2xl"]};
  `,
};

/**
 * View controls toolbar — shared styles for the composable controls bar
 * used across table views (segment by, aggregate by, filter by, etc.)
 */
export const viewControlsBar = {
  /** Outer row: flex-wrap row, padding 8px, bottom-border-less (Paper-like) */
  container: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    padding: 0.5rem 0.75rem 0;
    flex-shrink: 0;
    border-bottom: 1px solid ${theme.colors.gray200};
  `,
  /** Each widget is a column: label on top, control below */
  widget: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
  `,
  /** Row group for inline items (e.g. chips + arrow inside a widget) */
  row: css`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  `,
  /** 11px label above each control — matches MUI fontSize: 11, tight to control */
  label: css`
    font-size: 11px;
    line-height: 1;
    min-height: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 2px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  /** MUI variant="standard" underline — tight padding, 1px border */
  underline: css`
    position: relative;
    display: flex;
    align-items: center;
    min-width: 80px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    padding: 0 0 2px;
    &:hover {
      border-bottom: 2px solid rgba(0, 0, 0, 0.87);
      padding-bottom: 1px;
    }
  `,
  /** MinimalButton — 25x25 circle, bg action.selected */
  addBtn: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.08);
    cursor: pointer;
    color: rgba(0, 0, 0, 0.87);
    flex-shrink: 0;
    outline: none;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    &:focus, &:focus-visible {
      outline: none;
      box-shadow: none;
    }
    &:disabled {
      color: rgba(0, 0, 0, 0.26);
      cursor: default;
    }
  `,
  dateInput: css`
    font-size: 0.75rem;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.42);
    border-radius: 0;
    padding: 0 0 2px;
    background: transparent;
    color: ${theme.colors.foreground};
    outline: none;
    width: 6.5rem;
    &:hover {
      border-bottom: 2px solid rgba(0, 0, 0, 0.87);
      padding-bottom: 1px;
    }
    &:focus {
      border-bottom: 2px solid ${theme.colors.foreground};
      padding-bottom: 1px;
    }
  `,
};

/**
 * Filter badge pill and dismiss button
 */
export const filterBadge = {
  pill: css`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.0625rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.8125rem;
    height: 1.5rem;
    background: rgba(0, 0, 0, 0.08);
    border: none;
    color: ${theme.colors.foreground};
  `,
  dismiss: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin-left: 0.125rem;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.26);
    border-radius: 9999px;
    &:hover {
      color: rgba(0, 0, 0, 0.4);
    }
  `,
};

/**
 * Tab bar — shared styles for underline-style tabs.
 * Uses margin-bottom: -1px so the active indicator overlaps the container border.
 */
export const tabBar = {
  container: css`
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid ${theme.colors.border};
    padding: 0 0.75rem;
    flex-shrink: 0;
  `,
  tab: (active: boolean) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 0.625rem 0.75rem;
    margin-bottom: -1px;
    font-size: 0.8125rem;
    font-weight: ${active ? 600 : 500};
    color: ${active ? theme.colors.foreground : theme.colors.mutedForeground};
    background: transparent;
    border: none;
    border-bottom: 2px solid ${active ? theme.colors.foreground : "transparent"};
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;

    &:hover {
      color: ${theme.colors.foreground};
      ${!active ? `border-bottom-color: ${theme.colors.gray400};` : ""}
    }
  `,
};

/**
 * Spacing utilities (margin)
 */
export const margin = {
  xs: css`
    margin: ${theme.spacing.xs};
  `,
  sm: css`
    margin: ${theme.spacing.sm};
  `,
  md: css`
    margin: ${theme.spacing.md};
  `,
  lg: css`
    margin: ${theme.spacing.lg};
  `,
  xl: css`
    margin: ${theme.spacing.xl};
  `,
  "2xl": css`
    margin: ${theme.spacing["2xl"]};
  `,
};
