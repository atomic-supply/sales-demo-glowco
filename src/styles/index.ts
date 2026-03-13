/**
 * Styles Index
 *
 * Central export point for all styles, utilities, and mixins.
 * Import from here to keep imports clean and organized.
 *
 * Note: Base CSS file (index.css) is imported in src/main.tsx
 */

// Theme
export { theme, type Theme } from "./theme/theme";

// Common mixins
export * from "./mixins/common";
export * from "./mixins/layout";
export * from "./mixins/table";
