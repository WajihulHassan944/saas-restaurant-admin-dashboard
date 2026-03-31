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

/* ✅ TYPES */
interface ModifierGroupForm {
  name: string;
  description: string;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  sortOrder: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
  refresh: () => void;
}

export default function ModifierGroupModal({
  open,
  onOpenChange,
  initialData,
  refresh,
}: Props) {
  const { user, token } = useAuth();
  const api = useApi(token);

  const [form, setForm] = useState<ModifierGroupForm>({
    name: "",
    description: "",
    minSelect: 0,
    maxSelect: 1,
    isRequired: false,
    sortOrder: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        description: "",
        minSelect: 0,
        maxSelect: 1,
        isRequired: false,
        sortOrder: 0,
      });
    }
  }, [initialData]);

  /* ✅ FIXED TYPING */
  const handleChange = <K extends keyof ModifierGroupForm>(
    key: K,
    value: ModifierGroupForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const handleSubmit = async () => {
  if (!form.name) {
    toast.error("Name required");
    return;
  }

  // ✅ Only send allowed fields
  const payload = {
    name: form.name,
    description: form.description,
    minSelect: form.minSelect,
    maxSelect: form.maxSelect,
    isRequired: form.isRequired,
    sortOrder: form.sortOrder,
  };

  let res;

  if (initialData?.id) {
    res = await api.patch(
      `/v1/menu/modifier-groups/${initialData.id}`,
      payload
    );
  } else {
    res = await api.post(`/v1/menu/modifier-groups`, {
      ...payload,
      restaurantId: user?.restaurantId, // ✅ only for create
    });
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
            {initialData ? "Edit" : "Add"} Modifier Group
          </DialogTitle>

          <p className="text-sm text-gray-500">
            Configure selection rules for this group
          </p>
        </DialogHeader>

        {/* FORM */}
        <div className="mt-5 bg-white rounded-[16px] p-5 space-y-4">

          <InputField
            label="Group Name"
            value={form.name}
            onChange={(v: string) => handleChange("name", v)}
          />

          <InputField
            label="Description"
            value={form.description}
            onChange={(v: string) => handleChange("description", v)}
          />

          <InputField
            label="Min Select"
            type="number"
            value={form.minSelect}
            onChange={(v: string) =>
              handleChange("minSelect", Number(v))
            }
          />

          <InputField
            label="Max Select"
            type="number"
            value={form.maxSelect}
            onChange={(v: string) =>
              handleChange("maxSelect", Number(v))
            }
          />

          <InputField
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(v: string) =>
              handleChange("sortOrder", Number(v))
            }
          />

          {/* CHECKBOX */}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.isRequired}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("isRequired", e.target.checked)
              }
              className="accent-primary"
            />
            Required
          </label>

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
              "Update Modifier Group"
            ) : (
              "Create Modifier Group"
            )}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ✅ TYPED INPUT FIELD */
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full h-[40px] rounded-[10px] border border-gray-300 px-3 focus:border-gray-400 outline-none"
      />
    </div>
  );
}