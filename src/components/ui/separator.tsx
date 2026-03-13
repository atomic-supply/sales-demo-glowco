/** @jsxImportSource @emotion/react */
"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const separatorStyles = css`
  background-color: oklch(0.922 0 0);
  flex-shrink: 0;

  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation="vertical"] {
    height: 100%;
    width: 1px;
  }
`;

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      css={[separatorStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Separator };
