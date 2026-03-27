/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { type FC, useState, useCallback, useEffect } from "react"
import {
  Store,
  Truck,
  Settings,
  CheckCircle,
  HardDrive,
  Atom,
  BarChart3,
  Footprints,
  User,
  Package,
  ClipboardList,
  Inbox,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router"
import { terminology } from "../../data/app-config"
import { theme } from "../../styles/theme/theme"
import { borders } from "../../styles"

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

interface NavExpandable {
  type: "expandable"
  prefix: string // pathname prefix used to auto-expand
  name: string
  icon: Icon
  children: { href: string; name: string; icon: Icon }[]
}

interface NavHeader {
  type: "header"
  name: string
}

type SidebarItem = NavLink | NavExpandable | NavHeader

const sidebarItems: SidebarItem[] = [
  { type: "header", name: "Configuration" },
  { type: "link", href: "/data-hub", name: "Data Hub", icon: HardDrive as Icon },
  { type: "header", name: "Demand" },
  {
    type: "expandable",
    prefix: "/demand",
    name: terminology.modules.retailers,
    icon: Store as Icon,
    children: [
      { href: "/demand/forecast", name: terminology.plans.consumption, icon: Footprints as Icon },
      { href: "/demand/validation", name: "Validation", icon: CheckCircle as Icon },
    ],
  },
  {
    type: "expandable",
    prefix: "/shipments",
    name: terminology.modules.shipments,
    icon: Truck as Icon,
    children: [
      { href: "/shipments/walk", name: "Walk", icon: Footprints as Icon },
      { href: "/shipments/forecast", name: "Forecast", icon: BarChart3 as Icon },
      { href: "/shipments/validation", name: "Validation", icon: CheckCircle as Icon },
      { href: "/shipments/configuration", name: "Configuration", icon: Settings as Icon },
    ],
  },
  { type: "header", name: "Supply" },
  { type: "link", href: "/inventory-health", name: "Inventory Health", icon: ClipboardList as Icon },
  { type: "link", href: "/inventory-health-mrp", name: "Inventory Health - MRP", icon: Package as Icon },
  { type: "link", href: "/po-inbox", name: "PO Inbox", icon: Inbox as Icon },
  { type: "header", name: "AI Assistant" },
  { type: "link", href: "/nucleus", name: "Nucleus", icon: Atom as Icon, isNucleus: true },
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
  subList: css`
    margin-left: 2rem;
    margin-top: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-left: 0;
  `,
  subBtn: (active: boolean) => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.3rem;
    padding: 0.25rem 0;
    text-align: left;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    border: none;
    outline: none;
    width: 100%;
    white-space: nowrap;
    transition: background-color 0.15s, color 0.15s;
    background-color: transparent;
    color: ${active ? BRAND_COLOR : colors.mutedForeground};
    &:hover {
      color: ${BRAND_COLOR};
    }
  `,
}

export const Sidebar: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      sidebarItems.forEach((item) => {
        if (item.type === "expandable" && pathname.startsWith(item.prefix)) {
          next.delete(item.prefix)
        }
      })
      return next.size === prev.size ? prev : next
    })
  }, [pathname])

  const toggleSection = useCallback((prefix: string, firstChildHref: string) => {
    const isRouteMatch = pathname.startsWith(prefix)
    const isCurrentlyCollapsed = collapsed.has(prefix)

    if (isRouteMatch && !isCurrentlyCollapsed) {
      setCollapsed((prev) => new Set(prev).add(prefix))
    } else if (isRouteMatch && isCurrentlyCollapsed) {
      setCollapsed((prev) => {
        const next = new Set(prev)
        next.delete(prefix)
        return next
      })
    } else {
      navigate(firstChildHref)
    }
  }, [pathname, collapsed, navigate])

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

          if (item.type === "link") {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                css={s.navBtn(isActive, item.isNucleus)}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
            )
          }

          // expandable
          const isRouteMatch = pathname.startsWith(item.prefix)
          const isOpen = isRouteMatch && !collapsed.has(item.prefix)
          const Icon = item.icon
          return (
            <div key={item.prefix}>
              <button
                onClick={() => toggleSection(item.prefix, item.children[0].href)}
                css={s.navBtn(isRouteMatch)}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </button>
              {isOpen && (
                <div css={s.subList}>
                  {item.children.map((child) => {
                    const isActive = pathname === child.href
                    return (
                      <button
                        key={child.href}
                        onClick={() => navigate(child.href)}
                        css={s.subBtn(isActive)}
                      >
                        <span>{child.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div css={s.bottomSection}>
        <button css={s.profileBtn} title="Profile">
          <User size={16} />
          <span>Profile</span>
        </button>
      </div>
    </aside>
  )
}
