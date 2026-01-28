"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { menuItems } from '@/constants/sidebarItems';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  item: MenuItem;
  isActive?: boolean;
  onLinkClick?: () => void;
}

const SidebarItem = ({
  item,
  isActive = false,
  onLinkClick
}: SidebarItemProps) => {
  const Icon = item.icon;
  const isDashboard = item.title === "Dashboard";

  return (
    <Link
      href={item.href}
      onClick={onLinkClick}
      className={`
        flex items-center gap-[12px] w-full transition-all pl-[23px] bg-transparent
        ${isDashboard ? "my-[20px]" : "my-[0]"}
      `}
    >
      <div className={`
        flex items-center justify-center size-10 shrink-0 rounded-xl transition-colors
        ${isDashboard ? "bg-primary text-white" : "bg-[#F9FAFB] text-primary"}
      `}>
        <Icon size={20} strokeWidth={isDashboard ? 2.5 : 2} />
      </div>

      <span className={`
        text-sm truncate transition-colors
        ${isDashboard ? "text-black" : (isActive ? "text-primary" : "text-gray hover:text-primary")}
      `}>
        {item.title}
      </span>
    </Link>
  );
};

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-72 bg-white h-full">

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
        <nav className="flex flex-col gap-[12px]">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              item={item}
              isActive={pathname === item.href}
              onLinkClick={onLinkClick}
            />
          ))}
        </nav>
      </div>

      <div className="px-[23px] py-6 sticky bottom-0 bg-white">
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-[12px] w-full h-auto p-0 text-primary hover:bg-red-50 hover:text-primary rounded-xl transition-all"
        >
          <div className="flex items-center justify-center size-10 bg-[#F9FAFB] rounded-xl text-primary">
            <LogOut size={20} />
          </div>
          <span className="font-semibold text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
}