import {
    LayoutGrid, Store, Globe, Users, BarChart3, Box,
    ShieldCheck, Gift, Receipt, LineChart, ShieldAlert,
    Database,Bell,Palette
} from 'lucide-react';
import { PiUsersThree } from "react-icons/pi";

export const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: LayoutGrid, href: "/" },
    { title: "Manage Restaurants", icon: Store, href: "/branches" },
    { title: "Global Settings", icon: Globe, href: "/global-settings" },
    { title: "Worldwide Customers", icon: Users, href: "/customers" },
    { title: "Orders & Revenue Performance", icon: BarChart3, href: "/orders" },
    { title: "Customer Management", icon: PiUsersThree, href: "/customer-settings" },
    { title: "Product Overview", icon: Box, href: "/products" },
    { title: "Roles & Access (RBAC)", icon: ShieldCheck, href: "/rbac" },
    { title: "Business Models", icon: Gift, href: "/models" },
    { title: "Invoicing & Financials", icon: Receipt, href: "/invoicing" },
    { title: "Reports & Analytics", icon: LineChart, href: "/analytics" },
    { title: "System Health & Monitoring", icon: ShieldAlert, href: "/monitoring" },
    { title: "Theme Setting", icon: Palette, href: "/theme-settings" },
    { title: "Notification Setting", icon: Bell, href: "/notification-settings" },
    // { title: "Backups & Maintenance", icon: Database, href: "/maintenance" },
];