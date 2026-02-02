import {
    LayoutGrid, Store, Globe, Users, BarChart3, Box, Bell,
    Users2
} from 'lucide-react';
import { PiUsersThree } from "react-icons/pi";

export const menuItems: MenuItem[] = [
    { title: "Dashboard", icon: LayoutGrid, href: "/" },
    { title: "Manage Restaurants", icon: Store, href: "/branches" },
    { title: "Menu Management", icon: Globe, href: "/menu" },
    { title: "Order Management", icon: Users, href: "/orders" },
    { title: "POS Management", icon: BarChart3, href: "/pos" },
    { title: "Customer Management", icon: PiUsersThree, href: "/customer-settings" },
    { title: "Deliveryman", icon: Box, href: "/deliveryman" },
    { title: "Employees", icon: Users2, href: "/employees-settings" },
    { title: "Promotion Management", icon: Bell, href: "/promotion-management" },
    { title: "Reports & Payouts", icon: Bell, href: "/reports" },
    { title: "Auto-Printing / POS", icon: Bell, href: "/auto-printing" },
    { title: "Notification Settings", icon: Bell, href: "/notification-settings" },
   
    { title: "Profile", icon: Bell, href: "/profile" },
];