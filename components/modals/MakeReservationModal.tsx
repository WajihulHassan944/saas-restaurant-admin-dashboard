"use client";

import { useState } from "react";
import { ChevronDown, XCircle } from "lucide-react";

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
import PosModalHeader from "../pos/PosModalHeader";
import ModalActionFooter from "../pos/PosModalActionFooter";

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
      <DialogContent className="w-full sm:max-w-[618px] rounded-[28px] px-10 py-8 bg-white max-h-[95vh] overflow-auto">
        {/* ================= HEADER ================= */}
       <PosModalHeader
  title="Make Reservation"
  description="Create a new Reservation by filling necessary info from here"
/>

        {/* ================= RESERVATION INFO ================= */}
        <Collapsible defaultOpen className="mt-6">
          <CollapsibleTrigger
            className="
              flex items-center justify-between w-full text-[16px]  text-[#909090]
              [&[data-state=open]>svg]:rotate-180
            "
          >
            Reservation Information
            <ChevronDown className="transition-transform" />
          </CollapsibleTrigger>
         <Separator className="my-3" />
          <CollapsibleContent className="mt-4 space-y-4 px-1">
            <FormInput label="Reservation Date *" placeholder="eg. jhon doe" />

            <div className="space-y-2">
  <label className="text-[16px]">
    Reservation Time<span className="text-red-500">*</span>
  </label>

  <div className="grid grid-cols-2 gap-4 mt-2">
    <Input
      type="time"
      className="border-[#BBBBBB] focus:border-primary focus:ring-1 focus:ring-primary"
    />
    <Input
      type="time"
      className="border-[#BBBBBB] focus:border-primary focus:ring-1 focus:ring-primary"
    />
  </div>
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
              flex items-center justify-between w-full text-[16px] text-[#909090]
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
                  <XCircle size={20} />
                </button>
              </div>
            </div>

            <button className="text-primary text-sm font-medium  text-center w-full">
              +Add Contact Person Info
            </button>
          </CollapsibleContent>
        </Collapsible>

        {/* ================= BILLING ================= */}
        <Collapsible className="mt-6">
          <CollapsibleTrigger
            className="
              flex items-center justify-between w-full text-[16px] text-[#909090]
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
<Separator />
            <div className="flex justify-between font-semibold text-[#101828]">
              <span>Total</span>
              <span>$0</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm">Payment Method</span>
              <span className="px-3 py-1 rounded-full bg-[#00A63E] text-white text-sm">
                Cash
              </span>
            </div>

            <div className="border border-[#BBBBBB] rounded-xl p-4 space-y-2">
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
        <ModalActionFooter
  leftLabel="Cancel"
  rightLabel="Create"
  onLeftClick={() => onOpenChange(false)}
  onRightClick={() => {
    // submit reservation
  }}
/>

      </DialogContent>
    </Dialog>
  );
}
