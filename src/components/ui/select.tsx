/** @jsxImportSource @emotion/react */
"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

const selectTriggerStyles = css`
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  white-space: nowrap;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition:
    color 0.2s,
    box-shadow 0.2s;
  outline: none;

  &[data-placeholder] {
    color: oklch(0.556 0 0);
  }

  & svg:not([class*="text-"]) {
    color: oklch(0.556 0 0);
  }

  &:focus-visible {
    border-color: oklch(0.556 0 0);
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
  }

  &[aria-invalid="true"] {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-size="default"] {
    height: 2.25rem;
  }

  &[data-size="sm"] {
    height: 2rem;
  }

  & [data-slot="select-value"] {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

const chevronIconStyles = css`
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
`;

function SelectTrigger({
  className,
  size = "default",
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
  css?: Interpolation<Theme>;
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      css={[selectTriggerStyles, cssProp]}
      className={className}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon css={chevronIconStyles} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

const selectContentStyles = css`
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  position: relative;
  z-index: 50;
  max-height: var(--radix-select-content-available-height);
  min-width: 8rem;
  transform-origin: var(--radix-select-content-transform-origin);
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
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

const selectContentPopperStyles = css`
  &[data-side="bottom"] {
    transform: translateY(0.25rem);
  }

  &[data-side="left"] {
    transform: translateX(-0.25rem);
  }

  &[data-side="right"] {
    transform: translateX(0.25rem);
  }

  &[data-side="top"] {
    transform: translateY(-0.25rem);
  }
`;

const selectViewportStyles = css`
  padding: 0.25rem;
`;

const selectViewportPopperStyles = css`
  height: var(--radix-select-trigger-height);
  width: 100%;
  min-width: var(--radix-select-trigger-width);
  scroll-margin: 0.25rem;
`;

function SelectContent({
  className,
  children,
  position = "popper",
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        css={[selectContentStyles, position === "popper" && selectContentPopperStyles, cssProp]}
        className={className}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          css={[selectViewportStyles, position === "popper" && selectViewportPopperStyles]}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

const selectLabelStyles = css`
  color: oklch(0.556 0 0);
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
`;

function SelectLabel({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label> & { css?: Interpolation<Theme> }) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      css={[selectLabelStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const selectItemStyles = css`
  position: relative;
  display: flex;
  width: 100%;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
  padding: 0.375rem 2rem 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  user-select: none;

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  & svg:not([class*="text-"]) {
    color: oklch(0.556 0 0);
  }

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

  & span:last-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const selectItemIndicatorStyles = css`
  position: absolute;
  right: 0.5rem;
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

function SelectItem({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & { css?: Interpolation<Theme> }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      css={[selectItemStyles, cssProp]}
      className={className}
      {...props}
    >
      <span css={selectItemIndicatorStyles}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon css={checkIconStyles} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

const selectSeparatorStyles = css`
  background-color: #e5e7eb;
  pointer-events: none;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  height: 1px;
`;

function SelectSeparator({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator> & { css?: Interpolation<Theme> }) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      css={[selectSeparatorStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const selectScrollButtonStyles = css`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
`;

function SelectScrollUpButton({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> & { css?: Interpolation<Theme> }) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      css={[selectScrollButtonStyles, cssProp]}
      className={className}
      {...props}
    >
      <ChevronUpIcon
        css={css`
          width: 1rem;
          height: 1rem;
        `}
      />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton> & { css?: Interpolation<Theme> }) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      css={[selectScrollButtonStyles, cssProp]}
      className={className}
      {...props}
    >
      <ChevronDownIcon
        css={css`
          width: 1rem;
          height: 1rem;
        `}
      />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
