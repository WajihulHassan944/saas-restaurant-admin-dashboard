"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/register/form/FormInput";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
};

export default function VariationModal({
  open,
  onOpenChange,
  item,
}: Props) {
  const { token } = useAuth();
  const { post, loading } = useApi(token);

  const [form, setForm] = useState({
    name: "",
    price: "",
    sku: "",
    sortOrder: 0,
    isDefault: false,
    isActive: true,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

const handleSubmit = async () => {
  if (!form.name || !form.price) {
    toast.error("Name and price are required");
    return;
  }

  const payload = {
    menuItemId: item.id,
    name: form.name,
    price: Number(form.price),
    sku: form.sku,
    sortOrder: Number(form.sortOrder),
    isDefault: form.isDefault,
    isActive: form.isActive,
  };

  const res = await post("/v1/menu/variations", payload);

  // ❌ CASE 1: no response (token missing etc.)
  if (!res) {
    toast.error("Something went wrong. Please try again.");
    return;
  }

  // ❌ CASE 2: API returned error
  if (res.error) {
    toast.error(res.error || "Failed to add variation");
    return;
  }

  // ❌ CASE 3: API responded but no success flag (optional safety)
  if (!res.success) {
    toast.error(res.message || "Request failed");
    return;
  }

  // ✅ SUCCESS
  toast.success("Variation added");

  onOpenChange(false);

  // optional: better than reload (but keeping your behavior)
  window.location.reload();
};
  
  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5] max-h-[95vh] overflow-auto">

      {/* ================= HEADER ================= */}

      <DialogHeader className="space-y-1">
        <DialogTitle className="text-2xl font-semibold">
          Add Variation
        </DialogTitle>

        <p className="text-sm text-gray-500">
          Add pricing variation for this menu item
        </p>
      </DialogHeader>

      {/* ================= FORM ================= */}

      <div className="mt-5 rounded-[16px] bg-white p-5 space-y-4">

        <FormInput
          label="Variation Name"
          placeholder="e.g Large, Medium"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
          required
        />

        <FormInput
          label="Price"
          placeholder="Enter price"
          value={form.price}
          onChange={(v) => handleChange("price", v)}
          type="number"
          required
        />

        <FormInput
          label="SKU (Optional)"
          placeholder="Unique SKU"
          value={form.sku}
          onChange={(v) => handleChange("sku", v)}
        />

        <FormInput
          label="Sort Order"
          placeholder="0"
          value={String(form.sortOrder)}
          onChange={(v) => handleChange("sortOrder", Number(v))}
          type="number"
        />

        {/* CHECKBOXES */}

        <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                handleChange("isDefault", e.target.checked)
              }
              className="accent-primary"
            />
            Default
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                handleChange("isActive", e.target.checked)
              }
              className="accent-primary"
            />
            Active
          </label>
        </div>

        {/* SAVE BUTTON */}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-[10px] mt-2 py-4 bg-primary hover:bg-primary/90"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </span>
          ) : (
            "Save Variation"
          )}
        </Button>

      </div>
    </DialogContent>
  </Dialog>
);
}