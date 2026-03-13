import { ShoppingCart } from "lucide-react";
// import { BarChart3, Bug, History } from 'lucide-react' // Commented out - menu items disabled

import type { NavigationItem } from "./types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "buyer-ops",
    icon: ShoppingCart,
    label: "Buyer Operations",
    description: "Manage suppliers & exceptions",
    href: "/",
  },
  // {
  //   id: "orders",
  //   icon: History,
  //   label: "Order History",
  //   description: "Historical order data",
  //   href: "/orders"
  // },
  // {
  //   id: "kpis",
  //   icon: BarChart3,
  //   label: "KPIs & Analytics",
  //   description: "Performance metrics",
  //   href: "/kpis"
  // }
];

export const PAGE_CONFIG: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Buyer Operations",
    description:
      "Internal dashboard for managing supplier exceptions, order proposals, and supply validation",
  },
  // "/orders": {
  //   title: "Order History",
  //   description: "Historical order data with advanced filtering and analysis capabilities"
  // },
  // "/kpis": {
  //   title: "KPIs & Analytics",
  //   description: "Performance metrics, analytics, and key performance indicators"
  // }
};

export const DEFAULT_PAGE_TITLE = "Buyer Operations";
export const DEFAULT_PAGE_DESCRIPTION =
  "Internal dashboard for managing supplier exceptions, order proposals, and supply validation";

export const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};
