/** @jsxImportSource @emotion/react */
"use client";

import { css } from "@emotion/react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { borders } from "../../../styles";
import { STATUS_OPTIONS } from "../../../constants/status";
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  type FC,
} from "react";

import type { SearchableFilterSelectProps } from "./types";
import { useDebounce } from "./hooks";
import {
  allOptionStyles,
  checkIconStyles,
  chevronStyles,
  clearButtonStyles,
  clearIconStyles,
  commandListStyles,
  containerInlineStyles,
  containerStyles,
  inlineLabelStyles,
  inlineValueStyles,
  itemStyles,
  labelStyles,
  popoverContentStyles,
  resultCountStyles,
  searchIconStyles,
  searchInputStyles,
  searchWrapperStyles,
  triggerActiveStyles,
  triggerBaseStyles,
  triggerInactiveStyles,
  triggerInlineActiveStyles,
  triggerInlineInactiveStyles,
  triggerInlineStyles,
  triggerTextStyles,
} from "./styles";

export const SearchableFilterSelect: FC<SearchableFilterSelectProps> = memo(
  ({
    label,
    options,
    value,
    onChange,
    onOpenChange,
    disabled = false,
    placeholder = "All",
    maxDisplayed = 15,
    debounceMs = 200,
    clearKey = 0,
    inlineLabel = false,
    optionColors,
    css: cssProp,
  }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Store onOpenChange in ref to avoid calling it during render
    const onOpenChangeRef = useRef(onOpenChange);
    useEffect(() => {
      onOpenChangeRef.current = onOpenChange;
    }, [onOpenChange]);

    // Notify parent of open state changes (after state update completes)
    const prevOpenRef = useRef(open);
    useEffect(() => {
      if (prevOpenRef.current !== open) {
        prevOpenRef.current = open;
        startTransition(() => {
          onOpenChangeRef.current?.(open);
        });
      }
    }, [open]);

    // ==========================================================================
    // OPTIMISTIC UI: Local state for immediate visual feedback
    // ==========================================================================
    const [localValue, setLocalValue] = useState<string[]>(value);

    // Store onChange in ref to avoid calling it during render
    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Track clearKey to detect Clear All clicks
    const prevClearKeyRef = useRef(clearKey);
    const valueRef = useRef(value);
    useEffect(() => {
      valueRef.current = value;
    }, [value]);

    // INSTANT CLEAR: When clearKey changes, immediately reset local state
    useEffect(() => {
      if (clearKey !== prevClearKeyRef.current) {
        prevClearKeyRef.current = clearKey;
        const currentValue = valueRef.current;
        if (currentValue.length > 0) {
          startTransition(() => {
            setLocalValue(currentValue);
          });
        } else {
          setLocalValue([]);
        }
      }
    }, [clearKey]);

    // Sync local state with props when parent updates
    const prevValueRef = useRef<string[]>(value);
    useEffect(() => {
      prevValueRef.current = value;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
      const valueChanged = JSON.stringify(value) !== JSON.stringify(prevValueRef.current);
      if (valueChanged) {
        prevValueRef.current = value;
        startTransition(() => {
          setLocalValue(value);
        });
      }
    }, [value]);

    // Click outside to close
    useEffect(() => {
      if (!open) {
        return;
      }

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
          setSearch("");
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (search) {
            setSearch("");
          } else {
            setOpen(false);
          }
        }
      };

      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, search, label]);

    // Debounce search for performance with large lists
    const debouncedSearch = useDebounce(search, debounceMs);
    const deferredOptions = useDeferredValue(options);

    // Filter options based on search
    const filteredOptions = useMemo(() => {
      if (!debouncedSearch.trim()) return deferredOptions;
      const searchLower = debouncedSearch.toLowerCase().trim();
      return deferredOptions.filter((opt) => opt.toLowerCase().includes(searchLower));
    }, [deferredOptions, debouncedSearch]);

    // Sort: selected items first (alphabetical), then unselected (alphabetical)
    const sortedOptions = useMemo(() => {
      const selected = filteredOptions.filter((opt) => localValue.includes(opt));
      const unselected = filteredOptions.filter((opt) => !localValue.includes(opt));
      const collator = new Intl.Collator(undefined, { sensitivity: "base" });
      selected.sort(collator.compare);
      unselected.sort(collator.compare);
      return [...selected, ...unselected];
    }, [filteredOptions, localValue]);

    // Limit displayed options
    const displayedOptions = useMemo(() => {
      return sortedOptions.slice(0, maxDisplayed);
    }, [sortedOptions, maxDisplayed]);

    const hasMore = sortedOptions.length > maxDisplayed;
    const totalMatches = sortedOptions.length;

    // Focus input when dropdown opens
    useEffect(() => {
      if (open) {
        const timer = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(timer);
      }
    }, [open]);

    const handleSelect = useCallback(
      (selectedValue: string) => {
        const newValue = localValue.includes(selectedValue)
          ? localValue.filter((v) => v !== selectedValue)
          : [...localValue, selectedValue];

        setLocalValue(newValue);
        startTransition(() => {
          onChangeRef.current(newValue);
        });
        setSearch("");
      },
      [localValue]
    );

    const handleClearSearch = useCallback(() => {
      setSearch("");
      inputRef.current?.focus();
    }, []);

    // Handle paste from spreadsheet
    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        if (!pastedText.trim()) return;

        const values = pastedText
          .split(/\r?\n|\t|,/)
          .map((v) => v.trim())
          .filter((v) => v.length > 0);

        if (values.length === 0) return;

        const matchingValues: string[] = [];

        for (const pastedValue of values) {
          if (options.includes(pastedValue)) {
            matchingValues.push(pastedValue);
            continue;
          }

          const lowerPasted = pastedValue.toLowerCase();
          const exactMatch = options.find((opt) => opt.toLowerCase() === lowerPasted);
          if (exactMatch) {
            matchingValues.push(exactMatch);
            continue;
          }

          const partialMatch = options.find(
            (opt) =>
              opt.toLowerCase().includes(lowerPasted) || lowerPasted.includes(opt.toLowerCase())
          );
          if (partialMatch) {
            matchingValues.push(partialMatch);
          }
        }

        if (matchingValues.length > 0) {
          const computeNewValue = (prev: string[]) => {
            const newValue = [...prev];
            for (const value of matchingValues) {
              if (!newValue.includes(value)) {
                newValue.push(value);
              }
            }
            return newValue;
          };

          const newValue = computeNewValue(localValue);
          setLocalValue(newValue);
          startTransition(() => {
            onChangeRef.current(newValue);
          });
          setSearch("");
        }
      },
      [options, localValue]
    );

    const handleToggle = useCallback(() => {
      if (!disabled) {
        setOpen((prev) => !prev);
      }
    }, [disabled]);

    // Clear the selected value (without opening dropdown)
    const handleClearValue = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalValue([]);
      startTransition(() => {
        onChangeRef.current([]);
      });
    }, []);

    // Use LOCAL value for display (optimistic UI)
    const isActive = localValue.length > 0;
    const displayValue =
      localValue.length === 0
        ? placeholder
        : localValue.length === 1
          ? localValue[0]
          : localValue.length === 2
            ? `${localValue[0]}, ${localValue[1]}`
            : `${localValue.length} selected`;

    // Shared dropdown content renderer
    const renderDropdownContent = (isStandardMode: boolean) => (
      <div
        ref={dropdownContentRef}
        css={[
          popoverContentStyles,
          css`
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
          `,
        ]}
      >
        {/* Search Input */}
        <div css={searchWrapperStyles}>
          <Search css={searchIconStyles} />
          <input
            ref={inputRef}
            type="text"
            css={searchInputStyles}
            placeholder="Type to search or paste from spreadsheet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPaste={handlePaste}
          />
          {search && (
            <button
              type="button"
              css={clearButtonStyles}
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X
                css={css`
                  width: 0.75rem;
                  height: 0.75rem;
                `}
              />
            </button>
          )}
        </div>

        {/* Results count */}
        {debouncedSearch && (
          <div css={resultCountStyles}>
            {totalMatches === 0
              ? "No matches"
              : hasMore
                ? `Showing ${maxDisplayed} of ${totalMatches} matches`
                : `${totalMatches} match${totalMatches === 1 ? "" : "es"}`}
          </div>
        )}

        {/* Options List */}
        <div css={commandListStyles} role="listbox">
          {filteredOptions.length === 0 && debouncedSearch ? (
            <div
              css={css`
                padding: 1.5rem 0;
                text-align: center;
                font-size: 0.875rem;
                color: #6b7280;
              `}
            >
              No results found
            </div>
          ) : (
            <>
              {/* "All" option */}
              {!debouncedSearch && (
                <div
                  css={itemStyles}
                  onClick={() => {
                    setLocalValue([]);
                    startTransition(() => {
                      onChangeRef.current([]);
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setLocalValue([]);
                      startTransition(() => {
                        onChangeRef.current([]);
                      });
                    }
                  }}
                  role="option"
                  tabIndex={0}
                  aria-selected={localValue.length === 0}
                >
                  <Check
                    css={[
                      checkIconStyles,
                      css`
                        opacity: ${localValue.length === 0 ? 1 : 0};
                      `,
                    ]}
                  />
                  <span css={allOptionStyles}>{placeholder}</span>
                </div>
              )}

              {/* Filtered options */}
              {displayedOptions.map((opt) => {
                const isSelected = localValue.includes(opt);
                const optionColor = optionColors
                  ? optionColors instanceof Map
                    ? optionColors.get(opt)
                    : optionColors[opt]
                  : undefined;

                return (
                  <div
                    key={opt}
                    css={itemStyles}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(opt);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        handleSelect(opt);
                      }
                    }}
                    role="option"
                    tabIndex={0}
                    aria-selected={isSelected}
                    title={opt}
                  >
                    {/* In standard mode, hide checkmark for "Staged" in Status filter */}
                    {isStandardMode && (() => {
                      const isStagedInStatusFilter =
                        label === "Status" &&
                        (opt === "Staged" ||
                          opt === STATUS_OPTIONS.find((o) => o.value === ("staged" as string))?.label);
                      if (isStagedInStatusFilter) return null;
                      return (
                        <Check
                          css={[
                            checkIconStyles,
                            css`
                              opacity: ${isSelected ? 1 : 0};
                              transition: opacity 0.1s ease;
                            `,
                          ]}
                        />
                      );
                    })()}
                    {!isStandardMode && (
                      <Check
                        css={[
                          checkIconStyles,
                          css`
                            opacity: ${isSelected ? 1 : 0};
                            transition: opacity 0.1s ease;
                          `,
                        ]}
                      />
                    )}
                    {label === "Status" && optionColors && optionColor && (
                      <div
                        css={css`
                          width: 16px;
                          height: 16px;
                          border-radius: 50%;
                          background-color: ${optionColor};
                          flex-shrink: 0;
                          margin: 0 4px;
                        `}
                      />
                    )}
                    <span>{opt}</span>
                  </div>
                );
              })}

              {/* "More results" indicator */}
              {hasMore && (
                <div
                  css={css`
                    padding: 0.5rem 0.75rem;
                    font-size: 0.75rem;
                    color: #9ca3af;
                    text-align: center;
                    ${borders.top}
                    margin-top: 0.25rem;
                  `}
                >
                  Type to narrow down {sortedOptions.length - maxDisplayed} more results
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );

    // Inline label mode: "Label: Value" format
    if (inlineLabel) {
      return (
        <div css={[containerInlineStyles, cssProp]} ref={containerRef}>
          <div
            css={css`
              position: relative;
            `}
          >
            <button
              type="button"
              css={[
                triggerInlineStyles,
                isActive ? triggerInlineActiveStyles : triggerInlineInactiveStyles,
              ]}
              disabled={disabled}
              aria-expanded={open}
              aria-haspopup="listbox"
              onClick={handleToggle}
            >
              <span css={inlineLabelStyles}>{label}:</span>
              <span css={inlineValueStyles}>{displayValue}</span>
              {isActive && !disabled && (
                <X
                  css={css`
                    width: 0.75rem;
                    height: 0.75rem;
                    flex-shrink: 0;
                    padding: 0.0625rem;
                    border-radius: 0.125rem;
                    color: #3b82f6;
                    opacity: 0.7;
                    transition: all 0.15s ease;

                    &:hover {
                      opacity: 1;
                      background-color: rgba(59, 130, 246, 0.15);
                    }
                  `}
                  onClick={handleClearValue}
                  aria-label="Clear filter"
                />
              )}
              <ChevronsUpDown
                css={css`
                  width: 0.625rem;
                  height: 0.625rem;
                  flex-shrink: 0;
                  opacity: 0.5;
                `}
              />
            </button>

            {open && renderDropdownContent(false)}
          </div>
        </div>
      );
    }

    // Standard mode with label above
    return (
      <div css={[containerStyles, cssProp]} ref={containerRef}>
        <label css={labelStyles}>{label}</label>

        <div
          css={css`
            position: relative;
          `}
        >
          <button
            ref={buttonRef}
            type="button"
            css={[triggerBaseStyles, isActive ? triggerActiveStyles : triggerInactiveStyles]}
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={handleToggle}
          >
            <span css={triggerTextStyles}>{displayValue}</span>
            {isActive && !disabled && (
              <X css={clearIconStyles} onClick={handleClearValue} aria-label="Clear filter" />
            )}
            <ChevronsUpDown css={chevronStyles} />
          </button>

          {open && renderDropdownContent(true)}
        </div>
      </div>
    );
  }
);

SearchableFilterSelect.displayName = "SearchableFilterSelect";
