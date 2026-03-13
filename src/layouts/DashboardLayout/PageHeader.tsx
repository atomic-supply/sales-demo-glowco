/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { memo, type ReactNode } from "react"
import { theme } from "../../styles/theme/theme"

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export const PageHeader = memo<PageHeaderProps>(({ title, description, actions }) => (
  <div
    css={css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem;
      flex-shrink: 0;
      background: ${theme.colors.background};
    `}
  >
    <div css={css`min-width: 0; flex: 1;`}>
      <h1
        css={css`
          font-size: 1.125rem;
          font-weight: 600;
          color: ${theme.colors.foreground};
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        `}
      >
        {title}
      </h1>
      {description && (
        <p
          css={css`
            font-size: 0.8125rem;
            color: ${theme.colors.mutedForeground};
            margin: 0.125rem 0 0;
          `}
        >
          {description}
        </p>
      )}
    </div>
    {actions && (
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        `}
      >
        {actions}
      </div>
    )}
  </div>
))

PageHeader.displayName = "PageHeader"
