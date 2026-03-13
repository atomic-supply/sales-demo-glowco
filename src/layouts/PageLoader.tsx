/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { type FC } from "react";
import { theme } from "../styles/theme/theme";

const spin = keyframes`
  to { 
    transform: rotate(360deg); 
  }
`;

export const PageLoader: FC = () => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      min-height: 200px;
    `}
  >
    <div
      css={css`
        width: 32px;
        height: 32px;
        border: 3px solid ${theme.colors.gray200};
        border-top-color: ${theme.colors.blue500};
        border-radius: 50%;
        animation: ${spin} 1s linear infinite;
      `}
    />
  </div>
);
