/**
 * ViewControls — Type definitions for the composable view controls bar.
 *
 * Mirrors the control types available in the atomic-webapp client frontend
 * (`PivotControl`), adapted for the starterkit's static-data context.
 */

export const ControlType = {
  SegmentBy: "SegmentBy",
  AggregateBy: "AggregateBy",
  DisplayBy: "DisplayBy",
  FilterBy: "FilterBy",
  DateRange: "DateRange",
  Download: "Download",
  EditMode: "EditMode",
} as const;

export type ControlTypeValue = (typeof ControlType)[keyof typeof ControlType];

/** Column descriptor shared across controls */
export interface ColumnOption {
  value: string;
  label: string;
}

/** Props for the toolbar container */
export interface ViewControlsBarProps {
  children: React.ReactNode;
  disabled?: boolean;
}

/** SegmentBy — multi-select pill badges */
export interface SegmentByProps {
  segments: string[];
  onSegmentsChange: (segments: string[]) => void;
  options: ColumnOption[];
  disabled?: boolean;
  /** Values that cannot be removed (chip rendered without "x"). Mirrors atomic-webapp's disabledDeleteValue. */
  lockedValues?: string[];
}

/** AggregateBy — single-select dropdown */
export interface AggregateByProps {
  value: string;
  onChange: (value: string) => void;
  options: ColumnOption[];
  disabled?: boolean;
}

/** DisplayBy — single-select dropdown (date granularity, etc.) */
export interface DisplayByProps {
  value: string;
  onChange: (value: string) => void;
  options: ColumnOption[];
  disabled?: boolean;
}

/** Filter operator — mirrors atomic-webapp's filter operators */
export type FilterOperator = "in" | "not in" | "contains";

/** A single filter entry: [column, operator, values] — matches atomic-webapp's PerspectiveViewFilter */
export type FilterEntry = [column: string, operator: FilterOperator, values: string[]];

/** FilterBy — dynamic column filters with + to add rows */
export interface FilterByProps {
  filters: FilterEntry[];
  onFiltersChange: (filters: FilterEntry[]) => void;
  columns: { value: string; label: string; options: string[] }[];
  disabled?: boolean;
  tooltip?: string;
}

/** FilterDropdown — labeled dropdown for a single filter dimension */
export interface FilterDropdownProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: ColumnOption[];
  disabled?: boolean;
  /** When false, chips cannot be individually removed. Defaults to true. */
  clearable?: boolean;
  /** When false, only a single value can be selected at a time. Defaults to true. */
  multiple?: boolean;
}

/** DateRange — from/to date inputs */
export interface DateRangeProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromOptions?: string[];
  toOptions?: string[];
  disabled?: boolean;
}
