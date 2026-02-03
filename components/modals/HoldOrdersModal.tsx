"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BorderedSearchBar from "../shared/BorderedSearchBar";

export default function HoldOrdersModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] rounded-[28px] px-10 py-8 bg-[#F5F5F5]">
        {/* ================= HEADER ================= */}
        <div className="text-center space-y-2">
          <h2 className="text-[28px] font-semibold text-[#101828]">
            Hold Orders
          </h2>
          <p className="text-[16px] text-[#667085]">
            View your hold orders from here
          </p>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mt-6">
          <BorderedSearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </div>

        {/* ================= HOLD ORDER CARD ================= */}
          <div className="mt-6 bg-white rounded-2xl border-none p-9 space-y-4">
            {/* Row 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-[16px]  text-[#101828]">
                  Hold ID:{" "}
                 #11106
                </p>

                {/* Empty green dot as per design */}
                <span className="size-6 rounded-full bg-[#ECFDF3]" />
              </div>

              <span className="text-sm font-semibold text-primary">
                Dine-in
              </span>
            </div>

            {/* Row 2 */}
            <p className="text-sm text-[#667085]">
              Item: 1, Addons: 0
            </p>
          </div>
        

        {/* ================= ACTIONS ================= */}
        <div className="mt-8 flex items-center justify-center gap-8">
          <button className="text-[17.5px] font-semibold text-[#101828] hover:underline">
            Remove
          </button>

          <Button className="px-10 h-[44px] rounded-[14px] bg-primary text-white text-[16px] font-medium hover:bg-primary/90">
            Resume
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
