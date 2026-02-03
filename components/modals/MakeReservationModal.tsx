"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import FormInput from "../register/form/FormInput";
import FormSelect from "../register/form/FormSelect";
import { Radio } from "../ui/radioBtn";
import { Separator } from "../ui/separator";

export default function MakeReservationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [tableType, setTableType] = useState<"full" | "specific">("specific");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] rounded-[28px] px-10 py-8 bg-white max-h-[95vh] overflow-auto">
        {/* ================= HEADER ================= */}
        <div className="text-center space-y-2">
          <h2 className="text-[28px] font-semibold text-[#101828]">
            Make Reservation
          </h2>
          <p className="text-[16px] text-[#667085]">
            Create a new Reservation by filling necessary info from here
          </p>
        </div>

        {/* ================= RESERVATION INFO ================= */}
        <Collapsible defaultOpen className="mt-6">
          <CollapsibleTrigger
            className="
              flex items-center justify-between w-full text-[16px] font-medium
              [&[data-state=open]>svg]:rotate-180
            "
          >
            Reservation Information
            <ChevronDown className="transition-transform" />
          </CollapsibleTrigger>
         <Separator className="my-3" />
          <CollapsibleContent className="mt-4 space-y-4 px-[2px]">
            <FormInput label="Reservation Date *" placeholder="eg. jhon doe" />

            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Reservation Time *" placeholder="eg. jhon doe" />
              <FormInput label=" " placeholder="eg. jhon doe" />
            </div>

            <FormInput label="No. of Person *" placeholder="eg. 1" />

            <FormSelect
              placeholder="Select Floor"
              options={["Floor 1", "Floor 2", "Floor 3"]}
            />

            {/* Choose Table */}
            <div>
              <p className="mb-3 text-[16px]">
                Choose Table<span className="text-red-500">*</span>
              </p>

              <div className="flex gap-6">
                <div onClick={() => setTableType("full")}>
                  <Radio label="Full Floor" active={tableType === "full"} />
                </div>
                <div onClick={() => setTableType("specific")}>
                  <Radio
                    label="Specific Table"
                    active={tableType === "specific"}
                  />
                </div>
              </div>
            </div>

            <FormSelect
              placeholder="Select Table"
              options={["Table 1", "Table 2", "Table 3"]}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* ================= CUSTOMER INFO ================= */}
        <Collapsible className="mt-6">
          <CollapsibleTrigger
            className="
              flex items-center justify-between w-full text-[16px] font-medium
              [&[data-state=open]>svg]:rotate-180
            "
          >
            Customer Information
            <ChevronDown className="transition-transform" />
          </CollapsibleTrigger>
<Separator className="my-3" />
          <CollapsibleContent className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-[16px]">Customer</label>

              <div className="relative">
                <Input
                  value="Walk in Customer"
                  readOnly
                  className="border-[#BBBBBB] pr-10"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={16} />
                </button>
              </div>
            </div>

            <button className="text-primary text-sm font-medium">
              +Add Contact Person Info
            </button>
          </CollapsibleContent>
        </Collapsible>

        {/* ================= BILLING ================= */}
        <Collapsible className="mt-6">
          <CollapsibleTrigger
            className="
              flex items-center justify-between w-full text-[16px] font-medium
              [&[data-state=open]>svg]:rotate-180
            "
          >
            Billing
            <ChevronDown className="transition-transform" />
          </CollapsibleTrigger>
<Separator className="my-3" />
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="space-y-2 text-sm text-[#667085]">
              <div className="flex justify-between">
                <span>Advance Booking Fee</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (0%)</span>
                <span>$0</span>
              </div>
            </div>

            <div className="flex justify-between font-semibold text-[#101828]">
              <span>Total</span>
              <span>$0</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm">Payment Method</span>
              <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                Cash
              </span>
            </div>

            <div className="border rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span>Paid Amount</span>
                <span className="text-[#667085]">Enter Paid Amount</span>
              </div>
              <div className="flex justify-between">
                <span>Due</span>
                <span>$0</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* ================= ACTIONS ================= */}
        <div className="mt-8 flex justify-center gap-8">
          <button
            className="text-[18px] font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>

          <Button className="px-10 h-[44px] rounded-[14px] bg-primary text-white hover:bg-primary/90">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
