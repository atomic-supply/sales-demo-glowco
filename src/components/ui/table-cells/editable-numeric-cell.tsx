/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { safeStringify } from "../../../utils/json";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { theme } from "../../../styles";
import type { EditState, EditableCellProps } from "./editable-cell";

export interface EditableNumericCellProps<T extends string = string, TRow = unknown>
  extends Omit<EditableCellProps<T, TRow>, "inputType"> {
  /** Proposed/original value to compare against */
  proposedValue: number | null;
  /** Function to get the corrected value from edit state */
  getCorrectedValue: (editState: EditState<T>) => number | null;
  /** Whether to show diff from proposed value */
  showDiff?: boolean;
  /** Whether to show original value in tooltip when edited */
  showOriginalTooltip?: boolean;
  /** Custom CSS for the input container */
  inputContainerCss?: ReturnType<typeof css>;
  /** Custom CSS for the display container */
  displayContainerCss?: ReturnType<typeof css>;
  /** Custom CSS for the display span */
  displayCss?: ReturnType<typeof css>;
}

/**
 * Specialized editable numeric cell — always renders an input.
 * Shows corrected value with diff from proposed, plus "Original" tooltip.
 */
export const EditableNumericCell = memo(
  <T extends string, TRow = unknown>({
    row,
    field,
    editState,
    onUpdate,
    proposedValue,
    getCorrectedValue,
    showDiff = true,
    showOriginalTooltip = true,
    eventConfig,
    disabled = false,
    minValue = 0,
    inputContainerCss,
    inputCss,
  }: EditableNumericCellProps<T, TRow>) => {
    // Get display value: corrected if exists, else proposed
    const getDisplayValue = useCallback(() => {
      const correctedValue = getCorrectedValue(editState);
      return correctedValue !== null && correctedValue !== undefined
        ? correctedValue
        : proposedValue;
    }, [editState, getCorrectedValue, proposedValue]);

    const [localValue, setLocalValue] = useState<string>(
      String(getDisplayValue() ?? ""),
    );
    const inputRef = useRef<HTMLInputElement>(null);

    // Track if user is currently typing to prevent syncing from external changes
    const isTypingRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const localValueRef = useRef(localValue);
    const shouldMaintainFocusRef = useRef(false);
    const cursorPositionRef = useRef<number | null>(null);

    useEffect(() => {
      localValueRef.current = localValue;
    }, [localValue]);

    // Preserve focus after rerenders
    useLayoutEffect(() => {
      const wasFocused =
        shouldMaintainFocusRef.current ||
        (inputRef.current && document.activeElement === inputRef.current);

      if (wasFocused && inputRef.current && document.activeElement !== inputRef.current) {
        requestAnimationFrame(() => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
            const position = cursorPositionRef.current ?? inputRef.current.value.length;
            inputRef.current.setSelectionRange(position, position);
          }
        });
      }

      if (shouldMaintainFocusRef.current) {
        shouldMaintainFocusRef.current = false;
      }
      if (cursorPositionRef.current !== null && document.activeElement === inputRef.current) {
        cursorPositionRef.current = null;
      }
    });

    // Sync with editState (unless typing)
    useEffect(() => {
      if (isTypingRef.current) return;
      const newDisplayValue = String(getDisplayValue() ?? "");
      if (newDisplayValue !== localValue) {
        setLocalValue(newDisplayValue);
      }
    }, [getDisplayValue, localValue]);

    // Listen for external edit events (e.g. Edit All, Restore All, Clear)
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
          !isTypingRef.current &&
          document.activeElement !== inputRef.current
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
      shouldMaintainFocusRef.current = true;

      if (inputRef.current) {
        cursorPositionRef.current = inputRef.current.selectionStart;
      }

      // Prevent negative values
      if (value !== "" && value !== "-") {
        const numValue = Number(value);
        if (!isNaN(numValue) && isFinite(numValue) && numValue < minValue) {
          value = String(minValue);
        }
      }

      setLocalValue(value);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const numValue = value === "" ? null : Number(value);
      if (value === "" || (!isNaN(numValue!) && isFinite(numValue!))) {
        const finalValue = numValue !== null && numValue < minValue ? minValue : numValue;
        onUpdate(row, field, finalValue);
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

      const numValue = localValue === "" ? null : Number(localValue);
      if (localValue === "" || (!isNaN(numValue!) && isFinite(numValue!))) {
        const finalValue = numValue !== null && numValue < minValue ? minValue : numValue;
        if (numValue !== null && numValue < minValue) {
          setLocalValue(String(minValue));
        }
        onUpdate(row, field, finalValue);
      }
    };

    useEffect(() => {
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }, []);

    // ── Diff & tooltip ─────────────────────────────────────────────────────

    const correctedValue = getCorrectedValue(editState);
    const hasCorrectedValue = correctedValue !== null && correctedValue !== undefined;

    const proposedValueNum = proposedValue != null ? Number(proposedValue) : null;
    const currentInputValue = localValue === "" ? null : Number(localValue);

    const hasEdit =
      hasCorrectedValue &&
      proposedValueNum !== null &&
      correctedValue !== null &&
      Math.abs(correctedValue - proposedValueNum) >= 0.001;

    const editDiff =
      proposedValueNum !== null && currentInputValue !== null && !isNaN(currentInputValue)
        ? currentInputValue - proposedValueNum
        : null;

    // Compute focus ring color
    const focusRingColor = `${theme.colors.ring.slice(0, -1)} / 0.5)`;

    return (
      <div
        css={
          inputContainerCss ??
          css`
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          `
        }
      >
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 0.25rem;
            justify-content: flex-start;
          `}
        >
          <div
            css={css`
              position: relative;
            `}
          >
            {hasEdit && proposedValue !== null && showOriginalTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      css={css`
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-top: 6px solid ${theme.colors.orange500};
                        cursor: help;
                        z-index: 10;
                      `}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Original: {proposedValue.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <input
              ref={inputRef}
              type="number"
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
                  max-width: 80px;
                  width: 80px;
                  border-radius: ${theme.borderRadius.sm};
                  border: 1px solid ${theme.colors.input};
                  background-color: transparent;
                  box-shadow: ${theme.shadows.xs};
                  transition: color 0.2s, box-shadow 0.2s;
                  outline: none;

                  &:focus-visible {
                    border-color: ${theme.colors.ring};
                    box-shadow: 0 0 0 3px ${focusRingColor};
                  }
                `
              }
            />
          </div>
          {showDiff && editDiff !== null && editDiff !== 0 && proposedValue !== null && (
            <span
              css={css`
                font-size: 0.8125rem;
                color: #6b7280;
              `}
            >
              ({editDiff > 0 ? "+" : ""}
              {editDiff.toLocaleString()})
            </span>
          )}
        </div>
      </div>
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
      prevProps.proposedValue === nextProps.proposedValue &&
      safeStringify(prevProps.editState.editValues) ===
        safeStringify(nextProps.editState.editValues) &&
      prevProps.disabled === nextProps.disabled
    );
  },
) as (<T extends string, TRow = unknown>(
  props: EditableNumericCellProps<T, TRow>,
) => React.JSX.Element) & { displayName?: string };

EditableNumericCell.displayName = "EditableNumericCell";
