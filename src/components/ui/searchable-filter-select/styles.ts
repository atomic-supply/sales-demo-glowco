import { css } from "@emotion/react";
import { borders } from "../../../styles";

export const containerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const containerInlineStyles = css`
  display: inline-flex;
  flex-direction: column;
`;

export const labelStyles = css`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  line-height: 1;
`;

export const triggerBaseStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  min-width: 6rem;
  max-width: 9rem;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  height: 1.75rem;
  border-radius: 0.25rem;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 1px;
  }
`;

export const triggerInlineStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  height: 1.625rem;
  border-radius: 0.375rem;
  ${borders.standard}
  background-color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: #9ca3af;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 1px;
  }
`;

export const triggerInlineInactiveStyles = css`
  color: #6b7280;
`;

export const triggerInlineActiveStyles = css`
  border-color: #3b82f6;
  color: #1e40af;
`;

export const triggerInactiveStyles = css`
  background-color: white;
  border-color: #d1d5db;
  color: #374151;

  &:hover:not(:disabled) {
    border-color: #9ca3af;
  }
`;

export const triggerActiveStyles = css`
  background-color: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
`;

export const inlineLabelStyles = css`
  font-weight: 500;
  color: #6b7280;
`;

export const inlineValueStyles = css`
  font-weight: 500;
`;

export const triggerTextStyles = css`
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: left;
`;

export const chevronStyles = css`
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  opacity: 0.5;
`;

export const clearIconStyles = css`
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  padding: 0.0625rem;
  border-radius: 0.125rem;
  color: #1e40af;
  opacity: 0.7;
  transition: all 0.15s ease;

  &:hover {
    opacity: 1;
    background-color: rgba(59, 130, 246, 0.2);
  }
`;

export const popoverContentStyles = css`
  min-width: 200px;
  max-width: 320px;
  width: max-content;
  padding: 0;
  z-index: 9999;
  margin-top: 2px;
  ${borders.standard}
  border-radius: 0.5rem;
  background: white;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

export const searchWrapperStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  ${borders.bottom}
`;

export const searchIconStyles = css`
  width: 0.875rem;
  height: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`;

export const searchInputStyles = css`
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.8125rem;
  color: #374151;
  background: transparent;

  &::placeholder {
    color: #9ca3af;
  }
`;

export const clearButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  background: #f3f4f6;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #6b7280;
  flex-shrink: 0;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

export const resultCountStyles = css`
  font-size: 0.6875rem;
  color: #9ca3af;
  padding: 0.25rem 0.75rem;
  ${borders.bottom}
`;

export const commandListStyles = css`
  max-height: 240px;
  overflow-y: auto;
`;

export const itemStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  cursor: pointer;
  border-radius: 0.25rem;
  margin: 0.125rem 0.25rem;

  &[data-selected="true"] {
    background: #f3f4f6;
  }

  &:hover {
    background: #f9fafb;
  }

  /* Handle long text with ellipsis */
  & > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 250px;
  }
`;

export const checkIconStyles = css`
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
`;

export const allOptionStyles = css`
  color: #6b7280;
  font-style: italic;
`;
