export const theme = {
  colors: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    primaryForeground: "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    secondaryForeground: "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    accentForeground: "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    destructiveForeground: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    chart1: "oklch(0.646 0.222 41.116)",
    chart2: "oklch(0.6 0.118 184.704)",
    chart3: "oklch(0.398 0.07 227.392)",
    chart4: "oklch(0.828 0.189 84.429)",
    chart5: "oklch(0.769 0.188 70.08)",
    sidebar: "oklch(0.985 0 0)",
    sidebarForeground: "oklch(0.145 0 0)",
    sidebarPrimary: "oklch(0.205 0 0)",
    sidebarPrimaryForeground: "oklch(0.985 0 0)",
    sidebarAccent: "oklch(0.97 0 0)",
    sidebarAccentForeground: "oklch(0.205 0 0)",
    sidebarBorder: "oklch(0.922 0 0)",
    sidebarRing: "oklch(0.708 0 0)",
    nucleus: "oklch(0.588 0.185 254.128)",
    // Additional colors for UI
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    gray900: "#111827",
    midGrey: "#6b7280", // Mid grey for action buttons
    blue50: "#eff6ff",
    blue100: "#dbeafe",
    blue500: "#3b82f6",
    blue600: "#2563eb",
    blue700: "#1d4ed8",
    blue800: "#1e40af",
    red50: "#fef2f2", // Light red background
    red600: "#dc2626",
    red700: "#991b1b", // Dark red text
    orange50: "#fff7ed",
    orange100: "#ffedd5",
    orange200: "#fed7aa",
    orange500: "#f97316",
    orange600: "#ea580c",
    yellow100: "#fef3c7", // Light yellow background
    yellow600: "#ca8a04", // Yellow/orange for warnings
    green50: "#f0fdf4",
    green100: "#dcfce7", // Darker green background
    green200: "#ecfdf5", // Lighter green background
    green500: "#16a34a",
    green600: "#15803d", // Medium green text
    green700: "#166534", // Dark green text
    white: "#ffffff",
    // Status colors - centralized for consistent use across the app
    status: {
      error: "#dc2626", // Red for errors/negative values
      warning: "#ca8a04", // Yellow/orange for warnings
      success: "#16a34a", // Green for success/healthy
    },
    // Item status colors for purchase orders and items
    itemStatus: {
      sent: "#10b981", // Green for sent items
      skipped: "#9ca3af", // Grey for skipped items
      needsReview: "#eab308", // Yellow for items needing review
    },
  },
  borderRadius: {
    sm: "calc(0.625rem - 4px)",
    md: "calc(0.625rem - 2px)",
    lg: "0.625rem",
    xl: "calc(0.625rem + 4px)",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  layout: {
    sidebarWidth: "5rem",
    headerHeight: "auto",
  },
  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  },
  typography: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

export type Theme = typeof theme;

/**
 * Apply alpha to any oklch color string from the theme.
 * e.g. alpha(theme.colors.muted, 0.5) → "oklch(0.97 0 0 / 0.5)"
 */
export const alpha = (color: string, opacity: number): string =>
  color.replace(")", ` / ${opacity})`);
