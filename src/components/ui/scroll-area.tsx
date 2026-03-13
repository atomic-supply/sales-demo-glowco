/** @jsxImportSource @emotion/react */
"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const scrollAreaRootStyles = css`
  position: relative;
`;

const scrollAreaViewportStyles = css`
  width: 100%;
  height: 100%;
  border-radius: inherit;
  transition:
    color 0.2s,
    box-shadow 0.2s;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
    outline: 1px solid oklch(0.556 0 0);
  }
`;

const scrollBarStyles = css`
  display: flex;
  touch-action: none;
  padding: 1px;
  transition: background-color 0.2s;
  user-select: none;

  &[data-orientation="vertical"] {
    height: 100%;
    width: 0.625rem;
    border-left: 1px solid transparent;
  }

  &[data-orientation="horizontal"] {
    height: 0.625rem;
    flex-direction: column;
    border-top: 1px solid transparent;
  }
`;

const scrollBarThumbStyles = css`
  background-color: #e5e7eb;
  position: relative;
  flex: 1;
  border-radius: 9999px;
`;

function ScrollArea({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      css={[scrollAreaRootStyles, cssProp]}
      className={className}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport data-slot="scroll-area-viewport" css={scrollAreaViewportStyles}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
  css?: Interpolation<Theme>;
}) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      css={[scrollBarStyles, cssProp]}
      className={className}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        css={scrollBarThumbStyles}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
