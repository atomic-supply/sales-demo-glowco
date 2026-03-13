/** @jsxImportSource @emotion/react */
"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { css, type Interpolation } from "@emotion/react";
import { type Theme } from "../../styles";

const avatarRootStyles = css`
  position: relative;
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
`;

function Avatar({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { css?: Interpolation<Theme> }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      css={[avatarRootStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const avatarImageStyles = css`
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
`;

function AvatarImage({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & { css?: Interpolation<Theme> }) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      css={[avatarImageStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

const avatarFallbackStyles = css`
  background-color: oklch(0.97 0 0);
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
`;

function AvatarFallback({
  className,
  css: cssProp,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { css?: Interpolation<Theme> }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      css={[avatarFallbackStyles, cssProp]}
      className={className}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
