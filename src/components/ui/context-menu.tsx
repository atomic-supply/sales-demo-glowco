/** @jsxImportSource @emotion/react */
"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}

function ContextMenuGroup({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuPortal({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />;
}

function ContextMenuSub({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

const contextMenuSubTriggerStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  &[data-state="open"] {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  display: flex;
  cursor: default;
  align-items: center;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  user-select: none;

  &[data-inset] {
    padding-left: 2rem;
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

const chevronRightIconStyles = css`
  margin-left: auto;
`;

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      css={[contextMenuSubTriggerStyles, cssProp]}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon css={chevronRightIconStyles} />
    </ContextMenuPrimitive.SubTrigger>
  );
}

const contextMenuSubContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  min-width: 8rem;
  transform-origin: var(--radix-context-menu-content-transform-origin);
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);

  &[data-state="open"] {
    animation:
      fade-in 0.2s,
      zoom-in 0.2s;
  }

  &[data-state="closed"] {
    animation:
      fade-out 0.2s,
      zoom-out 0.2s;
  }

  &[data-side="bottom"] {
    animation-name: slide-in-from-top-2;
  }

  &[data-side="left"] {
    animation-name: slide-in-from-right-2;
  }

  &[data-side="right"] {
    animation-name: slide-in-from-left-2;
  }

  &[data-side="top"] {
    animation-name: slide-in-from-bottom-2;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoom-in {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoom-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }

  @keyframes slide-in-from-top-2 {
    from {
      transform: translateY(-0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-in-from-right-2 {
    from {
      transform: translateX(0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-left-2 {
    from {
      transform: translateX(-0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-bottom-2 {
    from {
      transform: translateY(0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }
`;

function ContextMenuSubContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent> & { css?: Interpolation<Theme> }) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      css={[contextMenuSubContentStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const contextMenuContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  max-height: var(--radix-context-menu-content-available-height);
  min-width: 8rem;
  transform-origin: var(--radix-context-menu-content-transform-origin);
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);

  &[data-state="open"] {
    animation:
      fade-in 0.2s,
      zoom-in 0.2s;
  }

  &[data-state="closed"] {
    animation:
      fade-out 0.2s,
      zoom-out 0.2s;
  }

  &[data-side="bottom"] {
    animation-name: slide-in-from-top-2;
  }

  &[data-side="left"] {
    animation-name: slide-in-from-right-2;
  }

  &[data-side="right"] {
    animation-name: slide-in-from-left-2;
  }

  &[data-side="top"] {
    animation-name: slide-in-from-bottom-2;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoom-in {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoom-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }

  @keyframes slide-in-from-top-2 {
    from {
      transform: translateY(-0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-in-from-right-2 {
    from {
      transform: translateX(0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-left-2 {
    from {
      transform: translateX(-0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-bottom-2 {
    from {
      transform: translateY(0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }
`;

function ContextMenuContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        css={[contextMenuContentStyles, cssProp]}
        className={className}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

const contextMenuItemStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  &[data-variant="destructive"] {
    color: #dc2626;

    &:focus {
      background-color: rgba(220, 38, 38, 0.1);
      color: #dc2626;
    }

    & svg {
      color: #dc2626 !important;
    }
  }

  & svg:not([class*="text-"]) {
    color: oklch(0.556 0 0);
  }

  position: relative;
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  user-select: none;

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-inset] {
    padding-left: 2rem;
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

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  css?: Interpolation<Theme>;
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      css={[contextMenuItemStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const contextMenuCheckboxItemStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  position: relative;
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem 0.375rem 2rem;
  font-size: 0.875rem;
  outline: none;
  user-select: none;

  &[data-disabled] {
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

const checkboxIndicatorStyles = css`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

const checkIconStyles = css`
  width: 1rem;
  height: 1rem;
`;

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> & {
  css?: Interpolation<Theme>;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      css={[contextMenuCheckboxItemStyles, cssProp]}
      className={className}
      checked={checked}
      {...props}
    >
      <span css={checkboxIndicatorStyles}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon css={checkIconStyles} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

const contextMenuRadioItemStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  position: relative;
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem 0.375rem 2rem;
  font-size: 0.875rem;
  outline: none;
  user-select: none;

  &[data-disabled] {
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

const radioIndicatorStyles = css`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

const circleIconStyles = css`
  width: 0.5rem;
  height: 0.5rem;
  fill: currentColor;
`;

function ContextMenuRadioItem({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> & { css?: Interpolation<Theme> }) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      css={[contextMenuRadioItemStyles, cssProp]}
      className={className}
      {...props}
    >
      <span css={radioIndicatorStyles}>
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon css={circleIconStyles} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

const contextMenuLabelStyles = css`
  color: oklch(0.145 0 0);
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;

  &[data-inset] {
    padding-left: 2rem;
  }
`;

function ContextMenuLabel({
  className,
  inset,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      css={[contextMenuLabelStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const contextMenuSeparatorStyles = css`
  background-color: #e5e7eb;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  height: 1px;
`;

function ContextMenuSeparator({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator> & { css?: Interpolation<Theme> }) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      css={[contextMenuSeparatorStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const contextMenuShortcutStyles = css`
  color: oklch(0.556 0 0);
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
`;

function ContextMenuShortcut({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"span"> & { css?: Interpolation<Theme> }) {
  return (
    <span
      data-slot="context-menu-shortcut"
      css={[contextMenuShortcutStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
