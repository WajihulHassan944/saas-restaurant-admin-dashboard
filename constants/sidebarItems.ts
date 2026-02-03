import {
  LayoutGrid,
  Store,
  List,
  ShoppingBag,
  Monitor,
  Users,
  Truck,
  UserCog,
  Gift,
  User,
  Printer,
  BarChart3,
  Bell,
} from "lucide-react";
import { PiUsersThree } from "react-icons/pi";

export type SidebarSection = "main" | "account";

export interface MenuItem {
  title: string;
  href: string;
  icon: any;
  section: SidebarSection;
}

export const menuItems: MenuItem[] = [
  // MAIN
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutGrid,
    section: "main",
  },
  {
    title: "Restaurant Management",
    href: "/branches",
    icon: Store,
    section: "main",
  },
  {
    title: "Menu Management",
    href: "/menu",
    icon: List,
    section: "main",
  },
  {
    title: "Order Management",
    href: "/orders",
    icon: ShoppingBag,
    section: "main",
  },
  {
    title: "POS Management",
    href: "/pos",
    icon: Monitor,
    section: "main",
  },
  {
    title: "Customer Management",
    href: "/customer-settings",
    icon: PiUsersThree,
    section: "main",
  },
  {
    title: "Deliveryman",
    href: "/deliveryman",
    icon: Truck,
    section: "main",
  },
  {
    title: "Employees",
    href: "/employees-settings",
    icon: UserCog,
    section: "main",
  },
  {
    title: "Promotion Management",
    href: "/promotion-management",
    icon: Gift,
    section: "main",
  },

  // ACCOUNT SETTINGS
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    section: "account",
  },
  {
    title: "Auto-Printing / POS",
    href: "/auto-printing",
    icon: Printer,
    section: "account",
  },
  {
    title: "Reports & Payouts",
    href: "/reports",
    icon: BarChart3,
    section: "account",
  },
  {
    title: "Notification Settings",
    href: "/notification-settings",
    icon: Bell,
    section: "account",
  },
];
