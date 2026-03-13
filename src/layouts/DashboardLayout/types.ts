import type { LucideIcon } from "lucide-react"

export interface NavigationItem {
  id: string
  icon: LucideIcon
  label: string
  description: string
  href: string
}
