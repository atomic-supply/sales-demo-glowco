/** @jsxImportSource @emotion/react */
"use client";

import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { borders } from "../../styles";

const tableContainerStyles = css`
  position: relative;
  width: 100%;
  overflow-x: auto;
`;

const tableStyles = css`
  width: 100%;
  caption-side: bottom;
  font-size: 0.875rem;
`;

const tableHeaderStyles = css`
  & tr {
    ${borders.bottom}
  }
`;

const tableBodyStyles = css`
  & tr:last-child {
    border: 0;
  }
`;

const tableFooterStyles = css`
  background-color: oklch(0.97 0 0 / 0.5);
  border-top: 1px solid oklch(0.922 0 0);
  font-weight: 500;

  & > tr:last-child {
    border-bottom: 0;
  }
`;

const tableRowStyles = css`
  ${borders.bottom}
  transition: background-color 0.2s;

  &:hover {
    background-color: oklch(0.97 0 0 / 0.5);
  }

  &[data-state="selected"] {
    background-color: oklch(0.97 0 0);
  }
`;

const tableHeadStyles = css`
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: oklch(0.556 0 0);
  border-bottom: 1px solid oklch(0.922 0 0);
  white-space: nowrap;
  vertical-align: middle;

  &:has([role="checkbox"]) {
    padding-right: 0;
  }

  & > [role="checkbox"] {
    transform: translateY(2px);
  }
`;

const tableCellStyles = css`
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
  white-space: nowrap;

  &:has([role="checkbox"]) {
    padding-right: 0;
  }

  & > [role="checkbox"] {
    transform: translateY(2px);
  }
`;

const tableCaptionStyles = css`
  color: oklch(0.556 0 0);
  margin-top: 1rem;
  font-size: 0.875rem;
`;

function Table({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"table"> & { css?: Interpolation<Theme> }) {
  return (
    <div data-slot="table-container" css={tableContainerStyles}>
      <table data-slot="table" css={[tableStyles, cssProp]} className={className} {...props} />
    </div>
  );
}

function TableHeader({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"thead"> & { css?: Interpolation<Theme> }) {
  return (
    <thead
      data-slot="table-header"
      css={[tableHeaderStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function TableBody({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"tbody"> & { css?: Interpolation<Theme> }) {
  return (
    <tbody
      data-slot="table-body"
      css={[tableBodyStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function TableFooter({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"tfoot"> & { css?: Interpolation<Theme> }) {
  return (
    <tfoot
      data-slot="table-footer"
      css={[tableFooterStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function TableRow({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"tr"> & { css?: Interpolation<Theme> }) {
  return (
    <tr data-slot="table-row" css={[tableRowStyles, cssProp]} className={className} {...props} />
  );
}

function TableHead({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"th"> & { css?: Interpolation<Theme> }) {
  return (
    <th data-slot="table-head" css={[tableHeadStyles, cssProp]} className={className} {...props} />
  );
}

function TableCell({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"td"> & { css?: Interpolation<Theme> }) {
  return (
    <td data-slot="table-cell" css={[tableCellStyles, cssProp]} className={className} {...props} />
  );
}

function TableCaption({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"caption"> & { css?: Interpolation<Theme> }) {
  return (
    <caption
      data-slot="table-caption"
      css={[tableCaptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
