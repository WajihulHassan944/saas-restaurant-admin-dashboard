"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface CreateBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBranchModal({
  open,
  onOpenChange,
}: CreateBranchModalProps) {
  const [availability, setAvailability] = useState(true);

  const inputBase =
    "h-[44px] rounded-[10px] px-3 text-sm placeholder:text-gray-400 border-gray-300 focus-visible:ring-1 focus-visible:ring-primary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        {/* Header */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">
            Create Branch
          </DialogTitle>
          <p className="text-sm text-gray-500">Create Branch from here</p>
        </DialogHeader>

        {/* Card */}
        <div className="mt-4 rounded-[16px] bg-white p-5">
          <h4 className="text-sm font-medium text-gray-900">Branch info</h4>
          <p className="text-xs text-gray-500 mt-1">
            Specify your branch name & additional info
          </p>

          <div className="mt-5 space-y-4">
            {/* Branch Name */}
            <div className="space-y-1">
              <Label className="text-sm">
                Branch Name <span className="text-primary">*</span>
              </Label>
              <Input
                placeholder="eg. Food Kart"
                className={`${inputBase} border-primary bg-primary/5`}
              />
              <p className="text-xs text-primary">Branch name is required</p>
            </div>

            {/* Contact Person Name */}
            <div className="space-y-1">
              <Label className="text-sm">
                Contact Person Name <span className="text-primary">*</span>
              </Label>
              <Input
                placeholder="eg. jhon doe"
                className={inputBase}
              />
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <Label className="text-sm">Designation</Label>
              <Input
                placeholder="eg. branch manager"
                className={inputBase}
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label className="text-sm">
                Contact Person Phone Number <span className="text-primary">*</span>
              </Label>
              <Input
                placeholder="eg. 123 456 789"
                className={inputBase}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-sm">Contact Person Email</Label>
              <Input
                placeholder="eg. example@mail.com"
                className={inputBase}
              />
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between pt-2">
              <Label className="text-sm">Availability</Label>
              <Switch
                checked={availability}
                onCheckedChange={setAvailability}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-1">
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
