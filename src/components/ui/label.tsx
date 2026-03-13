/** @jsxImportSource @emotion/react */
"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const labelStyles = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
  font-weight: 500;
  user-select: none;

  &[data-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-peer-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

function Label({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      css={[labelStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Label };
