"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ActionButtons from "@/utils/action-buttons";

export default function BranchList() {
  return (
    <div className="space-y-[32px]">
      <h3 className="text-lg font-semibold text-dark">List of Branches</h3>

      {/* Main Container: Stacked on mobile (col), Row on desktop (md) */}
      <div className="w-full border border-gray-100 rounded-[14px] p-[20px] md:p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm bg-white">
        
        <div className="flex items-start md:items-center gap-[16px] md:gap-[24px]">
          {/* Checkbox: prevent shrinking on mobile */}
          <Checkbox
            className="w-[20px] h-[20px] data-[state=checked]:bg-primary border-gray-300 shrink-0 mt-1 md:mt-0"
            defaultChecked
          />
          
          {/* Icon: hidden or smaller on very small screens if needed, shrink-0 to keep shape */}
          <div className="text-gray shrink-0 mt-1 md:mt-0">
            <Store size={22} />
          </div>

          <div className="space-y-[8px] md:space-y-[12px]">
            <div className="flex flex-wrap items-center gap-[8px] md:gap-[12px]">
              <h4 className="text-xl md:text-2xl font-semibold text-dark">Default Branch</h4>
              <div className="size-2 rounded-full bg-green hidden sm:block" />
              <Badge
                className="bg-green/10 text-green hover:bg-green/10 border-none px-2 h-[28px] md:h-[32px] text-sm md:text-base font-semibold whitespace-nowrap"
              >
                Default Branch
              </Badge>
            </div>
            <p className="text-sm text-gray">ID: #10001 | 1 Items</p>
          </div>
        </div>

        {/* Action Buttons: Full width on mobile, auto on desktop */}
        <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 flex justify-end">
          <ActionButtons type="branch" />
        </div>
      </div>
    </div>
  );
}