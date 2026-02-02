"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdvanceSettings() {
  const orderTypes = ["Takeaway", "Delivery", "Dine-in"];
  return (
    <div className="space-y-8">
      {/* Order Type */}
      <div className="relative flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <Label className="text-[15px] mb-3 block font-medium">Order Type</Label>
          <div className="flex flex-wrap gap-6 text-sm">
            {orderTypes.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <Checkbox defaultChecked />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2">
          <Switch defaultChecked />
        </div>
      </div>

      {/* Specific Branch */}
      <div className="relative flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <Label className="text-[15px] mb-2 block font-medium">Specific Branch</Label>
          <Select defaultValue="all">
            <SelectTrigger className="h-13 rounded-md border-[#BBBBBB] text-sm focus:ring-1 focus:ring-primary">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="branch-1">Branch 1</SelectItem>
              <SelectItem value="branch-2">Branch 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 md:top-1 md:-translate-y-1">
          <Switch />
        </div>
      </div>
    </div>
  );
}
