/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo } from "react";
import { Outlet } from "react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary";

// Memoized content wrapper to prevent rerenders when only header changes
export const PageContent = memo(() => {
  return (
    <div
      css={css`
        flex: 1;
        padding: 1.5rem;
        min-width: 0;
        overflow-y: auto;
        overflow-x: hidden;
      `}
    >
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
});

PageContent.displayName = "PageContent";
