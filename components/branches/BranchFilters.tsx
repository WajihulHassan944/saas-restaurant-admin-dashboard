"use client";

import { Search, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BranchFilters() {
  return (
    <div className="w-full bg-white p-4 lg:p-[20px]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">

        {/* Search Area */}
        <div className="relative flex-1">
          <Search
            size={22}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by name"
            className="
              w-full h-[56px]
              pl-10 pr-[160px]
              bg-transparent
              border-0 border-b border-gray-200
              text-lg text-dark
              placeholder:text-gray-400
              focus:outline-none
              focus:border-primary
              focus:ring-0
              rounded-br-[14px]
            "
          />

          {/* Search Button (absolute) */}
          <Button
            className="
              absolute right-0 top-1/1 -translate-y-1/1
              h-[48px]
              px-10
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

        {/* Export Button */}
        <Button
          variant="outline"
          className="h-[48px] px-5 rounded-[14px] border-[#E5E7EB] text-gray-600 flex items-center gap-2"
        >
          <Download size={18} />
          Export
        </Button>

        {/* Filter Button */}
        <Button
          variant="outline"
          className="h-[48px] px-5 rounded-[14px] border-[#E5E7EB] text-gray-600 flex items-center gap-2"
        >
          <SlidersHorizontal size={18} />
          Filter
        </Button>
      </div>
    </div>
  );
}
