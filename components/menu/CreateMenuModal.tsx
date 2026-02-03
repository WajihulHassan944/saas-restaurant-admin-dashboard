"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

import FormInput from "../register/form/FormInput";
import FormSelect from "../register/form/FormSelect";

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
  const [submitted, setSubmitted] = useState(false);

  /* ================= RESET ================= */
  const handleReset = () => {
    setMenuName("");
    setCategory("");
    setSubmitted(false);
  };

  /* ================= CREATE ================= */
  const handleCreate = () => {
    setSubmitted(true);

    if (!menuName || !category) return;

    // submit logic here

    onOpenChange(false);
    handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">

        {/* ================= HEADER ================= */}
      
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            Create Menu
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Manage your menu data from here
          </p>
        </DialogHeader>

        {/* ================= CARD ================= */}
        <div className="mt-5 rounded-[16px] bg-white p-5 space-y-4">

          {/* Menu Name */}
          <FormInput
            label="Menu Name"
            placeholder="eg. Food Kart"
            value={menuName}
            onChange={setMenuName}
            required
            error={submitted && !menuName}
            errorText="Menu name is required"
          />

          {/* Category */}
          <FormSelect
            label="Category"
            placeholder="Select category"
            options={["Food", "Beverages", "Desserts"]}
            value={category}
            onChange={setCategory}
          />

          {/* Add more */}
          <div className="flex justify-center">
            <button className="flex items-center gap-2 text-primary text-sm mt-2">
              <PlusCircle size={18} />
              Add More Categories
            </button>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            className="text-gray-700 text-[17px]"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            onClick={handleCreate}
            className="px-8 py-2 rounded-[10px] bg-primary hover:bg-primary/90 text-[17px]"
          >
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
