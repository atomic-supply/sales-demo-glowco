/** @jsxImportSource @emotion/react */
"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const progressRootStyles = css`
  background-color: oklch(0.205 0 0 / 0.2);
  position: relative;
  height: 0.5rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
`;

const progressIndicatorStyles = css`
  background-color: oklch(0.205 0 0);
  height: 100%;
  width: 100%;
  flex: 1;
  transition: all 0.2s;
`;

function Progress({
  className,
  value,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      css={[progressRootStyles, cssProp]}
      className={className}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        css={progressIndicatorStyles}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
