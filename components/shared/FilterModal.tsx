"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Importing the custom radio button
import CustomRadioButton from "@/components/ui/CustomRadioButton";

type FilterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FilterModal({ open, onOpenChange }: FilterModalProps) {
  const [status, setStatus] = useState("inactive");
  const [sortBy, setSortBy] = useState("updated");
  const [defaultMenu, setDefaultMenu] = useState(true);

  const handleReset = () => {
    setStatus("all");
    setSortBy("default");
    setDefaultMenu(false);
  };

  const handleApply = () => {
    // send filters to parent here
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filter</DialogTitle>
          <p className="text-sm text-gray-500">Filter by Status, Branch, and other fields</p>
        </DialogHeader>

        {/* BODY */}
        <div className="mt-4 rounded-[14px] bg-white p-4 space-y-6">
          {/* STATUS */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Status</Label>
            <div className="flex gap-6">
              <CustomRadioButton
                value="all"
                label="All"
                active={status === "all"}
                onClick={setStatus} // Set status on click
              />
              <CustomRadioButton
                value="active"
                label="Active"
                active={status === "active"}
                onClick={setStatus} // Set status on click
              />
              <CustomRadioButton
                value="inactive"
                label="Inactive"
                active={status === "inactive"}
                onClick={setStatus} // Set status on click
              />
            </div>
          </div>

          {/* CREATION DATE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Creation Date</Label>
            <Input
              placeholder="eg. jhon doe"
              className="border-gray/40 focus:outline-primary focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* MODIFIED DATE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Modified Date</Label>
            <Input
              placeholder="eg. jhon doe"
              className="border-gray/40 focus:outline-primary focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* MENU */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Menu</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={defaultMenu}
                onCheckedChange={(v) => setDefaultMenu(!!v)}
              />
              <span className="text-sm">Default Menu</span>
            </div>
          </div>

          {/* SORT BY */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="space-y-3">
              <CustomRadioButton
                value="default"
                label="Default (Newest to Oldest)"
                active={sortBy === "default"}
                onClick={setSortBy} // Set sort option on click
              />
              <CustomRadioButton
                value="oldest"
                label="Oldest to Newest"
                active={sortBy === "oldest"}
                onClick={setSortBy} // Set sort option on click
              />
              <CustomRadioButton
                value="updated"
                label="Last Updated"
                active={sortBy === "updated"}
                onClick={setSortBy} // Set sort option on click
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={handleReset}
            className="text-sm font-medium text-gray-600 hover:text-black"
          >
            Reset
          </button>

          <Button
            onClick={handleApply}
            className="px-8 py-2 rounded-[10px] bg-primary hover:bg-red-700"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
