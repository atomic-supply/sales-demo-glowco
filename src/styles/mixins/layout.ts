/**
 * Layout Mixins
 *
 * Common layout patterns for pages and containers
 */

import { css, type Interpolation } from "@emotion/react";
import { theme, type Theme } from "../theme/theme";

/**
 * Page container - full width with padding
 */
export const pageContainer: Interpolation<Theme> = css`
  width: 100%;
  min-height: 100vh;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
`;

/**
 * Content container - max width with centering
 */
export const contentContainer: Interpolation<Theme> = css`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
`;

/**
 * Dashboard layout container
 */
export const dashboardLayout: Interpolation<Theme> = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/**
 * Flex row layout
 */
export const flexRow: Interpolation<Theme> = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.spacing.md};
`;

/**
 * Flex column layout
 */
export const flexColumn: Interpolation<Theme> = css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

/**
 * Grid layout utility
 */
export const grid = (columns: number, gap: string = "1rem"): Interpolation<Theme> => css`
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap};
`;
