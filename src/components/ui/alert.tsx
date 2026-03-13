/** @jsxImportSource @emotion/react */
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const alertBaseStyles = css`
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  display: grid;
  grid-template-columns: 0 1fr;
  gap: 0 0.75rem;
  gap: 0.125rem 0;
  align-items: flex-start;

  &:has(> svg) {
    grid-template-columns: calc(var(--spacing) * 4) 1fr;
    gap: 0 0.75rem;
  }

  & > svg {
    width: 1rem;
    height: 1rem;
    transform: translateY(0.125rem);
    color: currentColor;
  }
`;

const alertDefaultStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
`;

const alertDestructiveStyles = css`
  color: #dc2626;
  background-color: oklch(1 0 0);

  & > svg {
    color: currentColor;
  }

  & [data-slot="alert-description"] {
    color: rgba(220, 38, 38, 0.9);
  }
`;

function Alert({
  className,
  variant = "default",
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "destructive";
  css?: Interpolation<Theme>;
}) {
  const variantStyles = variant === "destructive" ? alertDestructiveStyles : alertDefaultStyles;

  return (
    <div
      data-slot="alert"
      role="alert"
      css={[alertBaseStyles, variantStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const alertTitleStyles = css`
  grid-column-start: 2;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 1rem;
  font-weight: 500;
  letter-spacing: -0.025em;
`;

function AlertTitle({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="alert-title"
      css={[alertTitleStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const alertDescriptionStyles = css`
  color: oklch(0.556 0 0);
  grid-column-start: 2;
  display: grid;
  justify-items: flex-start;
  gap: 0.25rem;
  font-size: 0.875rem;

  & p {
    line-height: 1.625;
  }
`;

function AlertDescription({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div
      data-slot="alert-description"
      css={[alertDescriptionStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
