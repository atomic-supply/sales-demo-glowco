/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Search } from "lucide-react";
import { theme } from "../../styles/theme/theme";
import type { ModuleId } from "./types";

/* ------------------------------------------------------------------ */
/*  Segment options per module                                          */
/* ------------------------------------------------------------------ */

const SEGMENT_OPTIONS: Record<ModuleId, { value: string; label: string }[]> = {
  consumption: [
    { value: "channel", label: "Channel" },
    { value: "sku", label: "SKU" },
  ],
  shipments: [
    { value: "sku", label: "SKU" },
    { value: "channel", label: "Channel" },
    { value: "shipTo", label: "Ship-To" },
  ],
  production: [
    { value: "formulation", label: "Formulation" },
    { value: "coManSite", label: "Co-Man Site" },
  ],
  kitting: [
    { value: "packConfig", label: "Pack Config" },
    { value: "formulation", label: "Formulation" },
  ],
  mrp: [
    { value: "material", label: "Material" },
    { value: "site", label: "Site" },
  ],
  allocation: [
    { value: "sku", label: "SKU" },
    { value: "warehouse", label: "Warehouse" },
  ],
};

const DISPLAY_OPTIONS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const UOM_OPTIONS = [
  { value: "sticks", label: "Sticks" },
  { value: "units", label: "Units" },
  { value: "dollars", label: "Dollars" },
];

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

export interface StageViewFilterBarProps {
  moduleId: ModuleId;
  displayBy: "week" | "month";
  onDisplayByChange: (value: "week" | "month") => void;
  segmentBy: string;
  onSegmentByChange: (value: string) => void;
  unitOfMeasure: string;
  onUnitOfMeasureChange: (value: string) => void;
  searchText: string;
  onSearchChange: (value: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const barStyles = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: ${theme.colors.gray50};
  border-bottom: 1px solid ${theme.colors.gray200};
  border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const groupStyles = css`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const labelStyles = css`
  font-size: 11px;
  color: ${theme.colors.gray500};
  white-space: nowrap;
  font-weight: ${theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const chipSelectStyles = css`
  appearance: none;
  border: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.white};
  border-radius: 999px;
  padding: 3px 24px 3px 10px;
  font-size: 12px;
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.gray700};
  cursor: pointer;
  outline: none;
  min-height: 26px;
  transition: border-color 0.15s, box-shadow 0.15s;

  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 10px 6px;

  &:hover {
    border-color: ${theme.colors.gray400};
  }

  &:focus {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
`;

const searchWrapStyles = css`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  border: 1px solid ${theme.colors.gray200};
  background: ${theme.colors.white};
  border-radius: 999px;
  padding: 3px 10px;
  min-height: 26px;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: ${theme.colors.blue500};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
  }
`;

const searchInputStyles = css`
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.gray700};
  width: 140px;
  min-width: 80px;

  &::placeholder {
    color: ${theme.colors.gray400};
  }
`;

const separatorStyles = css`
  width: 1px;
  height: 20px;
  background: ${theme.colors.gray200};
  flex-shrink: 0;
`;

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function StageViewFilterBar({
  moduleId,
  displayBy,
  onDisplayByChange,
  segmentBy,
  onSegmentByChange,
  unitOfMeasure,
  onUnitOfMeasureChange,
  searchText,
  onSearchChange,
}: StageViewFilterBarProps) {
  const segmentOptions = SEGMENT_OPTIONS[moduleId] ?? [];

  return (
    <div css={barStyles}>
      {/* Display By */}
      <div css={groupStyles}>
        <span css={labelStyles}>Display</span>
        <select
          css={chipSelectStyles}
          value={displayBy}
          onChange={(e) => onDisplayByChange(e.target.value as "week" | "month")}
        >
          {DISPLAY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div css={separatorStyles} />

      {/* Segment By */}
      <div css={groupStyles}>
        <span css={labelStyles}>Segment</span>
        <select
          css={chipSelectStyles}
          value={segmentBy}
          onChange={(e) => onSegmentByChange(e.target.value)}
        >
          {segmentOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div css={separatorStyles} />

      {/* Unit of Measure */}
      <div css={groupStyles}>
        <span css={labelStyles}>UoM</span>
        <select
          css={chipSelectStyles}
          value={unitOfMeasure}
          onChange={(e) => onUnitOfMeasureChange(e.target.value)}
        >
          {UOM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div css={searchWrapStyles}>
        <Search size={13} color={theme.colors.gray400} />
        <input
          css={searchInputStyles}
          type="text"
          placeholder="Filter rows..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
