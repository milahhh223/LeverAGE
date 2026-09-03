import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Bot, Wallet, Swords, Settings } from "lucide-react";

export interface NavItem {
  label: string;
  href: Route;
  icon: LucideIcon;
}

export const APP_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agents", href: "/agents", icon: Bot },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Arena", href: "/arena", icon: Swords },
  { label: "Settings", href: "/settings", icon: Settings },
];
