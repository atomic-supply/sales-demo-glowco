/** @jsxImportSource @emotion/react */
"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const menubarRootStyles = css`
  background-color: oklch(1 0 0);
  display: flex;
  height: 2.25rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
`;

function Menubar({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      css={[menubarRootStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({ ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

const menubarTriggerStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  &[data-state="open"] {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  display: flex;
  align-items: center;
  border-radius: 0.125rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  user-select: none;
`;

function MenubarTrigger({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      css={[menubarTriggerStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const menubarContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  min-width: 12rem;
  transform-origin: var(--radix-menubar-content-transform-origin);
  overflow: hidden;
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

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        css={[menubarContentStyles, cssProp]}
        className={className}
        {...props}
      />
    </MenubarPortal>
  );
}

const menubarItemStyles = css`
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

function MenubarItem({
  className,
  inset,
  variant = "default",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  css?: Interpolation<Theme>;
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      css={[menubarItemStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const menubarCheckboxItemStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  position: relative;
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 2px;
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

const menubarCheckboxIndicatorStyles = css`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

function MenubarCheckboxItem({
  className,
  children,
  checked,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      css={[menubarCheckboxItemStyles, cssProp]}
      className={className}
      checked={checked}
      {...props}
    >
      <span css={menubarCheckboxIndicatorStyles}>
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon
            css={css`
              width: 1rem;
              height: 1rem;
            `}
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

const menubarRadioItemStyles = css`
  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  position: relative;
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 2px;
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

const menubarRadioIndicatorStyles = css`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

function MenubarRadioItem({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      css={[menubarRadioItemStyles, cssProp]}
      className={className}
      {...props}
    >
      <span css={menubarRadioIndicatorStyles}>
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon
            css={css`
              width: 0.5rem;
              height: 0.5rem;
              fill: currentColor;
            `}
          />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

const menubarLabelStyles = css`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;

  &[data-inset] {
    padding-left: 2rem;
  }
`;

function MenubarLabel({
  className,
  inset,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      css={[menubarLabelStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const menubarSeparatorStyles = css`
  background-color: #e5e7eb;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  height: 1px;
`;

function MenubarSeparator({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      css={[menubarSeparatorStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const menubarShortcutStyles = css`
  color: oklch(0.556 0 0);
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
`;

function MenubarShortcut({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"span"> & { css?: Interpolation<Theme> }) {
  return (
    <span
      data-slot="menubar-shortcut"
      css={[menubarShortcutStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function MenubarSub({ ...props }: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

const menubarSubTriggerStyles = css`
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
`;

const chevronRightIconStyles = css`
  margin-left: auto;
  height: 1rem;
  width: 1rem;
`;

function MenubarSubTrigger({
  className,
  inset,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      css={[menubarSubTriggerStyles, cssProp]}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon css={chevronRightIconStyles} />
    </MenubarPrimitive.SubTrigger>
  );
}

const menubarSubContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  min-width: 8rem;
  transform-origin: var(--radix-menubar-content-transform-origin);
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

function MenubarSubContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent> & { css?: Interpolation<Theme> }) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      css={[menubarSubContentStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
