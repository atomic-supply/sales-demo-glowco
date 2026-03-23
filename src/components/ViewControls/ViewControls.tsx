/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useCallback, useMemo, useState, type FC, type ReactNode } from "react"
import { Calendar as CalendarIcon, Check, Info, Plus, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"
import { parse, format, isValid } from "date-fns"
import { viewControlsBar } from "../../styles"
import { theme, alpha } from "../../styles/theme/theme"
import { SearchableDropdown } from "./SearchableDropdown"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import type {
  ViewControlsBarProps,
  SegmentByProps,
  AggregateByProps,
  DisplayByProps,
  FilterDropdownProps,
  FilterByProps,
  DateRangeProps,
  FilterEntry,
  FilterOperator,
} from "./types"

const chipRow = css`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  flex-wrap: wrap;
  flex: 1;
`

const flexRow = css`
  display: flex;
  align-items: center;
`

const chip = css`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: ${theme.typography.fontSize.xs};
  background: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.87);
  white-space: nowrap;
  border: none;
`

const chipDelete = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  margin: 0 -3px 0 2px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.26);
  border-radius: 50%;
  &:hover { color: rgba(0, 0, 0, 0.4); }
`

const dropArrow = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
  &::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgba(0, 0, 0, 0.54);
  }
`

const bareSelectTrigger = css`
  height: auto;
  min-height: 20px;
  width: auto;
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 0;
  margin: 0;
  box-shadow: none;
  gap: 0;
  &[data-size="default"], &[data-size="sm"] {
    height: auto;
    min-height: 20px;
  }
  &:focus { box-shadow: none; outline: none; }
  & > svg { display: none; }
`

const dropdownContentProps = { align: "start" as const, sideOffset: 4 }

// ─── Container ────────────────────────────────────────────────────────────────

const Bar: FC<ViewControlsBarProps> = ({ children }) => (
  <div css={viewControlsBar.container}>{children}</div>
)

// ─── SegmentBy ────────────────────────────────────────────────────────────────
// Atomic-webapp: Box > "Segment by" label(11px) > MultiSelect(variant=standard)
// MultiSelect renders chips with CancelIcon + ArrowDropDown, underlined.

const SegmentBy: FC<SegmentByProps> = ({
  segments,
  onSegmentsChange,
  options,
  disabled = false,
  lockedValues = [],
}) => {
  const toggle = useCallback(
    (val: string) => {
      if (lockedValues.includes(val)) return
      if (segments.includes(val)) {
        onSegmentsChange(segments.filter((s) => s !== val))
      } else {
        onSegmentsChange([...segments, val])
      }
    },
    [segments, lockedValues, onSegmentsChange],
  )

  return (
    <div css={viewControlsBar.widget}>
      <div css={viewControlsBar.label}>Segment by</div>
      <div css={viewControlsBar.underline}>
        <div css={chipRow}>
          {segments.map((seg) => {
            const opt = options.find((o) => o.value === seg)
            const isLocked = lockedValues.includes(seg)
            return (
              <span key={seg} css={[chip, isLocked && css`opacity: 0.8;`]}>
                {opt?.label ?? seg}
                {!isLocked && (
                  <button
                    css={chipDelete}
                    onClick={() => toggle(seg)}
                    disabled={disabled}
                    type="button"
                  >
                    <X css={css`width: 14px; height: 14px;`} />
                  </button>
                )}
              </span>
            )
          })}
        </div>
        <SearchableDropdown
          options={options}
          onSelect={toggle}
          selectedValues={segments}
          disabled={disabled}
        >
          <span css={dropArrow} />
        </SearchableDropdown>
      </div>
    </div>
  )
}

// ─── AggregateBy ──────────────────────────────────────────────────────────────
// Atomic-webapp: Box > "Aggregate by" label(11px, mb:0.1) > Select(variant=standard,
//   renderValue as Chip)

const AggregateBy: FC<AggregateByProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  label = "Aggregate by",
}) => {
  const selected = options.find((o) => o.value === value)
  return (
    <div css={viewControlsBar.widget}>
      <div css={viewControlsBar.label}>{label}</div>
      <div css={viewControlsBar.underline}>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger css={bareSelectTrigger}>
            <span css={chip}>{selected?.label ?? value}</span>
            <span css={dropArrow} />
          </SelectTrigger>
          <SelectContent {...dropdownContentProps}>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ─── DisplayBy ────────────────────────────────────────────────────────────────
// Same pattern as AggregateBy

const DisplayBy: FC<DisplayByProps> = ({
  value,
  onChange,
  options,
  disabled = false,
}) => {
  const selected = options.find((o) => o.value === value)
  return (
    <div css={viewControlsBar.widget}>
      <div css={viewControlsBar.label}>Display by</div>
      <div css={viewControlsBar.underline}>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger css={bareSelectTrigger}>
            <span css={chip}>{selected?.label ?? value}</span>
            <span css={dropArrow} />
          </SelectTrigger>
          <SelectContent {...dropdownContentProps}>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ─── FilterDropdown ──────────────────────────────────────────────────────────
// Labeled multi-select dropdown for a single filter dimension.
// Same visual pattern as SegmentBy but with a configurable label.

const FilterDropdown: FC<FilterDropdownProps> = ({
  label,
  values,
  onChange,
  options,
  disabled = false,
  clearable = true,
  multiple = true,
}) => {
  const handleSelect = useCallback(
    (val: string) => {
      if (multiple) {
        if (values.includes(val)) {
          onChange(values.filter((v) => v !== val))
        } else {
          onChange([...values, val])
        }
      } else {
        onChange(values[0] === val ? [] : [val])
      }
    },
    [values, onChange, multiple],
  )

  return (
    <div css={viewControlsBar.widget}>
      <div css={viewControlsBar.label}>{label}</div>
      <div css={viewControlsBar.underline}>
        <div css={chipRow}>
          {values.map((val) => {
            const opt = options.find((o) => o.value === val)
            return (
              <span key={val} css={chip}>
                {opt?.label ?? val}
                {clearable && (
                  <button
                    css={chipDelete}
                    onClick={() => handleSelect(val)}
                    disabled={disabled}
                    type="button"
                  >
                    <X css={css`width: 14px; height: 14px;`} />
                  </button>
                )}
              </span>
            )
          })}
        </div>
        <SearchableDropdown
          options={options}
          onSelect={handleSelect}
          selectedValues={values}
          disabled={disabled}
        >
          <span css={dropArrow} />
        </SearchableDropdown>
      </div>
    </div>
  )
}

// ─── FilterBy ─────────────────────────────────────────────────────────────────
// Mirrors atomic-webapp's FilterBy + FilterComponent structure:
//   Label row: "Filter by" + InfoIcon
//   Content row: [FilterComponent ...] + AddButton
//   Each FilterComponent: [ColumnChip ▼] [operator ▼] [value chips ▼ | text input] [red ✕]

const operatorText = css`
  font-size: ${theme.typography.fontSize.xs};
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
  white-space: nowrap;
`

const filterDeleteBtn = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.08);
  cursor: pointer;
  flex-shrink: 0;
  outline: none;
  &:hover { background: rgba(0, 0, 0, 0.04); }
  &:focus, &:focus-visible { outline: none; box-shadow: none; }
`

const filterTextInput = css`
  font-size: ${theme.typography.fontSize.xs};
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  border-radius: 0;
  padding: 0 0 2px;
  background: transparent;
  color: rgba(0, 0, 0, 0.87);
  outline: none;
  min-width: 80px;
  &:hover {
    border-bottom: 2px solid rgba(0, 0, 0, 0.87);
    padding-bottom: 1px;
  }
  &:focus {
    border-bottom: 2px solid rgba(0, 0, 0, 0.87);
    padding-bottom: 1px;
  }
`

/** Single filter row — mirrors atomic-webapp FilterComponent */
const FilterRow: FC<{
  filter: FilterEntry
  index: number
  columns: FilterByProps["columns"]
  disabled: boolean
  onChange: (index: number, filter: FilterEntry) => void
  onDelete: (index: number) => void
}> = ({ filter, index, columns, disabled, onChange, onDelete }) => {
  const [column, operator, values] = filter
  const colDef = columns.find((c) => c.value === column)
  const sortedOptions = colDef
    ? [...colDef.options].filter(Boolean).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    : []
  const available = sortedOptions.filter((o) => !values.includes(o))

  const [inputValue, setInputValue] = useState(
    operator === "contains" ? (values[0] ?? "") : ""
  )

  const changeColumn = useCallback(
    (newCol: string) => onChange(index, [newCol, operator, values]),
    [index, operator, values, onChange],
  )

  const changeOperator = useCallback(
    (newOp: string) => onChange(index, [column, newOp as FilterOperator, values]),
    [index, column, values, onChange],
  )

  const addValue = useCallback(
    (val: string) => {
      if (!values.includes(val)) {
        onChange(index, [column, operator, [...values, val]])
      }
    },
    [index, column, operator, values, onChange],
  )

  const removeValue = useCallback(
    (val: string) => {
      onChange(index, [column, operator, values.filter((v) => v !== val)])
    },
    [index, column, operator, values, onChange],
  )

  return (
    <div css={flexRow}>
      {/* Column selector — searchable dropdown with chip display, underlined */}
      <div css={[viewControlsBar.underline, css`min-width: 30px; margin-right: ${theme.spacing.sm};`]}>
        <SearchableDropdown
          options={columns.map((c) => ({ value: c.value, label: c.label }))}
          onSelect={changeColumn}
          selectedValues={[column]}
          disabled={disabled}
        >
          <div css={flexRow}>
            <span css={chip}>{colDef?.label ?? column}</span>
            <span css={dropArrow} />
          </div>
        </SearchableDropdown>
      </div>

      {/* Operator selector — Select with text renderValue, underlined */}
      <div css={[viewControlsBar.underline, css`min-width: 30px; margin-right: ${theme.spacing.sm};`]}>
        <Select value={operator} onValueChange={changeOperator} disabled={disabled}>
          <SelectTrigger css={bareSelectTrigger}>
            <span css={operatorText}>{operator}</span>
            <span css={dropArrow} />
          </SelectTrigger>
          <SelectContent {...dropdownContentProps}>
            <SelectItem value="in">in</SelectItem>
            <SelectItem value="not in">not in</SelectItem>
            <SelectItem value="contains">contains</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Values — searchable multi-select (in/not in) or text input (contains) */}
      {operator !== "contains" && sortedOptions.length > 0 && (
        <div css={[viewControlsBar.underline, css`min-width: 30px; margin-right: ${theme.spacing.sm};`]}>
          <div css={chipRow}>
            {values.map((v) => (
              <span key={v} css={chip}>
                {v}
                <button
                  css={chipDelete}
                  onClick={() => removeValue(v)}
                  disabled={disabled}
                  type="button"
                >
                  <X css={css`width: 14px; height: 14px;`} />
                </button>
              </span>
            ))}
          </div>
          <SearchableDropdown
            options={available.map((o) => ({ value: o, label: o }))}
            onSelect={addValue}
            selectedValues={values}
            disabled={disabled || available.length === 0}
          >
            <span css={dropArrow} />
          </SearchableDropdown>
        </div>
      )}

      {operator === "contains" && (
        <input
          css={[filterTextInput, css`margin-right: ${theme.spacing.sm};`]}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => onChange(index, [column, operator, [inputValue]])}
          disabled={disabled}
        />
      )}

      {/* Save indicator — green checkmark, matches atomic-webapp's MinimalButton + CheckIcon */}
      <button
        css={[filterDeleteBtn, css`margin-right: ${theme.spacing.xs}; background: rgba(124, 169, 21, 0.2);`]}
        disabled={disabled}
        type="button"
        title="Filter applied"
      >
        <Check css={css`width: 12px; height: 12px; color: #7ca915;`} />
      </button>

      {/* Delete button — red X, matches atomic-webapp's MinimalButton + CloseIcon */}
      <button
        css={[filterDeleteBtn, css`margin-right: ${theme.spacing.sm};`]}
        onClick={() => onDelete(index)}
        disabled={disabled}
        type="button"
        title="Remove filter"
      >
        <X css={css`width: 12px; height: 12px; color: #F75539;`} />
      </button>
    </div>
  )
}

const FilterBy: FC<FilterByProps> = ({
  filters,
  onFiltersChange,
  columns,
  disabled = false,
  tooltip = "You can filter by multiple values in same filter by selecting them in the dropdown. Filters are additive, not conditional.",
}) => {
  const addFilter = useCallback(() => {
    if (columns.length === 0) return
    onFiltersChange([...filters, [columns[0].value, "in", []]])
  }, [filters, onFiltersChange, columns])

  const changeFilter = useCallback(
    (idx: number, updated: FilterEntry) => {
      const next = [...filters] as FilterEntry[]
      next[idx] = updated
      onFiltersChange(next)
    },
    [filters, onFiltersChange],
  )

  const removeFilter = useCallback(
    (idx: number) => {
      onFiltersChange(filters.filter((_, i) => i !== idx))
    },
    [filters, onFiltersChange],
  )

  return (
    <div css={viewControlsBar.widget}>
      <div css={viewControlsBar.label}>
        Filter by
        <Tooltip>
          <TooltipTrigger asChild>
            <span css={css`display: inline-flex; margin-left: ${theme.spacing.xs}; cursor: help;`}>
              <Info css={css`width: 14px; height: 14px; color: rgba(0, 0, 0, 0.3);`} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} css={css`max-width: 260px;`}>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </div>
      <div css={css`display: flex; flex-wrap: wrap; align-items: center; min-height: 23px;`}>
        {filters.map((f, idx) => (
          <FilterRow
            key={`${f[0]}-${f[1]}-${idx}`}
            filter={f}
            index={idx}
            columns={columns}
            disabled={disabled}
            onChange={changeFilter}
            onDelete={removeFilter}
          />
        ))}

        <button
          css={viewControlsBar.addBtn}
          onClick={addFilter}
          disabled={disabled || columns.length === 0}
          type="button"
          title="Add filter"
        >
          <Plus css={css`width: 12px; height: 12px;`} />
        </button>
      </div>
    </div>
  )
}

// ─── DatePickerInput ──────────────────────────────────────────────────────────
// Mirrors atomic-webapp's DatePickerComponent: MUI DatePicker with
// variant="standard", size="small", width 160px, 20px calendar icon.

const datePickerWrapper = css`
  display: flex;
  align-items: center;
  width: 160px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
  padding: 0 0 2px;
  &:hover {
    border-bottom: 2px solid rgba(0, 0, 0, 0.87);
    padding-bottom: 1px;
  }
  &:focus-within {
    border-bottom: 2px solid rgba(0, 0, 0, 0.87);
    padding-bottom: 1px;
  }
`

const datePickerInputStyle = css`
  flex: 1;
  font-size: ${theme.typography.fontSize.xs};
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.87);
  outline: none;
  padding: 0;
  min-width: 0;
`

const calendarBtnStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  color: rgba(0, 0, 0, 0.54);
  &:hover { color: rgba(0, 0, 0, 0.87); }
  &:focus { outline: none; }
`

const calendarPopoverStyle = css`
  width: auto;
  padding: 0.75rem;

  .rdp-root {
    --rdp-accent-color: ${theme.colors.blue600};
    --rdp-accent-background-color: ${alpha(theme.colors.blue600, 0.12)};
    --rdp-day-height: 32px;
    --rdp-day-width: 32px;
    --rdp-day_button-height: 32px;
    --rdp-day_button-width: 32px;
    font-size: 13px;
  }
  .rdp-month_caption {
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    padding: 0 0 ${theme.spacing.sm};
  }
  .rdp-weekday {
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.normal};
    color: rgba(0, 0, 0, 0.38);
  }
  .rdp-day {
    font-size: 13px;
  }
  .rdp-today:not(.rdp-selected) .rdp-day_button {
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.blue600};
  }
  .rdp-selected .rdp-day_button {
    background: ${theme.colors.blue600};
    color: ${theme.colors.white};
    border-radius: 50%;
  }
`

const DATE_FMT = "MM/dd/yyyy"

/**
 * Parses a date string, trying 4-digit year first, then 2-digit.
 * Returns undefined when the value doesn't represent a valid date.
 */
function parseDateValue(value: string): Date | undefined {
  if (!value) return undefined
  let date = parse(value, "MM/dd/yyyy", new Date())
  if (isValid(date)) return date
  date = parse(value, "MM/dd/yy", new Date())
  return isValid(date) ? date : undefined
}

const DatePickerInput: FC<{
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}> = ({ value, onChange, disabled = false, placeholder = "MM/DD/YYYY" }) => {
  const [open, setOpen] = useState(false)

  const parsedDate = useMemo(() => parseDateValue(value), [value])

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onChange(format(date, DATE_FMT))
      }
      setOpen(false)
    },
    [onChange],
  )

  return (
    <div css={datePickerWrapper}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(false)}
        placeholder={placeholder}
        disabled={disabled}
        css={datePickerInputStyle}
      />
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <button type="button" css={calendarBtnStyle} disabled={disabled}>
            <CalendarIcon css={css`width: 20px; height: 20px;`} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={4} css={calendarPopoverStyle}>
          <DayPicker
            mode="single"
            selected={parsedDate}
            onSelect={handleSelect}
            defaultMonth={parsedDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ─── DateRange ────────────────────────────────────────────────────────────────

const DateRange: FC<DateRangeProps> = ({
  from,
  to,
  onFromChange,
  onToChange,
  fromOptions,
  toOptions,
  disabled = false,
}) => {
  if (fromOptions && toOptions) {
    return (
      <div css={css`display: flex; align-items: flex-end; gap: 1.5rem; margin-left: auto;`}>
        <div css={viewControlsBar.widget}>
          <div css={viewControlsBar.label}>From</div>
          <div css={[viewControlsBar.underline, css`min-width: 120px;`]}>
            <Select value={from} onValueChange={onFromChange} disabled={disabled}>
              <SelectTrigger css={bareSelectTrigger}>
                <span css={chip}>{from}</span>
                <span css={dropArrow} />
              </SelectTrigger>
              <SelectContent {...dropdownContentProps}>
                {fromOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div css={[viewControlsBar.widget, css`margin-right: 0;`]}>
          <div css={viewControlsBar.label}>To</div>
          <div css={[viewControlsBar.underline, css`min-width: 120px;`]}>
            <Select value={to} onValueChange={onToChange} disabled={disabled}>
              <SelectTrigger css={bareSelectTrigger}>
                <span css={chip}>{to}</span>
                <span css={dropArrow} />
              </SelectTrigger>
              <SelectContent {...dropdownContentProps}>
                {toOptions.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div css={css`display: flex; align-items: flex-end; gap: 1.5rem; margin-left: auto;`}>
      <div css={viewControlsBar.widget}>
        <div css={viewControlsBar.label}>From</div>
        <DatePickerInput
          value={from}
          onChange={onFromChange}
          disabled={disabled}
        />
      </div>
      <div css={[viewControlsBar.widget, css`margin-right: 0;`]}>
        <div css={viewControlsBar.label}>To</div>
        <DatePickerInput
          value={to}
          onChange={onToChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

const Separator: FC = () => (
  <div css={css`width: 1px; align-self: stretch; background: rgba(0, 0, 0, 0.12); margin: 0 0.25rem 0.5rem;`} />
)

// ─── Custom slot ──────────────────────────────────────────────────────────────

const Custom: FC<{ children: ReactNode }> = ({ children }) => (
  <div css={viewControlsBar.widget}>{children}</div>
)

// ─── Export as compound component ─────────────────────────────────────────────

export const ViewControls = Object.assign(Bar, {
  SegmentBy,
  AggregateBy,
  DisplayBy,
  FilterDropdown,
  FilterBy,
  DateRange,
  Separator,
  Custom,
})
