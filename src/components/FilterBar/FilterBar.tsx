/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Filter, X } from "lucide-react";
import { useCallback, useMemo, useState, type FC } from "react";
import { SearchableFilterSelect } from "../ui/searchable-filter-select";
import { borders, theme } from "../../styles";
import type { FilterBarProps, FilterWidgetConfig } from "./types";

const barStyles = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: ${theme.colors.gray50};
  ${borders.bottom}
  width: 100%;
  max-width: 100%;
  flex-shrink: 0;
  z-index: 50;
  flex-wrap: wrap;
`;

const actionGroupStyles = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
`;

const clearBtnStyles = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: transparent;
  ${borders.standard}
  border-radius: 0.375rem;
  color: ${theme.colors.gray500};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  height: 1.625rem;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.gray100};
    border-color: ${theme.colors.gray400};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const applyBtnBase = css`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border: none;
  border-radius: 0.375rem;
  color: ${theme.colors.white};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  height: 1.625rem;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const iconSize = css`
  width: 0.6875rem;
  height: 0.6875rem;
`;

/**
 * Reusable FilterBar component.
 *
 * Each view configures which widgets to render via the `widgets` prop.
 * Widgets with explicit `options` use those; otherwise supply values
 * through `dynamicOptions`.
 *
 * Supports two modes:
 * - **Immediate** (default): every selection calls `onChange` right away.
 * - **Staged** (`staged=true`): selections are held locally until "Apply" is clicked.
 */
export const FilterBar: FC<FilterBarProps> = ({
  widgets,
  values,
  onChange,
  dynamicOptions,
  staged = false,
  onApply,
  onClear,
  disabled = false,
}) => {
  const [clearKey, setClearKey] = useState(0);

  // Staged mode: local copy of values that only flush on "Apply"
  const [stagedValues, setStagedValues] = useState<Record<string, string[]>>(values);

  const activeValues = staged ? stagedValues : values;

  const resolveOptions = useCallback(
    (widget: FilterWidgetConfig): string[] => {
      if (widget.options) return widget.options;
      return dynamicOptions?.[widget.key] ?? [];
    },
    [dynamicOptions],
  );

  const handleChange = useCallback(
    (key: string, type: FilterWidgetConfig["type"], newValues: string[]) => {
      const finalValues = type === "single-select" ? newValues.slice(-1) : newValues;

      if (staged) {
        setStagedValues((prev) => ({ ...prev, [key]: finalValues }));
      } else {
        onChange(key, finalValues);
      }
    },
    [staged, onChange],
  );

  const handleApply = useCallback(() => {
    if (onApply) {
      onApply(stagedValues);
    } else {
      for (const [key, vals] of Object.entries(stagedValues)) {
        onChange(key, vals);
      }
    }
  }, [stagedValues, onApply, onChange]);

  const handleClear = useCallback(() => {
    setClearKey((k) => k + 1);
    if (staged) {
      const cleared: Record<string, string[]> = {};
      for (const w of widgets) {
        cleared[w.key] = [];
      }
      setStagedValues(cleared);
    }
    onClear?.();
  }, [staged, widgets, onClear]);

  const totalSelected = useMemo(
    () => Object.values(activeValues).reduce((sum, arr) => sum + arr.length, 0),
    [activeValues],
  );

  const hasUnappliedChanges = useMemo(() => {
    if (!staged) return false;
    for (const w of widgets) {
      const applied = values[w.key] ?? [];
      const local = stagedValues[w.key] ?? [];
      if (applied.length !== local.length) return true;
      const appliedSet = new Set(applied);
      if (local.some((v) => !appliedSet.has(v))) return true;
    }
    return false;
  }, [staged, widgets, values, stagedValues]);

  return (
    <div css={barStyles}>
      {widgets.map((widget) => (
        <SearchableFilterSelect
          key={widget.key}
          label={widget.label}
          options={resolveOptions(widget)}
          value={activeValues[widget.key] ?? []}
          onChange={(newVals) => handleChange(widget.key, widget.type, newVals)}
          disabled={disabled}
          placeholder={widget.placeholder ?? "All"}
          maxDisplayed={50}
          debounceMs={150}
          clearKey={clearKey}
          inlineLabel
          optionColors={widget.optionColors}
        />
      ))}

      <div css={actionGroupStyles}>
        <button
          type="button"
          onClick={handleClear}
          disabled={totalSelected === 0}
          css={clearBtnStyles}
        >
          <X css={iconSize} />
          Clear
        </button>

        {staged && (
          <button
            type="button"
            onClick={handleApply}
            disabled={disabled || !hasUnappliedChanges}
            css={[
              applyBtnBase,
              css`
                background-color: ${hasUnappliedChanges
                  ? theme.colors.blue500
                  : theme.colors.gray400};

                &:hover:not(:disabled) {
                  background-color: ${hasUnappliedChanges
                    ? theme.colors.blue600
                    : theme.colors.gray400};
                }
              `,
            ]}
          >
            <Filter css={iconSize} />
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
};
