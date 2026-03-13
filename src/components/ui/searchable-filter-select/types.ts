import type { Interpolation } from "@emotion/react";
import type { Theme } from "../../../styles";

export interface SearchableFilterSelectProps {
  /** Display label above the select (or inline if inlineLabel is true) */
  label: string;
  /** Array of unique string values to choose from */
  options: string[];
  /** Currently selected values (empty array = "All") */
  value: string[];
  /** Callback when value changes */
  onChange: (value: string[]) => void;
  /** Callback when dropdown open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Max number of options to display at once */
  maxDisplayed?: number;
  /** Debounce delay in ms (default: 200) */
  debounceMs?: number;
  /** Increment this to instantly clear the filter (for Clear All button) */
  clearKey?: number;
  /** Show label inline inside the trigger as "Label: Value" */
  inlineLabel?: boolean;
  /** Optional map of option values to their display colors (for color-coded options) */
  optionColors?: Map<string, string> | Record<string, string>;
  /** Custom CSS */
  css?: Interpolation<Theme>;
}
