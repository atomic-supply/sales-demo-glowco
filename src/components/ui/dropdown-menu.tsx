/** @jsxImportSource @emotion/react */
"use client";

import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

const dropdownMenuContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  min-width: 8rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0.375rem;
  border: 1px solid oklch(0.922 0 0);
  padding: 0.25rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);

  &[data-state="open"] {
    animation:
      fadeIn 0.15s ease-out,
      zoomIn 0.15s ease-out;
  }

  &[data-state="closed"] {
    animation:
      fadeOut 0.1s ease-in,
      zoomOut 0.1s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoomOut {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }
`;

function DropdownMenuContent({
  className,
  sideOffset = 4,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        css={[dropdownMenuContentStyles, cssProp]}
        className={className}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

const dropdownMenuItemStyles = css`
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

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.205 0 0);
  }

  &[data-variant="destructive"] {
    color: oklch(0.577 0.245 27.325);

    &:focus {
      background-color: oklch(0.577 0.245 27.325 / 0.1);
      color: oklch(0.577 0.245 27.325);
    }

    & svg {
      color: oklch(0.577 0.245 27.325) !important;
    }
  }

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
    width: 1rem;
    height: 1rem;
    color: oklch(0.556 0 0);
  }
`;

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  css?: Interpolation<Theme>;
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      css={[dropdownMenuItemStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dropdownMenuCheckboxItemStyles = css`
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

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.205 0 0);
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }
`;

const checkboxIndicatorStyles = css`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.875rem;
  height: 0.875rem;
`;

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  css?: Interpolation<Theme>;
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      css={[dropdownMenuCheckboxItemStyles, cssProp]}
      className={className}
      checked={checked}
      {...props}
    >
      <span css={checkboxIndicatorStyles}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon
            css={css`
              width: 1rem;
              height: 1rem;
            `}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

const dropdownMenuRadioItemStyles = css`
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

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.205 0 0);
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  & svg {
    pointer-events: none;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }
`;

const radioIndicatorStyles = css`
  pointer-events: none;
  position: absolute;
  left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.875rem;
  height: 0.875rem;
`;

function DropdownMenuRadioItem({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & { css?: Interpolation<Theme> }) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      css={[dropdownMenuRadioItemStyles, cssProp]}
      className={className}
      {...props}
    >
      <span css={radioIndicatorStyles}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon
            css={css`
              width: 0.5rem;
              height: 0.5rem;
              fill: currentColor;
            `}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

const dropdownMenuLabelStyles = css`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;

  &[data-inset] {
    padding-left: 2rem;
  }
`;

function DropdownMenuLabel({
  className,
  inset,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      css={[dropdownMenuLabelStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dropdownMenuSeparatorStyles = css`
  background-color: oklch(0.922 0 0);
  margin: 0.25rem -0.25rem;
  height: 1px;
`;

function DropdownMenuSeparator({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator> & { css?: Interpolation<Theme> }) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      css={[dropdownMenuSeparatorStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const dropdownMenuShortcutStyles = css`
  color: oklch(0.556 0 0);
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
`;

function DropdownMenuShortcut({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"span"> & { css?: Interpolation<Theme> }) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      css={[dropdownMenuShortcutStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

const dropdownMenuSubTriggerStyles = css`
  display: flex;
  cursor: default;
  align-items: center;
  border-radius: 0.125rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  user-select: none;

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.205 0 0);
  }

  &[data-state="open"] {
    background-color: oklch(0.97 0 0);
    color: oklch(0.205 0 0);
  }

  &[data-inset] {
    padding-left: 2rem;
  }
`;

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      css={[dropdownMenuSubTriggerStyles, cssProp]}
      className={className}
      {...props}
    >
      {children}
      <ChevronRightIcon
        css={css`
          margin-left: auto;
          width: 1rem;
          height: 1rem;
        `}
      />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

const dropdownMenuSubContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid oklch(0.922 0 0);
  padding: 0.25rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);

  &[data-state="open"] {
    animation:
      fadeIn 0.15s ease-out,
      zoomIn 0.15s ease-out;
  }

  &[data-state="closed"] {
    animation:
      fadeOut 0.1s ease-in,
      zoomOut 0.1s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoomOut {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }
`;

function DropdownMenuSubContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> & { css?: Interpolation<Theme> }) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      css={[dropdownMenuSubContentStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
