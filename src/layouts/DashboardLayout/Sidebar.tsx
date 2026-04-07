/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC } from "react"
import {
  HardDrive,
  Atom,
  User,
  LayoutDashboard,
  BarChart3,
  PieChart,
  CheckCircle,
  Truck,
  Factory,
  Package,
  Layers,
  GitBranch,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router"
import { theme } from "../../styles/theme/theme"
import { borders } from "../../styles"
import { useNucleus } from "../../contexts/NucleusContext"

const NUCLEUS_COLOR = theme.colors.nucleus
const BRAND_COLOR = theme.colors.blue600

type Icon = FC<{ size?: number }>

interface NavLink {
  type: "link"
  href: string
  name: string
  icon: Icon
  isNucleus?: boolean
}

interface NavHeader {
  type: "header"
  name: string
}

type SidebarItem = NavLink | NavHeader

const sidebarItems: SidebarItem[] = [
  { type: "header", name: "Overview" },
  { type: "link", href: "/data-hub", name: "Data Hub", icon: HardDrive as Icon },
  { type: "link", href: "/plan-status", name: "Plan Status", icon: LayoutDashboard as Icon },
  { type: "header", name: "Demand" },
  { type: "link", href: "/consumption/plan", name: "Consumption Plan", icon: BarChart3 as Icon },
  { type: "link", href: "/consumption/pivot", name: "Pivot", icon: PieChart as Icon },
  { type: "link", href: "/consumption/validation", name: "Validation", icon: CheckCircle as Icon },
  { type: "header", name: "Supply" },
  { type: "link", href: "/plan/shipments", name: "Shipments", icon: Truck as Icon },
  { type: "link", href: "/plan/production", name: "Production", icon: Factory as Icon },
  { type: "link", href: "/plan/kitting", name: "Kitting", icon: Package as Icon },
  { type: "link", href: "/plan/mrp", name: "MRP", icon: Layers as Icon },
  { type: "link", href: "/plan/allocation", name: "Allocation", icon: GitBranch as Icon },
  { type: "header", name: "AI Assistant" },
  { type: "link", href: "#nucleus", name: "Nucleus", icon: Atom as Icon, isNucleus: true },
]

const { colors } = theme

const s = {
  container: css`
    width: 148px;
    height: 100%;
    display: flex;
    flex-direction: column;
    ${borders.right}
    background-color: ${colors.background};
    position: fixed;
    z-index: 10;
  `,
  logoBar: css`
    display: flex;
    align-items: center;
    justify-content: center;
    ${borders.bottom}
    padding: 0 0.75rem;
    height: 3rem;
    box-sizing: border-box;
    flex-shrink: 0;
  `,
  logoImg: css`
    height: 1.75rem;
    object-fit: contain;
  `,
  nav: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0;
    overflow-y: auto;
    padding: 0.5rem;
  `,
  bottomSection: css`
    flex-shrink: 0;
    padding: 0.5rem;
  `,
  profileBtn: css`
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.3rem;
    padding: 0.25rem 0.5rem;
    text-align: left;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    border: none;
    outline: none;
    transition: background-color 0.15s, color 0.15s;
    background-color: transparent;
    color: ${colors.mutedForeground};
    &:hover {
      color: ${BRAND_COLOR};
    }
  `,
  header: css`
    padding: 0.25rem 0.5rem;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${colors.mutedForeground};
    opacity: 0.6;
    margin-top: 0.625rem;
    &:first-of-type {
      margin-top: 0;
    }
  `,
  navBtn: (active: boolean, nucleus = false) => css`
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.3rem;
    padding: 0.25rem 0.5rem;
    text-align: left;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    border: none;
    outline: none;
    transition: background-color 0.15s, color 0.15s;
    background-color: transparent;
    color: ${active
      ? nucleus
        ? NUCLEUS_COLOR
        : BRAND_COLOR
      : colors.mutedForeground
    };
    &:hover {
      color: ${nucleus ? NUCLEUS_COLOR : BRAND_COLOR};
    }
  `,
}

export const Sidebar: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const { isOpen: nucleusOpen, toggle: toggleNucleus } = useNucleus()

  const isActive = (href: string, isNucleus?: boolean) => {
    if (isNucleus) return nucleusOpen
    if (href.startsWith("/consumption")) return pathname.startsWith("/consumption") && pathname.startsWith(href)
    if (href.startsWith("/plan/")) return pathname === href
    return pathname === href
  }

  const handleClick = (item: NavLink) => {
    if (item.isNucleus) {
      toggleNucleus()
    } else {
      navigate(item.href)
    }
  }

  return (
    <aside css={s.container}>
      <div css={s.logoBar}>
        <img src="/atomic-logo-blue.png" alt="Atomic" css={s.logoImg} />
      </div>

      <nav css={s.nav}>
        {sidebarItems.map((item, i) => {
          if (item.type === "header") {
            return (
              <div key={item.name + i} css={s.header}>
                {item.name}
              </div>
            )
          }

          const active = isActive(item.href, item.isNucleus)
          const Icon = item.icon
          return (
            <button
              key={item.isNucleus ? "nucleus-toggle" : item.href}
              onClick={() => handleClick(item)}
              css={s.navBtn(active, item.isNucleus)}
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div css={s.bottomSection}>
        <button css={s.profileBtn} title="Profile">
          <User size={16} />
          <span>Sarah Mitchell</span>
        </button>
      </div>
    </aside>
  )
}
