/** @jsxImportSource @emotion/react */
"use client";

import { GripVerticalIcon } from "lucide-react";
import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const resizablePanelGroupStyles = css`
  display: flex;
  height: 100%;
  width: 100%;

  &[data-panel-group-direction="vertical"] {
    flex-direction: column;
  }
`;

function ResizablePanelGroup({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup> & { css?: Interpolation<Theme> }) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      css={[resizablePanelGroupStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

const resizableHandleStyles = css`
  background-color: #e5e7eb;
  position: relative;
  display: flex;
  width: 1px;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    left: 50%;
    width: 0.25rem;
    transform: translateX(-50%);
  }

  &:focus-visible {
    box-shadow:
      0 0 0 1px oklch(0.556 0 0),
      0 0 0 2px oklch(0.556 0 0 / 0.2);
    outline: none;
  }

  &[data-panel-group-direction="vertical"] {
    height: 1px;
    width: 100%;

    &::after {
      left: 0;
      height: 0.25rem;
      width: 100%;
      transform: translateY(-50%);
    }

    & > div {
      transform: rotate(90deg);
    }
  }
`;

const resizableHandleInnerStyles = css`
  background-color: #e5e7eb;
  z-index: 10;
  display: flex;
  height: 1rem;
  width: 0.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid #e5e7eb;
`;

const gripIconStyles = css`
  width: 0.625rem;
  height: 0.625rem;
`;

function ResizableHandle({
  withHandle,
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      css={[resizableHandleStyles, cssProp]}
      className={className}
      {...props}
    >
      {withHandle && (
        <div css={resizableHandleInnerStyles}>
          <GripVerticalIcon css={gripIconStyles} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
