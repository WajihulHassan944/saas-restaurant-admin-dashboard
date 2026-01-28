"use client";

import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrdersFilters() {
  return (
    <div className="w-full bg-white p-4 lg:p-[20px] rounded-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
        {/* Search Area */}
        <div className="relative flex-1">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by name"
            className="
              w-full h-[49px]
              pl-12 pr-[150px]
              bg-transparent
              border border-gray-200
              rounded-[16px]
              text-lg text-dark
              placeholder:text-gray-400
              focus:outline-none
              focus:border-primary
            "
          />

          {/* Search Button */}
          <Button
            className="
              absolute right-0 top-1/1 -translate-y-1/1
              h-full
              px-8
              rounded-[14px]
              bg-primary
              text-white
              text-lg
              font-medium
              hover:bg-primary/90
            "
          >
            Search
          </Button>
        </div>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-[48px] px-6 rounded-[14px] text-red-600 border-red-200 bg-red-50 flex items-center gap-2"
            >
              All Status
              <ChevronDown size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Status</DropdownMenuItem>
            <DropdownMenuItem>Delivered</DropdownMenuItem>
            <DropdownMenuItem>Pending</DropdownMenuItem>
            <DropdownMenuItem>Cancelled</DropdownMenuItem>
            <DropdownMenuItem>Refunded</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-[48px] px-6 rounded-[14px] text-red-600 border-red-200 bg-red-50 flex items-center gap-2"
            >
              Today
              <ChevronDown size={18} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Today</DropdownMenuItem>
            <DropdownMenuItem>Yesterday</DropdownMenuItem>
            <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem>This Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
