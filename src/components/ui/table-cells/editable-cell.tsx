/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { memo, useEffect, useRef, useState } from "react";
import { safeStringify } from "../../../utils/json";
import { Input } from "../input";

/**
 * Generic edit state interface for editable cells.
 * Cells are always in edit mode — there is no display-only state.
 */
export interface EditState<T extends string = string> {
  editValues: Partial<Record<T, unknown>>;
}

/**
 * Configuration for edit event handling
 */
export interface EditEventConfig {
  /** Event name for edits changed */
  editsChangedEvent?: string;
  /** Function to generate row key for event matching */
  getRowKey?: (row: unknown) => string;
}

export interface EditableCellProps<T extends string = string, TRow = unknown> {
  /** Row data object */
  row: TRow;
  /** Field name to edit */
  field: T;
  /** Current edit state */
  editState: EditState<T>;
  /** Callback when value changes */
  onUpdate: (row: TRow, field: T, value: string | number | null) => void;
  /** Optional event configuration for cross-component communication */
  eventConfig?: EditEventConfig;
  /** Whether the cell is disabled */
  disabled?: boolean;
  /** Input type - "text" or "number" */
  inputType?: "text" | "number";
  /** Minimum value for number inputs (clamps to this value) */
  minValue?: number;
  /** Custom CSS for the input */
  inputCss?: ReturnType<typeof css>;
}

/**
 * Generic editable cell component — always renders an input.
 * Reads its value from editState.editValues[field].
 */
export const EditableCell = memo(
  <T extends string, TRow = unknown>({
    row,
    field,
    editState,
    onUpdate,
    eventConfig,
    disabled = false,
    inputType = "text",
    minValue,
    inputCss,
  }: EditableCellProps<T, TRow>) => {
    const [localValue, setLocalValue] = useState<string>(
      String(editState.editValues[field] ?? ""),
    );
    const inputRef = useRef<HTMLInputElement>(null);

    // Track if user is currently typing to prevent syncing from external changes
    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const localValueRef = useRef(localValue);

    useEffect(() => {
      localValueRef.current = localValue;
    }, [localValue]);

    // Sync with editState changes (unless the user is typing)
    useEffect(() => {
      if (isTypingRef.current) return;
      const newValue = String(editState.editValues[field] ?? "");
      if (newValue !== localValueRef.current) {
        setLocalValue(newValue);
      }
    }, [editState.editValues, field]);

    // Listen for external edit events (e.g. Edit All, Restore All)
    useEffect(() => {
      if (!eventConfig?.editsChangedEvent) return;

      const handleEditsChanged = (event: Event) => {
        if (!eventConfig.getRowKey) return;
        const customEvent = event as CustomEvent<{
          rowKey: string;
          field: string;
          value: unknown;
        }>;
        const rowKey = eventConfig.getRowKey(row);

        if (
          customEvent.detail.rowKey === rowKey &&
          customEvent.detail.field === field &&
          !isTypingRef.current
        ) {
          const newValue = String(customEvent.detail.value ?? "");
          if (newValue !== localValueRef.current) {
            setLocalValue(newValue);
          }
        }
      };

      window.addEventListener(eventConfig.editsChangedEvent, handleEditsChanged);
      return () => {
        window.removeEventListener(eventConfig.editsChangedEvent!, handleEditsChanged);
      };
    }, [row, field, eventConfig]);

    const handleChange = (value: string) => {
      isTypingRef.current = true;

      // Clamp to minValue for number inputs
      if (inputType === "number" && minValue !== undefined && value !== "" && value !== "-") {
        const numValue = Number(value);
        if (!isNaN(numValue) && isFinite(numValue) && numValue < minValue) {
          value = String(minValue);
        }
      }

      setLocalValue(value);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (inputType === "number") {
        const numValue = value === "" ? null : Number(value);
        if (value === "" || (!isNaN(numValue!) && isFinite(numValue!))) {
          const finalValue =
            minValue !== undefined && numValue !== null && numValue < minValue
              ? minValue
              : numValue;
          onUpdate(row, field, finalValue);
        }
      } else {
        onUpdate(row, field, value === "" ? null : value);
      }

      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
      }, 300);
    };

    const handleBlur = () => {
      isTypingRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      if (inputType === "number") {
        const numValue = localValue === "" ? null : Number(localValue);
        if (localValue === "" || (!isNaN(numValue!) && isFinite(numValue!))) {
          const finalValue =
            minValue !== undefined && numValue !== null && numValue < minValue
              ? minValue
              : numValue;
          if (numValue !== null && minValue !== undefined && numValue < minValue) {
            setLocalValue(String(minValue));
          }
          onUpdate(row, field, finalValue);
        }
      } else {
        onUpdate(row, field, localValue === "" ? null : localValue);
      }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    return (
      <Input
        ref={inputRef}
        type={inputType}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={disabled}
        css={
          inputCss ??
          css`
            font-size: 0.875rem;
            padding: 0.25rem 0.5rem;
            height: auto;
            min-height: 1.5rem;
          `
        }
      />
    );
  },
  (prevProps, nextProps) => {
    const rowKeysMatch =
      prevProps.row === nextProps.row ||
      (typeof prevProps.row === "object" &&
        typeof nextProps.row === "object" &&
        prevProps.row !== null &&
        nextProps.row !== null &&
        safeStringify(prevProps.row) === safeStringify(nextProps.row));

    return (
      rowKeysMatch &&
      prevProps.editState.editValues[prevProps.field] ===
        nextProps.editState.editValues[nextProps.field] &&
      prevProps.disabled === nextProps.disabled
    );
  },
) as (<T extends string, TRow = unknown>(props: EditableCellProps<T, TRow>) => React.JSX.Element) & { displayName?: string };

EditableCell.displayName = "EditableCell";
