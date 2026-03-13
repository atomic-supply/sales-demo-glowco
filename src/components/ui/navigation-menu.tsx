/** @jsxImportSource @emotion/react */
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const navigationMenuRootStyles = css`
  position: relative;
  display: flex;
  max-width: max-content;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

function NavigationMenu({
  className,
  children,
  viewport = true,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
  css?: Interpolation<Theme>;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      css={[navigationMenuRootStyles, cssProp]}
      className={className}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

const navigationMenuListStyles = css`
  display: flex;
  flex: 1;
  list-style: none;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

function NavigationMenuList({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List> & { css?: Interpolation<Theme> }) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      css={[navigationMenuListStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const navigationMenuItemStyles = css`
  position: relative;
`;

function NavigationMenuItem({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item> & { css?: Interpolation<Theme> }) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      css={[navigationMenuItemStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const navigationMenuTriggerStyles = css`
  display: inline-flex;
  height: 2.25rem;
  width: max-content;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: oklch(1 0 0);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state="open"] {
    background-color: oklch(0.97 0 0 / 0.5);

    &:hover {
      background-color: oklch(0.97 0 0);
    }

    &:focus {
      background-color: oklch(0.97 0 0);
    }
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
    outline: 1px solid oklch(0.556 0 0);
  }

  transition:
    color 0.2s,
    box-shadow 0.2s;
`;

const chevronDownIconStyles = css`
  position: relative;
  top: 1px;
  margin-left: 0.25rem;
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 0.3s;

  [data-state="open"] & {
    transform: rotate(180deg);
  }
`;

function NavigationMenuTrigger({
  className,
  children,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & { css?: Interpolation<Theme> }) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      css={[navigationMenuTriggerStyles, cssProp]}
      className={className}
      {...props}
    >
      {children} <ChevronDownIcon css={chevronDownIconStyles} aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

const navigationMenuContentStyles = css`
  &[data-motion^="from-"] {
    animation: fade-in 0.2s;
  }

  &[data-motion^="to-"] {
    animation: fade-out 0.2s;
  }

  &[data-motion="from-end"] {
    animation-name: slide-in-from-right-52;
  }

  &[data-motion="from-start"] {
    animation-name: slide-in-from-left-52;
  }

  &[data-motion="to-end"] {
    animation-name: slide-out-to-right-52;
  }

  &[data-motion="to-start"] {
    animation-name: slide-out-to-left-52;
  }

  top: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem;
  padding-right: 0.625rem;

  @media (min-width: 768px) {
    position: absolute;
    width: auto;
  }

  .group-data-[viewport="false"]/navigation-menu & {
    background-color: oklch(1 0 0);
    color: oklch(0.145 0 0);

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

    top: 100%;
    margin-top: 0.375rem;
    overflow: hidden;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    transition-duration: 0.2s;

    & [data-slot="navigation-menu-link"]:focus {
      box-shadow: none;
      outline: none;
    }
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

  @keyframes slide-in-from-right-52 {
    from {
      transform: translateX(13rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-in-from-left-52 {
    from {
      transform: translateX(-13rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slide-out-to-right-52 {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(13rem);
    }
  }

  @keyframes slide-out-to-left-52 {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-13rem);
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
`;

function NavigationMenuContent({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content> & { css?: Interpolation<Theme> }) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      css={[navigationMenuContentStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const navigationMenuViewportWrapperStyles = css`
  position: absolute;
  top: 100%;
  left: 0;
  isolation: isolate;
  z-index: 50;
  display: flex;
  justify-content: center;
`;

const navigationMenuViewportStyles = css`
  transform-origin: top center;
  background-color: oklch(1 0 0);
  color: oklch(0.145 0 0);
  position: relative;
  margin-top: 0.375rem;
  height: var(--radix-navigation-menu-viewport-height);
  width: 100%;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);

  @media (min-width: 768px) {
    width: var(--radix-navigation-menu-viewport-width);
  }

  &[data-state="open"] {
    animation: zoom-in-90 0.2s;
  }

  &[data-state="closed"] {
    animation: zoom-out-95 0.2s;
  }

  @keyframes zoom-in-90 {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes zoom-out-95 {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.95);
    }
  }
`;

function NavigationMenuViewport({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> & { css?: Interpolation<Theme> }) {
  return (
    <div css={navigationMenuViewportWrapperStyles}>
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        css={[navigationMenuViewportStyles, cssProp]}
        className={className}
        {...props}
      />
    </div>
  );
}

const navigationMenuLinkStyles = css`
  &[data-active="true"] {
    background-color: oklch(0.97 0 0 / 0.5);
    color: oklch(0.145 0 0);

    &:hover {
      background-color: oklch(0.97 0 0);
    }

    &:focus {
      background-color: oklch(0.97 0 0);
    }
  }

  &:hover {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  &:focus {
    background-color: oklch(0.97 0 0);
    color: oklch(0.145 0 0);
  }

  & svg:not([class*="text-"]) {
    color: oklch(0.556 0 0);
  }

  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: 0.125rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px oklch(0.556 0 0 / 0.5);
    outline: 1px solid oklch(0.556 0 0);
  }

  & svg:not([class*="size-"]) {
    width: 1rem;
    height: 1rem;
  }
`;

function NavigationMenuLink({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link> & { css?: Interpolation<Theme> }) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      css={[navigationMenuLinkStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const navigationMenuIndicatorStyles = css`
  &[data-state="visible"] {
    animation: fade-in 0.2s;
  }

  &[data-state="hidden"] {
    animation: fade-out 0.2s;
  }

  top: 100%;
  z-index: 1;
  display: flex;
  height: 0.375rem;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;

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
`;

const navigationMenuIndicatorInnerStyles = css`
  background-color: #e5e7eb;
  position: relative;
  top: 60%;
  height: 0.5rem;
  width: 0.5rem;
  transform: rotate(45deg);
  border-top-left-radius: 2px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

function NavigationMenuIndicator({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator> & {
  css?: Interpolation<Theme>;
}) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      css={[navigationMenuIndicatorStyles, cssProp]}
      className={className}
      {...props}
    >
      <div css={navigationMenuIndicatorInnerStyles} />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
