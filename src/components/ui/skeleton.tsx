/** @jsxImportSource @emotion/react */
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const skeletonStyles = css`
  background-color: oklch(0.97 0 0);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  border-radius: 0.375rem;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

function Skeleton({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"div"> & { css?: Interpolation<Theme> }) {
  return (
    <div data-slot="skeleton" css={[skeletonStyles, cssProp]} className={className} {...props} />
  );
}

export { Skeleton };
