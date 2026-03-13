/** @jsxImportSource @emotion/react */
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import { borders } from "../../styles";

const cardStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 0.75rem;
  ${borders.standard}
  padding: 1.5rem 0;
`;

const cardHeaderStyles = css`
  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  gap: 0.375rem;
  padding: 0 1.5rem;

  &:has([data-slot="card-action"]) {
    grid-template-columns: 1fr auto;
  }

  &.border-b {
    padding-bottom: 1.5rem;
  }
`;

const cardTitleStyles = css`
  line-height: 1;
  font-weight: 600;
  font-size: 1.125rem;
  color: #111827;
`;

const cardDescriptionStyles = css`
  color: oklch(0.556 0 0);
  font-size: 0.875rem;
`;

const cardActionStyles = css`
  grid-column-start: 2;
  grid-row: 1 / span 2;
  align-self: start;
  justify-self: end;
`;

const cardContentStyles = css`
  padding: 0 1.5rem;
`;

const cardFooterStyles = css`
  display: flex;
  align-items: center;
  padding: 0 1.5rem;

  &.border-t {
    padding-top: 1.5rem;
  }
`;

function Card({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return <div data-slot="card" css={[cardStyles, cssProp]} className={className} {...props} />;
}

function CardHeader({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="card-header"
      css={[cardHeaderStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function CardTitle({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div data-slot="card-title" css={[cardTitleStyles, cssProp]} className={className} {...props} />
  );
}

function CardDescription({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="card-description"
      css={[cardDescriptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function CardAction({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="card-action"
      css={[cardActionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function CardContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="card-content"
      css={[cardContentStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function CardFooter({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="card-footer"
      css={[cardFooterStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
