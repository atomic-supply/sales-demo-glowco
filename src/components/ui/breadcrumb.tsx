/** @jsxImportSource @emotion/react */
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

const breadcrumbListStyles = css`
  color: oklch(0.556 0 0);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  word-break: break-word;

  @media (min-width: 640px) {
    gap: 0.625rem;
  }
`;

function BreadcrumbList({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"ol"> & { css?: Interpolation<Theme> }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      css={[breadcrumbListStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const breadcrumbItemStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

function BreadcrumbItem({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"li"> & { css?: Interpolation<Theme> }) {
  return (
    <li
      data-slot="breadcrumb-item"
      css={[breadcrumbItemStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const breadcrumbLinkStyles = css`
  transition: color 0.2s;

  &:hover {
    color: oklch(0.145 0 0);
  }
`;

function BreadcrumbLink({
  asChild,
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  css?: Interpolation<Theme>;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      css={[breadcrumbLinkStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const breadcrumbPageStyles = css`
  color: oklch(0.145 0 0);
  font-weight: 400;
`;

function BreadcrumbPage({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"span"> & { css?: Interpolation<Theme> }) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      css={[breadcrumbPageStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const chevronIconStyles = css`
  width: 0.875rem;
  height: 0.875rem;
`;

const breadcrumbSeparatorStyles = css`
  & > svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

function BreadcrumbSeparator({
  children,
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"li"> & { css?: Interpolation<Theme> }) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      css={[breadcrumbSeparatorStyles, cssProp]}
      className={className}
      {...props}
    >
      {children ?? <ChevronRight css={chevronIconStyles} />}
    </li>
  );
}

const breadcrumbEllipsisStyles = css`
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
`;

const srOnlyStyles = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

function BreadcrumbEllipsis({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<"span"> & { css?: Interpolation<Theme> }) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      css={[breadcrumbEllipsisStyles, cssProp]}
      className={className}
      {...props}
    >
      <MoreHorizontal
        css={css`
          width: 1rem;
          height: 1rem;
        `}
      />
      <span css={srOnlyStyles}>More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
