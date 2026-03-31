"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";

interface ModifierForm {
  modifierGroupId: string;
  name: string;
  priceDelta: number;
  sortOrder: number;
}

export default function ModifierModal({
  open,
  onOpenChange,
  initialData,
  refresh,
}: any) {
  const { user, token } = useAuth();
  const api = useApi(token);

  const [groups, setGroups] = useState<any[]>([]);

  const [form, setForm] = useState<ModifierForm>({
    modifierGroupId: "",
    name: "",
    priceDelta: 0,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchGroups();

    if (initialData) {
      setForm({
        modifierGroupId: initialData.modifierGroupId,
        name: initialData.name,
        priceDelta: Number(initialData.priceDelta),
        sortOrder: initialData.sortOrder,
      });
    } else {
      setForm({
        modifierGroupId: "",
        name: "",
        priceDelta: 0,
        sortOrder: 0,
      });
    }
  }, [initialData]);

  const fetchGroups = async () => {
    const res = await api.get(
      `/v1/menu/modifier-groups?restaurantId=${user?.restaurantId}`
    );

    if (!res?.error) {
      setGroups(res.data || []);
    }
  };

  const handleChange = (key: keyof ModifierForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const handleSubmit = async () => {
  if (!form.name || !form.modifierGroupId) {
    toast.error("Required fields missing");
    return;
  }

  let res;

  if (initialData?.id) {
    // ❌ REMOVE modifierGroupId for PATCH
    const payload = {
      name: form.name,
      priceDelta: Number(form.priceDelta),
      sortOrder: form.sortOrder,
    };

    res = await api.patch(
      `/v1/menu/modifiers/${initialData.id}`,
      payload
    );
  } else {
    // ✅ KEEP modifierGroupId for CREATE
    const payload = {
      modifierGroupId: form.modifierGroupId,
      name: form.name,
      priceDelta: Number(form.priceDelta),
      sortOrder: form.sortOrder,
    };

    res = await api.post(`/v1/menu/modifiers`, payload);
  }

  if (res?.error) {
    toast.error(res.error);
    return;
  }

  toast.success(initialData ? "Updated" : "Created");

  refresh();
  onOpenChange(false);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 bg-[#F5F5F5]">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit" : "Add"} Modifier
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure this modifier details
          </p>
        </DialogHeader>

        {/* FORM CARD */}
        <div className="mt-5 bg-white rounded-[16px] p-5 space-y-4">

          {/* GROUP */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Modifier Group</p>
            <select
              value={form.modifierGroupId}
              disabled={!!initialData}
              onChange={(e) =>
                handleChange("modifierGroupId", e.target.value)
              }
              className="w-full h-[40px] rounded-[10px] border border-gray-300 px-3 focus:border-gray-400 outline-none bg-white"
            >
              <option value="">Select Group</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* NAME */}
          <InputField
            label="Modifier Name"
            value={form.name}
            onChange={(v: string) => handleChange("name", v)}
          />

          {/* PRICE */}
          <InputField
            label="Price Delta"
            type="number"
            value={form.priceDelta}
            onChange={(v: string) =>
              handleChange("priceDelta", Number(v))
            }
          />

          {/* SORT */}
          <InputField
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(v: string) =>
              handleChange("sortOrder", Number(v))
            }
          />

          {/* BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={api.loading}
            className="w-full rounded-[10px] mt-2 py-4 bg-primary"
          >
            {api.loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </span>
            ) : initialData ? (
              "Update Modifier"
            ) : (
              "Create Modifier"
            )}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ✅ INPUT FIELD (UNCHANGED DESIGN STYLE) */
interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[40px] rounded-[10px] border border-gray-300 px-3 focus:border-gray-400 outline-none"
      />
    </div>
  );
}