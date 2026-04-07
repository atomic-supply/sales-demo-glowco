/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC } from "react"
import { Outlet } from "react-router"
import { RunsProvider } from "../../contexts/RunsContext"
import { NucleusProvider, useNucleus } from "../../contexts/NucleusContext"
import { theme } from "../../styles/theme/theme"
import { Sidebar } from "./Sidebar"
import { RunHeader } from "./RunHeader"
import { NucleusPanel } from "../../components/NucleusPanel"

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
  contentArea: css`
    flex: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;
  `,
  pageContent: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    min-width: 0;
    transition: flex 0.2s ease;
  `,
}

/** Inner layout that can access NucleusContext */
const DashboardInner: FC = () => {
  const { isOpen } = useNucleus()

  return (
    <div css={layoutStyles.root}>
      <div css={layoutStyles.inner}>
        <Sidebar />
        <div css={layoutStyles.mainContent}>
          <RunHeader />
          <div css={layoutStyles.contentArea}>
            <div css={layoutStyles.pageContent}>
              <Outlet />
            </div>
            {isOpen && <NucleusPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardLayout: FC = () => {
  return (
    <RunsProvider>
      <NucleusProvider>
        <DashboardInner />
      </NucleusProvider>
    </RunsProvider>
  )
}

export default DashboardLayout
