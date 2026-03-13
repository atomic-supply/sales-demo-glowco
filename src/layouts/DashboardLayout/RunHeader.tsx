/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC } from "react"
import { borders } from "../../styles"
import { theme } from "../../styles/theme/theme"

const headerStyles = {
  header: css`
    flex-shrink: 0;
    z-index: 20;
    background-color: ${theme.colors.background};
    ${borders.bottom}
    padding: 0 ${theme.spacing.md};
    height: ${theme.spacing["2xl"]};
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  updatedAt: css`
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.gray500};
  `,
}

export const RunHeader: FC = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header css={headerStyles.header}>
      <span css={headerStyles.updatedAt}>Updated on: {today}</span>
    </header>
  )
}

