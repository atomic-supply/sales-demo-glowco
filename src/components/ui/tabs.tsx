/** @jsxImportSource @emotion/react */
"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const tabsRootStyles = css`
  display: flex;
  flex-direction: column;
`;

function Tabs({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      css={[tabsRootStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const tabsListStyles = css`
  background-color: oklch(0.97 0 0);
  color: oklch(0.556 0 0);
  display: inline-flex;
  height: 2.25rem;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 3px;
`;

function TabsList({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { css?: Interpolation<Theme> }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      css={[tabsListStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const tabsTriggerStyles = css`
  display: inline-flex;
  height: calc(100% - 1px);
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition:
    color 0.2s,
    box-shadow 0.2s;

  &[data-state="active"] {
    background-color: oklch(1 0 0);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  color: oklch(0.145 0 0);

  &:focus-visible {
    border-color: oklch(0.556 0 0);
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
    outline: 1px solid oklch(0.556 0 0);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;

    &:not([class*="size-"]) {
      width: 1rem;
      height: 1rem;
    }
  }
`;

function TabsTrigger({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & { css?: Interpolation<Theme> }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      css={[tabsTriggerStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const tabsContentStyles = css`
  flex: 1;
  outline: none;

  &[data-state="inactive"] {
    display: none;
  }
`;

function TabsContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      css={[tabsContentStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
