"use client";

import { ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

export default function PosCart() {
  return (
    <div className="w-full bg-white rounded-xl border p-4 flex flex-col gap-4">
      {/* ================= CART LIST ================= */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          className="
            flex items-center justify-between w-full text-sm font-medium
            [&[data-state=open]>svg]:rotate-180
            [&[data-state=open]>svg]:text-primary
          "
        >
          Cart List
          <ChevronDown
            size={18}
            className="transition-all duration-200 text-gray-500"
          />
        </CollapsibleTrigger>

        {/* Separator BELOW title */}
        <Separator className="my-3" />

        <CollapsibleContent>
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="size-14 rounded-full bg-red-50 flex items-center justify-center">
              <ShoppingCart className="text-primary" />
            </div>
            <p className="text-sm text-gray-400">No item added yet</p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* ================= ORDER INFORMATION ================= */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          className="
            flex items-center justify-between w-full text-sm font-medium
            [&[data-state=open]>svg]:rotate-180
            [&[data-state=open]>svg]:text-primary
          "
        >
          Order Information
          <ChevronDown
            size={18}
            className="transition-all duration-200 text-gray-500"
          />
        </CollapsibleTrigger>

        {/* Separator BELOW title */}
        <Separator className="my-3" />

        <CollapsibleContent className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-2">Order Type</p>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  defaultChecked
                  className="data-[state=checked]:bg-primary"
                />
                Takeaway
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-500">
                <Checkbox />
                Delivery
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-500">
                <Checkbox />
                Dine-in
              </label>
            </div>
          </div>

          <div className="text-sm text-gray-500">Token No : -</div>
        </CollapsibleContent>
      </Collapsible>

      {/* ================= BILLING ================= */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger
          className="
            flex items-center justify-between w-full text-sm font-medium
            [&[data-state=open]>svg]:rotate-180
            [&[data-state=open]>svg]:text-primary
          "
        >
          Billing
          <ChevronDown
            size={18}
            className="transition-all duration-200 text-gray-500"
          />
        </CollapsibleTrigger>

        {/* Separator BELOW title */}
        <Separator className="my-3" />

        <CollapsibleContent className="space-y-3 text-sm">
          {[
            "Subtotal",
            "Food Discount",
            "Happy Hour Discount",
            "Extra Discount($)",
            "Coupon Discount",
            "Vat/Tax (Excluded)",
          ].map((label) => (
            <div key={label} className="flex justify-between text-gray-500">
              <span>{label}</span>
              <span>$0</span>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between font-semibold text-gray-700">
            <span>Total</span>
            <span>N/A</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* ================= ACTIONS ================= */}
      <div className="flex gap-3 mt-2 w-full">
        <Button variant="outline" className="flex-1 rounded-lg text-sm">
          Clear Cart
        </Button>

        <Button variant="outline" className="flex-1 rounded-lg text-sm">
          Hold Order
        </Button>
      </div>

      {/* ================= PLACE ORDER ================= */}
      <Button className="w-full bg-primary text-white rounded-lg h-11 mt-1 hover:bg-primary/90">
        Place Order
      </Button>
    </div>
  );
}
