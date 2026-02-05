"use client";

import { Search, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FilterModal from "../shared/FilterModal";
import { Input } from "../ui/input";

export default function BranchFilters() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-white  rounded-lg">
<div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">

        {/* Search Area (MAIN FLEX ITEM) */}
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={22}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            type="text"
            placeholder="Search by name"
            className="
              w-full h-[44px]
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

          {/* Search Button */}
          <Button
            className="
              absolute right-0 top-1/1 -translate-y-1/1
              h-[44px]
              px-10
              rounded-[14px]
              bg-primary
              text-white
              text-[16px]

              font-[600]
              hover:bg-primary/90
            "
          >
            Search
          </Button>
        </div>

        {/* Export Button (fixed width) */}
        <Button
          variant="outline"
          className="h-[44px] px-5 rounded-[14px] border-[#E5E7EB] flex items-center gap-2 shrink-0 text-[#767676] text-[15px] font-[600]"
        >
          <Download size={18} color="#767676" />
          Export
        </Button>
<Button onClick={() => setOpen(true)} variant="outline" className="h-[44px] px-5 rounded-[14px] border-[#E5E7EB] text-[#767676] flex items-center gap-2 text-[15px] font-[600]" > <SlidersHorizontal size={18} color="#767676" /> Filter </Button>

      </div>
<FilterModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
