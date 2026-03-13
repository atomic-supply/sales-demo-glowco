/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { Search, X, Check } from "lucide-react"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react"

interface SearchableDropdownProps {
  options: { value: string; label: string }[]
  onSelect: (value: string) => void
  /** Show checkmarks next to these values (for multi-select display) */
  selectedValues?: string[]
  disabled?: boolean
  /** Max items to show before "type to narrow" hint */
  maxDisplayed?: number
  children: ReactNode
}

const overlay = css`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  margin-top: 4px;
  min-width: 200px;
  max-width: 320px;
  width: max-content;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`

const searchRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`

const searchInput = css`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: #374151;
  background: transparent;
  &::placeholder { color: #9ca3af; }
`

const listWrap = css`
  max-height: 240px;
  overflow-y: auto;
`

const itemRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  cursor: pointer;
  border-radius: 0.25rem;
  margin: 0.125rem 0.25rem;
  &:hover { background: #f9fafb; }
  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const checkIcon = css`
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
`

const hintRow = css`
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.25rem;
`

export const SearchableDropdown: FC<SearchableDropdownProps> = ({
  options,
  onSelect,
  selectedValues = [],
  disabled = false,
  maxDisplayed = 20,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase().trim()
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
  }, [options, search])

  const sorted = useMemo(() => {
    const sel = filtered.filter((o) => selectedValues.includes(o.value))
    const rest = filtered.filter((o) => !selectedValues.includes(o.value))
    const cmp = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label)
    sel.sort(cmp)
    rest.sort(cmp)
    return [...sel, ...rest]
  }, [filtered, selectedValues])

  const displayed = sorted.slice(0, maxDisplayed)
  const hasMore = sorted.length > maxDisplayed

  const handleSelect = useCallback(
    (val: string) => {
      onSelect(val)
      setSearch("")
      setOpen(false)
    },
    [onSelect],
  )

  const toggle = useCallback(() => {
    if (!disabled) setOpen((p) => !p)
  }, [disabled])

  return (
    <div ref={containerRef} css={css`display: inline-flex;`}>
      <div
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggle() }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        css={css`display: inline-flex; cursor: ${disabled ? "not-allowed" : "pointer"};`}
      >
        {children}
      </div>

      {open && (
        <div css={overlay}>
          <div css={searchRow}>
            <Search css={css`width: 0.875rem; height: 0.875rem; color: #9ca3af; flex-shrink: 0;`} />
            <input
              ref={inputRef}
              type="text"
              css={searchInput}
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                css={css`
                  display: flex; align-items: center; justify-content: center;
                  width: 1.25rem; height: 1.25rem; border: none;
                  background: #f3f4f6; border-radius: 0.25rem; cursor: pointer;
                  color: #6b7280; flex-shrink: 0;
                  &:hover { background: #e5e7eb; color: #374151; }
                `}
                onClick={() => { setSearch(""); inputRef.current?.focus() }}
              >
                <X css={css`width: 0.75rem; height: 0.75rem;`} />
              </button>
            )}
          </div>

          {search && (
            <div css={css`font-size: 0.6875rem; color: #9ca3af; padding: 0.25rem 0.75rem; border-bottom: 1px solid #e5e7eb;`}>
              {sorted.length === 0 ? "No matches" : hasMore ? `Showing ${maxDisplayed} of ${sorted.length}` : `${sorted.length} match${sorted.length === 1 ? "" : "es"}`}
            </div>
          )}

          <div css={listWrap} role="listbox">
            {sorted.length === 0 && search ? (
              <div css={css`padding: 1.5rem 0; text-align: center; font-size: 0.875rem; color: #6b7280;`}>No results</div>
            ) : (
              <>
                {displayed.map((opt) => {
                  const selected = selectedValues.includes(opt.value)
                  return (
                    <div key={opt.value} css={itemRow} onClick={() => handleSelect(opt.value)} role="option" aria-selected={selected}>
                      <Check css={[checkIcon, css`opacity: ${selected ? 1 : 0};`]} />
                      <span>{opt.label}</span>
                    </div>
                  )
                })}
                {hasMore && <div css={hintRow}>Type to narrow {sorted.length - maxDisplayed} more</div>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
