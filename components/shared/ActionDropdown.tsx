"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface ActionDropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
}

export default function ActionDropdown({ items }: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-[40px] w-[44px] flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          <MoreVertical size={18} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {items.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link
              href={item.href}
              className="flex items-center gap-3 cursor-pointer"
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
