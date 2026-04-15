"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FormInput from "@/components/register/form/FormInput";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: any;
  mode?: "create" | "edit";
  initialData?: any;
  onSuccess?: () => void;
};
export default function VariationModal({
  open,
  onOpenChange,
  item,
  mode = "create",
  initialData,
  onSuccess,
}: Props) {
  const { token } = useAuth();
  const { post, patch, loading } = useApi(token);

  const [form, setForm] = useState({
    name: "",
    price: "",
    sku: "",
    sortOrder: 0,
    isDefault: false,
    isActive: true,
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setForm({
          name: initialData?.name || "",
          price: String(initialData?.price ?? ""),
          sku: initialData?.sku || "",
          sortOrder: Number(initialData?.sortOrder ?? 0),
          isDefault: !!initialData?.isDefault,
          isActive:
            initialData?.isActive === false ? false : true,
        });
      } else {
        setForm({
          name: "",
          price: "",
          sku: "",
          sortOrder: 0,
          isDefault: false,
          isActive: true,
        });
      }
    }
  }, [open, mode, initialData]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || form.price === "") {
      toast.error("Name and price are required");
      return;
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
      isDefault: form.isDefault,
      isActive: form.isActive,
    };

    let res: any;

    if (mode === "edit") {
      res = await patch(
        `/v1/menu/variations/${initialData?.id}`,
        payload
      );
    } else {
      res = await post("/v1/menu/variations", {
        menuItemId: item?.id,
        ...payload,
      });
    }

    if (!res) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    if (res.error) {
      toast.error(
        res.error ||
          (mode === "edit"
            ? "Failed to update variation"
            : "Failed to add variation")
      );
      return;
    }

    if (res.success === false) {
      toast.error(res.message || "Request failed");
      return;
    }

    toast.success(
      mode === "edit"
        ? "Variation updated successfully"
        : "Variation added successfully"
    );
onSuccess?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] bg-[#F5F5F5] p-6 max-h-[95vh] overflow-auto">
        {/* HEADER */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-2xl font-semibold">
            {mode === "edit"
              ? "Edit Variation"
              : "Add Variation"}
          </DialogTitle>

          <p className="text-sm text-gray-500">
            {mode === "edit"
              ? "Update pricing variation details"
              : "Add pricing variation for this menu item"}
          </p>
        </DialogHeader>

        {/* FORM */}
        <div className="mt-5 space-y-4 rounded-[16px] bg-white p-5">
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
            onChange={(v) =>
              handleChange("sortOrder", Number(v))
            }
            type="number"
          />

          {/* CHECKBOXES */}
          <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  handleChange(
                    "isDefault",
                    e.target.checked
                  )
                }
                className="accent-primary"
              />
              Default
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  handleChange(
                    "isActive",
                    e.target.checked
                  )
                }
                className="accent-primary"
              />
              Active
            </label>
          </div>

          {/* BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 w-full rounded-[10px] bg-primary py-4 hover:bg-primary/90"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2
                  className="animate-spin"
                  size={18}
                />
                {mode === "edit"
                  ? "Updating..."
                  : "Saving..."}
              </span>
            ) : mode === "edit" ? (
              "Update Variation"
            ) : (
              "Save Variation"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}