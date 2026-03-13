/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC } from "react"
import { Outlet } from "react-router"
import { RunsProvider } from "../../contexts/RunsContext"
import { theme } from "../../styles/theme/theme"
import { Sidebar } from "./Sidebar"
import { RunHeader } from "./RunHeader"

const layoutStyles = {
  root: css`
    height: 100vh;
    background-color: ${theme.colors.background};
    overflow: hidden;
  `,
  inner: css`
    display: flex;
    height: 100%;
  `,
  mainContent: css`
    flex: 1;
    margin-left: 148px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  `,
  pageContent: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  `,
}

const DashboardLayout: FC = () => {
  return (
    <RunsProvider>
      <div css={layoutStyles.root}>
        <div css={layoutStyles.inner}>
          <Sidebar />
          <div css={layoutStyles.mainContent}>
            <RunHeader />
            <div css={layoutStyles.pageContent}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </RunsProvider>
  )
}

export default DashboardLayout
