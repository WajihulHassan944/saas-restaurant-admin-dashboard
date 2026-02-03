"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { menuItems, MenuItem } from "@/constants/sidebarItems";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  onLinkClick?: () => void;
}

const SidebarItem = ({ item, isActive, onLinkClick }: SidebarItemProps) => {
  const Icon = item.icon;
  const isDashboard = item.title === "Dashboard";

  return (
    <Link
      href={item.href}
      onClick={onLinkClick}
      className={`flex items-center gap-3 px-6 transition-colors mb-2.5 ${
        isDashboard ? "mb-5 mt-5" : ""
      }`}
    >
      <div
        className={`
          flex items-center justify-center size-10 rounded-xl shrink-0
          ${
            isDashboard
              ? "bg-primary text-white"
              : "bg-[#F9FAFB] text-primary"
          }
        `}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>

      <span
        className={`
          text-sm truncate
          ${
            isDashboard
              ? "text-black"
              : isActive
              ? "text-primary"
              : "text-gray hover:text-primary"
          }
        `}
      >
        {item.title}
      </span>
    </Link>
  );
};

export default function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
const router = useRouter();
  const mainItems = menuItems.filter((i) => i.section === "main");
  const accountItems = menuItems.filter((i) => i.section === "account");

  return (
    <aside className="flex flex-col w-72 bg-white h-full border-r overflow-y-auto">
      {/* MENU */}
      <nav className="flex flex-col px-0">
        {mainItems.map((item) => (
          <SidebarItem
            key={item.title}
            item={item}
            isActive={pathname === item.href}
            onLinkClick={onLinkClick}
          />
        ))}

        {/* ACCOUNT SETTINGS */}
        <div className="mt-5 px-6">
          <p className="text-xs font-semibold tracking-wide text-[#2D3748] uppercase">
            Account Settings
          </p>
        </div>

        <div className="mt-5">
          {accountItems.map((item) => (
            <SidebarItem
              key={item.title}
              item={item}
              isActive={pathname === item.href}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>

        {/* HELP CARD */}
        <div className="px-5 pb-5 mt-29">
          <div
            className="relative rounded-2xl px-4 pt-14 pb-4 text-white"
            style={{
              backgroundImage: "url('/href_background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* User Icon */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <Image
                src="/user_logo.png"
                alt="Support"
                width={90}
                height={90}
                className="drop-shadow-md"
              />
            </div>

            {/* Content */}
            <div className="text-left mb-4">
              <p className="text-base font-semibold">Need help?</p>
              <p className="text-sm opacity-90">Please check our docs</p>
            </div>

            {/* Button */}
            <Button
              size="sm"
              className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={() => router.push("/menu?create=true")}
            >
              ADD MENU
            </Button>
          </div>

          {/* LOGOUT */}
          <Button
            variant="ghost"
            className="mt-4 flex items-center gap-3 text-primary hover:bg-red-50 w-full justify-start"
            onClick={()=> router.push('/login')}
          >
            <div className="size-10 rounded-xl bg-[#F9FAFB] flex items-center justify-center" >
              <LogOut size={18} />
            </div>
            <span className="text-sm font-semibold">Logout</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
