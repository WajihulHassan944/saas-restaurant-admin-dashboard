"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface CreateMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateMenuModal({
  open,
  onOpenChange,
}: CreateMenuModalProps) {
  const [menuName, setMenuName] = useState("");
  const [category, setCategory] = useState("");

  const inputBase =
    "h-[44px] rounded-[10px] px-3 text-sm placeholder:text-gray-400 border-gray-300 focus-visible:ring-1 focus-visible:ring-primary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        {/* Header */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">Create Menu</DialogTitle>
          <p className="text-sm text-gray-500">Manage your menu data from here</p>
        </DialogHeader>

        {/* Card */}
        <div className="mt-4 rounded-[16px] bg-white p-5">
          <div className="mt-5 space-y-4">
            {/* Menu Name */}
            <div className="space-y-1">
              <Label className="text-sm">
                Menu Name <span className="text-primary">*</span>
              </Label>
              <Input
                placeholder="eg. Food Kart"
                className={`${inputBase} border-primary bg-primary/5`}
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
              <p className="text-xs text-primary">Menu name is required</p>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label className="text-sm">
                Category <span className="text-primary">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={`${inputBase} border-gray-300`}>
                  <SelectValue placeholder="eg. jhon doe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <div className="flex justify-center">
  <button
    className="
      flex items-center gap-2
      text-primary
      text-sm
      mt-4 mb-4
    "
  >
    <PlusCircle size={18} />
    Add More Categories
  </button>
</div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            className="text-gray-700 text-[17px]"
            onClick={() => onOpenChange(false)}
          >
            Reset
          </Button>

          <Button className="px-8 py-2 rounded-[10px] bg-primary hover:bg-primary/90 text-[17px]">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
