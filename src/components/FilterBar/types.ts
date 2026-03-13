/**
 * FilterBar Configuration Types
 *
 * Defines how each view/table configures which filter widgets appear
 * and what options are available in each widget.
 */

export type FilterWidgetType = "multi-select" | "single-select";

export interface FilterWidgetConfig {
  /** Unique key for this filter — used as the key in the values record */
  key: string;
  /** Display label shown on the widget */
  label: string;
  /** Widget type: multi-select allows multiple values, single-select allows one */
  type: FilterWidgetType;
  /**
   * Explicit dropdown options. When provided, these are the only options shown.
   * When omitted, the parent must supply options via the `dynamicOptions` prop.
   */
  options?: string[];
  /** Placeholder text when no value is selected (default: "All") */
  placeholder?: string;
  /** Optional color map for option values (e.g. status colors) */
  optionColors?: Map<string, string> | Record<string, string>;
}

export interface FilterBarProps {
  /** Array of widget configs — determines which filters appear and in what order */
  widgets: FilterWidgetConfig[];
  /**
   * Current filter values keyed by widget key.
   * Multi-select: string[]  |  Single-select: string[] with 0 or 1 element.
   */
  values: Record<string, string[]>;
  /** Called when any filter value changes (immediate mode) */
  onChange: (key: string, values: string[]) => void;
  /**
   * Dynamic options for widgets that don't have explicit `options`.
   * Keyed by widget key → string[].
   */
  dynamicOptions?: Record<string, string[]>;
  /**
   * When true, filters are staged locally and only dispatched on "Apply".
   * When false (default), every selection calls onChange immediately.
   */
  staged?: boolean;
  /** Called when the user clicks "Apply Filters" (only relevant when staged=true) */
  onApply?: (values: Record<string, string[]>) => void;
  /** Called when the user clicks "Clear All" */
  onClear?: () => void;
  /** Disable all filter widgets */
  disabled?: boolean;
}
